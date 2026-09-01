import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { getContractorTrainingMatrix } from '@/server/contractor/workforce-service';
import { TrainingMatrixTable } from '@/components/contractor/TrainingMatrixTable';
import Link from 'next/link';
import { ArrowLeft, Download, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Training & Competency Matrix | EntireFM Contractor Platform',
  description: 'Supply chain matrix of trade competencies, statutory refreshers, and verified qualifications.',
};

export const dynamic = 'force-dynamic';

export default async function TrainingMatrixPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/workforce/training-matrix');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const matrixData = await getContractorTrainingMatrix(orgId, session);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/contractor/workforce"
            className="text-xs text-brand-mist/60 hover:text-white flex items-center gap-1.5 font-normal mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workforce Roster
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Workforce Training &amp; Competency Matrix
          </h1>
          <p className="text-xs text-brand-mist/70 font-light max-w-xl">
            Live compliance grid cross-referencing field operatives with mandatory trade standards, ECS cards, Gas Safe, and H&amp;S refreshers.
          </p>
        </div>
      </div>

      <TrainingMatrixTable
        initialMatrix={matrixData.matrix}
        competencies={matrixData.competencies}
      />
    </div>
  );
}
