import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export type CaseStudyVerificationStatus =
  | 'VERIFIED'
  | 'VERIFIED_ANONYMOUS'
  | 'DRAFT_NOT_PUBLISHABLE';

export interface CaseStudyProps {
  title: string;
  clientType: string;
  sector: string;
  location: string;
  challenge: string;
  solution: string;
  results: string[];
  verificationStatus: CaseStudyVerificationStatus;
  publishApproved: boolean;
}

/**
 * CASE STUDY FEATURE COMPONENT
 * =============================
 * Renders an approved case study only when:
 *   verificationStatus === 'VERIFIED' | 'VERIFIED_ANONYMOUS'
 *   AND publishApproved === true
 *
 * Returns null in all other states — no default/fake data is ever rendered.
 * Phase 09R.3: All fabricated defaults (EFM-CS-042, 32% reduction, 14 buildings)
 * have been permanently removed.
 */
export function CaseStudyFeature(props: Partial<CaseStudyProps>) {
  const {
    verificationStatus,
    publishApproved,
    title,
    clientType,
    sector,
    location,
    challenge,
    solution,
    results,
  } = props;

  // Gate: only render when explicitly verified and approved
  if (
    !publishApproved ||
    (verificationStatus !== 'VERIFIED' && verificationStatus !== 'VERIFIED_ANONYMOUS')
  ) {
    return null;
  }

  // Type-narrowed — all fields must be present for a publishable case study
  if (!title || !clientType || !sector || !location || !challenge || !solution || !results?.length) {
    return null;
  }

  return (
    <section className="section-padding bg-brand-graphite text-white border-y border-brand-edge-dark">
      <div className="container-custom">
        <div className="max-w-3xl mb-10">
          <span className="badge-gold">Operational Evidence</span>
          <h2 className="text-3xl font-extralight tracking-tight text-white mt-2">
            Engineering &amp; Estate Management in Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Facilities management delivery demonstrating statutory compliance and operational performance.
          </p>
        </div>

        <div className="p-8 bg-brand-carbon border border-brand-edge-dark rounded-sm shadow-elevated grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 bg-brand-graphite border border-brand-edge-dark rounded-sm text-brand-electric">{sector}</span>
              <span className="px-2 py-0.5 bg-brand-graphite border border-brand-edge-dark rounded-sm text-slate-300">{location}</span>
              <span className="px-2 py-0.5 bg-brand-graphite border border-brand-edge-dark rounded-sm text-slate-300">{clientType}</span>
            </div>

            <h3 className="text-xl font-light text-white leading-snug">{title}</h3>

            <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-edge-dark">
              <div>
                <strong className="text-brand-electric uppercase tracking-wider font-mono block text-[10px] mb-0.5">The Challenge</strong>
                <p className="leading-relaxed">{challenge}</p>
              </div>

              <div>
                <strong className="text-brand-electric uppercase tracking-wider font-mono block text-[10px] mb-0.5">EntireFM Solution</strong>
                <p className="leading-relaxed">{solution}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-brand-graphite border border-brand-edge-dark rounded-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric block mb-3 font-light">
                Outcomes &amp; Value Delivered
              </span>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {results.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-brand-edge-dark mt-6 flex items-center justify-end">
              <Link href="/case-studies" className="text-xs font-normal text-brand-electric hover:text-brand-purple flex items-center gap-1">
                All Case Studies <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RelatedLinks({
  title = 'Related Facilities Management & Regional Pages',
  links,
}: {
  title?: string;
  links: Array<{ path: string; label?: string; title?: string; category?: string; description?: string; context?: string }>;
}) {
  if (!links || links.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-brand-edge">
      <div className="container-custom">
        <span className="badge-technical mb-2">Interconnected Architecture</span>
        <h3 className="text-lg font-light text-brand-graphite mt-1 mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map(link => {
            const displayTitle = link.title || link.label || link.path;
            const displayCategory = link.category || link.context;
            return (
              <Link
                key={link.path}
                href={link.path}
                className="p-3 bg-brand-surface border border-brand-edge rounded-sm text-xs font-normal text-brand-graphite hover:text-brand-electric hover:border-brand-electric/60 transition-all flex flex-col gap-1 shadow-subtle group"
              >
                {displayCategory && (
                  <span className="text-[10px] font-mono text-brand-electric/80 uppercase tracking-wider">{displayCategory}</span>
                )}
                <div className="flex items-center justify-between">
                  <span>{displayTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-electric group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
