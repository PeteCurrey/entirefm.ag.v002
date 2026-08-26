import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { VettingPillarMatrix } from '@/components/suppliers/interactive/VettingPillarMatrix';
import { ComplianceRadarGraphic } from '@/components/suppliers/interactive/ComplianceRadarGraphic';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, AlertTriangle, Building, Award } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/vetting', {
  title: 'Supplier Vetting & Assurance Framework | Risk-Based Governance | EntireFM',
  description:
    'Learn how EntireFM vets subcontractors and specialist suppliers using a proportionate, risk-based assurance framework covering corporate standing, insurance, health & safety, and trade certifications.',
});

export default function VettingPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Vetting & Assurance Framework', url: '/suppliers/vetting' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="SUPPLY CHAIN GOVERNANCE // RISK-BASED VETTING"
          title="Proportionate vetting."
          subtitle="Uncompromising assurance."
          intro="EntireFM’s Supplier Assurance Framework establishes verified competence, valid insurances, and robust health and safety systems—proportionate to trade risk and site environment."
          imageSrc="/images/editorial/entirefm-site-arrival-2000w.webp"
          imageAlt="EntireFM compliance officers conducting on-site contractor induction"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Insurance Thresholds', href: '/suppliers/compliance' }}
          facts={[
            { figure: '6 Pillars', label: 'Assurance Framework', detail: 'Tailored to trade risk & scope' },
            { figure: '£5M–£10M', label: 'Public Liability', detail: 'Direct broker verification' },
            { figure: 'SSIP Aligned', label: 'Health & Safety', detail: 'CHAS, SafeContractor, SMAS' },
          ]}
        />

        <TrustBar />

        {/* 2. 6-PILLAR INTERACTIVE VETTING MATRIX */}
        <VettingPillarMatrix />

        {/* 3. PROPORTIONAL RISK-BASED TIERING SECTION */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">RISK-PROPORTIONAL MODEL</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                Why Our Vetting Is Strictly Proportional
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We believe heavy, one-size-fits-all questionnaires penalise regional craft SMEs without improving site safety. Our framework scales dynamically based on trade hazard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200/80 inline-block font-medium">
                  LOW RISK TIER // FAST-TRACK
                </span>
                <h3 className="text-xl font-light text-slate-900">Ground-Level &amp; Low-Hazard Trades</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Cleaners, grounds maintenance, interior decorators, and pest control. 
                </p>
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700 font-light">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>£5M Public Liability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Basic COSHH &amp; Risk Assessments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Turnaround: 1–2 business days</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200/80 inline-block font-medium">
                  MEDIUM RISK TIER // CORE FM
                </span>
                <h3 className="text-xl font-light text-slate-900">Building Services &amp; Light M&amp;E</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Plumbers, joiners, low-voltage electrical installers, and automatic door technicians.
                </p>
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700 font-light">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>£5M–£10M Public Liability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Trade Competence (NICEIC, CSCS)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>Turnaround: 2–3 business days</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-brand-pink bg-rose-50 px-2.5 py-1 rounded-sm border border-rose-200/80 inline-block font-semibold">
                  HIGH HAZARD TIER // STATUTORY
                </span>
                <h3 className="text-xl font-light text-slate-900">Commercial Gas, HVAC, High-Rise Access</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Chillers, steam boilers, rope access façade maintenance, and high voltage distribution.
                </p>
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700 font-light">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0" />
                    <span>£10M PL + £2M–£5M PI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0" />
                    <span>Gas Safe, REFCOM, IRATA, SSIP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0" />
                    <span>Turnaround: 3–5 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. DYNAMIC COMPLIANCE RADAR (DARK BREAK) */}
        <ComplianceRadarGraphic />

        {/* 5. CALL TO ACTION */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink">
              SUPPLIER ONBOARDING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-white">
              Ready to verify your business credentials?
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-xl mx-auto font-light leading-relaxed">
              Submit your company details, trade disciplines, and insurance levels for prompt Stage 1 qualification.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Begin Supplier Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/onboarding" className="btn-ghost-light">
                Explore Onboarding Stages
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="ASSURANCE &amp; GOVERNANCE"
          heading="Related supplier information"
          links={[
            {
              title: 'Supplier Standards',
              href: '/suppliers/standards',
              description: 'Operational principles, ethical benchmarks, and the Supplier Code of Conduct.',
              tag: 'STANDARDS',
            },
            {
              title: 'Onboarding Process',
              href: '/suppliers/onboarding',
              description: '4-phase structured compliance verification, agreement execution, and mobilization.',
              tag: 'ONBOARDING',
            },
            {
              title: 'Compliance & Safety',
              href: '/suppliers/compliance',
              description: 'Statutory insurance matrices, dynamic RAMS, and competence card rules.',
              tag: 'COMPLIANCE',
            },
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: '12-stage operational journey from registration to work delivery.',
              tag: 'PROCESS',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
