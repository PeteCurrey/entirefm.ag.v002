'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, BookOpen } from 'lucide-react';
import type { LobbyQuestionItem } from '@/data/lobby/types';

interface LobbyQuestionProps {
  data: LobbyQuestionItem;
}

export function LobbyQuestion({ data }: LobbyQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = data.options.find((opt) => opt.id === selectedId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelect = (id: string) => {
    if (submitted) return;
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedId(null);
    setSubmitted(false);
  };

  return (
    <article className="flex flex-col h-full overflow-hidden rounded-sm bg-brand-void">
      {/* Photography header — fixed height, never shrinks */}
      <div className="relative w-full h-52 shrink-0 overflow-hidden">
        <Image
          src={data.imageUrl || "/images/editorial/three-phase-distribution-board-eicr.jpg"}
          alt={data.imageAlt || "Three-phase electrical distribution board inspection"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover brightness-75 transition-all duration-500 hover:brightness-90 hover:scale-[1.02]"
        />
        {/* Success overlay */}
        <div
          className={`absolute inset-0 bg-emerald-500/25 mix-blend-overlay transition-opacity duration-700 ${
            submitted && isCorrect ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Section label over image */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-electric">
            THE LOBBY QUESTION
          </span>
          <p className="text-[10px] text-white/40 mt-0.5">Week {data.weekNumber}</p>
        </div>
      </div>

      {/* Content panel */}
      <div className="flex flex-col flex-1 p-6 sm:p-8 gap-6">
        {/* Question — clear, readable, appropriate size for the column */}
        <h3 className="text-base sm:text-lg font-light text-white leading-relaxed">
          {data.question}
        </h3>

        {/* Answer options */}
        <div className="flex flex-col gap-3">
          {data.options.map((option) => {
            const isSelected = selectedId === option.id;
            const showAsCorrect = submitted && option.isCorrect;

            let borderClass = 'border-white/10 hover:border-white/30';
            let textClass = 'text-white/70';
            let bgClass = '';

            if (submitted) {
              if (showAsCorrect) {
                borderClass = 'border-emerald-500';
                textClass = 'text-white font-medium';
                bgClass = 'bg-emerald-950/30';
              } else if (isSelected && !option.isCorrect) {
                borderClass = 'border-rose-500/40';
                textClass = 'text-white/40';
              } else {
                borderClass = 'border-white/5';
                textClass = 'text-white/25';
              }
            } else if (isSelected) {
              borderClass = 'border-brand-electric';
              textClass = 'text-white';
              bgClass = 'bg-brand-electric/5';
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                disabled={submitted}
                className={`group text-left border-l-2 pl-3 py-2.5 pr-3 cursor-pointer transition-all duration-200 rounded-sm ${borderClass} ${bgClass}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-sm font-light leading-snug transition-colors ${textClass}`}>
                    {option.text}
                  </span>
                  {showAsCorrect && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit / Result */}
        <div className="mt-auto pt-4 border-t border-white/10">
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedId}
              className="border border-brand-electric text-brand-electric text-[10px] font-mono tracking-widest py-2 px-6 uppercase hover:bg-brand-electric/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-mono uppercase tracking-wider rounded-sm border border-emerald-500/25">
                    <Check className="w-3 h-3" />
                    Correct · +50 pts
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 text-white/50 text-[10px] font-mono uppercase tracking-wider rounded-sm border border-white/10">
                    Incorrect
                  </span>
                )}
                <span className="text-[11px] text-white/40 font-light">
                  64% of practitioners answered correctly
                </span>
              </div>

              <div className="flex gap-3 items-start text-sm font-light text-white/75 border-l-2 border-emerald-500/60 pl-3 leading-relaxed">
                <BookOpen className="w-4 h-4 text-emerald-400/70 shrink-0 mt-0.5" />
                <p>{data.explanation}</p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-white/35 hover:text-white/70 transition-colors underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
