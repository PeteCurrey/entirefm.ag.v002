'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
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
    <section className="w-full bg-brand-void relative flex flex-col overflow-hidden">
      {/* Image Side (Top on mobile, Left on lg+) */}
      <div className="relative w-full h-[240px] lg:h-auto lg:w-1/2 lg:absolute lg:left-0 lg:top-0 lg:bottom-0">
        <Image 
          src="/images/editorial/entirefm-switchroom-survey-1200w.webp"
          alt="Switchroom survey challenge"
          fill
          priority
          className="object-cover"
        />
        {/* Subtle overlays */}
        <div className="absolute inset-0 bg-brand-void/20" />
        <div 
          className={`absolute inset-0 bg-emerald-500/20 mix-blend-overlay transition-opacity duration-700 ${
            submitted && isCorrect ? 'opacity-100' : 'opacity-0'
          }`} 
        />
      </div>

      {/* Content Panel (Bottom on mobile, Right on lg+) */}
      <div className="relative z-10 w-full lg:w-1/2 lg:ml-auto bg-brand-void p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
        
        {/* Header */}
        <div className="mb-8">
          <div className="text-[9px] uppercase tracking-[0.25em] text-brand-electric mb-1">
            THE LOBBY QUESTION
          </div>
          <div className="text-[10px] text-white/40">
            Week {data.weekNumber}
          </div>
        </div>

        {/* Question */}
        <h3 className="text-xl sm:text-2xl font-extralight text-white leading-snug mb-10">
          {data.question}
        </h3>

        {/* Options */}
        <div className="flex flex-col gap-4 mb-10">
          {data.options.map((option) => {
            const isSelected = selectedId === option.id;
            const showAsCorrect = submitted && option.isCorrect;
            
            let borderClass = 'border-white/10';
            let textClass = 'text-white/70';
            
            if (submitted) {
              if (showAsCorrect) {
                borderClass = 'border-emerald-500';
                textClass = 'text-white font-bold';
              } else if (isSelected && !option.isCorrect) {
                textClass = 'text-white/40';
              } else {
                textClass = 'text-white/30';
              }
            } else {
              if (isSelected) {
                borderClass = 'border-brand-electric';
                textClass = 'text-white';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                disabled={submitted}
                className={`group text-left border-l-2 pl-3 py-2 cursor-pointer transition-all duration-200 ${borderClass}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-sm font-light transition-colors ${textClass}`}>
                    {option.text}
                  </span>
                  {showAsCorrect && (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action / Result */}
        <div className="min-h-[80px]">
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedId}
              className="border border-brand-electric text-brand-electric text-[10px] tracking-wider py-2 px-6 uppercase hover:bg-brand-electric/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-4 mb-4">
                {isCorrect && (
                  <span className="inline-flex items-center justify-center px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider font-medium rounded-sm border border-emerald-500/20">
                    +50 pts
                  </span>
                )}
                <span className="text-[11px] text-white/40">
                  64% of practitioners answered this correctly
                </span>
              </div>
              
              <div className="text-sm font-light text-white/70 mt-4 border-l-2 border-emerald-500 pl-3">
                {data.explanation}
              </div>
              
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 text-[11px] text-white/40 hover:text-white transition-colors underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

