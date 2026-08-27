'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Download,
  Lock,
} from 'lucide-react';
import { JobPackRecord } from '@/server/contractor/job-pack-engine';
import { AdminJobPackOverrideModal } from './AdminJobPackOverrideModal';

interface Props {
  initialJobPacks: JobPackRecord[];
}

export function AdminJobPacksClient({ initialJobPacks }: Props) {
  const [jobPacks, setJobPacks] = useState<JobPackRecord[]>(initialJobPacks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPackForOverride, setSelectedPackForOverride] = useState<JobPackRecord | null>(null);

  const filtered = jobPacks.filter((jp) => {
    if (selectedStatus === 'READY' && !jp.readiness.isReadyForAttendance) return false;
    if (selectedStatus === 'ACTION_REQUIRED' && jp.readiness.isReadyForAttendance) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        jp.id.toLowerCase().includes(q) ||
        jp.workOrderNumber.toLowerCase().includes(q) ||
        jp.contractorName.toLowerCase().includes(q) ||
        jp.siteName.toLowerCase().includes(q) ||
        jp.trade.toLowerCase().includes(q) ||
        jp.assignedOperative?.fullName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalCount = jobPacks.length;
  const readyCount = jobPacks.filter((jp) => jp.readiness.isReadyForAttendance).length;
  const actionCount = totalCount - readyCount;

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">NETWORK JOB PACKS</span>
          <div className="text-2xl font-mono font-light text-slate-900">{totalCount}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Live Dispatches</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">CLEARED FOR ATTENDANCE</span>
          <div className="text-2xl font-mono font-light text-emerald-600">{readyCount}</div>
          <span className="text-[10.5px] font-mono text-slate-500">100% Pre-Attendance Verified</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">BLOCKED / ACTION REQ</span>
          <div className="text-2xl font-mono font-light text-rose-600">{actionCount}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Missing Safety Requirements</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">READINESS RATE</span>
          <div className="text-2xl font-mono font-light text-cyan-600">
            {totalCount > 0 ? `${Math.round((readyCount / totalCount) * 100)}%` : '100%'}
          </div>
          <span className="text-[10.5px] font-mono text-slate-500">Safety Compliance Rate</span>
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
            placeholder="Search by WO, contractor, site, operative..."
            className="w-full pl-9 pr-3 py-1.5 rounded border border-slate-200 text-xs font-mono focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Readiness:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 rounded border border-slate-200 bg-white"
          >
            <option value="ALL">All States</option>
            <option value="READY">Ready for Attendance</option>
            <option value="ACTION_REQUIRED">Action Required</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Job Pack Ref</th>
                <th className="py-3 px-4">Contractor &amp; Operative</th>
                <th className="py-3 px-4">Work Order &amp; Site</th>
                <th className="py-3 px-4">Planned Date</th>
                <th className="py-3 px-4">Readiness Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No matching Job Packs found.
                  </td>
                </tr>
              ) : (
                filtered.map((jp) => (
                  <tr key={jp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {jp.id}
                      <span className="text-[10px] text-slate-500 block font-normal">v{jp.version}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      <span className="font-semibold block">{jp.contractorName}</span>
                      <span className="text-[10.5px] text-slate-500 block">
                        {jp.assignedOperative?.fullName || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium block">{jp.workOrderNumber}</span>
                      <span className="text-[10px] text-slate-500 block">{jp.siteName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {jp.plannedAttendanceDate} ({jp.plannedAttendanceTime})
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          jp.readiness.isReadyForAttendance
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                        }`}
                      >
                        {jp.readiness.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/contractor/job-packs/${encodeURIComponent(jp.id)}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-slate-100 text-slate-500"
                          title="View PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        {!jp.readiness.isReadyForAttendance && (
                          <button
                            onClick={() => setSelectedPackForOverride(jp)}
                            className="text-xs py-1 px-2.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            Override
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Modal */}
      {selectedPackForOverride && (
        <AdminJobPackOverrideModal
          isOpen={!!selectedPackForOverride}
          onClose={() => setSelectedPackForOverride(null)}
          onSuccess={() => {
            setJobPacks((prev) =>
              prev.map((j) =>
                j.id === selectedPackForOverride.id
                  ? {
                      ...j,
                      readiness: {
                        ...j.readiness,
                        isReadyForAttendance: true,
                        status: 'READY',
                      },
                    }
                  : j
              )
            );
            setSelectedPackForOverride(null);
          }}
          jobPack={selectedPackForOverride}
        />
      )}
    </div>
  );
}
