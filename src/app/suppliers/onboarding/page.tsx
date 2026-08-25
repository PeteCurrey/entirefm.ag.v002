import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { SupplierLifecycleModel } from '@/components/suppliers/SupplierLifecycleModel';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, FileText, Upload, Clock, UserCheck, ShieldCheck, Laptop } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/onboarding', {
  title: 'Supplier Onboarding Journey & Lifecycle Model | EntireFM',
  description:
    'Learn about EntireFM’s structured 10-stage supplier onboarding process and digital lifecycle model, from initial application to preferred partner activation.',
});

export default function OnboardingPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Onboarding Journey', url: '/suppliers/onboarding' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="SUPPLIER MOBILISATION // ONBOARDING ROADMAP"
          title="Structured onboarding."
          subtitle="Seamless work allocation."
          intro="Our onboarding framework is designed to get qualified contractors and specialist SMEs approved efficiently while ensuring total regulatory and commercial compliance."
          imageSrc="/images/editorial/entirefm-switchroom-survey-2000w.webp"
          imageAlt="EntireFM compliance onboarding team reviewing supplier documentation"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Required Documents', href: '/suppliers/compliance' }}
          facts={[
            { figure: '10 Stages', label: 'Structured Journey', detail: 'From registration to portal dispatch' },
            { figure: '3-5 Days', label: 'Average Review SLA', detail: 'Rapid Stage 1 due diligence' },
            { figure: 'Direct Support', label: 'Procurement Desk', detail: 'Dedicated onboarding team' },
          ]}
        />

        <TrustBar />

        {/* 10-STAGE ONBOARDING SEQUENCE */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">ONBOARDING TIMELINE</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                The 10-Stage Supplier Onboarding Workflow
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We maintain clear distinction between our <strong>current online qualification process</strong> and the forthcoming <strong>automated CAFM portal onboarding workflow</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: '01', title: 'Business Profile', desc: 'Submit registered legal details, company numbers, and operational structure.' },
                { step: '02', title: 'Scope & Coverage', desc: 'Select specific trade disciplines and primary geographic operating regions.' },
                { step: '03', title: 'Insurance Upload', desc: 'Provide current Public, Employers, and Professional Indemnity schedules.' },
                { step: '04', title: 'Competency Audit', desc: 'Verify trade scheme registrations (Gas Safe, NICEIC, F-Gas, IRATA, SSIP).' },
                { step: '05', title: 'Commercial Info', desc: 'Provide VAT registration, standard rate cards, and verified bank details.' },
                { step: '06', title: 'EntireFM Review', desc: 'Due diligence assessment by our supply chain governance desk.' },
                { step: '07', title: 'Approval Decision', desc: 'Formal approval notification and supplier status classification.' },
                { step: '08', title: 'Supplier Agreement', desc: 'Execute standard subcontract terms and Code of Conduct acceptance.' },
                { step: '09', title: 'Portal Activation', desc: 'Issuance of EntireCAFM mobile credentials and dispatch training.' },
                { step: '10', title: 'Work Allocation', desc: 'Eligible for automated work order dispatch across client estates.' },
              ].map((stage) => (
                <div key={stage.step} className="p-5 bg-[#FAF9FB] border border-slate-200 rounded-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-light text-brand-pink mb-2 block">
                      STAGE {stage.step}
                    </span>
                    <h3 className="text-sm font-normal text-slate-900 mb-1">{stage.title}</h3>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPLIER LIFECYCLE MODEL */}
        <SupplierLifecycleModel />

        {/* PERFORMANCE & PROGRESSION */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="eyebrow eyebrow-light">PERFORMANCE GOVERNANCE</span>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                  Active Supplier Performance Management
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                  Approved supplier status is never passive. EntireFM evaluates supply chain performance continuously across 12 quantitative metrics:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    'SLA Response & Attendance Times',
                    'First-Time Fix Ratios',
                    'Evidence & Photographic Quality',
                    'Statutory Certificate Turnaround',
                    'Operative H&S & RAMS Compliance',
                    'Invoice Accuracy vs Rate Card',
                    'Client & Tenant Feedback Scores',
                    'Environmental & Waste Compliance',
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 p-2.5 bg-[#FAF9FB] rounded-sm border border-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-graphite text-white p-8 sm:p-10 rounded-sm border border-brand-edge-dark space-y-5">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright">
                  COMMERCIAL REWARDS
                </span>
                <h3 className="text-xl font-light text-white">
                  Progression to Preferred Partner Status
                </h3>
                <p className="text-xs sm:text-sm text-brand-mist/80 font-light leading-relaxed">
                  Consistently high-performing suppliers unlock significant commercial advantages, including priority work order dispatch, long-term estate frameworks, and regional exclusivity.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <Link href="/suppliers/apply" className="btn-primary text-xs w-full justify-center">
                    Start Your Application <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
