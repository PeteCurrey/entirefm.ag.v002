'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchResultItem } from '@/server/search';
import { Search, Building2, Wrench, ShieldCheck, Bot, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';

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
    }, 180);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-[2px] animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-2xl text-[#101010]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative flex items-center border-b border-[#E4E4E1] px-4 py-3.5 bg-[#FFFFFF]">
          <Search className="h-4 w-4 shrink-0 text-[#9B9B97]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInInput}
            placeholder="Search sites, assets, jobs, engineers, documents…"
            className="ml-3 w-full bg-transparent text-[14px] text-[#101010] placeholder-[#9B9B97] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded-[4px] border border-[#E4E4E1] bg-[#F5F5F3] px-1.5 py-0.5 font-normal text-[10px] text-[#9B9B97]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 cafm-scroll bg-[#FFFFFF]">
          {loading && (
            <div className="px-4 py-8 text-center text-[13px] text-[#686866]">
              Searching canonical estate & operations database...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-[#686866]">
              No entities found matching &ldquo;{query}&rdquo;.
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-[13px] transition-all ${
                    idx === selectedIndex
                      ? 'bg-[#FF6B24] text-white shadow-sm'
                      : 'text-[#101010] hover:bg-[#F5F5F3]'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="truncate font-normal">{item.title}</div>
                    <div
                      className={`truncate text-[11.5px] ${
                        idx === selectedIndex ? 'text-white/80' : 'text-[#686866]'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span
                        className={`rounded-[4px] px-1.5 py-0.5 font-medium text-[9px] uppercase tracking-wider ${
                          idx === selectedIndex
                            ? 'bg-white/20 text-white'
                            : 'border border-[#E4E4E1] bg-[#F0F0EE] text-[#686866]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {idx === selectedIndex && (
                      <CornerDownLeft className="h-3.5 w-3.5 text-white/80" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="px-4 py-4 text-[12px] text-[#686866]">
              <div className="font-medium uppercase tracking-wider text-[10px] text-[#9B9B97] mb-2.5">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setOpen(false); router.push('/admin/operations/work-orders'); }}
                  className="flex items-center justify-between rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-2.5 text-left hover:border-[#D1D1CD] hover:bg-[#FFFFFF] transition-colors"
                >
                  <span className="font-medium text-[#101010]">Work Orders Queue</span>
                  <ArrowRight className="h-3 w-3 text-[#9B9B97]" />
                </button>
                <button
                  onClick={() => { setOpen(false); router.push('/admin/estate/sites'); }}
                  className="flex items-center justify-between rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-2.5 text-left hover:border-[#D1D1CD] hover:bg-[#FFFFFF] transition-colors"
                >
                  <span className="font-medium text-[#101010]">Site 360 Estate</span>
                  <ArrowRight className="h-3 w-3 text-[#9B9B97]" />
                </button>
                <button
                  onClick={() => { setOpen(false); router.push('/admin/estate/assets'); }}
                  className="flex items-center justify-between rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-2.5 text-left hover:border-[#D1D1CD] hover:bg-[#FFFFFF] transition-colors"
                >
                  <span className="font-medium text-[#101010]">Asset Registry</span>
                  <ArrowRight className="h-3 w-3 text-[#9B9B97]" />
                </button>
                <button
                  onClick={() => { setOpen(false); router.push('/admin/compliance/obligations'); }}
                  className="flex items-center justify-between rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-2.5 text-left hover:border-[#D1D1CD] hover:bg-[#FFFFFF] transition-colors"
                >
                  <span className="font-medium text-[#101010]">Compliance Radar</span>
                  <ArrowRight className="h-3 w-3 text-[#9B9B97]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E4E4E1] bg-[#F5F5F3] px-4 py-2 text-[11px] text-[#686866]">
          <span>Tip: Use ↑ ↓ to navigate, Enter to select</span>
          <span className="font-normal text-[10px] text-[#9B9B97]">EntireFM Core Search</span>
        </div>
      </div>
    </div>
  );
}
