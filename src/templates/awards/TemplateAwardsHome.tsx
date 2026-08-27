'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Calendar, MapPin, ExternalLink, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import type { IndustryAward, AwardStatus } from '@/server/awards/types';

interface TemplateAwardsHomeProps {
  awards: IndustryAward[];
  closingSoon: IndustryAward[];
}

export function TemplateAwardsHome({ awards, closingSoon }: TemplateAwardsHomeProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAwards = awards.filter(
    (a) => selectedStatus === 'all' || a.status === selectedStatus
  );

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col justify-between">
      
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="container-wide py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500 font-semibold">
                  THE LOBBY AWARDS DESK · INDUSTRY RECOGNITION
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-neutral-900 tracking-tight">
                FM Industry Awards &amp; Deadlines
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-600 max-w-2xl">
                Independent tracking of UK facilities management awards, entry submission windows, shortlists, and ceremony benchmarks.
              </p>
            </div>

            <Link
              href="/lobby"
              className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              &larr; Return to The Lobby
            </Link>
          </div>

          {/* Status Filter Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {['all', 'closing-soon', 'entries-open', 'shortlisted', 'winners-announced'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono whitespace-nowrap transition-colors uppercase ${
                  selectedStatus === status
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-wide py-12 sm:py-16 space-y-16">
        
        {/* CLOSING SOON SPOTLIGHT */}
        {closingSoon.length > 0 && selectedStatus === 'all' && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-rose-600 font-semibold">
                DEADLINES CLOSING SOON
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {closingSoon.map((award) => (
                <article
                  key={award.id}
                  className="bg-white border border-neutral-200/80 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-neutral-400 transition-colors"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-neutral-900">
                    <Image
                      src={award.provenance.imageUrl}
                      alt={award.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover brightness-85 group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 z-10">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white bg-rose-600 px-2.5 py-1 rounded-sm font-semibold">
                        {award.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 text-xs text-white font-mono flex items-center justify-between">
                      <span>Deadline: {new Date(award.entryDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
                        {award.organiser}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                        <Link href={`/lobby/awards/${award.slug}`}>
                          {award.name}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm font-light text-neutral-600 line-clamp-2 leading-relaxed">
                        {award.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={`/lobby/awards/${award.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 group-hover:text-brand-electric uppercase tracking-wider"
                      >
                        <span>View Award Profile &amp; Categories</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* FULL AWARDS DIRECTORY SPREAD */}
        <section className="space-y-6">
          <div className="pb-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900">
              UK Facilities Management Award Programmes
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              {filteredAwards.length} Programmes Tracked
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAwards.map((award) => (
              <article
                key={award.id}
                className="bg-white border border-neutral-200/80 rounded-sm p-6 flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-colors group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-electric uppercase tracking-wider">{award.organiser}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-600 uppercase">
                      {award.status.replace('-', ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-light text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors">
                    <Link href={`/lobby/awards/${award.slug}`}>
                      {award.name}
                    </Link>
                  </h3>

                  <p className="text-xs font-light text-neutral-600 line-clamp-3 leading-relaxed">
                    {award.description}
                  </p>

                  <div className="space-y-1 text-xs text-neutral-500 font-mono pt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Entry Deadline: {new Date(award.entryDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{award.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/lobby/awards/${award.slug}`}
                    className="text-xs font-medium text-neutral-900 group-hover:text-brand-electric transition-colors flex items-center gap-1"
                  >
                    <span>Award Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={award.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-neutral-900 font-mono inline-flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
