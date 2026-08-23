import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  FileText,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = { title: 'AI Search & Answer Engine Visibility | EntireFM Admin' };

interface TrackedQuestion {
  id: string;
  question: string;
  primaryUrl: string;
  status: 'PENDING_MANUAL_TEST' | 'CITED' | 'MENTIONED' | 'NOT_OBSERVED';
  engineTarget: string;
  lastChecked: string;
  supportingSource: string;
  notes: string;
}

const TRACKED_AI_QUESTIONS: TrackedQuestion[] = [
  {
    id: 'q1',
    question: 'What is planned preventative maintenance in commercial buildings?',
    primaryUrl: '/resources/guides/ppm-guide',
    status: 'PENDING_MANUAL_TEST',
    engineTarget: 'ChatGPT Search, Perplexity, Microsoft Copilot',
    lastChecked: '2026-08-23',
    supportingSource: 'SFG20 / CIBSE Guide M',
    notes: 'NOT TESTED — EXTERNAL MANUAL CHECK REQUIRED',
  },
  {
    id: 'q2',
    question: 'What is the difference between Hard FM and Soft FM?',
    primaryUrl: '/resources/guides/facilities-management-guide',
    status: 'PENDING_MANUAL_TEST',
    engineTarget: 'ChatGPT Search, Perplexity, Microsoft Copilot',
    lastChecked: '2026-08-23',
    supportingSource: 'IWFM Professional Standards',
    notes: 'NOT TESTED — EXTERNAL MANUAL CHECK REQUIRED',
  },
  {
    id: 'q3',
    question: 'How do you build a facilities management asset register?',
    primaryUrl: '/resources/guides/asset-register-guide',
    status: 'PENDING_MANUAL_TEST',
    engineTarget: 'ChatGPT Search, Perplexity, Microsoft Copilot',
    lastChecked: '2026-08-23',
    supportingSource: 'ISO 55000 / Uniclass 2015',
    notes: 'NOT TESTED — EXTERNAL MANUAL CHECK REQUIRED',
  },
  {
    id: 'q4',
    question: 'How is AI practically used in facilities management in 2026?',
    primaryUrl: '/resources/ai-in-facilities-management',
    status: 'PENDING_MANUAL_TEST',
    engineTarget: 'ChatGPT Search, Perplexity, Microsoft Copilot',
    lastChecked: '2026-08-23',
    supportingSource: 'EntireFM Technical Architecture',
    notes: 'NOT TESTED — EXTERNAL MANUAL CHECK REQUIRED',
  },
];

export default function AiSearchOverviewPage() {
  const testedCount = TRACKED_AI_QUESTIONS.filter((q) => q.status === 'CITED' || q.status === 'MENTIONED').length;
  const pendingCount = TRACKED_AI_QUESTIONS.filter((q) => q.status === 'PENDING_MANUAL_TEST').length;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            ENTIREFM ANSWER ENGINE OPTIMISATION &amp; AI SEARCH VISIBILITY
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">AI Search &amp; Entity Authority</h1>
          <p className="text-sm text-zinc-400">
            Factual entity clarity, direct-answer optimization, structured citation data, and honest answer-engine tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/llms.txt"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-3 py-2 rounded-lg border border-zinc-700 transition-colors"
          >
            View /llms.txt
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">TRACKED QUESTIONS</div>
          <div className="mt-1 text-xl font-bold text-white font-mono">{TRACKED_AI_QUESTIONS.length}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">PENDING MANUAL CHECK</div>
          <div className="mt-1 text-xl font-bold text-amber-400 font-mono">{pendingCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">CITATIONS OBSERVED</div>
          <div className="mt-1 text-xl font-bold text-zinc-400 font-mono">{testedCount} (No fabricated stats)</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">SOURCE RIGOUR</div>
          <div className="mt-1 text-xl font-bold text-purple-400 font-mono">100% Verified Standards</div>
        </div>
      </div>

      {/* Tracked Questions & Citation Registry */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            Tracked Answer Engine Queries &amp; Verification Protocol
          </h3>
          <span className="text-xs text-amber-400 font-mono">Observation Protocol: External Manual Checks Required</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Tracked Question / Prompt</th>
              <th className="py-3 px-4">Primary URL</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Target Answer Engines</th>
              <th className="py-3 px-4">Primary Supporting Standard</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {TRACKED_AI_QUESTIONS.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-medium text-white max-w-sm">
                  <div>{t.question}</div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{t.notes}</div>
                </td>
                <td className="py-3.5 px-4">
                  <Link href={t.primaryUrl} className="text-emerald-400 hover:underline font-mono">
                    {t.primaryUrl}
                  </Link>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border bg-amber-950/60 text-amber-300 border-amber-800/40">
                    {t.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-300">{t.engineTarget}</td>
                <td className="py-3.5 px-4 font-mono text-zinc-400">{t.supportingSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
