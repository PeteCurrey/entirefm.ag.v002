'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Clock,
  Activity,
  Layers,
  ChevronRight,
  FileCheck2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { GEO_LOCATIONS, type GeoLocation } from '@/config/geo-registry';
import locationImages from '@/config/location-images.json';
import { ProductFrame } from '@/components/client-portal/ProductFrame';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateCityHubProps {
  route: RouteRecord;
  content: ContentRecord;
}

export function TemplateCityHub({ route, content }: TemplateCityHubProps) {
  // Extract slug from route path (e.g. /locations/london -> london)
  const slug = route.path.replace('/locations/', '').toLowerCase();
  const geo: GeoLocation = GEO_LOCATIONS[slug] || {
    slug,
    name: content.location || slug.charAt(0).toUpperCase() + slug.slice(1),
    region: 'United Kingdom',
    tier: 2,
    email: `${slug}@entirefm.com`,
    tagline: `Facilities Management & Technical Engineering in ${content.location || slug}`,
    metaDescription: content.metaDescription,
    districts: ['Central Commercial District', 'Business Parks', 'Industrial Corridors', 'Logistics Zones'],
    propertyTypes: ['Commercial Offices', 'Industrial Plants', 'Warehouses', 'Retail & Leisure'],
    keySectors: ['Commercial Offices', 'Manufacturing', 'Logistics', 'Retail', 'Education'],
    surroundingAreas: ['Metropolitan Area', 'Regional Corridors', 'Adjacent Business Parks'],
    travelCorridors: 'Fast deployment via regional motorways and commercial arterial routes.',
    legacyUrls: [],
    serviceUrls: [
      { serviceName: 'Mechanical & Electrical', href: '/mechanical-electrical', isExistingLegacy: true },
      { serviceName: 'Planned Maintenance', href: '/ppm', isExistingLegacy: true },
      { serviceName: 'Commercial Cleaning', href: '/cleaning-services', isExistingLegacy: true },
      { serviceName: 'Industrial Cleaning', href: '/industrial-cleaning', isExistingLegacy: true },
    ],
    operatingContext: `EntireFM delivers comprehensive commercial facilities management, M&E engineering, and planned maintenance across ${content.location || slug}.`,
    technicalChallenges: ['Managing statutory compliance across multi-tenant buildings', 'Rapid emergency response across urban centres'],
    faqs: [
      {
        question: `How do EntireFM deliver facilities management in ${content.location || slug}?`,
        answer: `We operate direct mobile engineering crews and specialist soft service teams across ${content.location || slug}, managed in real time through EntireCAFM.`,
      },
    ],
  };

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: geo.name, url: route.path },
  ];

  // Resolve authentic photographic assets from manifest
  const cityImages = (locationImages.cities as Record<string, any>)[slug]?.images || [];
  const heroImage = cityImages.length > 0
    ? cityImages[0].src
    : '/images/editorial/entirefm-headquarters-exterior-2000w.webp';
  const heroImageAlt = cityImages.length > 0
    ? cityImages[0].alt
    : `EntireFM commercial facilities management and engineering operations in ${geo.name}`;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#101010] antialiased selection:bg-[#EA580C] selection:text-white">
      <Header solid />

      <main className="pt-24 pb-20">
        <div className="container-custom">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
          <section className="mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
                    {geo.name.toUpperCase()} REGIONAL HUB
                  </span>
                  <span className="font-mono text-[11px] text-[#686866]">
                    {geo.region}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-[#101010] leading-[1.12]">
                  Facilities Management &amp;{' '}
                  <span className="font-extralight block mt-1">
                    Engineering in {geo.name}
                  </span>
                </h1>

                <p className="text-[15.5px] sm:text-[16.5px] text-[#4B5563] leading-relaxed pt-1">
                  {geo.tagline}. EntireFM provides integrated Hard FM, statutory PPM, mechanical &amp; electrical engineering, commercial cleaning, and building fabric care across {geo.name}&apos;s commercial property estate.
                </p>

                {/* Primary Contact & Navigation CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <a
                    href={`mailto:${geo.email}`}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-5 py-3 text-[13px] font-normal text-white shadow hover:bg-[#D44708] transition-all"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{geo.email}</span>
                  </a>
                  <Link
                    href={`/locations/${slug}/services`}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E1] bg-white px-4 py-3 text-[13px] font-normal text-[#101010] hover:bg-[#F5F5F3] transition-colors shadow-sm"
                  >
                    <span>View {geo.name} Service Catalogue</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#9B9B97]" />
                  </Link>
                </div>

                {/* Micro facts */}
                <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-[11px] text-[#686866]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                    Direct Mobile Engineering
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                    24/7 Response SLAs
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                    SFG20 &amp; British Standards
                  </span>
                </div>
              </div>

              {/* Right: City Architectural/Operational Media */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[12px] border border-[#E4E4E1] bg-white p-2 shadow-md">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-[#F5F5F3]">
                    <Image
                      src={heroImage}
                      alt={heroImageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="mt-2.5 px-2 flex items-center justify-between font-mono text-[10.5px] text-[#686866]">
                    <span>{geo.name} Operations Area</span>
                    <span className="text-[#059669] font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                      Active Regional Coverage
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Bar */}
          <div className="mb-14">
            <TrustBar />
          </div>

          {/* ── 2. LOCAL COMMERCIAL CONTEXT ───────────────────────────── */}
          <section className="mb-16">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-3xl mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  COMMERCIAL PROFILE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  Operating in {geo.name}&apos;s Commercial Property Environment
                </h2>
                <p className="text-[14px] text-[#4B5563] mt-2 leading-relaxed">
                  {geo.operatingContext}
                </p>
              </div>

              {/* Technical Challenges & Property Stock Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FBFBFA] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-[#EA580C]" />
                    <h3 className="text-[14px] font-normal text-[#101010]">
                      Predominant Property Stock &amp; Assets
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {geo.propertyTypes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12.5px] text-[#4B5563]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FBFBFA] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="h-4 w-4 text-[#2563EB]" />
                    <h3 className="text-[14px] font-normal text-[#101010]">
                      Operational &amp; Engineering Priorities
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {geo.technicalChallenges.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[12.5px] text-[#4B5563]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. SERVICES IN CITY & LEGACY PAGES ────────────────────── */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  LOCAL DELIVERY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  Facilities Management Services in {geo.name}
                </h2>
              </div>
              <Link
                href={`/locations/${slug}/services`}
                className="inline-flex items-center gap-1 text-[13px] font-normal text-[#EA580C] hover:underline"
              >
                View Complete {geo.name} Catalogue <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {geo.serviceUrls.map((svc) => (
                <Link
                  key={svc.href}
                  href={svc.href}
                  className="rounded-[10px] border border-[#E4E4E1] bg-white p-5 flex flex-col justify-between hover:border-[#D1D1CD] hover:shadow-md transition-all group"
                >
                  <div>
                    <span className="font-mono text-[10px] font-normal uppercase tracking-wider text-[#9B9B97] block mb-1">
                      {svc.isExistingLegacy ? 'SPECIALIST SERVICE' : 'FM CAPABILITY'}
                    </span>
                    <h3 className="text-[15px] font-normal text-[#101010] group-hover:text-[#EA580C] transition-colors">
                      {svc.serviceName}
                    </h3>
                  </div>
                  <div className="pt-4 border-t border-[#F0F0EE] mt-4 flex items-center justify-between text-[11.5px] font-mono text-[#686866]">
                    <span>Active in {geo.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#9B9B97] group-hover:text-[#EA580C] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Existing Legacy Landing Pages Strip */}
            {geo.legacyUrls.length > 0 && (
              <div className="mt-8 rounded-[12px] border border-[#E4E4E1] bg-[#FBFBFA] p-5">
                <p className="font-mono text-[10.5px] font-normal uppercase tracking-wider text-[#686866] mb-3">
                  Dedicated {geo.name} Service &amp; Sector Landing Pages
                </p>
                <div className="flex flex-wrap gap-2">
                  {geo.legacyUrls.map((url) => {
                    const label = url
                      .replace(/^\//, '')
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <Link
                        key={url}
                        href={url}
                        className="inline-flex items-center gap-1 rounded-[6px] border border-[#E4E4E1] bg-white px-3 py-1.5 text-[12px] text-[#374151] hover:border-[#EA580C] hover:text-[#EA580C] transition-colors"
                      >
                        <span>{label}</span>
                        <ArrowUpRight className="h-3 w-3 text-[#9B9B97]" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* ── 4. SECTORS SERVED IN THIS MARKET ──────────────────────── */}
          <section className="mb-16">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-2xl mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  SECTOR EXPERTISE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  Commercial Sectors Serviced Across {geo.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {geo.keySectors.map((sector, idx) => (
                  <div
                    key={idx}
                    className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-3.5 flex items-center gap-2.5"
                  >
                    <div className="h-2 w-2 rounded-full bg-[#EA580C] shrink-0" />
                    <span className="text-[13px] font-normal text-[#101010]">
                      {sector}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 5. ENTIRECAFM PLATFORM INTEGRATION ────────────────────── */}
          <section className="mb-16">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C]">
                    TECHNOLOGY PLATFORM
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                    Real-Time CAFM Visibility for {geo.name} Estates
                  </h2>
                  <p className="text-[14px] text-[#4B5563] leading-relaxed">
                    All maintenance, compliance visits, and reactive callouts across {geo.name} are managed directly through EntireCAFM. Authorised clients receive 24/7 access to live work order progress, engineer GPS check-ins, and digital compliance vaults.
                  </p>
                  <div className="space-y-2 pt-2">
                    {[
                      `Live mobile engineer tracking and arrival notifications in ${geo.name}`,
                      'Point-in-time compliance vault storing EICR, Gas Safe, and L8 certificates',
                      'Contracted SLA response timers and automatic escalation management',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[12.5px] text-[#374151]">
                        <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3">
                    <Link
                      href="/client-portal"
                      className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#101010] px-4 py-2.5 text-[12.5px] font-normal text-white hover:bg-[#252525] transition-colors"
                    >
                      Explore EntireCAFM Client Portal
                      <ArrowRight className="h-3.5 w-3.5 text-[#EA580C]" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <ProductFrame
                    src="/images/client-portal/entirecafm-dashboard-live.png"
                    alt={`EntireCAFM Live Portal in ${geo.name}`}
                    caption={`EntireCAFM Portal: Real-time estate telemetry and engineer dispatch in ${geo.name}.`}
                    badge="LIVE OPERATIONS"
                    badgeType="live"
                    aspectRatio="16/10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── 6. DISTRICTS & SURROUNDING COVERAGE ────────────────────── */}
          <section className="mb-16">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-2xl mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  AREAS COVERED
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  {geo.name} Commercial Districts &amp; Corridors
                </h2>
                <p className="text-[13.5px] text-[#686866] mt-1">
                  {geo.travelCorridors}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {geo.districts.map((d, idx) => (
                  <div
                    key={idx}
                    className="rounded-[6px] border border-[#E4E4E1] bg-[#FBFBFA] px-3 py-2 text-[12.5px] text-[#374151] flex items-center gap-2"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#EA580C] shrink-0" />
                    <span className="truncate">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 7. FAQS ───────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-2xl mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  Facilities Management in {geo.name}
                </h2>
              </div>

              <div className="space-y-4">
                {geo.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-[10px] border border-[#E4E4E1] bg-[#FBFBFA] p-5"
                  >
                    <h3 className="text-[15px] font-normal text-[#101010] mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-[13px] text-[#4B5563] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 8. RELATED LOCATIONS ──────────────────────────────────── */}
          <section className="mb-16">
            <div className="max-w-2xl mb-6">
              <span className="font-mono text-[10.5px] font-normal uppercase tracking-wider text-[#9B9B97] block mb-1">
                REGIONAL NETWORK
              </span>
              <h2 className="text-xl font-light text-[#101010]">
                Connected Commercial Locations in the {geo.region}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.entries(GEO_LOCATIONS)
                .filter(([k]) => k !== slug)
                .slice(0, 8)
                .map(([otherSlug, otherGeo]) => (
                  <Link
                    key={otherSlug}
                    href={`/locations/${otherSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E1] bg-white px-3 py-2 text-[12px] font-normal text-[#374151] hover:border-[#EA580C] hover:text-[#EA580C] transition-colors"
                  >
                    <MapPin className="h-3 w-3 text-[#9B9B97]" />
                    <span>{otherGeo.name} Facilities Management</span>
                  </Link>
                ))}
            </div>
          </section>

          {/* ── 9. DEDICATED REGIONAL PROPOSAL CTA ─────────────────────── */}
          <ProposalSection
            defaultService={`Total Facilities Management (${geo.name})`}
            defaultLocation={geo.name}
            headline={`Request a Commercial FM Proposal in ${geo.name}`}
            subheadline={`Connect directly with our ${geo.name} operations desk via ${geo.email} for a comprehensive estate review and tailored facilities quotation.`}
          />

          <div className="mt-16">
            <NewsletterSignupSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
