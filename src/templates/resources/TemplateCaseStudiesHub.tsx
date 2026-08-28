import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Layers,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { listPublishedCaseStudies } from '@/server/trust/case-studies';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateCaseStudiesHubProps {
  route?: RouteRecord;
  content?: ContentRecord;
}

export function TemplateCaseStudiesHub({ route, content }: TemplateCaseStudiesHubProps) {
  const caseStudies = listPublishedCaseStudies();

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Case Studies', url: '/resources/case-studies' },
  ];

  return (
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO (85svh)                                                 */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-client-review-2000w.webp"
              alt="EntireFM Operational Case Studies and Engineering Reviews"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
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
                  Operational Case Studies
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                Proven Operational Delivery &amp; <br />
                <span className="font-light text-hero-pink">
                  Engineering Case Studies.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Explore how EntireFM solves complex commercial maintenance, statutory compliance risks, and building services engineering challenges across UK commercial, retail, and industrial portfolios.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-light border-t border-white/15">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Verified Engineering Outcomes
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Commercial, Industrial &amp; Retail Estates
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Statutory Audit Ready
                </span>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. CASE STUDIES GRID                                                      */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom space-y-12">
            
            <div className="space-y-2 border-b border-slate-200 pb-6">
              <span className="text-xs uppercase tracking-wider text-brand-pink font-medium block">
                Portfolio Reviews
              </span>
              <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Featured Client Deployments
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudies.map((cs) => (
                <article
                  key={cs.id}
                  className="bg-slate-50 border border-slate-200 rounded-sm overflow-hidden flex flex-col justify-between hover:border-brand-pink transition-all group shadow-sm space-y-6"
                >
                  <div className="p-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <span className="text-[10px] uppercase px-2.5 py-1 rounded-sm bg-white border border-slate-200 text-brand-pink font-medium tracking-wider">
                        {cs.sector}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-light">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {cs.location}
                      </span>
                    </div>

                    <h3 className="text-xl font-light text-slate-900 group-hover:text-brand-pink transition-colors leading-snug">
                      {cs.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
                      {cs.requirement}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-slate-200">
                      <span className="text-[11px] text-slate-500 uppercase font-medium tracking-wider block">
                        Verified Outcomes:
                      </span>
                      <ul className="text-xs text-slate-700 space-y-2 font-light">
                        {cs.verifiedOutcomes.slice(0, 2).map((vo, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-pink shrink-0 mt-0.5" />
                            <span>{vo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-8 pt-0 border-t border-slate-200">
                    <div className="text-xs text-brand-pink font-medium flex items-center justify-between pt-4 group-hover:text-slate-900 transition-colors">
                      <span>View Full Project Review</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        <ProposalSection
          headline="Have a Similar Commercial Estate Requirement?"
          subheadline="Discuss your estate profile, maintenance schedule, or compliance baseline with our senior technical operations team."
        />
      </main>

      <Footer />
    </div>
  );
}
