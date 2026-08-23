import { Metadata } from 'next';
import Link from 'next/link';
import { getGrowthOverview } from '@/server/growth/store';
import { getGa4Status, getGscStatus } from '@/server/blog/intelligence-store';
import {
  TrendingUp,
  Users,
  Target,
  FileCheck,
  PhoneCall,
  Mail,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Growth & Conversion Intelligence | EntireFM Admin' };

export default async function GrowthOverviewPage() {
  const metrics = await getGrowthOverview('28_days');
  const gsc = getGscStatus();
  const ga4 = getGa4Status();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-pink-400 font-bold">
            COMMERCIAL PERFORMANCE &amp; ATTRIBUTION
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Growth &amp; Conversion Intelligence</h1>
          <p className="text-sm text-zinc-400">
            Closed-loop commercial attribution tracking inbound enquiries from search entrance to qualified opportunity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/growth/leads"
            className="text-xs bg-pink-600 hover:bg-pink-500 text-white font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Users className="h-3.5 w-3.5" /> View Inbound Leads
          </Link>
          <Link
            href="/admin/growth/diagnostics"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-3 py-2 rounded-lg border border-zinc-700 transition-colors"
          >
            Diagnostics
          </Link>
        </div>
      </div>

      {/* Integration Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Google Search Console Integration:</span>
          {gsc.status === 'CONNECTED' ? (
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> CONNECTED
            </span>
          ) : (
            <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> NOT CONNECTED
            </span>
          )}
        </div>
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Google Analytics 4 API:</span>
          {ga4.status === 'CONNECTED' ? (
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> CONNECTED
            </span>
          ) : (
            <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> NOT CONNECTED
            </span>
          )}
        </div>
      </div>

      {/* Primary Commercial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Enquiries</span>
            <Users className="h-4 w-4 text-pink-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{metrics.totalEnquiries}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Inbound website RFQs &amp; contacts</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Qualified Leads</span>
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{metrics.qualifiedLeads}</div>
          <div className="mt-1 text-[11px] text-emerald-400/80">
            {metrics.qualificationRatePct.toFixed(1)}% commercial qualification rate
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Organic Search Leads</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{metrics.organicLeads}</div>
          <div className="mt-1 text-[11px] text-zinc-500">First touch via organic search</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pipeline Value</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {metrics.hasRealRevenueData ? `£${metrics.pipelineValueGbp.toLocaleString()}` : 'NO DATA YET'}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {metrics.hasRealRevenueData ? `${metrics.openOpportunitiesCount} active proposals` : 'Populates on quote issuance'}
          </div>
        </div>
      </div>

      {/* Commercial Hub Exploration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/admin/growth/leads"
          className="p-5 bg-zinc-900 border border-zinc-800 hover:border-pink-500/40 rounded-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white group-hover:text-pink-300">Lead Directory</h3>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-pink-400" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Inspect individual prospect records, exact multi-touch user journeys, touched tools, and referrers.
          </p>
        </Link>

        <Link
          href="/admin/growth/attribution"
          className="p-5 bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 rounded-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white group-hover:text-blue-300">Attribution Models</h3>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-blue-400" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Compare First Touch vs Last Touch vs Assisted Content paths without single-touch bias.
          </p>
        </Link>

        <Link
          href="/admin/growth/services"
          className="p-5 bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 rounded-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300">Service Performance</h3>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Identify which facilities services (PPM, M&amp;E, HVAC, Cleaning) drive the highest qualified revenue.
          </p>
        </Link>

        <Link
          href="/admin/growth/locations"
          className="p-5 bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 rounded-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300">Location Performance</h3>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-purple-400" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Analyse city cluster demand across Manchester, London, Birmingham, and regional estates.
          </p>
        </Link>

        <Link
          href="/admin/growth/funnels"
          className="p-5 bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 rounded-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300">Conversion Funnels</h3>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-amber-400" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Measure stage-by-stage drop-off from search entrance to tool completion and form submit.
          </p>
        </Link>

        <Link
          href="/admin/growth/insights"
          className="p-5 bg-zinc-900 border border-zinc-800 hover:border-pink-500/40 rounded-xl transition-all group"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white group-hover:text-pink-300">Commercial Insights</h3>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-pink-400" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Actionable optimization recommendations for high traffic/low lead pages and SEO opportunities.
          </p>
        </Link>
      </div>
    </main>
  );
}
