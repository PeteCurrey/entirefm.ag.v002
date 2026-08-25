import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Cpu, Zap, Building2, ShieldCheck, ArrowRight, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Industry & Technology Partnerships | EntireFM',
  description: 'Partner with EntireFM as an equipment manufacturer, OEM, or technology provider. Bring innovative building engineering solutions into live commercial property.',
};

export default function IndustryPartnersPublicPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        <section className="bg-slate-900 text-white py-20 lg:py-28">
          <div className="container-custom max-w-5xl space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-pink font-bold">
              MANUFACTURERS, OEMS &amp; TECHNOLOGY
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl leading-tight">
              Bring better ideas into real buildings.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
              We collaborate with equipment manufacturers, controls companies, IoT sensor developers, and smart FM technology providers to optimize asset lifecycles and energy efficiency.
            </p>
          </div>
        </section>

        <section className="py-16 container-custom max-w-5xl space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm space-y-4">
              <Wrench className="h-6 w-6 text-slate-900" />
              <h3 className="text-lg font-bold text-slate-900 font-sans">Manufacturers &amp; OEMs</h3>
              <p className="text-slate-600 font-light leading-relaxed">
                Connect your factory-trained specialist network directly into EntireFM’s CAFM maintenance schedules for chillers, boilers, fire systems, and critical power infrastructure.
              </p>
              <ul className="space-y-1.5 text-slate-700 font-mono text-[11px]">
                <li>&bull; Warranty-backed maintenance delivery</li>
                <li>&bull; Technical education &amp; engineer workshops</li>
                <li>&bull; Asset lifecycle &amp; parts intelligence</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm space-y-4">
              <Cpu className="h-6 w-6 text-slate-900" />
              <h3 className="text-lg font-bold text-slate-900 font-sans">Technology &amp; Innovation</h3>
              <p className="text-slate-600 font-light leading-relaxed">
                Integrate IoT telemetry, AI anomaly detection, drone surveying, and building analytics into live managed property portfolios.
              </p>
              <ul className="space-y-1.5 text-slate-700 font-mono text-[11px]">
                <li>&bull; Live pilot testing in commercial assets</li>
                <li>&bull; Energy &amp; carbon reduction validation</li>
                <li>&bull; Joint technical briefings &amp; case studies</li>
              </ul>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-sm text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Discuss an Industry Partnership</h3>
            <p className="text-xs text-slate-600 font-light max-w-md mx-auto">
              Speak with our Head of Supply Chain &amp; Innovation to explore tailored technology or OEM collaboration.
            </p>
            <Link href="/contact" className="btn-primary text-xs py-2.5 px-6 inline-block">
              Contact Innovation Team &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
