'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Clock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateGuidesHubProps {
  route?: RouteRecord;
  content?: ContentRecord;
}

const GUIDE_CATEGORIES = [
  'All Guides',
  'Compliance',
  'Hard FM',
  'Soft FM',
  'Building Services',
  'HVAC & Cooling',
  'Electrical & EICR',
  'Fire & Life Safety',
  'Water Hygiene',
  'Energy & ESG',
  'PPM & Maintenance',
  'Procurement',
  'CAFM & Technology',
  'AI in FM',
];

const ALL_EVERGREEN_GUIDES = [
  {
    slug: 'facilities-management-guide',
    title: 'The Complete Guide to Commercial Facilities Management',
    href: '/resources/guides/facilities-management-guide',
    category: 'Hard FM',
    description:
      'The definitive guide to modern commercial facilities management in the UK: Hard vs Soft FM engineering scopes, Total FM contracts, statutory duty-holder obligations, CAFM systems, and performance SLAs.',
    readTime: '18 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    isFlagship: true,
  },
  {
    slug: 'ppm-guide',
    title: 'The Complete Guide to Planned Preventative Maintenance (PPM)',
    href: '/resources/guides/ppm-guide',
    category: 'PPM & Maintenance',
    description:
      'How to structure asset-led planned maintenance programmes, balance statutory inspection frequencies against SFG20 recommendations, and eliminate reactive plant failure across commercial buildings.',
    readTime: '15 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp',
    isFlagship: true,
  },
  {
    slug: 'asset-register-guide',
    title: 'How to Build an ISO 55000 Commercial Asset Register',
    href: '/resources/guides/asset-register-guide',
    category: 'Building Services',
    description:
      'Step-by-step guidance on establishing an ISO 55000 / Uniclass 2015 spatial asset hierarchy, physical QR/NFC tagging, condition grading, and CAFM database normalization.',
    readTime: '14 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    isFlagship: true,
  },
  {
    slug: 'fm-tender-guide',
    title: 'Facilities Management Tender & RFP Procurement Specification Guide',
    href: '/resources/guides/fm-tender-guide',
    category: 'Procurement',
    description:
      'How to define contract scope, draft output specifications, evaluate contractor pricing schedules, structure emergency KPIs, and manage mobilization handover.',
    readTime: '16 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    isFlagship: true,
  },
];

export function TemplateGuidesHub({ route, content }: TemplateGuidesHubProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Guides');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Guides Library', url: '/resources/guides' },
  ];

  const filteredGuides = ALL_EVERGREEN_GUIDES.filter((g) => {
    if (selectedCategory === 'All Guides') return true;
    return g.category === selectedCategory;
  });

  return (
    <div className="bg-[#060A14] text-white min-h-screen font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO SECTION (85svh)                                         */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-hvac-rooftop-condensers-2560w.webp"
              alt="EntireFM technical guidance and engineering library"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.12]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              
              <div className="mb-2">
                <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
              </div>

              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  Technical Reference Library
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                Facilities Management <br />
                <span className="font-light text-hero-pink">
                  Engineering &amp; Guidance Library.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Rigorous, practitioner-written technical guidance engineered for property directors, facilities managers, building surveyors, and estates operations teams responsible for commercial property across the United Kingdom.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-light border-t border-white/15">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  <span>CIBSE &amp; SFG20 Aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  <span>UK Statutory Authority</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  <span>Updated for 2026 Standards</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. FEATURED FLAGSHIP PUBLICATION                                          */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom">
            <div className="rounded-sm border border-slate-200 bg-slate-50 overflow-hidden shadow-elevated">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-8 sm:p-14 flex flex-col justify-between space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-brand-pink/10 border border-brand-pink/30 text-brand-pink text-xs font-medium uppercase tracking-wider">
                      Featured Flagship Guide · 18 Min Read
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight leading-tight">
                      The Complete Guide to Commercial Facilities Management
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                      Comprehensive educational breakdown of commercial facilities management in the UK: Hard FM engineering scopes, Soft FM services, Total FM contracts, statutory duty-holder obligations, CAFM software architecture, and performance SLAs.
                    </p>
                  </div>
                  <div>
                    <Link
                      href="/resources/guides/facilities-management-guide"
                      className="inline-flex items-center gap-2.5 bg-brand-pink hover:bg-brand-pink/90 text-white text-xs uppercase tracking-widest font-medium py-3.5 px-6 rounded-sm transition-all hover:scale-[1.02] shadow-elevated"
                    >
                      <span>Read The Flagship Guide</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full bg-slate-950">
                  <Image
                    src="/images/editorial/entirefm-client-review-2000w.webp"
                    alt="EntireFM technical facilities management review"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. DISCIPLINE INDEX & EVERGREEN GUIDES                                    */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                  Authoritative Guidance Library
                </span>
                <h3 className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                  Technical Publications
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-light">
                Written and peer-reviewed by EntireFM building services engineers
              </span>
            </div>

            {/* Discipline Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-4">
              {GUIDE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-sm text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-pink text-white shadow-elevated'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={guide.href}
                  className="group rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden hover:border-brand-pink/60 transition-all flex flex-col justify-between shadow-elevated space-y-6"
                >
                  <div>
                    <div className="relative h-56 w-full bg-slate-950 overflow-hidden">
                      <Image
                        src={guide.imageSrc}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                      />
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] text-brand-pink border border-white/15 font-medium uppercase tracking-wider">
                        {guide.category}
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8 space-y-3">
                      <h4 className="text-xl font-light text-white group-hover:text-brand-pink transition-colors leading-snug">
                        {guide.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {guide.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-4 border-t border-brand-edge-dark flex items-center justify-between text-xs text-slate-400 font-light">
                    <span>{guide.readTime}</span>
                    <span className="text-brand-pink font-medium flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      Read Guide &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CROSS-DISCIPLINE PATHWAYS                                              */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                    Specialist Series
                  </span>
                  <h4 className="text-2xl font-light text-slate-900 tracking-tight">
                    AI &amp; Machine Learning in Facilities Management
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    Explore our comprehensive 11-part technical series covering predictive condition monitoring, IoT vibration telemetry, automated helpdesk triage, and modern CAFM systems.
                  </p>
                </div>
                <div>
                  <Link
                    href="/resources/ai-in-facilities-management"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-brand-electric hover:text-slate-900 transition-colors"
                  >
                    <span>Explore AI in FM Series</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-sm border border-slate-200 bg-slate-50 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                    Statutory Governance
                  </span>
                  <h4 className="text-2xl font-light text-slate-900 tracking-tight">
                    EntireFM Statutory Compliance Centre
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    Clear, authoritative guidance separating statutory obligations from British Standards across Fire Safety, Electrical EICR, Legionella water hygiene, commercial Gas, and F-Gas.
                  </p>
                </div>
                <div>
                  <Link
                    href="/compliance"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-brand-pink hover:text-slate-900 transition-colors"
                  >
                    <span>Visit Compliance Centre</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        <NewsletterSignupSection />
        <ProposalSection />
      </main>

      <Footer />
    </div>
  );
}
