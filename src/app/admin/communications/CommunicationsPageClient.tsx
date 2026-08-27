'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus } from 'lucide-react';

interface Props {
  initialThreads: any[];
}

export function CommunicationsPageClient({ initialThreads }: Props) {
  const [threads] = useState(initialThreads);

  const columns: Column<any>[] = [
    {
      header: 'Subject / Channel',
      accessor: (row) => (
        <div>
          <div className="font-medium text-[#101010]">{row.subject}</div>
          <div className="font-mono text-[11px] text-[#686866]">Type: {row.thread_type}</div>
        </div>
      ),
    },
    {
      header: 'Linked Entity',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-[#686866]">
          {row.related_object_type ? `${row.related_object_type} · ${row.related_object_id}` : 'General'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`rounded-[4px] px-2 py-0.5 font-mono text-[10px] font-medium ${
            row.status === 'OPEN'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-[#FAFAF8] text-[#686866] border border-[#E4E4E1]'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Last Active',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-[#686866]">
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
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Unified Operations"
        title="Communications & Helpdesk Inbox"
        description="Multi-channel customer, contractor, and engineer communications linked across work orders, sites, quotes, and invoices."
        action={
          <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
            New Message Thread
          </Button>
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
