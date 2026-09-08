import React from 'react';
import Link from 'next/link';
import { ExternalLink, Newspaper, Clock } from 'lucide-react';
import type { GeneralNewsItem } from '@/lib/lobby/repository';

interface GeneralNewsStripProps {
  items: GeneralNewsItem[];
}

export function GeneralNewsStrip({ items }: GeneralNewsStripProps) {
  return (
    <section className="bg-neutral-50/70 py-12 sm:py-16 border-b border-neutral-200/80">
      <div className="container-wide space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Newspaper className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">
                MACRO &amp; BUSINESS CONTEXT · UK NEWS WIRE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-neutral-900">
              General UK &amp; Commercial News
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              BBC News
            </span>
            <span className="text-neutral-300">·</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              Sky News
            </span>
          </div>
        </div>

        {/* Empty State / Offline Pattern */}
        {items.length === 0 ? (
          <div className="py-8 px-5 border border-dashed border-neutral-200 rounded-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-500 font-light">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400/80 shrink-0" />
              <span>No macro business updates recorded in the current monitoring cycle.</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono tracking-wider">FEED_OFFLINE</span>
          </div>
        ) : (
          /* Cards Grid: 3 or 4 columns */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between p-5 bg-white border border-neutral-200/80 rounded-sm hover:border-neutral-300 hover:shadow-xs transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span
                      className={`font-semibold tracking-wider uppercase text-[10px] px-2 py-0.5 rounded-xs ${
                        item.source === 'BBC News'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-sky-50 text-sky-800 border border-sky-100'
                      }`}
                    >
                      {item.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {item.relativeTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors line-clamp-2">
                    {item.headline}
                  </h3>

                  {item.summary && (
                    <p className="text-xs font-light text-neutral-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 group-hover:text-brand-electric transition-colors">
                  <span>Read original source</span>
                  <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
