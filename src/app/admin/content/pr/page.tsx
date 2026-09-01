import { Metadata } from 'next';
import Link from 'next/link';
import { getPrDashboardMetrics, listPrCampaigns, listMediaTargets } from '@/server/content/pr';
import {
  Megaphone,
  Share2,
  Newspaper,
  Target,
  Sparkles,
  Link2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Digital PR & Industry Authority | EntireFM Admin' };

export default async function DigitalPrOverviewPage() {
  const metrics = await getPrDashboardMetrics();
  const campaigns = await listPrCampaigns();
  const mediaTargets = await listMediaTargets();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-light">
            ENTIREFM DIGITAL PR, LINK EARNING &amp; INDUSTRY AUTHORITY
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Digital PR &amp; Media Promotion</h1>
          <p className="text-sm text-zinc-400">
            Turn evergreen guides, research data, and interactive FM tools into earned editorial links and journalist citations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/media"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Newspaper className="h-3.5 w-3.5" /> Public Media Centre
          </Link>
          <Link
            href="/admin/content/pr/campaigns"
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-light px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Megaphone className="h-3.5 w-3.5" /> PR Campaigns
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">ACTIVE CAMPAIGNS</div>
          <div className="mt-1 text-xl font-light text-emerald-400">{metrics.activeCampaignsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">MEDIA TARGETS</div>
          <div className="mt-1 text-xl font-light text-white">{metrics.mediaTargetsCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">COMMENTARY QUEUE</div>
          <div className="mt-1 text-xl font-light text-amber-400">{metrics.pendingCommentariesCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">EARNED COVERAGE</div>
          <div className="mt-1 text-xl font-light text-blue-400">{metrics.earnedCoverageCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">BACKLINKS EARNED</div>
          <div className="mt-1 text-xl font-light text-emerald-400">{metrics.backlinksCount}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">UNLINKED MENTIONS</div>
          <div className="mt-1 text-xl font-light text-purple-400">{metrics.unlinkedMentionsCount}</div>
        </div>
      </div>

      {/* Active PR Campaigns */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Curated PR Campaigns &amp; Linkable Assets
          </h3>
          <span className="text-xs text-zinc-500 font-normal">Human-Reviewed Pitching Only</span>
        </div>

        <div className="divide-y divide-zinc-800">
          {campaigns.map((camp) => (
            <div key={camp.id} className="p-5 hover:bg-zinc-800/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-light">
                    {camp.status}
                  </span>
                  <Link href={camp.primary_asset_url} className="text-xs text-emerald-400 hover:underline font-normal">
                    {camp.primary_asset_url}
                  </Link>
                </div>
                <h4 className="text-base font-light text-white">{camp.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{camp.story_angle}</p>
                <div className="text-[11px] font-normal text-zinc-500">
                  Target Audience: <span className="text-zinc-300">{camp.target_audience}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors"
                >
                  Review Pitch Draft
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
