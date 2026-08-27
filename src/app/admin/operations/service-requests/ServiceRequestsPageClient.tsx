'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus } from 'lucide-react';

interface Props {
  initialRequests: any[];
}

export function ServiceRequestsPageClient({ initialRequests }: Props) {
  const [requests] = useState(initialRequests);

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
          <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
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
            actionHref="/admin/operations/service-requests"
          />
        }
      />
    </div>
  );
}
