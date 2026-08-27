'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Shield,
  Download,
  MapPin,
  User,
} from 'lucide-react';
import { JobPackRecord } from '@/server/contractor/job-pack-engine';

interface Props {
  initialJobPacks: JobPackRecord[];
  contractorOrgId: string;
}

export function JobPacksDashboardClient({ initialJobPacks, contractorOrgId }: Props) {
  const [jobPacks, setJobPacks] = useState<JobPackRecord[]>(initialJobPacks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filtered = jobPacks.filter((jp) => {
    if (selectedStatus === 'READY' && !jp.readiness.isReadyForAttendance) return false;
    if (selectedStatus === 'ACTION_REQUIRED' && jp.readiness.isReadyForAttendance) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        jp.id.toLowerCase().includes(q) ||
        jp.workOrderNumber.toLowerCase().includes(q) ||
        jp.siteName.toLowerCase().includes(q) ||
        jp.clientName.toLowerCase().includes(q) ||
        jp.trade.toLowerCase().includes(q) ||
        jp.assignedOperative?.fullName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalCount = jobPacks.length;
  const readyCount = jobPacks.filter((jp) => jp.readiness.isReadyForAttendance).length;
  const actionRequiredCount = totalCount - readyCount;

  return (
    <div className="space-y-6">
      {/* Metric Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">ACTIVE JOB PACKS</span>
          <p className="text-2xl font-light text-white mt-1">{totalCount}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Allocated work orders</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">READY FOR ATTENDANCE</span>
          <p className="text-2xl font-light text-emerald-400 mt-1">{readyCount}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">All gates cleared</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">ACTION REQUIRED</span>
          <p className={`text-2xl font-light mt-1 ${actionRequiredCount > 0 ? 'text-amber-400' : 'text-white'}`}>
            {actionRequiredCount}
          </p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">RAMS / Operative / Permits</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">READINESS RATE</span>
          <p className="text-2xl font-light text-cyan-400 mt-1">
            {totalCount > 0 ? `${Math.round((readyCount / totalCount) * 100)}%` : '100%'}
          </p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Compliance safety score</span>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-edge-dark pb-3">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 text-brand-mist/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job packs by ID, site, operative..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-carbon border border-brand-edge-dark text-white text-xs placeholder:text-brand-mist/40 focus:border-brand-electric focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-brand-mist/50">Readiness:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-brand-carbon border border-brand-edge-dark text-white text-xs focus:outline-none focus:border-brand-electric"
          >
            <option value="ALL">All States</option>
            <option value="READY">Ready for Attendance</option>
            <option value="ACTION_REQUIRED">Action Required</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-brand-void/90 border-b border-brand-edge-dark text-brand-mist/60 uppercase text-[10px]">
                <th className="py-3 px-4">Job Pack Ref</th>
                <th className="py-3 px-4">Work Order &amp; Trade</th>
                <th className="py-3 px-4">Assigned Operative</th>
                <th className="py-3 px-4">Site &amp; Planned Date</th>
                <th className="py-3 px-4">Readiness Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brand-mist/50 font-sans text-xs">
                    No active Job Packs found.
                  </td>
                </tr>
              ) : (
                filtered.map((jp) => (
                  <tr key={jp.id} className="hover:bg-brand-edge-dark/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      <Link
                        href={`/contractor/job-packs/${encodeURIComponent(jp.id)}`}
                        className="hover:text-brand-electric-bright transition-colors"
                      >
                        {jp.id}
                      </Link>
                      <span className="text-[10px] text-brand-mist/40 block font-normal">v{jp.version}</span>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <span className="font-medium block">{jp.workOrderNumber}</span>
                      <span className="text-[10px] text-brand-mist/50 block">{jp.trade}</span>
                    </td>
                    <td className="py-3 px-4 text-brand-mist">
                      <span className="text-white block">{jp.assignedOperative?.fullName || 'Unassigned'}</span>
                      <span className="text-[10.5px] text-brand-mist/50 block">
                        {jp.assignedOperative?.jobTitle || 'Field Team'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-brand-mist">
                      <span className="text-white block">{jp.siteName}</span>
                      <span className="text-[10.5px] text-brand-mist/50 block">
                        {jp.plannedAttendanceDate} ({jp.plannedAttendanceTime})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] border ${
                          jp.readiness.isReadyForAttendance
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
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
                          className="p-1.5 rounded hover:bg-brand-edge-dark text-brand-mist hover:text-white transition-colors"
                          title="Print / View PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/contractor/job-packs/${encodeURIComponent(jp.id)}`}
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
