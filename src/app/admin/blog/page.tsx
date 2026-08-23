import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Editorial Dashboard | Blog | EntireFM Admin' };

const statusBadge = (s: string) => {
  const m: Record<string, string> = {
    PUBLISHED: 'bg-emerald-900/40 text-emerald-300',
    SCHEDULED: 'bg-blue-900/40 text-blue-300',
    DRAFT: 'bg-zinc-800 text-zinc-300',
    AI_DRAFT: 'bg-purple-900/40 text-purple-300',
    NEEDS_REVIEW: 'bg-orange-900/40 text-orange-300',
    READY: 'bg-cyan-900/40 text-cyan-300',
    ARCHIVED: 'bg-zinc-900 text-zinc-500',
  };
  return m[s] || 'bg-zinc-800 text-zinc-400';
};

export default function BlogDashboard() {
  const posts = Array.from(memoryStore.posts.values());
  const published = posts.filter((p) => p.status === 'PUBLISHED');
  const scheduled = posts.filter((p) => p.status === 'SCHEDULED');
  const drafts = posts.filter((p) => p.status === 'DRAFT' || p.status === 'AI_DRAFT');
  const needsReview = posts.filter((p) => p.status === 'NEEDS_REVIEW' || p.status === 'READY');
  const topics = memoryStore.topics.filter((t) => t.status === 'OPPORTUNITY');
  const nextSched = [...scheduled]
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())[0];

  const stats = [
    { label: 'Published', value: published.length, href: '/admin/blog/posts?status=PUBLISHED', colour: 'text-emerald-400' },
    { label: 'Scheduled', value: scheduled.length, href: '/admin/blog/posts?status=SCHEDULED', colour: 'text-blue-400' },
    { label: 'Drafts', value: drafts.length, href: '/admin/blog/posts?status=DRAFT', colour: 'text-yellow-400' },
    { label: 'Needs Review', value: needsReview.length, href: '/admin/blog/ai-queue', colour: 'text-orange-400' },
    { label: 'Topic Opps', value: topics.length, href: '/admin/blog/topics', colour: 'text-purple-400' },
  ];

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editorial Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Blog &amp; Insights — target 3–5 high-quality FM articles per week
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Post
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
          >
            <div className={`text-3xl font-bold ${s.colour}`}>{s.value}</div>
            <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Pipeline Visualiser */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
          Publication Pipeline
        </h2>
        <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
          <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full">
            Topics ({topics.length})
          </span>
          <span className="text-zinc-600">→</span>
          <span className="px-3 py-1 bg-yellow-900/30 text-yellow-300 rounded-full">
            Drafts ({drafts.length})
          </span>
          <span className="text-zinc-600">→</span>
          <span className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full">
            Review ({needsReview.length})
          </span>
          <span className="text-zinc-600">→</span>
          <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full">
            Scheduled ({scheduled.length})
          </span>
          <span className="text-zinc-600">→</span>
          <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 rounded-full">
            Published ({published.length})
          </span>
        </div>
        {nextSched && (
          <p className="text-xs text-zinc-500 mt-3">
            Next publication:{' '}
            <span className="text-blue-400">&ldquo;{nextSched.title}&rdquo;</span> ·{' '}
            {nextSched.scheduledAt
              ? new Date(nextSched.scheduledAt).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date not set'}
          </p>
        )}
      </div>

      {/* Automation Health */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
            Automation Health
          </h2>
          <Link href="/admin/blog/automation" className="text-xs text-blue-400 hover:text-blue-300">
            Settings →
          </Link>
        </div>
        <div className="flex gap-6 text-xs flex-wrap">
          <div
            className={`flex items-center gap-2 ${
              memoryStore.settings.automationEnabled ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                memoryStore.settings.automationEnabled ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            />
            Automation {memoryStore.settings.automationEnabled ? 'Enabled' : 'Disabled'}
          </div>
          <div
            className={`flex items-center gap-2 ${
              memoryStore.settings.emergencyHold ? 'text-red-400' : 'text-zinc-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                memoryStore.settings.emergencyHold ? 'bg-red-400' : 'bg-zinc-600'
              }`}
            />
            Emergency Hold {memoryStore.settings.emergencyHold ? 'ACTIVE' : 'Off'}
          </div>
          <div className="text-zinc-400">
            Target: {memoryStore.settings.minPostsPerWeek}–
            {memoryStore.settings.targetPostsPerWeek} posts/week
          </div>
        </div>
        {memoryStore.settings.emergencyHold && (
          <div className="mt-3 text-xs text-red-400 bg-red-950/30 border border-red-800/40 rounded-lg px-3 py-2">
            ⚠️ EMERGENCY_HOLD is active. All automated publishing actions are paused.
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
            Recent Posts
          </h2>
          <Link href="/admin/blog/posts" className="text-xs text-blue-400 hover:text-blue-300">
            All posts →
          </Link>
        </div>
        <div className="divide-y divide-zinc-800">
          {recentPosts.length === 0 && (
            <p className="text-sm text-zinc-500 py-4">No posts yet. Create your first post.</p>
          )}
          {recentPosts.map((post) => (
            <div key={post.id} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="text-sm text-white hover:text-blue-400 font-medium truncate block"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-zinc-500">{post.author?.name}</span>
                  <span className="text-xs text-zinc-600">{post.category?.name}</span>
                  <span className="text-xs text-zinc-600">
                    {new Date(post.updatedAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${statusBadge(post.status)}`}>
                {post.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New Post', href: '/admin/blog/new', icon: '✏️' },
          { label: 'Discover Topics', href: '/admin/blog/topics', icon: '🔍' },
          { label: 'Review AI Queue', href: '/admin/blog/ai-queue', icon: '🤖' },
          { label: 'SEO Audit', href: '/admin/blog/seo', icon: '📊' },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-colors"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs text-zinc-300 font-medium">{a.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
