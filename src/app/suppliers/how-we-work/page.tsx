import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ScopedApprovalGraphic } from '@/components/suppliers/ScopedApprovalGraphic';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench, Clock, FileCheck, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'How We Work With Suppliers | EntireFM Supply Chain',
  description: 'Understand EntireFM’s 12-step supplier lifecycle: from initial screening and risk-based assurance to scoped approval and performance monitoring.',
};

export default function HowWeWorkPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'How We Work', url: '/suppliers/how-we-work' },
  ];

  const steps = [
    { num: '01', title: 'Registration & Initial Profile', desc: 'Submit company profile, trade disciplines, and geographic service areas.', href: '/suppliers/apply' },
    { num: '02', title: 'Risk-Based Assurance Plan', desc: 'Our engine generates a tailored compliance checklist based on trade and risk.', href: '/suppliers/vetting' },
    { num: '03', title: 'Evidence Submission', desc: 'Upload insurance schedules, trade accreditations, and H&S policies to the vault.', href: '/suppliers/compliance' },
    { num: '04', title: 'Technical Competency Review', desc: 'Specialist desks review Gas Safe, F-Gas, NICEIC, and safe working RAMS.', href: '/suppliers/standards' },
    { num: '05', title: 'Scoped Approval Decision', desc: 'Approval is granted for specific disciplines and confirmed operating regions.', href: '/suppliers/vetting' },
    { num: '06', title: 'Digital Agreement & Code of Conduct', desc: 'Sign framework terms and execute the Supplier Code of Conduct.', href: '/suppliers/onboarding' },
    { num: '07', title: 'Dual-Control Bank Verification', desc: 'Submit masked bank remittance details with independent phone verification.', href: '/suppliers/onboarding' },
    { num: '08', title: 'Portal Activation', desc: 'Access the Supplier Portal for jobs, document tracking, and action items.', href: '/supplier-portal/sign-in' },
    { num: '09', title: 'Work Opportunities & Allocation', desc: 'Receive relevant work opportunities matched to your approved scope.', href: '/suppliers/partner-network' },
    { num: '10', title: 'Mobilisation & Delivery', desc: 'Acknowledge dispatch, assign engineers, and execute safe site delivery.', href: '/suppliers/how-we-work' },
    { num: '11', title: 'Evidence & Invoicing', desc: 'Upload digital service sheets with photos; submit invoices against authorized POs.', href: '/suppliers/faq' },
    { num: '12', title: 'Ongoing Compliance & Radar', desc: 'Automated 90/60/30-day reminders ensure continuous accreditation validity.', href: '/suppliers/compliance' },
  ];

  const relatedLinks = [
    {
      title: 'Supplier Standards',
      href: '/suppliers/standards',
      description: 'H&S, quality, minimum insurances, and Code of Conduct expectations.',
      tag: 'STANDARDS',
    },
    {
      title: 'Supplier Vetting',
      href: '/suppliers/vetting',
      description: 'The 6-pillar risk-proportional assessment framework before site dispatch.',
      tag: 'ASSURANCE',
    },
    {
      title: 'Onboarding Process',
      href: '/suppliers/onboarding',
      description: '4-phase structured induction, verification, and digital agreement execution.',
      tag: 'ONBOARDING',
    },
    {
      title: 'Compliance & Safety',
      href: '/suppliers/compliance',
      description: 'Insurance minimums, dynamic RAMS, CSCS/SKILLcard, and certificate management.',
      tag: 'COMPLIANCE',
    },
    {
      title: 'Supplier FAQ',
      href: '/suppliers/faq',
      description: 'Frequently asked questions on vetting intervals, rate cards, and payment terms.',
      tag: 'SUPPORT',
    },
    {
      title: 'Start Supplier Application',
      href: '/suppliers/apply',
      description: 'Submit your pre-qualification details to join our nationwide supply chain.',
      tag: 'APPLY',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-20 lg:py-28">
          <div className="container-custom max-w-5xl space-y-6">
            <Breadcrumbs items={breadcrumbs} />

            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-pink block font-bold">
                OPERATIONAL LIFECYCLE &amp; PROCUREMENT APPROACH
              </span>
              <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white max-w-3xl leading-tight">
                How EntireFM Works with Suppliers
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
                A structured, transparent, and auditable operational journey from registration to scoped approval and performance-monitored service delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Narrative Contextual Framework Strip */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 font-light">
              <div className="p-5 bg-[#FAF9FB] rounded-sm border border-slate-200/80 space-y-2">
                <span className="font-mono text-[10px] uppercase text-brand-pink font-semibold">1. RIGOROUS STANDARDS</span>
                <p>
                  Every supplier aligns with our published <Link href="/suppliers/standards" className="text-slate-900 font-normal underline hover:text-brand-pink">Supplier Standards</Link> and passes <Link href="/suppliers/vetting" className="text-slate-900 font-normal underline hover:text-brand-pink">proportional 6-pillar vetting</Link> prior to site allocation.
                </p>
              </div>
              <div className="p-5 bg-[#FAF9FB] rounded-sm border border-slate-200/80 space-y-2">
                <span className="font-mono text-[10px] uppercase text-brand-pink font-semibold">2. STREAMLINED ONBOARDING</span>
                <p>
                  Our <Link href="/suppliers/onboarding" className="text-slate-900 font-normal underline hover:text-brand-pink">4-phase onboarding workflow</Link> verifies bank details, insurance limits, and operative competence with zero delays.
                </p>
              </div>
              <div className="p-5 bg-[#FAF9FB] rounded-sm border border-slate-200/80 space-y-2">
                <span className="font-mono text-[10px] uppercase text-brand-pink font-semibold">3. FAIR WORK ALLOCATION</span>
                <p>
                  Work orders are dispatched directly via CAFM based on verified trade competence. Read our <Link href="/suppliers/faq" className="text-slate-900 font-normal underline hover:text-brand-pink">Supplier FAQ</Link> or <Link href="/suppliers/apply" className="text-brand-pink font-medium hover:underline">apply now →</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 container-custom max-w-5xl space-y-16">
          {/* 12 Steps */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">END-TO-END JOURNEY</span>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900">The 12-Stage Supplier Lifecycle</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-light">
              {steps.map((s) => (
                <div key={s.num} className="bg-white border border-slate-200 p-5 rounded-sm shadow-2xs space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-brand-pink font-bold text-sm block mb-1">{s.num}</span>
                    <h3 className="font-medium text-slate-900 text-sm mb-1">{s.title}</h3>
                    <p className="text-slate-600 font-light leading-relaxed text-[11.5px]">{s.desc}</p>
                  </div>
                  {s.href && (
                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <Link href={s.href} className="text-[11px] text-slate-500 hover:text-brand-pink transition-colors inline-flex items-center gap-1">
                        Learn more <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scoped Approval */}
          <ScopedApprovalGraphic />

          {/* Transparency Banner */}
          <CommercialTransparencyBanner />
        </section>

        {/* Contextual Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="SUPPLIER ASSURANCE &amp; GOVERNANCE"
          heading="Related supplier information"
          links={relatedLinks}
        />
      </main>

      <Footer />
    </div>
  );
}
