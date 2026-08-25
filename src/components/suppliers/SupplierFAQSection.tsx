'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export interface FAQEntry {
  question: string;
  answer: string;
  category: 'onboarding' | 'compliance' | 'commercial' | 'delivery';
}

export const SUPPLIER_FAQS: FAQEntry[] = [
  {
    category: 'onboarding',
    question: 'Who can become an EntireFM supplier or partner?',
    answer: 'We partner with established national service providers, high-quality regional specialist SMEs, independent trade contractors, OEMs, equipment manufacturers, and technology providers across the UK. Requirements are proportionate to the trade and operational risk.',
  },
  {
    category: 'onboarding',
    question: 'Do you work with regional SMEs and independent contractors?',
    answer: 'Yes. Regional SMEs and independent specialist contractors form an essential pillar of our national operating model. We deliberately match works against regional proximity and specialist craft rather than mandating nationwide infrastructure for all suppliers.',
  },
  {
    category: 'onboarding',
    question: 'Do I need national coverage to work with EntireFM?',
    answer: 'No. While we maintain national frameworks, we actively onboard regional specialists covering specific counties, cities (such as London, Manchester, Birmingham, Sheffield, Leeds), or defined postal zones.',
  },
  {
    category: 'compliance',
    question: 'What insurance levels are required for approved status?',
    answer: 'Standard commercial requirements are £5,000,000 (£5M) Public Liability and £10,000,000 (£10M) Employers Liability (where staff are employed). Professional Indemnity insurance is required for design, surveying, and specialist consultancy disciplines. Higher limits (such as £10M or £20M PL) may apply for critical infrastructure and high-risk environments.',
  },
  {
    category: 'compliance',
    question: 'Is SSIP accreditation mandatory for all suppliers?',
    answer: 'SSIP accreditation (such as SafeContractor, CHAS, Constructionline, or SMAS) is our preferred benchmark for health and safety management. Where a smaller specialist contractor does not hold SSIP, we conduct an equivalent Stage 1 Health & Safety due diligence audit covering RAMS, training records, and incident histories.',
  },
  {
    category: 'compliance',
    question: 'What technical trade accreditations are required?',
    answer: 'Accreditations depend strictly on the trade discipline: Gas Safe for commercial gas and heating; NICEIC, NAPIT, or ECA for electrical; F-Gas / REFCOM for air conditioning and refrigeration; IRATA for rope access; IPAF / PASMA for powered access; BAFE / FIA for fire alarms; and LCA for water hygiene.',
  },
  {
    category: 'onboarding',
    question: 'How long does the supplier vetting and onboarding process take?',
    answer: 'Initial application review is completed within 3 to 5 business days. Once supporting insurance certificates, trade tickets, and commercial bank details are verified, your supplier profile is activated for work order allocation.',
  },
  {
    category: 'commercial',
    question: 'Can equipment manufacturers (OEMs) and technology companies partner with EntireFM?',
    answer: 'Yes. We actively collaborate with OEMs, IoT sensor manufacturers, drone survey companies, AI predictive maintenance platforms, and energy technology providers to deploy innovations across our managed estate portfolio.',
  },
  {
    category: 'delivery',
    question: 'How are suppliers selected and allocated work orders?',
    answer: 'Work orders are matched using four parameters: trade discipline, geographic proximity, live SLA availability, and verified compliance status. High-performing suppliers in our Preferred Partner tier receive priority allocation.',
  },
  {
    category: 'delivery',
    question: 'How are work orders and site instructions issued?',
    answer: 'Work instructions are issued digitally through EntireCAFM. Orders include asset metadata, SFG20 task schedules, access permits, site contact details, SLA response windows, and required evidence checklists.',
  },
  {
    category: 'delivery',
    question: 'What evidence is required upon job completion?',
    answer: 'Depending on task type, completion requires time-stamped photographs (before/after), calibrated instrument readings, asset condition grading, and signed technical service sheets or statutory certificates uploaded directly via our digital mobile workflow.',
  },
  {
    category: 'commercial',
    question: 'How are supplier invoices processed and paid?',
    answer: 'Invoices are matched against pre-authorised work orders and validated task completions. We operate clear commercial credit terms with transparent electronic payment runs upon completion sign-off.',
  },
  {
    category: 'commercial',
    question: 'How does a contractor become a Preferred or Strategic Partner?',
    answer: 'Suppliers maintaining consistent SLA compliance, high first-time fix rates, transparent communication, and flawless compliance records are reviewed quarterly for elevation to Preferred Partner status, unlocking multi-site frameworks and regional exclusivity.',
  },
  {
    category: 'compliance',
    question: 'Can subcontractors be used by EntireFM suppliers?',
    answer: 'Second-tier subcontracting is only permitted with prior written approval from EntireFM. Any secondary subcontractor must undergo the identical assurance and vetting process as our direct suppliers.',
  },
  {
    category: 'compliance',
    question: 'Can suppliers update expiring insurance and compliance documents?',
    answer: 'Yes. Our supply chain desk tracks policy expiry dates and requests updated renewals prior to lapse to ensure zero disruption in work order eligibility.',
  },
];

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
                className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-slate-900 text-white font-semibold'
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
                  <span className="text-base font-semibold text-slate-900 group-hover:text-brand-pink transition-colors">
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
