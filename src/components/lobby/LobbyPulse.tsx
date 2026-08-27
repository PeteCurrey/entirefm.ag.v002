'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { LobbyPulseItem } from '@/data/lobby/types';

interface LobbyPulseProps {
  data: LobbyPulseItem;
}

export function LobbyPulse({ data }: LobbyPulseProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Animate bars after voting
  useEffect(() => {
    if (hasVoted) {
      // Small delay to allow the DOM to render the 0% bars before transitioning
      const timer = setTimeout(() => setShowResults(true), 50);
      return () => clearTimeout(timer);
    }
  }, [hasVoted]);

  const totalVotes = data.totalVotesBaseline + (hasVoted ? 1 : 0);

  return (
    <section className="relative w-full bg-[#080C14] overflow-hidden py-16 sm:py-20">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/editorial/entirefm-manchester-castlefield-night-1280w.webp"
          alt="Manchester Castlefield Night"
          fill
          className="object-cover object-center opacity-15"
          priority
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="space-y-10">
          
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-[9px] uppercase tracking-[0.25em] text-brand-electric">
              The Pulse
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extralight text-white leading-snug tracking-tight">
              {data.question}
            </h3>
            <p className="text-[11px] text-white/40">
              {totalVotes.toLocaleString()} FM practitioners have responded
            </p>
          </div>

          {/* Interaction Area */}
          <div className="space-y-4">
            {!hasVoted ? (
              // Voting State
              <div className="space-y-4">
                {data.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`block w-full text-left pl-4 py-2 border-l transition-colors duration-300 text-sm font-light ${
                      selectedOptionId === option.id
                        ? 'border-brand-electric text-white'
                        : 'border-white/10 text-white/70 hover:border-brand-electric hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                
                <div className="pt-6">
                  <button
                    onClick={() => selectedOptionId && setHasVoted(true)}
                    disabled={!selectedOptionId}
                    className="text-xs uppercase tracking-wider bg-transparent border border-brand-electric text-brand-electric px-5 py-2 hover:bg-brand-electric hover:text-white transition-colors duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-electric disabled:cursor-not-allowed"
                  >
                    Submit Vote
                  </button>
                </div>
              </div>
            ) : (
              // Results State
              <div className="space-y-5 animate-in fade-in duration-500">
                {data.options.map((option) => {
                  const percentage = option.percentage;
                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-white/60 font-light">
                          {option.label}
                        </span>
                        <span className="text-white/70 font-mono text-xs">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/15 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-1000 ease-out"
                          style={{ width: showResults ? `${percentage}%` : '0%' }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Editorial Analysis */}
                {(data as any).editorialAnalysis && (
                  <div className="pt-8">
                    <p className="text-xs font-light text-white/50 italic max-w-2xl leading-relaxed">
                      {(data as any).editorialAnalysis}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
