import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { OnboardingPhaseTimeline } from '@/components/suppliers/interactive/OnboardingPhaseTimeline';
import { ScopedApprovalGraphic } from '@/components/suppliers/ScopedApprovalGraphic';
import { PaymentPerformanceBanner } from '@/components/suppliers/interactive/PaymentPerformanceBanner';
import { SupplierLifecycleModel } from '@/components/suppliers/SupplierLifecycleModel';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, FileText, Upload, Clock, UserCheck, ShieldCheck, Laptop, Lock } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/onboarding', {
  title: 'Supplier Onboarding Journey & Mobilisation Protocol | EntireFM',
  description:
    'Learn about EntireFM’s structured 4-phase supplier onboarding protocol, document vault due diligence, dual-control banking security, and digital CAFM dispatch activation.',
});

export default function OnboardingPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Onboarding Journey', url: '/suppliers/onboarding' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
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
            { figure: '4 Phases', label: 'Structured Protocol', detail: 'From profile to live CAFM dispatch' },
            { figure: '1-2 Days', label: 'Average Review SLA', detail: 'Rapid desk due diligence' },
            { figure: 'Dual-Control', label: 'Banking Security', detail: 'Independent voice verification' },
          ]}
        />

        <TrustBar />

        {/* 2. 4-PHASE ONBOARDING TIMELINE ENGINE */}
        <OnboardingPhaseTimeline />

        {/* 3. DUAL-CONTROL BANKING VERIFICATION & ANTI-FRAUD SECTION */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="eyebrow eyebrow-light">GOVERNANCE &amp; FRAUD PREVENTION</span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
                  Dual-Control Bank Mandate Verification
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                  Supplier payment security is of paramount importance. To protect our supply chain from invoice fraud, CEO impersonation, and fraudulent mandate change requests, EntireFM enforces a strict dual-control protocol.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-sm border border-slate-200 shadow-sm">
                    <Lock className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-900">Masked Remittance Database</h4>
                      <p className="text-[12px] text-slate-600 font-light mt-0.5">Bank sort codes and account numbers are encrypted at rest with zero plain-text display across portal logs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-white rounded-sm border border-slate-200 shadow-sm">
                    <UserCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-slate-900">Independent Out-of-Band Phone Call</h4>
                      <p className="text-[12px] text-slate-600 font-light mt-0.5">Prior to releasing the first BACS remittance, our finance director conducts a verbal telephone confirmation with your designated financial officer.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-900 text-white p-8 sm:p-10 rounded-sm border border-slate-800 shadow-xl space-y-5">
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink block">
                  ZERO PAYMENT HIJACKING PLEDGE
                </span>
                <h3 className="text-xl font-light text-white">
                  How We Protect Your Invoiced Earnings
                </h3>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  No bank change request sent via email will ever be processed without physical voice verification to your registered company landline. This eliminates 100% of phishing and unauthorized account change attempts.
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-light">100% Protected Remittances</span>
                  <Link href="/suppliers/apply" className="btn-primary text-xs py-2 px-4">
                    Begin Qualification <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SCOPED APPROVAL ARCHITECTURE */}
        <ScopedApprovalGraphic />

        {/* 5. PAYMENT & PERFORMANCE COMMERCIAL COMMITMENT (DARK BREAK) */}
        <PaymentPerformanceBanner />

        {/* 6. CALL TO ACTION */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-4xl space-y-6">
            <span className="text-xs font-light uppercase tracking-wider text-brand-pink">
              SUPPLIER ONBOARDING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-white">
              Start Your Onboarding Journey Today
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-2xl mx-auto font-light leading-relaxed">
              Submit your Stage 1 company profile. Our supply chain onboarding desk will review your trade scope and guide you through evidence vault verification.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Start Stage 1 Application <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/vetting" className="btn-ghost-light">
                Review 6-Pillar Vetting
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="ONBOARDING &amp; MOBILISATION"
          heading="Related supplier information"
          links={[
            {
              title: 'Supplier Vetting',
              href: '/suppliers/vetting',
              description: 'The 6-pillar assessment framework applied before site allocation.',
              tag: 'VETTING',
            },
            {
              title: 'Supplier Standards',
              href: '/suppliers/standards',
              description: 'Operational principles, ethical benchmarks, and the Supplier Code of Conduct.',
              tag: 'STANDARDS',
            },
            {
              title: 'Compliance & Safety',
              href: '/suppliers/compliance',
              description: 'Statutory insurance schedules, dynamic RAMS, and competence matrices.',
              tag: 'COMPLIANCE',
            },
            {
              title: 'How We Work',
              href: '/suppliers/how-we-work',
              description: '12-stage operational journey from onboarding to continuous delivery.',
              tag: 'PROCESS',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
