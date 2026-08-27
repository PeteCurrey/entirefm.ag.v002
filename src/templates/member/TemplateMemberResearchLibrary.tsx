'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  BookOpen,
  Sparkles,
  Download,
  Trash2,
  ArrowRight,
  Search,
  Scale,
  Calendar,
  ExternalLink,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react';
import type { SavedLobbyResearch, StructuredAskAnswer } from '@/server/ask/types';
import { downloadPdfReport } from '@/lib/pdf/generator';
import { buildAskLobbyPdfDefinition } from '@/lib/pdf/ask-lobby-pdf';

export function TemplateMemberResearchLibrary() {
  const [items, setItems] = useState<SavedLobbyResearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState<StructuredAskAnswer | null>(null);

  const loadResearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lobby/me/research?mode=${filterMode}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResearch();
  }, [filterMode, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this saved research brief from your library?')) return;

    try {
      const res = await fetch(`/api/lobby/me/research/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      alert('Failed to delete research brief.');
    }
  };

  const handleDownloadPdf = (answer: StructuredAskAnswer) => {
    const { doc, filename } = buildAskLobbyPdfDefinition(answer);
    downloadPdfReport(doc, filename);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F7] text-neutral-900 font-sans selection:bg-brand-electric selection:text-white">
      <Header solid={true} />

      <main className="flex-1 pb-24">
        {/* Masthead */}
        <div className="w-full bg-[#0D131F] text-white border-b border-neutral-800 py-10 sm:py-14">
          <div className="container-wide flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-px w-6 bg-brand-electric" />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric-bright font-light">
                  My Research Library
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
                Saved Ask The Lobby Intelligence
              </h1>
              <p className="text-xs sm:text-sm font-extralight text-brand-mist/70 mt-2 max-w-2xl leading-relaxed">
                Immutable snapshots of your grounded regulatory research, statutory positions, and technical standards.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/lobby/ask"
                className="px-5 py-2.5 bg-brand-electric hover:bg-brand-electric-dark text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Research Query</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container-wide py-10 space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <div className="flex items-center gap-2">
              {[
                { label: 'All Research', value: 'all' },
                { label: 'Quick Ask', value: 'ask' },
                { label: 'Deep Research', value: 'deep_research' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFilterMode(tab.value)}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs font-mono uppercase tracking-wider transition-colors ${
                    filterMode === tab.value
                      ? 'bg-neutral-900 text-white font-medium'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search saved research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[6px] border border-neutral-200 bg-white text-xs font-extralight text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          {/* Research Items List */}
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-neutral-400">
              Loading your research library...
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white border border-neutral-200/90 rounded-[8px] p-10">
              <BookOpen className="w-10 h-10 text-neutral-300 mx-auto stroke-[1.2]" />
              <div>
                <h3 className="text-base font-light text-neutral-900">No saved research found</h3>
                <p className="text-xs font-extralight text-neutral-500 mt-1 max-w-md mx-auto">
                  When you research questions in Ask The Lobby, click &ldquo;Save Research&rdquo; to store permanent cited briefings here.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/lobby/ask"
                  className="px-5 py-2.5 bg-neutral-900 text-white font-extralight text-xs uppercase tracking-wider rounded-[6px] hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
                >
                  <span>Open Ask The Lobby</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const dateStr = new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(item.savedAt));

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-neutral-200/90 hover:border-neutral-400 rounded-[8px] p-6 sm:p-8 transition-all shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                          {dateStr}
                        </span>
                        <span>·</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-wider ${
                            item.mode === 'deep_research'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {item.mode === 'deep_research' ? 'Deep Research' : 'Quick Ask'}
                        </span>
                        <span>·</span>
                        <span className="text-[11px] font-mono text-brand-electric">
                          {item.sourceCount} sources cited
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSnapshot(item.answerSnapshot)}
                          className="px-3 py-1.5 border border-neutral-300 hover:border-neutral-400 text-neutral-800 text-xs font-extralight uppercase tracking-wider rounded-[4px] hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Open Brief</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(item.answerSnapshot)}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-extralight uppercase tracking-wider rounded-[4px] transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors rounded-[4px]"
                          title="Remove from library"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg sm:text-xl font-light text-neutral-900 leading-snug">
                        {item.question}
                      </h2>
                      <p className="text-xs sm:text-sm font-extralight text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                        {item.answerSnapshot.shortAnswer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Snapshot Modal View */}
        {selectedSnapshot && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white border border-neutral-300 rounded-[8px] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl space-y-6 relative">
              <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-brand-electric mb-1">
                    SAVED RESEARCH BRIEF · {selectedSnapshot.mode.toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-light text-neutral-900 leading-snug">
                    {selectedSnapshot.question}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSnapshot(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 rounded-[4px]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Answer Content */}
              <div className="space-y-4 text-sm font-light text-neutral-800 leading-relaxed">
                <div className="p-4 rounded-[6px] bg-[#FAF9F7] border border-neutral-200/80">
                  <p className="text-base font-light text-neutral-900">{selectedSnapshot.shortAnswer}</p>
                </div>

                {selectedSnapshot.officialPosition && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-rose-800 font-semibold mb-1">
                      Official Position &amp; Statutory Framework
                    </h4>
                    <p className="text-xs font-extralight text-neutral-700">{selectedSnapshot.officialPosition}</p>
                  </div>
                )}

                {selectedSnapshot.technicalGuidance && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-brand-electric font-semibold mb-1">
                      Technical Standards &amp; Industry Guidance
                    </h4>
                    <p className="text-xs font-extralight text-neutral-700">{selectedSnapshot.technicalGuidance}</p>
                  </div>
                )}

                {selectedSnapshot.citations && selectedSnapshot.citations.length > 0 && (
                  <div className="pt-4 border-t border-neutral-200 space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                      Sourced Citations ({selectedSnapshot.citations.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedSnapshot.citations.map((c) => (
                        <div key={c.id} className="p-2.5 border border-neutral-200 rounded-[4px] text-xs">
                          <div className="text-brand-electric font-semibold">
                            [{c.citationNumber}] {c.sourceName}
                          </div>
                          <div className="font-medium text-neutral-800">{c.title}</div>
                          <a
                            href={c.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-neutral-400 hover:text-neutral-700 underline"
                          >
                            {c.sourceUrl}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(selectedSnapshot)}
                  className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-extralight uppercase tracking-wider rounded-[6px] hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Briefing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSnapshot(null)}
                  className="px-5 py-2.5 border border-neutral-300 text-neutral-700 text-xs font-extralight uppercase tracking-wider rounded-[6px] hover:bg-neutral-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
