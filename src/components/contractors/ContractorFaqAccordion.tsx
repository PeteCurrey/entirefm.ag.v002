'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContractorFaqAccordionProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
  includeSchema?: boolean;
}

export function ContractorFaqAccordion({
  eyebrow = 'FREQUENTLY ASKED QUESTIONS',
  title = 'Contractor Questions & Answers',
  subtitle = 'Clear answers regarding compliance, documentation, network standards, and operational expectations.',
  faqs,
  includeSchema = true,
}: ContractorFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="space-y-6">
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      )}

      <div className="space-y-2">
        {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
        <h3 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-3 pt-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 rounded-sm overflow-hidden bg-white shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span>{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#EA580C]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm font-light text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FAFAF8]">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
