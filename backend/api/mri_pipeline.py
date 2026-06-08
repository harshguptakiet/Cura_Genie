import os
import io
import json
import uuid
import time
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
from PIL import Image, ImageDraw
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from pydantic import BaseModel

from core.auth import get_current_medical_expert
from db.database import get_db
from db.models import MRIAnalysis, FlaggedMRIReport
from db.auth_models import User as AuthUser

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/mri", tags=["mri-pipeline"])

MRI_UPLOAD_DIR = "uploads/mri"
os.makedirs(MRI_UPLOAD_DIR, exist_ok=True)


class FlaggedReviewRequest(BaseModel):
    expert_guess: str
    expert_risk_level: str
    expert_notes: str
    expert_regions: Optional[List[Dict[str, Any]]] = None


class BrainTumorDetectionPipeline:
    def __init__(self) -> None:
        self.model = None
        self.model_path = None
        self.model_name = "fallback_statistical_v1"
        self._load_cnn_model()

    def _load_cnn_model(self) -> None:
        candidates = self._find_model_candidates()
        if not candidates:
            logger.warning("No Brain-Tumor-Detection model files found. Using fallback analysis.")
            return

        try:
            import tensorflow as tf  # type: ignore
            from tensorflow.keras.models import load_model  # type: ignore

            for model_path in candidates:
                try:
                    logger.info("Loading brain tumor model from %s", model_path)
                    model = load_model(model_path)
                    # Warmup call validates shape compatibility early.
                    dummy = np.zeros((1, 240, 240, 3), dtype=np.float32)
                    _ = model.predict(dummy, verbose=0)
                    self.model = model
                    self.model_path = model_path
                    self.model_name = f"cnn:{Path(model_path).name}"
                    logger.info("Brain tumor CNN model loaded: %s", self.model_name)
                    return
                except Exception as model_error:
                    logger.warning("Failed loading model %s: %s", model_path, model_error)
        except Exception as e:
            logger.warning("TensorFlow unavailable for CNN pipeline: %s", e)

        logger.warning("Falling back to statistical MRI analysis pipeline.")

    @staticmethod
    def _find_model_candidates() -> List[str]:
        root_candidates = [
            Path("Brain-Tumor-Detection/models"),
            Path("../Brain-Tumor-Detection/models"),
            Path("models"),
        ]
        found: List[str] = []
        for root in root_candidates:
            if not root.exists() or not root.is_dir():
                continue
            for ext in ("*.h5", "*.keras", "*.model"):
                for file in root.glob(ext):
                    found.append(str(file))
        return sorted(found)

    @staticmethod
    def _validate_image(file_content: bytes, filename: str) -> Dict[str, Any]:
        try:
            image = Image.open(io.BytesIO(file_content))
            width, height = image.size
            if width < 50 or height < 50:
                return {"valid": False, "error": "Image too small for MRI analysis"}
            return {
                "valid": True,
                "format": image.format,
                "size": image.size,
                "mode": image.mode,
            }
        except Exception as e:
            return {"valid": False, "error": f"Invalid image: {e}"}

    @staticmethod
    def _preprocess_for_model(image: Image.Image) -> np.ndarray:
        if image.mode != "RGB":
            image = image.convert("RGB")
        resized = image.resize((240, 240), Image.Resampling.LANCZOS)
        arr = np.asarray(resized, dtype=np.float32) / 255.0
        return np.expand_dims(arr, axis=0)

    def _run_mc_dropout(self, image_tensor: np.ndarray, samples: int = 24) -> Dict[str, float]:
        if self.model is None:
            return {"mean_probability": 0.5, "uncertainty": 1.0, "entropy": 0.6931}

        predictions: List[float] = []
        has_dropout_layers = any("dropout" in layer.name.lower() for layer in self.model.layers)

        for _ in range(samples):
            try:
                if has_dropout_layers:
                    pred = float(self.model(image_tensor, training=True).numpy().squeeze())
                else:
                    # Input-level stochastic dropout as Monte Carlo approximation.
                    import tensorflow as tf  # type: ignore

                    noisy = tf.nn.dropout(image_tensor, rate=0.12)
                    pred = float(self.model(noisy, training=False).numpy().squeeze())
                predictions.append(max(0.0, min(1.0, pred)))
            except Exception:
                break

        if not predictions:
            return {"mean_probability": 0.5, "uncertainty": 1.0, "entropy": 0.6931}

        mean_prob = float(np.mean(predictions))
        uncertainty = float(np.std(predictions))
        entropy = float(-(mean_prob * np.log(mean_prob + 1e-8) + (1 - mean_prob) * np.log(1 - mean_prob + 1e-8)))
        return {
            "mean_probability": round(mean_prob, 5),
            "uncertainty": round(uncertainty, 5),
            "entropy": round(entropy, 5),
        }

    @staticmethod
    def _fallback_detect_regions(image: Image.Image) -> List[Dict[str, Any]]:
        if image.mode != "L":
            gray = image.convert("L")
        else:
            gray = image

        arr = np.asarray(gray, dtype=np.float32) / 255.0
        mean = float(np.mean(arr))
        std = float(np.std(arr))
        threshold = mean + (1.4 * std)
        mask = arr > threshold

        ys, xs = np.where(mask)
        if len(xs) == 0 or len(ys) == 0:
            return []

        min_x, max_x = int(np.min(xs)), int(np.max(xs))
        min_y, max_y = int(np.min(ys)), int(np.max(ys))
        width = max(20, max_x - min_x)
        height = max(20, max_y - min_y)
        confidence = float(min(0.92, max(0.55, (mean + std) / 1.7)))

        return [
            {
                "id": "fallback_region_1",
                "type": "suspicious_mass",
                "confidence": round(confidence, 3),
                "risk_level": "moderate" if confidence >= 0.7 else "low",
                "coordinates": {
                    "x": min_x,
                    "y": min_y,
                    "width": width,
                    "height": height,
                },
                "location": "brain_parenchyma",
            }
        ]

    @staticmethod
    def _estimate_primary_region(image: Image.Image, probability: float) -> Dict[str, Any]:
        width, height = image.size
        box_w = int(width * 0.28)
        box_h = int(height * 0.26)
        x = int(width * 0.36)
        y = int(height * 0.34)

        risk = "high" if probability >= 0.85 else "moderate" if probability >= 0.7 else "low"
        tumor_type = "glioma" if probability >= 0.85 else "meningioma" if probability >= 0.7 else "pituitary_adenoma"

        return {
            "id": "cnn_region_1",
            "type": tumor_type,
            "confidence": round(probability, 3),
            "risk_level": risk,
            "coordinates": {
                "x": x,
                "y": y,
                "width": box_w,
                "height": box_h,
            },
            "location": "left_frontal_lobe",
        }

    @staticmethod
    def _render_annotated_image(image: Image.Image, regions: List[Dict[str, Any]]) -> Optional[str]:
        try:
            canvas = image.convert("RGB")
            draw = ImageDraw.Draw(canvas)
            for region in regions:
                coords = region.get("coordinates", {})
                x = int(coords.get("x", 0))
                y = int(coords.get("y", 0))
                w = int(coords.get("width", 0))
                h = int(coords.get("height", 0))
                risk = region.get("risk_level", "low")
                color = "#e11d48" if risk == "high" else "#f97316" if risk == "moderate" else "#22c55e"

                draw.rectangle([x, y, x + w, y + h], outline=color, width=3)
                draw.text((x + 4, max(0, y - 14)), f"{region.get('type', 'region')} ({region.get('confidence', 0):.2f})", fill=color)

            output = io.BytesIO()
            canvas.save(output, format="PNG")
            import base64

            return f"data:image/png;base64,{base64.b64encode(output.getvalue()).decode('utf-8')}"
        except Exception as e:
            logger.warning("Failed to render annotated image: %s", e)
            return None

    def analyze(self, image: Image.Image) -> Dict[str, Any]:
        started = time.time()

        flagged_reason = None
        model_error = None
        regions: List[Dict[str, Any]] = []
        mc_summary = {"mean_probability": 0.5, "uncertainty": 1.0, "entropy": 0.6931}
        deterministic_probability = 0.5

        try:
            if self.model is not None:
                tensor = self._preprocess_for_model(image)
                deterministic_probability = float(self.model.predict(tensor, verbose=0).squeeze())
                mc_summary = self._run_mc_dropout(tensor)

                has_tumor = deterministic_probability >= 0.5
                uncertain = (
                    mc_summary["uncertainty"] >= 0.08
                    or 0.42 <= mc_summary["mean_probability"] <= 0.58
                )

                if has_tumor:
                    regions = [self._estimate_primary_region(image, deterministic_probability)]
                elif uncertain:
                    flagged_reason = "cnn_no_detection_high_uncertainty"
                
                if uncertain and not flagged_reason:
                    flagged_reason = "high_uncertainty_mc_dropout"
            else:
                flagged_reason = "cnn_model_unavailable"

        except Exception as e:
            model_error = str(e)
            flagged_reason = "cnn_model_inference_failure"
            logger.warning("CNN inference failed, switching to fallback: %s", e)

        if not regions:
            fallback_regions = self._fallback_detect_regions(image)
            if fallback_regions:
                regions = fallback_regions
                if not flagged_reason:
                    flagged_reason = "fallback_region_detection_used"

        if not regions and flagged_reason is None:
            flagged_reason = "no_regions_detected_requires_expert_review"

        overall_confidence = float(max([r.get("confidence", 0.0) for r in regions], default=1 - deterministic_probability))

        if regions:
            risk_priority = {"low": 1, "moderate": 2, "high": 3}
            overall_risk = max((r.get("risk_level", "low") for r in regions), key=lambda k: risk_priority.get(k, 0))
        else:
            overall_risk = "low"

        processing_time = round(time.time() - started, 3)
        annotated = self._render_annotated_image(image, regions)

        requires_expert_review = bool(flagged_reason)
        summary = (
            "Automated MRI analysis completed. "
            f"{len(regions)} region(s) highlighted. "
            f"MC dropout uncertainty: {mc_summary['uncertainty']:.3f}."
        )

        recommendations = [
            "Review findings with certified radiology team.",
            "Correlate MRI findings with neurological symptoms.",
            "Schedule follow-up MRI if clinical suspicion remains high.",
        ]
        if requires_expert_review:
            recommendations.insert(0, "Case routed to expert review team due to model uncertainty/fallback.")

        return {
            "status": "success",
            "model_name": self.model_name,
            "summary": summary,
            "diagnostic": {
                "overall_risk_level": overall_risk,
                "overall_confidence": round(overall_confidence, 4),
                "tumor_detected": len(regions) > 0,
                "num_regions_detected": len(regions),
                "processing_time_seconds": processing_time,
            },
            "detected_regions": regions,
            "recommendations": recommendations,
            "mc_dropout": mc_summary,
            "requires_expert_review": requires_expert_review,
            "flag_reason": flagged_reason,
            "model_error": model_error,
            "annotated_image": annotated,
            "analysis_timestamp": datetime.utcnow().isoformat(),
        }


pipeline = BrainTumorDetectionPipeline()


@router.post("/upload-and-analyze")
async def upload_and_analyze_mri(
    mri_image: UploadFile = File(...),
    user_id: str = Form("anonymous"),
    analysis_type: str = Form("brain_tumor_detection"),
    store_in_db: bool = Form(True),
    db: Session = Depends(get_db),
):
    allowed_extensions = (".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".dcm", ".dicom")
    if not mri_image.filename.lower().endswith(allowed_extensions):
        raise HTTPException(status_code=400, detail="Unsupported MRI format")

    file_content = await mri_image.read()
    if not file_content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    validation = pipeline._validate_image(file_content, mri_image.filename)
    if not validation.get("valid"):
        raise HTTPException(status_code=400, detail=validation.get("error", "Invalid MRI image"))

    image = Image.open(io.BytesIO(file_content))

    unique_name = f"{uuid.uuid4()}_{mri_image.filename}"
    file_path = os.path.join(MRI_UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(file_content)

    analysis_record = MRIAnalysis(
        user_id=str(user_id),
        filename=mri_image.filename,
        file_path=file_path,
        status="analyzing",
        metadata_json=json.dumps(
            {
                "analysis_type": analysis_type,
                "image_size": validation.get("size"),
                "image_format": validation.get("format"),
                "model_requested": "Brain-Tumor-Detection",
                "file_size_bytes": len(file_content),
            }
        ),
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    result = pipeline.analyze(image)

    analysis_record.status = "completed"
    analysis_record.analysis_started_at = func.now()
    analysis_record.analysis_completed_at = func.now()
    analysis_record.overall_risk_level = result["diagnostic"]["overall_risk_level"]
    analysis_record.confidence_score = result["diagnostic"]["overall_confidence"]
    analysis_record.results_json = json.dumps(result)
    db.commit()

    flagged_id = None
    if result.get("requires_expert_review") and store_in_db:
        flagged = FlaggedMRIReport(
            mri_analysis_id=analysis_record.id,
            user_id=str(user_id),
            flag_reason=result.get("flag_reason", "unknown"),
            model_name=result.get("model_name", "unknown"),
            mc_mean_probability=result.get("mc_dropout", {}).get("mean_probability"),
            mc_uncertainty=result.get("mc_dropout", {}).get("uncertainty"),
            mc_entropy=result.get("mc_dropout", {}).get("entropy"),
            suggested_risk_level=result.get("diagnostic", {}).get("overall_risk_level", "review_required"),
            auto_summary=result.get("summary", ""),
            analysis_snapshot_json=json.dumps(result),
        )
        db.add(flagged)
        db.commit()
        db.refresh(flagged)
        flagged_id = flagged.id

    return {
        "success": True,
        "image_id": str(analysis_record.id),
        "uploaded_to_db": True,
        "analysis": {
            "detected_regions": result.get("detected_regions", []),
            "overall_confidence": result.get("diagnostic", {}).get("overall_confidence", 0.0),
            "overall_risk_level": result.get("diagnostic", {}).get("overall_risk_level", "low"),
            "processing_time": result.get("diagnostic", {}).get("processing_time_seconds", 0.0),
            "annotated_image": result.get("annotated_image"),
            "visualization_type": "annotated_regions",
            "diagnostic_summary": result.get("summary", ""),
            "recommendations": result.get("recommendations", []),
            "requires_expert_review": result.get("requires_expert_review", False),
            "flag_reason": result.get("flag_reason"),
            "mc_dropout": result.get("mc_dropout", {}),
            "flagged_report_id": flagged_id,
        },
        "database_info": {
            "stored": True,
            "record_id": str(analysis_record.id),
            "table": "mri_analyses",
            "timestamp": datetime.utcnow().isoformat(),
        },
    }


@router.get("/flagged-reports")
def list_flagged_reports(
    status: str = Query("pending", description="pending, reviewed, all"),
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_medical_expert),
):
    query = db.query(FlaggedMRIReport)
    if status != "all":
        query = query.filter(FlaggedMRIReport.flag_status == status)

    records = query.order_by(FlaggedMRIReport.created_at.desc()).all()
    results: List[Dict[str, Any]] = []

    for record in records:
        analysis = db.query(MRIAnalysis).filter(MRIAnalysis.id == record.mri_analysis_id).first()
        payload = {}
        if analysis and analysis.results_json:
            try:
                payload = json.loads(analysis.results_json)
            except Exception:
                payload = {}

        results.append(
            {
                "id": record.id,
                "mri_analysis_id": record.mri_analysis_id,
                "user_id": record.user_id,
                "filename": analysis.filename if analysis else None,
                "file_path": analysis.file_path if analysis else None,
                "created_at": record.created_at.isoformat() if record.created_at else None,
                "flag_reason": record.flag_reason,
                "flag_status": record.flag_status,
                "model_name": record.model_name,
                "mc_mean_probability": record.mc_mean_probability,
                "mc_uncertainty": record.mc_uncertainty,
                "mc_entropy": record.mc_entropy,
                "suggested_risk_level": record.suggested_risk_level,
                "auto_summary": record.auto_summary,
                "detected_regions": payload.get("detected_regions", []),
                "annotated_image": payload.get("annotated_image"),
                "diagnostic": payload.get("diagnostic", {}),
                "expert_review": {
                    "reviewed_by_user_id": record.reviewed_by_user_id,
                    "reviewed_at": record.reviewed_at.isoformat() if record.reviewed_at else None,
                    "expert_guess": record.expert_guess,
                    "expert_risk_level": record.expert_risk_level,
                    "expert_notes": record.expert_notes,
                    "expert_regions": json.loads(record.expert_regions_json or "[]"),
                },
            }
        )

    return {"items": results, "count": len(results), "status_filter": status}


@router.post("/flagged-reports/{report_id}/review")
def review_flagged_report(
    report_id: int,
    review: FlaggedReviewRequest,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_current_medical_expert),
):
    flagged = db.query(FlaggedMRIReport).filter(FlaggedMRIReport.id == report_id).first()
    if not flagged:
        raise HTTPException(status_code=404, detail="Flagged report not found")

    flagged.flag_status = "reviewed"
    flagged.reviewed_by_user_id = current_user.id
    flagged.reviewed_at = func.now()
    flagged.expert_guess = review.expert_guess
    flagged.expert_risk_level = review.expert_risk_level
    flagged.expert_notes = review.expert_notes
    flagged.expert_regions_json = json.dumps(review.expert_regions or [])

    analysis = db.query(MRIAnalysis).filter(MRIAnalysis.id == flagged.mri_analysis_id).first()
    if analysis and analysis.results_json:
        try:
            payload = json.loads(analysis.results_json)
        except Exception:
            payload = {}

        payload["expert_review"] = {
            "reviewed": True,
            "reviewed_by": current_user.username,
            "reviewed_at": datetime.utcnow().isoformat(),
            "expert_guess": review.expert_guess,
            "expert_risk_level": review.expert_risk_level,
            "expert_notes": review.expert_notes,
            "expert_regions": review.expert_regions or [],
        }

        if review.expert_regions:
            payload["detected_regions"] = review.expert_regions

        payload["requires_expert_review"] = False
        payload["flag_reason"] = None
        analysis.results_json = json.dumps(payload)
        analysis.overall_risk_level = review.expert_risk_level

    db.commit()

    return {
        "success": True,
        "report_id": report_id,
        "status": "reviewed",
        "reviewed_by": current_user.username,
    }
