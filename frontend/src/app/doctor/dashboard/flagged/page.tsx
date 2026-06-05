'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getFlaggedReports, submitFlaggedReportReview, FlaggedReport } from '@/lib/mri-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function FlaggedReportsPage() {
  const [items, setItems] = useState<FlaggedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FlaggedReport | null>(null);

  const [expertGuess, setExpertGuess] = useState('');
  const [expertRiskLevel, setExpertRiskLevel] = useState('moderate');
  const [expertNotes, setExpertNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pendingCount = useMemo(() => items.filter((i) => i.flag_status === 'pending').length, [items]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getFlaggedReports('all');
      setItems(data);
      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to load flagged reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setExpertGuess(selected.expert_review?.expert_guess || '');
    setExpertRiskLevel(selected.expert_review?.expert_risk_level || selected.suggested_risk_level || 'moderate');
    setExpertNotes(selected.expert_review?.expert_notes || '');
  }, [selected?.id]);

  const handleSubmitReview = async () => {
    if (!selected) return;
    if (!expertGuess.trim() || !expertNotes.trim()) {
      toast.error('Please fill expert guess and notes');
      return;
    }

    setSubmitting(true);
    try {
      await submitFlaggedReportReview(selected.id, {
        expert_guess: expertGuess,
        expert_risk_level: expertRiskLevel,
        expert_notes: expertNotes,
      });
      toast.success('Expert review saved successfully');
      await loadReports();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Expert Review Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Flagged MRI reports from Monte Carlo dropout uncertainty and fallback detections are queued here for clinical review.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Badge className="bg-amber-100 text-amber-700">Pending: {pendingCount}</Badge>
            <Badge className="bg-slate-100 text-slate-700">Total: {items.length}</Badge>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-sm text-slate-500">Loading flagged reports...</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Flagged Cases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[620px] overflow-y-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selected?.id === item.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => setSelected(item)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Case #{item.id}</span>
                    {item.flag_status === 'pending' ? (
                      <Badge className="bg-amber-100 text-amber-700">pending</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700">reviewed</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 truncate">{item.filename || 'MRI file'}</p>
                  <p className="text-xs text-slate-500 mt-1">Reason: {item.flag_reason}</p>
                </button>
              ))}
              {items.length === 0 && <p className="text-sm text-slate-500">No flagged reports available.</p>}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Review Workspace</CardTitle>
            </CardHeader>
            <CardContent>
              {!selected ? (
                <p className="text-sm text-slate-500">Select a flagged case to review.</p>
              ) : (
                <div className="space-y-5">
                  {selected.annotated_image && (
                    <img
                      src={selected.annotated_image}
                      alt="Flagged MRI"
                      className="w-full max-h-[340px] object-contain border rounded-md bg-black"
                    />
                  )}

                  <Alert className="border-amber-300 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                    <AlertDescription className="text-amber-800">
                      {selected.auto_summary || 'Model requested expert review for this case.'}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-md border p-3">
                      <p className="text-slate-500">MC Mean</p>
                      <p className="font-semibold">{(selected.mc_mean_probability || 0).toFixed(3)}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-slate-500">Uncertainty</p>
                      <p className="font-semibold">{(selected.mc_uncertainty || 0).toFixed(3)}</p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-slate-500">Suggested Risk</p>
                      <p className="font-semibold">{selected.suggested_risk_level || 'unknown'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md border p-3">
                      <p className="text-slate-500">Tumor YES Probability</p>
                      <p className="font-semibold">
                        {((selected.binary_classification?.class_probabilities?.yes_tumor || 0) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="text-slate-500">Tumor NO Probability</p>
                      <p className="font-semibold">
                        {((selected.binary_classification?.class_probabilities?.no_tumor || 0) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Expert Diagnosis</label>
                    <Input
                      placeholder="e.g. probable low-grade glioma in left frontal lobe"
                      value={expertGuess}
                      onChange={(e) => setExpertGuess(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Risk Level</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      aria-label="Expert risk level"
                      title="Expert risk level"
                      value={expertRiskLevel}
                      onChange={(e) => setExpertRiskLevel(e.target.value)}
                    >
                      <option value="low">low</option>
                      <option value="moderate">moderate</option>
                      <option value="high">high</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">Clinical Notes</label>
                    <textarea
                      className="w-full min-h-[140px] border rounded-md p-3 text-sm"
                      placeholder="Add expert rationale, quality comments, and next-step recommendations..."
                      value={expertNotes}
                      onChange={(e) => setExpertNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={handleSubmitReview} disabled={submitting}>
                      {submitting ? 'Saving review...' : 'Submit Expert Review'}
                    </Button>
                    {selected.flag_status === 'reviewed' && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Already reviewed
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
