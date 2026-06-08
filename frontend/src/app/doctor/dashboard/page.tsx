'use client';

import React from 'react';
import { PatientList } from '@/components/doctor/patient-list';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Doctor Portal Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Expert Review Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Review MRI cases automatically flagged by Monte Carlo dropout uncertainty and fallback detection.
          </p>
          <Link href="/doctor/dashboard/flagged">
            <Button>Open Flagged MRI Queue</Button>
          </Link>
        </CardContent>
      </Card>

      <PatientList />
    </div>
  );
}
