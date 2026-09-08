import React from 'react';
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
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#BB1919]" />
              BBC News
            </span>
            <span className="text-neutral-300">·</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0072C6]" />
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
          /* Cards Grid with High-Appeal Visual Imagery */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between overflow-hidden bg-white border border-neutral-200/80 rounded-sm hover:border-neutral-300 hover:shadow-md transition-all"
              >
                <div>
                  {/* Article Thumbnail Image */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-neutral-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.headline}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400 gap-2">
                        <Newspaper className="w-8 h-8 opacity-40" />
                        <span className="text-[10px] uppercase tracking-wider font-mono opacity-50">Wire Photo</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Source Attribution Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`font-semibold tracking-wider uppercase text-[10px] px-2 py-0.5 rounded-xs shadow-xs text-white ${
                          item.source === 'BBC News'
                            ? 'bg-[#BB1919]'
                            : 'bg-[#0072C6]'
                        }`}
                      >
                        {item.source}
                      </span>
                    </div>

                    {/* Timestamp Tag */}
                    <div className="absolute bottom-2.5 right-3 z-10">
                      <span className="flex items-center gap-1 text-[11px] text-white/90 font-light bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-xs">
                        <Clock className="w-3 h-3 text-white/80" />
                        {item.relativeTime}
                      </span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors line-clamp-2">
                      {item.headline}
                    </h3>

                    {item.summary && (
                      <p className="text-xs font-light text-neutral-600 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium group-hover:text-brand-electric transition-colors">
                    <span>Read on {item.source}</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
