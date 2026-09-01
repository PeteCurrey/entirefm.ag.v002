import { Metadata } from 'next';
import Link from 'next/link';
import { listSubscribers } from '@/server/newsletter/store';
import { TrendingUp, Users, MapPin, Globe, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Audience & Growth | EntireFM Admin' };

export default async function AudienceGrowthPage() {
  const { subscribers } = await listSubscribers({ limit: 500 });

  // Compute source distribution
  const sourceMap: Record<string, number> = {};
  for (const s of subscribers) {
    const src = s.signupPage || 'Direct';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  }

  const sources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extralight text-white">Audience Growth &amp; Attribution</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track subscriber acquisition sources, conversion entry points, and list health without synthetic metrics.
          </p>
        </div>
        <Link
          href="/admin/newsletter"
          className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Attribution Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Subscriber Acquisition Sources
          </h3>
          <p className="text-xs text-zinc-400">
            Understand what content and landing pages are driving newsletter subscribers.
          </p>

          {sources.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No subscriber acquisition data recorded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {sources.map(([src, count]) => (
                <div
                  key={src}
                  className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs"
                >
                  <span className="font-normal text-zinc-300">{src}</span>
                  <span className="font-light text-pink-400">{count} subscribers</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead Separation Governance */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Audience Governance &amp; Separation
          </h3>
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
              <h4 className="font-light text-white mb-1">Strict Consent Separation</h4>
              <p className="text-zinc-400">
                Contact and quote enquiries submitted via EntireFM RFQ forms are never automatically subscribed to marketing broadcasts.
              </p>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
              <h4 className="font-light text-white mb-1">Permanent Suppression Registry</h4>
              <p className="text-zinc-400">
                Unsubscribed emails remain permanently recorded in the suppression table, preventing accidental re-import via CSV.
              </p>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
              <h4 className="font-light text-white mb-1">UTM Multi-Touch Attribution</h4>
              <p className="text-zinc-400">
                Links dispatched across The FM Briefing automatically include campaign and content UTM tags for Search Console and analytics tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
