'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wrench,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Mail,
  Clock,
  Sparkles,
  ArrowUpRight,
  Flame,
  Zap,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import { GEO_LOCATIONS, type GeoLocation } from '@/config/geo-registry';
import { ProductFrame } from '@/components/client-portal/ProductFrame';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateCityServicesProps {
  route: RouteRecord;
  content: ContentRecord;
}

export function TemplateCityServices({ route, content }: TemplateCityServicesProps) {
  // Extract slug from route path (e.g. /locations/london/services -> london)
  const slug = route.path.replace('/locations/', '').replace('/services', '').toLowerCase();
  const geo: GeoLocation = GEO_LOCATIONS[slug] || {
    slug,
    name: content.location || slug.charAt(0).toUpperCase() + slug.slice(1),
    region: 'United Kingdom',
    tier: 2,
    email: `${slug}@entirefm.com`,
    tagline: `Facilities Management Services in ${content.location || slug}`,
    metaDescription: content.metaDescription,
    districts: ['Central Commercial District', 'Business Parks', 'Industrial Corridors'],
    propertyTypes: ['Commercial Offices', 'Industrial Plants', 'Warehouses'],
    keySectors: ['Commercial Offices', 'Manufacturing', 'Logistics', 'Retail'],
    surroundingAreas: ['Metropolitan Area', 'Regional Corridors'],
    travelCorridors: 'Regional motorway access',
    legacyUrls: [],
    serviceUrls: [
      { serviceName: 'Mechanical & Electrical', href: '/mechanical-electrical', isExistingLegacy: true },
      { serviceName: 'Planned Maintenance', href: '/ppm', isExistingLegacy: true },
      { serviceName: 'Commercial Cleaning', href: '/cleaning-services', isExistingLegacy: true },
      { serviceName: 'Industrial Cleaning', href: '/industrial-cleaning', isExistingLegacy: true },
    ],
    operatingContext: `EntireFM delivers comprehensive commercial facilities management services across ${content.location || slug}.`,
    technicalChallenges: ['Managing statutory compliance across multi-tenant buildings'],
    faqs: [
      {
        question: `What FM services do EntireFM offer in ${content.location || slug}?`,
        answer: `We deliver Hard FM engineering, statutory PPM compliance, commercial cleaning, industrial plant care, working at height, and 24/7 reactive callout services.`,
      },
    ],
  };

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: geo.name, url: `/locations/${slug}` },
    { name: 'Services', url: route.path },
  ];

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
          <section className="mb-14 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C] animate-pulse" />
                {geo.name.toUpperCase()} SERVICE CATALOGUE
              </span>
              <span className="font-mono text-[11px] text-[#686866]">
                Hard &amp; Soft FM Engineering
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#101010] leading-[1.12]">
              Facilities Management Services{' '}
              <span className="font-light block mt-1">
                Available in {geo.name}
              </span>
            </h1>

            <p className="text-[15.5px] sm:text-[16.5px] text-[#4B5563] mt-5 leading-relaxed">
              Explore EntireFM&apos;s complete operational service catalogue for {geo.name} commercial properties, industrial manufacturing facilities, and multi-tenant estates.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <a
                href={`mailto:${geo.email}`}
                className="inline-flex items-center gap-2 rounded-[8px] bg-[#EA580C] px-5 py-3 text-[13px] font-normal text-white shadow hover:bg-[#D44708] transition-all"
              >
                <Mail className="h-4 w-4" />
                <span>Contact {geo.name} Desk ({geo.email})</span>
              </a>
              <Link
                href={`/locations/${slug}`}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E1] bg-white px-4 py-3 text-[13px] font-normal text-[#101010] hover:bg-[#F5F5F3] transition-colors shadow-sm"
              >
                <span>← Back to {geo.name} City Hub</span>
              </Link>
            </div>
          </section>

          {/* Trust Bar */}
          <div className="mb-14">
            <TrustBar />
          </div>

          {/* ── 2. SERVICE CATEGORY NAVIGATOR ──────────────────────────── */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Hard FM & Engineering', tag: 'M&E, HVAC, Gas & Electric', count: '6 Core Services', href: '#hard-fm' },
                { title: 'PPM & Compliance', tag: 'SFG20 & Statutory Testing', count: '100% Audit Ready', href: '#compliance' },
                { title: 'Soft FM & Cleaning', tag: 'Office, Industrial & Grounds', count: 'Direct Crews', href: '#soft-fm' },
                { title: 'Specialist Services', tag: 'Working at Height & Rigging', count: 'BMU, Rope & Cranes', href: '#specialist' },
              ].map((cat) => (
                <a
                  key={cat.title}
                  href={cat.href}
                  className="rounded-[10px] border border-[#E4E4E1] bg-white p-5 hover:border-[#EA580C] hover:shadow-md transition-all group"
                >
                  <span className="font-mono text-[10px] font-normal text-[#EA580C] block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="text-[15px] font-normal text-[#101010] group-hover:text-[#EA580C] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[12px] text-[#686866] mt-1">
                    {cat.tag}
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* ── 3. HARD FM & ENGINEERING ──────────────────────────────── */}
          <section id="hard-fm" className="mb-16 scroll-mt-24">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-2xl mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  HARD SERVICES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  Mechanical, Electrical &amp; Engineering in {geo.name}
                </h2>
                <p className="text-[13.5px] text-[#686866] mt-1">
                  Directly delivered technical maintenance for building services and plantroom infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Mechanical & Electrical (M&E)',
                    desc: 'Complete building services maintenance covering distribution switchgear, pumps, motors, lighting, and power infrastructure.',
                    href: '/mechanical-electrical',
                  },
                  {
                    title: 'HVAC & Commercial Air Conditioning',
                    desc: 'Chiller servicing, air handling unit (AHU) filter overhauls, VRF systems, F-Gas leak testing, and TM44 inspections.',
                    href: '/hvac-contractor',
                  },
                  {
                    title: 'Plumbing & Commercial Gas',
                    desc: 'Non-domestic gas heating servicing (CP15/CP17), calorifier maintenance, booster sets, and drainage engineering.',
                    href: '/plumbing-gas',
                  },
                  {
                    title: 'Fire & Emergency Systems',
                    desc: 'Fire alarm testing (BS 5839), emergency lighting discharge tests (BS 5266), and smoke ventilation maintenance.',
                    href: '/fire-emergency-systems',
                  },
                  {
                    title: 'Building Fabric & Fabric Maintenance',
                    desc: 'Structural masonry, commercial roofing repairs, gutter clearance, industrial cladding, and internal refurbishment.',
                    href: '/building-maintenance',
                  },
                  {
                    title: 'Total Facilities Management (TFM)',
                    desc: 'One integrated contract uniting all hard engineering and soft maintenance services under a single accountable SLA.',
                    href: '/hard-services',
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-5 flex flex-col justify-between hover:border-[#EA580C] transition-all group"
                  >
                    <div>
                      <h4 className="text-[14px] font-normal text-[#101010] group-hover:text-[#EA580C] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[12.5px] text-[#4B5563] mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#E4E4E1] mt-4 flex items-center justify-between text-[11px] font-mono text-[#686866]">
                      <span>Explore Engineering</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#9B9B97] group-hover:text-[#EA580C]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── 4. STATUTORY PPM & COMPLIANCE ──────────────────────────── */}
          <section id="compliance" className="mb-16 scroll-mt-24">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-2xl mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#059669] mb-2">
                  STATUTORY TESTING
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  PPM &amp; Compliance Management in {geo.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Electrical Fixed Wire (EICR)', standard: 'BS 7671:2018+A2:2022', href: '/compliance/fixed-wire-testing-eicr' },
                  { name: 'Fire Alarm Testing & Servicing', standard: 'BS 5839-1:2017', href: '/compliance/fire-risk-assessment' },
                  { name: 'Emergency Lighting Discharge', standard: 'BS 5266-1:2016', href: '/compliance/emergency-lighting-testing' },
                  { name: 'Water Hygiene & Legionella', standard: 'ACOP L8 / HSG274', href: '/compliance/legionella-water-hygiene' },
                ].map((comp) => (
                  <Link
                    key={comp.name}
                    href={comp.href}
                    className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-4 hover:border-[#059669] transition-all group"
                  >
                    <span className="font-mono text-[10px] text-[#059669] font-light block mb-1">
                      {comp.standard}
                    </span>
                    <h4 className="text-[13px] font-normal text-[#101010] group-hover:text-[#059669] transition-colors">
                      {comp.name}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── 5. SOFT FM & CLEANING ─────────────────────────────────── */}
          <section id="soft-fm" className="mb-16 scroll-mt-24">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-2xl mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  SOFT SERVICES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  Commercial &amp; Industrial Cleaning in {geo.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Commercial Cleaning',
                    desc: 'Daily office cleaning, retail hygiene, and contract commercial cleaning for occupied workplaces.',
                    href: `/commercial-cleaning-${slug}`,
                    fallbackHref: '/cleaning-services',
                  },
                  {
                    title: 'Industrial & Factory Cleaning',
                    desc: 'Plant degreasing, scrubber-drier floor care, machine bay de-dusting, and shutdown deep cleans.',
                    href: `/industrial-cleaning-${slug}`,
                    fallbackHref: '/industrial-cleaning',
                  },
                  {
                    title: 'Security & Grounds Maintenance',
                    desc: 'Manned guarding, mobile patrols, access control, and commercial landscaping care.',
                    href: '/security-services',
                    fallbackHref: '/grounds-maintenance',
                  },
                ].map((s) => (
                  <Link
                    key={s.title}
                    href={geo.legacyUrls.includes(s.href) ? s.href : s.fallbackHref}
                    className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-5 flex flex-col justify-between hover:border-[#EA580C] transition-all group"
                  >
                    <div>
                      <h4 className="text-[14px] font-normal text-[#101010] group-hover:text-[#EA580C] transition-colors">
                        {s.title}
                      </h4>
                      <p className="text-[12.5px] text-[#4B5563] mt-2 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#E4E4E1] mt-4 flex items-center justify-between text-[11px] font-mono text-[#686866]">
                      <span>View Service</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#9B9B97] group-hover:text-[#EA580C]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6. SPECIALIST SERVICES ────────────────────────────────── */}
          <section id="specialist" className="mb-16 scroll-mt-24">
            <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="max-w-2xl mb-8">
                <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-normal text-[#C2410C] mb-2">
                  SPECIALIST CAPABILITIES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extralight text-[#101010] tracking-tight">
                  Working at Height, Rope Access &amp; Heavy Lifting in {geo.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Working at Height & Rope Access',
                    desc: 'IRATA certified abseiling, BMU cradle maintenance, eye-bolt testing, and high-level façade inspection.',
                    href: '/working-at-height-rope-access-bmu',
                  },
                  {
                    title: 'Mobile Crane Hire & Rigging',
                    desc: 'Contract crane lifting, rooftop chiller replacement, transformer rigging, and plant repositioning.',
                    href: slug === 'sheffield' || slug === 'chesterfield' ? `/mobile-crane-hire/${slug}` : '/mobile-crane-hire',
                  },
                  {
                    title: 'Aerial Drone Building Surveys',
                    desc: 'CAA certified 4K drone thermography, roof condition surveys, and structural inspection.',
                    href: '/aerial-drone-building-inspection',
                  },
                ].map((spec) => (
                  <Link
                    key={spec.title}
                    href={spec.href}
                    className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-5 flex flex-col justify-between hover:border-[#EA580C] transition-all group"
                  >
                    <div>
                      <h4 className="text-[14px] font-normal text-[#101010] group-hover:text-[#EA580C] transition-colors">
                        {spec.title}
                      </h4>
                      <p className="text-[12.5px] text-[#4B5563] mt-2 leading-relaxed">
                        {spec.desc}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#E4E4E1] mt-4 flex items-center justify-between text-[11px] font-mono text-[#686866]">
                      <span>Inspect Capability</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#9B9B97] group-hover:text-[#EA580C]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── 7. PROPOSAL CTA ───────────────────────────────────────── */}
          <ProposalSection
            defaultService={`Facilities Management Services (${geo.name})`}
            defaultLocation={geo.name}
            headline={`Request a Service Quotation in ${geo.name}`}
            subheadline={`Speak directly with our ${geo.name} facilities desk via ${geo.email} to structure an optimal service schedule for your commercial estate.`}
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
