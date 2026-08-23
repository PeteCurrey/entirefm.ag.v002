import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'AI Draft Queue | Blog | EntireFM Admin' };

export default function AiQueuePage() {
  const posts = Array.from(memoryStore.posts.values())
    .filter(p => p.status === 'AI_DRAFT' || p.status === 'NEEDS_REVIEW' || p.status === 'READY')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const statusBadge = (s: string) => {
    if (s === 'READY') return 'bg-cyan-900/40 text-cyan-300';
    if (s === 'NEEDS_REVIEW') return 'bg-orange-900/40 text-orange-300';
    return 'bg-purple-900/40 text-purple-300';
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Draft Queue</h1>
        <p className="text-sm text-zinc-400 mt-1">AI-generated drafts awaiting editorial review before scheduling</p>
      </div>

      {posts.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <p className="text-zinc-400 mb-4">No AI drafts pending review.</p>
          <Link href="/admin/blog/topics" className="text-sm text-blue-400 hover:text-blue-300">Discover & generate topics →</Link>
        </div>
      )}

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link href={`/admin/blog/${post.id}`} className="text-sm font-semibold text-white hover:text-blue-400">
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span>{post.category?.name}</span>
                  <span>·</span>
                  <span>SEO score: <span className="text-blue-400">{post.seoScore}</span></span>
                  <span>·</span>
                  <span>Fact check: <span className={post.factCheckStatus === 'PASSED' ? 'text-emerald-400' : post.factCheckStatus === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'}>{post.factCheckStatus}</span></span>
                </div>
              </div>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${statusBadge(post.status)}`}>
                {post.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-3 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-2 mt-4">
              <Link href={`/admin/blog/${post.id}`} className="text-xs bg-blue-700/40 text-blue-300 hover:bg-blue-600/40 px-3 py-1.5 rounded-lg">
                Review & Edit
              </Link>
              <button className="text-xs bg-emerald-800/40 text-emerald-300 hover:bg-emerald-700/40 px-3 py-1.5 rounded-lg">
                Approve & Schedule
              </button>
              <button className="text-xs bg-red-900/30 text-red-400 hover:bg-red-900/50 px-3 py-1.5 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
