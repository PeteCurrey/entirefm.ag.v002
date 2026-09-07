'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, AlertTriangle, ArrowLeft, Loader2, CheckCircle2, FileText, Receipt, Plus } from 'lucide-react';

interface Props {
  workOrderId: string;
  workOrderNumber: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'ISSUED', label: 'Issued' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function WorkOrderDetailActions({ workOrderId, workOrderNumber, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setIsUpdatingStatus(true);
    setError(null);
    setStatusSuccess(false);

    try {
      const res = await fetch(`/api/admin/work-orders/${encodeURIComponent(workOrderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update work order status.');
      }

      setStatus(newStatus);
      setStatusSuccess(true);
      router.refresh();
      setTimeout(() => setStatusSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/work-orders/${encodeURIComponent(workOrderId)}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete work order.');
      }

      router.push('/admin/operations/work-orders');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete work order.');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-4 border-b border-[#E8E8E5]">
        <Link
          href="/admin/operations/work-orders"
          className="inline-flex items-center gap-1.5 text-xs text-[#6D6D68] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Work Orders
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Contextual Workflow: Create Quote */}
          <Link
            href={`/admin/commercial/quotes?create=true&workOrderId=${encodeURIComponent(workOrderId)}&ref=${encodeURIComponent(workOrderNumber)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-[#111111] bg-white hover:bg-[#F5F5F3] border border-[#E8E8E5] shadow-2xs transition-all hover:-translate-y-0.5"
            title="Create a proposal or variation quote for this work order"
          >
            <FileText className="h-3.5 w-3.5 text-[#EA580C]" />
            <span>Create Quote</span>
          </Link>

          {/* Contextual Workflow: Create Invoice */}
          <Link
            href={`/admin/finance/client-invoices?create=true&workOrderId=${encodeURIComponent(workOrderId)}&ref=${encodeURIComponent(workOrderNumber)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-white bg-[#EA580C] hover:bg-[#C2410C] shadow-2xs transition-all hover:-translate-y-0.5"
            title="Generate client billing invoice for this work order"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Create Invoice</span>
          </Link>

          <div className="h-4 w-px bg-[#E8E8E5] mx-1" />

          {/* Status Changer */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E8E8E5] px-2.5 py-1 rounded-lg shadow-2xs">
            <span className="text-[11px] text-[#9A9A95] uppercase tracking-wider font-medium">
              Status:
            </span>
            <select
              value={status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent text-xs text-[#111111] font-medium border-0 outline-none cursor-pointer focus:ring-0"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-[#111111]">
                  {opt.label}
                </option>
              ))}
            </select>
            {isUpdatingStatus && <Loader2 className="h-3 w-3 animate-spin text-[#EA580C]" />}
            {statusSuccess && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-normal text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            title="Delete this work order"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Order
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-800/40 bg-rose-950/60 p-3 text-xs text-rose-200 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-full bg-rose-950/60 border border-rose-800/50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#111111]">Delete Work Order</h3>
                <p className="text-xs text-zinc-400">{workOrderNumber}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete work order <span className="text-[#111111] font-medium">{workOrderNumber}</span>?
              This will permanently remove the record and unlink any related activities. This action cannot be undone.
            </p>

            {error && (
              <div className="rounded border border-rose-800/50 bg-rose-950/60 p-2.5 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Deleting…
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
