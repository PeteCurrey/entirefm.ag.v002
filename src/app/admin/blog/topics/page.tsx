import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Topic Opportunities | Blog | EntireFM Admin' };

export default function TopicsPage() {
  const topics = [...memoryStore.topics].sort((a, b) => b.overallScore - a.overallScore);
  const riskColour = (r: string) => {
    if (r === 'HIGH') return 'text-red-400';
    if (r === 'MEDIUM') return 'text-yellow-400';
    if (r === 'LOW') return 'text-blue-400';
    return 'text-emerald-400';
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Topic Opportunities</h1>
          <p className="text-sm text-zinc-400 mt-1">Scored and collision-checked FM editorial topics ready for drafting</p>
        </div>
        <form action="/api/admin/blog/topics" method="POST">
          <input type="hidden" name="_action" value="DISCOVER" />
          <button type="submit" className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-normal">
            🔍 Discover New Topics
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {topics.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
            No topics discovered yet. Click &ldquo;Discover New Topics&rdquo; to start.
          </div>
        )}
        {topics.map(topic => (
          <div key={topic.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-normal text-white">{topic.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-zinc-500">{topic.topicTheme}</span>
                  <span className="text-xs text-zinc-600">·</span>
                  <span className="text-xs text-zinc-500">{topic.categoryName}</span>
                  <span className="text-xs text-zinc-600">·</span>
                  <span className="text-xs font-normal text-blue-400">Score: {topic.overallScore}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full bg-zinc-800 ${riskColour(topic.collisionStatus)}`}>
                  {topic.collisionStatus.replace('_', ' ')}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  topic.status === 'OPPORTUNITY' ? 'bg-purple-900/40 text-purple-300' :
                  topic.status === 'APPROVED' ? 'bg-emerald-900/40 text-emerald-300' :
                  topic.status === 'GENERATED' ? 'bg-blue-900/40 text-blue-300' :
                  topic.status === 'REJECTED' ? 'bg-red-900/40 text-red-300' :
                  'bg-zinc-800 text-zinc-400'
                }`}>{topic.status}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400">{topic.whyNow}</p>
            <div className="text-xs text-zinc-500">
              <span className="text-zinc-600">Commercial relevance:</span> {topic.commercialRelevance}
            </div>
            {topic.collisionStatus !== 'NO_COLLISION' && topic.collidingUrl && (
              <div className="text-xs text-yellow-400 bg-yellow-950/20 border border-yellow-800/30 rounded px-3 py-2">
                ⚠️ Keyword overlap with existing route: <code className="text-yellow-300">{topic.collidingUrl}</code>. Angle must be clearly distinct.
              </div>
            )}
            {(topic.status === 'OPPORTUNITY' || topic.status === 'APPROVED') && (
              <div className="flex gap-2 pt-1">
                <button className="text-xs bg-emerald-800/40 text-emerald-300 hover:bg-emerald-700/40 px-3 py-1.5 rounded-lg">
                  ✓ Approve
                </button>
                <button className="text-xs bg-blue-800/40 text-blue-300 hover:bg-blue-700/40 px-3 py-1.5 rounded-lg">
                  ✏️ Generate Draft
                </button>
                <button className="text-xs bg-zinc-800 text-zinc-400 hover:bg-zinc-700 px-3 py-1.5 rounded-lg">
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
