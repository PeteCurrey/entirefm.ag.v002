import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageHero } from '@/components/hero/PageHero';
import { Footer } from '@/components/layout/Footer';
import { TrustBar, AccreditationRail } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { FAQAccordion } from '@/components/content/CapabilityList';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ClipboardCheck,
  Wrench,
  Layers,
  HelpCircle,
  FileCheck2,
  Building,
  Activity,
  FileText,
} from 'lucide-react';
import type { TemplateProps } from './types';
import { listPublishedCaseStudies } from '@/server/trust/case-studies';

export function TemplateSector({ route, content }: TemplateProps) {
  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Sectors', url: '/sectors' },
    { name: content.h1, url: route.path },
  ];

  const caseStudies = listPublishedCaseStudies();

  // Sector-specific procurement questions & estate breakdown
  const capabilities = content.capabilities || [];
  const faqs = content.faqs || [];
  const relatedRoutes = content.relatedRoutes || ['/sectors', '/ppm', '/contact-us'];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main id="main" className="flex-grow">
        <PageHero
          eyebrow={content.eyebrow || 'Sector Blueprint'}
          title={content.h1}
          intro={content.heroIntro || content.metaDescription}
          path={route.path}
          breadcrumbs={breadcrumbs}
          primaryCta={{ label: 'Discuss your estate', href: '#enquiry' }}
          facts={[
            { figure: 'Operating Hours', label: 'Maintenance scheduled around production, trading, or tenant access windows' },
            { figure: 'Statutory Proof', label: 'Digital certification, asset tagging, and complete audit documentation' },
            { figure: 'Single Contract', label: 'Integrated Hard & Soft FM accountability across your entire portfolio' },
          ]}
        />

        <TrustBar />

        {/* Operating Context & Critical Priorities */}
        {content.sections && content.sections.length > 0 && (
          <section className="py-16 sm:py-20 bg-brand-surface border-b border-brand-edge">
            <div className="container-custom space-y-12">
              <div className="max-w-3xl">
                <span className="badge-technical">Operating Environment</span>
                <h2 className="text-display-sm text-brand-graphite mt-3">
                  Operational Priorities &amp; Estate Context
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Understanding what actually matters across the physical estate: uptime, safety, regulatory compliance, and occupant satisfaction.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.sections.map((sec, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-sm border border-brand-edge space-y-4 shadow-sm">
                    <h3 className="text-xl font-bold text-brand-graphite">{sec.heading}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{sec.body}</p>
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="space-y-2 pt-2 border-t border-brand-edge">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sector Maintenance Capabilities & Asset Types */}
        {capabilities.length > 0 && (
          <section className="py-16 sm:py-20 bg-white border-b border-brand-edge">
            <div className="container-custom space-y-10">
              <div className="max-w-3xl">
                <span className="badge-technical">Estate Disciplines</span>
                <h2 className="text-display-sm text-brand-graphite mt-3">
                  Core Maintenance &amp; Engineering Scopes
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  Disciplined hard and soft facilities management structured around the critical plant and physical fabric of this sector.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="bg-brand-surface p-6 rounded-sm border border-brand-edge flex flex-col justify-between"
                  >
                    <div>
                      {cap.tag && (
                        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-silver font-semibold block mb-2">
                          {cap.tag}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-brand-graphite">{cap.name}</h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">{cap.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Buyer & Procurement Guidance Section */}
        <section className="py-16 sm:py-20 bg-brand-carbon text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                PROCUREMENT &amp; TENDER PLANNING
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                Key Procurement Questions to Ask an FM Provider
              </h2>
              <p className="mt-3 text-sm text-brand-mist/70 leading-relaxed">
                When compiling specifications or evaluating supplier proposals for this sector, prioritize verifiable operational evidence over generic sales promises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-brand-graphite/60 border border-brand-edge-dark p-6 rounded space-y-3">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                  1
                </div>
                <h3 className="text-sm font-bold text-white">Maintenance Access &amp; Windows</h3>
                <p className="text-xs text-brand-mist/80 leading-relaxed">
                  How will routine servicing and statutory testing be scheduled to avoid interrupting core production, trading, or quiet working hours?
                </p>
              </div>

              <div className="bg-brand-graphite/60 border border-brand-edge-dark p-6 rounded space-y-3">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                  2
                </div>
                <h3 className="text-sm font-bold text-white">Asset Register &amp; PPM Baseline</h3>
                <p className="text-xs text-brand-mist/80 leading-relaxed">
                  What is the provider’s exact methodology for auditing on-site physical assets during mobilisation and mapping them against SFG20 task frequencies?
                </p>
              </div>

              <div className="bg-brand-graphite/60 border border-brand-edge-dark p-6 rounded space-y-3">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                  3
                </div>
                <h3 className="text-sm font-bold text-white">Subcontractor Quality Control</h3>
                <p className="text-xs text-brand-mist/80 leading-relaxed">
                  How are specialist trade contractors (Gas Safe, NICEIC, F-Gas) pre-qualified, supervised, and required to log digital compliance certificates?
                </p>
              </div>
            </div>

            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Structuring an FM Invitation to Tender (ITT)?</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Use our free interactive Tender Brief Generator to format asset details, site scopes, and performance SLAs.
                </p>
              </div>
              <Link
                href="/tools/tender-brief"
                className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-brand-electric hover:bg-brand-electric-bright px-4 py-2.5 rounded transition-colors whitespace-nowrap"
              >
                <FileCheck2 className="w-4 h-4" /> Open Tender Brief Generator
              </Link>
            </div>
          </div>
        </section>

        {/* Relevant Case Study Proof */}
        {caseStudies.length > 0 && (
          <section className="py-16 sm:py-20 bg-brand-surface border-b border-brand-edge">
            <div className="container-custom space-y-10">
              <div className="max-w-3xl">
                <span className="badge-technical">Project Proof</span>
                <h2 className="text-display-sm text-brand-graphite mt-3">
                  Verified Operational Case Studies
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  Real operational scopes, engineering remediation, and compliance governance delivered across UK commercial facilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {caseStudies.map((cs) => (
                  <div
                    key={cs.id}
                    className="bg-white p-6 rounded-sm border border-brand-edge flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-silver font-semibold">
                          {cs.sector}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          {cs.location}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-brand-graphite">{cs.title}</h3>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">{cs.challenge}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-brand-edge flex items-center justify-between">
                      <Link
                        href={`/case-studies`}
                        className="text-xs font-bold text-brand-electric hover:text-brand-graphite inline-flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        Read Project Summary <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Accreditations */}
        <section className="py-12 bg-white">
          <div className="container-custom">
            <AccreditationRail />
          </div>
        </section>

        {/* Sector FAQs */}
        {faqs.length > 0 && (
          <section className="py-16 bg-brand-surface border-t border-brand-edge">
            <div className="container-custom max-w-4xl space-y-8">
              <div>
                <span className="badge-technical">Sector Questions</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-graphite mt-2">
                  Frequently Asked Questions
                </h2>
              </div>
              <FAQAccordion faqs={faqs} />
            </div>
          </section>
        )}

        {/* Related Sector Navigation */}
        <section className="py-12 bg-white border-t border-brand-edge">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-brand-graphite uppercase tracking-wider">
                  Explore Related Sector Blueprints
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Discover how EntireFM supports other commercial, logistics, and corporate environments across the UK.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/sectors"
                  className="text-xs font-semibold text-brand-electric hover:text-brand-graphite bg-brand-surface px-3 py-1.5 rounded border border-brand-edge inline-flex items-center gap-1"
                >
                  All Sectors Directory <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Proposal / Conversion Section */}
        <ProposalSection
          defaultService={content.h1}
          headline={`Discuss Facilities Management for Your ${content.eyebrow || 'Estate'}`}
          subheadline="Consult directly with our commercial FM specialists. We develop comprehensive operational proposals tailored to your facility operations, access windows, and statutory compliance demands."
        />
      </main>
      <Footer />
    </div>
  );
}
