import React from 'react';
import { listCommunicationThreads } from '@/server/communications';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function CommunicationsPage() {
  const threads = await listCommunicationThreads();

  const columns: Column<any>[] = [
    {
      header: 'Subject / Channel',
      accessor: (row) => (
        <div>
          <div className="font-light text-white">{row.subject}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">
            Type: {row.thread_type}
          </div>
        </div>
      ),
    },
    {
      header: 'Linked Entity',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/70">
          {row.related_object_type ? `${row.related_object_type} · ${row.related_object_id}` : 'General'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`rounded px-2 py-0.5 font-mono text-[10px] ${
            row.status === 'OPEN'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-brand-edge-dark text-brand-mist/70'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Last Active',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/50">
          {new Date(row.updated_at).toLocaleDateString('en-GB', {
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
    <div className="space-y-6">
      <AdminPageHeader
        category="Unified Operations"
        title="Communications & Helpdesk Inbox"
        description="Multi-channel customer, contractor, and engineer communications linked across work orders, sites, quotes, and invoices."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-indigo">
            + New Message Thread
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={threads}
        searchPlaceholder="Search message threads..."
        searchFilter={(item, q) => item.subject.toLowerCase().includes(q)}
        emptyState={
          <EmptyState
            title="Inbox Zero"
            description="Logged phone calls, inbound emails, engineer SMS notes, and client portal chat messages will appear here."
            actionText="Compose Internal Note"
            actionHref="/admin/communications"
          />
        }
      />
    </div>
  );
}
