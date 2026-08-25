import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { OperationalJourneySteps } from '@/components/suppliers/OperationalJourneySteps';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, CheckCircle2, FileText, Camera, ShieldCheck, BarChart3, CreditCard } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/how-we-work', {
  title: 'How We Work | Supply Chain Operational Journey | EntireFM',
  description:
    'Explore EntireFM’s 10-stage operational workflow from opportunity matching and digital work order dispatch to photographic evidence capture and commercial settlement.',
});

export default function HowWeWorkPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'How We Work', url: '/suppliers/how-we-work' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
        <SupplierHero
          eyebrow="OPERATIONAL WORKFLOW // DIGITAL JOB MANAGEMENT"
          title="Predictable processes."
          subtitle="Precision delivery."
          intro="EntireFM eliminates operational ambiguity with structured digital work orders, clear evidence capture criteria, calibrated diagnostic logging, and fast commercial settlements."
          imageSrc="/images/editorial/entirefm-distribution-board-testing-2000w.webp"
          imageAlt="EntireFM engineer executing controlled work order testing"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Start Supplier Application', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Review Supplier Standards', href: '/suppliers/standards' }}
          facts={[
            { figure: 'EntireCAFM', label: 'Controlled Dispatch', detail: 'Full asset & task specification' },
            { figure: 'Evidence-Led', label: 'Digital Sign-Off', detail: 'Photos, readings, certificates' },
            { figure: 'Prompt Settlement', label: 'Commercial Close', detail: 'Automated invoice matching' },
          ]}
        />

        <TrustBar />

        {/* 10-STAGE FULL WORKFLOW */}
        <OperationalJourneySteps />

        {/* DEEP DIVE: EVIDENCE & VALIDATION */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="eyebrow eyebrow-light">QUALITY ASSURANCE</span>
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                  Evidence-Led Completion &amp; Quality Sign-Off
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                  To protect both the client and the contractor, EntireFM operates on an <strong>evidence-led sign-off standard</strong>. Tasks are validated with concrete technical records before closure.
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    {
                      title: 'Time-Stamped Photographic Records',
                      desc: 'Clear before-and-after photographs demonstrating physical remedial works, filter replacements, or defect rectifications.',
                    },
                    {
                      title: 'Calibrated Instrument Diagnostics',
                      desc: 'Direct logging of refrigerant pressures, electrical insulation resistances, water temperatures, and airflow velocities.',
                    },
                    {
                      title: 'Statutory Certification Archiving',
                      desc: 'Digital EICR, Gas Safety, F-Gas log sheets, or fire alarm test certificates linked directly to the CAFM asset record.',
                    },
                    {
                      title: 'Defect & Remedial Escalation',
                      desc: 'Observed asset degradation or secondary hazards logged instantly to trigger client quote generation.',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-[#FAF9FB] border border-slate-200 rounded-sm">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-normal text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 font-light leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-graphite text-white p-8 sm:p-10 rounded-sm border border-brand-edge-dark space-y-6">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright">
                  COMMERCIAL SETTLEMENT
                </span>
                <h3 className="text-2xl font-extralight text-white">
                  Transparent Invoicing &amp; Payment
                </h3>
                <p className="text-xs sm:text-sm text-brand-mist/80 font-light leading-relaxed">
                  We believe prompt payment is the bedrock of strong supplier relationships. Our finance workflow operates on structured automation:
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-brand-carbon rounded-sm border border-white/10 flex items-center justify-between">
                    <span className="text-brand-mist/80">1. Work Order Issued</span>
                    <span className="text-brand-electric-bright font-light">Pre-Authorised PO</span>
                  </div>
                  <div className="p-3 bg-brand-carbon rounded-sm border border-white/10 flex items-center justify-between">
                    <span className="text-brand-mist/80">2. Evidence Validated</span>
                    <span className="text-emerald-400 font-light">Technical Sign-Off</span>
                  </div>
                  <div className="p-3 bg-brand-carbon rounded-sm border border-white/10 flex items-center justify-between">
                    <span className="text-brand-mist/80">3. Invoice Matched</span>
                    <span className="text-brand-electric-bright font-light">Rate Card Auto-Check</span>
                  </div>
                  <div className="p-3 bg-brand-carbon rounded-sm border border-white/10 flex items-center justify-between">
                    <span className="text-brand-mist/80">4. Commercial Payment</span>
                    <span className="text-white font-light">Electronic BACS Run</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link href="/suppliers/apply" className="btn-primary text-xs w-full justify-center">
                    Apply to Join Our Network <ArrowRight className="h-4 w-4" />
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
