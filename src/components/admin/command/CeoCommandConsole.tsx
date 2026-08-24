'use client';
import React, { useState, useRef, useCallback } from 'react';
import type { UserSession } from '@/server/identity';
import type { ExecutiveAnswer } from '@/server/ceo-command/types';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ExecutiveBriefModal } from './ExecutiveBriefModal';
import type { ExecutiveBrief } from '@/server/ceo-command/executive-brief';

const SUGGESTION_CHIPS = [
  'What changed today?',
  'What is our gross margin?',
  'Which sites have compliance issues?',
  'What PPM is due this month?',
  'Which providers are underperforming?',
  'Show revenue leakage',
  'AI automation activity today',
  'What needs a decision?',
];

const DATA_STATUS_STYLE: Record<string, string> = {
  LIVE: 'text-emerald-400',
  STALE: 'text-amber-400',
  NO_DATA: 'text-brand-mist/40',
  NOT_CONFIGURED: 'text-sky-400/60',
  RESTRICTED: 'text-rose-400',
  ZERO: 'text-brand-mist/40',
  LICENSE_REQUIRED: 'text-amber-300',
};

interface ChatTurn {
  question: string;
  answer: ExecutiveAnswer | null;
  loading: boolean;
  error?: string;
}

interface Props {
  session: UserSession;
  zeroData: boolean;
}

export function CeoCommandConsole({ session, zeroData }: Props) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [briefOpen, setBriefOpen] = useState(false);
  const [brief, setBrief] = useState<ExecutiveBrief | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canBrief = (session.permissions || []).includes('enterprise_intelligence:brief_generate' as any)
    || ['SUPER_ADMIN', 'CEO', 'DIRECTOR'].includes(session.role);

  const ask = useCallback(async (question: string) => {
    if (!question.trim()) return;
    const turnIndex = turns.length;
    setTurns(prev => [...prev, { question, answer: null, loading: true }]);
    setInput('');
    try {
      const res = await fetch('/api/admin/command/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTurns(prev => prev.map((t, i) => i === turnIndex ? { ...t, loading: false, error: data.error || 'Query failed' } : t));
      } else {
        setTurns(prev => prev.map((t, i) => i === turnIndex ? { ...t, loading: false, answer: data.answer } : t));
      }
    } catch (err) {
      setTurns(prev => prev.map((t, i) => i === turnIndex ? { ...t, loading: false, error: 'Network error' } : t));
    }
  }, [turns.length]);

  const handleGenBrief = async () => {
    setBriefLoading(true);
    try {
      const res = await fetch('/api/admin/command/brief');
      const data = await res.json();
      if (data.success) setBrief(data.brief);
    } finally {
      setBriefLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/20 overflow-hidden">

      {/* Conversation History */}
      {turns.length > 0 && (
        <div className="border-b border-brand-edge-dark/40 divide-y divide-brand-edge-dark/20 max-h-[600px] overflow-y-auto">
          {turns.map((turn, i) => (
            <div key={i} className="p-5 space-y-3">
              {/* Question */}
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-brand-orange/70 pt-0.5 shrink-0">YOU</span>
                <span className="text-[13px] text-white/90">{turn.question}</span>
              </div>

              {/* Answer */}
              {turn.loading && (
                <div className="flex items-center gap-2 pl-8 text-[11px] font-mono text-brand-mist/40 animate-pulse">
                  <span className="w-1 h-1 rounded-full bg-brand-mist/40" />
                  <span className="w-1 h-1 rounded-full bg-brand-mist/40" />
                  <span className="w-1 h-1 rounded-full bg-brand-mist/40" />
                </div>
              )}

              {turn.error && (
                <div className="pl-8 text-[12px] text-rose-400">{turn.error}</div>
              )}

              {turn.answer && !turn.loading && (
                <div className="pl-8 space-y-3">
                  {/* Data status pill */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-400/70 shrink-0">EFM</span>
                    <span className={`text-[9px] font-mono border rounded px-1.5 py-0.5 ${DATA_STATUS_STYLE[turn.answer.data_status] || 'text-brand-mist/40'} border-current/20 bg-current/5`}>
                      {turn.answer.data_status}
                    </span>
                  </div>

                  {/* Direct answer */}
                  <p className="text-[13px] text-brand-mist/90 leading-relaxed">{turn.answer.direct_answer}</p>

                  {/* Key drivers */}
                  {turn.answer.key_drivers.length > 0 && (
                    <ul className="space-y-1">
                      {turn.answer.key_drivers.map((d, j) => (
                        <li key={j} className="flex gap-2 text-[11.5px] text-brand-mist/65">
                          <span className="text-brand-mist/30 shrink-0 mt-0.5">·</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Fact vs interpretation breakdown */}
                  {turn.answer.fact_vs_interpretation.facts.length > 0 && (
                    <div className="rounded border border-brand-edge-dark/30 bg-brand-void/10 p-3 space-y-1.5">
                      <div className="text-[9px] font-mono text-brand-mist/30 uppercase">Facts</div>
                      {turn.answer.fact_vs_interpretation.facts.map((f, j) => (
                        <div key={j} className="text-[11px] text-brand-mist/60 flex gap-2">
                          <span className="text-brand-mist/25 shrink-0">FACT</span>
                          <span>{f}</span>
                        </div>
                      ))}
                      {turn.answer.fact_vs_interpretation.calculations.map((c, j) => (
                        <div key={j} className="text-[11px] text-sky-400/60 flex gap-2">
                          <span className="text-sky-400/30 shrink-0">CALC</span>
                          <span>{c}</span>
                        </div>
                      ))}
                      {turn.answer.fact_vs_interpretation.recommendations.map((r, j) => (
                        <div key={j} className="text-[11px] text-amber-400/60 flex gap-2">
                          <span className="text-amber-400/30 shrink-0">REC</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Possible actions */}
                  {turn.answer.possible_actions && turn.answer.possible_actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {turn.answer.possible_actions.filter(a => a.type !== 'RESTRICTED').map((action, j) => (
                        action.href ? (
                          <a key={j} href={action.href}
                            className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-orange/70 hover:text-brand-orange border border-brand-orange/20 hover:border-brand-orange/40 rounded px-2 py-1 transition-colors">
                            {action.label} →
                          </a>
                        ) : null
                      ))}
                    </div>
                  )}

                  {/* Evidence drawer */}
                  <EvidenceDrawer
                    evidence={turn.answer.evidence}
                    toolRuns={turn.answer.tool_runs}
                    computedAt={turn.answer.computed_at}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Suggestion chips — show when no turns yet */}
      {turns.length === 0 && (
        <div className="p-5">
          <div className="text-[11px] text-brand-mist/35 mb-3">
            {zeroData
              ? 'No operational data loaded. These questions will return zero counts until data is imported.'
              : 'Suggested questions:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTION_CHIPS.map((chip, i) => (
              <button key={i} onClick={() => ask(chip)}
                className="text-[11.5px] font-mono text-brand-mist/50 hover:text-white border border-brand-edge-dark/40 hover:border-brand-mist/30 rounded px-3 py-1.5 transition-colors text-left">
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-brand-edge-dark/40 p-4 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); }}}
          placeholder="Ask EntireFM anything…"
          className="flex-1 bg-transparent text-[13px] text-white placeholder:text-brand-mist/25 focus:outline-none"
          maxLength={1000}
          autoComplete="off"
        />
        <div className="flex items-center gap-2 shrink-0">
          <ExecutiveBriefModal
            brief={brief}
            onGenerate={handleGenBrief}
            isGenerating={briefLoading}
            canGenerate={canBrief}
          />
          <button
            onClick={() => ask(input)}
            disabled={!input.trim()}
            className="px-4 py-2 rounded bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-[12px] font-mono hover:bg-brand-orange/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
