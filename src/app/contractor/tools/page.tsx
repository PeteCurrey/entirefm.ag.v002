import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { BusinessToolsHub } from '@/components/contractor/BusinessToolsHub';

export const metadata: Metadata = {
  title: 'Business Toolkit | EntireFM Contractor Platform',
  description: 'Labour rate calculators, job margin analysis, quote builder, PPM planner, and commercial productivity tools for FM contractors.',
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
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10.5px] uppercase tracking-widest text-brand-electric-bright font-bold">
          CONTRACTOR BUSINESS TOOLKIT &bull; CP-08
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Business Tools &amp; Calculators
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-2xl">
          Practical tools to help you price work accurately, protect margin, plan your workforce, and build professional quotes.
          All calculations are private to your organisation.
        </p>
      </div>

      <BusinessToolsHub />
    </div>
  );
}
