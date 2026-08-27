'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
} from 'lucide-react';
import { SupplierComplianceReviewModal } from './SupplierComplianceReviewModal';

interface Props {
  suppliers: any[];
  activeHolds: any[];
  openRemediation: any[];
  pendingDocuments: any[];
}

export function AdminComplianceControlClient({
  suppliers,
  activeHolds,
  openRemediation,
  pendingDocuments: initialPending,
}: Props) {
  const [pendingDocs, setPendingDocs] = useState(initialPending);
  const [selectedDocForReview, setSelectedDocForReview] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredSuppliers = suppliers.filter((s) => {
    if (statusFilter !== 'ALL' && s.compliance_status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        s.legal_name?.toLowerCase().includes(q) ||
        s.trading_name?.toLowerCase().includes(q) ||
        s.id?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-light">
            STATUTORY ASSURANCE &amp; CONTINUOUS COMPLIANCE
          </span>
          <h1 className="text-2xl font-extralight text-slate-900 mt-1">
            Supplier Compliance &amp; Document Control
          </h1>
          <p className="text-xs text-slate-600 font-light mt-1">
            Proactive monitoring of supplier compliance status, document verifications, holds, and operational restrictions.
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">APPROVED SUPPLIERS</span>
          <div className="text-2xl font-mono font-light text-emerald-600">
            {suppliers.filter((s) => s.compliance_status === 'APPROVED').length}
          </div>
          <span className="text-[10.5px] font-mono text-slate-500">Active Work Eligible</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">DOCUMENTS AWAITING REVIEW</span>
          <div className="text-2xl font-mono font-light text-cyan-600">{pendingDocs.length}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Verification Queue</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">ACTIVE COMPLIANCE HOLDS</span>
          <div className="text-2xl font-mono font-light text-rose-600">{activeHolds.length}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Operational Restrictions</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">OPEN REMEDIATION</span>
          <div className="text-2xl font-mono font-light text-amber-600">{openRemediation.length}</div>
          <span className="text-[10.5px] font-mono text-slate-500">Actions Pending</span>
        </div>
      </div>

      {/* 3. Pending Document Verification Queue */}
      {pendingDocs.length > 0 && (
        <div className="bg-white border border-cyan-200 rounded-sm shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Documents Awaiting EntireFM Verification ({pendingDocs.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Review &amp; Verify</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-cyan-50/50 border-b border-cyan-100 text-slate-600 uppercase text-[10.5px]">
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3">Document Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Uploaded</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {doc.supplierName || doc.supplier_id}
                    </td>
                    <td className="py-3 px-3 text-slate-800">{doc.documentTitle || doc.file_name}</td>
                    <td className="py-3 px-3 text-slate-500 uppercase text-[10px]">{doc.category}</td>
                    <td className="py-3 px-3 font-mono">{doc.expiry_date || '—'}</td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(doc.uploaded_at || doc.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedDocForReview(doc)}
                        className="btn-primary text-xs py-1 px-3 bg-cyan-700 hover:bg-cyan-800 text-white font-medium"
                      >
                        Review &amp; Verify &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Active Compliance Holds & Restrictions */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-normal uppercase tracking-wider text-slate-900">
            Active Compliance Holds &amp; Service Restrictions
          </h3>
          <span className="text-xs font-mono font-light px-2 py-0.5 rounded bg-rose-100 text-rose-800">
            {activeHolds.length} Active
          </span>
        </div>

        {activeHolds.length === 0 ? (
          <p className="py-6 text-center text-slate-500 text-xs font-light">
            No active compliance holds across the supplier network. All approved suppliers are in good standing.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                  <th className="py-2.5 px-3">Supplier ID</th>
                  <th className="py-2.5 px-3">Scope</th>
                  <th className="py-2.5 px-3">Hold Reason</th>
                  <th className="py-2.5 px-3">Raised By</th>
                  <th className="py-2.5 px-3">Resolution Required</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeHolds.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-light text-slate-900">{h.supplier_id}</td>
                    <td className="py-3 px-3">
                      <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-light">
                        {h.hold_scope}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-rose-700 font-light">{h.hold_reason}</td>
                    <td className="py-3 px-3 text-slate-600">{h.raised_by}</td>
                    <td className="py-3 px-3 text-slate-700 font-sans max-w-sm">{h.resolution_required}</td>
                    <td className="py-3 px-3 text-right">
                      <Link href={`/admin/suppliers/${h.supplier_id}`} className="btn-primary text-xs py-1 px-2.5">
                        Manage Hold &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedDocForReview && (
        <SupplierComplianceReviewModal
          isOpen={!!selectedDocForReview}
          onClose={() => setSelectedDocForReview(null)}
          onSuccess={() => {
            setPendingDocs((prev) => prev.filter((d) => d.id !== selectedDocForReview.id));
            setSelectedDocForReview(null);
          }}
          supplierId={selectedDocForReview.supplier_id}
          documentId={selectedDocForReview.id}
          documentTitle={selectedDocForReview.documentTitle || selectedDocForReview.file_name}
          fileName={selectedDocForReview.file_name}
          expiryDate={selectedDocForReview.expiry_date}
          currentStatus={selectedDocForReview.status}
        />
      )}
    </div>
  );
}
