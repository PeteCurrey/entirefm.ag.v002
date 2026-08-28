'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  MessageSquare,
  Users,
  Radio,
  ArrowRight,
  ShieldCheck,
  Building2,
  Wrench,
  Cpu,
  HardHat,
  GraduationCap,
} from 'lucide-react';

const ROOM_ICONS: Record<string, any> = {
  'fm-general': Building2,
  'building-safety': ShieldCheck,
  'engineering-me': Wrench,
  'fm-technology-ai': Cpu,
  'contractor-desk': HardHat,
  'careers-mentoring': GraduationCap,
};

export function TemplateRoomsDirectory() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      try {
        const res = await fetch('/api/lobby/rooms');
        const data = await res.json();
        setRooms(data.rooms || []);
      } catch (err) {
        console.error('Error loading rooms:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Rooms Masthead */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Live Realtime Rooms
              </span>
              <span className="text-xs text-brand-silver">Professional FM Roundtables</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Live Practitioner Rooms
            </h1>
            <p className="mt-3 text-base sm:text-lg text-brand-silver max-w-2xl">
              Realtime, topic-specific conversation spaces for UK facilities managers and engineers. Discuss active shifts, emergency plant failures, and breaking compliance updates.
            </p>
          </div>
        </section>

        {/* Rooms Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="py-12 text-center text-brand-silver text-sm">Connecting to live room cluster...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const Icon = ROOM_ICONS[room.slug] || MessageSquare;
                return (
                  <div
                    key={room.id}
                    className="bg-brand-graphite/20 hover:bg-brand-graphite/40 border border-white/5 hover:border-brand-electric/40 rounded-2xl p-6 flex flex-col justify-between transition-all group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-brand-electric/15 border border-brand-electric/30 flex items-center justify-center text-brand-electric group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          {room.activePresenceCount} active
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-brand-silver">{room.topic}</span>
                        <h2 className="text-lg font-bold text-white mt-1 group-hover:text-brand-electric transition-colors">
                          {room.name}
                        </h2>
                        <p className="text-xs text-brand-silver mt-2 line-clamp-3 leading-relaxed">
                          {room.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-6">
                      <span className="text-xs text-brand-silver">
                        {room.totalMessagesCount} messages
                      </span>
                      <Link
                        href={`/lobby/rooms/${room.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-electric group-hover:translate-x-1 transition-transform"
                      >
                        Enter Room
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
