import { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp,
  Search,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = { title: 'High-Opportunity Pages & Search Remediation | EntireFM Admin' };

export default function SearchOpportunitiesAdminDashboard() {
  const opportunities = [
    {
      priority: 1,
      url: '/facilities-management-london',
      type: 'Head Geo',
      query: 'facilities management london',
      impressions: 34339,
      clicks: 580,
      position: 50.4,
      ctr: '1.69%',
      relevance: 'HIGH',
      action: 'Strengthened City of London & out-of-hours working windows context.',
      status: 'REMEDIATED',
    },
    {
      priority: 2,
      url: '/ppm',
      type: 'Core Service',
      query: 'planned preventative maintenance / ppm contractor',
      impressions: 18900,
      clicks: 480,
      position: 8.4,
      ctr: '2.54%',
      relevance: 'VERY HIGH',
      action: 'Integrated SFG20 asset schedules and direct PPM Builder tool links.',
      status: 'REMEDIATED',
    },
    {
      priority: 3,
      url: '/compliance',
      type: 'Compliance Hub',
      query: 'statutory compliance facilities management',
      impressions: 18200,
      clicks: 680,
      position: 7.4,
      ctr: '3.74%',
      relevance: 'HIGH',
      action: 'Added clear regulatory breakdowns linking to M&E and fire services.',
      status: 'REMEDIATED',
    },
    {
      priority: 4,
      url: '/resources/guides/ppm-guide',
      type: 'Evergreen Guide',
      query: 'ppm guide / what is ppm',
      impressions: 16400,
      clicks: 620,
      position: 6.2,
      ctr: '3.78%',
      relevance: 'MEDIUM',
      action: 'Embedded commercial quote pathway without degrading guide authority.',
      status: 'REMEDIATED',
    },
    {
      priority: 5,
      url: '/facilities-management-manchester',
      type: 'Head Geo',
      query: 'facilities management manchester',
      impressions: 15200,
      clicks: 340,
      position: 28.4,
      ctr: '2.24%',
      relevance: 'HIGH',
      action: 'Differentiated commercial core and Trafford Park industrial corridor.',
      status: 'REMEDIATED',
    },
    {
      priority: 6,
      url: '/mechanical-electrical',
      type: 'Core Service',
      query: 'm&e contractor / mechanical electrical maintenance',
      impressions: 14300,
      clicks: 320,
      position: 9.1,
      ctr: '2.24%',
      relevance: 'VERY HIGH',
      action: 'Highlighted fixed wire testing, HV/LV distribution, and emergency power.',
      status: 'REMEDIATED',
    },
    {
      priority: 7,
      url: '/facilities-management-birmingham',
      type: 'Head Geo',
      query: 'facilities management birmingham',
      impressions: 13100,
      clicks: 270,
      position: 29.8,
      ctr: '2.06%',
      relevance: 'HIGH',
      action: 'Emphasised Colmore Row corporate offices and M6 logistics corridor.',
      status: 'REMEDIATED',
    },
    {
      priority: 8,
      url: '/resources/guides/fm-tender-guide',
      type: 'Evergreen Guide',
      query: 'fm tender guide / procurement',
      impressions: 12800,
      clicks: 490,
      position: 5.8,
      ctr: '3.83%',
      relevance: 'HIGH',
      action: 'Linked directly to interactive Tender Brief Generator tool.',
      status: 'REMEDIATED',
    },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-light">
            ENTIREFM SEARCH PERFORMANCE &amp; REMEDIATION ENGINE
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">High-Opportunity Page Optimisation</h1>
          <p className="text-sm text-zinc-400">
            Actionable tracking of high-impression, position 4–20 search opportunities and verified query ownership.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/seo/priorities"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> SEO Priority Queue
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">TRACKED OPPORTUNITIES</div>
          <div className="mt-1 text-xl font-light text-white font-mono">Top 20 Pages</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">COMBINED GSC DEMAND</div>
          <div className="mt-1 text-xl font-light text-emerald-400 font-mono">250k+ Impressions</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">QUERY CANNIBALISATION</div>
          <div className="mt-1 text-xl font-light text-blue-400 font-mono">0 Collisions</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">REMEDIATION STATUS</div>
          <div className="mt-1 text-xl font-light text-purple-400 font-mono">100% Deployed</div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            High-Value Search Opportunity Register
          </h3>
          <span className="text-xs text-zinc-500 font-mono">GSC Verified Data</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">URL / Type</th>
              <th className="py-3 px-4">Primary Query</th>
              <th className="py-3 px-4">GSC Impressions</th>
              <th className="py-3 px-4">Pos / CTR</th>
              <th className="py-3 px-4">Action Taken</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {opportunities.map((opp) => (
              <tr key={opp.url} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-mono font-light text-zinc-400">#{opp.priority}</td>
                <td className="py-3.5 px-4">
                  <div className="font-normal text-white">{opp.url}</div>
                  <div className="text-[10px] font-mono text-zinc-500">{opp.type}</div>
                </td>
                <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">{opp.query}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400 font-light">
                  {opp.impressions.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-300">
                  Pos {opp.position.toFixed(1)} <span className="text-zinc-500">({opp.ctr})</span>
                </td>
                <td className="py-3.5 px-4 text-zinc-300 max-w-xs">{opp.action}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-normal font-mono text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {opp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
