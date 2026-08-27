import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { Gift, Shield, Wrench, Truck, Fuel, GraduationCap, Building2, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contractor Benefits & Partner Perks | EntireFM Contractor Platform',
  description: 'National supply-chain buying power, trade counter accounts, and professional discounts.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorBenefitsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/benefits');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const upcomingCategories = [
    {
      title: 'National Trade Counters & Wholesalers',
      description: 'Pre-negotiated Tier 1 supply rates at leading UK electrical, plumbing, and HVAC trade merchants.',
      icon: Building2,
      status: 'LAUNCHING Q4 2026',
    },
    {
      title: 'Tools, Plant & Specialist Access Hire',
      description: 'Preferential hire rates on MEWPs, scaffolding towers, and specialist calibration equipment.',
      icon: Wrench,
      status: 'LAUNCHING Q4 2026',
    },
    {
      title: 'Branded PPE & Workwear',
      description: 'Discounted dual-branded EntireFM contractor uniforms, hi-vis, and certified safety footwear.',
      icon: Shield,
      status: 'LAUNCHING Q4 2026',
    },
    {
      title: 'Fleet, Fuel Cards & Telematics',
      description: 'Commercial fleet fuel card networks with national wholesale pricing and EV charging cards.',
      icon: Fuel,
      status: 'LAUNCHING Q1 2027',
    },
    {
      title: 'Subsidised Training & Accreditations',
      description: 'Discounted statutory refresher courses for Gas Safe, F-Gas, 18th Edition, and SSIP schemes.',
      icon: GraduationCap,
      status: 'LAUNCHING Q1 2027',
    },
    {
      title: 'Specialist Contractor Insurance',
      description: 'Group-rate public and employers liability policies tailored to commercial facilities management.',
      icon: Sparkles,
      status: 'LAUNCHING Q1 2027',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 space-y-2 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
            SUPPLY CHAIN COMMERCIAL PROGRAMME
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Contractor Benefits &amp; Commercial Partnerships
        </h1>
        <p className="text-sm text-brand-mist/70 max-w-2xl font-light">
          Leveraging EntireFM’s national procurement scale to provide approved supply chain partners with commercial discounts, trade merchant terms, and subsidised training.
        </p>
      </div>

      {/* Benefits Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingCategories.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-brand-electric/10 text-brand-electric flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9.5px] font-mono text-brand-mist/50 bg-brand-void px-2 py-0.5 rounded border border-brand-edge-dark">
                    {item.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-normal text-white">{item.title}</h3>
                  <p className="text-xs text-brand-mist/60 font-light mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-edge-dark/40 text-[11px] font-mono text-brand-electric-bright">
                Available to all approved network contractors &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
