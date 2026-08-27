'use client';

import React, { useState, useEffect } from 'react';
import type { LobbyPulseItem } from '@/data/lobby/types';

interface LobbyPulseProps {
  data: LobbyPulseItem;
}

export function LobbyPulse({ data }: LobbyPulseProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (hasVoted) {
      const timer = setTimeout(() => setShowResults(true), 50);
      return () => clearTimeout(timer);
    }
  }, [hasVoted]);

  const totalVotes = data.totalVotesBaseline + (hasVoted ? 1 : 0);

  return (
    <article className="w-full bg-white border border-neutral-200/80 rounded-sm p-8 sm:p-10 lg:p-12 flex flex-col justify-between h-full space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-brand-electric font-semibold">
            THE PULSE · INDUSTRY DATA
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {totalVotes.toLocaleString()} Responses
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extralight text-neutral-900 leading-snug">
          {data.question}
        </h3>
      </div>

      {/* Interaction Area */}
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {!hasVoted ? (
          // Voting State
          <div className="space-y-3">
            {data.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOptionId(option.id)}
                className={`block w-full text-left px-4 py-3 rounded-sm border transition-all duration-200 text-sm font-light leading-relaxed ${
                  selectedOptionId === option.id
                    ? 'border-neutral-900 bg-neutral-900 text-white font-normal'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-neutral-50/50'
                }`}
              >
                {option.label}
              </button>
            ))}
            
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => selectedOptionId && setHasVoted(true)}
                disabled={!selectedOptionId}
                className="text-xs uppercase font-semibold tracking-wider bg-neutral-900 text-white px-6 py-2.5 rounded-sm hover:bg-brand-electric transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit Response
              </button>
              <span className="text-xs text-neutral-400 font-light">
                Live verified FM consensus
              </span>
            </div>
          </div>
        ) : (
          // Results State
          <div className="space-y-4 animate-in fade-in duration-500">
            {data.options.map((option) => {
              const percentage = option.percentage;
              return (
                <div key={option.id} className="space-y-1.5">
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-neutral-800 font-medium">
                      {option.label}
                    </span>
                    <span className="text-neutral-500 font-mono">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 transition-all duration-1000 ease-out"
                      style={{ width: showResults ? `${percentage}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Editorial Analysis */}
            {(data as any).editorialAnalysis && (
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-xs font-light text-neutral-500 italic leading-relaxed">
                  {(data as any).editorialAnalysis}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 font-mono flex items-center justify-between">
        <span>WEEKLY PULSE SURVEY</span>
        <span>ANONYMOUS &amp; INDEPENDENT</span>
      </div>
    </article>
  );
}
