'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  ArrowLeft,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { EventDetails, EventRsvpAttendee } from '@/server/events/event-rsvp-store';

interface Props {
  event: EventDetails;
}

export function TemplateEventDetail({ event }: Props) {
  const [attendees, setAttendees] = useState<EventRsvpAttendee[]>([]);
  const [totalAttending, setTotalAttending] = useState(0);
  const [memberStatus, setMemberStatus] = useState<'attending' | 'interested' | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRsvps() {
      try {
        const res = await fetch(`/api/lobby/events/${event.slug}/rsvp`);
        const data = await res.json();
        if (data.success) {
          setAttendees(data.attendees || []);
          setTotalAttending(data.totalAttending || 0);
          setMemberStatus(data.memberStatus || null);
        }
      } catch (err) {
        console.error('Error fetching event RSVPs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRsvps();
  }, [event.slug]);

  const handleRsvp = async (status: 'attending' | 'interested' | 'cancelled') => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/lobby/events/${event.slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setMemberStatus(data.status === 'none' ? null : (data.status as any));
        // Refresh attendees list
        const refresh = await fetch(`/api/lobby/events/${event.slug}/rsvp`);
        const refreshData = await refresh.json();
        if (refreshData.success) {
          setAttendees(refreshData.attendees || []);
          setTotalAttending(refreshData.totalAttending || 0);
        }
      }
    } catch (err) {
      console.error('Error saving RSVP:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/lobby/events"
            className="inline-flex items-center gap-1.5 text-xs text-brand-silver hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Event Card */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    In-Person Exhibition
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                    {event.title}
                  </h1>
                  <p className="text-sm text-brand-silver mt-1">{event.organiser}</p>
                </div>

                {/* Event Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-white/10 text-xs">
                  <div className="space-y-1">
                    <span className="text-brand-slate uppercase tracking-wider text-[10px] font-semibold">Date & Time</span>
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-brand-electric shrink-0" />
                      {event.dateRange} (09:00 – 17:00)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-brand-slate uppercase tracking-wider text-[10px] font-semibold">Venue</span>
                    <p className="text-white font-medium flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      {event.locationName}, {event.city}
                    </p>
                    <p className="text-[11px] text-brand-slate">{event.fullAddress}</p>
                  </div>
                </div>

                {/* EntireFM Presence Note */}
                {event.entireFmPresenceNote && (
                  <div className="rounded-xl border border-brand-electric/30 bg-brand-electric/10 p-4 space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-brand-electric font-semibold">
                      <Sparkles className="w-4 h-4" />
                      <span>EntireFM at {event.title}</span>
                    </div>
                    <p className="text-brand-mist leading-relaxed">{event.entireFmPresenceNote}</p>
                    {event.standNumber && (
                      <p className="text-[11px] text-brand-silver font-mono pt-1">
                        Stand Reference: <span className="text-white font-bold">{event.standNumber}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Overview */}
                <div className="space-y-3 text-sm text-brand-mist leading-relaxed">
                  <h3 className="text-base font-semibold text-white">Event Summary</h3>
                  <p>{event.description}</p>

                  <div className="pt-2">
                    <h4 className="text-xs uppercase tracking-wider text-brand-slate mb-2">Core Topics</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {event.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded text-xs bg-brand-void text-brand-silver border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Who Else from The Lobby is Going */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-electric" />
                    <h2 className="text-base font-semibold text-white">
                      Who else from The Lobby is attending?
                    </h2>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium font-mono">
                    {totalAttending} member{totalAttending === 1 ? '' : 's'} registered
                  </span>
                </div>

                <p className="text-xs text-brand-silver">
                  Connect and message other verified FM leaders and contractors attending in person.
                </p>

                {loading ? (
                  <div className="py-8 text-center text-xs text-brand-silver">
                    Checking attendee registrations...
                  </div>
                ) : attendees.length === 0 ? (
                  <div className="py-8 text-center rounded-xl border border-white/5 bg-brand-void/40 text-xs text-brand-silver">
                    Be the first from The Lobby to confirm your attendance.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {attendees.map((attendee) => (
                      <div
                        key={attendee.memberId}
                        className="rounded-xl border border-white/10 bg-brand-void/80 p-4 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">
                            {attendee.displayName}
                          </h4>
                          {attendee.headline && (
                            <p className="text-xs text-brand-silver truncate">{attendee.headline}</p>
                          )}
                          {attendee.company && (
                            <p className="text-[11px] text-brand-slate truncate">{attendee.company}</p>
                          )}
                        </div>

                        <Link
                          href={`/lobby/messages?recipient=${attendee.memberId}`}
                          className="p-2 rounded-lg border border-white/10 hover:border-brand-electric/50 text-brand-silver hover:text-brand-electric hover:bg-brand-electric/10 transition shrink-0"
                          title={`Message ${attendee.displayName}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar RSVP Box */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sticky top-24 backdrop-blur-md space-y-5">
                <h3 className="text-lg font-semibold text-white">Your Event Status</h3>
                <p className="text-xs text-brand-silver leading-relaxed">
                  Let your industry peers know if you’ll be on-site so you can arrange briefings and catch up.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleRsvp('attending')}
                    disabled={submitting}
                    className={`w-full py-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
                      memberStatus === 'attending'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-brand-electric hover:bg-brand-electric-hover text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{memberStatus === 'attending' ? 'You Are Attending' : 'I Am Attending'}</span>
                  </button>

                  <button
                    onClick={() => handleRsvp('interested')}
                    disabled={submitting}
                    className={`w-full py-2.5 rounded-xl border text-xs font-medium transition ${
                      memberStatus === 'interested'
                        ? 'border-brand-electric bg-brand-electric/20 text-white'
                        : 'border-white/10 hover:border-white/20 text-brand-silver hover:text-white'
                    }`}
                  >
                    {memberStatus === 'interested' ? 'Marked as Interested' : 'Interested / Maybe'}
                  </button>

                  {memberStatus && (
                    <button
                      onClick={() => handleRsvp('cancelled')}
                      disabled={submitting}
                      className="w-full text-center py-1.5 text-[11px] text-brand-slate hover:text-rose-400 transition"
                    >
                      Cancel my registration
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a
                    href={event.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-white/10 text-xs font-medium text-brand-silver hover:text-white hover:border-white/20 transition"
                  >
                    <span>Official Venue / Registration</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
