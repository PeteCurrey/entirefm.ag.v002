'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  FileCheck,
  ExternalLink,
  Wrench,
  BookOpen,
  ArrowRight,
  Filter,
} from 'lucide-react';

export function TemplateComplianceIntelligence() {
  const [records, setRecords] = useState<any[]>([]);
  const [activeDiscipline, setActiveDiscipline] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompliance() {
      try {
        const res = await fetch(`/api/lobby/compliance?discipline=${activeDiscipline}`);
        const data = await res.json();
        setRecords(data.records || []);
      } catch (err) {
        console.error('Error loading compliance records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCompliance();
  }, [activeDiscipline]);

  const disciplines = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'building-safety', label: 'Building Safety Act' },
    { id: 'water', label: 'Water Hygiene (L8)' },
    { id: 'electrical', label: 'Electrical (BS 7671)' },
    { id: 'energy', label: 'Energy & MEES' },
  ];

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compliance Masthead */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Statutory Compliance Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Compliance Watch
            </h1>
            <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl leading-relaxed">
              What changed. What matters. What to do next. Authoritative regulatory intelligence, statutory deadlines, and risk remediation for UK facilities leaders.
            </p>

            {/* Discipline Filter Tabs */}
            <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/5 pb-1">
              {disciplines.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDiscipline(d.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    activeDiscipline === d.id
                      ? 'bg-brand-electric text-white'
                      : 'bg-brand-graphite/40 text-brand-silver hover:text-white border border-white/5'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline & Compliance Records */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="py-12 text-center text-brand-silver text-sm">Loading statutory compliance updates...</div>
          ) : (
            <div className="space-y-8">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-brand-graphite/20 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
                >
                  {/* Top Status Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        {rec.timelineMonth}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-electric">
                        {rec.classification}
                      </span>
                      <span className="text-xs text-brand-silver">• {rec.authority}</span>
                    </div>

                    <span className="text-xs text-brand-silver flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Effective: {rec.effectiveDate}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {rec.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-brand-mist leading-relaxed">
                    {rec.summary}
                  </p>

                  {/* 3-Column Structured Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-electric">
                        What Changed
                      </span>
                      <p className="text-xs text-brand-silver leading-relaxed">{rec.whatChanged}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        Who It Affects
                      </span>
                      <p className="text-xs text-brand-silver leading-relaxed">{rec.whoAffected}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        Action Required
                      </span>
                      <p className="text-xs text-brand-silver leading-relaxed">{rec.actionRequired}</p>
                    </div>
                  </div>

                  {/* Linked Statutory Tools & Guidance */}
                  {rec.relatedTools && rec.relatedTools.length > 0 && (
                    <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-brand-electric" />
                        Connected Tools:
                      </span>
                      {rec.relatedTools.map((t: any) => (
                        <Link
                          key={t.url}
                          href={t.url}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-electric font-medium border border-white/5 transition-colors flex items-center gap-1"
                        >
                          {t.name}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
