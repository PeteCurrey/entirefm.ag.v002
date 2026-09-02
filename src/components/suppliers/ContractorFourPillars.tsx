import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Briefcase, Building2, Globe, ArrowRight } from 'lucide-react';

interface Pillar {
  number: string;
  eyebrow: string;
  headline: string;
  body: string;
  items: string[];
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
  ctaLabel: string;
  eyebrowColor: string;
  iconColor: string;
  markerColor: string;
  delayMs: number;
}

const PILLARS: Pillar[] = [
  {
    number: '01',
    eyebrow: 'GET READY',
    headline: 'Keep your business ready for work.',
    body: 'Keep the documents, certifications and compliance information behind your business organised in one professional workspace — with automatic expiry tracking across everything that matters.',
    items: [
      'Public & employers liability insurance',
      'Trade qualifications & accreditations',
      'RAMS & risk assessments',
      'COSHH assessments & documentation',
      'Certifications & industry registrations',
      'Automated 90 / 60 / 30-day expiry alerts',
    ],
    Icon: ShieldCheck,
    href: '/contractor/compliance',
    ctaLabel: 'Compliance Centre',
    eyebrowColor: 'text-emerald-600',
    iconColor: 'text-emerald-600',
    markerColor: 'bg-emerald-500',
    delayMs: 0,
  },
  {
    number: '02',
    eyebrow: 'MANAGE THE WORK',
    headline: 'Manage jobs from instruction to completion.',
    body: 'Keep work orders, site information, updates, evidence and completion records connected to each job — from initial instruction through to photographic evidence and final submission.',
    items: [
      'Work order receipt & status tracking',
      'Job & site information',
      'Engineer allocation & operative notes',
      'Before & after photographs',
      'Completion evidence & sign-off',
      'Job history & record archive',
    ],
    Icon: Briefcase,
    href: '/contractor/work',
    ctaLabel: 'Work Queue',
    eyebrowColor: 'text-[#EA580C]',
    iconColor: 'text-[#EA580C]',
    markerColor: 'bg-[#EA580C]',
    delayMs: 80,
  },
  {
    number: '03',
    eyebrow: 'PRESENT YOUR BUSINESS',
    headline: 'Put your business in front of a professional FM operation.',
    body: 'Maintain a complete, professional supplier profile within the EntireFM contractor network. Trade disciplines, service areas, capabilities, certifications and contact information — all current and in one place.',
    items: [
      'Company profile & registration detail',
      'Trade disciplines & service capabilities',
      'Geographic service area coverage',
      'Accreditations & scheme memberships',
      'Certifications & contact information',
      'Company documentation & policies',
    ],
    Icon: Building2,
    href: '/contractor/profile',
    ctaLabel: 'Contractor Profile',
    eyebrowColor: 'text-blue-600',
    iconColor: 'text-blue-600',
    markerColor: 'bg-blue-500',
    delayMs: 160,
  },
  {
    number: '04',
    eyebrow: 'BE PART OF THE NETWORK',
    headline: 'More than compliance. A place to do business.',
    body: 'Your EntireFM membership brings together the tools to stay ready, manage work professionally and maintain your position in the EntireFM supplier network — with eligibility for applicable work where requirements align.',
    items: [
      'Verified partner status in the network',
      'Work eligibility where applicable',
      'Companies House financial monitoring',
      'Credential surveillance & trade updates',
      'Building Safety Act regulatory briefings',
      'Technical forum & CPD event access',
    ],
    Icon: Globe,
    href: '/contractor/intelligence',
    ctaLabel: 'Intelligence Centre',
    eyebrowColor: 'text-violet-600',
    iconColor: 'text-violet-600',
    markerColor: 'bg-violet-500',
    delayMs: 240,
  },
];

export function ContractorFourPillars() {
  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide space-y-16">

        {/* Section header */}
        <div className="max-w-3xl" data-reveal>
          <span className="eyebrow eyebrow-light">THE PLATFORM</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            One platform. Four operating capabilities.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-2xl">
            EntireFM gives contractors more than a compliance checklist. It provides the infrastructure to operate professionally, manage work end-to-end, present a credible business and maintain a position in the EntireFM supply chain.
          </p>
        </div>

        {/* Four pillars — hairline-divided grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-slate-200 rounded-sm overflow-hidden shadow-card">
          {PILLARS.map((pillar) => {
            const { Icon } = pillar;
            return (
              <article
                key={pillar.number}
                data-reveal
                style={{ '--reveal-delay': `${pillar.delayMs}ms` } as React.CSSProperties}
                className="bg-white p-8 sm:p-9 flex flex-col space-y-5 group/card hover:-translate-y-px transition-transform duration-300"
              >
                {/* Large number + icon row */}
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden="true"
                    className="text-[64px] sm:text-[72px] font-extralight leading-none text-slate-100 select-none tabular-nums"
                  >
                    {pillar.number}
                  </span>
                  <div className="mt-1 p-2 rounded-sm bg-slate-50 border border-slate-100">
                    <Icon className={`w-5 h-5 ${pillar.iconColor}`} aria-hidden="true" />
                  </div>
                </div>

                {/* Eyebrow */}
                <p className={`text-[10px] font-bold uppercase tracking-widest ${pillar.eyebrowColor}`}>
                  {pillar.eyebrow}
                </p>

                {/* Headline */}
                <h3 className="text-[17px] font-extralight text-slate-900 leading-snug">
                  {pillar.headline}
                </h3>

                {/* Body */}
                <p className="text-[12.5px] text-slate-600 font-light leading-relaxed flex-grow">
                  {pillar.body}
                </p>

                {/* Item list */}
                <ul className="space-y-2 pt-3 border-t border-slate-100" role="list">
                  {pillar.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[11.5px] text-slate-600 font-light"
                    >
                      <span
                        className={`mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 ${pillar.markerColor}`}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Portal link */}
                <Link
                  href={pillar.href}
                  className={`inline-flex items-center gap-1.5 text-[11.5px] font-medium ${pillar.eyebrowColor} hover:underline underline-offset-2 pt-1 group/link`}
                >
                  See {pillar.ctaLabel}
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            );
          })}
        </div>

        {/* Governance disclosure */}
        <p className="text-[11px] text-slate-400 font-light max-w-2xl" data-reveal>
          Network access and Contractor Portal features are available to approved members. Work eligibility is subject to client requirements, geography, capability, compliance status, availability and demand — not membership tier.
        </p>

      </div>
    </section>
  );
}
