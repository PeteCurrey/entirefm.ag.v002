'use client';

import React from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  UserCheck,
  Building2,
  Calendar,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Share2,
} from 'lucide-react';
import type { PeopleMoveItem, WeeklyWireDigest } from '@/server/wire/wire-store';

interface Props {
  weeklyGroups: WeeklyWireDigest[];
  latestItems: PeopleMoveItem[];
}

export function TemplateTheWire({ weeklyGroups, latestItems }: Props) {
  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Editorial Masthead */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30">
                <TrendingUp className="w-3.5 h-3.5" />
                Industry People Moves
              </span>
              <span className="text-xs text-brand-slate">· Weekly Editorial Wire</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white tracking-tight">
              The Wire
            </h1>
            <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl font-light">
              Executive appointments, board promotions, and key operational transitions across UK facilities management, estates, and hard engineering.
            </p>
          </div>
        </section>

        {/* Content Feed */}
        <section className="py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {latestItems.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-brand-charcoal/30 p-12 text-center text-brand-silver">
                <UserCheck className="w-10 h-10 text-brand-slate mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">No recent appointment records</h3>
                <p className="text-sm text-brand-silver mt-1">
                  New verified senior people moves are harvested and compiled automatically every week.
                </p>
              </div>
            ) : weeklyGroups.length > 0 ? (
              <div className="space-y-12">
                {weeklyGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                      <Calendar className="w-4 h-4 text-brand-electric" />
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                        {group.weekLabel}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-white/10 bg-brand-charcoal/40 hover:border-brand-electric/40 p-5 transition flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-base font-semibold text-white">
                                  {item.personName}
                                </h3>
                                <p className="text-xs text-brand-electric font-medium mt-0.5">
                                  {item.newRole}
                                </p>
                              </div>
                              <span className="text-[10px] text-brand-slate">
                                {new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>

                            <p className="text-xs text-white/80 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-brand-slate shrink-0" />
                              <span>{item.organisationName}</span>
                            </p>

                            <p className="text-xs text-brand-silver/90 line-clamp-3 leading-relaxed pt-1">
                              {item.summary}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-brand-slate">
                            <span>Via {item.sourceName}</span>
                            {item.sourceUrl && item.sourceUrl !== '#' && (
                              <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-brand-silver hover:text-white transition"
                              >
                                Source
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {latestItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-brand-charcoal/40 p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-white">{item.personName}</h3>
                      <p className="text-xs text-brand-electric font-medium">{item.newRole}</p>
                      <p className="text-xs text-white/80 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-brand-slate" />
                        <span>{item.organisationName}</span>
                      </p>
                      <p className="text-xs text-brand-silver/90 line-clamp-3 pt-1">{item.summary}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-brand-slate">
                      <span>Via {item.sourceName}</span>
                      {item.sourceUrl && item.sourceUrl !== '#' && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-silver hover:text-white"
                        >
                          Source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
