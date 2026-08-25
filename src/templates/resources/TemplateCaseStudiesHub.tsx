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

  return (
    <div className="bg-[#0B0E14] text-white min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-[#0B0E14] to-[#0B0E14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-light">
              PROVEN OPERATIONAL DELIVERY
            </span>
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-tight text-white mt-3 mb-4">
              Real Estates. Real Engineering Challenges. Real FM Delivery.
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Explore how EntireFM solves complex commercial maintenance, statutory compliance, and building engineering challenges across UK commercial, retail, and industrial estates.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((cs) => (
            <article
              key={cs.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition-all group shadow-md"
            >
              <div className="p-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-light">
                    {cs.sector}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-zinc-500" /> {cs.location}
                  </span>
                </div>

                <h3 className="text-xl font-light text-white group-hover:text-emerald-400 transition-colors leading-snug">
                  {cs.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {cs.requirement}
                </p>

                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-light block">
                    Verified Outcomes:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1.5">
                    {cs.verifiedOutcomes.slice(0, 2).map((vo, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{vo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-7 pt-0 border-t border-zinc-800/40 mt-4">
                <div className="text-xs font-mono text-emerald-400 font-light flex items-center justify-between pt-4">
                  <span>View Full Project Review</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <TrustBar />
      <ProposalSection
        headline="Have a Similar Commercial Estate Requirement?"
        subheadline="Discuss your estate profile, maintenance schedule, or compliance baseline with our senior technical operations team."
      />
      <Footer />
    </div>
  );
}
