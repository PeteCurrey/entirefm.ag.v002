'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Users,
  Search,
  MessageSquare,
  ShieldCheck,
  Building2,
  Award,
} from 'lucide-react';

export function TemplateMembersDirectory() {
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch(`/api/lobby/members?q=${encodeURIComponent(search)}`);
        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error('Error loading members:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, [search]);

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
              <Users className="w-3.5 h-3.5" />
              Verified Community Network
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              FM Practitioner Directory
            </h1>
            <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl">
              Connect directly with verified UK facilities managers, hard FM engineers, compliance directors, and specialist contractors.
            </p>

            <div className="mt-8 relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-silver" />
              <input
                type="text"
                placeholder="Search by name, engineering discipline or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-brand-graphite/60 border border-white/10 rounded-xl text-sm text-white placeholder-brand-silver focus:outline-none focus:border-brand-electric"
              />
            </div>
          </div>
        </section>

        {/* Members Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="py-12 text-center text-brand-silver text-sm">Loading member directory...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 text-xs text-brand-silver">No verified members found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-brand-graphite/20 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-brand-electric/40 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-full bg-brand-electric/20 text-brand-electric flex items-center justify-center text-base font-bold">
                        {mem.display_name.charAt(0)}
                      </div>
                      {mem.badges?.[0] && (
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-brand-mist border border-white/10">
                          {mem.badges[0]}
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-white group-hover:text-brand-electric transition-colors">
                        {mem.display_name}
                      </h2>
                      {mem.headline && (
                        <p className="text-xs text-brand-silver line-clamp-2 mt-0.5">{mem.headline}</p>
                      )}
                      {mem.company && (
                        <p className="text-[11px] text-brand-mist font-medium mt-1">{mem.company}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {mem.disciplines?.map((d: string) => (
                        <span key={d} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-brand-silver">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-brand-silver flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      {mem.reputation_score} reputation
                    </span>
                    <Link
                      href={`/lobby/messages?to=${mem.id}`}
                      className="px-3 py-1.5 rounded-lg bg-brand-electric/15 hover:bg-brand-electric text-brand-electric hover:text-white font-semibold transition-colors flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Message
                    </Link>
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
