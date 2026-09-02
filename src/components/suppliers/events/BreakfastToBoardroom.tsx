'use client';

import React from 'react';
import { HardHat, Building2, BarChart3, Landmark } from 'lucide-react';

const TIERS = [
  {
    icon: HardHat,
    role: 'Field Engineers',
    description: 'Directly employed and self-employed engineers seeking technical development, additional trade competency, and access to specialist manufacturer knowledge.',
    accent: '#6366F1',
    width: 'w-[55%]',
    justify: 'justify-start',
  },
  {
    icon: Building2,
    role: 'Specialist Contractors',
    description: 'SME contractors building service portfolios, bidding for FM contracts, and developing operational relationships across a range of clients and disciplines.',
    accent: '#0891B2',
    width: 'w-[70%]',
    justify: 'justify-start',
  },
  {
    icon: BarChart3,
    role: 'Operations Leaders',
    description: 'Senior managers and directors from contractor businesses responsible for commercial delivery, compliance, workforce development, and client relationships.',
    accent: '#059669',
    width: 'w-[85%]',
    justify: 'justify-start',
  },
  {
    icon: Landmark,
    role: 'FM & Property Leaders',
    description: 'Procurement, asset management, and senior FM leads responsible for supply chain development, service specification, and strategic supplier partnerships.',
    accent: '#EA580C',
    width: 'w-full',
    justify: 'justify-start',
  },
];

export function BreakfastToBoardroom() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B1220] text-white border-b border-[#1E2A3A]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — Text */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                THE FM ECOSYSTEM
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              From engineers<br className="hidden sm:block" /> to decision-makers.
            </h2>

            <p className="text-sm sm:text-base text-[#9A9A95] font-light leading-relaxed">
              EntireFM events bring together all levels of the FM supply chain — from the engineers installing and maintaining systems, to the procurement leads designing the contracts those engineers will deliver.
            </p>

            <p className="text-sm text-[#9A9A95] font-light leading-relaxed">
              Your membership positions your business in a network that spans the full operational structure of commercial FM. This is why contractors consistently describe the network as one of the highest-value aspects of their membership.
            </p>

            <div className="pt-4">
              <a
                href="/suppliers/partner-network"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFEDD5] hover:text-[#EA580C] transition-colors"
              >
                <span>View the Partner Network</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right — Visual Pyramid Tiers */}
          <div className="space-y-3">
            {TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-5 rounded-[8px] bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] transition-all group`}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-[6px]"
                    style={{ background: `${tier.accent}22`, border: `1px solid ${tier.accent}33` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tier.accent }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white mb-1">{tier.role}</h3>
                    <p className="text-xs text-[#9A9A95] font-light leading-relaxed">{tier.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
