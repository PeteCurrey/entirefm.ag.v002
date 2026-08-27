import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { BusinessToolsCalculators } from '@/components/contractor/BusinessToolsCalculators';
import { Calculator, Sparkles, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Tools & Pricing Calculators | EntireFM Contractor Platform',
  description: 'Labour rate calculator, job margin analysis, and call-out pricing models for supply chain contractors.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorToolsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/tools');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
          CONTRACTOR OPERATING SYSTEM TOOLS
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Business Calculators &amp; Margin Tools
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-xl">
          Digital utilities designed to help EntireFM supply chain partners price accurately, protect margins, and optimise engineering utilisation.
        </p>
      </div>

      <BusinessToolsCalculators />

      {/* Upcoming Tools Roadmap */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-brand-edge-dark/60 pb-3">
          <Sparkles className="w-4 h-4 text-brand-electric" />
          <h3 className="text-sm font-medium text-white">Upcoming Contractor Tools (Release Roadmap)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light">
          <div className="p-4 rounded-lg bg-brand-void border border-brand-edge-dark/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-brand-electric-bright font-bold block">Q4 2026</span>
            <h4 className="text-white font-normal">PPM Contract Planner</h4>
            <p className="text-brand-mist/60 text-[11px]">Automated planned preventative maintenance asset visit scheduling and resource load balancing.</p>
          </div>

          <div className="p-4 rounded-lg bg-brand-void border border-brand-edge-dark/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-brand-electric-bright font-bold block">Q4 2026</span>
            <h4 className="text-white font-normal">Quote &amp; Estimate Builder</h4>
            <p className="text-brand-mist/60 text-[11px]">Instant branded customer quotes with integrated schedule of rates (SOR) and EntireFM schedule sync.</p>
          </div>

          <div className="p-4 rounded-lg bg-brand-void border border-brand-edge-dark/60 space-y-1">
            <span className="text-[10px] font-mono uppercase text-brand-electric-bright font-bold block">Q1 2027</span>
            <h4 className="text-white font-normal">Engineer Utilisation &amp; Van Stock</h4>
            <p className="text-brand-mist/60 text-[11px]">Vehicle stock replenishment, barcode scanning, and field engineer billable time tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
