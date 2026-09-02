'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import {
  GLOSSARY_TERMS,
  type GlossaryTerm,
} from '@/data/lobby/learn-data';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function TemplateLobbyLearnGlossary() {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GLOSSARY_TERMS.filter((t) => {
      const matchSearch =
        !q ||
        t.term.toLowerCase().includes(q) ||
        (t.abbreviation?.toLowerCase().includes(q) ?? false) ||
        t.definition.toLowerCase().includes(q) ||
        t.topic.toLowerCase().includes(q);
      const matchLetter = !activeLetter || t.term.toUpperCase().startsWith(activeLetter);
      return matchSearch && matchLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeLetter]);

  const availableLetters = new Set(GLOSSARY_TERMS.map(t => t.term[0].toUpperCase()));

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/learn" className="hover:text-neutral-900 transition-colors">LEARN</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Glossary</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 border-b border-neutral-200 pb-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric">THE LOBBY · LEARN · Glossary</p>
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight">FM Terminology.</h1>
          <p className="text-sm font-light text-neutral-500 max-w-2xl">
            Clear, professionally written definitions for UK facilities management terminology. Where terms have legal significance, this is noted explicitly.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <label htmlFor="glossary-search" className="sr-only">Search FM terms</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              id="glossary-search"
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
              placeholder="Search FM terms..."
              className="w-full border border-neutral-200 rounded-[3px] pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-electric transition-colors"
            />
          </div>
        </div>

        {/* A–Z index */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setActiveLetter(null); setSearch(''); }}
            className={`text-[10px] font-mono w-7 h-7 flex items-center justify-center rounded-[2px] transition-colors ${!activeLetter ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-400'}`}
          >
            All
          </button>
          {ALPHABET.map((letter) => {
            const available = availableLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => available && setActiveLetter(letter === activeLetter ? null : letter)}
                className={`text-[10px] font-mono w-7 h-7 flex items-center justify-center rounded-[2px] transition-colors ${
                  !available ? 'text-neutral-300 cursor-default' :
                  activeLetter === letter ? 'bg-neutral-900 text-white' :
                  'bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400'
                }`}
                disabled={!available}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="text-[10px] font-mono text-neutral-400 mb-2">
          {filtered.length} term{filtered.length !== 1 ? 's' : ''}
        </div>

        <div className="space-y-4">
          {filtered.map((term) => (
            <GlossaryCard key={term.id} term={term} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm font-light text-neutral-500 py-10">
              No terms found for &ldquo;{search || activeLetter}&rdquo;. Try a different search.
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-[11px] font-light text-neutral-400 leading-relaxed border-t border-neutral-200 pt-6">
          These definitions are provided for general professional information. Where terms have legal or regulatory significance, the relevant legislation is noted — but these definitions do not constitute legal advice. Always refer to primary legislation and authoritative guidance for compliance purposes.
        </div>

      </main>
      <Footer />
    </div>
  );
}

function GlossaryCard({ term }: { term: GlossaryTerm }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-neutral-200 rounded-[4px] shadow-2xs overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-neutral-50/80 transition-colors"
        aria-expanded={expanded}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-medium text-neutral-900">{term.term}</h2>
            {term.abbreviation && term.abbreviation !== term.term && (
              <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-[2px]">{term.abbreviation}</span>
            )}
            {term.hasLegalSignificance && (
              <span className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-[2px]">Legal Significance</span>
            )}
          </div>
          <p className="text-xs font-mono text-neutral-400">{term.topic}</p>
        </div>
        <ChevronRight className={`w-4 h-4 text-neutral-400 shrink-0 mt-0.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-neutral-100">
          <p className="text-sm font-light text-neutral-700 leading-relaxed pt-4">{term.definition}</p>

          {term.legalNote && (
            <div className="bg-amber-50 border border-amber-200 rounded-[3px] p-3">
              <p className="text-xs font-light text-amber-900 leading-relaxed">
                <span className="font-medium">Legal note: </span>{term.legalNote}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-neutral-400 uppercase">Related terms</p>
                <div className="flex flex-wrap gap-1.5">
                  {term.relatedTerms.map(rt => (
                    <span key={rt} className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-[2px]">{rt}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {term.relatedToolUrl && (
              <Link href={term.relatedToolUrl} className="text-xs text-brand-electric hover:underline font-light inline-flex items-center gap-1">
                Related tool <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {term.relatedCheckSlug && (
              <Link href={`/lobby/check/${term.relatedCheckSlug}`} className="text-xs text-neutral-600 hover:text-neutral-900 font-light inline-flex items-center gap-1">
                See compliance topic <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
