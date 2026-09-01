import { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp,
  MousePointerClick,
  FileCheck2,
  GitBranch,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Wrench,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Content-Led Conversion & CRO | EntireFM Admin' };

interface JourneyFunnel {
  id: string;
  entryType: 'GUIDE' | 'TOOL' | 'BLOG' | 'GEO' | 'SERVICE';
  name: string;
  entryPath: string;
  nextStep: string;
  commercialParent: string;
  status: 'OPTIMISED' | 'REVIEWED' | 'ACTION_REQUIRED';
}

const FUNNELS: JourneyFunnel[] = [
  {
    id: 'f1',
    entryType: 'GUIDE',
    name: 'PPM Educational Pathway',
    entryPath: '/resources/guides/ppm-guide',
    nextStep: '/tools/ppm-schedule-builder',
    commercialParent: '/ppm',
    status: 'OPTIMISED',
  },
  {
    id: 'f2',
    entryType: 'GUIDE',
    name: 'Asset Register Diagnostic',
    entryPath: '/resources/guides/asset-register-guide',
    nextStep: '/tools/fm-health-check',
    commercialParent: '/services',
    status: 'OPTIMISED',
  },
  {
    id: 'f3',
    entryType: 'GUIDE',
    name: 'FM Procurement & Tendering',
    entryPath: '/resources/guides/fm-tender-guide',
    nextStep: '/tools/tender-brief',
    commercialParent: '/contact-us',
    status: 'OPTIMISED',
  },
  {
    id: 'f4',
    entryType: 'TOOL',
    name: 'PPM Tool Result Transition',
    entryPath: '/tools/ppm-schedule-builder',
    nextStep: '/ppm',
    commercialParent: '/contact-us',
    status: 'OPTIMISED',
  },
  {
    id: 'f5',
    entryType: 'GEO',
    name: 'London Regional FM Pathway',
    entryPath: '/facilities-management-london',
    nextStep: '/services',
    commercialParent: '/contact-us',
    status: 'OPTIMISED',
  },
];

export default function ContentConversionOverviewPage() {
  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-light">
            ENTIREFM CONTENT-LED CRO &amp; USER JOURNEY INTELLIGENCE
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Content Conversion &amp; CRO</h1>
          <p className="text-sm text-zinc-400">
            Monitor and optimise the natural transition from educational content into commercial enquiries without friction or spam.
          </p>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">OPTIMISED FUNNELS</div>
          <div className="mt-1 text-xl font-light text-emerald-400">{FUNNELS.length}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">INTERACTIVE TOOLS</div>
          <div className="mt-1 text-xl font-light text-white">4 Active</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">FORM CONTEXT PASSTHROUGH</div>
          <div className="mt-1 text-xl font-light text-blue-400">100% Active</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">DEAD-END RESOURCE ROUTES</div>
          <div className="mt-1 text-xl font-light text-purple-400">0 Gaps</div>
        </div>
      </div>

      {/* Structured Content Journeys Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Active Content &rarr; Commercial Conversion Pathways
          </h3>
          <span className="text-xs text-zinc-500 font-normal">Ungated Tools &amp; Clean Hand-offs</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Journey / Pipeline</th>
              <th className="py-3 px-4">Entry Route</th>
              <th className="py-3 px-4">Next Useful Step</th>
              <th className="py-3 px-4">Commercial Parent</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {FUNNELS.map((f) => (
              <tr key={f.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-normal text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {f.entryType}
                    </span>
                    <span>{f.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <Link href={f.entryPath} className="text-emerald-400 hover:underline font-normal">
                    {f.entryPath}
                  </Link>
                </td>
                <td className="py-3.5 px-4">
                  <Link href={f.nextStep} className="text-zinc-300 hover:underline font-normal">
                    {f.nextStep}
                  </Link>
                </td>
                <td className="py-3.5 px-4 font-normal text-zinc-400">{f.commercialParent}</td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded font-light border bg-emerald-950/60 text-emerald-300 border-emerald-800/40">
                    {f.status}
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
