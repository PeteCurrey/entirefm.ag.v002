'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, BookOpen, FileText, Layers, Clock, ChevronRight } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { LEARN_RESOURCES } from '@/data/lobby/learn-data';
import { ResourceCard } from '@/templates/lobby/TemplateLobbyLearn';

export function TemplateLobbyLearnGuides() {
  const published = LEARN_RESOURCES.filter(r => r.status === 'PUBLISHED');
  const guides = published.filter(r => r.contentType === 'Guide');
  const briefings = published.filter(r => r.contentType === 'Technical Briefing');
  const explainers = published.filter(r => r.contentType === 'Explainer');

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-12">

        <nav className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/learn" className="hover:text-neutral-900 transition-colors">LEARN</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Guides</span>
        </nav>

        <div className="border-b border-neutral-200 pb-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-2">THE LOBBY · LEARN · Guides</p>
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight mb-3">FM Knowledge Library.</h1>
          <p className="text-sm font-light text-neutral-500 max-w-2xl">Practical guides, explainers, and technical briefings for UK facilities management professionals. Professionally written. Regularly reviewed.</p>
        </div>

        {guides.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Guides ({guides.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map(r => <ResourceCard key={r.slug} resource={r} />)}
            </div>
          </section>
        )}

        {briefings.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Technical Briefings ({briefings.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {briefings.map(r => <ResourceCard key={r.slug} resource={r} />)}
            </div>
          </section>
        )}

        {explainers.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Explainers ({explainers.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {explainers.map(r => <ResourceCard key={r.slug} resource={r} />)}
            </div>
          </section>
        )}

        <div className="border-t border-neutral-200 pt-6 text-[11px] font-light text-neutral-400 leading-relaxed">
          Resources are provided as professional development content only. They do not constitute legal advice or formally accredited CPD.
        </div>

      </main>
      <Footer />
    </div>
  );
}
