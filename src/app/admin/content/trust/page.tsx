import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Building,
  Award,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { listPublishedCaseStudies } from '@/server/trust/case-studies';

export const metadata: Metadata = { title: 'Trust, Proof & Verification Register | EntireFM Admin' };

interface VerificationItem {
  id: string;
  name: string;
  category: 'CLIENT' | 'ACCREDITATION' | 'CASE_STUDY' | 'TESTIMONIAL';
  status: 'VERIFIED' | 'AWAITING_VERIFICATION' | 'ANONYMISED_APPROVED' | 'DO_NOT_PUBLISH';
  evidence: string;
  usageRule: string;
}

const VERIFICATION_REGISTER: VerificationItem[] = [
  {
    id: 'v1',
    name: 'Alkota Group Limited (No. 13535215) t/a EntireFM',
    category: 'CLIENT',
    status: 'VERIFIED',
    evidence: 'Companies House No. 13535215 / Verified LinkedIn',
    usageRule: 'Allowed across Footer, Legal, Schema & Media Centre',
  },
  {
    id: 'v2',
    name: 'Multi-Site UK Retail Estate PPM',
    category: 'CASE_STUDY',
    status: 'ANONYMISED_APPROVED',
    evidence: 'Real operational scope / Anonymised client name',
    usageRule: 'Published on /case-studies',
  },
  {
    id: 'v3',
    name: 'Corporate Office Complex HVAC Remodelling',
    category: 'CASE_STUDY',
    status: 'ANONYMISED_APPROVED',
    evidence: 'Real engineering scope / Anonymised client name',
    usageRule: 'Published on /case-studies',
  },
  {
    id: 'v4',
    name: 'Logistics Distribution Statutory Audit',
    category: 'CASE_STUDY',
    status: 'ANONYMISED_APPROVED',
    evidence: 'Real compliance review / Anonymised client name',
    usageRule: 'Published on /case-studies',
  },
  {
    id: 'v5',
    name: 'Contractor Trade Accreditations (Gas Safe, NICEIC, F-Gas, CHAS, SafeContractor, BESA)',
    category: 'ACCREDITATION',
    status: 'VERIFIED',
    evidence: 'Verified contractor network compliance standard across all mechanical, electrical & gas works',
    usageRule: 'Rendered in AccreditationRail with explicit contractor delivery wording',
  },
  {
    id: 'v6',
    name: 'Verified Client Delivery (Lambert Smith Hampton, NHS, Greggs, Cushman & Wakefield, Costa, HSBC, Burger King, Moto, NatWest, Balfour Beatty, Royal Enfield, Forged Solutions Group, DAMAC)',
    category: 'CLIENT',
    status: 'VERIFIED',
    evidence: 'Confirmed client delivery history and public name/logo permission',
    usageRule: 'Rendered in ClientLogoRail on homepage and relevant sector pages',
  },
];

export default function TrustVerificationAdminPage() {
  const caseStudies = listPublishedCaseStudies();

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-light">
            ENTIREFM TRUST, PROJECT PROOF &amp; VERIFICATION REGISTER
          </span>
          <h1 className="text-2xl font-extralight text-white mt-1">Trust &amp; Verification Register</h1>
          <p className="text-sm text-zinc-400">
            Audit and govern verified company facts, case studies, accreditations, and client permissions. Zero synthetic proof.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/case-studies"
            target="_blank"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-light px-3 py-2 rounded-lg border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <Building className="h-3.5 w-3.5" /> Public Case Studies Hub
          </Link>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">PUBLISHED CASE STUDIES</div>
          <div className="mt-1 text-xl font-light text-emerald-400">{caseStudies.length}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">VERIFIED CLAIMS</div>
          <div className="mt-1 text-xl font-light text-white">
            {VERIFICATION_REGISTER.filter((v) => v.status === 'VERIFIED').length}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">AWAITING VERIFICATION</div>
          <div className="mt-1 text-xl font-light text-amber-400">
            {VERIFICATION_REGISTER.filter((v) => v.status === 'AWAITING_VERIFICATION').length}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-500 text-[10px] uppercase font-medium">SYNTHETIC CLAIMS</div>
          <div className="mt-1 text-xl font-light text-purple-400">0 (Strictly Prohibited)</div>
        </div>
      </div>

      {/* Verification Register Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-normal text-zinc-200 uppercase tracking-wider">
            Canonical Trust &amp; Verification Register
          </h3>
          <span className="text-xs text-zinc-500 font-normal">Claims Governance Active</span>
        </div>

        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 font-normal uppercase text-[10px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Asset / Entity / Claim</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Evidence Base</th>
              <th className="py-3 px-4">Website Usage Policy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {VERIFICATION_REGISTER.map((v) => (
              <tr key={v.id} className="hover:bg-zinc-800/40">
                <td className="py-3.5 px-4 font-normal text-white">{v.name}</td>
                <td className="py-3.5 px-4 font-normal text-zinc-400">{v.category}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] uppercase px-2 py-0.5 rounded font-light border ${
                      v.status === 'VERIFIED'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                        : v.status === 'ANONYMISED_APPROVED'
                        ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-normal text-zinc-300">{v.evidence}</td>
                <td className="py-3.5 px-4 text-zinc-400">{v.usageRule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
