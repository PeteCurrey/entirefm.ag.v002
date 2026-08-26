import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { InnovationTracksExplorer } from '@/components/suppliers/interactive/InnovationTracksExplorer';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, Cpu, Radio, Eye, Zap, Layers, Sparkles, CheckCircle2, Server, Activity } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/innovation', {
  title: 'Innovation & PropTech Partnerships | IoT & Asset Intelligence | EntireFM',
  description:
    'Bring better ideas into real buildings. EntireFM partners with equipment manufacturers, OEMs, robotics innovators, IoT sensor providers, and AI diagnostics platforms.',
});

export default function InnovationPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Innovation & Technology', url: '/suppliers/innovation' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main id="main" className="flex-grow">
        {/* 1. HERO */}
        <SupplierHero
          eyebrow="TECHNOLOGY PARTNERSHIPS // ASSET INTELLIGENCE"
          title="Bring better ideas"
          subtitle="into real buildings."
          intro="EntireFM is more than a facilities management contractor—we provide a live operating environment for OEMs, sensor manufacturers, robotics innovators, and AI diagnostic platforms."
          imageSrc="/images/editorial/entirefm-client-review-2000w.webp"
          imageAlt="EntireFM technology directors reviewing IoT sensor diagnostics and predictive maintenance algorithms"
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Discuss an Innovation Partnership', href: '/suppliers/apply' }}
          secondaryCta={{ label: 'Explore Drone Services', href: '/services/drone-services' }}
          facts={[
            { figure: 'IoT Telemetry', label: 'Condition Monitoring', detail: 'Vibration, temperature, energy' },
            { figure: 'Thermal Drones', label: 'Aerial Surveys', detail: 'Façade & solar PV diagnostics' },
            { figure: 'EntireCAFM', label: 'API Integrations', detail: 'Automated predictive work orders' },
          ]}
        />

        <TrustBar />

        {/* 2. FOUR PRIORITY INNOVATION TRACKS */}
        <InnovationTracksExplorer />

        {/* 3. THE ENTIREFM LIVE TESTBED & SANDBOX (DARK BREAK) */}
        <section className="py-24 bg-brand-graphite text-white border-t border-b border-brand-edge-dark relative overflow-hidden">
          <div className="container-wide relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                  THE ENTIREFM TESTBED ENVIRONMENT
                </span>
                <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                  Deploying Hardware on Live UK Commercial Estates
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  Too many PropTech innovations stall in theoretical laboratory trials. EntireFM offers structured access to live commercial HVAC plant, electrical switchgear, and multi-tenant office buildings for field validation.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-sm">
                    <Server className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-white">Full CAFM API Gateway</h4>
                      <p className="text-[11.5px] text-slate-400 font-light mt-0.5">Direct webhooks to convert abnormal vibration or thermal triggers into automatic contractor dispatch tickets.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-sm">
                    <Activity className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-medium text-white">Engineering Oversight &amp; Ground Truth</h4>
                      <p className="text-[11.5px] text-slate-400 font-light mt-0.5">Our senior M&amp;E engineers validate algorithmic predictions with physical thermography and mechanical inspection.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-slate-950/90 border border-slate-800 rounded-sm p-8 sm:p-10 shadow-2xl space-y-5">
                <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 block">
                  PILOT COLLABORATION PROCESS
                </span>
                <h3 className="text-xl font-light text-white">
                  Four-Phase Technology Pilot Pathway
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-sm bg-slate-900 border border-slate-800">
                    <div className="text-brand-pink font-medium">Phase 1: Security &amp; Safety Review (Weeks 1–2)</div>
                    <div className="text-slate-400 font-light mt-0.5">UK GDPR data audit, wireless frequency compliance, and electrical installation RAMS.</div>
                  </div>
                  <div className="p-3 rounded-sm bg-slate-900 border border-slate-800">
                    <div className="text-white font-medium">Phase 2: Single-Plantroom Sandbox (Weeks 3–6)</div>
                    <div className="text-slate-400 font-light mt-0.5">Non-invasive sensor deployment on pilot AHU and pump sets.</div>
                  </div>
                  <div className="p-3 rounded-sm bg-slate-900 border border-slate-800">
                    <div className="text-white font-medium">Phase 3: CAFM Integration &amp; Telemetry Tuning (Weeks 7–12)</div>
                    <div className="text-slate-400 font-light mt-0.5">Live anomaly threshold tuning and automated ticket creation verification.</div>
                  </div>
                  <div className="p-3 rounded-sm bg-slate-900 border border-slate-800">
                    <div className="text-emerald-400 font-medium">Phase 4: Commercial Scale &amp; Client Rollout (Week 13+)</div>
                    <div className="text-slate-400 font-light mt-0.5">Preferred technology partner status across EntireFM managed client estates.</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-light">Have an IoT solution?</span>
                  <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-4">
                    Submit Tech for Review <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CALL TO ACTION */}
        <section className="py-20 bg-white border-b border-slate-200 text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <span className="eyebrow eyebrow-light">PROPTECH PARTNERSHIPS</span>
            <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900">
              Have a technology ready for deployment?
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
              Connect directly with our engineering and technology team to explore technical integrations across live commercial facilities.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/suppliers/apply" className="btn-primary">
                Discuss an Innovation Partnership <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/suppliers/events" className="btn-ghost-dark">
                Explore FM Innovation Sessions
              </Link>
            </div>
          </div>
        </section>

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="INNOVATION &amp; TECHNOLOGY"
          heading="Related supplier information"
          links={[
            {
              title: 'Industry & OEM Partners',
              href: '/suppliers/industry-partners',
              description: 'Factory-backed equipment partnerships and manufacturer engagement.',
              tag: 'OEM',
            },
            {
              title: 'Partner Network',
              href: '/suppliers/partner-network',
              description: 'Ecosystem of contractors, specialists, and technology innovators.',
              tag: 'NETWORK',
            },
            {
              title: 'Events & Forums',
              href: '/suppliers/events',
              description: 'FM innovation sessions, product demonstrations, and tech roundtables.',
              tag: 'EVENTS',
            },
            {
              title: 'Sustainability & ESG',
              href: '/suppliers/sustainability',
              description: 'Energy efficiency, Scope 3 reporting, and waste reduction.',
              tag: 'SUSTAINABILITY',
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
