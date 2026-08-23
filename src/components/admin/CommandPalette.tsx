'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchResultItem } from '@/server/search';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Keyboard shortcut listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: SearchResultItem) => {
    setOpen(false);
    router.push(item.href);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[12vh] backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-lg border border-brand-edge-dark bg-brand-carbon shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative flex items-center border-b border-brand-edge-dark px-4 py-3.5">
          <svg
            className="h-4 w-4 shrink-0 text-brand-mist/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInInput}
            placeholder="Search sites, assets, work orders, contractors, invoices... (Ask EntireFM)"
            className="ml-3 w-full bg-transparent text-[14px] text-white placeholder:text-brand-mist/40 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded border border-brand-edge-dark bg-brand-void px-1.5 py-0.5 font-mono text-[10px] text-brand-mist/60">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading && (
            <div className="px-4 py-6 text-center text-[13px] text-brand-mist/50">
              Searching canonical estate & operations database...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-brand-mist/50">
              No entities found matching &ldquo;{query}&rdquo;.
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`flex w-full items-center justify-between rounded px-3 py-2.5 text-left text-[13px] transition-colors ${
                    idx === selectedIndex
                      ? 'bg-brand-electric text-white'
                      : 'text-brand-mist/80 hover:bg-brand-void/80 hover:text-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{item.title}</div>
                    <div
                      className={`truncate text-[11px] ${
                        idx === selectedIndex ? 'text-white/80' : 'text-brand-mist/50'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`ml-2 shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        idx === selectedIndex
                          ? 'bg-white/20 text-white'
                          : 'border border-brand-edge-dark bg-brand-void text-brand-mist/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="px-4 py-6 text-[12px] text-brand-mist/50">
              <div className="font-mono uppercase tracking-wider text-[10px] text-brand-mist/40 mb-2">
                Quick Jump Suggestions
              </div>
              <div className="grid grid-cols-2 gap-2 text-brand-mist/70">
                <button
                  onClick={() => { setOpen(false); router.push('/admin/operations/work-orders'); }}
                  className="rounded border border-brand-edge-dark/60 bg-brand-void/50 p-2 text-left hover:border-brand-electric/50 hover:text-white"
                >
                  Work Orders Queue
                </button>
                <button
                  onClick={() => { setOpen(false); router.push('/admin/estate/assets'); }}
                  className="rounded border border-brand-edge-dark/60 bg-brand-void/50 p-2 text-left hover:border-brand-electric/50 hover:text-white"
                >
                  Asset Registry
                </button>
                <button
                  onClick={() => { setOpen(false); router.push('/admin/compliance/obligations'); }}
                  className="rounded border border-brand-edge-dark/60 bg-brand-void/50 p-2 text-left hover:border-brand-electric/50 hover:text-white"
                >
                  Compliance Obligations
                </button>
                <button
                  onClick={() => { setOpen(false); router.push('/admin/ai/control'); }}
                  className="rounded border border-brand-edge-dark/60 bg-brand-void/50 p-2 text-left hover:border-brand-electric/50 hover:text-white"
                >
                  AI Control Centre
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-brand-edge-dark bg-brand-void/80 px-4 py-2 text-[11px] text-brand-mist/50">
          <span>Tip: Use ↑ ↓ to navigate, Enter to select</span>
          <span className="font-mono text-[10px]">EntireFM Core Search</span>
        </div>
      </div>
    </div>
  );
}
