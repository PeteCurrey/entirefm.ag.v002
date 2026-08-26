'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { ALL_ROUTES } from '@/lib/routes/route-registry';
import { PRIMARY_NAV, SECONDARY_NAV } from '@/config/navigation';

export interface SearchResultItem {
  title: string;
  href: string;
  category: string;
  description?: string;
}

// Build a static public search corpus (Admin and private routes strictly excluded)
function getPublicSearchCorpus(): SearchResultItem[] {
  const items: SearchResultItem[] = [];
  const seenPaths = new Set<string>();

  // 1. Primary Navigation items
  PRIMARY_NAV.forEach((section) => {
    section.columns.forEach((col) => {
      col.links.forEach((link) => {
        if (!seenPaths.has(link.href) && !link.href.startsWith('/admin')) {
          seenPaths.add(link.href);
          items.push({
            title: link.label,
            href: link.href,
            category: section.label,
            description: link.detail,
          });
        }
      });
    });
  });

  // 2. Secondary Navigation items
  SECONDARY_NAV.forEach((link) => {
    if (!seenPaths.has(link.href) && !link.href.startsWith('/admin')) {
      seenPaths.add(link.href);
      items.push({
        title: link.label,
        href: link.href,
        category: 'Company',
      });
    }
  });

  // 3. Complete public route registry (Services, Locations, Sectors, Tools, Legal, Compliance)
  ALL_ROUTES.forEach((r) => {
    if (r.path.startsWith('/admin') || r.path.startsWith('/api') || seenPaths.has(r.path)) {
      return;
    }
    seenPaths.add(r.path);

    let cat = 'Pages';
    if (r.routeType === 'service') cat = 'Services';
    else if (r.routeType === 'location') cat = 'Locations';
    else if (r.routeType === 'sector') cat = 'Sectors';
    else if (r.routeType === 'legal') cat = 'Legal';
    else if (r.routeType === 'company') cat = 'Company';
    else if (r.routeType === 'glossary') cat = 'Resources';
    else if (r.path.startsWith('/suppliers')) cat = 'Suppliers';
    else if (r.path.startsWith('/resources') || r.path.startsWith('/tools')) cat = 'Resources';
    else if (r.path.startsWith('/compliance')) cat = 'Compliance';

    // Derive a readable title from the path slug
    const slug = r.path.split('/').filter(Boolean).pop() ?? r.path;
    const title = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    items.push({
      title,
      href: r.path,
      category: cat,
    });
  });

  return items;
}

export function GlobalSearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const corpus = useMemo(() => getPublicSearchCorpus(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return corpus
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const pathMatch = item.href.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        return titleMatch || descMatch || pathMatch || catMatch;
      })
      .slice(0, 10);
  }, [query, corpus]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        router.push(results[selectedIndex].href);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, selectedIndex, router, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-brand-void/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-brand-carbon border border-brand-edge-dark rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-brand-edge-dark bg-brand-graphite">
          <Search className="w-4 h-4 text-brand-mist/60 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, sectors, locations, tools, guides..."
            className="w-full py-4 bg-transparent text-sm sm:text-base text-white placeholder:text-brand-mist/40 font-light focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-brand-mist/50 hover:text-white mr-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-light text-brand-mist/50 hover:text-white px-2 py-1 rounded border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-white/[0.04]">
          {query.trim() === '' ? (
            <div className="p-6 text-center space-y-3">
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-mist/50 block">
                POPULAR SEARCH DESTINATIONS
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  { label: 'Mechanical & Electrical', href: '/mechanical-electrical' },
                  { label: 'PPM Schedule Builder', href: '/tools/ppm-schedule-builder' },
                  { label: 'Drone Inspections', href: '/services/drone-services/drone-inspections' },
                  { label: 'London FM', href: '/facilities-management-london' },
                  { label: 'Supplier Partner Network', href: '/suppliers/partner-network' },
                  { label: 'Compliance Centre', href: '/compliance' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-sm bg-white/[0.04] hover:bg-white/[0.08] text-xs font-light text-brand-mist hover:text-white border border-white/10 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm font-light text-brand-mist/60">
              No results found for &ldquo;<span className="text-white">{query}</span>&rdquo;
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((item, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-start justify-between gap-3 p-3 rounded-sm transition-all duration-150 ${
                        isSelected
                          ? 'bg-white/[0.08] border border-brand-electric/40 text-white'
                          : 'text-brand-mist/80 hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-normal uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-white/10 text-brand-electric-bright">
                            {item.category}
                          </span>
                          <span className="text-sm font-light text-white truncate">
                            {item.title}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs font-light text-brand-mist/60 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 pt-1 text-xs text-brand-mist/40">
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-brand-electric-bright' : ''}`} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-brand-graphite border-t border-brand-edge-dark flex items-center justify-between text-[11px] font-light text-brand-mist/40">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Public Website Search · 422 Verified Routes</span>
        </div>
      </div>
    </div>
  );
}
