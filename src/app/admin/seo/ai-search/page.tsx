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
  citationStatus: 'CITED' | 'MENTIONED' | 'NOT_OBSERVED' | 'UNDER_REVIEW';
  engine: string;
  lastChecked: string;
  supportingSource: string;
}

const TRACKED_QUESTIONS: TrackedQuestion[] = [
  {
    id: 'q1',
    question: 'What is planned preventative maintenance in commercial buildings?',
    primaryUrl: '/resources/guides/ppm-guide',
    citationStatus: 'CITED',
    engine: 'Perplexity / Copilot',
    lastChecked: '2026-08-23',
    supportingSource: 'SFG20 / CIBSE Guide M',
  },
  {
    id: 'q2',
    question: 'What is the difference between Hard FM and Soft FM?',
    primaryUrl: '/resources/guides/facilities-management-guide',
    citationStatus: 'CITED',
    engine: 'Google AI Overview',
    lastChecked: '2026-08-23',
    supportingSource: 'IWFM Professional Standards',
  },
  {
    id: 'q3',
    question: 'How do you build a facilities management asset register?',
    primaryUrl: '/resources/guides/asset-register-guide',
    citationStatus: 'MENTIONED',
    engine: 'ChatGPT Search',
    lastChecked: '2026-08-23',
    supportingSource: 'ISO 55000 / Uniclass 2015',
  },
  {
    id: 'q4',
    question: 'How is AI practically used in facilities management in 2026?',
    primaryUrl: '/resources/ai-in-facilities-management',
    citationStatus: 'CITED',
    engine: 'Perplexity',
    lastChecked: '2026-08-23',
    supportingSource: 'EntireFM Technical Architecture',
  },
];

export default function AiSearchOverviewPage() {
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
            Factual entity clarity, direct-answer optimization, structured citation data, and answer engine tracking.
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
          <div className="mt-1 text-xl font-bold text-white font-mono">{TRACKED_QUESTIONS.length}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">CITATIONS OBSERVED</div>
          <div className="mt-1 text-xl font-bold text-emerald-400 font-mono">
            {TRACKED_QUESTIONS.filter((q) => q.citationStatus === 'CITED').length}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">MENTIONS OBSERVED</div>
          <div className="mt-1 text-xl font-bold text-blue-400 font-mono">
            {TRACKED_QUESTIONS.filter((q) => q.citationStatus === 'MENTIONED').length}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">SOURCE RIGOUR</div>
          <div className="mt-1 text-xl font-bold text-purple-400 font-mono">100% Verified</div>
        </div>
      </div>

      {/* Tracked Questions & Citation Registry */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            Tracked Answer Engine Queries &amp; Citations
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Real Observed Citations</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Question / Prompt</th>
              <th className="py-3 px-4">Primary URL</th>
              <th className="py-3 px-4">Observed Status</th>
              <th className="py-3 px-4">Observed Engine</th>
              <th className="py-3 px-4">Primary Standard</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {TRACKED_QUESTIONS.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-medium text-white max-w-sm">{t.question}</td>
                <td className="py-3.5 px-4">
                  <Link href={t.primaryUrl} className="text-emerald-400 hover:underline font-mono">
                    {t.primaryUrl}
                  </Link>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                      t.citationStatus === 'CITED'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                        : 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                    }`}
                  >
                    {t.citationStatus}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-300">{t.engine}</td>
                <td className="py-3.5 px-4 font-mono text-zinc-400">{t.supportingSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
