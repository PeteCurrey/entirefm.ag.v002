import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SUPPLIER_FAQS } from '@/config/supplier-data';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'Supplier Network FAQ | EntireFM',
  description: 'Frequently asked questions for contractors, specialists, OEMs, and technology partners joining the EntireFM Partner Network.',
};

export default function SupplierFaqPage() {
  const categories = [
    { key: 'GENERAL', label: 'General & Eligibility' },
    { key: 'ASSURANCE', label: 'Vetting & Scoped Approvals' },
    { key: 'MEMBERSHIP', label: 'Membership & Fees' },
    { key: 'PAYMENTS', label: 'Operational Payments & Billing' },
    { key: 'OPERATIONS', label: 'Work Allocation & Performance' },
    { key: 'EVENTS_PARTNERS', label: 'Events & Industry Partners' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        <section className="bg-slate-900 text-white py-16 lg:py-24">
          <div className="container-custom max-w-5xl space-y-4">
            <span className="text-[11px] font-light uppercase tracking-wider text-brand-pink font-bold">
              TRANSPARENT ANSWERS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight tracking-tight text-white max-w-3xl">
              Supplier &amp; Partner Network FAQ
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl">
              Direct, transparent answers regarding vetting, scoped approvals, commercial fees, operational payments, and work allocation.
            </p>
          </div>
        </section>

        <section className="py-16 container-custom max-w-5xl space-y-12">
          {categories.map((cat) => {
            const items = SUPPLIER_FAQS.filter((f) => f.category === cat.key);
            if (items.length === 0) return null;

            return (
              <div key={cat.key} className="space-y-4">
                <h2 className="text-lg font-light text-slate-900 pb-2 border-b border-slate-200">
                  {cat.label}
                </h2>

                <div className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                  {items.map((item) => (
                    <details key={item.id} className="group p-5 hover:bg-slate-50/50 transition-colors">
                      <summary className="font-bold text-slate-900 text-sm cursor-pointer list-none flex items-center justify-between gap-4">
                        <span>{item.question}</span>
                        <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                      </summary>
                      <p className="text-xs text-slate-600 font-light mt-3 leading-relaxed font-sans">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-8">
            <CommercialTransparencyBanner />
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="SUPPLIER INFORMATION &amp; RESOURCES"
          heading="Related supplier information"
          links={[
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: 'End-to-end 12-stage lifecycle from registration to work delivery.',
              tag: 'PROCESS',
            },
            {
              title: 'Membership & Fees',
              href: '/suppliers/membership',
              description: 'Commercial transparency on membership tiers, fees, and procurement separation.',
              tag: 'COMMERCIAL',
            },
            {
              title: 'Supplier Vetting',
              href: '/suppliers/vetting',
              description: '6-pillar assurance framework and trade competency benchmarks.',
              tag: 'VETTING',
            },
            {
              title: 'Compliance & Insurance',
              href: '/suppliers/compliance',
              description: 'Insurance thresholds, RAMS, CSCS, and certification requirements.',
              tag: 'COMPLIANCE',
            },
            {
              title: 'Become a Supplier',
              href: '/suppliers/apply',
              description: 'Start your pre-qualification submission for the EntireFM supply chain.',
              tag: 'APPLY',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
