from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base
import json

class GenomicData(Base):
    __tablename__ = 'genomic_data'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    filename = Column(String, index=True)
    file_url = Column(String, index=True)
    status = Column(String, default='processing')
    metadata_json = Column(Text, default='{}')
    uploaded_at = Column(DateTime, default=None)
    
    # Relationships
    prs_scores = relationship("PrsScore", back_populates="genomic_data")
    # reports relationship removed to avoid circular imports

class PrsScore(Base):
    __tablename__ = 'prs_scores'

    id = Column(Integer, primary_key=True, index=True)
    genomic_data_id = Column(Integer, ForeignKey('genomic_data.id'))
    disease_type = Column(String, index=True)
    score = Column(Float)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    genomic_data = relationship("GenomicData", back_populates="prs_scores")

class MlPrediction(Base):
    __tablename__ = 'ml_predictions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    prediction = Column(String)
    confidence = Column(Float)

class MRIAnalysis(Base):
    __tablename__ = 'mri_analyses'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    filename = Column(String)
    file_path = Column(String)
    status = Column(String, default='processing')  # processing, analyzing, completed, failed
    metadata_json = Column(Text, default='{}')
    results_json = Column(Text, default='{}')
    overall_risk_level = Column(String)  # low, moderate, high
    confidence_score = Column(Float)
    error_message = Column(Text)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    analysis_started_at = Column(DateTime(timezone=True), default=None)
    analysis_completed_at = Column(DateTime(timezone=True), default=None)


class FlaggedMRIReport(Base):
    __tablename__ = 'flagged_mri_reports'

    id = Column(Integer, primary_key=True, index=True)
    mri_analysis_id = Column(Integer, ForeignKey('mri_analyses.id'), nullable=False, index=True)
    user_id = Column(String, index=True)

    flag_reason = Column(String, nullable=False)
    flag_status = Column(String, default='pending')  # pending, reviewed
    model_name = Column(String, default='brain_tumor_detection_pipeline')

    mc_mean_probability = Column(Float, default=None)
    mc_uncertainty = Column(Float, default=None)
    mc_entropy = Column(Float, default=None)

    suggested_risk_level = Column(String, default='review_required')
    auto_summary = Column(Text, default='')
    analysis_snapshot_json = Column(Text, default='{}')

    reviewed_by_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), default=None)
    expert_guess = Column(String, default=None)
    expert_risk_level = Column(String, default=None)
    expert_notes = Column(Text, default=None)
    expert_regions_json = Column(Text, default='[]')

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
