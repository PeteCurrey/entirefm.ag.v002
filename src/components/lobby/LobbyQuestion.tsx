'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
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
    <div
      id="lobby-question"
      className="border border-brand-edge-dark bg-brand-carbon text-white rounded-sm p-6 sm:p-8 lg:p-10 shadow-elevated relative overflow-hidden"
    >
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand-electric/20 text-brand-electric-bright border border-brand-electric/40 text-xs font-mono">
              Q
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand-electric-bright">
              THE LOBBY QUESTION · Week {data.weekNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-brand-mist/60">
            <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10.5px]">
              Level: {data.difficulty}
            </span>
            <span>Topic: {data.topic}</span>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-white leading-snug">
            {data.question}
          </h3>
        </div>

        {/* 4 Interactive Options */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {data.options.map((option) => {
            const isSelected = selectedId === option.id;
            let buttonClasses =
              'p-4 rounded-sm border text-left transition-all duration-200 flex items-start gap-3 ';

            if (!submitted) {
              buttonClasses += isSelected
                ? 'bg-brand-electric/20 border-brand-electric text-white shadow-glow'
                : 'bg-brand-void/80 border-white/10 text-brand-mist/80 hover:border-white/30 hover:bg-brand-void';
            } else {
              if (option.isCorrect) {
                buttonClasses += 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ';
              } else if (isSelected && !option.isCorrect) {
                buttonClasses += 'bg-rose-950/40 border-rose-500 text-rose-200 ';
              } else {
                buttonClasses += 'bg-brand-void/50 border-white/5 text-brand-mist/40 opacity-60 ';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                disabled={submitted}
                className={buttonClasses}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-mono border ${
                    isSelected
                      ? 'border-brand-electric bg-brand-electric text-white'
                      : 'border-white/20 text-brand-mist/60'
                  }`}
                >
                  {option.id.replace('opt-', '').toUpperCase()}
                </span>
                <span className="text-xs sm:text-sm font-light leading-snug">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action / Result Feedback */}
        <div className="pt-2">
          {!submitted ? (
            <div className="flex items-center justify-between">
              <p className="text-xs font-light text-brand-mist/50">
                Select your answer to test your statutory technical knowledge.
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedId}
                className="btn-primary text-xs py-2 px-5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-white/[0.08] animate-rise">
              <div
                className={`p-4 rounded-sm border ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-normal text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-300">Incorrect.</span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-[13px] font-light text-brand-mist/90 leading-relaxed">
                  {data.explanation}
                </p>

                <p className="text-[11px] font-mono text-brand-mist/50 mt-3 pt-2 border-t border-white/10">
                  Governing standard: {data.governingStandard}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-brand-mist/60">
                <span className="text-[11px]">
                  Scoring &amp; Leaderboards will activate in the next Lobby update.
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-brand-mist/70 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
