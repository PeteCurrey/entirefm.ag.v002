'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/lib/routes/route-schema';

export interface SectorFAQProps {
  eyebrow?: string;
  headline?: string;
  subline?: string;
  faqs: FAQItem[];
}

export function SectorFAQ({
  eyebrow = 'EXPERT GUIDANCE',
  headline = 'Frequently Asked Questions',
  subline = 'Clear answers on contract mobilisation, access windows, statutory compliance, and operational governance.',
  faqs,
}: SectorFAQProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3.5">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-xs font-light uppercase tracking-[0.2em] text-slate-500">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            {subline}
          </p>
        </div>

        {/* Minimal Understated Accordion List (Thin Hairlines) */}
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 py-2 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-light text-slate-900 group-hover:text-brand-pink-dark transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-pink' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pt-2 pb-4 text-sm text-slate-600 font-light leading-relaxed pr-6">
                    <p>{faq.answer}</p>
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
