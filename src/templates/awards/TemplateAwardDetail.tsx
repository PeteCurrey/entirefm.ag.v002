'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ExternalLink, Calendar, MapPin, Award, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import type { IndustryAward } from '@/server/awards/types';

interface TemplateAwardDetailProps {
  award: IndustryAward;
  otherAwards: IndustryAward[];
}

export function TemplateAwardDetail({ award, otherAwards }: TemplateAwardDetailProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col justify-between">
      
      {/* Header Bar */}
      <header className="border-b border-neutral-200 bg-white py-4">
        <div className="container-wide flex items-center justify-between text-xs font-mono">
          <Link
            href="/lobby/awards"
            className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>FM Awards Desk</span>
          </Link>

          <span className="uppercase text-amber-600 font-medium">
            Status: {award.status.replace('-', ' ')}
          </span>
        </div>
      </header>

      {/* Main Award Profile */}
      <main className="container-wide py-12 sm:py-16 max-w-4xl mx-auto space-y-10">
        
        {/* Award Meta Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
            <span>Organised by: {award.organiser}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight leading-tight">
            {award.name}
          </h1>

          <p className="text-base sm:text-lg font-light text-neutral-600 leading-relaxed pt-2">
            {award.description}
          </p>
        </div>

        {/* Hero Photographic Visual Plate */}
        <div className="relative w-full h-[300px] sm:h-[400px] rounded-sm overflow-hidden bg-neutral-900">
          <Image
            src={award.provenance.imageUrl}
            alt={award.provenance.altText || award.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between text-xs text-white font-mono gap-3">
            <span>Ceremony: {new Date(award.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>{award.location}</span>
          </div>
        </div>

        {/* Why It Matters / Editorial Viewpoint */}
        {award.whyItMatters && (
          <div className="bg-white border-l-4 border-amber-500 p-6 sm:p-7 rounded-sm shadow-subtle space-y-2 border border-neutral-200/80">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-600 font-semibold block">
              ENTIREFM INDUSTRY BENCHMARK VIEWPOINT
            </span>
            <p className="text-sm sm:text-base font-light text-neutral-800 leading-relaxed">
              {award.whyItMatters}
            </p>
          </div>
        )}

        {/* Key Dates & Timeline Grid */}
        <div className="grid sm:grid-cols-3 gap-6 bg-white p-6 sm:p-8 rounded-sm border border-neutral-200/80 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-neutral-400 uppercase tracking-wider block">Entry Window Closes</span>
            <p className="text-base font-medium text-neutral-900">
              {new Date(award.entryDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-400 uppercase tracking-wider block">Shortlist Announcement</span>
            <p className="text-base font-medium text-neutral-900">
              {award.shortlistDate
                ? new Date(award.shortlistDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'TBA'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-400 uppercase tracking-wider block">Awards Ceremony</span>
            <p className="text-base font-medium text-neutral-900">
              {new Date(award.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white p-8 sm:p-10 rounded-sm border border-neutral-200/80 space-y-6">
          <h2 className="text-xl font-light text-neutral-900">
            Award Categories Tracked
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {award.categories.map((cat, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-sm border border-neutral-100">
                <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm font-light text-neutral-800 leading-snug">{cat}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <a
              href={award.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-neutral-900 text-white rounded-sm text-xs font-mono uppercase tracking-wider hover:bg-brand-electric transition-colors inline-flex items-center gap-2"
            >
              <span>Visit Official Entry Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <span className="text-xs text-neutral-400 font-mono">
              Independent Editorial Tracking
            </span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
