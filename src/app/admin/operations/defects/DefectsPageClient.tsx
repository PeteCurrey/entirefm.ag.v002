'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus } from 'lucide-react';

interface Props {
  initialDefects: any[];
}

export function DefectsPageClient({ initialDefects }: Props) {
  const [defects] = useState(initialDefects);

  const columns: Column<any>[] = [
    {
      header: 'Defect Description',
      accessor: (row) => (
        <div>
          <div className="font-medium text-[#101010]">{row.description}</div>
          <div className="font-mono text-[11px] text-[#686866]">{row.category}</div>
        </div>
      ),
    },
    {
      header: 'Severity',
      accessor: (row) => (
        <span
          className={`rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-medium ${
            row.severity === 'CRITICAL'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : row.severity === 'MAJOR'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-[#FAFAF8] text-[#686866] border border-[#E4E4E1]'
          }`}
        >
          {row.severity}
        </span>
      ),
    },
    {
      header: 'Recommended Action',
      accessor: (row) => (
        <div className="text-[12px] text-[#686866]">
          {row.recommended_action || 'Pending Engineering Review'}
        </div>
      ),
    },
    {
      header: 'Current State',
      accessor: (row) => (
        <span className="rounded-[4px] bg-[#FAFAF8] px-2 py-0.5 font-mono text-[10.5px] text-[#101010] border border-[#E4E4E1]">
          {row.current_state}
        </span>
      ),
    },
    {
      header: 'Discovered',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-[#686866]">
          {new Date(row.discovered_at).toLocaleDateString('en-GB')}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Operations"
        title="Asset & Site Defects"
        description="Physical flaws, safety hazards, and statutory non-compliances logged from field observations."
        action={
          <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
            Log Defect
          </Button>
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
