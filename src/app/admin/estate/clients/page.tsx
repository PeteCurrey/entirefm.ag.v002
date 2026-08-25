import React from 'react';
import { listClientAccounts } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await listClientAccounts();

  const columns: Column<any>[] = [
    {
      header: 'Account / Reference',
      accessor: (row) => (
        <div>
          <div className="font-light text-white">{row.name}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">{row.account_number}</div>
        </div>
      ),
    },
    {
      header: 'Tier / Status',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-brand-edge-dark px-1.5 py-0.5 font-mono text-[10px] text-brand-mist/80">
            {row.account_tier}
          </span>
          <span
            className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
              row.account_status === 'ACTIVE'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            {row.account_status}
          </span>
        </div>
      ),
    },
    {
      header: 'Account Manager',
      accessor: (row) => (
        <div className="text-[12px] text-brand-mist/70">
          {row.account_manager
            ? `${row.account_manager.first_name} ${row.account_manager.last_name}`
            : 'Unassigned'}
        </div>
      ),
    },
    {
      header: 'Contact Email',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/60">
          {row.organisation?.email || '—'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Client Accounts"
        description="Comprehensive client organisations, commercial agreements, contracts, and managed property portfolios."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-indigo">
            + New Client Account
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder="Search clients by name, account number..."
        searchFilter={(item, q) =>
          item.name.toLowerCase().includes(q) || item.account_number.toLowerCase().includes(q)
        }
        emptyState={
          <EmptyState
            title="No Client Accounts"
            description="Create your first client account to link contracts, portfolios, sites, and service requests."
            actionText="Add Client Account"
            actionHref="/admin/estate/clients"
          />
        }
      />
    </div>
  );
}
