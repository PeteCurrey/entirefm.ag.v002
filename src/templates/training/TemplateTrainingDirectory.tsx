'use client';

import React from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  GraduationCap,
  Award,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { RECOMMENDED_TRAINING_PROVIDERS } from '@/server/cpd/cpd-store';

export function TemplateTrainingDirectory() {
  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header Hero */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Professional Development
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  UK FM Training & CPD Directory
                </h1>
                <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl font-light">
                  Curated external training bodies, regulated qualification pathways, and statutory engineering accreditations across the UK FM sector.
                </p>
              </div>

              <div>
                <Link
                  href="/lobby/me/cpd"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-electric hover:bg-brand-electric-hover text-white font-medium text-sm transition shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  My CPD Hours Log
                </Link>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-brand-charcoal/30 p-4 text-xs text-brand-silver max-w-3xl">
              <span className="text-white font-semibold">Note on Directory Curation: </span>
              The providers below represent the established, statutory, and regulated awarding bodies recognised by EntireFM across commercial estate maintenance. Outbound links connect directly to official institution portals.
            </div>
          </div>
        </section>

        {/* Training Providers Cards */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {RECOMMENDED_TRAINING_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="rounded-2xl border border-white/10 bg-brand-charcoal/40 hover:border-brand-electric/30 p-6 sm:p-8 backdrop-blur-md transition space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-brand-electric/15 text-brand-electric border border-brand-electric/30">
                        {provider.statusBadge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{provider.name}</h2>
                    <p className="text-xs text-brand-silver mt-0.5">{provider.accreditationBody}</p>
                  </div>

                  <a
                    href={provider.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 hover:border-brand-electric/50 text-xs font-medium text-white hover:text-brand-electric transition shrink-0"
                  >
                    <span>Visit Official Academy</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-sm text-brand-silver leading-relaxed">{provider.description}</p>

                {/* Course Highlights */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-brand-slate font-semibold mb-3">
                    Featured Programmes & Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {provider.courseHighlights.map((course, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-white/5 bg-brand-void/80 p-4 space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] uppercase font-mono text-emerald-400">
                            {course.level}
                          </span>
                          <h4 className="text-sm font-semibold text-white mt-1">{course.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-brand-slate mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </span>
                            <span>· {course.format}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <a
                            href={course.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-brand-electric hover:underline"
                          >
                            Course syllabus & dates
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disciplines */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {provider.disciplines.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-brand-void text-brand-silver border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
