'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldAlert,
  Gavel,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import type { CanonicalIntelligenceItem, ProcurementOpportunity } from '@/server/intelligence/types';

export function TemplateLobbyToday() {
  const [data, setData] = useState<{
    statutoryItems: CanonicalIntelligenceItem[];
    latestNews: CanonicalIntelligenceItem[];
    consultations: CanonicalIntelligenceItem[];
    parliamentWatch: CanonicalIntelligenceItem[];
    safetyAlerts: CanonicalIntelligenceItem[];
    contractAwards: ProcurementOpportunity[];
    closingTenders: ProcurementOpportunity[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lobby/intelligence/today')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const todayStr = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <main className="min-h-screen bg-[#07090E] text-white pt-24 pb-20">
      {/* ─── MASTHEAD HEADER ─── */}
      <section className="container-wide border-b border-white/10 pb-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-semibold">
                DAILY INTELLIGENCE BRIEFING
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/40 font-mono">Live Canonical Feeds</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white">
              What Changed Today
            </h1>
            <p className="text-sm font-light text-white/60 mt-2 font-mono">{todayStr}</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/lobby/opportunities"
              className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border border-white/20 px-4 py-2 rounded-sm hover:border-brand-electric transition-colors inline-flex items-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5 text-brand-electric" />
              <span>Procurement & Awards</span>
            </Link>
            <Link
              href="/lobby/compliance"
              className="text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white border border-white/20 px-4 py-2 rounded-sm hover:border-brand-electric transition-colors inline-flex items-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compliance Registry</span>
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="container-wide py-20 text-center text-white/40 font-mono text-sm">
          Loading live intelligence streams from official authorities...
        </div>
      ) : (
        <div className="container-wide space-y-16">
          {/* ─── SECTION 1: WHAT CHANGED / STATUTORY & LEGAL ─── */}
          <section>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white/80 font-medium">
                  Statutory Changes & Regulatory Guidance
                </h2>
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase">Tier 1 Authority</span>
            </div>

            {data?.statutoryItems && data.statutoryItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.statutoryItems.slice(0, 2).map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white/[0.03] border border-white/10 hover:border-white/25 rounded-sm p-6 flex flex-col justify-between transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                          {item.legalStatus.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] font-mono text-white/40">
                          {item.jurisdictions.join(' · ')}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-light text-white leading-snug group-hover:text-brand-electric transition-colors">
                        <a href={item.canonicalUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5">
                          <span>{item.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 shrink-0 mt-1" />
                        </a>
                      </h3>
                      <p className="text-xs font-light text-white/70 leading-relaxed">
                        {item.standfirst}
                      </p>
                      {item.whyItMatters && (
                        <div className="text-[11px] font-light text-white/50 border-l-2 border-emerald-400/60 pl-3 py-0.5 mt-3">
                          <span className="text-white/70 font-medium">Why it matters: </span>
                          {item.whyItMatters}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                      <span>Source: {item.primarySource.name}</span>
                      <span>Published {new Date(item.publishedAt).toLocaleDateString('en-GB')}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/[0.02] border border-white/5 text-white/40 font-mono text-xs">
                No statutory orders or secondary legislation published in the last 24 hours.
              </div>
            )}
          </section>

          {/* ─── SECTION 2: WHO WON WHAT (CONTRACT AWARDS) ─── */}
          <section>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-electric" />
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white/80 font-medium">
                  Who Won What · Public & Commercial Contract Awards
                </h2>
              </div>
              <Link
                href="/lobby/opportunities"
                className="text-[10px] font-mono text-brand-electric hover:underline flex items-center gap-1"
              >
                <span>View all tenders</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {data?.contractAwards && data.contractAwards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.contractAwards.map((award) => (
                  <article
                    key={award.id}
                    className="bg-white/[0.03] border border-white/10 hover:border-white/20 p-5 rounded-sm flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-brand-electric">
                        {award.awardDetails?.supplierName || 'Awarded Contractor'}
                      </div>
                      <div className="text-sm font-medium text-white leading-snug">
                        {award.awardDetails?.awardedValue || 'Value on Application'}
                      </div>
                      <p className="text-xs font-light text-white/60 line-clamp-2">
                        {award.title}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
                      <span>Buyer: {award.buyerName.slice(0, 22)}...</span>
                      <a
                        href={award.officialNoticeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-electric hover:text-white flex items-center gap-1"
                      >
                        <span>Notice</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/[0.02] border border-white/5 text-white/40 font-mono text-xs">
                Awaiting new OCDS contract award releases from Contracts Finder & FTS.
              </div>
            )}
          </section>

          {/* ─── SECTION 3: PARLIAMENT & CONSULTATIONS (EARLY WARNING) ─── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Parliament Watch */}
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/80 font-medium">
                    Parliament Watch · In Progress
                  </h3>
                </div>
              </div>

              {data?.parliamentWatch && data.parliamentWatch.length > 0 ? (
                <div className="space-y-3">
                  {data.parliamentWatch.map((bill) => (
                    <div
                      key={bill.id}
                      className="bg-white/[0.02] border border-white/5 p-4 rounded-sm hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-purple-300 mb-1">
                        <span>{bill.parliamentData?.house || 'House of Commons'}</span>
                        <span className="text-white/40">{bill.parliamentData?.currentStage || 'Committee'}</span>
                      </div>
                      <h4 className="text-sm font-light text-white leading-snug">
                        <a href={bill.canonicalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-electric">
                          {bill.parliamentData?.billTitle || bill.title}
                        </a>
                      </h4>
                      <p className="text-[11px] font-light text-white/50 mt-1.5 line-clamp-2">
                        {bill.standfirst}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-white/40 font-mono text-xs bg-white/[0.01]">
                  No active parliamentary bills updated this session.
                </div>
              )}
            </div>

            {/* Consultation Watch */}
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/80 font-medium">
                    Consultation Watch · Open Calls
                  </h3>
                </div>
              </div>

              {data?.consultations && data.consultations.length > 0 ? (
                <div className="space-y-3">
                  {data.consultations.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white/[0.02] border border-white/5 p-4 rounded-sm hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 mb-1">
                        <span>{c.primarySource.name}</span>
                        <span className="text-white/40">Open Consultation</span>
                      </div>
                      <h4 className="text-sm font-light text-white leading-snug">
                        <a href={c.canonicalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-electric">
                          {c.title}
                        </a>
                      </h4>
                      <p className="text-[11px] font-light text-white/50 mt-1.5 line-clamp-2">
                        {c.standfirst}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-white/40 font-mono text-xs bg-white/[0.01]">
                  No open public consultations logged today.
                </div>
              )}
            </div>
          </section>

          {/* ─── SECTION 4: PRODUCT SAFETY & RECALLS ─── */}
          {data?.safetyAlerts && data.safetyAlerts.length > 0 && (
            <section>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-white/80 font-medium">
                    OPSS Product Safety & Equipment Recalls
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-rose-400 uppercase">Action Required</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.safetyAlerts.map((alert) => (
                  <article
                    key={alert.id}
                    className="bg-rose-500/[0.03] border border-rose-500/20 hover:border-rose-500/40 p-5 rounded-sm"
                  >
                    <div className="text-[10px] font-mono uppercase text-rose-400 mb-1">
                      Office for Product Safety and Standards (OPSS)
                    </div>
                    <h3 className="text-sm font-medium text-white leading-snug">
                      <a href={alert.canonicalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {alert.title}
                      </a>
                    </h3>
                    <p className="text-xs font-light text-white/60 mt-2">
                      {alert.standfirst}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
