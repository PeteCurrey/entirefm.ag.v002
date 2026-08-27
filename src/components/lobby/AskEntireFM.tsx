'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, CheckCircle2, ChevronDown, Send } from 'lucide-react';
import type { AskEntireFMItem } from '@/data/lobby/types';

interface AskEntireFMProps {
  data: AskEntireFMItem;
}

export function AskEntireFM({ data }: AskEntireFMProps) {
  const [expanded, setExpanded] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  return (
    <div className="border border-brand-edge bg-white rounded-sm p-6 sm:p-8 lg:p-10 shadow-subtle hover:border-brand-electric/40 transition-all duration-300">
      <div className="space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-edge pb-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-purple-50 text-purple-700 text-[11px] font-medium tracking-wide uppercase border border-purple-200">
              <MessageSquare className="w-3.5 h-3.5" />
              ASK ENTIREFM · Professional Q&amp;A
            </span>
          </div>

          <span className="text-xs text-brand-silver font-light">
            Context: {data.estateProfile}
          </span>
        </div>

        {/* The Question (Strong Typographic Treatment) */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-brand-silver">
            Submitted by: {data.askerContext}
          </p>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-brand-graphite leading-snug tracking-tight">
            “{data.question}”
          </h3>
        </div>

        {/* Answer Breakdown */}
        <div className="rounded-sm bg-brand-surface border border-brand-edge p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-brand-graphite text-white flex items-center justify-center text-[10px] font-mono">
                EFM
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-brand-graphite">
                EntireFM Technical Response
              </span>
            </div>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-light text-brand-electric hover:underline inline-flex items-center gap-1"
            >
              <span>{expanded ? 'Collapse Summary' : 'Expand Full Response'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {expanded && (
            <div className="space-y-4 pt-2 animate-rise">
              <ul className="grid sm:grid-cols-2 gap-3 pt-2">
                {data.keyAnswerPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] font-light text-brand-slate leading-relaxed bg-white p-3 rounded-sm border border-brand-edge">
                    <CheckCircle2 className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs sm:text-[13px] font-light text-brand-silver leading-relaxed border-t border-brand-edge pt-3">
                {data.fullAnswerSummary}
              </p>
            </div>
          )}
        </div>

        {/* Submission CTA bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p className="text-xs text-brand-silver font-light">
            Have a technical or contract mobilisation question for our engineering directorate?
          </p>

          <Link
            href="/contact-us"
            className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit a Question to The Lobby</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
