'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  Clock,
  Award,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { LearningPath } from '@/server/academy/types';
import { SEED_LEARNING_PATHS } from '@/server/academy/seed-data';

export function TemplateLobbyLearnAcademy() {
  const [paths, setPaths] = useState<LearningPath[]>(SEED_LEARNING_PATHS);

  useEffect(() => {
    async function loadPaths() {
      try {
        const res = await fetch('/api/academy/paths');
        if (res.ok) {
          const data = await res.json();
          if (data.paths && data.paths.length > 0) {
            setPaths(data.paths);
          }
        }
      } catch {
        // Use seed paths fallback
      }
    }

    loadPaths();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-12">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/learn" className="hover:text-neutral-900 transition-colors">LEARN</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Academy</span>
        </nav>

        {/* Header */}
        <div className="border-b border-neutral-200 pb-10 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric font-medium">
              THE LOBBY · LEARN · ACADEMY
            </span>
            <span className="text-neutral-300">·</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Accredited Paths Live</span>
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-neutral-900 mb-3">
                EntireFM Academy.
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 max-w-3xl leading-relaxed">
                Engineering-grounded professional development pathways for UK facilities managers, compliance directors, and building custodians. Complete practical operational modules, pass a rigorous gated assessment, and earn a verifiable credential you can publish to LinkedIn.
              </p>
            </div>
          </div>

          {/* Credibility Seal */}
          <div className="bg-white border border-neutral-200/90 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-neutral-900">
                  Genuinely Gated Verification Standard
                </p>
                <p className="text-xs font-light text-neutral-500">
                  Assessments are graded server-side with strict pass marks. Credentials cannot be acquired through passive clicking.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              SFG20 &amp; CIBSE Aligned
            </span>
          </div>
        </div>

        {/* Live Accredited Learning Paths */}
        <section className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              OFFICIAL CERTIFICATION PATHWAYS
            </p>
            <h2 className="text-2xl font-light text-neutral-900 tracking-tight">
              Accredited Learning Paths
            </h2>
            <p className="text-xs text-neutral-500 font-light">
              Select a learning pathway, study the syllabus modules, and complete the server-evaluated examination.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {paths.map((path) => {
              const totalMins = path.modules.reduce((acc, m) => acc + m.durationMinutes, 0);

              return (
                <div
                  key={path.id}
                  className="rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8 hover:border-neutral-300 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-900">
                        <Award className="w-3 h-3 text-amber-600" />
                        <span>Role: {path.targetRole}</span>
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        Pass Mark: {path.passMarkPercent}%
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-xl font-medium text-neutral-900">
                        <Link
                          href={`/academy/${path.slug}`}
                          className="hover:text-brand-pink transition-colors"
                        >
                          {path.title}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                        {path.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-light text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{path.modules.length} modules</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>~{totalMins} mins reading</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0">
                    <Link
                      href={`/academy/${path.slug}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors shadow-xs"
                    >
                      <span>Start Pathway</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What's available in LEARN */}
        <section className="bg-white border border-neutral-200 rounded-xl p-8 shadow-2xs space-y-5">
          <h2 className="text-lg font-light text-neutral-900">Additional Resources in LEARN</h2>
          <p className="text-sm font-light text-neutral-500">
            Complement your Academy pathway with practical field guides, technical briefings, and operational playbooks from the LEARN library.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/lobby/learn/guides"
              className="inline-flex items-center gap-2 text-xs font-medium bg-neutral-900 text-white px-4 py-2.5 rounded-[3px] hover:bg-neutral-800 transition-colors"
            >
              Browse Guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/lobby/learn/playbooks"
              className="inline-flex items-center gap-2 text-xs font-light border border-neutral-300 text-neutral-700 px-4 py-2.5 rounded-[3px] hover:border-neutral-500 transition-colors"
            >
              FM Playbooks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/lobby/learn/scenarios"
              className="inline-flex items-center gap-2 text-xs font-light border border-neutral-300 text-neutral-700 px-4 py-2.5 rounded-[3px] hover:border-neutral-500 transition-colors"
            >
              Scenarios <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <div className="border-t border-neutral-200 pt-6 text-[11px] font-light text-neutral-400 leading-relaxed">
          EntireFM Academy credentials verify competence in commercial facilities management operational standards, statutory compliance obligations, and SFG20 maintenance regimes.
        </div>
      </main>

      <Footer />
    </div>
  );
}
