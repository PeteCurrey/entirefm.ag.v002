'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Tag } from 'lucide-react';

const PILLARS = [
  { label: 'Operate', detail: 'Contractor Control Centre — dashboards, KPIs, task management.' },
  { label: 'Control', detail: 'Compliance Radar — certification tracking, alerts, document vault.' },
  { label: 'Develop', detail: 'RAMS Builder, method statements, and technical training pathways.' },
  { label: 'Connect', detail: 'Managed introduction to EntireFM supply chain opportunities.' },
  { label: 'Stay Informed', detail: 'Industry briefings, regulatory updates, and market intelligence.' },
  { label: 'Grow', detail: 'Commercial mentoring, bid support, and business development resources.' },
];

const TIERS = [
  {
    code: 'CN',
    name: 'Contractor Network Member',
    price: '£295',
    period: '/yr',
    description: 'Core membership for specialist contractors entering or developing within the EntireFM partner network.',
    features: [
      'Full contractor dashboard access',
      'Regional event programme access',
      'Compliance Radar (self-managed)',
      'Member directory listing',
      'Industry bulletin & briefings',
    ],
    cta: 'Apply for Membership',
    href: '/suppliers/membership',
    highlight: false,
  },
  {
    code: 'NP',
    name: 'Network Partner',
    price: '£695',
    period: '/yr',
    description: 'Premium partnership tier for contractors seeking enhanced visibility, strategic positioning, and deeper commercial integration.',
    features: [
      'All Contractor Network benefits',
      'Partner Network Summit access',
      'OEM partner programme invitations',
      'Priority event registrations',
      'Enhanced directory profile & visibility',
      'Commercial advisory sessions',
    ],
    cta: 'Explore Network Partner',
    href: '/suppliers/membership',
    highlight: true,
  },
];

export function EventsMembershipBridge() {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAF8] border-b border-[#E8E8E5]">
      <div className="container-custom space-y-16">
        {/* Membership Pillars */}
        <div>
          <div className="max-w-2xl mb-10 space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                MEMBERSHIP CAPABILITY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
              Your membership goes beyond the events.
            </h2>
            <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
              Every event you attend is backed by a full contractor operating platform — tools, compliance management, commercial resources, and direct industry connections. Membership gives you all of it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-5 rounded-[8px] bg-[#FFFFFF] border border-[#E8E8E5] hover:border-[#EA580C]/30 transition-colors group"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#EA580C] mt-1.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#111111] mb-1">{pillar.label}</h3>
                  <p className="text-xs text-[#6D6D68] font-light leading-relaxed">{pillar.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E8E8E5]" />

        {/* Tier Cards */}
        <div>
          <div className="max-w-2xl mb-10 space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                MEMBERSHIP TIERS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              One membership. A wider professional network.
            </h2>
          </div>

          {/* Invitation Code Callout */}
          <div className="mb-8 flex items-start gap-3 p-4 rounded-[6px] bg-[#FFF7ED] border border-[#FFEDD5]">
            <Tag className="w-4 h-4 text-[#EA580C] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#7C2D12] font-light leading-relaxed">
              <span className="font-semibold">Invitation Code Waiver:</span> Contractors holding a valid EntireFM invitation code are admitted to their first year of membership at <strong>£0</strong>. Speak to your EntireFM contact for details. Standard annual renewal rates apply thereafter.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.code}
                className={`relative p-6 sm:p-8 rounded-[10px] border flex flex-col gap-6 ${
                  tier.highlight
                    ? 'bg-[#111111] border-[#EA580C]/40 text-white'
                    : 'bg-[#FFFFFF] border-[#E8E8E5] text-[#111111]'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#EA580C] text-white text-[10px] font-bold uppercase tracking-wider">
                    RECOMMENDED
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${tier.highlight ? 'text-[#EA580C]' : 'text-[#EA580C]'}`}>
                        {tier.code}
                      </span>
                      <h3 className={`text-base font-semibold mt-0.5 ${tier.highlight ? 'text-white' : 'text-[#111111]'}`}>
                        {tier.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${tier.highlight ? 'text-white' : 'text-[#111111]'}`}>{tier.price}</span>
                      <span className={`text-xs ${tier.highlight ? 'text-[#9A9A95]' : 'text-[#6D6D68]'}`}>{tier.period}</span>
                    </div>
                  </div>
                  <p className={`text-xs font-light leading-relaxed ${tier.highlight ? 'text-[#9A9A95]' : 'text-[#6D6D68]'}`}>
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-[#EA580C]' : 'text-[#EA580C]'}`} />
                      <span className={`text-xs font-light ${tier.highlight ? 'text-[#D1D5DB]' : 'text-[#6D6D68]'}`}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.href}
                  className={`mt-auto inline-flex items-center gap-2 px-5 py-3 rounded-[6px] text-xs font-semibold uppercase tracking-wider transition-all ${
                    tier.highlight
                      ? 'bg-[#EA580C] hover:bg-[#C2410C] text-white'
                      : 'bg-[#111111] hover:bg-[#222222] text-white'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Procurement Independence Disclaimer */}
          <p className="mt-6 text-center text-xs text-[#9A9A95] font-light max-w-2xl mx-auto leading-relaxed">
            Membership does not guarantee commercial work or contract award. EntireFM maintains full independence in its client procurement processes. Supply chain introductions are made on merit and client operational requirements.
          </p>
        </div>
      </div>
    </section>
  );
}
