'use client';
import React, { useState, useRef, useCallback } from 'react';
import type { UserSession } from '@/server/identity';
import type { ExecutiveAnswer } from '@/server/ceo-command/types';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ExecutiveBriefModal } from './ExecutiveBriefModal';
import type { ExecutiveBrief } from '@/server/ceo-command/executive-brief';
import { ArrowRight, Sparkles, Send } from 'lucide-react';
import { StatusDot } from '@/components/admin/DataTable';

const SUGGESTION_CHIPS = [
  'What changed today across the estate?',
  'What is our current gross commercial margin?',
  'Which sites have active compliance exceptions?',
  'What PPM planned services are due this month?',
  'Which contractors are underperforming against SLA?',
  'Show unbilled WIP and revenue leakage',
  'What decisions require executive approval?',
];

const DATA_STATUS_STYLE: Record<string, string> = {
  LIVE: 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]',
  STALE: 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]',
  NO_DATA: 'text-[#6D6D68] bg-[#FAFAF8] border-[#E8E8E5]',
  NOT_CONFIGURED: 'text-[#1D4ED8] bg-[#EFF6FF] border-[#BFDBFE]',
  RESTRICTED: 'text-[#B91C1C] bg-[#FEF2F2] border-[#FECACA]',
  ZERO: 'text-[#6D6D68] bg-[#FAFAF8] border-[#E8E8E5]',
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
      setTurns(prev => prev.map((t, i) => i === turnIndex ? { ...t, loading: false, error: 'Network communication error' } : t));
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
    <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] shadow-xs overflow-hidden">
      {/* Conversation History */}
      {turns.length > 0 && (
        <div className="border-b border-[#E8E8E5] divide-y divide-[#E8E8E5] max-h-[600px] overflow-y-auto">
          {turns.map((turn, i) => (
            <div key={i} className="p-5 space-y-3">
              {/* Question */}
              <div className="flex items-start gap-3">
                <span className="text-[10px] text-[#EA580C] pt-0.5 shrink-0 uppercase tracking-wider font-medium">YOU</span>
                <span className="text-[13.5px] text-[#111111] font-normal">{turn.question}</span>
              </div>

              {/* Loading State */}
              {turn.loading && (
                <div className="flex items-center gap-2 pl-8 text-[12px] font-normal text-[#9A9A95] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                  <span>Computing deterministic enterprise brief…</span>
                </div>
              )}

              {/* Error State */}
              {turn.error && (
                <div className="pl-8 text-[12px] text-[#B91C1C] font-normal">{turn.error}</div>
              )}

              {/* Answer Payload */}
              {turn.answer && !turn.loading && (
                <div className="pl-8 space-y-3">
                  {/* Status header */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#111111] font-medium shrink-0">ENTIRECAFM INTELLIGENCE</span>
                    <span className={`text-[9.5px] font-normal border rounded-[3px] px-1.5 py-0.2${DATA_STATUS_STYLE[turn.answer.data_status] || 'text-[#6D6D68]'}`}>
                      {turn.answer.data_status}
                    </span>
                  </div>

                  {/* Direct Answer */}
                  <p className="text-[13.5px] text-[#111111] leading-relaxed font-light">{turn.answer.direct_answer}</p>

                  {/* Key Drivers */}
                  {turn.answer.key_drivers.length > 0 && (
                    <ul className="space-y-1">
                      {turn.answer.key_drivers.map((d, j) => (
                        <li key={j} className="flex gap-2 text-[12px] text-[#6D6D68]">
                          <span className="text-[#EA580C] shrink-0">·</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Fact vs Interpretation Breakdown */}
                  {turn.answer.fact_vs_interpretation.facts.length > 0 && (
                    <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-3.5 space-y-2">
                      <div className="text-[10px] font-medium text-[#6D6D68] uppercase tracking-wider">Deterministic Evidence Ledger</div>
                      {turn.answer.fact_vs_interpretation.facts.map((f, j) => (
                        <div key={j} className="text-[11.5px] text-[#111111] flex gap-2">
                          <span className="font-normal text-[9.5px] text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-1 py-0.2 rounded shrink-0">FACT</span>
                          <span>{f}</span>
                        </div>
                      ))}
                      {turn.answer.fact_vs_interpretation.calculations.map((c, j) => (
                        <div key={j} className="text-[11.5px] text-[#111111] flex gap-2">
                          <span className="font-normal text-[9.5px] text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-1 py-0.2 rounded shrink-0">CALC</span>
                          <span>{c}</span>
                        </div>
                      ))}
                      {turn.answer.fact_vs_interpretation.recommendations.map((r, j) => (
                        <div key={j} className="text-[11.5px] text-[#111111] flex gap-2">
                          <span className="font-normal text-[9.5px] text-[#EA580C] bg-[#FFF7ED] border border-[#FED7AA] px-1 py-0.2 rounded shrink-0">REC</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {turn.answer.possible_actions && turn.answer.possible_actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {turn.answer.possible_actions.filter(a => a.type !== 'RESTRICTED').map((action, j) => (
                        action.href ? (
                          <a
                            key={j}
                            href={action.href}
                            className="inline-flex items-center gap-1 text-[11.5px] font-normal text-[#EA580C] hover:text-[#C2410C] hover:underline"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        ) : null
                      ))}
                    </div>
                  )}

                  {/* Evidence Drawer */}
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

      {/* Suggested question chips */}
      {turns.length === 0 && (
        <div className="p-5 space-y-3">
          <div className="text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider">
            {zeroData
              ? 'Operational data not yet connected — suggested queries:'
              : 'Suggested executive queries:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTION_CHIPS.map((chip, i) => (
              <button
                key={i}
                onClick={() => ask(chip)}
                className="text-[12px] font-normal text-[#111111] hover:text-[#EA580C] bg-[#FAFAF8] hover:bg-[#FFFFFF] border border-[#E8E8E5] hover:border-[#D4D4D0] rounded-[6px] px-3 py-1.5 transition-all text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-[#E8E8E5] p-3.5 bg-[#FFFFFF] flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input); }}}
          placeholder="Ask EntireFM anything regarding estate operations, compliance, WIP, or assets…"
          className="flex-1 bg-transparent text-[13px] text-[#111111] placeholder-[#9A9A95] focus:outline-none px-2"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#EA580C] text-white text-[12px] font-normal hover:bg-[#C2410C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Ask</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

