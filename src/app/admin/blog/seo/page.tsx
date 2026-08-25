import { Metadata } from 'next';
import Link from 'next/link';
import { memoryStore } from '@/server/blog/store';
import { analyzePostSeo } from '@/server/blog/seo';

export const metadata: Metadata = { title: 'SEO Health | Blog | EntireFM Admin' };

export default function BlogSeoPage() {
  const posts = Array.from(memoryStore.posts.values())
    .filter(p => p.status !== 'ARCHIVED')
    .sort((a, b) => (a.seoScore || 0) - (b.seoScore || 0));

  const riskColour = (r: string) => {
    if (r === 'HIGH') return 'text-red-400';
    if (r === 'MEDIUM') return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extralight text-white">SEO Health Audit</h1>
        <p className="text-sm text-zinc-400 mt-1">Anti-cannibalisation and SEO quality check across all blog posts</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Post</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">SEO Score</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Cannibalisation</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Fact Check</th>
              <th className="text-left text-xs text-zinc-500 px-4 py-3 font-normal">Issues</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {posts.length === 0 && (
              <tr><td colSpan={6} className="text-center text-zinc-500 py-10">No posts yet.</td></tr>
            )}
            {posts.map(post => {
              const analysis = analyzePostSeo(post, posts.filter(p => p.id !== post.id));
              return (
                <tr key={post.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    <div className="text-sm text-white font-normal truncate max-w-xs">{post.title}</div>
                    <div className="text-xs text-zinc-500">/post/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            analysis.seoScore >= 80 ? 'bg-emerald-500' :
                            analysis.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${analysis.seoScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">{analysis.seoScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-normal ${riskColour(analysis.cannibalisationRisk)}`}>
                      {analysis.cannibalisationRisk}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${
                      post.factCheckStatus === 'PASSED' ? 'text-emerald-400' :
                      post.factCheckStatus === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {post.factCheckStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {analysis.warnings.length > 0 && (
                      <span className="text-xs text-orange-400">{analysis.warnings.length} warning{analysis.warnings.length !== 1 ? 's' : ''}</span>
                    )}
                    {analysis.warnings.length === 0 && <span className="text-xs text-emerald-400">✓ Clean</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post.id}`} className="text-xs text-blue-400 hover:text-blue-300">Edit →</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
