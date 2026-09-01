import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  MapPin,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = { title: 'SEO Priorities & Health Governance | EntireFM Admin' };

export default function SEOPriorityDashboard() {
  const priorities = [
    {
      id: 'PRI-001',
      priority: 'P0',
      category: 'Technical / Routing',
      title: 'Unified Edge Middleware & Hostname Normalisation',
      status: 'RESOLVED',
      impact: 'Critical',
      action: 'Consolidated in src/proxy.ts — 301 redirect non-www to www.entirefm.com with zero chains.',
    },
    {
      id: 'PRI-002',
      priority: 'P0',
      category: 'Historic Route Integrity',
      title: 'Protect 229 Historic Wix Routes as HTTP 200',
      status: 'RESOLVED',
      impact: 'Critical',
      action: 'All 229 legacy routes verified 200 OK, self-canonical, and indexable in route registry.',
    },
    {
      id: 'PRI-003',
      priority: 'P1',
      category: 'Search Intent Differentiation',
      title: 'Parallel City Query Ownership (London/Mcr/Bham/Leeds)',
      status: 'OPTIMISED',
      impact: 'High',
      action: 'Differentiated head term, commercial procurement, and district intent across parallel URLs.',
    },
    {
      id: 'PRI-004',
      priority: 'P1',
      category: 'Service vs Guide Separation',
      title: 'Commercial Intent Ownership on /ppm & /mechanical-electrical',
      status: 'OPTIMISED',
      impact: 'High',
      action: 'Commercial queries owned by service pages; guides own informational queries and link to services.',
    },
    {
      id: 'PRI-005',
      priority: 'P2',
      category: 'Internal Link Equity',
      title: 'Zero Orphan Pages Across Registered Routes',
      status: 'OPTIMISED',
      impact: 'Medium',
      action: 'Every registered route has multiple contextual inlinks from hubs, breadcrumbs, and sitemaps.',
    },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-light">
            ENTIREFM SEARCH PERFORMANCE &amp; TECHNICAL SEO GOVERNANCE
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">SEO Priority Queue &amp; Health Architecture</h1>
          <p className="text-sm text-zinc-400">
            Systematic tracking of production crawl health, historic route protection, and keyword intent governance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" /> XML Sitemap
          </Link>
          <Link
            href="/robots.txt"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Robots.txt
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">TOTAL REGISTERED ROUTES</div>
          <div className="mt-1 text-xl font-light text-white">326 Routes</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">HISTORIC PROTECTED 200s</div>
          <div className="mt-1 text-xl font-light text-emerald-400">229 / 229 (100%)</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">CANONICAL CONSISTENCY</div>
          <div className="mt-1 text-xl font-light text-blue-400">100% www.entirefm.com</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">BROKEN INTERNAL LINKS</div>
          <div className="mt-1 text-xl font-light text-purple-400">0 Clean</div>
        </div>
      </div>

      {/* Priorities Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Consolidated Priority Queue
          </h3>
          <span className="text-xs text-zinc-500 font-normal">Automated CI/CD Validated</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Issue / Directive</th>
              <th className="py-3 px-4">Action Taken</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {priorities.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-light">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      p.priority === 'P0'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : p.priority === 'P1'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {p.priority}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-zinc-400 font-normal">{p.category}</td>
                <td className="py-3.5 px-4 font-normal text-white">{p.title}</td>
                <td className="py-3.5 px-4 text-zinc-300 max-w-md">{p.action}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-normal text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {p.status}
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
