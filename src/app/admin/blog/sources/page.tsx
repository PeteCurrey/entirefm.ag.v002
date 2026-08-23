import { Metadata } from 'next';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'External Sources | Blog | EntireFM Admin' };

export default function SourcesPage() {
  const sources = memoryStore.sources;

  const trustBadge = (trust: string) => {
    if (trust === 'OFFICIAL_GOV') return 'bg-emerald-900/40 text-emerald-300';
    if (trust === 'INDUSTRY_STANDARD') return 'bg-blue-900/40 text-blue-300';
    if (trust === 'TRADE_PUBLICATION') return 'bg-purple-900/40 text-purple-300';
    return 'bg-zinc-800 text-zinc-400';
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">External Fact & Citation Sources</h1>
          <p className="text-sm text-zinc-400 mt-1">Whitelisted regulatory bodies, British Standards, and trade authority repositories</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Source / Authority</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Publisher</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Trust Level</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Type</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {sources.map(src => (
              <tr key={src.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{src.name}</div>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400">{src.publisher}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${trustBadge(src.trustLevel)}`}>
                    {src.trustLevel.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-blue-400">{src.sourceType}</td>
                <td className="px-4 py-3">
                  <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
                    Visit ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
