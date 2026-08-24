'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ListOrdered, ArrowUp } from 'lucide-react';

export interface TocItem {
  id: string;
  title: string;
  level?: number;
}

interface LegalTocProps {
  items: TocItem[];
  title?: string;
}

export function LegalToc({ items, title = 'Contents' }: LegalTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Collapsible TOC */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden print:hidden">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex w-full items-center justify-between text-left font-semibold text-slate-900"
          aria-expanded={isOpenMobile}
        >
          <span className="flex items-center gap-2 text-sm">
            <ListOrdered className="h-4 w-4 text-indigo-600" />
            {title} ({items.length} sections)
          </span>
          {isOpenMobile ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        {isOpenMobile && (
          <nav aria-label="Mobile policy table of contents" className="mt-4 border-t border-slate-100 pt-3">
            <ol className="space-y-1.5 text-xs">
              {items.map((item, idx) => {
                const isActive = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpenMobile(false)}
                      className={`flex items-start gap-2 rounded-lg p-2 transition-colors ${
                        isActive
                          ? 'bg-indigo-50 font-semibold text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <span className="shrink-0 text-slate-400 font-mono">{idx + 1}.</span>
                      <span>{item.title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <nav
        aria-label="Policy table of contents"
        className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm lg:block print:hidden"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <ListOrdered className="h-4 w-4 text-indigo-600" />
            {title}
          </p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {items.length} Sections
          </span>
        </div>

        <ol className="mt-4 space-y-1 text-[13px]">
          {items.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`group flex items-start gap-2.5 rounded-lg px-3 py-2 transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 font-semibold text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`mt-0.5 text-xs font-mono shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600 font-bold' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="line-clamp-2 leading-snug">{item.title}</span>
                </a>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </button>
        </div>
      </nav>
    </>
  );
}
