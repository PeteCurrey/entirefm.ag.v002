'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Wrench,
  ShieldCheck,
  Building,
  FileText,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
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

const EVERGREEN_GUIDES = [
  {
    slug: 'facilities-management-guide',
    title: 'The Complete Guide to Facilities Management',
    href: '/resources/guides/facilities-management-guide',
    category: 'FM Fundamentals',
    description:
      'The definitive guide to modern facilities management: Hard vs Soft FM, service delivery models, statutory compliance, asset management, and contractor governance.',
    readTime: '18 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    isFlagship: true,
  },
  {
    slug: 'ppm-guide',
    title: 'The Complete Guide to Planned Preventative Maintenance (PPM)',
    href: '/resources/guides/ppm-guide',
    category: 'Maintenance & PPM',
    description:
      'How to structure asset-led maintenance programmes, balance statutory testing against manufacturer cycles, and eliminate reactive plant failure.',
    readTime: '15 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    isFlagship: true,
  },
  {
    slug: 'asset-register-guide',
    title: 'How to Build an FM Asset Register',
    href: '/resources/guides/asset-register-guide',
    category: 'Engineering & Assets',
    description:
      'Step-by-step guidance on establishing an ISO 55000 / Uniclass 2015 asset hierarchy, field tagging, condition scoring, and CAFM data hygiene.',
    readTime: '14 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    isFlagship: true,
  },
  {
    slug: 'fm-tender-guide',
    title: 'Facilities Management Tender & RFP Procurement Guide',
    href: '/resources/guides/fm-tender-guide',
    category: 'Procurement & Mobilisation',
    description:
      'How to define contract scope, draft output specifications, evaluate pricing models, and run structured FM supplier selection.',
    readTime: '16 min read',
    published: 'Updated August 2026',
    imageSrc: '/images/editorial/entirefm-facilities-management-meeting-1200w.webp',
    isFlagship: true,
  },
];

export function TemplateGuidesHub({ route, content }: TemplateGuidesHubProps) {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Guides', url: '/resources/guides' },
  ];

  return (
    <div className="bg-brand-void text-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 border-b border-brand-edge-dark bg-brand-void overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[15%] -top-[30%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[130px]"
          style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }}
        />
        <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-30" />

        <div className="container-custom relative">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />

          <div className="max-w-3xl space-y-4">
            <span className="eyebrow eyebrow-dark inline-block">Knowledge & Guidance Library</span>
            <h1 className="text-display-md text-white font-extrabold tracking-tight">
              Practical Facilities Management Guides
            </h1>
            <p className="text-base sm:text-lg text-brand-mist/75 leading-relaxed">
              Detailed, practical guidance engineered for people responsible for commercial buildings, statutory maintenance, asset compliance, procurement, and FM strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Flagship Guide */}
      <section className="py-16 bg-brand-carbon border-b border-brand-edge-dark">
        <div className="container-custom">
          <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite overflow-hidden hover:border-brand-electric/50 transition-all shadow-elevated">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-blue-500/10 text-brand-electric-bright border border-blue-500/20 font-bold">
                      FEATURED FLAGSHIP GUIDE
                    </span>
                    <span className="text-xs text-brand-mist/50 font-mono">18 min read</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                    The Complete Guide to Facilities Management
                  </h2>
                  <p className="text-brand-mist/75 leading-relaxed text-sm sm:text-base">
                    Comprehensive educational breakdown of commercial facilities management in the UK: Hard FM engineering, Soft FM services, Total FM contracts, statutory obligations, CAFM architecture, and performance SLAs.
                  </p>
                </div>
                <div>
                  <Link
                    href="/resources/guides/facilities-management-guide"
                    className="btn-primary py-3 px-5 text-xs inline-flex"
                  >
                    Read The Complete Guide <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-brand-void">
                <Image
                  src="/images/editorial/entirefm-client-review-2000w.webp"
                  alt="EntireFM technical facilities management review"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evergreen Guide Grid */}
      <section className="py-16 bg-brand-void border-b border-brand-edge-dark">
        <div className="container-custom">
          <div className="border-b border-brand-edge-dark pb-4 mb-8 flex items-center justify-between">
            <div>
              <span className="eyebrow eyebrow-dark">Specialist References</span>
              <h3 className="text-xl font-bold text-white mt-1">Authoritative Editorial Guides</h3>
            </div>
            <span className="text-xs font-mono text-brand-mist/50 hidden sm:inline">
              Written by FM Engineers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVERGREEN_GUIDES.filter((g) => g.slug !== 'facilities-management-guide').map((guide) => (
              <Link
                key={guide.slug}
                href={guide.href}
                className="group rounded-sm bg-brand-graphite border border-brand-edge-dark overflow-hidden hover:border-brand-electric/50 transition-all flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-brand-carbon">
                  <Image
                    src={guide.imageSrc}
                    alt={guide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-brand-void/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-brand-electric-bright border border-brand-edge-dark font-bold">
                    {guide.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-brand-electric-bright transition-colors mb-2">
                      {guide.title}
                    </h4>
                    <p className="text-brand-mist/70 text-xs leading-relaxed mb-4">
                      {guide.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-brand-edge-dark text-[11px] font-mono text-brand-mist/50">
                    <span>{guide.readTime}</span>
                    <span className="text-brand-electric-bright flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      Explore Guide &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI & Specialist Topics Cross-Link Section */}
      <section className="py-16 bg-brand-carbon border-b border-brand-edge-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="eyebrow eyebrow-dark">Specialist Knowledge</span>
                <h4 className="text-lg font-bold text-white mt-1">
                  AI & Machine Learning in Facilities Management
                </h4>
                <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                  Explore our comprehensive 11-part technical series on predictive maintenance, IoT telemetry, AI helpdesk automation, and next-generation CAFM systems.
                </p>
              </div>
              <Link
                href="/resources/ai-in-facilities-management"
                className="text-xs font-semibold text-brand-electric-bright hover:underline flex items-center gap-1"
              >
                Explore AI in FM Guide Series &rarr;
              </Link>
            </div>

            <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="eyebrow eyebrow-dark">Legal Obligations</span>
                <h4 className="text-lg font-bold text-white mt-1">
                  EntireFM Statutory Compliance Centre
                </h4>
                <p className="text-xs text-brand-mist/70 mt-2 leading-relaxed">
                  Clear, authoritative guidance separating statutory obligations from British Standards across Fire Safety, Electrical EICR, Legionella, Gas, and F-Gas.
                </p>
              </div>
              <Link
                href="/compliance"
                className="text-xs font-semibold text-brand-electric-bright hover:underline flex items-center gap-1"
              >
                Visit Compliance Centre &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Newsletter Conversion */}
      <TrustBar />
      <ProposalSection />
      <NewsletterSignupSection />
      <Footer />
    </div>
  );
}
