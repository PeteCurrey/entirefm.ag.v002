import React from 'react';
import { listDefects } from '@/server/field';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function DefectsPage() {
  const defects = await listDefects();

  const columns: Column<any>[] = [
    {
      header: 'Defect Description',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-white">{row.description}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">{row.category}</div>
        </div>
      ),
    },
    {
      header: 'Severity',
      accessor: (row) => (
        <span
          className={`rounded px-1.5 py-0.2 font-mono text-[9.5px] ${
            row.severity === 'CRITICAL'
              ? 'bg-rose-500/20 text-rose-300'
              : row.severity === 'MAJOR'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-brand-edge-dark text-brand-mist/70'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      header: 'Recommended Action',
      accessor: (row) => (
        <div className="text-[12px] text-brand-mist/80">
          {row.recommended_action || 'Pending Engineering Review'}
        </div>
      ),
    },
    {
      header: 'Current State',
      accessor: (row) => (
        <span className="rounded bg-brand-edge-dark px-2 py-0.5 font-mono text-[10px] text-white">
          {row.current_state}
        </span>
      ),
    },
    {
      header: 'Discovered',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/50">
          {new Date(row.discovered_at).toLocaleDateString('en-GB')}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Operations"
        title="Asset & Site Defects"
        description="Physical flaws, safety hazards, and statutory non-compliances logged from field observations."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-brand-indigo">
            + Log Defect
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={defects}
        searchPlaceholder="Filter defects..."
        searchFilter={(item, q) =>
          item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
        }
        emptyState={
          <EmptyState
            title="No Active Defects"
            description="Defects identified during routine PPM visits, reactive attendances, or statutory inspections will be tracked here."
            actionText="Log New Defect"
            actionHref="/admin/operations/defects"
          />
        }
      />
    </div>
  );
}
