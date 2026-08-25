import { Metadata } from 'next';
import Link from 'next/link';
import { listSubscribers, listCampaigns, getAutomationSettings } from '@/server/newsletter/store';
import { getDomainAuthStatus } from '@/server/newsletter/provider';
import {
  Mail,
  Users,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Newsletter & Audience Dashboard | EntireFM Admin' };

export default async function NewsletterDashboardPage() {
  const { subscribers } = await listSubscribers({ limit: 500 });
  const campaigns = await listCampaigns();
  const automation = await getAutomationSettings();
  const domainAuth = getDomainAuthStatus();

  const activeSubscribers = subscribers.filter((s) => s.status === 'ACTIVE').length;
  const unsubscribedCount = subscribers.filter((s) => s.status === 'UNSUBSCRIBED').length;
  const draftCampaigns = campaigns.filter((c) => c.status === 'DRAFT');
  const sentCampaigns = campaigns.filter((c) => c.status === 'SENT');
  const lastCampaign = sentCampaigns[0] || null;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 font-light">
            AUDIENCE &amp; CONTENT DISTRIBUTION
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">The FM Briefing Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Real-time subscriber management, automated weekly briefing drafting, and multi-channel distribution.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/newsletter/new"
            className="text-xs bg-pink-600 hover:bg-pink-500 text-white font-light px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Mail className="h-3.5 w-3.5" /> Compose Campaign
          </Link>
          <Link
            href="/admin/newsletter/automation"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors"
          >
            Automation Controls
          </Link>
        </div>
      </div>

      {/* Domain & Delivery Status Banner */}
      {!domainAuth.canSend && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-light text-amber-300">EMAIL DELIVERY ADAPTER: OFFLINE MOCK MODE</h4>
            <p className="text-amber-200/80 leading-relaxed">
              {domainAuth.statusMessage}. All test sends and automation drafts will be captured in the database and logged to the console without sending live network emails.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Active Subscribers</span>
            <Users className="h-4 w-4 text-pink-400" />
          </div>
          <div className="mt-2 text-2xl font-extralight text-white font-mono">{activeSubscribers}</div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {unsubscribedCount > 0 ? `${unsubscribedCount} unsubscribed` : 'Zero spam complaints'}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Draft Briefings</span>
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-extralight text-white font-mono">{draftCampaigns.length}</div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {draftCampaigns.length > 0 ? 'Ready for editorial review' : 'No pending drafts'}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Weekly Automation</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-sm font-normal text-white">
            {automation.killSwitchPaused ? (
              <span className="text-red-400">KILL-SWITCH ACTIVE</span>
            ) : automation.autoDraftEnabled ? (
              <span className="text-emerald-400">AUTO-DRAFT ACTIVE</span>
            ) : (
              <span className="text-zinc-400">MANUAL ONLY</span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">Tuesdays @ 08:00 UTC</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Domain Auth (SPF/DKIM)</span>
            <ShieldCheck className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-sm font-normal text-white">
            {domainAuth.canSend ? (
              <span className="text-emerald-400">VERIFIED</span>
            ) : (
              <span className="text-amber-400">DEV MOCK</span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">{domainAuth.domain}</div>
        </div>
      </div>

      {/* Main Grid: Pending Review & Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drafts & Campaigns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Drafts Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
                Pending Editorial Review ({draftCampaigns.length})
              </h3>
              <Link
                href="/admin/newsletter/campaigns"
                className="text-xs text-pink-400 hover:text-pink-300 font-light"
              >
                View all campaigns &rarr;
              </Link>
            </div>

            {draftCampaigns.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                No draft campaigns pending. The weekly automation runs on Tuesday at 08:00 UTC or can be generated on demand.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {draftCampaigns.map((camp) => (
                  <div key={camp.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-800/40">
                        {camp.status}
                      </span>
                      <h4 className="text-sm font-normal text-white mt-1.5">{camp.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{camp.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/newsletter/${camp.id}`}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg font-light border border-zinc-700"
                      >
                        Edit / Preview
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Distribution Hub Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/blog/distribution"
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-pink-500/40 transition-all block group"
            >
              <h4 className="text-xs font-normal text-white group-hover:text-pink-300 flex items-center gap-1.5">
                LinkedIn Syndication <ArrowRight className="h-3 w-3" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1">Generate authoritative B2B LinkedIn drafts from published articles.</p>
            </Link>

            <Link
              href="/admin/newsletter/subscribers"
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 transition-all block group"
            >
              <h4 className="text-xs font-normal text-white group-hover:text-blue-300 flex items-center gap-1.5">
                Subscriber Management <ArrowRight className="h-3 w-3" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1">Audit opt-in consent records, import CSVs, and export audience lists.</p>
            </Link>

            <Link
              href="/admin/newsletter/suppression"
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/40 transition-all block group"
            >
              <h4 className="text-xs font-normal text-white group-hover:text-red-300 flex items-center gap-1.5">
                Suppression &amp; Compliance <ArrowRight className="h-3 w-3" />
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1">Strict unsubscribe preservation and spam complaint isolation.</p>
            </Link>
          </div>
        </div>

        {/* Right Column: Quick Actions & Audience Pulse */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-normal text-zinc-400 uppercase tracking-wider">
              Quick Generation
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Manually compile a draft of The FM Briefing using current published articles, tools, and AI guides.
            </p>
            <form action="/api/admin/newsletter/automation" method="POST">
              <button
                type="submit"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-normal py-2.5 px-4 rounded-lg border border-zinc-700 flex items-center justify-center gap-2"
              >
                <Zap className="h-3.5 w-3.5 text-pink-400" />
                Generate Issue 01 Draft Now
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
            <h3 className="text-xs font-normal text-zinc-400 uppercase tracking-wider">
              Audience Ingestion Points
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">/fm-briefing Landing</span>
                <span className="text-white font-mono font-light">Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Article Footers</span>
                <span className="text-white font-mono font-light">Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">In-Article Inline Cards</span>
                <span className="text-white font-mono font-light">Active</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">PPM / Health Check Tools</span>
                <span className="text-white font-mono font-light">Optional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
