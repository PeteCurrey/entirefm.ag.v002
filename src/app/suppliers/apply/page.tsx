import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { SupplierApplicationForm } from '@/components/suppliers/SupplierApplicationForm';
import { TrustBar } from '@/components/trust/TrustBar';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/apply', {
  title: 'Apply to Become an EntireFM Supplier | Contractor Qualification',
  description:
    'Submit your company profile to join the EntireFM Supplier & Partner Network. Open to regional trade SMEs, specialist engineering contractors, OEMs, and technology providers.',
});

export default function ApplyPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Supplier Application', url: '/suppliers/apply' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="SUPPLIER QUALIFICATION // PHASE 1 INTAKE"
          title="Apply to become an EntireFM supplier."
          subtitle="Join our UK contractor &amp; partner ecosystem."
          intro="Complete this initial qualification application. Our supply chain governance desk will review your trade scope, coverage, and insurance levels against our Assurance Framework."
          imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          imageAlt="EntireFM engineering team on commercial survey"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Jump to Application Form', href: '#application-form' }}
          secondaryCta={{ label: 'Review Vetting Standards', href: '/suppliers/vetting' }}
          facts={[
            { figure: 'Stage 1 Form', label: 'Initial Review', detail: 'Rapid commercial appraisal' },
            { figure: 'SMEs Welcomed', label: 'Regional Focus', detail: 'No mandatory national footprint' },
            { figure: 'Direct Inflow', label: 'Admin Integrated', detail: 'Immediate review queue logging' },
          ]}
        />

        <TrustBar />

        {/* APPLICATION FORM SECTION */}
        <section id="application-form" className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-8">
            {/* 8-Stage Journey & Commercial Disclosure */}
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                  QUALIFICATION WORKFLOW
                </span>
                <h2 className="text-xl font-bold text-slate-900">What Happens When You Apply</h2>
                <p className="text-xs text-slate-600 font-light">
                  A structured, transparent operational journey from initial registration to scoped approval and portal activation.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">1. Register</span>
                  <span className="text-slate-600 text-[11px] font-sans">Initial profile &amp; scope</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">2. Screening</span>
                  <span className="text-slate-600 text-[11px] font-sans">Risk &amp; capability triage</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">3. Assurance</span>
                  <span className="text-slate-600 text-[11px] font-sans">Upload credentials</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">4. Tech Review</span>
                  <span className="text-slate-600 text-[11px] font-sans">Competency check</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">5. Scoped Approval</span>
                  <span className="text-slate-600 text-[11px] font-sans">Trade &amp; region authorisation</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">6. Commercial</span>
                  <span className="text-slate-600 text-[11px] font-sans">Membership if applicable</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">7. Portal Access</span>
                  <span className="text-slate-600 text-[11px] font-sans">Live dashboard setup</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded space-y-0.5">
                  <span className="text-brand-pink font-bold block">8. Work Eligible</span>
                  <span className="text-slate-600 text-[11px] font-sans">Considered for jobs</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded text-xs text-amber-950 space-y-1">
                <span className="font-bold block font-sans">Commercial &amp; Assurance Disclosure:</span>
                <p className="text-[11.5px] leading-relaxed font-sans">
                  Registration is free (£0). Where an assurance review fee or paid Partner Network membership applies, the price will be confirmed before the service begins. Payment does not guarantee supplier approval or work allocation.
                </p>
              </div>

              {/* Wizard Entry CTA Box */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/supplier-portal/onboarding"
                  className="btn-primary text-xs py-3 px-6 text-center flex-1 font-bold"
                >
                  Start 15-Stage Onboarding Wizard &rarr;
                </Link>
                <Link
                  href="/supplier-portal"
                  className="btn-secondary text-xs py-3 px-6 text-center flex-1"
                >
                  Continue Existing Application (Sign In)
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-4">
                OR COMPLETE QUICK INITIAL INTAKE FORM BELOW
              </span>
              <SupplierApplicationForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
