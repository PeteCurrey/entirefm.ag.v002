import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SupplierHero } from '@/components/suppliers/SupplierHero';
import { TrustBar } from '@/components/trust/TrustBar';
import { ArrowRight, Cpu, Radio, Eye, Zap, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateRouteMetadata } from '@/lib/metadata/generate-metadata';

export const metadata: Metadata = generateRouteMetadata('/suppliers/innovation', {
  title: 'Innovation & Technology Partnerships | EntireFM',
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header />

      <main id="main" className="flex-grow">
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

        {/* INNOVATION DOMAINS */}
        <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-wide">
            <div className="max-w-3xl mb-16">
              <span className="eyebrow eyebrow-light">COLLABORATION FRONTIERS</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Technology Domains We Are Actively Integrating
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
                We collaborate with forward-thinking hardware manufacturers and software providers across six core technical pillars:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'IoT Condition Monitoring & Sensors',
                  desc: 'LoRaWAN and cellular vibration, temperature, and current sensors deployed on critical plant to detect mechanical failure before breakdown.',
                  icon: Radio,
                },
                {
                  title: 'Thermal Drone Aerial Inspection',
                  desc: 'Sub-millimetre roof surveys, building envelope thermography, and high-level structural reality capture.',
                  icon: Eye,
                },
                {
                  title: 'Predictive Maintenance Failure Models',
                  desc: 'Machine learning algorithms analysing run-hours, thermal anomalies, and power draw to dynamically trigger SFG20 work orders.',
                  icon: Cpu,
                },
                {
                  title: 'Energy Sub-Metering & Telemetry',
                  desc: 'Granular sub-circuit power monitoring, HVAC coefficient of performance (COP) tracking, and automated carbon reporting.',
                  icon: Zap,
                },
                {
                  title: 'Digital Twins & 3D Reality Mesh',
                  desc: 'BIM-integrated photogrammetric point clouds and digital asset registers for spatial facilities management.',
                  icon: Layers,
                },
                {
                  title: 'OEM Hardware Collaboration',
                  desc: 'Direct integration with boiler, chiller, and pump manufacturers for remote telemetry and automated part ordering.',
                  icon: Sparkles,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-8 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-carbon text-white border-t border-brand-edge-dark text-center">
          <div className="container-custom max-w-3xl space-y-6">
            <h2 className="text-3xl font-extralight text-white">
              Have a technology ready for deployment?
            </h2>
            <p className="text-sm text-brand-mist/80 max-w-xl mx-auto font-light leading-relaxed">
              Connect directly with our engineering and technology team to explore technical integrations across live commercial facilities.
            </p>
            <div className="pt-2">
              <Link href="/suppliers/apply" className="btn-primary inline-flex">
                Discuss an Innovation Partnership <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
