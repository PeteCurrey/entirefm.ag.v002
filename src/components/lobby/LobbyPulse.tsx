'use client';

import React, { useState } from 'react';
import { BarChart3, CheckCircle2, Users, PieChart } from 'lucide-react';
import type { LobbyPulseItem } from '@/data/lobby/types';

interface LobbyPulseProps {
  data: LobbyPulseItem;
}

export function LobbyPulse({ data }: LobbyPulseProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (id: string) => {
    setSelectedOptionId(id);
    setHasVoted(true);
  };

  const totalVotes = data.totalVotesBaseline + (hasVoted ? 1 : 0);

  return (
    <div className="border border-brand-edge bg-white rounded-sm p-6 sm:p-8 lg:p-10 shadow-subtle hover:border-brand-electric/40 transition-all duration-300">
      <div className="space-y-6">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-edge pb-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-brand-electric/10 text-brand-electric text-[11px] font-medium tracking-wide uppercase">
              <BarChart3 className="w-3.5 h-3.5" />
              THE PULSE · Industry Sentiment
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-brand-silver font-light">
            <Users className="w-3.5 h-3.5" />
            <span>{totalVotes} FM practitioners responding</span>
          </div>
        </div>

        {/* Question */}
        <div>
          <h3 className="text-xl sm:text-2xl font-extralight text-brand-graphite leading-snug tracking-tight">
            {data.question}
          </h3>
          <p className="text-xs text-brand-silver font-light mt-1">
            {data.context}
          </p>
        </div>

        {/* Options / Result Bars */}
        <div className="space-y-3 pt-2">
          {data.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const percentage = option.percentage;

            return (
              <div key={option.id} className="relative">
                {!hasVoted ? (
                  <button
                    type="button"
                    onClick={() => handleVote(option.id)}
                    className="w-full p-4 rounded-sm border border-brand-edge bg-white hover:border-brand-electric/60 hover:bg-brand-surface text-left transition-all duration-200 flex items-center justify-between text-xs sm:text-sm font-light text-brand-slate group"
                  >
                    <span className="group-hover:text-brand-graphite">{option.label}</span>
                    <span className="text-[11px] font-normal text-brand-silver group-hover:text-brand-electric">
                      Vote →
                    </span>
                  </button>
                ) : (
                  <div className="p-4 rounded-sm border border-brand-edge bg-brand-surface relative overflow-hidden">
                    {/* Animated Progress Fill */}
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-700 ease-brand ${
                        isSelected ? 'bg-brand-electric/15 border-r-2 border-brand-electric' : 'bg-brand-edge/50'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />

                    <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm">
                      <span className={`font-light ${isSelected ? 'font-normal text-brand-electric' : 'text-brand-graphite'}`}>
                        {option.label} {isSelected && '(Your vote)'}
                      </span>
                      <span className="font-mono text-xs text-brand-slate font-medium">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-brand-edge flex flex-wrap items-center justify-between text-[11px] font-light text-brand-silver">
          <span>Data compiled monthly across UK facilities managers &amp; estates directors.</span>
          {hasVoted && (
            <span className="text-emerald-700 font-normal">
              ✓ Your response has been recorded.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
