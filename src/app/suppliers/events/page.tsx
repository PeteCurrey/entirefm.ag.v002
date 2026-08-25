import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calendar, Users, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Partner Network Events & Supplier Forums | EntireFM',
  description: 'Connect with facilities managers, engineering specialists, and equipment manufacturers at EntireFM Partner Network events, technical breakfasts, and forums.',
};

export default function SupplierEventsPublicPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        <section className="bg-slate-900 text-white py-20 lg:py-28">
          <div className="container-custom max-w-5xl space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-pink font-bold">
              INDUSTRY ENGAGEMENT
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl leading-tight">
              Partner Network Events &amp; Forums
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
              Bringing suppliers, technical specialists, equipment manufacturers, and EntireFM operational teams together around real engineering challenges.
            </p>
          </div>
        </section>

        <section className="py-16 container-custom max-w-5xl space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3 shadow-sm">
              <Users className="h-5 w-5 text-brand-pink" />
              <h3 className="font-bold text-slate-900 font-sans text-sm">Meet the Supplier</h3>
              <p className="text-slate-600 font-light leading-relaxed">
                Technical roundtables showcasing contractor innovation, specialist access methodologies, and sustainable FM delivery.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3 shadow-sm">
              <Cpu className="h-5 w-5 text-brand-pink" />
              <h3 className="font-bold text-slate-900 font-sans text-sm">Meet the Manufacturer</h3>
              <p className="text-slate-600 font-light leading-relaxed">
                Factory-backed technical sessions exploring chiller efficiency, building controls, IoT telemetry, and emerging FM tech.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-3 shadow-sm">
              <Calendar className="h-5 w-5 text-brand-pink" />
              <h3 className="font-bold text-slate-900 font-sans text-sm">Meet the Buyer</h3>
              <p className="text-slate-600 font-light leading-relaxed">
                Transparent briefings on EntireFM procurement themes and standards. <em>(Attendance does not guarantee contract award).</em>
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-sm text-center space-y-4">
            <h3 className="text-xl font-bold">Upcoming 2026 Event Programme</h3>
            <p className="text-xs text-slate-300 font-light max-w-xl mx-auto">
              Our 2026 event schedule is currently being finalized across London, Manchester, and Birmingham. Register your supplier profile to receive early invitations.
            </p>
            <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-6 inline-block">
              Register for Event Notifications &rarr;
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
