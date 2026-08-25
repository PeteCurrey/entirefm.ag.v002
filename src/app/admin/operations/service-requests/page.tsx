import React from 'react';
import { listServiceRequests } from '@/server/work';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { EmptyState } from '@/components/admin/EmptyState';

export const dynamic = 'force-dynamic';

export default async function ServiceRequestsPage() {
  const requests = await listServiceRequests();

  const columns: Column<any>[] = [
    {
      header: 'Reference / Title',
      accessor: (row) => (
        <div>
          <div className="font-light text-white">{row.title}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">{row.reference}</div>
        </div>
      ),
    },
    {
      header: 'Site / Location',
      accessor: (row) => (
        <div className="text-[12px] text-brand-mist/80">
          <div>{row.site?.name || 'Unassigned Site'}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">{row.site?.postcode || ''}</div>
        </div>
      ),
    },
    {
      header: 'Priority / Source',
      accessor: (row) => (
        <div>
          <span
            className={`inline-block rounded px-1.5 py-0.2 font-mono text-[9.5px] ${
              row.priority === 'P1_CRITICAL'
                ? 'bg-rose-500/20 text-rose-300'
                : row.priority === 'P2_HIGH'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-brand-edge-dark text-brand-mist/70'
            }`}
          >
            {row.priority}
          </span>
          <div className="font-mono text-[10.5px] text-brand-mist/40">{row.source}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`rounded px-2 py-0.5 font-mono text-[10px] ${
            row.status === 'NEW'
              ? 'bg-brand-electric/20 text-brand-electric-bright font-light'
              : row.status === 'TRIAGED'
              ? 'bg-purple-500/20 text-purple-300'
              : 'bg-brand-edge-dark text-brand-mist/70'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Reported',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/50">
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
    <div className="space-y-6">
      <AdminPageHeader
        category="Operations"
        title="Service Requests & Triage"
        description="Incoming helpdesk requests, fault logging, initial triage, and work order conversion."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-normal text-white hover:bg-brand-indigo">
            + Log Service Request
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={requests}
        searchPlaceholder="Search service requests by reference, title, site..."
        searchFilter={(item, q) =>
          Boolean(
            item.title.toLowerCase().includes(q) ||
            item.reference.toLowerCase().includes(q) ||
            (item.site?.name && item.site.name.toLowerCase().includes(q))
          )
        }
        emptyState={
          <EmptyState
            title="No Service Requests Logged"
            description="Incoming calls, emails, and portal submissions will appear here for operational triage and conversion into Work Orders."
            actionText="Log First Service Request"
            actionHref="/admin/operations/service-requests"
          />
        }
      />
    </div>
  );
}
