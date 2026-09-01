import { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Search,
  ExternalLink,
} from 'lucide-react';
import { TIER1_CITIES } from '@/content/locations/tier1-cities';

export const metadata: Metadata = { title: 'Geographic Search Intelligence & Locations | EntireFM Admin' };

export default function GeoSearchAdminDashboard() {
  const cities = Object.values(TIER1_CITIES);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-light">
            ENTIREFM GEOGRAPHIC SEARCH INTELLIGENCE &amp; GEO AUTHORITY
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Location Authority &amp; Cluster Performance</h1>
          <p className="text-sm text-zinc-400">
            Monitor search demand, query ownership, and content differentiation across Tier 1 and regional location clusters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/locations"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <MapPin className="h-3.5 w-3.5" /> Public Locations Hub
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">TIER 1 CITIES MONITORED</div>
          <div className="mt-1 text-xl font-light text-white">{cities.length}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">TOTAL TIER 1 SEARCH DEMAND</div>
          <div className="mt-1 text-xl font-light text-emerald-400">
            {cities.reduce((acc, c) => acc + c.searchDemand.impressions, 0).toLocaleString()} impr.
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">PROTECTED GEO VARIANTS</div>
          <div className="mt-1 text-xl font-light text-blue-400">100% Protected (No Redirects)</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">SYNTHETIC LOCAL OFFICES</div>
          <div className="mt-1 text-xl font-light text-purple-400">0 (Strictly Prohibited)</div>
        </div>
      </div>

      {/* Location Clusters Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Tier 1 Location Clusters &amp; Intent Ownership
          </h3>
          <span className="text-xs text-zinc-500 font-normal">GSC Verified Demand Baseline</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">City / Cluster</th>
              <th className="py-3 px-4">Region</th>
              <th className="py-3 px-4">Search Demand (GSC)</th>
              <th className="py-3 px-4">Avg Position</th>
              <th className="py-3 px-4">Primary Historic URLs</th>
              <th className="py-3 px-4">Commercial Focus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {cities.map((city) => (
              <tr key={city.slug} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-normal text-white">{city.name}</td>
                <td className="py-3.5 px-4 text-zinc-400">{city.region}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-light">
                  {city.searchDemand.impressions.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-normal text-zinc-300">{city.searchDemand.avgPosition.toFixed(1)}</td>
                <td className="py-3.5 px-4 font-normal text-zinc-400 space-x-2">
                  <Link href={`/facilities-management-${city.slug}`} target="_blank" className="text-blue-400 hover:underline">
                    /facilities-management-{city.slug}
                  </Link>
                  <Link href={`/fm-${city.slug}`} target="_blank" className="text-zinc-500 hover:text-zinc-300">
                    /fm-{city.slug}
                  </Link>
                </td>
                <td className="py-3.5 px-4 text-zinc-300 max-w-xs truncate">{city.positioning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
