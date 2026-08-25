'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { SUPPLIER_FAQS, FAQEntry } from '@/config/supplier-data';

export type { FAQEntry };
export { SUPPLIER_FAQS };

export function SupplierFAQSection({ initialCategory }: { initialCategory?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>(initialCategory || 'all');

  const filtered = filter === 'all'
    ? SUPPLIER_FAQS
    : SUPPLIER_FAQS.filter((f) => f.category === filter);

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-12">
          <span className="eyebrow eyebrow-light">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Supplier &amp; Partner Network FAQs
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Clear answers regarding vetting criteria, insurance thresholds, commercial workflows, work order allocation, and partnership models.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'onboarding', label: 'Onboarding & SMEs' },
              { id: 'compliance', label: 'Compliance & Insurance' },
              { id: 'delivery', label: 'Work Orders & Delivery' },
              { id: 'commercial', label: 'Commercial & Invoicing' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setOpenIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-normal transition-colors ${
                  filter === tab.id
                    ? 'bg-slate-900 text-white font-light'
                    : 'bg-[#FAF9FB] text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
          {filtered.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-4 text-left group"
                >
                  <span className="text-base font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-pink' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-light pr-6">
                    {faq.answer}
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
