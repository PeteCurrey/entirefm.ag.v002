'use client';

import React from 'react';
import { History, Sparkles, FileText, Camera, Download } from 'lucide-react';

export function PastEventsArchiveSection() {
  return (
    <section id="past-events" className="py-20 bg-white border-b border-slate-200">
      <div className="container-custom">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              EVENT ARCHIVE &amp; RESOURCES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Past events &amp; technical materials
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Following each Partner Network session, technical slide decks, key takeaway summaries, and session recordings will be published here for member reference.
          </p>
        </div>

        {/* Truthful Architectural Empty State */}
        <div className="bg-[#FAF9FB] border border-slate-200 rounded-sm p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-5">
          <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-brand-pink shadow-2xs">
            <History className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-lg font-normal text-slate-900">
              Partner Network Programme Launching Shortly
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              Our inaugural 2026/2027 Partner Network sessions are currently in final schedule formulation. Completed event summaries, technical presentation downloads, and photographic records will appear here as sessions conclude.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500 font-light max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-pink" />
              <span>Technical Slide Decks</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-brand-pink" />
              <span>Session Briefings</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-brand-pink" />
              <span>Event Photo Records</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
