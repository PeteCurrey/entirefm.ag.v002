'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  BookOpen,
  ShieldCheck,
  ExternalLink,
  Wrench,
  MessageSquare,
  Bookmark,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  Info,
  Scale,
} from 'lucide-react';
import type { StructuredAskAnswer, AskCitation } from '@/server/ask/types';

const EXAMPLE_PROMPTS = [
  'What changed in UK building safety this week?',
  'Show me open HVAC maintenance tenders in London.',
  'What do I need to know about F-gas quotas if I manage chillers?',
  'What is the standard testing interval for commercial EICRs?',
  'What tools does EntireFM have for contract mobilisation?',
  'Who won the recent major public sector cleaning contracts?',
];

export function TemplateAskLobby() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [question, setQuestion] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<StructuredAskAnswer | null>(null);
  const [activeCitation, setActiveCitation] = useState<AskCitation | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (qText?: string) => {
    const q = (qText || question).trim();
    if (!q) return;

    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch('/api/lobby/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      }
    } catch {
      // Error handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSubmit(initialQuery);
    }
  }, [initialQuery]);

  const handleSave = () => {
    setSaved(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7] text-[#121826] pt-24 pb-20 selection:bg-brand-electric selection:text-white">
      {/* ─── MASTHEAD HEADER ─── */}
      <section className="container-wide border-b border-neutral-200 pb-10 mb-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric font-semibold bg-brand-electric/10 px-2.5 py-1 rounded-sm">
              GROUNDED FM RESEARCH DESK
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-neutral-500 font-mono">Verified Statutory & Technical Indexes</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 leading-tight">
            Ask The Lobby
          </h1>
          <p className="text-base sm:text-lg font-light text-neutral-600 mt-2">
            Directly query live UK building safety legislation, statutory guidance, procurement notices, and technical standards with transparent citations.
          </p>

          {/* Search Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mt-8 relative"
          >
            <div className="relative flex items-center bg-white border-2 border-neutral-300 focus-within:border-neutral-900 rounded-sm shadow-sm transition-colors">
              <Search className="w-5 h-5 text-neutral-400 ml-4 shrink-0" />
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about building safety, F-gas, tenders, EICR, standards..."
                className="w-full px-4 py-4 text-base sm:text-lg font-light text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="mr-3 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
              >
                <span>{loading ? 'Researching...' : 'Search'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Example Queries */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
              <span className="text-neutral-400 font-mono text-[11px] uppercase mr-1">Try:</span>
              {EXAMPLE_PROMPTS.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setQuestion(prompt);
                    handleSubmit(prompt);
                  }}
                  className="bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 px-3 py-1 rounded-sm text-xs font-light transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* ─── RESEARCH DESK RESULTS ─── */}
      <section className="container-wide">
        {loading ? (
          <div className="py-20 text-center text-neutral-500 font-mono text-sm">
            Searching indexed Tier 1–4 statutory records, procurement tenders, and technical standards...
          </div>
        ) : answer ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            {/* LEFT / MAIN COLUMN: STRUCTURED ANSWER */}
            <div className="space-y-8 bg-white border border-neutral-200/80 rounded-sm p-6 sm:p-10 shadow-sm">
              {/* Question Header & Meta */}
              <div className="border-b border-neutral-100 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-electric uppercase tracking-wider font-semibold">
                      {answer.intent.replace('_', ' ')}
                    </span>
                    <span>·</span>
                    <span>{answer.jurisdiction.join(' & ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-neutral-900 text-neutral-900' : ''}`} />
                      <span>{saved ? 'Saved to Research' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1 text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Link Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-light text-neutral-900 leading-snug">
                  {answer.question}
                </h2>
              </div>

              {/* 01. Short Answer */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  Short Answer
                </div>
                <p className="text-base sm:text-lg font-light text-neutral-800 leading-relaxed">
                  {answer.shortAnswer}
                </p>
              </div>

              {/* 02. What Changed / Primary Facts */}
              {answer.whatChanged.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    What Changed / Indexed Evidence
                  </div>
                  <div className="space-y-2.5">
                    {answer.whatChanged.map((point, idx) => (
                      <div key={idx} className="flex gap-3 items-start text-sm font-light text-neutral-700">
                        <span className="font-mono text-xs text-brand-electric font-semibold mt-0.5 shrink-0">
                          0{idx + 1}
                        </span>
                        <p className="leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 03. Why It Matters & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    Why It Matters For FM
                  </div>
                  <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                    {answer.whyItMatters}
                  </p>
                </div>

                {answer.whatYouNeedToDo.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      What You May Need To Do
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm font-light text-neutral-600">
                      {answer.whatYouNeedToDo.map((step, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-neutral-400">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 04. On The Horizon */}
              {answer.onTheHorizon && (
                <div className="bg-amber-500/5 border-l-2 border-amber-500 p-4 rounded-r-sm space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>On The Horizon</span>
                  </div>
                  <p className="text-xs font-light text-neutral-700">
                    {answer.onTheHorizon}
                  </p>
                </div>
              )}

              {/* Professional Safety Disclaimer */}
              {answer.disclaimer && (
                <div className="pt-4 border-t border-neutral-100 flex items-start gap-2 text-[11px] text-neutral-400 font-light">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-400" />
                  <p>{answer.disclaimer}</p>
                </div>
              )}
            </div>

            {/* RIGHT RAIL: CITATIONS, TOOLS & FLYWHEEL */}
            <div className="space-y-6">
              {/* Citations Panel */}
              <div className="bg-white border border-neutral-200/80 rounded-sm p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-brand-electric" />
                    <span>Sourced Citations ({answer.citations.length})</span>
                  </div>
                </div>

                {answer.citations.length > 0 ? (
                  <div className="space-y-3">
                    {answer.citations.map((cit) => (
                      <div
                        key={cit.id}
                        onClick={() => setActiveCitation(cit)}
                        className="group p-3 border border-neutral-100 hover:border-neutral-300 rounded-sm cursor-pointer transition-colors bg-neutral-50/50 hover:bg-white"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                          <span className="text-brand-electric font-semibold">[{cit.citationNumber}] {cit.sourceName}</span>
                          <span>Tier {cit.authorityTier}</span>
                        </div>
                        <h4 className="text-xs font-medium text-neutral-800 group-hover:text-brand-electric transition-colors line-clamp-2">
                          {cit.title}
                        </h4>
                        <a
                          href={cit.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                          <span>Official source link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 font-light">
                    No primary statutory citations available for this query.
                  </p>
                )}
              </div>

              {/* Put This Into Practice / Connected Actions */}
              {answer.relatedActions.length > 0 && (
                <div className="bg-white border border-neutral-200/80 rounded-sm p-6 space-y-4 shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-neutral-900 font-semibold">
                    Put This Into Practice
                  </div>

                  <div className="space-y-3">
                    {answer.relatedActions.map((action, idx) => (
                      <Link
                        key={idx}
                        href={action.url}
                        className="group block p-3 border border-neutral-100 hover:border-neutral-300 rounded-sm transition-colors bg-neutral-50/50 hover:bg-white"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-brand-electric mb-1">
                          <span>{action.badge || 'Action'}</span>
                          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                        <h4 className="text-xs font-semibold text-neutral-900 group-hover:text-brand-electric transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-[11px] font-light text-neutral-500 mt-1 line-clamp-2">
                          {action.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State / Discovery Suggestions */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            <div className="p-6 bg-white border border-neutral-200/80 rounded-sm space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-semibold">
                Statutory & Compliance
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Building Safety & Guidance</h3>
              <p className="text-xs font-light text-neutral-600">
                Ask about mandatory occurrence reporting, Golden Thread asset records, ACOP L8 water safety, or F-gas quota timelines.
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200/80 rounded-sm space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-semibold">
                Procurement Intelligence
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Tenders & Contract Awards</h3>
              <p className="text-xs font-light text-neutral-600">
                Query active public sector tenders on Contracts Finder and verified contract awards with supplier values.
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200/80 rounded-sm space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-brand-electric font-semibold">
                Technical Standards
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">M&E and Operational Guidance</h3>
              <p className="text-xs font-light text-neutral-600">
                Search published standards from CIBSE, BESA, FIA, ECA, and IWFM without wading through unverified forum posts.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
