import React from 'react';
import { listVisits } from '@/server/work';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const visits = await listVisits();

  const columns: Column<any>[] = [
    {
      header: 'Visit No / Scheduled',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-white">Visit #{row.visit_number}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">
            {row.scheduled_start_at
              ? new Date(row.scheduled_start_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Unscheduled'}
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Engineer / Resource',
      accessor: (row) => (
        <div className="text-[12px] text-brand-mist/80">
          {row.assigned_resource
            ? `${row.assigned_resource.first_name} ${row.assigned_resource.last_name}`
            : 'Unassigned'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span className="rounded bg-brand-edge-dark px-2 py-0.5 font-mono text-[10px] text-brand-mist/80">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Site Notes',
      accessor: (row) => (
        <div className="max-w-xs truncate text-[11.5px] text-brand-mist/60">
          {row.site_notes || '—'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Operations"
        title="Schedule & Visit Coordination"
        description="Daily and weekly engineer attendance calendar, travel coordination, and planned site visits."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-brand-indigo">
            + Schedule Visit
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={visits}
        searchPlaceholder="Filter scheduled visits..."
        emptyState={
          <EmptyState
            title="No Scheduled Visits"
            description="Visits booked by dispatchers or scheduled automatically from PPM maintenance contracts will appear here."
            actionText="Schedule First Visit"
            actionHref="/admin/operations/schedule"
          />
        }
      />
    </div>
  );
}
