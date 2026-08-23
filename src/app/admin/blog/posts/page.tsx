import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'All Posts | Blog | EntireFM Admin' };

const STATUS_OPTS = ['ALL', 'PUBLISHED', 'SCHEDULED', 'READY', 'NEEDS_REVIEW', 'DRAFT', 'AI_DRAFT', 'ARCHIVED'];

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

export default async function AllPostsPage({ searchParams }: { searchParams: Promise<{ status?: string; search?: string }> }) {
  const { status, search } = await searchParams;
  let posts = Array.from(memoryStore.posts.values());
  if (status && status !== 'ALL') {
    posts = posts.filter(p => p.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter(p => p.title.toLowerCase().includes(q) || p.slug.includes(q));
  }
  posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">All Posts</h1>
        <Link href="/admin/blog/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTS.map(s => (
          <Link
            key={s}
            href={`/admin/blog/posts${s !== 'ALL' ? `?status=${s}` : ''}`}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              (status === s || (!status && s === 'ALL'))
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Title</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Author</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Category</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">SEO</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Status</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-medium">Updated</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {posts.length === 0 && (
              <tr><td colSpan={7} className="text-center text-zinc-500 py-12">No posts found.</td></tr>
            )}
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-white truncate max-w-sm">{post.title}</div>
                  <div className="text-xs text-zinc-500">/post/{post.slug}</div>
                </td>
                <td className="px-4 py-3 text-zinc-400 text-xs">{post.author?.name || '—'}</td>
                <td className="px-4 py-3 text-zinc-400 text-xs">{post.category?.name || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${post.seoScore || 0}%` }} />
                    </div>
                    <span className="text-xs text-zinc-500">{post.seoScore || 0}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(post.status)}`}>
                    {post.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {new Date(post.updatedAt).toLocaleDateString('en-GB')}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${post.id}`} className="text-xs text-blue-400 hover:text-blue-300">Edit →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-600">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
    </main>
  );
}
