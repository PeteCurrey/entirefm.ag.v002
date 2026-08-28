'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  BarChart3,
  CheckCircle2,
  Users,
  Calendar,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export function TemplatePulseArchive() {
  const [activePoll, setActivePoll] = useState<any>(null);
  const [archive, setArchive] = useState<any[]>([]);
  const [userVoted, setUserVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolls() {
      try {
        const res = await fetch('/api/community/polls');
        const data = await res.json();
        setActivePoll(data.activePoll);
        setArchive(data.archive || []);
        setUserVoted(data.userVoted);
      } catch (err) {
        console.error('Error loading polls:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPolls();
  }, []);

  async function handleVote() {
    if (!selectedOption || !activePoll) return;
    setVoting(true);

    try {
      const res = await fetch(`/api/community/polls/${activePoll.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedOption }),
      });
      const data = await res.json();
      if (data.success) {
        setActivePoll(data.poll);
        setUserVoted(true);
      }
    } catch (err) {
      console.error('Error recording vote:', err);
    } finally {
      setVoting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Pulse Masthead */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              EntireFM Proprietary Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              The Pulse & Industry Data
            </h1>
            <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl leading-relaxed">
              First-party empirical sentiment and operational benchmarks from verified UK facilities management leaders. Underpinning the annual State of FM research.
            </p>
          </div>
        </section>

        {/* Active Poll + Longitudinal Archive */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Active Poll Card */}
          {activePoll && (
            <div className="bg-gradient-to-br from-brand-graphite/40 via-brand-graphite/20 to-brand-void border-2 border-brand-electric/30 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-electric flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-electric animate-ping" />
                  Active Industry Poll
                </span>
                <span className="text-xs text-brand-silver">{activePoll.totalVotes} verified practitioner responses</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activePoll.question}
              </h2>
              <p className="text-xs sm:text-sm text-brand-silver">{activePoll.context}</p>

              {/* Vote Options / Results */}
              <div className="space-y-3 pt-2">
                {activePoll.options.map((opt: any) => {
                  const percentage =
                    activePoll.totalVotes > 0 ? Math.round((opt.votes / activePoll.totalVotes) * 100) : 0;

                  if (userVoted) {
                    return (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-white">
                          <span>{opt.text}</span>
                          <span className="text-brand-electric font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-brand-electric to-blue-400 rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        selectedOption === opt.id
                          ? 'bg-brand-electric/20 border-brand-electric text-white'
                          : 'bg-white/[0.02] border-white/10 hover:bg-white/5 text-brand-mist'
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {!userVoted ? (
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-brand-silver flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-silver" />
                    One vote per member. Results anonymized.
                  </span>
                  <button
                    onClick={handleVote}
                    disabled={voting || !selectedOption}
                    className="px-6 py-2.5 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/90 disabled:opacity-50 transition-all shadow-md"
                  >
                    {voting ? 'Submitting...' : 'Submit Vote'}
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-brand-silver leading-relaxed space-y-1">
                  <p className="font-bold text-white">EntireFM Editorial Interpretation</p>
                  <p>{activePoll.editorialAnalysis}</p>
                </div>
              )}
            </div>
          )}

          {/* Longitudinal Archive */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-2 border-b border-white/5">
              <TrendingUp className="w-4 h-4 text-brand-electric" />
              State of FM Benchmark Archive
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {archive.map((poll) => (
                <div
                  key={poll.id}
                  className="bg-brand-graphite/20 border border-white/5 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-brand-silver">
                    <span className="font-semibold text-brand-electric">{poll.topic}</span>
                    <span>{poll.totalVotes} responses</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{poll.question}</h4>

                  <div className="space-y-2 pt-2">
                    {poll.options.map((opt: any) => {
                      const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                      return (
                        <div key={opt.id} className="text-xs space-y-1">
                          <div className="flex justify-between text-[11px] text-brand-silver">
                            <span>{opt.text}</span>
                            <span className="font-bold text-white">{pct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full bg-brand-electric/60 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
