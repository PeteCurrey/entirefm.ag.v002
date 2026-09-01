'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Building2,
  Filter,
} from 'lucide-react';
import { AdminOperativeApprovalModal } from './AdminOperativeApprovalModal';

interface Props {
  suppliers: any[];
  initialResources: any[];
}

export function AdminWorkforceClient({ suppliers, initialResources }: Props) {
  const [resources, setResources] = useState<any[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('ALL');
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('ALL');
  const [selectedResourceForApproval, setSelectedResourceForApproval] = useState<any | null>(null);

  const filtered = resources.filter((r) => {
    if (selectedSupplierId !== 'ALL' && r.provider_org_id !== selectedSupplierId) return false;
    if (selectedApprovalStatus !== 'ALL') {
      const st = r.entirefm_approval_status || 'APPROVED';
      if (st !== selectedApprovalStatus) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const person = r.person || {};
      const match =
        person.first_name?.toLowerCase().includes(q) ||
        person.last_name?.toLowerCase().includes(q) ||
        person.email?.toLowerCase().includes(q) ||
        r.job_title?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalOperatives = resources.length;
  const approvedCount = resources.filter((r) => (r.entirefm_approval_status || 'APPROVED') === 'APPROVED').length;
  const pendingReviewCount = resources.filter((r) => r.entirefm_approval_status === 'CONTRACTOR_ADDED' || r.entirefm_approval_status === 'ENTIREFM_REVIEW_REQUIRED').length;
  const restrictedCount = resources.filter((r) => r.entirefm_approval_status === 'APPROVED_WITH_RESTRICTIONS' || r.entirefm_approval_status === 'REJECTED' || r.entirefm_approval_status === 'SUSPENDED').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">NETWORK OPERATIVES</span>
          <div className="text-2xl font-light text-slate-900">{totalOperatives}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Registered Field Personnel</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">ENTIREFM APPROVED</span>
          <div className="text-2xl font-light text-emerald-600">{approvedCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Site Attendance Cleared</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">AWAITING VETTING REVIEW</span>
          <div className="text-2xl font-light text-cyan-600">{pendingReviewCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">New Operative Queue</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">RESTRICTED / SUSPENDED</span>
          <div className="text-2xl font-light text-rose-600">{restrictedCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Attendance Barred</span>
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
            placeholder="Search operatives by name or role..."
            className="w-full pl-9 pr-3 py-1.5 rounded border border-slate-200 text-xs font-normal focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-normal">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Contractor:</span>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="p-1.5 rounded border border-slate-200 bg-white"
            >
              <option value="ALL">All Contractors</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Approval:</span>
            <select
              value={selectedApprovalStatus}
              onChange={(e) => setSelectedApprovalStatus(e.target.value)}
              className="p-1.5 rounded border border-slate-200 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="CONTRACTOR_ADDED">Contractor Added</option>
              <option value="ENTIREFM_REVIEW_REQUIRED">Review Required</option>
              <option value="APPROVED_WITH_RESTRICTIONS">Restricted</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Operatives Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-normal border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Operative</th>
                <th className="py-3 px-4">Employer Contractor</th>
                <th className="py-3 px-4">Role &amp; Trades</th>
                <th className="py-3 px-4">EntireFM Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No matching operatives found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const person = r.person || {};
                  const org = r.provider_organisation || {};
                  const trades = Array.isArray(r.trades_json) ? r.trades_json : [];
                  const st = r.entirefm_approval_status || 'APPROVED';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {person.first_name} {person.last_name}
                        <span className="text-[10px] text-slate-500 block font-normal">{person.email}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {org.name || 'Contractor Org'}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="block font-medium">{person.job_title || r.job_title || 'Field Engineer'}</span>
                        <span className="text-[10px] text-slate-500 block">{trades.join(', ') || 'General'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-normal border ${
                            st === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : st === 'APPROVED_WITH_RESTRICTIONS'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : st === 'REJECTED' || st === 'SUSPENDED'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          }`}
                        >
                          {st}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedResourceForApproval(r)}
                          className="btn-primary text-xs py-1 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                        >
                          Review &amp; Vet &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Modal */}
      {selectedResourceForApproval && (
        <AdminOperativeApprovalModal
          isOpen={!!selectedResourceForApproval}
          onClose={() => setSelectedResourceForApproval(null)}
          onSuccess={() => {
            setResources((prev) =>
              prev.map((r) =>
                r.id === selectedResourceForApproval.id
                  ? { ...r, entirefm_approval_status: 'APPROVED' }
                  : r
              )
            );
            setSelectedResourceForApproval(null);
          }}
          operativeId={selectedResourceForApproval.id}
          operativeName={`${selectedResourceForApproval.person?.first_name || ''} ${selectedResourceForApproval.person?.last_name || ''}`}
          contractorName={selectedResourceForApproval.provider_organisation?.name || 'Contractor'}
          currentStatus={selectedResourceForApproval.entirefm_approval_status || 'APPROVED'}
        />
      )}
    </div>
  );
}
