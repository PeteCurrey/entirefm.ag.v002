'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';

export type LobbyLoadingVariant = 'today' | 'compliance' | 'procurement' | 'opportunities';

export interface LobbyContentLoadingStateProps {
  variant?: LobbyLoadingVariant;
  customTitle?: string;
  customDescription?: string;
  stages?: string[];
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

interface VariantConfig {
  title: string;
  description: string;
  stages: string[];
  longLoadingTitle: string;
  longLoadingDesc: string;
}

const VARIANT_CONFIGS: Record<LobbyLoadingVariant, VariantConfig> = {
  today: {
    title: "Preparing today's FM intelligence briefing",
    description:
      "Reviewing today's developments across facilities management, property, compliance and the built environment.",
    stages: [
      'Gathering current developments',
      'Reviewing relevant FM intelligence',
      'Prioritising material updates',
      'Preparing your briefing',
    ],
    longLoadingTitle: 'Still preparing your briefing',
    longLoadingDesc:
      "We're completing the latest intelligence review. This may take a few more seconds.",
  },
  compliance: {
    title: 'Reviewing the latest compliance intelligence',
    description:
      'Checking regulatory, statutory and industry developments relevant to facilities and property teams.',
    stages: [
      'Checking regulatory developments',
      'Reviewing compliance updates',
      'Assessing operational relevance',
      'Preparing the compliance briefing',
    ],
    longLoadingTitle: 'Still reviewing compliance intelligence',
    longLoadingDesc:
      'Checking statutory registers and regulatory bulletins across UK authorities.',
  },
  procurement: {
    title: 'Preparing current procurement intelligence',
    description:
      'Reviewing opportunities, contract activity and relevant procurement developments.',
    stages: [
      'Checking procurement activity',
      'Reviewing relevant opportunities',
      'Assessing current notices',
      'Preparing procurement intelligence',
    ],
    longLoadingTitle: 'Still assembling procurement intelligence',
    longLoadingDesc:
      'Synthesising live tender notices and recent public contract award records.',
  },
  opportunities: {
    title: 'Preparing current procurement intelligence',
    description:
      'Reviewing opportunities, contract activity and relevant procurement developments.',
    stages: [
      'Checking procurement activity',
      'Reviewing relevant opportunities',
      'Assessing current notices',
      'Preparing procurement intelligence',
    ],
    longLoadingTitle: 'Still assembling procurement intelligence',
    longLoadingDesc:
      'Synthesising live tender notices and recent public contract award records.',
  },
};

export function LobbyContentLoadingState({
  variant = 'today',
  customTitle,
  customDescription,
  stages: customStages,
  error = null,
  onRetry,
  className = '',
}: LobbyContentLoadingStateProps) {
  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.today;
  const stages = customStages || config.stages;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isLongLoading, setIsLongLoading] = useState(false);

  // Cycle through subtle activity states every ~2 seconds
  useEffect(() => {
    if (error) return;

    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % stages.length);
    }, 2000);

    const longTimer = setTimeout(() => {
      setIsLongLoading(true);
    }, 5000);

    return () => {
      clearInterval(stageInterval);
      clearTimeout(longTimer);
    };
  }, [stages.length, error]);

  // ── ERROR STATE ──
  if (error) {
    return (
      <section
        role="alert"
        aria-live="assertive"
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ${className}`}
      >
        <div className="max-w-2xl mx-auto p-8 rounded-[6px] border border-neutral-300/80 bg-white text-center space-y-5 shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extralight text-neutral-900 tracking-tight">
              We couldn&apos;t load this briefing
            </h2>
            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed max-w-md mx-auto">
              {error ||
                'The intelligence feed did not respond. You can try again without leaving the page.'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-4 py-2 rounded-[4px] bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-light tracking-wide inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try again</span>
              </button>
            )}

            <Link
              href="/lobby"
              className="px-4 py-2 rounded-[4px] border border-neutral-300 bg-neutral-50 hover:bg-white text-neutral-700 hover:text-neutral-900 text-xs font-light tracking-wide inline-flex items-center gap-1 transition-colors"
            >
              <span>Return to The Lobby</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const displayTitle = isLongLoading
    ? config.longLoadingTitle
    : customTitle || config.title;
  const displayDescription = isLongLoading
    ? config.longLoadingDesc
    : customDescription || config.description;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`space-y-12 sm:space-y-16 py-8 sm:py-12 ${className}`}
    >
      {/* ── 1. RESTRAINED INDETERMINATE STATUS BAR & CONTEXTUAL HEADLINE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-neutral-200/80 rounded-[6px] p-6 sm:p-8 space-y-6 shadow-2xs">
          
          {/* Top Status & Stage Label */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-electric opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-electric" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-brand-electric font-medium">
                Live Intelligence Feed
              </span>
            </div>

            {/* Cycling Activity Stage Indicator */}
            <div className="text-xs font-extralight text-neutral-500 flex items-center gap-2 transition-all duration-300">
              <span className="text-neutral-400 font-normal text-[10px]">Status:</span>
              <span className="font-light text-neutral-800 animate-in fade-in duration-300 key={currentStageIndex}">
                {stages[currentStageIndex]}…
              </span>
            </div>
          </div>

          {/* Indeterminate Animated Progress Bar */}
          <div className="w-full">
            <div className="h-[2.5px] w-full bg-neutral-100 rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full"
                style={{
                  animation: 'lobbyProgressIndeterminate 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                }}
              />
            </div>
          </div>

          {/* Contextual Editorial Status Message */}
          <div className="space-y-1.5 pt-1">
            <h2 className="text-lg sm:text-xl font-light text-neutral-900 tracking-tight transition-all duration-300">
              {displayTitle}
            </h2>
            <p className="text-xs sm:text-sm font-extralight text-neutral-600 leading-relaxed max-w-3xl">
              {displayDescription}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. EDITORIAL CONTENT SKELETON (Matched to variant layout to eliminate CLS) ── */}
      {variant === 'today' && <TodaySkeleton />}
      {variant === 'compliance' && <ComplianceSkeleton />}
      {(variant === 'procurement' || variant === 'opportunities') && <ProcurementSkeleton />}

      {/* Injected CSS keyframes for smooth indeterminate sweep */}
      <style jsx>{`
        @keyframes lobbyProgressIndeterminate {
          0% {
            left: -35%;
            width: 30%;
          }
          50% {
            left: 35%;
            width: 45%;
          }
          100% {
            left: 105%;
            width: 30%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ping {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Editorial Skeleton for /lobby/today
 * Mirrors: 3 Things That Matter (Lead Col 7 + 2 Stacked Col 5) + What Changed Stream
 */
function TodaySkeleton() {
  return (
    <div className="space-y-16 sm:space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* 3 Things That Matter Section Placeholder */}
      <div className="space-y-8">
        <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
          <div className="space-y-1.5">
            <div className="h-2.5 w-24 bg-neutral-200/80 rounded" />
            <div className="h-6 w-56 bg-neutral-300/70 rounded" />
          </div>
          <div className="h-3 w-48 bg-neutral-200/60 rounded hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Lead Card Skeleton (Col 7) */}
          <div className="lg:col-span-7 bg-[#07090E] rounded-[6px] p-6 sm:p-10 flex flex-col justify-between min-h-[380px] space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-20 bg-white/20 rounded" />
                <div className="h-2.5 w-16 bg-white/10 rounded" />
              </div>
              <div className="h-8 w-11/12 bg-white/30 rounded" />
              <div className="h-8 w-3/4 bg-white/20 rounded" />
              <div className="h-4 w-5/6 bg-white/15 rounded mt-2" />
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="h-3 w-32 bg-white/15 rounded" />
              <div className="h-3 w-28 bg-white/20 rounded" />
            </div>
          </div>

          {/* Secondary Stacked Skeletons (Col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200/90 rounded-[6px] p-6 space-y-4 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="h-2 w-16 bg-neutral-200 rounded" />
                  <div className="h-5 w-11/12 bg-neutral-300 rounded" />
                  <div className="h-3 w-full bg-neutral-200 rounded" />
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="h-2.5 w-24 bg-neutral-200 rounded" />
                  <div className="h-2.5 w-16 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What Changed Wire Stream Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-3 flex items-baseline justify-between">
          <div className="space-y-1.5">
            <div className="h-2.5 w-28 bg-neutral-200 rounded" />
            <div className="h-6 w-44 bg-neutral-300 rounded" />
          </div>
          <div className="h-3 w-36 bg-neutral-200 rounded hidden sm:block" />
        </div>

        <div className="divide-y divide-neutral-200/80 bg-white border border-neutral-200/80 rounded-[6px] overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-12 bg-neutral-200 rounded" />
                  <div className="h-2.5 w-24 bg-neutral-200 rounded" />
                </div>
                <div className="h-4 w-3/4 bg-neutral-300 rounded" />
                <div className="h-3 w-1/2 bg-neutral-200 rounded" />
              </div>
              <div className="h-3 w-20 bg-neutral-200 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Editorial Skeleton for /lobby/compliance
 * Mirrors: Lead Change That Matters + On The Horizon Timeline + Regulatory Stream
 */
function ComplianceSkeleton() {
  return (
    <div className="space-y-16 sm:space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Lead Compliance Feature Skeleton (Dark Split) */}
      <div className="bg-[#07090E] rounded-[6px] overflow-hidden border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        <div className="lg:col-span-6 bg-neutral-900/80 min-h-[260px] flex items-center justify-center p-8">
          <div className="w-full space-y-3 opacity-30">
            <div className="h-3 w-24 bg-white rounded" />
            <div className="h-6 w-3/4 bg-white rounded" />
          </div>
        </div>

        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-2.5 w-28 bg-white/20 rounded" />
              <div className="h-2.5 w-24 bg-white/15 rounded" />
            </div>
            <div className="h-7 w-11/12 bg-white/30 rounded" />
            <div className="h-7 w-4/5 bg-white/20 rounded" />
            <div className="h-3.5 w-full bg-white/15 rounded mt-2" />
            <div className="h-3.5 w-3/4 bg-white/15 rounded" />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <div className="h-3 w-32 bg-white/15 rounded" />
            <div className="h-3 w-28 bg-white/20 rounded" />
          </div>
        </div>
      </div>

      {/* On the Horizon Timeline Skeleton */}
      <div className="space-y-6 bg-white p-6 sm:p-8 rounded-[6px] border border-neutral-200/80">
        <div className="border-b border-neutral-200 pb-3 flex justify-between items-baseline">
          <div className="space-y-1">
            <div className="h-2.5 w-28 bg-neutral-200 rounded" />
            <div className="h-5 w-40 bg-neutral-300 rounded" />
          </div>
          <div className="h-2.5 w-44 bg-neutral-200 rounded hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2.5 pr-2">
              <div className="h-2 w-16 bg-neutral-200 rounded" />
              <div className="h-6 w-20 bg-neutral-300 rounded" />
              <div className="h-3 w-24 bg-neutral-200 rounded" />
              <div className="h-3.5 w-full bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Index Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-3 flex justify-between items-baseline">
          <div className="h-6 w-52 bg-neutral-300 rounded" />
          <div className="h-3 w-24 bg-neutral-200 rounded" />
        </div>

        <div className="divide-y divide-neutral-200/80">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 space-y-2">
                <div className="h-2.5 w-24 bg-neutral-200 rounded" />
                <div className="h-3 w-32 bg-neutral-200 rounded" />
              </div>
              <div className="lg:col-span-7 space-y-2">
                <div className="h-5 w-11/12 bg-neutral-300 rounded" />
                <div className="h-3.5 w-full bg-neutral-200 rounded" />
              </div>
              <div className="lg:col-span-2 flex justify-end items-start">
                <div className="h-3 w-20 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Editorial Skeleton for /lobby/opportunities and /lobby/procurement
 * Mirrors: Strategic Lead Opportunity + Closing Soon Cards + Procurement Stream
 */
function ProcurementSkeleton() {
  return (
    <div className="space-y-16 sm:space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Strategic Lead Opportunity Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-3 flex justify-between items-baseline">
          <div className="space-y-1">
            <div className="h-2.5 w-28 bg-neutral-200 rounded" />
            <div className="h-6 w-52 bg-neutral-300 rounded" />
          </div>
          <div className="h-3 w-32 bg-neutral-200 rounded hidden sm:block" />
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-[6px] p-6 sm:p-10 space-y-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-28 bg-neutral-200 rounded" />
              <div className="h-3 w-20 bg-neutral-200 rounded" />
            </div>
            <div className="h-3 w-24 bg-neutral-200 rounded" />
          </div>

          <div className="space-y-3">
            <div className="h-8 w-10/12 bg-neutral-300 rounded" />
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-4 w-3/4 bg-neutral-200 rounded" />
          </div>

          <div className="pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2 w-16 bg-neutral-200 rounded" />
                <div className="h-4 w-28 bg-neutral-300 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closing Soon Cards Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-3 flex justify-between items-baseline">
          <div className="h-5 w-44 bg-neutral-300 rounded" />
          <div className="h-3 w-24 bg-neutral-200 rounded hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200/90 rounded-[6px] p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <div className="h-2 w-20 bg-neutral-200 rounded" />
                  <div className="h-2 w-16 bg-neutral-200 rounded" />
                </div>
                <div className="h-5 w-11/12 bg-neutral-300 rounded" />
                <div className="h-3 w-full bg-neutral-200 rounded" />
              </div>
              <div className="pt-3 border-t border-neutral-100 flex justify-between">
                <div className="h-2.5 w-20 bg-neutral-200 rounded" />
                <div className="h-2.5 w-16 bg-neutral-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
