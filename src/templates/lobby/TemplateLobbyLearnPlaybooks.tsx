'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookMarked, Clock } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { LEARN_RESOURCES } from '@/data/lobby/learn-data';

const LEVEL_LABELS: Record<string, string> = {
  Foundation: 'bg-sky-50 text-sky-700',
  Practitioner: 'bg-teal-50 text-teal-700',
  Senior: 'bg-indigo-50 text-indigo-700',
  Leadership: 'bg-purple-50 text-purple-700',
  Specialist: 'bg-orange-50 text-orange-700',
};

export function TemplateLobbyLearnPlaybooks() {
  const playbooks = LEARN_RESOURCES.filter(r => r.contentType === 'Playbook');
  const published = playbooks.filter(r => r.status === 'PUBLISHED');
  const upcoming = playbooks.filter(r => r.status === 'COMING_SOON');

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-12">

        <nav className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/learn" className="hover:text-neutral-900 transition-colors">LEARN</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Playbooks</span>
        </nav>

        <div className="border-b border-neutral-200 pb-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-2">THE LOBBY · LEARN · Playbooks</p>
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight mb-3">FM Playbooks.</h1>
          <p className="text-sm font-light text-neutral-500 max-w-2xl">
            Structured, step-by-step guides for important FM workflows. More detailed than a guide; more practical than a manual. Built for FM professionals doing real work.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Available ({published.length})</h2>
          {published.map(r => (
            <Link
              key={r.slug}
              href={`/lobby/learn/${r.slug}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-neutral-200 rounded-[4px] shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-violet-500 shrink-0" />
                  <span className="text-[10px] font-mono text-neutral-400">{r.topic}</span>
                </div>
                <h3 className="text-base font-light text-neutral-900">{r.title}</h3>
                <p className="text-xs font-light text-neutral-500 leading-relaxed">{r.summary}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {r.readingTimeMinutes} min
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${LEVEL_LABELS[r.level] ?? ''}`}>{r.level}</span>
                </div>
                <span className="text-xs text-brand-electric font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {upcoming.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">In Development ({upcoming.length})</h2>
            {upcoming.map(r => (
              <div
                key={r.slug}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-neutral-200 rounded-[4px] shadow-2xs opacity-60"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-[10px] font-mono text-neutral-400">{r.topic}</span>
                    <span className="text-[10px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-[2px] border border-neutral-200">Coming Soon</span>
                  </div>
                  <h3 className="text-base font-light text-neutral-900">{r.title}</h3>
                  <p className="text-xs font-light text-neutral-500 leading-relaxed line-clamp-2">{r.summary}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="border-t border-neutral-200 pt-6 text-[11px] font-light text-neutral-400">
          Playbooks are professional development resources. They do not constitute legal advice or formally accredited CPD.
        </div>

      </main>
      <Footer />
    </div>
  );
}
