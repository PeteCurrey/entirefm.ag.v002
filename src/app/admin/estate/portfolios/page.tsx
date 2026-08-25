import React from 'react';
import { listPortfolios } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function PortfoliosPage() {
  const portfolios = await listPortfolios();

  const columns: Column<any>[] = [
    {
      header: 'Portfolio Name',
      accessor: (row) => (
        <div>
          <div className="font-light text-white">{row.name}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">{row.code}</div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: (row) => (
        <div className="text-[12px] text-brand-mist/70">
          {row.description || 'General estate portfolio'}
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/50">
          {new Date(row.created_at).toLocaleDateString('en-GB')}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Portfolios"
        description="Regional and divisional property groupings across client accounts."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-indigo">
            + New Portfolio
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={portfolios}
        searchPlaceholder="Search portfolios..."
        searchFilter={(item, q) =>
          item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
        }
        emptyState={
          <EmptyState
            title="No Portfolios Configured"
            description="Group client properties into regional portfolios (e.g. North West, Retail Div 1) for regional reporting."
            actionText="Create Portfolio"
            actionHref="/admin/estate/portfolios"
          />
        }
      />
    </div>
  );
}
