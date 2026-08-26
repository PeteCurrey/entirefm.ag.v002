import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import {
  ShieldCheck,
  Building2,
  Cpu,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Wrench,
} from 'lucide-react';

export const metadata = {
  title: 'EntireFM Partner Network | Facilities Management Supply Chain',
  description: 'Join the EntireFM Partner Network. A professionally managed supply-chain ecosystem for regional contractors, specialists, OEMs, and technology providers.',
};

export default function PartnerNetworkPublicPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden">
          <div className="container-custom max-w-5xl space-y-6">
            <span className="text-[11px] font-light uppercase tracking-wider text-brand-pink font-bold">
              ENTIREFM PARTNER NETWORK
            </span>
            <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight tracking-tight text-white max-w-3xl leading-tight">
              More than an approved supplier list.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
              The EntireFM Partner Network brings together capable contractors, regional specialists, equipment manufacturers, and technology innovators within a professionally managed, transparent facilities management ecosystem.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/suppliers/apply" className="btn-primary text-xs py-3 px-6">
                Become an EntireFM Supplier
              </Link>
              <Link href="/suppliers/events" className="btn-secondary text-xs py-3 px-6 text-white border-white/20 hover:bg-white/10">
                Events &amp; Forums Programme
              </Link>
              <Link href="/suppliers/membership" className="btn-ghost-light text-xs py-3 px-6 text-white border-white/20 hover:bg-white/10">
                View Membership Tiers
              </Link>
            </div>
          </div>
        </section>

        {/* Who the Network is For */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="container-custom max-w-5xl space-y-12">
            <div className="space-y-2">
              <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
                COLLABORATIVE ECOSYSTEM
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900">
                Who the Partner Network is For
              </h2>
              <p className="text-xs text-slate-600 font-light max-w-2xl">
                We believe in building balanced, resilient supply chains that combine local agility with specialist engineering depth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                <Wrench className="h-5 w-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 font-sans text-sm">Contractors &amp; Regional SMEs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-quality local and regional engineering businesses delivering mechanical, electrical, fabric, and cleaning services.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                <ShieldCheck className="h-5 w-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 font-sans text-sm">Specialist Engineering</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Rope access, BMU systems, critical power, high voltage, water hygiene, and life-safety compliance specialists.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm space-y-2">
                <Cpu className="h-5 w-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 font-sans text-sm">Manufacturers, OEMs &amp; Tech</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Equipment manufacturers, building controls providers, IoT sensor developers, and smart FM technology pioneers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency Banner */}
        <section className="py-16 container-custom max-w-5xl">
          <CommercialTransparencyBanner />
        </section>

        {/* Membership Tiers Overview */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container-custom max-w-5xl space-y-8">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-light uppercase tracking-wider text-slate-400 font-bold">
                COMMERCIAL CLARITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900">
                Partner Network Memberships
              </h2>
              <p className="text-xs text-slate-600 font-light">
                Transparent annual subscriptions that support continuous assurance infrastructure and digital portal services.
              </p>
            </div>

            <MembershipTierCards />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
