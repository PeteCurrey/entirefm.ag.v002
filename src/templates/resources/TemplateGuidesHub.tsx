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
  return (
    <div className="bg-[#0B0E14] text-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-[#0B0E14] to-[#0B0E14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              ENTIREFM GUIDES &amp; KNOWLEDGE LIBRARY
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mt-3 mb-4">
              Practical Facilities Management Guides
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Detailed guidance for people responsible for commercial buildings, statutory maintenance, asset compliance, procurement, and FM strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Flagship Guide */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
                    FEATURED FLAGSHIP GUIDE
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">18 min read</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  The Complete Guide to Facilities Management
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm sm:text-base mb-6">
                  Comprehensive educational breakdown of commercial facilities management in the UK: Hard FM engineering, Soft FM services, Total FM contracts, statutory obligations, CAFM architecture, and performance SLAs.
                </p>
              </div>
              <div>
                <Link
                  href="/resources/guides/facilities-management-guide"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  Read The Guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-zinc-950">
              <Image
                src="/images/editorial/entirefm-client-review-2000w.webp"
                alt="EntireFM technical facilities management review"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Evergreen Guide Estate Grid */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-800 pb-4 mb-8 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Authoritative Editorial Guides</h3>
          <span className="text-xs font-mono text-zinc-500">Tier 2 Knowledge Resources</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVERGREEN_GUIDES.filter((g) => g.slug !== 'facilities-management-guide').map((guide) => (
            <Link
              key={guide.slug}
              href={guide.href}
              className="group bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-zinc-950">
                <Image
                  src={guide.imageSrc}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 border border-zinc-800 font-bold">
                  {guide.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {guide.title}
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    {guide.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                  <span>{guide.readTime}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Explore Guide &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
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
