import React from "react";
import { HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface ContractorFaqAccordionProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
}

export function ContractorFaqAccordion({
  title = "Frequently Asked Questions",
  subtitle = "Clear operational answers on contractor documentation, compliance, and FM requirements.",
  faqs,
}: ContractorFaqAccordionProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200" aria-label="Frequently Asked Questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container-custom max-w-4xl space-y-10">
        <div className="space-y-3">
          <span className="eyebrow eyebrow-light">QUESTIONS &amp; ANSWERS</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group border border-slate-200 rounded-sm bg-white overflow-hidden shadow-xs transition-colors open:bg-[#FAFAF8]"
            >
              <summary className="p-5 text-sm sm:text-base font-medium text-slate-900 cursor-pointer flex items-center justify-between gap-4 hover:text-[#EA580C] select-none">
                <span>{faq.question}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200 text-lg">
                  &darr;
                </span>
              </summary>
              <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 font-light leading-relaxed border-t border-slate-100 pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
