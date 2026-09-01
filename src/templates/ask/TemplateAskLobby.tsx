'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
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
  Bell,
  Layers,
  FileCheck,
  Download,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
import type { StructuredAskAnswer, AskCitation, AskMode } from '@/server/ask/types';
import { downloadPdfReport } from '@/lib/pdf/generator';
import { buildAskLobbyPdfDefinition } from '@/lib/pdf/ask-lobby-pdf';

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
  const initialMode = (searchParams.get('mode') as AskMode) || 'ask';

  const [question, setQuestion] = useState(initialQuery);
  const [mode, setMode] = useState<AskMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<StructuredAskAnswer | null>(null);
  const [activeCitation, setActiveCitation] = useState<AskCitation | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [alertWatched, setAlertWatched] = useState(false);

  const handleSubmit = async (qText?: string, modeOverride?: AskMode) => {
    const q = (qText || question).trim();
    if (!q) return;

    const currentMode = modeOverride || mode;
    setLoading(true);
    setSaved(false);
    setSaveMessage(null);
    setAlertWatched(false);

    try {
      const res = await fetch('/api/lobby/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, mode: currentMode }),
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
      handleSubmit(initialQuery, initialMode);
    }
  }, [initialQuery, initialMode]);

  const handleSave = async () => {
    if (!answer || saving) return;
    setSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/lobby/ask/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        setSaveMessage('Sign in with a verified Member account to save research.');
      } else if (data.success) {
        setSaved(true);
        setSaveMessage('Saved to your private Research Library.');
      } else {
        setSaveMessage(data.error || 'Unable to save research.');
      }
    } catch {
      setSaveMessage('Network error saving research.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!answer) return;
    const { doc, filename } = buildAskLobbyPdfDefinition(answer);
    downloadPdfReport(doc, filename);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeepResearchUpgrade = () => {
    setMode('deep_research');
    handleSubmit(answer?.question || question, 'deep_research');
  };

  return (
    <>
      <main className="min-h-screen bg-[#FAF9F7] text-[#121826] pt-24 pb-20 selection:bg-brand-electric selection:text-white font-sans">
      {/* ─── MASTHEAD COMPOSER ─── */}
      <section className="container-wide border-b border-neutral-200 pb-10 mb-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-light bg-brand-electric/10 px-2.5 py-1 rounded-[4px]">
              GROUNDED FM RESEARCH DESK
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-neutral-500 font-extralight">Tier 1–4 Verified Statutory &amp; Technical Indexes</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-neutral-900 leading-tight">
            Ask The Lobby
          </h1>
          <p className="text-base sm:text-lg font-extralight text-neutral-600 mt-2">
            Directly query live UK building safety legislation, statutory guidance, procurement notices, and technical standards with transparent citations.
          </p>

          {/* Search Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mt-8 relative space-y-3"
          >
            <div className="relative flex flex-col bg-white border border-neutral-200/90 focus-within:border-neutral-900 rounded-[8px] shadow-sm transition-colors p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-neutral-400 mt-1 shrink-0" />
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  rows={2}
                  placeholder="Ask about FM, regulation, contracts, events, technical issues or what's changing..."
                  className="w-full text-base sm:text-lg font-extralight text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100 mt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('ask')}
                    className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-[4px] transition-colors ${
                      mode === 'ask'
                        ? 'bg-neutral-900 text-white font-medium'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    Quick Ask
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('deep_research')}
                    className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-[4px] transition-colors flex items-center gap-1.5 ${
                      mode === 'deep_research'
                        ? 'bg-purple-900 text-white font-medium'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span>Deep Research</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors flex items-center gap-2 font-medium shadow-sm"
                >
                  <span>{loading ? 'Researching...' : mode === 'deep_research' ? 'Run Deep Research' : 'Search'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Example Queries */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-400 font-medium text-[11px] uppercase mr-1">Try:</span>
              {EXAMPLE_PROMPTS.slice(0, 4).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setQuestion(prompt);
                    handleSubmit(prompt);
                  }}
                  className="bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 px-3 py-1.5 rounded-[4px] text-xs font-extralight transition-colors text-left shadow-2xs"
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
          <div className="py-20 text-center space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-brand-electric bg-brand-electric/10 px-3.5 py-2 rounded-[4px]">
              <Sparkles className="w-4 h-4 animate-spin text-brand-electric" />
              <span>
                {mode === 'deep_research'
                  ? 'Conducting Multi-Stage Deep Research across Tier 1–4 Repositories...'
                  : 'Searching verified UK statutory indexes & technical registries...'}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              Reviewing GOV.UK, legislation.gov.uk, HSE, BSR, IET, and procurement notices...
            </p>
          </div>
        ) : answer ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
            {/* LEFT / MAIN COLUMN: STRUCTURED REPORT */}
            <div className="space-y-8 bg-white border border-neutral-200/90 rounded-[8px] p-6 sm:p-10 shadow-sm">
              {/* Question Header & Meta */}
              <div className="border-b border-neutral-100 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-normal text-neutral-500 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-electric uppercase tracking-wider font-semibold">
                      {answer.mode === 'deep_research' ? 'Deep Research Report' : answer.intent.replace('_', ' ')}
                    </span>
                    <span>·</span>
                    <span>{answer.jurisdiction.join(' & ')}</span>
                  </div>

                  {/* Top Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAlertWatched(!alertWatched)}
                      className={`inline-flex items-center gap-1.5 transition-colors text-xs ${
                        alertWatched ? 'text-brand-electric font-medium' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${alertWatched ? 'fill-brand-electric text-brand-electric' : ''}`} />
                      <span>{alertWatched ? 'Watching for Updates' : 'Alert on Change'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className={`inline-flex items-center gap-1.5 transition-colors text-xs ${
                        saved ? 'text-emerald-700 font-medium' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                      <span>{saved ? 'Saved ✓' : 'Save Research'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                      title="Download EntireFM Branded PDF Report"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>

                {saveMessage && (
                  <div className="mb-4 text-xs font-light p-2.5 rounded-[4px] bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-between">
                    <span>{saveMessage}</span>
                    {saveMessage.includes('Sign in') && (
                      <Link href="/sign-in" className="text-brand-electric hover:underline font-normal ml-2">
                        Sign In →
                      </Link>
                    )}
                  </div>
                )}

                <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900 leading-snug">
                  {answer.question}
                </h2>
              </div>

              {/* Research Plan Stages (If Deep Research) */}
              {answer.researchStages && (
                <div className="bg-neutral-50 border border-neutral-200/80 p-4 rounded-[6px] space-y-2.5">
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-purple-700" />
                    <span>Research Execution Pipeline</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-normal">
                    {answer.researchStages.map((stage) => (
                      <div key={stage.id} className="flex items-center gap-2">
                        {stage.status === 'completed' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : stage.status === 'running' ? (
                          <RotateCw className="w-3.5 h-3.5 text-purple-600 animate-spin shrink-0" />
                        ) : stage.status === 'failed' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 text-[9px] flex items-center justify-center text-neutral-400">
                            -
                          </span>
                        )}
                        <span
                          className={`${
                            stage.status === 'completed'
                              ? 'text-neutral-800'
                              : stage.status === 'skipped'
                              ? 'text-neutral-400'
                              : 'text-neutral-600'
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 01. Short Answer / Executive Summary */}
              <div className="space-y-2">
                <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                  {answer.mode === 'deep_research' ? 'Executive Intelligence Summary' : 'Short Answer'}
                </div>
                <p className="text-base sm:text-lg font-light text-neutral-800 leading-relaxed">
                  {answer.shortAnswer}
                </p>
              </div>

              {/* Official Position & Technical Guidance Breakdown */}
              {(answer.officialPosition || answer.technicalGuidance) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                  {answer.officialPosition && (
                    <div className="space-y-2 p-4 rounded-[6px] bg-[#FAF9F7] border border-neutral-200/70">
                      <div className="text-[10px] uppercase tracking-widest text-rose-800 font-semibold flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-rose-700" />
                        <span>Official Statutory Position</span>
                      </div>
                      <p className="text-xs sm:text-sm font-extralight text-neutral-700 leading-relaxed">
                        {answer.officialPosition}
                      </p>
                    </div>
                  )}

                  {answer.technicalGuidance && (
                    <div className="space-y-2 p-4 rounded-[6px] bg-[#FAF9F7] border border-neutral-200/70">
                      <div className="text-[10px] uppercase tracking-widest text-brand-electric font-semibold flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-brand-electric" />
                        <span>Technical &amp; Industry Standards</span>
                      </div>
                      <p className="text-xs sm:text-sm font-extralight text-neutral-700 leading-relaxed">
                        {answer.technicalGuidance}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Practical Guidance */}
              {answer.whatThisMeansInPractice && (
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                    What This Means In Practice
                  </div>
                  <p className="text-sm font-light text-neutral-700 leading-relaxed">
                    {answer.whatThisMeansInPractice}
                  </p>
                </div>
              )}

              {/* 02. What Changed / Primary Facts */}
              {answer.whatChanged && answer.whatChanged.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                    Key Findings &amp; Evidence
                  </div>
                  <div className="space-y-2.5">
                    {answer.whatChanged.map((point, idx) => (
                      <div key={idx} className="flex gap-3 items-start text-sm font-light text-neutral-700">
                        <span className="text-xs text-brand-electric font-semibold mt-0.5 shrink-0">
                          0{idx + 1}
                        </span>
                        <p className="leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extended Deep Research Sections */}
              {answer.deepResearchReport && (
                <div className="space-y-6 pt-6 border-t border-neutral-100">
                  {/* Statutory Requirements */}
                  {answer.deepResearchReport.statutoryRequirements.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest text-rose-700 font-semibold flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Statutory Primary Requirements</span>
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm font-light text-neutral-700 pl-4 list-disc">
                        {answer.deepResearchReport.statutoryRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Commercial Impact */}
                  {answer.deepResearchReport.commercialMarketImpact.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest text-brand-electric font-semibold">
                        Commercial &amp; Procurement Benchmark
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm font-light text-neutral-700 pl-4 list-disc">
                        {answer.deepResearchReport.commercialMarketImpact.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 03. Why It Matters & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                <div className="space-y-2">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                    Why It Matters For FM
                  </div>
                  <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed">
                    {answer.whyItMatters}
                  </p>
                </div>

                {answer.whatYouNeedToDo && answer.whatYouNeedToDo.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
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

              {/* Upgrade to Deep Research Banner (If in Quick Ask Mode) */}
              {answer.mode === 'ask' && answer.isGrounded && (
                <div className="bg-purple-500/5 border border-purple-500/20 p-5 rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-purple-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Need a comprehensive multi-source investigation?</span>
                    </h4>
                    <p className="text-[11px] font-light text-purple-900/80">
                      Upgrade this question into a full Deep Research Report covering statutory primary law, technical standards, and procurement benchmarks.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeepResearchUpgrade}
                    className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs uppercase tracking-wider rounded-[4px] transition-colors shrink-0 font-medium shadow-sm"
                  >
                    Deep Research This &rarr;
                  </button>
                </div>
              )}

              {/* 04. On The Horizon */}
              {answer.onTheHorizon && (
                <div className="bg-amber-500/5 border-l-2 border-amber-500 p-4 rounded-r-sm space-y-1">
                  <div className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold flex items-center gap-1.5">
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

            {/* RIGHT RAIL: CITATIONS & ACTIONS */}
            <div className="space-y-6">
              {/* Citations Panel */}
              <div className="bg-white border border-neutral-200/90 rounded-[8px] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="text-xs uppercase tracking-wider text-neutral-900 font-semibold flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-brand-electric" />
                    <span>Sourced Citations ({answer.citations?.length || 0})</span>
                  </div>
                </div>

                {answer.citations && answer.citations.length > 0 ? (
                  <div className="space-y-3">
                    {answer.citations.map((cit) => (
                      <div
                        key={cit.id}
                        onClick={() => setActiveCitation(cit)}
                        className="group p-3 border border-neutral-100 hover:border-neutral-300 rounded-[6px] cursor-pointer transition-colors bg-neutral-50/50 hover:bg-white"
                      >
                        <div className="flex items-center justify-between text-[10px] font-normal text-neutral-400 mb-1">
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
                          className="mt-2 inline-flex items-center gap-1 text-[10px] font-normal text-brand-electric hover:underline transition-colors"
                        >
                          <span>Open source</span>
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

              {/* Connected Actions */}
              {answer.relatedActions && answer.relatedActions.length > 0 && (
                <div className="bg-white border border-neutral-200/90 rounded-[8px] p-6 space-y-4 shadow-sm">
                  <div className="text-xs uppercase tracking-wider text-neutral-900 font-semibold">
                    Put This Into Practice
                  </div>

                  <div className="space-y-3">
                    {answer.relatedActions.map((action, idx) => (
                      <Link
                        key={idx}
                        href={action.url}
                        className="group block p-3 border border-neutral-100 hover:border-neutral-300 rounded-[6px] transition-colors bg-neutral-50/50 hover:bg-white"
                      >
                        <div className="flex items-center justify-between text-[10px] font-normal text-brand-electric mb-1">
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
          /* Empty State Suggestions */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            <div className="p-6 bg-white border border-neutral-200/90 rounded-[8px] space-y-2 shadow-2xs">
              <div className="text-[10px] uppercase tracking-wider text-brand-electric font-semibold">
                Statutory &amp; Compliance
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Building Safety &amp; Guidance</h3>
              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                Ask about mandatory occurrence reporting, Golden Thread asset records, ACOP L8 water safety, or F-gas quota timelines.
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200/90 rounded-[8px] space-y-2 shadow-2xs">
              <div className="text-[10px] uppercase tracking-wider text-brand-electric font-semibold">
                Procurement Intelligence
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">Tenders &amp; Contract Awards</h3>
              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                Query active public sector tenders on Contracts Finder and verified contract awards with supplier values.
              </p>
            </div>

            <div className="p-6 bg-white border border-neutral-200/90 rounded-[8px] space-y-2 shadow-2xs">
              <div className="text-[10px] uppercase tracking-wider text-brand-electric font-semibold">
                Technical Standards
              </div>
              <h3 className="text-sm font-semibold text-neutral-900">M&amp;E and Operational Guidance</h3>
              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                Search published standards from CIBSE, BESA, FIA, ECA, and IWFM without wading through unverified forum posts.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
    <Footer />
  </>
  );
}
