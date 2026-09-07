'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Shield,
  Layers,
  Wrench,
  Download,
} from 'lucide-react';
import { RamsRecord } from '@/server/contractor/rams-service';

interface Props {
  initialRamsList: RamsRecord[];
  contractorOrgId: string;
}

export function RamsDashboardClient({ initialRamsList, contractorOrgId }: Props) {
  const [ramsList, setRamsList] = useState<RamsRecord[]>(initialRamsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'ENTIREFM' | 'INDEPENDENT'>('ALL');

  const filtered = ramsList.filter((r) => {
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    if (filterType === 'ENTIREFM' && r.isIndependentRams) return false;
    if (filterType === 'INDEPENDENT' && !r.isIndependentRams) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.siteName.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        (r.workOrderNumber && r.workOrderNumber.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalCount = ramsList.length;
  const underReviewCount = ramsList.filter((r) => r.status === 'SUBMITTED_TO_ENTIREFM' || r.status === 'READY_FOR_REVIEW').length;
  const issuedCount = ramsList.filter((r) => r.status === 'ACCEPTED_FOR_WORK' || r.status === 'ISSUED').length;
  const changesRequestedCount = ramsList.filter((r) => r.status === 'CHANGES_REQUESTED').length;

  return (
    <div className="space-y-6">
      {/* Metrics Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm p-4">
          <span className="text-[10px] font-normal text-[#9A9A95] uppercase">TOTAL RAMS PACKS</span>
          <p className="text-2xl font-light text-[#111111] mt-1">{totalCount}</p>
          <span className="text-[10.5px] text-[#9A9A95] mt-0.5 block">Job-specific safety packs</span>
        </div>

        <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm p-4">
          <span className="text-[10px] font-normal text-[#9A9A95] uppercase">ACCEPTED &amp; ISSUED</span>
          <p className="text-2xl font-light text-emerald-400 mt-1">{issuedCount}</p>
          <span className="text-[10.5px] text-[#9A9A95] mt-0.5 block">Active work clearance</span>
        </div>

        <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm p-4">
          <span className="text-[10px] font-normal text-[#9A9A95] uppercase">UNDER REVIEW</span>
          <p className="text-2xl font-light text-cyan-400 mt-1">{underReviewCount}</p>
          <span className="text-[10.5px] text-[#9A9A95] mt-0.5 block">Awaiting compliance check</span>
        </div>

        <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm p-4">
          <span className="text-[10px] font-normal text-[#9A9A95] uppercase">CHANGES REQUESTED</span>
          <p className={`text-2xl font-light mt-1 ${changesRequestedCount > 0 ? 'text-amber-400' : 'text-white'}`}>
            {changesRequestedCount}
          </p>
          <span className="text-[10.5px] text-[#9A9A95] mt-0.5 block">Revision required</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E5] pb-3">
        <div className="flex items-center gap-1.5 text-xs font-normal">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'ALL'
                ? 'bg-brand-electric text-white font-medium'
                : 'text-[#111111] hover:text-white hover:bg-white'
            }`}
          >
            All RAMS ({ramsList.length})
          </button>
          <button
            onClick={() => setFilterType('ENTIREFM')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'ENTIREFM'
                ? 'bg-brand-electric text-white font-medium'
                : 'text-[#111111] hover:text-white hover:bg-white'
            }`}
          >
            EntireFM Jobs ({ramsList.filter((r) => !r.isIndependentRams).length})
          </button>
          <button
            onClick={() => setFilterType('INDEPENDENT')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'INDEPENDENT'
                ? 'bg-brand-electric text-white font-medium'
                : 'text-[#111111] hover:text-white hover:bg-white'
            }`}
          >
            Independent RAMS ({ramsList.filter((r) => r.isIndependentRams).length})
          </button>
        </div>

        <Link
          href="/contractor/rams/create"
          className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-colors flex items-center gap-1.5 shadow-md shadow-brand-electric/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Job RAMS Pack
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 text-[#9A9A95] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search RAMS by title, site, or ref..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E8E8E5] text-white text-xs placeholder:text-[#9A9A95] focus:border-brand-electric focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-normal">
          <span className="text-[#9A9A95]">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E8E5] text-white text-xs focus:outline-none focus:border-brand-electric"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED_TO_ENTIREFM">Submitted to EntireFM</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
            <option value="ACCEPTED_FOR_WORK">Accepted / Approved</option>
            <option value="ISSUED">Issued</option>
          </select>
        </div>
      </div>

      {/* RAMS Table */}
      <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-normal border-collapse">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E8E8E5] text-[#6D6D68] uppercase text-[10px]">
                <th className="py-3 px-4">Document Ref</th>
                <th className="py-3 px-4">Job Scope &amp; Activity</th>
                <th className="py-3 px-4">Client &amp; Site</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Briefings</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9A9A95] font-sans text-xs">
                    No RAMS packs found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((rams) => (
                  <tr key={rams.id} className="hover:bg-[#F5F5F3] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <Link
                        href={`/contractor/rams/${encodeURIComponent(rams.id)}`}
                        className="hover:text-brand-electric-bright transition-colors"
                      >
                        {rams.id}
                      </Link>
                      <span className="text-[10px] text-[#9A9A95] block font-normal">v{rams.version}</span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <span className="font-medium block">{rams.title}</span>
                      <span className="text-[10px] text-[#9A9A95] block">{rams.workCategory}</span>
                    </td>
                    <td className="py-3 px-4 text-[#111111]">
                      <span className="text-[#111111] block">{rams.siteName}</span>
                      <span className="text-[10.5px] text-[#9A9A95] block">{rams.clientName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] border ${
                          rams.status === 'ACCEPTED_FOR_WORK' || rams.status === 'ISSUED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : rams.status === 'CHANGES_REQUESTED'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-bold'
                            : 'bg-[#FAFAF8] text-[#111111] border-[#E8E8E5]'
                        }`}
                      >
                        {rams.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#111111]">
                      {rams.operativeBriefings.length} signed
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/contractor/rams/${encodeURIComponent(rams.id)}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-[#F5F5F3] text-[#111111] hover:text-white transition-colors"
                          title="Print / View PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/contractor/rams/${encodeURIComponent(rams.id)}`}
                          className="text-brand-electric-bright hover:underline text-xs"
                        >
                          Open &rarr;
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
