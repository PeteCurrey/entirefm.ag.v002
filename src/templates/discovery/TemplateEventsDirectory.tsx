'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Calendar,
  MapPin,
  ExternalLink,
  MessageSquare,
  Bookmark,
  ArrowRight,
} from 'lucide-react';

export function TemplateEventsDirectory() {
  const [events, setEvents] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`/api/lobby/events?locationType=${filterType}`);
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [filterType]);

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              FM Events & Briefings
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Worth Attending
            </h1>
            <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl">
              Curated UK industry exhibitions, regulator technical briefings, CIBSE symposia, and live webinars.
            </p>

            {/* Filter Tabs */}
            <div className="mt-8 flex items-center gap-2 border-b border-white/5 pb-1">
              {[
                { id: 'all', label: 'All Events' },
                { id: 'in-person', label: 'In-Person Exhibitions' },
                { id: 'online', label: 'Online Webinars' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    filterType === f.id
                      ? 'bg-brand-electric text-white'
                      : 'bg-brand-graphite/40 text-brand-silver hover:text-white border border-white/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          {/* Featured Real-World Exhibition Banner */}
          <div className="rounded-2xl border border-brand-electric/40 bg-gradient-to-r from-brand-charcoal/80 via-brand-graphite/40 to-brand-charcoal/80 p-6 sm:p-8 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand-electric text-white">
                  Featured Industry Exhibition
                </span>
                <span className="text-xs text-emerald-400 font-mono">20–21 October 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Facilities & Estates Management LIVE 2026
              </h2>
              <p className="text-xs sm:text-sm text-brand-silver leading-relaxed">
                Business Design Centre, Islington, London. Connect with verified FM professionals, attend statutory Golden Thread briefings, and meet EntireFM on Stand B14.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/lobby/events/facilities-estates-management-live-2026"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-semibold transition shadow-md"
              >
                <span>View Attendees & RSVP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-brand-silver text-sm">Loading event calendar...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-brand-graphite/20 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-brand-electric/40 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded bg-brand-electric/20 text-brand-electric font-semibold">
                        {evt.topic}
                      </span>
                      <span className="text-brand-silver">{evt.locationType.toUpperCase()}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-brand-electric transition-colors">
                      {evt.title}
                    </h2>

                    <div className="space-y-1 text-xs text-brand-silver">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-electric" />
                        <span>{evt.dateString} • {evt.timeString}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-electric" />
                        <span>{evt.venue} {evt.city && `(${evt.city})`}</span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-mist line-clamp-3 leading-relaxed pt-2">
                      {evt.summary}
                    </p>

                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] text-brand-silver leading-relaxed">
                      <strong className="text-white block mb-0.5">Why It Matters:</strong>
                      {evt.whyItMatters}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                    {evt.linkedRoomSlug && (
                      <Link
                        href={`/lobby/rooms/${evt.linkedRoomSlug}`}
                        className="inline-flex items-center gap-1 font-semibold text-brand-electric hover:underline"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Live Event Room
                      </Link>
                    )}
                    {evt.externalUrl && (
                      <a
                        href={evt.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-brand-silver hover:text-white ml-auto"
                      >
                        Official Site
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
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
