'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Download,
} from 'lucide-react';
import { RamsRecord } from '@/server/contractor/rams-service';
import { AdminRamsReviewModal } from './AdminRamsReviewModal';

interface Props {
  initialRamsList: RamsRecord[];
}

export function AdminRamsReviewClient({ initialRamsList }: Props) {
  const [ramsList, setRamsList] = useState<RamsRecord[]>(initialRamsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRamsForReview, setSelectedRamsForReview] = useState<RamsRecord | null>(null);

  const filtered = ramsList.filter((r) => {
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.contractorName.toLowerCase().includes(q) ||
        r.siteName.toLowerCase().includes(q) ||
        (r.workOrderNumber && r.workOrderNumber.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalCount = ramsList.length;
  const pendingCount = ramsList.filter((r) => r.status === 'SUBMITTED_TO_ENTIREFM' || r.status === 'READY_FOR_REVIEW').length;
  const approvedCount = ramsList.filter((r) => r.status === 'ACCEPTED_FOR_WORK').length;
  const changesCount = ramsList.filter((r) => r.status === 'CHANGES_REQUESTED').length;

  return (
    <div className="space-y-6">
      {/* Metric Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">TOTAL SUBMISSIONS</span>
          <div className="text-2xl font-light text-slate-900">{totalCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">All Contractor Packs</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">PENDING ENTIREFM VETTING</span>
          <div className="text-2xl font-light text-cyan-600">{pendingCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Requires Review</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">CLEARED FOR WORK</span>
          <div className="text-2xl font-light text-emerald-600">{approvedCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Accepted by Safety Lead</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">CHANGES REQUESTED</span>
          <div className="text-2xl font-light text-amber-600">{changesCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Returned to Contractor</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ref, contractor, or site..."
            className="w-full pl-9 pr-3 py-1.5 rounded border border-slate-200 text-xs font-normal focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-normal">
          <span className="text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 rounded border border-slate-200 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED_TO_ENTIREFM">Submitted to EntireFM</option>
            <option value="ACCEPTED_FOR_WORK">Accepted for Work</option>
            <option value="CHANGES_REQUESTED">Changes Requested</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-normal border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">RAMS Ref</th>
                <th className="py-3 px-4">Contractor</th>
                <th className="py-3 px-4">Job Scope &amp; Site</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No RAMS submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((rams) => (
                  <tr key={rams.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {rams.id}
                      <span className="text-[10px] text-slate-500 block font-normal">v{rams.version}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      <span className="font-semibold block">{rams.contractorName}</span>
                      <span className="text-[10.5px] text-slate-500 block">{rams.workCategory}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium block">{rams.title}</span>
                      <span className="text-[10px] text-slate-500 block">{rams.siteName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] border ${
                          rams.status === 'ACCEPTED_FOR_WORK'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : rams.status === 'CHANGES_REQUESTED'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                            : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                        }`}
                      >
                        {rams.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/contractor/rams/${encodeURIComponent(rams.id)}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-slate-100 text-slate-500"
                          title="View PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setSelectedRamsForReview(rams)}
                          className="btn-primary text-xs py-1 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                        >
                          Review &amp; Sign Off &rarr;
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRamsForReview && (
        <AdminRamsReviewModal
          isOpen={!!selectedRamsForReview}
          onClose={() => setSelectedRamsForReview(null)}
          onSuccess={() => {
            setRamsList((prev) =>
              prev.map((r) =>
                r.id === selectedRamsForReview.id
                  ? { ...r, status: 'ACCEPTED_FOR_WORK' }
                  : r
              )
            );
            setSelectedRamsForReview(null);
          }}
          rams={selectedRamsForReview}
        />
      )}
    </div>
  );
}
