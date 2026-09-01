'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ChevronDown, ChevronRight, Wrench } from 'lucide-react';
import type { SectorSystemGroup } from '@/data/sectors/archetypes';

export interface SectorSystemItem {
  id: string;
  number: string;
  category: string;
  headline: string;
  items: string[];
  image?: string;
  imageAlt?: string;
}

export interface SectorSystemsNavigatorProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  groups: SectorSystemGroup[];
  fallbackImage?: string;
}

export function SectorSystemsNavigator({
  eyebrow = 'ESTATE DISCIPLINES & SCOPES',
  headline,
  subheadline,
  groups,
  fallbackImage = '/images/editorial/entirefm-hvac-plant-deck-2000w.webp',
}: SectorSystemsNavigatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(0);

  if (!groups || groups.length === 0) return null;

  const currentGroup = groups[activeIndex] || groups[0];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* Desktop Layout (>= 1024px): Interactive Left Discipline Index + Right Active Panel */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-start">
          {/* Left Column: Numbered Vertical Disciplines List */}
          <div className="col-span-5 divide-y divide-slate-200 border-y border-slate-200">
            {groups.map((group, idx) => {
              const isActive = activeIndex === idx;
              const numStr = String(idx + 1).padStart(2, '0');
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full text-left py-5 px-4 flex items-center justify-between transition-all duration-200 ${
                    isActive
                      ? 'bg-white border-l-2 border-brand-pink shadow-sm pl-5'
                      : 'hover:bg-slate-100/70 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`font-normal text-xs${isActive ? 'text-brand-pink font-medium' : 'text-slate-400'}`}>
                      {numStr}
                    </span>
                    <span className={`text-base font-light tracking-tight truncate ${isActive ? 'text-slate-900 font-normal' : 'text-slate-700'}`}>
                      {group.category}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-brand-pink translate-x-1' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Discipline Showcase with Photo & Structured Tasks */}
          <div className="col-span-7 bg-white border border-slate-200 rounded-sm p-8 sm:p-10 shadow-sm relative space-y-6">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-brand-pink block mb-2">
                DISCIPLINE {String(activeIndex + 1).padStart(2, '0')} // {currentGroup.category}
              </span>
              <h3 className="text-2xl font-light text-slate-900 tracking-tight leading-snug">
                {currentGroup.headline}
              </h3>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-light uppercase tracking-wider text-slate-400 block mb-4">
                MAINTENANCE SCOPE &amp; STATUTORY PROTOCOLS:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentGroup.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-light leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-light">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-brand-pink" />
                Self-Delivered Engineering
              </span>
              <span className="font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                SFG20 Certified Routine
              </span>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Accordion (< 1024px) */}
        <div className="lg:hidden space-y-3">
          {groups.map((group, idx) => {
            const isOpen = mobileOpenIndex === idx;
            const numStr = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setMobileOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-brand-pink font-medium">
                      {numStr}
                    </span>
                    <span className="text-sm font-light text-slate-900">
                      {group.category}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-brand-pink' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-light text-slate-900 pt-3">
                      {group.headline}
                    </h4>
                    <ul className="space-y-2">
                      {group.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2 text-xs text-slate-700 font-light leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
