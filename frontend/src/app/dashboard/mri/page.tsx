'use client';

import React, { useMemo, useState } from 'react';
import { MRIImageUpload } from '@/components/medical/mri-image-upload';
import { RealMRIViewer } from '@/components/medical/real-mri-viewer';
import { useAuthStore } from '@/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, AlertTriangle, CheckCircle2, Microscope } from 'lucide-react';

interface AnalysisRegion {
  id: string;
  type: string;
  confidence: number;
  coordinates: { x: number; y: number; width: number; height: number };
  location: string;
  risk_level: string;
}

interface MRIAnalysisData {
  detected_regions: AnalysisRegion[];
  overall_confidence: number;
  overall_risk_level?: string;
  processing_time?: number;
  binary_classification?: {
    predicted_label?: 'yes' | 'no';
    class_probabilities?: {
      yes_tumor?: number;
      no_tumor?: number;
    };
    classification_confidence?: number;
    class_margin?: number;
    source?: string;
  };
  report?: {
    dataset_reference?: {
      name?: string;
      yes_count?: number;
      no_count?: number;
      total?: number;
    };
    uncertainty?: {
      flagged?: boolean;
      flag_reason?: string | null;
    };
  };
  annotated_image?: string;
  diagnostic_summary?: string;
  recommendations?: string[];
  requires_expert_review?: boolean;
  flag_reason?: string | null;
  mc_dropout?: {
    mean_probability?: number;
    uncertainty?: number;
    entropy?: number;
  };
  flagged_report_id?: number | null;
}

export default function MRIPipelinePage() {
  const { user } = useAuthStore();
  const userId = user?.id?.toString() || '1';

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [analysis, setAnalysis] = useState<MRIAnalysisData | null>(null);

  const riskTone = useMemo(() => {
    if (!analysis?.overall_risk_level) return 'bg-slate-100 text-slate-700';
    if (analysis.overall_risk_level === 'high') return 'bg-red-100 text-red-700';
    if (analysis.overall_risk_level === 'moderate') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  }, [analysis?.overall_risk_level]);

  const handleCompleteAnalysis = (result: any, file: File) => {
    setSelectedFile(file);
    setAnalysis(result?.analysis || null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            MRI Tumor Detection Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Upload MRI image, run Brain-Tumor-Detection model, draw detected regions, and auto-flag uncertain/fallback cases for expert review.
          </p>
        </CardContent>
      </Card>

      <MRIImageUpload userId={userId} onCompleteAnalysis={handleCompleteAnalysis} />

      {analysis && selectedFile && (
        <div className="space-y-6">
          {analysis.requires_expert_review ? (
            <Alert className="border-amber-300 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <AlertDescription className="text-amber-800">
                Case flagged for expert review ({analysis.flag_reason || 'uncertain model output'}). This report will appear in the doctor portal queue.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-emerald-300 bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <AlertDescription className="text-emerald-800">
                Automated analysis completed with stable confidence.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-slate-500">Overall Confidence</p>
                <p className="text-2xl font-semibold">{(analysis.overall_confidence * 100).toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-slate-500">Regions Detected</p>
                <p className="text-2xl font-semibold">{analysis.detected_regions?.length || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-slate-500">Risk Level</p>
                <Badge className={riskTone}>{analysis.overall_risk_level || 'unknown'}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-slate-500">MC Uncertainty</p>
                <p className="text-2xl font-semibold">{((analysis.mc_dropout?.uncertainty || 0) * 100).toFixed(1)}%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Binary Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  Predicted Label:{' '}
                  <span className="font-semibold uppercase">{analysis.binary_classification?.predicted_label || 'unknown'}</span>
                </p>
                <p>
                  Tumor YES Probability:{' '}
                  <span className="font-semibold">{((analysis.binary_classification?.class_probabilities?.yes_tumor || 0) * 100).toFixed(2)}%</span>
                </p>
                <p>
                  Tumor NO Probability:{' '}
                  <span className="font-semibold">{((analysis.binary_classification?.class_probabilities?.no_tumor || 0) * 100).toFixed(2)}%</span>
                </p>
                <p>
                  Class Margin:{' '}
                  <span className="font-semibold">{((analysis.binary_classification?.class_margin || 0) * 100).toFixed(2)}%</span>
                </p>
                <p>
                  Source:{' '}
                  <span className="font-semibold">{analysis.binary_classification?.source || 'unknown'}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Real Report Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-700">
                <p className="font-medium">{analysis.report?.dataset_reference?.name || 'Brain-Tumor-Detection dataset'}</p>
                <p>
                  Dataset split reference: YES {analysis.report?.dataset_reference?.yes_count ?? 155} / NO {analysis.report?.dataset_reference?.no_count ?? 98}
                </p>
                <p>
                  Total reference images: {analysis.report?.dataset_reference?.total ?? 253}
                </p>
                <p>
                  Expert review flag:{' '}
                  <span className="font-semibold">{analysis.report?.uncertainty?.flagged ? 'Yes' : 'No'}</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5 text-indigo-600" />
                Diagnostic Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-700">{analysis.diagnostic_summary || 'No summary available.'}</p>
              {!!analysis.recommendations?.length && (
                <ul className="space-y-1 text-sm text-slate-600 list-disc pl-5">
                  {analysis.recommendations.map((item, idx) => (
                    <li key={`${idx}-${item}`}>{item}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <RealMRIViewer imageFile={selectedFile} analysisData={analysis} userId={userId} />
        </div>
      )}
    </div>
  );
}
