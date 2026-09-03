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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollData, setPollData] = useState<{
    id: string;
    question: string;
    totalVotes: number;
    options: Array<{ id: string; label: string; votes?: number; percentage: number }>;
  }>({
    id: data.id,
    question: data.question,
    totalVotes: data.totalVotes ?? data.totalVotesBaseline ?? 0,
    options: data.options.map((o) => ({
      id: o.id,
      label: o.label,
      votes: (o as any).votes || 0,
      percentage: o.percentage || 0,
    })),
  });

  // Fetch live poll status on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/lobby/pulse')
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (!isMounted || !res?.poll) return;
        setPollData({
          id: res.poll.id,
          question: res.poll.question,
          totalVotes: res.poll.totalVotes,
          options: res.poll.options,
        });
        if (res.poll.hasVoted) {
          setHasVoted(true);
          setShowResults(true);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasVoted) {
      const timer = setTimeout(() => setShowResults(true), 50);
      return () => clearTimeout(timer);
    }
  }, [hasVoted]);

  const handleSubmit = async () => {
    if (!selectedOptionId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/lobby/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionId: selectedOptionId,
          pollId: pollData.id,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.poll) {
          setPollData({
            id: json.poll.id,
            question: json.poll.question,
            totalVotes: json.poll.totalVotes,
            options: json.poll.options,
          });
        }
      }
    } catch {
      // Ignore network errors, proceed to show local vote
    } finally {
      setIsSubmitting(false);
      setHasVoted(true);
    }
  };

  return (
    <article className="w-full bg-white border border-neutral-200/80 rounded-sm p-8 sm:p-10 lg:p-12 flex flex-col justify-between h-full space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em] text-brand-electric font-semibold">
            THE PULSE · INDUSTRY DATA
          </span>
          <span className="text-xs text-neutral-400 font-normal">
            {pollData.totalVotes.toLocaleString()} Responses
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extralight text-neutral-900 leading-snug">
          {pollData.question}
        </h3>
      </div>

      {/* Interaction Area */}
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {!hasVoted ? (
          // Voting State
          <div className="space-y-3">
            {pollData.options.map((option) => (
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
                onClick={handleSubmit}
                disabled={!selectedOptionId || isSubmitting}
                className="text-xs uppercase font-semibold tracking-wider bg-neutral-900 text-white px-6 py-2.5 rounded-sm hover:bg-brand-electric transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </button>
              <span className="text-xs text-neutral-400 font-light">
                {pollData.totalVotes > 0
                  ? 'Live verified FM consensus'
                  : 'Open for verified FM practitioner responses'}
              </span>
            </div>
          </div>
        ) : (
          // Results State
          <div className="space-y-4 animate-in fade-in duration-500">
            {pollData.options.map((option) => {
              const percentage = option.percentage;
              return (
                <div key={option.id} className="space-y-1.5">
                  <div className="flex justify-between items-end text-xs">
                    <span className="text-neutral-800 font-medium">
                      {option.label}
                    </span>
                    <span className="text-neutral-500 font-normal">
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

      <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400 font-normal flex items-center justify-between">
        <span>WEEKLY PULSE SURVEY</span>
        <span>ANONYMOUS &amp; INDEPENDENT</span>
      </div>
    </article>
  );
}
