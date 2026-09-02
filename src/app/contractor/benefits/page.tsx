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
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 sm:p-7 space-y-1.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#EA580C] font-bold">
            SUPPLY CHAIN COMMERCIAL PROGRAMME
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">
          Contractor Benefits &amp; Commercial Partnerships
        </h1>
        <p className="text-xs text-[#6D6D68] max-w-2xl font-normal leading-relaxed">
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
              className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-[6px] bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] font-semibold text-[#6D6D68] bg-[#FAFAF8] px-2 py-0.5 rounded-[4px] border border-[#E8E8E5]">
                    {item.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#111111]">{item.title}</h3>
                  <p className="text-xs text-[#6D6D68] font-normal mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E8E5] text-[11.5px] font-medium text-[#EA580C]">
                Available to all approved network contractors &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
