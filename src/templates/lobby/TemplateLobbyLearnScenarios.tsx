'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { LobbySubNav } from '@/components/lobby/LobbySubNav';
import { FM_SCENARIOS } from '@/data/lobby/learn-data';

export function TemplateLobbyLearnScenarios() {
  const [activeScenario, setActiveScenario] = useState<string | null>(FM_SCENARIOS[0]?.id ?? null);
  const [selectedBranch, setSelectedBranch] = useState<Record<string, string>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('immediate');

  const currentScenario = FM_SCENARIOS.find(s => s.id === activeScenario);
  const currentBranchId = activeScenario ? selectedBranch[activeScenario] : null;
  const currentBranch = currentScenario?.branches.find(b => b.id === currentBranchId);

  const CONSIDERATION_LABELS: Record<string, string> = {
    immediate: 'Immediate Action',
    compliance: 'Compliance Considerations',
    operational: 'Operational Considerations',
    communication: 'Communication',
    documentation: 'Documentation',
    lessonsLearned: 'Lessons Learned',
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans">
      <LobbySubNav currentSection="learn" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-light text-neutral-500">
          <Link href="/lobby" className="hover:text-neutral-900 transition-colors">The Lobby</Link>
          <span>/</span>
          <Link href="/lobby/learn" className="hover:text-neutral-900 transition-colors">LEARN</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Scenarios</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 border-b border-neutral-200 pb-10">
          <p className="text-[10px] font-mono uppercase tracking-widest text-brand-electric">THE LOBBY · LEARN · Scenarios</p>
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight">What would you do?</h1>
          <p className="text-sm font-light text-neutral-500 max-w-2xl">
            Realistic FM scenarios to explore decision-making, compliance considerations, and operational best practice. These are educational exercises — not legal assessments.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-2 rounded-[3px]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Educational exercise. Not a legal, compliance, or regulatory assessment.</span>
          </div>
        </div>

        {/* Scenario selector */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48 shrink-0 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Scenarios</p>
            {FM_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => { setActiveScenario(sc.id); setExpandedSection('immediate'); }}
                className={`w-full text-left px-3 py-2.5 rounded-[3px] text-xs transition-colors ${
                  activeScenario === sc.id ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                <span className="font-medium block mb-0.5">{sc.title}</span>
                <span className={`font-mono text-[10px] ${activeScenario === sc.id ? 'text-neutral-400' : 'text-neutral-400'}`}>{sc.level}</span>
              </button>
            ))}
          </div>

          {currentScenario && (
            <div className="flex-1 space-y-6">
              {/* Situation */}
              <div className="bg-white border border-neutral-200 rounded-[4px] p-6 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-[2px]">{currentScenario.topic}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{currentScenario.level}</span>
                </div>
                <h2 className="text-lg font-light text-neutral-900">{currentScenario.title}</h2>
                <p className="text-sm font-light text-neutral-700 leading-relaxed">{currentScenario.situation}</p>
              </div>

              {/* Branch selection */}
              {!currentBranchId && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-neutral-700">What would you do?</p>
                  {currentScenario.branches.map(branch => (
                    <button
                      key={branch.id}
                      onClick={() => setSelectedBranch(prev => ({ ...prev, [currentScenario.id]: branch.id }))}
                      className="w-full text-left p-5 bg-white border border-neutral-200 rounded-[4px] shadow-2xs hover:border-brand-electric hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900 mb-1">{branch.label}</p>
                          <p className="text-xs font-light text-neutral-500">{branch.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Branch outcome */}
              {currentBranch && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-neutral-700">You chose: <span className="text-neutral-900">{currentBranch.label}</span></p>
                    <button
                      onClick={() => setSelectedBranch(prev => { const n = {...prev}; delete n[currentScenario.id]; return n; })}
                      className="text-xs text-neutral-500 hover:text-neutral-900 font-light transition-colors"
                    >
                      ← Choose differently
                    </button>
                  </div>

                  {/* Outcome */}
                  <div className={`p-4 rounded-[3px] border ${currentBranch.id === 'branch-a' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${currentBranch.id === 'branch-a' ? 'text-emerald-600' : 'text-amber-600'}`} />
                      <p className="text-sm font-light leading-relaxed">{currentBranch.outcome}</p>
                    </div>
                  </div>

                  {/* Considerations accordion */}
                  {(Object.keys(CONSIDERATION_LABELS) as Array<keyof typeof currentBranch.considerations>).map(key => {
                    const items = currentBranch.considerations[key];
                    if (!items || items.length === 0) return null;
                    const isOpen = expandedSection === key;
                    return (
                      <div key={key} className="bg-white border border-neutral-200 rounded-[4px] shadow-2xs overflow-hidden">
                        <button
                          onClick={() => setExpandedSection(isOpen ? null : key)}
                          className="w-full flex items-center justify-between p-4 hover:bg-neutral-50/80 transition-colors"
                        >
                          <span className="text-xs font-medium text-neutral-900">{CONSIDERATION_LABELS[key]}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                        </button>
                        {isOpen && (
                          <ul className="px-4 pb-4 space-y-2 border-t border-neutral-100 pt-3">
                            {items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs font-light text-neutral-700 leading-relaxed">
                                <span className="text-[10px] font-mono text-neutral-400 mt-0.5 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}

                  {/* Cross-links */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <Link href="/lobby/check" className="text-xs text-brand-electric hover:underline font-light inline-flex items-center gap-1">
                      Review compliance requirements <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link href="/lobby/connect" className="text-xs text-neutral-600 hover:text-neutral-900 font-light inline-flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Discuss with FM professionals
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-[11px] font-light text-neutral-400 leading-relaxed border-t border-neutral-200 pt-6">
          These scenarios are provided as educational exercises for professional development purposes only. They do not constitute legal advice, regulatory guidance, or a formal training assessment. Real incidents will involve specific facts, circumstances, and professional obligations that these generalised scenarios cannot capture.
        </div>

      </main>
      <Footer />
    </div>
  );
}
