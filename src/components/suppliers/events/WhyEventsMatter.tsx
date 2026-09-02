'use client';

import React from 'react';
import { BookOpen, Network, Cpu, TrendingUp } from 'lucide-react';

const PILLARS = [
  {
    number: '01',
    icon: BookOpen,
    title: 'Knowledge',
    subtitle: 'Stay technically ahead',
    body: 'Regulatory changes, evolving standards, and shifting best practices — delivered directly by engineers, compliance specialists, and FM procurement leaders who work in the industry daily.',
  },
  {
    number: '02',
    icon: Network,
    title: 'Relationships',
    subtitle: 'Build the right connections',
    body: 'The contractors who grow their business are often the ones who know the right people. EntireFM events are designed to put you in the same room as operations managers, contract managers, and other specialist contractors.',
  },
  {
    number: '03',
    icon: Cpu,
    title: 'Technology',
    subtitle: 'Understand what is coming',
    body: 'Direct access to OEM partners, equipment manufacturers, and technology providers. See the products, understand the specifications, and talk to the people designing the next generation of building systems.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Development',
    subtitle: 'Grow your business capability',
    body: 'Structured sessions around commercial management, service delivery, bid writing, workforce compliance, and business development — practical content for contractors building scalable operations.',
  },
];

export function WhyEventsMatter() {
  return (
    <section className="py-20 lg:py-28 bg-[#111111] text-white border-b border-[#2A2A2A]">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              WHY IT MATTERS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Membership should open doors, not just provide a login.
          </h2>
          <p className="text-sm sm:text-base text-[#9A9A95] font-light leading-relaxed">
            The EntireFM partner programme is built on the belief that contractors at every level deserve access to the same quality of information, relationships, and development that the largest FM businesses take for granted.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="group p-6 rounded-[8px] bg-[#FFFFFF08] border border-[#FFFFFF12] hover:bg-[#FFFFFF0F] hover:border-[#EA580C]/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-[6px] bg-[#EA580C]/15 border border-[#EA580C]/20">
                    <Icon className="w-5 h-5 text-[#EA580C]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#3D3D3D] tabular-nums tracking-widest">
                    {pillar.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{pillar.title}</h3>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#EA580C] mb-3">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-[#9A9A95] font-light leading-relaxed">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
