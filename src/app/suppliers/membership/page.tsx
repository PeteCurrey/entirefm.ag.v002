import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import { CreditCard, FileText, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Supplier Membership & Fees | EntireFM Partner Network',
  description: 'Transparent supplier membership fees and commercial framework for the EntireFM Partner Network. Understand what fees support and our strict procurement firewall.',
};

export default function SupplierMembershipPublicPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-20 lg:py-28">
          <div className="container-custom max-w-5xl space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-brand-pink font-bold">
              COMMERCIAL TRANSPARENCY
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-3xl leading-tight">
              Transparent membership. Independent procurement.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
              EntireFM operates a commercial Partner Network to support supplier administration, assurance infrastructure, digital portal services, and ongoing compliance. Commercial participation remains completely separate from supplier approval and work allocation.
            </p>
          </div>
        </section>

        {/* Tiers */}
        <section className="py-16 container-custom max-w-5xl space-y-12">
          <MembershipTierCards />
        </section>

        {/* Assurance Review Fee Explanation */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="container-custom max-w-5xl space-y-6 font-mono text-xs">
            <div className="space-y-1 font-sans">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                TECHNICAL VETTING
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Initial Supplier Assurance Review Fee (£350 + VAT)
              </h3>
              <p className="text-xs text-slate-600 font-light">
                Certain high-risk or multi-discipline assurance reviews carry a one-off technical administration fee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-sm border border-slate-200">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 font-sans block">What the Review Fee Covers:</span>
                <ul className="space-y-1 text-slate-600 font-sans text-[11.5px]">
                  <li>&bull; In-depth H&S and RAMS documentation assessment</li>
                  <li>&bull; Trade qualification and competency schedule audit</li>
                  <li>&bull; Corporate registry and financial stability verification</li>
                  <li>&bull; Initial scoped service &amp; regional authorization setup</li>
                </ul>
              </div>

              <div className="space-y-2 font-sans text-[11.5px] text-slate-600 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                <span className="font-bold text-slate-900 block">Important Note:</span>
                <p>
                  Paying an assurance fee contributes towards the independent cost of reviewing technical credentials. It does not guarantee approval if qualifications or safe working standards fail to meet requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Banner */}
        <section className="py-16 container-custom max-w-5xl">
          <CommercialTransparencyBanner />
        </section>
      </main>

      <Footer />
    </div>
  );
}
