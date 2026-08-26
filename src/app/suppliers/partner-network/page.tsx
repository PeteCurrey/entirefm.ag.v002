import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CommercialTransparencyBanner } from '@/components/suppliers/CommercialTransparencyBanner';
import { MembershipTierCards } from '@/components/suppliers/MembershipTierCards';
import { SupplierRelatedLinks } from '@/components/suppliers/SupplierRelatedLinks';
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
  Calendar,
  Layers,
} from 'lucide-react';

export const metadata = {
  title: 'EntireFM Partner Network | Facilities Management Supply Chain',
  description: 'Join the EntireFM Partner Network. A professionally managed supply-chain ecosystem for regional contractors, specialists, OEMs, and technology providers.',
};

export default function PartnerNetworkPublicPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Suppliers', url: '/suppliers' },
    { name: 'Partner Network', url: '/suppliers/partner-network' },
  ];

  const relatedLinks = [
    {
      title: 'How We Work',
      href: '/suppliers/how-we-work',
      description: 'End-to-end 12-stage operational journey, work allocation, and fair payment.',
      tag: 'PROCESS',
    },
    {
      title: 'Events & Forums',
      href: '/suppliers/events',
      description: 'Technical breakfasts, manufacturer open days, and regional networking forums.',
      tag: 'EVENTS',
    },
    {
      title: 'Membership & Fees',
      href: '/suppliers/membership',
      description: 'Partner Network commercial tiers, assurance fees, and governance firewalls.',
      tag: 'COMMERCIAL',
    },
    {
      title: 'Industry & OEM Partners',
      href: '/suppliers/industry-partners',
      description: 'Direct manufacturer equipment partnerships and factory-backed training.',
      tag: 'OEM',
    },
    {
      title: 'Innovation & PropTech',
      href: '/suppliers/innovation',
      description: 'IoT sensor telemetry, AI predictive maintenance, and smart building tech.',
      tag: 'INNOVATION',
    },
    {
      title: 'Become a Supplier',
      href: '/suppliers/apply',
      description: 'Start your application to join our nationwide accredited contractor network.',
      tag: 'APPLICATION',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-slate-900 flex flex-col">
      <Header solid />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden">
          <div className="container-custom max-w-5xl space-y-6">
            <Breadcrumbs items={breadcrumbs} />

            <div className="space-y-4">
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                ENTIREFM PARTNER NETWORK
              </span>
              <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white max-w-3xl leading-tight">
                More than an approved supplier list.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl leading-relaxed">
                The EntireFM Partner Network brings together capable contractors, regional specialists, equipment manufacturers, and technology innovators within a professionally managed, transparent facilities management ecosystem.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/suppliers/apply" className="btn-primary text-xs py-3 px-6 inline-flex items-center gap-2">
                <span>Become an EntireFM Supplier</span>
                <ArrowRight className="w-3.5 h-3.5" />
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

        {/* Strategic Pillars Strip */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container-custom max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-light">
              <Link href="/suppliers/how-we-work" className="p-4 rounded-sm bg-[#FAF9FB] border border-slate-200/80 hover:border-brand-pink transition-all space-y-1 block">
                <span className="text-[10.5px] font-normal uppercase text-brand-pink block font-medium">1. HOW WE WORK</span>
                <p className="text-slate-700">12-stage lifecycle &amp; fair allocation →</p>
              </Link>
              <Link href="/suppliers/events" className="p-4 rounded-sm bg-[#FAF9FB] border border-slate-200/80 hover:border-brand-pink transition-all space-y-1 block">
                <span className="text-[10.5px] font-normal uppercase text-brand-pink block font-medium">2. EVENTS &amp; FORUMS</span>
                <p className="text-slate-700">Breakfasts, OEM days &amp; technical talks →</p>
              </Link>
              <Link href="/suppliers/industry-partners" className="p-4 rounded-sm bg-[#FAF9FB] border border-slate-200/80 hover:border-brand-pink transition-all space-y-1 block">
                <span className="text-[10.5px] font-normal uppercase text-brand-pink block font-medium">3. OEM &amp; INDUSTRY</span>
                <p className="text-slate-700">Factory-backed equipment partnerships →</p>
              </Link>
              <Link href="/suppliers/innovation" className="p-4 rounded-sm bg-[#FAF9FB] border border-slate-200/80 hover:border-brand-pink transition-all space-y-1 block">
                <span className="text-[10.5px] font-normal uppercase text-brand-pink block font-medium">4. INNOVATION</span>
                <p className="text-slate-700">PropTech, IoT &amp; predictive maintenance →</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Who the Network is For */}
        <section className="py-16 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-5xl space-y-12">
            <div className="space-y-2">
              <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 font-medium">
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
              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2 shadow-2xs">
                <Wrench className="h-5 w-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 font-sans text-sm">Contractors &amp; Regional SMEs</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  High-quality local and regional engineering businesses delivering mechanical, electrical, fabric, and cleaning services.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2 shadow-2xs">
                <ShieldCheck className="h-5 w-5 text-slate-900" />
                <h3 className="font-bold text-slate-900 font-sans text-sm">Specialist Engineering</h3>
                <p className="text-slate-600 font-light leading-relaxed">
                  Rope access, BMU systems, critical power, high voltage, water hygiene, and life-safety compliance specialists.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-sm space-y-2 shadow-2xs">
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
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container-custom max-w-5xl space-y-8">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400 font-medium">
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

        {/* Related Supplier Information */}
        <SupplierRelatedLinks
          eyebrow="ECOSYSTEM DESTINATIONS"
          heading="Related supplier information"
          links={relatedLinks}
        />
      </main>

      <Footer />
    </div>
  );
}
