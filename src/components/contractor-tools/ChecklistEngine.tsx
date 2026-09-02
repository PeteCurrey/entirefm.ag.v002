'use client';

import React, { useState, useCallback } from 'react';
import { Check, AlertTriangle, X, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/tracker';
import { WizardProgress } from '@/components/tools/WizardProgress';
import { ReadinessResult } from './ReadinessResult';
import type { ReadinessSummary } from './ReadinessResult';

// ── Types ────────────────────────────────────────────────────────────────────

export type ItemState = 'unanswered' | 'complete' | 'action_needed' | 'missing' | 'not_applicable';

export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  /** Whether N/A is a valid answer for this item */
  allowNotApplicable?: boolean;
  /** Link to external authority */
  authorityLink?: { label: string; href: string };
}

export interface ChecklistSection {
  id: string;
  title: string;
  subtitle?: string;
  items: ChecklistItem[];
}

export interface ChecklistEngineProps {
  toolName: string;
  sections: ChecklistSection[];
  /** 'binary' = complete / missing only. 'quad' = complete / action_needed / missing / not_applicable */
  mode?: 'binary' | 'quad';
  disclaimerContext?: 'rams' | 'compliance' | 'coshh' | 'document' | 'onboarding' | 'job' | 'general';
}

// ── State Label Config ───────────────────────────────────────────────────────

interface StateConfig {
  label: string;
  shortLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  ringClass: string;
}

const STATE_CONFIG: Record<Exclude<ItemState, 'unanswered'>, StateConfig> = {
  complete: {
    label: 'Complete',
    shortLabel: 'Done',
    Icon: Check,
    activeClass: 'bg-emerald-600 border-emerald-600 text-white',
    borderClass: 'border-emerald-300',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    ringClass: 'ring-emerald-500',
  },
  action_needed: {
    label: 'Needs Updating',
    shortLabel: 'Update',
    Icon: AlertTriangle,
    activeClass: 'bg-amber-500 border-amber-500 text-white',
    borderClass: 'border-amber-300',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    ringClass: 'ring-amber-500',
  },
  missing: {
    label: 'Missing',
    shortLabel: 'Missing',
    Icon: X,
    activeClass: 'bg-rose-600 border-rose-600 text-white',
    borderClass: 'border-rose-300',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    ringClass: 'ring-rose-500',
  },
  not_applicable: {
    label: 'Not Applicable',
    shortLabel: 'N/A',
    Icon: Minus,
    activeClass: 'bg-slate-400 border-slate-400 text-white',
    borderClass: 'border-slate-300',
    bgClass: 'bg-slate-50',
    textClass: 'text-slate-500',
    ringClass: 'ring-slate-400',
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isSectionComplete(
  section: ChecklistSection,
  answers: Record<string, ItemState>
): boolean {
  return section.items.every((item) => {
    const s = answers[item.id];
    return s && s !== 'unanswered';
  });
}

function buildSummary(
  toolName: string,
  sections: ChecklistSection[],
  answers: Record<string, ItemState>,
  disclaimerContext: ChecklistEngineProps['disclaimerContext']
): ReadinessSummary {
  let completed = 0;
  let actionNeeded = 0;
  let missing = 0;
  let notApplicable = 0;
  let total = 0;
  const outstandingItems: string[] = [];

  for (const section of sections) {
    for (const item of section.items) {
      total++;
      const state = answers[item.id] ?? 'unanswered';
      if (state === 'complete') completed++;
      else if (state === 'action_needed') { actionNeeded++; outstandingItems.push(item.label); }
      else if (state === 'missing') { missing++; outstandingItems.push(item.label); }
      else if (state === 'not_applicable') notApplicable++;
      else { missing++; outstandingItems.push(item.label); }
    }
  }

  return { toolName, completed, actionNeeded, missing, notApplicable, total, outstandingItems, disclaimerContext };
}

// ── Item Row ─────────────────────────────────────────────────────────────────

function ItemRow({
  item,
  state,
  mode,
  onChange,
}: {
  item: ChecklistItem;
  state: ItemState;
  mode: 'binary' | 'quad';
  onChange: (id: string, newState: ItemState) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const options: Exclude<ItemState, 'unanswered'>[] =
    mode === 'binary'
      ? ['complete', 'missing']
      : item.allowNotApplicable !== false
      ? ['complete', 'action_needed', 'missing', 'not_applicable']
      : ['complete', 'action_needed', 'missing'];

  const currentConfig = state !== 'unanswered' ? STATE_CONFIG[state] : null;

  return (
    <li className={`rounded-sm border transition-all duration-150 ${
      state === 'unanswered'
        ? 'border-slate-200 bg-white'
        : state === 'complete'
        ? 'border-emerald-200 bg-emerald-50/40'
        : state === 'action_needed'
        ? 'border-amber-200 bg-amber-50/40'
        : state === 'missing'
        ? 'border-rose-200 bg-rose-50/40'
        : 'border-slate-200 bg-slate-50/40'
    }`}>
      <div className="p-4">
        {/* Top row: label + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Label area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div
                className={`mt-0.5 h-3.5 w-3.5 rounded-full shrink-0 border-2 transition-colors ${
                  state !== 'unanswered'
                    ? currentConfig!.activeClass.replace('bg-', 'border-').split(' ')[0] + ' ' + currentConfig!.activeClass.split(' ')[0]
                    : 'border-slate-300 bg-white'
                }`}
                aria-hidden="true"
              />
              <span className="text-sm font-light text-slate-800 leading-snug">{item.label}</span>
            </div>
            {item.detail && (
              <button
                type="button"
                onClick={() => setExpanded((p) => !p)}
                className="mt-1.5 ml-5 flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-electric rounded-sm"
                aria-expanded={expanded}
                aria-controls={`detail-${item.id}`}
              >
                {expanded ? (
                  <><ChevronUp className="h-3 w-3" aria-hidden="true" /><span>Hide detail</span></>
                ) : (
                  <><ChevronDown className="h-3 w-3" aria-hidden="true" /><span>Show detail</span></>
                )}
              </button>
            )}
          </div>

          {/* Button group */}
          <div
            className="flex items-center gap-1.5 shrink-0 flex-wrap"
            role="group"
            aria-label={`Status for: ${item.label}`}
          >
            {options.map((opt) => {
              const cfg = STATE_CONFIG[opt];
              const isActive = state === opt;
              const { Icon } = cfg;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(item.id, isActive ? 'unanswered' : opt)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border text-[11px] font-normal transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    isActive
                      ? `${cfg.activeClass} focus-visible:${cfg.ringClass}`
                      : `bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 focus-visible:ring-slate-400`
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? '' : 'text-slate-400'}`} aria-hidden="true" />
                  <span className="hidden sm:inline">{cfg.label}</span>
                  <span className="sm:hidden">{cfg.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expanded detail */}
        {item.detail && expanded && (
          <div id={`detail-${item.id}`} className="mt-3 ml-5">
            <p className="text-xs text-slate-500 leading-relaxed font-light">{item.detail}</p>
            {item.authorityLink && (
              <a
                href={item.authorityLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-brand-electric hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-electric rounded-sm"
              >
                {item.authorityLink.label} ↗
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

// ── Section Panel ─────────────────────────────────────────────────────────────

function SectionPanel({
  section,
  answers,
  mode,
  isActive,
  onAnswer,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: {
  section: ChecklistSection;
  answers: Record<string, ItemState>;
  mode: 'binary' | 'quad';
  isActive: boolean;
  onAnswer: (id: string, state: ItemState) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const complete = isSectionComplete(section, answers);
  const answeredCount = section.items.filter(
    (i) => answers[i.id] && answers[i.id] !== 'unanswered'
  ).length;

  if (!isActive) return null;

  return (
    <div role="region" aria-labelledby={`section-title-${section.id}`}>
      {/* Section header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2
            id={`section-title-${section.id}`}
            className="text-lg font-light text-slate-900 tracking-tight"
          >
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span className="text-xl font-extralight text-slate-800">
            {answeredCount}
          </span>
          <span className="text-xs text-slate-400 font-light">
            /{section.items.length}
          </span>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-light mt-0.5">
            answered
          </p>
        </div>
      </div>

      {/* Items */}
      <ul className="space-y-2.5" aria-label={`${section.title} checklist items`}>
        {section.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            state={answers[item.id] ?? 'unanswered'}
            mode={mode}
            onChange={onAnswer}
          />
        ))}
      </ul>

      {/* Section nav */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {!isFirst ? (
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-slate-200 bg-white text-xs font-normal text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric"
          >
            ← Previous section
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!complete}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-normal tracking-wider uppercase shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-electric ${
            complete
              ? 'bg-brand-graphite hover:bg-slate-800 text-white cursor-pointer'
              : 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          aria-disabled={!complete}
        >
          {isLast ? 'View My Results' : 'Next Section →'}
        </button>
      </div>

      {!complete && (
        <p className="text-center text-[11px] text-slate-400 mt-3 font-light" role="status" aria-live="polite">
          Answer all {section.items.length} items to continue
        </p>
      )}
    </div>
  );
}

// ── Main ChecklistEngine ──────────────────────────────────────────────────────

export function ChecklistEngine({
  toolName,
  sections,
  mode = 'quad',
  disclaimerContext = 'general',
}: ChecklistEngineProps) {
  const [answers, setAnswers] = useState<Record<string, ItemState>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const wizardSteps = sections.map((s, i) => ({
    id: i,
    title: s.title,
  }));

  const handleAnswer = useCallback(
    (id: string, state: ItemState) => {
      if (!hasStarted) {
        setHasStarted(true);
        trackEvent('tool_started', { tool_name: toolName });
      }
      setAnswers((prev) => ({ ...prev, [id]: state }));
    },
    [hasStarted, toolName]
  );

  const handleNext = useCallback(() => {
    const section = sections[currentSection];
    trackEvent('tool_question_completed', {
      tool_name: toolName,
      section: section.title,
      section_index: currentSection,
    });

    if (currentSection === sections.length - 1) {
      trackEvent('tool_completed', { tool_name: toolName });
      setShowResult(true);
    } else {
      setCurrentSection((p) => p + 1);
    }
  }, [currentSection, sections, toolName]);

  const handlePrev = useCallback(() => {
    setCurrentSection((p) => Math.max(0, p - 1));
  }, []);

  const handleReset = useCallback(() => {
    setAnswers({});
    setCurrentSection(0);
    setShowResult(false);
    setHasStarted(false);
  }, []);

  const summary = buildSummary(toolName, sections, answers, disclaimerContext);

  if (showResult) {
    return <ReadinessResult summary={summary} onReset={handleReset} />;
  }

  return (
    <div>
      <WizardProgress
        steps={wizardSteps}
        currentStep={currentSection}
        onSelectStep={(idx) => {
          // Only allow navigating back to completed sections
          if (idx < currentSection) setCurrentSection(idx);
        }}
      />

      {sections.map((section, idx) => (
        <SectionPanel
          key={section.id}
          section={section}
          answers={answers}
          mode={mode}
          isActive={idx === currentSection}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={idx === 0}
          isLast={idx === sections.length - 1}
        />
      ))}
    </div>
  );
}
