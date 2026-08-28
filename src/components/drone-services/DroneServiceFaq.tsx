'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface DroneServiceFaqProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  faqs: FAQItem[];
  className?: string;
}

export function DroneServiceFaq({
  eyebrow = 'SERVICE-SPECIFIC FAQ',
  title = 'Frequently Asked Questions',
  intro,
  faqs,
  className = '',
}: DroneServiceFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-20 sm:py-28 bg-white border-b border-slate-200 text-slate-900 font-sans ${className}`}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Editorial Context (~35%) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-pink" />
              <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                {eyebrow}
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-[1.1]">
              {title}
            </h2>
            
            {intro && (
              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed pt-1">
                {intro}
              </p>
            )}
          </div>

          {/* Right Column: Clean Editorial Full-Width Accordion (~65%) */}
          <div className="lg:col-span-8 divide-y divide-slate-200 border-t border-b border-slate-200">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full py-6 sm:py-7 text-left flex items-start justify-between gap-6 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                  >
                    <span className={`text-base sm:text-lg font-normal transition-colors pr-2 leading-snug ${
                      isOpen ? 'text-brand-pink' : 'text-slate-900 group-hover:text-brand-pink'
                    }`}>
                      {faq.question}
                    </span>

                    <span className={`shrink-0 mt-0.5 p-1 rounded-sm transition-all duration-200 ${
                      isOpen ? 'bg-brand-pink/10 text-brand-pink rotate-180' : 'text-slate-400 group-hover:text-slate-700'
                    }`}>
                      {isOpen ? (
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      className="pb-7 pr-6 text-sm sm:text-base text-slate-600 font-light leading-relaxed space-y-3"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
