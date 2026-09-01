'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus, X } from 'lucide-react';

import type { WorkOrder } from '@/server/work';
import type { Site } from '@/server/estate';

interface Props {
  initialWorkOrders: WorkOrder[];
  sites: Site[];
}

const PRIORITY_CLASSES: Record<string, string> = {
  P1_CRITICAL: 'bg-rose-500/20 text-rose-600 border-rose-200',
  P2_HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  P3_MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  P4_LOW: 'bg-slate-50 text-slate-600 border-slate-200',
  P5_ROUTINE: 'bg-[#FAFAF8] text-[#686866] border-[#E4E4E1]',
};

const STATUS_CLASSES: Record<string, string> = {
  OPEN: 'bg-blue-50 text-blue-700 border-blue-200',
  ISSUED: 'bg-purple-50 text-purple-700 border-purple-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function WorkOrdersPageClient({ initialWorkOrders, sites }: Props) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form state
  const [form, setForm] = useState({
    site_id: '',
    title: '',
    description: '',
    work_type: 'REACTIVE_REPAIR',
    priority: 'P3_MEDIUM',
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: form.site_id,
          title: form.title.trim(),
          description: form.description.trim(),
          work_type: form.work_type,
          priority: form.priority,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create work order.');
      }

      setWorkOrders([data.workOrder, ...workOrders]);
      setIsModalOpen(false);
      setForm({
        site_id: '',
        title: '',
        description: '',
        work_type: 'REACTIVE_REPAIR',
        priority: 'P3_MEDIUM',
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = workOrders.filter((wo) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      wo.title?.toLowerCase().includes(q) ||
      wo.work_order_number?.toLowerCase().includes(q) ||
      wo.site?.name?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || wo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Operations"
        title="Work Orders"
        description="Comprehensive reactive and scheduled job lifecycle management across all client estates."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            New Work Order
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#FFFFFF] p-3 rounded-[10px] border border-[#E4E4E1]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by reference, title, site..."
          className="flex-1 rounded-[6px] border border-[#E4E4E1] bg-[#FAFAF8] px-3 py-1.5 text-[12.5px] text-[#101010] placeholder-[#9B9B97] focus:border-[#EA580C] focus:bg-white focus:outline-none"
        />
        <div className="flex items-center gap-1 bg-[#FAFAF8] p-1 rounded-[6px] border border-[#E4E4E1] text-[11.5px]">
          <span className="text-[#9B9B97] px-1 text-[11px] uppercase font-medium">Status:</span>
          {['ALL', 'OPEN', 'ISSUED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-0.5 rounded-[4px] font-medium transition-all ${
                statusFilter === s
                  ? 'bg-[#FFFFFF] text-[#101010] shadow-xs border border-[#E4E4E1]'
                  : 'text-[#686866] hover:text-[#101010]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Work Orders"
          description="Create your first reactive repair or schedule maintenance work order. Every order tracks visits, engineers, tasks, SLAs, and commercial WIP."
          actionText="Create Work Order"
          onActionClick={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-xs">
          <table className="w-full min-w-[64rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E4E4E1] bg-[#FAFAF8] text-[11px] font-normal uppercase tracking-wider text-[#686866]">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Title / Site</th>
                <th className="px-4 py-3">Type / Priority</th>
                <th className="px-4 py-3">SLA Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E1]">
              {filtered.map((wo) => (
                <tr key={wo.id} className="group hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-4 py-3.5 text-[11px] font-medium text-[#101010]">
                    {wo.work_order_number}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-[#101010]">{wo.title}</div>
                    <div className="text-[11.5px] text-[#686866]">
                      {wo.site?.name || 'Site unassigned'}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-normal text-[10.5px] text-[#686866] uppercase">{wo.work_type?.replace(/_/g, ' ')}</div>
                    <span
                      className={`mt-0.5 inline-block rounded border px-1.5 py-0.2 text-[9.5px] font-medium ${
                        PRIORITY_CLASSES[wo.priority] ?? 'bg-[#FAFAF8] text-[#686866] border-[#E4E4E1]'
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-normal text-[11px] text-[#686866]">
                    {wo.sla_resolution_due_at
                      ? new Date(wo.sla_resolution_due_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-medium ${
                        STATUS_CLASSES[wo.status] ?? 'bg-[#FAFAF8] text-[#686866] border-[#E4E4E1]'
                      }`}
                    >
                      {wo.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/admin/operations/work-orders/${wo.id}`}
                      className="text-[11.5px] font-medium text-[#EA580C] hover:underline"
                    >
                      View Order →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E4E4E1] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-light text-[#101010]">Raise Work Order</h3>
                <p className="text-xs text-[#686866]">Log a new reactive or scheduled job against a site.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#9B9B97] hover:text-[#101010]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="rounded-[6px] border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#101010] font-medium mb-1">Site *</label>
                <select
                  required
                  value={form.site_id}
                  onChange={(e) => set('site_id', e.target.value)}
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="">— Select site —</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.site_code ? `(${s.site_code})` : ''}
                    </option>
                  ))}
                </select>
                {sites.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    No sites available. Register a site first under Estate → Managed Sites.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Boiler pressure fault — 3rd floor plant room"
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the fault, scope, or required works in detail..."
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Work Type</label>
                  <select
                    value={form.work_type}
                    onChange={(e) => set('work_type', e.target.value)}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="REACTIVE_REPAIR">Reactive Repair</option>
                    <option value="PLANNED_PREVENTIVE">Planned Preventive</option>
                    <option value="INSPECTION">Inspection</option>
                    <option value="INSTALLATION">Installation</option>
                    <option value="PROJECT_WORKS">Project Works</option>
                    <option value="STATUTORY">Statutory</option>
                    <option value="IMPROVEMENT">Improvement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => set('priority', e.target.value)}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="P1_CRITICAL">P1 Critical (4 hrs)</option>
                    <option value="P2_HIGH">P2 High (8 hrs)</option>
                    <option value="P3_MEDIUM">P3 Medium (24 hrs)</option>
                    <option value="P4_LOW">P4 Low (5 days)</option>
                    <option value="P5_ROUTINE">P5 Routine (Planned)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {isSubmitting ? 'Creating…' : 'Raise Work Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
