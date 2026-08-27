'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Plus } from 'lucide-react';

interface Props {
  initialVisits: any[];
}

export function SchedulePageClient({ initialVisits }: Props) {
  const [visits] = useState(initialVisits);

  const columns: Column<any>[] = [
    {
      header: 'Visit No / Scheduled',
      accessor: (row) => (
        <div>
          <div className="font-medium text-[#101010]">Visit #{row.visit_number}</div>
          <div className="font-mono text-[11px] text-[#686866]">
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
        <div className="text-[12.5px] text-[#101010]">
          {row.assigned_resource
            ? `${row.assigned_resource.first_name} ${row.assigned_resource.last_name}`
            : 'Unassigned'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span className="rounded-[4px] bg-[#FAFAF8] px-2 py-0.5 font-mono text-[10px] text-[#101010] border border-[#E4E4E1]">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Site Notes',
      accessor: (row) => (
        <div className="max-w-xs truncate text-[11.5px] text-[#686866]">
          {row.site_notes || '—'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <AdminPageHeader
        category="Operations"
        title="Schedule & Visit Coordination"
        description="Daily and weekly engineer attendance calendar, travel coordination, and planned site visits."
        action={
          <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
            Schedule Visit
          </Button>
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
