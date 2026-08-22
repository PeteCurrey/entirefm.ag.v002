'use client';

import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export function CapabilityList({
  title,
  subtitle,
  items,
  capabilities,
}: {
  title?: string;
  subtitle?: string;
  items?: Array<{ name: string; description: string; tag?: string }>;
  capabilities?: Array<{ name: string; description: string; tag?: string }>;
}) {
  const displayItems = capabilities || items || [];
  return (
    <div className="my-10">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <span className="badge-technical">Technical Capabilities</span>}
          {title && <h3 className="text-2xl font-bold tracking-tight text-brand-navy mt-1">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayItems.map((item, idx) => (
          <div key={idx} className="p-5 bg-brand-surface border border-brand-border rounded-sm flex items-start gap-3 shadow-subtle">
            <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-brand-navy">{item.name}</h4>
                {item.tag && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white border border-brand-border text-slate-500 rounded-sm">
                    {item.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export function FAQAccordion({
  title = 'Frequently Asked Questions',
  subtitle = 'Common inquiries regarding contract scopes, SLAs, compliance audits, and onboarding.',
  faqs,
}: {
  title?: string;
  subtitle?: string;
  faqs: Array<{ question: string; answer: string }>;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-brand-surface border-t border-brand-border">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <span className="badge-technical">Technical & Commercial FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-navy mt-2">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">{subtitle}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-brand-border rounded-sm overflow-hidden shadow-subtle"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left font-bold text-sm text-brand-navy flex items-center justify-between gap-4 hover:text-brand-gold-dark transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-gold shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-brand-border/40">
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
