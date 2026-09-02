'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface LobbyDestinationCard {
  id: string;
  number: string;
  headline: string;
  supportingLine: string;
  description: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  categoryTag: string;
}

export const LOBBY_CORE_DESTINATIONS: LobbyDestinationCard[] = [
  {
    id: 'know',
    number: '01',
    headline: 'KNOW',
    supportingLine: "Understand what's changing.",
    description:
      'Industry intelligence, regulatory updates, market developments, research, reports and the information FM professionals need to stay ahead.',
    cta: 'EXPLORE KNOW',
    href: '/lobby/know',
    imageSrc: '/images/editorial/entirefm-engineers-office-testing-2000w.webp',
    imageAlt: 'FM directors and engineers reviewing building data and intelligence',
    categoryTag: 'INTELLIGENCE & REGULATORY WATCH',
  },
  {
    id: 'check',
    number: '02',
    headline: 'CHECK',
    supportingLine: "Know what's required.",
    description:
      'Compliance requirements, statutory obligations, guidance, evidence requirements, compliance tools and practical checks.',
    cta: 'EXPLORE CHECK',
    href: '/lobby/check',
    imageSrc: '/images/editorial/entirefm-switchroom-survey-2000w.webp',
    imageAlt: 'High-voltage switchgear statutory inspection and building compliance audit',
    categoryTag: 'STATUTORY COMPLIANCE & DUTIES',
  },
  {
    id: 'do',
    number: '03',
    headline: 'DO',
    supportingLine: 'Get the work done.',
    description:
      'Practical FM tools, calculators, generators, templates, checklists and AI-powered utilities designed to make everyday FM work easier.',
    cta: 'EXPLORE DO',
    href: '/lobby/do',
    imageSrc: '/images/editorial/entirefm-hvac-refrigerant-check-2000w.webp',
    imageAlt: 'Plantroom technician executing planned preventative maintenance',
    categoryTag: 'PRACTICAL FM TOOLBOX',
  },
  {
    id: 'find',
    number: '04',
    headline: 'FIND',
    supportingLine: 'Find people, suppliers and opportunities.',
    description:
      'FM jobs, contractors, professionals, suppliers, tenders, frameworks and commercial opportunities.',
    cta: 'EXPLORE FIND',
    href: '/lobby/find',
    imageSrc: '/images/editorial/entirefm-site-arrival-2000w.webp',
    imageAlt: 'EntireFM commercial estate fleet arrival and supplier mobilisations',
    categoryTag: 'OPPORTUNITIES & DIRECTORY',
  },
  {
    id: 'learn',
    number: '05',
    headline: 'LEARN',
    supportingLine: 'Build your professional edge.',
    description:
      'Technical briefings, CPD, webinars, guides, case studies, training and practical professional development.',
    cta: 'EXPLORE LEARN',
    href: '/lobby/learn',
    imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'Executive building environment for professional development and CPD education',
    categoryTag: 'PROFESSIONAL DEVELOPMENT & CPD',
  },
  {
    id: 'connect',
    number: '06',
    headline: 'CONNECT',
    supportingLine: 'Learn from the profession.',
    description:
      'Ask The Lobby, practitioner questions, industry discussions, roundtables, events and carefully moderated professional interaction.',
    cta: 'EXPLORE CONNECT',
    href: '/lobby/connect',
    imageSrc: '/images/editorial/entirefm-sheffield-rooftop-survey-1920w.webp',
    imageAlt: 'Facilities leaders and building engineers collaborating on commercial estate challenge',
    categoryTag: 'PEER NETWORK & ROUNDTABLES',
  },
];

export function LobbyCoreDestinations() {
  return (
    <section
      id="lobby-destinations"
      aria-label="The Six Core Lobby Destinations"
      className="bg-[#FAF9F7] py-16 sm:py-20 lg:py-24 border-b border-neutral-200/90 scroll-mt-20"
    >
      <div className="container-wide space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200/90">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="h-px w-5 bg-brand-electric" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                THE LOBBY ARCHITECTURE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-neutral-900 tracking-tight">
              Six Core Areas of The Lobby
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed max-w-2xl">
              An authoritative professional platform structured around the essential responsibilities of modern facilities management, estates governance, and building operations.
            </p>
          </div>

          <div className="text-xs font-light text-neutral-500 shrink-0">
            <span className="font-mono text-neutral-400">06</span> Primary Destinations
          </div>
        </div>

        {/* 3x2 Responsive Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {LOBBY_CORE_DESTINATIONS.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative isolate flex flex-col justify-between overflow-hidden rounded-[4px] min-h-[380px] sm:min-h-[420px] lg:min-h-[440px] p-7 sm:p-8 bg-neutral-950 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {/* Cinematic Background Image Layer */}
              <div className="absolute inset-0 z-0 bg-neutral-950 overflow-hidden pointer-events-none">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  priority={card.number === '01' || card.number === '02'}
                />

                {/* Atmospheric Dark Editorial Overlay */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/35 transition-opacity duration-500 group-hover:from-black/98 group-hover:via-black/75 group-hover:to-black/45"
                />

                {/* Subtle hairline edge */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 border border-white/10 group-hover:border-white/25 transition-colors rounded-[4px]"
                />
              </div>

              {/* Content Layer (Guaranteed above background image & scrim) */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                
                {/* Top Meta: Number + Category Tag */}
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs tracking-widest text-white/60 group-hover:text-white transition-colors">
                    {card.number}
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/80 bg-white/15 backdrop-blur-xs px-2.5 py-1 rounded-[2px] border border-white/20">
                    {card.categoryTag}
                  </span>
                </div>

                {/* Bottom Content Treatment */}
                <div className="space-y-3 pt-6">
                  
                  {/* Large Category Title & Supporting Line */}
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-none">
                      {card.headline}
                    </h3>
                    <p className="text-sm sm:text-base font-light text-white/95 mt-2 leading-snug">
                      {card.supportingLine}
                    </p>
                  </div>

                  {/* Supporting Description */}
                  <p className="text-xs font-light text-white/80 leading-relaxed line-clamp-3">
                    {card.description}
                  </p>

                  {/* Primary Action Button / Indicator */}
                  <div className="pt-3 flex items-center justify-between border-t border-white/20 text-xs font-normal tracking-wider uppercase text-white/90 group-hover:text-white transition-colors">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      {card.cta}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 text-white/70 group-hover:text-white" />
                  </div>

                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
