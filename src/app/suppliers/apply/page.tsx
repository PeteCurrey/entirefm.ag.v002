import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { TrustBar } from '@/components/trust/TrustBar';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, FileText, Building2, Layers } from 'lucide-react';

export const metadata: Metadata = generateRouteMetadata('/suppliers/apply', {
  title: 'Apply to Become an EntireFM Supplier | Contractor Qualification',
  description:
    'Complete one supplier application to tell us who you are, what you do, and provide the information required for EntireFM supplier assurance.',
});

export default function ApplyPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Supplier Application', url: '/suppliers/apply' },
  ];

  const whatHappensNext = [
    { step: '1', title: 'Create your supplier profile', desc: 'Company registration, trading name, and business structure.' },
    { step: '2', title: 'Tell us your services and coverage', desc: 'Select technical trades and declared operational territories.' },
    { step: '3', title: 'Provide assurance information', desc: 'Insurance policy limits, expiry dates, and scheme details.' },
    { step: '4', title: 'Upload supporting documents', desc: 'Schedules, certificates, and health & safety documentation.' },
    { step: '5', title: 'Review and submit', desc: 'Verify all details and complete applicant statements.' },
    { step: '6', title: 'EntireFM reviews your application', desc: 'Technical due diligence against our Assurance Framework.' },
    { step: '7', title: 'Complete any additional requirements', desc: 'Respond to clarifying requests or upload missing items.' },
    { step: '8', title: 'Receive approved scope', desc: 'Activated on the portal and eligible to be considered for work.' },
  ];

  const beforeYouStartItems = [
    'Companies House registration number and registered office address',
    'Primary commercial and 24/7 emergency operations contact details',
    'Service disciplines and geographical operating areas',
    'Public and employers liability insurance policy numbers, limits and expiries',
    'Relevant trade accreditations (Gas Safe, NICEIC, REFCOM, SSIP, etc.)',
    'Electronic copies of certificates and insurance schedules (PDF/JPEG)',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="ENTIREFM PARTNER NETWORK"
          title="Apply to become an EntireFM supplier."
          subtitle="Join our network of regional SMEs, specialist contractors, national providers, manufacturers and technology partners."
          intro="Complete one supplier application to tell us who you are, what services you provide, where you operate and provide the information required for EntireFM supplier assurance."
          imageSrc="/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp"
          imageAlt="EntireFM engineering team on commercial survey"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '#application-start' }}
          secondaryCta={{ label: 'Review Vetting Standards', href: '/suppliers/vetting' }}
          facts={[
            { figure: 'One Process', label: 'Single Journey', detail: 'No competing quick forms' },
            { figure: 'SMEs Welcomed', label: 'Regional Focus', detail: 'No mandatory national footprint' },
            { figure: 'Save & Resume', label: 'Self-Paced', detail: 'Progress saved as you go' },
          ]}
        />

        <TrustBar />

        {/* CANONICAL APPLICATION ENTRY SECTION */}
        <section id="application-start" className="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-12">
          <div id="application-form" className="container-custom max-w-4xl space-y-12">
            
            {/* Primary Action Card */}
            <div className="bg-[#FAF9FB] border-2 border-slate-900 p-8 sm:p-10 rounded-sm shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-light uppercase tracking-wider text-emerald-700 font-bold tracking-wider bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                  CANONICAL APPLICATION ENTRY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                  Start Your Supplier Application
                </h2>
                <p className="text-sm text-slate-600 font-light leading-relaxed">
                  Create your supplier profile, tell us what services you provide and complete the information required for EntireFM supplier assurance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/supplier-portal/register"
                  className="btn-primary text-sm py-3.5 px-8 text-center flex-1 font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <span>Start Supplier Application</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/supplier-portal/sign-in"
                  className="btn-secondary text-sm py-3.5 px-6 text-center flex-1 flex items-center justify-center gap-2"
                >
                  <span>Continue Existing Application</span>
                </Link>
              </div>

              {/* Save & Return Guarantee */}
              <div className="pt-2 flex items-start gap-2.5 text-xs text-slate-500 font-light border-t border-slate-200/80">
                <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Save &amp; Return:</strong> You do not need to complete everything in one sitting. Your application is saved as you progress and can be resumed at any time from the Supplier Portal.
                </span>
              </div>
            </div>

            {/* What Happens Next — 8-Stage Overview */}
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold tracking-wider">
                  APPLICATION ROADMAP
                </span>
                <h3 className="text-xl font-bold text-slate-900">What Happens Next</h3>
                <p className="text-xs text-slate-600 font-light">
                  A transparent, step-by-step qualification process from profile creation through to approved service scope.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {whatHappensNext.map((item) => (
                  <div key={item.step} className="p-4 bg-white border border-slate-200 rounded-sm space-y-1.5 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                        {item.step}
                      </span>
                      <span className="font-bold text-slate-900 leading-snug">{item.title}</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed pl-7">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Before You Start Checklist */}
            <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-sm space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold tracking-wider">
                  PREPARATION GUIDE
                </span>
                <h3 className="text-lg font-bold text-slate-900">Before You Start</h3>
                <p className="text-xs text-slate-600 font-light">
                  Having these details to hand will allow you to complete your application swiftly:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700">
                {beforeYouStartItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance & Commercial Disclosures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light">
              <div className="p-5 bg-white border border-slate-200 rounded-sm space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>What the Application Means</span>
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Completing the supplier application allows EntireFM to assess your organisation for appropriate services and operating areas. Successful applicants may become eligible to be considered for relevant EntireFM work.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-sm space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Building2 className="h-4 w-4 text-slate-700" />
                  <span>Commercial &amp; Fee Transparency</span>
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Starting and completing your supplier application is free. Once your application is complete, the applicable Initial Supplier Assurance Review fee (£350 + VAT) is payable before your application is formally submitted for review. Payment does not guarantee approval or work allocation.
                </p>
              </div>
            </div>

            {/* Bottom Final CTA */}
            <div className="p-6 bg-slate-900 text-white rounded-sm text-center space-y-3">
              <h3 className="text-lg font-light">Ready to join the EntireFM Partner Network?</h3>
              <p className="text-xs text-slate-300 font-light max-w-xl mx-auto">
                Begin your structured supplier application today. Your draft will be saved automatically as you complete each section.
              </p>
              <div className="pt-2">
                <Link
                  href="/supplier-portal/sign-in"
                  className="btn-primary text-xs py-3 px-8 inline-flex items-center gap-2 font-bold"
                >
                  <span>Start Supplier Application</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
