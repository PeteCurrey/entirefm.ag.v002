'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

interface Props {
  initialApprovals: any[];
}

export function ApprovalsPageClient({ initialApprovals }: Props) {
  const [approvals, setApprovals] = useState(initialApprovals);

  const columns: Column<any>[] = [
    {
      header: 'Approval Type / Item',
      accessor: (row) => (
        <div>
          <div className="font-medium text-[#101010]">{row.approval_type}</div>
          <div className="font-normal text-[11px] text-[#686866]">Obj: {row.object_type}</div>
        </div>
      ),
    },
    {
      header: 'Amount / Threshold',
      accessor: (row) => (
        <div className="text-[12px] font-medium text-[#101010]">
          {row.threshold_amount_gbp ? `£${Number(row.threshold_amount_gbp).toFixed(2)}` : '—'}
        </div>
      ),
    },
    {
      header: 'Requested Date',
      accessor: (row) => (
        <div className="font-normal text-[11px] text-[#686866]">
          {new Date(row.requested_at).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setApprovals(approvals.filter((a) => a.id !== row.id))}
            className="rounded-[6px] bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            Authorize
          </button>
          <button
            onClick={() => setApprovals(approvals.filter((a) => a.id !== row.id))}
            className="rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-2.5 py-1 text-[11px] text-[#686866] hover:text-[#101010] hover:bg-[#FAFAF8] transition-colors"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Command Centre"
        title="Authorizations & Approvals Centre"
        description="Unified commercial approval queue for customer quotations, purchase orders, cost variations, and completion overrides."
      />

      <DataTable
        columns={columns}
        data={approvals}
        emptyState={
          <EmptyState
            title="Approval Queue Clear"
            description="There are currently no customer quotes, contractor variations, or completion overrides awaiting management sign-off."
            actionText="View Operations Command"
            actionHref="/admin"
          />
        }
      />
    </div>
  );
}
