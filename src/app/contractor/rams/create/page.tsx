import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { listContractorOperatives } from '@/server/contractor/workforce-service';
import { dbQuery } from '@/server/db/client';
import { RamsWizardClient } from '@/components/contractor/RamsWizardClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create RAMS Pack | EntireFM Contractor Platform',
  description: '10-Step Structured RAMS Builder with Live Operative Competency Cross-Validation.',
};

export const dynamic = 'force-dynamic';

export default async function CreateRamsPage({
  searchParams,
}: {
  searchParams: Promise<{ workOrderId?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/rams/create');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const orgId = session.orgId;
  const { workOrderId } = await searchParams;

  // 1. Fetch Operatives
  const operatives = await listContractorOperatives(orgId, session);

  // 2. Fetch Work Order if specified
  let workOrder: any = null;
  if (workOrderId) {
    const { data: woData } = await dbQuery<any[]>(
      `work_orders?id=eq.${encodeURIComponent(workOrderId)}&select=*,site:sites(*),client_account:client_accounts(*)`
    );
    if (woData && woData.length > 0) {
      workOrder = woData[0];
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/contractor/rams"
          className="text-xs text-brand-mist/60 hover:text-white flex items-center gap-1.5 font-mono mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to RAMS Dashboard
        </Link>
        <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
          {workOrder ? `ENTIREFM JOB PACK • ${workOrder.work_order_number}` : 'INDEPENDENT RAMS BUILDER'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Create Job-Specific RAMS Pack
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-2xl">
          Follow the 10-step FM safety wizard. Select verified operatives, assess 5x5 risks, specify physical controls, and define sequential method steps.
        </p>
      </div>

      <RamsWizardClient
        contractorOrgId={orgId}
        operatives={operatives}
        initialWorkOrder={workOrder}
      />
    </div>
  );
}
