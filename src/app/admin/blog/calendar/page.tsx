import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';

export const metadata: Metadata = { title: 'Editorial Calendar | Blog | EntireFM Admin' };

export default function EditorialCalendarPage() {
  const posts = Array.from(memoryStore.posts.values());
  const scheduled = posts.filter(p => p.status === 'SCHEDULED' || p.status === 'READY');
  const published = posts.filter(p => p.status === 'PUBLISHED');

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Editorial Calendar</h1>
          <p className="text-sm text-zinc-400 mt-1">Publishing schedule (Target: Tuesday through Friday, 09:00 UK time)</p>
        </div>
        <Link href="/admin/blog/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-normal">
          + New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheduled Queue */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-normal text-blue-400 uppercase tracking-wider">
            Upcoming Publications ({scheduled.length})
          </h2>
          <div className="space-y-3">
            {scheduled.length === 0 && (
              <p className="text-xs text-zinc-500 py-6 text-center">No posts currently scheduled.</p>
            )}
            {scheduled.map(post => (
              <div key={post.id} className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/blog/${post.id}`} className="text-sm font-normal text-white hover:text-blue-400">
                    {post.title}
                  </Link>
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded bg-blue-900/50 text-blue-300">
                    {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{post.category?.name}</span>
                  <span>·</span>
                  <span>{post.author?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Published */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-normal text-emerald-400 uppercase tracking-wider">
            Recently Published ({published.length})
          </h2>
          <div className="space-y-3">
            {published.length === 0 && (
              <p className="text-xs text-zinc-500 py-6 text-center">No posts published yet.</p>
            )}
            {published.map(post => (
              <div key={post.id} className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/blog/${post.id}`} className="text-sm font-normal text-white hover:text-blue-400">
                    {post.title}
                  </Link>
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Live'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{post.category?.name}</span>
                  <span>·</span>
                  <a href={`/post/${post.slug}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    View Live ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
