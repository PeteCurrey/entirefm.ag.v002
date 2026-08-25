import React from 'react';
import { listContracts } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ContractsPage() {
  const contracts = await listContracts();

  const columns: Column<any>[] = [
    {
      header: 'Contract Ref / Title',
      accessor: (row) => (
        <div>
          <div className="font-light text-white">{row.name}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">{row.contract_reference}</div>
        </div>
      ),
    },
    {
      header: 'Client Account',
      accessor: (row) => (
        <div className="text-[12px] text-brand-mist/80">
          {row.client_account?.name || '—'}
        </div>
      ),
    },
    {
      header: 'Scope / Billing',
      accessor: (row) => (
        <div>
          <div className="font-mono text-[11px] text-white">{row.contract_type}</div>
          <div className="text-[11px] text-brand-mist/50">{row.billing_method}</div>
        </div>
      ),
    },
    {
      header: 'Term Dates',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/60">
          {row.start_date} → {row.end_date}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`rounded px-2 py-0.5 font-mono text-[10px] ${
            row.status === 'ACTIVE'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Contracts & SLA Agreements"
        description="Active commercial terms, service levels, operational scopes, and rate card assignments."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-indigo">
            + New Contract
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={contracts}
        searchPlaceholder="Search contracts by reference or name..."
        searchFilter={(item, q) =>
          item.name.toLowerCase().includes(q) ||
          item.contract_reference.toLowerCase().includes(q)
        }
        emptyState={
          <EmptyState
            title="No Active Contracts"
            description="Create your first client FM contract defining reactive response SLAs, billing methods, and contractor restrictions."
            actionText="Create Contract"
            actionHref="/admin/estate/contracts"
          />
        }
      />
    </div>
  );
}
