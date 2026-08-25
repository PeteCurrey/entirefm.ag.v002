import React from 'react';
import { listPendingApprovals } from '@/server/commercial';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const approvals = await listPendingApprovals();

  const columns: Column<any>[] = [
    {
      header: 'Approval Type / Item',
      accessor: (row) => (
        <div>
          <div className="font-light text-white">{row.approval_type}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">Obj: {row.object_type}</div>
        </div>
      ),
    },
    {
      header: 'Amount / Threshold',
      accessor: (row) => (
        <div className="font-mono text-[12px] text-white">
          {row.threshold_amount_gbp ? `£${Number(row.threshold_amount_gbp).toFixed(2)}` : '—'}
        </div>
      ),
    },
    {
      header: 'Requested Date',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/60">
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
      accessor: () => (
        <div className="flex gap-2">
          <button className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-normal text-white hover:bg-emerald-500">
            Authorize
          </button>
          <button className="rounded border border-brand-edge-dark bg-brand-void px-2.5 py-1 text-[11px] text-brand-mist/70 hover:text-white">
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
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
