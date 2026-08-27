'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus, X } from 'lucide-react';

interface Props {
  initialRequests: any[];
}

export function ServiceRequestsPageClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'P3_MEDIUM',
    source: 'ADMIN_DESK',
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          priority: form.priority,
          source: form.source,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to log service request.');
      }

      setRequests([data.serviceRequest, ...requests]);
      setIsModalOpen(false);
      setForm({ title: '', description: '', priority: 'P3_MEDIUM', source: 'ADMIN_DESK' });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Reference / Title',
      accessor: (row) => (
        <div>
          <div className="font-medium text-[#101010]">{row.title}</div>
          <div className="font-mono text-[11px] text-[#686866]">{row.reference}</div>
        </div>
      ),
    },
    {
      header: 'Site / Location',
      accessor: (row) => (
        <div className="text-[12px] text-[#101010]">
          <div>{row.site?.name || 'Unassigned Site'}</div>
          <div className="font-mono text-[11px] text-[#686866]">{row.site?.postcode || ''}</div>
        </div>
      ),
    },
    {
      header: 'Priority / Source',
      accessor: (row) => (
        <div>
          <span
            className={`inline-block rounded-[4px] px-1.5 py-0.5 font-mono text-[9.5px] font-medium ${
              row.priority === 'P1_CRITICAL'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : row.priority === 'P2_HIGH'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-[#FAFAF8] text-[#686866] border border-[#E4E4E1]'
            }`}
          >
            {row.priority}
          </span>
          <div className="font-mono text-[10.5px] text-[#686866]">{row.source}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`rounded-[4px] px-2 py-0.5 font-mono text-[10px] font-medium ${
            row.status === 'NEW'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : row.status === 'TRIAGED'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'bg-[#FAFAF8] text-[#686866] border border-[#E4E4E1]'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Reported',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-[#686866]">
          {new Date(row.created_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Operations"
        title="Service Requests & Triage"
        description="Incoming helpdesk requests, fault logging, initial triage, and work order conversion."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            Log Service Request
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={requests}
        searchPlaceholder="Search service requests by reference, title, site..."
        searchFilter={(item, q) =>
          Boolean(
            item.title?.toLowerCase().includes(q) ||
            item.reference?.toLowerCase().includes(q) ||
            item.site?.name?.toLowerCase().includes(q)
          )
        }
        emptyState={
          <EmptyState
            title="Triage Queue Clear"
            description="All reactive helpdesk calls and customer portal tickets have been triaged and scheduled."
            actionText="Log Service Request"
            onActionClick={() => setIsModalOpen(true)}
          />
        }
      />

      {/* Create Service Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E4E4E1] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-light text-[#101010]">Log Service Request</h3>
                <p className="text-xs text-[#686866]">
                  Record an inbound helpdesk fault or client request for triage and assignment.
                </p>
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
                <label className="block text-[#101010] font-medium mb-1">Request Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="e.g. Heating failure — 2nd floor east wing"
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
                  placeholder="Describe the reported fault or request in detail..."
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => set('priority', e.target.value)}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="P1_CRITICAL">P1 Critical</option>
                    <option value="P2_HIGH">P2 High</option>
                    <option value="P3_MEDIUM">P3 Medium</option>
                    <option value="P4_LOW">P4 Low</option>
                    <option value="P5_ROUTINE">P5 Routine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Source</label>
                  <select
                    value={form.source}
                    onChange={(e) => set('source', e.target.value)}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="ADMIN_DESK">Admin Desk</option>
                    <option value="CLIENT_PORTAL">Client Portal</option>
                    <option value="EMAIL">Email</option>
                    <option value="PHONE">Phone</option>
                    <option value="MOBILE_APP">Mobile App</option>
                    <option value="AUTOMATED">Automated (IoT/Sensor)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {isSubmitting ? 'Logging…' : 'Log Service Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
