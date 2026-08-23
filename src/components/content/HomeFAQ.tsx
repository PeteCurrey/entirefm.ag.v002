'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight, BookOpen, HelpCircle } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HomeFAQProps {
  faqs: FAQItem[];
}

export function HomeFAQ({ faqs }: HomeFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  // Structured Data Schema for FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="section bg-white border-t border-brand-edge relative overflow-hidden" id="faq">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Sticky Editorial Introduction */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-brand-surface border border-brand-edge">
              <HelpCircle className="h-3.5 w-3.5 text-brand-pink" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-graphite">
                FM QUESTIONS
              </span>
            </div>

            <h2 className="text-display-md text-brand-graphite font-bold tracking-tight leading-tight">
              The questions that matter before you appoint an FM provider
            </h2>

            <p className="text-[15px] leading-relaxed text-slate-600">
              Clear answers on contract models, statutory compliance auditing, multi-site mobilization, and how planned preventative maintenance (PPM) works alongside 24/7 reactive emergency attendance.
            </p>

            {/* CTA to National Glossary */}
            <div className="p-6 rounded-sm bg-brand-surface border border-brand-edge space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-graphite">
                <BookOpen className="h-4 w-4 text-brand-pink" />
                Need plain-English term definitions?
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore our full A–Z guide explaining SFG20, EICR, TM44, CAFM, statutory registers, and core facilities management terminology.
              </p>
              <Link
                href="/facilities-management-glossary"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-pink hover:text-brand-magenta transition-colors"
              >
                <span>Explore the FM Glossary</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Accordion (All content server-rendered) */}
          <div className="lg:col-span-7 divide-y divide-brand-edge border-y border-brand-edge">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-5 sm:py-6 transition-colors duration-200">
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 text-left group"
                  >
                    <span className="text-base sm:text-lg font-bold tracking-tight text-brand-graphite group-hover:text-brand-pink transition-colors">
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border transition-all duration-300 ${
                        isOpen
                          ? 'border-brand-pink bg-brand-pink text-white'
                          : 'border-brand-edge bg-brand-surface text-slate-500 group-hover:border-brand-pink/50 group-hover:text-brand-pink'
                      }`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>

                  {/* Rendered in DOM for search engine indexing; styled with grid transition */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="text-[14.5px] leading-relaxed text-slate-600 pr-4 sm:pr-8">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
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
