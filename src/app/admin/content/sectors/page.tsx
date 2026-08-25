import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  Factory,
  Truck,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  Layers,
} from 'lucide-react';
import { listPublishedCaseStudies } from '@/server/trust/case-studies';

export const metadata: Metadata = { title: 'Sector Authority & Content Governance | EntireFM Admin' };

interface SectorStatus {
  id: string;
  name: string;
  url: string;
  provenance: string;
  contentDepth: 'DEEP' | 'MODERATE' | 'BASIC';
  proofStatus: 'VERIFIED' | 'PROOF_GAP';
  relatedServices: string[];
  procurementTool: string;
}

const SECTORS_MATRIX: SectorStatus[] = [
  {
    id: 'sec-ind',
    name: 'Industrial & Manufacturing',
    url: '/industrial-facilities-management',
    provenance: 'LEGACY_VERIFIED',
    contentDepth: 'DEEP',
    proofStatus: 'VERIFIED',
    relatedServices: ['Mechanical & Electrical', 'PPM Schedules', 'Industrial Cleaning'],
    procurementTool: '/tools/ppm-schedule-builder',
  },
  {
    id: 'sec-com',
    name: 'Commercial Offices',
    url: '/commercial-facilities-management',
    provenance: 'LEGACY_VERIFIED',
    contentDepth: 'DEEP',
    proofStatus: 'VERIFIED',
    relatedServices: ['Commercial HVAC', 'Fixed Wire EICR', 'Office Cleaning'],
    procurementTool: '/tools/tender-brief',
  },
  {
    id: 'sec-log',
    name: 'Logistics & Warehousing',
    url: '/logistics-facilities-management',
    provenance: 'LEGACY_VERIFIED',
    contentDepth: 'DEEP',
    proofStatus: 'VERIFIED',
    relatedServices: ['Fabric & Door Maintenance', 'High-Bay Electrical', 'HVAC'],
    procurementTool: '/tools/fm-health-check',
  },
  {
    id: 'sec-ret',
    name: 'Retail & Shopping Centres',
    url: '/retail-facilities-management',
    provenance: 'LEGACY_VERIFIED',
    contentDepth: 'DEEP',
    proofStatus: 'VERIFIED',
    relatedServices: ['PPM Schedules', 'Air Conditioning', 'Electrical Repairs'],
    procurementTool: '/tools/tender-brief',
  },
  {
    id: 'sec-edu',
    name: 'Education & Universities',
    url: '/education-facilities-management',
    provenance: 'LEGACY_VERIFIED',
    contentDepth: 'MODERATE',
    proofStatus: 'PROOF_GAP',
    relatedServices: ['Heating & Gas', 'Water Hygiene', 'Fixed Wire'],
    procurementTool: '/tools/fm-health-check',
  },
  {
    id: 'sec-hlth',
    name: 'Healthcare Facilities',
    url: '/healthcare-facilities-management',
    provenance: 'LEGACY_VERIFIED',
    contentDepth: 'MODERATE',
    proofStatus: 'PROOF_GAP',
    relatedServices: ['Critical Power', 'M&E', 'Water Hygiene'],
    procurementTool: '/tools/fm-health-check',
  },
  {
    id: 'sec-hot',
    name: 'Hotels & Hospitality',
    url: '/hotel-facilities-management',
    provenance: 'LEGACY_VERIFIED',
    contentDepth: 'MODERATE',
    proofStatus: 'PROOF_GAP',
    relatedServices: ['HVAC', 'Hot Water & Gas', 'Reactive'],
    procurementTool: '/tools/ppm-schedule-builder',
  },
];

export default function SectorAdminDashboard() {
  const caseStudies = listPublishedCaseStudies();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-light">
            ENTIREFM SECTOR AUTHORITY &amp; CONTENT GOVERNANCE
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Sector Content &amp; Buyer Journeys</h1>
          <p className="text-sm text-zinc-400">
            Monitor sector content depth, procurement pathways, service mappings, and verified proof coverage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/sectors"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Building2 className="h-3.5 w-3.5" /> Public Sectors Gateway
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">SECTORS MONITORED</div>
          <div className="mt-1 text-xl font-light text-white font-mono">{SECTORS_MATRIX.length}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">P0 CORE BLUEPRINTS</div>
          <div className="mt-1 text-xl font-light text-emerald-400 font-mono">4 (DEEP)</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">PROOF COVERAGE</div>
          <div className="mt-1 text-xl font-light text-blue-400 font-mono">
            {SECTORS_MATRIX.filter((s) => s.proofStatus === 'VERIFIED').length} / {SECTORS_MATRIX.length}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-mono">PROOF GAPS TRACKED</div>
          <div className="mt-1 text-xl font-light text-amber-400 font-mono">
            {SECTORS_MATRIX.filter((s) => s.proofStatus === 'PROOF_GAP').length}
          </div>
        </div>
      </div>

      {/* Sector Matrix Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Sector Content &amp; Procurement Architecture
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Claims &amp; Proof Governance Enforced</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Sector Name</th>
              <th className="py-3 px-4">URL</th>
              <th className="py-3 px-4">Content Depth</th>
              <th className="py-3 px-4">Proof Status</th>
              <th className="py-3 px-4">Key Mapped Services</th>
              <th className="py-3 px-4">Procurement Tool</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {SECTORS_MATRIX.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-normal text-white">{s.name}</td>
                <td className="py-3.5 px-4 font-mono text-zinc-400">
                  <Link href={s.url} target="_blank" className="hover:text-emerald-400 underline">
                    {s.url}
                  </Link>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-light border ${
                      s.contentDepth === 'DEEP'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {s.contentDepth}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-light border ${
                      s.proofStatus === 'VERIFIED'
                        ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                    }`}
                  >
                    {s.proofStatus}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-zinc-300">{s.relatedServices.join(', ')}</td>
                <td className="py-3.5 px-4 font-mono text-emerald-400">{s.procurementTool}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
