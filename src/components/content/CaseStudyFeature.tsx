import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, CheckCircle, ExternalLink } from 'lucide-react';

export interface CaseStudyProps {
  title: string;
  clientType: string;
  sector: string;
  location: string;
  challenge: string;
  solution: string;
  results: string[];
}

export function CaseStudyFeature({
  title = 'Multi-Site Commercial Property Portfolio M&E Overhaul',
  clientType = 'Commercial Managing Agent Portfolio',
  sector = 'Commercial Property',
  location = 'London & Home Counties',
  challenge = 'Aging mechanical plant, fragmented contractor management, and rising compliance exposure across 14 commercial buildings.',
  solution = 'EntireFM introduced unified SFG20 PPM schedules, centralized 24/7 helpdesk dispatch, and direct engineering delivery across all mechanical & electrical assets.',
  results = [
    '100% statutory compliance achieved across all sites within 90 days',
    '32% reduction in reactive maintenance callout volume through proactive servicing',
    'Full asset digitalization & live CAFM compliance dashboard for property managers',
  ],
}: Partial<CaseStudyProps>) {
  return (
    <section className="section-padding bg-brand-navy text-white border-y border-brand-border-dark">
      <div className="container-custom">
        <div className="max-w-3xl mb-10">
          <span className="badge-gold">Operational Evidence</span>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-2">
            Engineering & Estate Management in Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Proven multi-disciplinary facilities management delivering verified statutory compliance and operational cost reduction.
          </p>
        </div>

        <div className="p-8 bg-brand-charcoal border border-brand-border-dark rounded-sm shadow-command grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 bg-brand-navy border border-brand-border-dark rounded-sm text-brand-gold">{sector}</span>
              <span className="px-2 py-0.5 bg-brand-navy border border-brand-border-dark rounded-sm text-slate-300">{location}</span>
              <span className="px-2 py-0.5 bg-brand-navy border border-brand-border-dark rounded-sm text-slate-300">{clientType}</span>
            </div>

            <h3 className="text-xl font-bold text-white leading-snug">{title}</h3>

            <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-brand-border-dark">
              <div>
                <strong className="text-brand-gold uppercase tracking-wider font-mono block text-[10px] mb-0.5">The Challenge</strong>
                <p className="leading-relaxed">{challenge}</p>
              </div>

              <div>
                <strong className="text-brand-gold uppercase tracking-wider font-mono block text-[10px] mb-0.5">EntireFM Solution</strong>
                <p className="leading-relaxed">{solution}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-brand-navy border border-brand-border-dark rounded-sm">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold block mb-3 font-semibold">
                Verified Outcomes & Value Delivered
              </span>
              <ul className="space-y-2.5 text-xs text-slate-200">
                {results.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-brand-border-dark mt-6 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Case Reference #EFM-CS-042</span>
              <Link href="/case-studies" className="text-xs font-bold text-brand-gold hover:text-brand-gold-light flex items-center gap-1">
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
  links: Array<{ path: string; label: string; context?: string }>;
}) {
  if (!links || links.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-brand-border">
      <div className="container-custom">
        <span className="badge-technical mb-2">Interconnected Architecture</span>
        <h3 className="text-lg font-bold text-brand-navy mt-1 mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className="p-3 bg-brand-surface border border-brand-border rounded-sm text-xs font-semibold text-brand-navy hover:text-brand-gold hover:border-brand-gold/60 transition-all flex items-center justify-between group shadow-subtle"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
