import { Metadata } from 'next';
import Link from 'next/link';
import { intelligenceStore } from '@/server/blog/intelligence-store';

export const metadata: Metadata = { title: 'Weekly Editorial Intelligence Brief | EntireFM Admin' };

export default function WeeklyBriefingPage() {
  const brief = intelligenceStore.getWeeklyBriefing();

  const categoryBadge = (cat: string) => {
    const map: Record<string, string> = {
      SEARCH_DEMAND: 'bg-blue-900/40 text-blue-300',
      FM_DEVELOPMENT: 'bg-purple-900/40 text-purple-300',
      EVERGREEN_GUIDE: 'bg-emerald-900/40 text-emerald-300',
      TECH_AI_COMMERCIAL: 'bg-cyan-900/40 text-cyan-300',
      SPECIALIST_SECTOR: 'bg-orange-900/40 text-orange-300',
    };
    return map[cat] || 'bg-zinc-800 text-zinc-400';
  };

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Automated Executive Briefing</span>
          <h1 className="text-2xl font-extralight text-white mt-1">Weekly Editorial Intelligence Brief</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Week Starting: {new Date(brief.weekStarting).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link
          href="/admin/blog/intelligence"
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 border border-zinc-700 rounded-lg"
        >
          ← Intelligence Dashboard
        </Link>
      </div>

      {/* Recommended 3-5 Articles for this Week (The Core Editorial Output) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-sm font-normal text-white uppercase tracking-wider">
            Recommended Editorial Schedule For This Week (Balanced 4-Article Mix)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Combines genuine Search Demand + Regulatory Developments + Evergreen Fundamentals + Technology/CAFM.
          </p>
        </div>

        <div className="space-y-4">
          {brief.recommendedArticlesThisWeek.map((rec, i) => (
            <div key={i} className="bg-zinc-800/50 border border-zinc-700/60 rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-normal">#{i + 1}</span>
                    <h3 className="text-sm font-normal text-white">{rec.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-normal${categoryBadge(rec.mixCategory)}`}>
                      {rec.mixCategory.replace(/_/g, ' ')}
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-zinc-400">Target Intent: <code className="text-zinc-300">{rec.targetIntent}</code></span>
                  </div>
                </div>
                <button className="shrink-0 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-normal">
                  Approve for Draft →
                </button>
              </div>

              <p className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
                Rationale: {rec.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pages Requiring Update / Refresh */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-normal text-zinc-300 uppercase tracking-wider">
          Existing Pages Requiring Technical Update ({brief.pagesToUpdate.length})
        </h2>
        <div className="space-y-3">
          {brief.pagesToUpdate.map((page, i) => (
            <div key={i} className="bg-zinc-800/40 p-4 rounded-xl border border-zinc-700/50 flex items-center justify-between">
              <div>
                <code className="text-xs text-blue-400 font-light">{page.pagePath}</code>
                <p className="text-xs text-zinc-400 mt-1">{page.reason}</p>
              </div>
              <Link href={`/admin/blog/posts`} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg">
                Create Refresh Job →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
