import { Metadata } from 'next';
import Link from 'next/link';
import { intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Cannibalisation Monitor | EntireFM Admin' };

export default function CannibalisationPage() {
  const reports = intelligenceStore.getCannibalisationReport();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Query &amp; Intent Cannibalisation Monitor</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Distinguishing intentional multi-page clusters (e.g. regional variations) from accidental content conflict
          </p>
        </div>
        <Link
          href="/admin/blog/intelligence"
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
        >
          ← Intelligence Overview
        </Link>
      </div>

      <div className="space-y-4">
        {reports.map((item, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-normal text-white">&ldquo;{item.query}&rdquo;</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono">
                  {item.type.replace(/_/g, ' ')}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${item.isProblem ? 'bg-red-900/40 text-red-300' : 'bg-emerald-900/40 text-emerald-300'}`}>
                  {item.isProblem ? 'CONFLICT DETECTED' : 'SAFE / INTENTIONAL'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {item.pages.map((p, pIdx) => (
                <div key={pIdx} className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/60 text-xs space-y-1">
                  <div className="text-white font-normal truncate">{p.title}</div>
                  <code className="text-zinc-400 block truncate">{p.path}</code>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              Action: <span className="text-zinc-300">{item.recommendedAction}</span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
