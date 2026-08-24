import React from 'react';
import Link from 'next/link';
import { getCurrentSession } from '@/server/identity';
import { listImportBatches, getDataStatus } from '@/server/data-import';
import { ImportHistoryTable } from '@/components/admin/imports/ImportHistoryTable';
import { DataStatusPanel } from '@/components/admin/imports/DataStatusPanel';
import { EmptyImportState } from '@/components/admin/imports/EmptyImportState';
import { FileUp, ArrowRight, Users, Building2, Wrench } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ImportCentrePage() {
  const session = await getCurrentSession();
  if (!session) return null;

  let batches: any[] = [];
  let status: any = {
    clientsCount: 0, sitesCount: 0, contractorsCount: 0, assetsCount: 0,
    mockRecordsCount: 0, totalImportBatches: 0, completedBatches: 0, pendingBatches: 0,
  };

  try {
    [batches, status] = await Promise.all([
      listImportBatches(session),
      getDataStatus(session),
    ]);
  } catch (_) {}

  const recentBatches = batches.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#101010]">SimPRO Migration Centre</h1>
          <p className="text-[13.5px] text-[#686866] mt-0.5">
            Import clients, sites, and contractors from SimPRO CSV exports into EntireCAFM.
          </p>
        </div>
        <Link
          href="/admin/platform/imports/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#FF6B24] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#E9540F] transition-colors shadow-sm shrink-0"
        >
          <FileUp className="h-4 w-4" />
          New Import
        </Link>
      </div>

      {/* Data Status */}
      <DataStatusPanel status={status} />

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Users, label: 'Import Clients', description: 'Upload SimPRO Customer export (CSV) to create EntireCAFM client accounts.',
            entityType: 'CLIENT', color: 'bg-[#1D4ED8]',
          },
          {
            icon: Building2, label: 'Import Sites', description: 'Upload SimPRO Site export (CSV) to create facilities under existing clients.',
            entityType: 'SITE', color: 'bg-[#15803D]',
          },
          {
            icon: Wrench, label: 'Import Contractors', description: 'Upload SimPRO Supplier export to stage contractors for vetting.',
            entityType: 'CONTRACTOR', color: 'bg-[#D97706]',
          },
        ].map(({ icon: Icon, label, description, entityType, color }) => (
          <Link
            key={entityType}
            href={`/admin/platform/imports/new?type=${entityType}`}
            className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-5 hover:border-[#D0D0CD] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all group"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${color} text-white mb-4`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <h3 className="font-semibold text-[#101010] text-[14px] group-hover:text-[#FF6B24] transition-colors">{label}</h3>
            <p className="text-[12.5px] text-[#686866] mt-1 leading-relaxed">{description}</p>
            <div className="flex items-center gap-1 mt-3 text-[12px] font-medium text-[#FF6B24]">
              Start <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Import History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866]">RECENT IMPORTS</h2>
          <Link href="/admin/platform/imports/history" className="text-[12px] font-medium text-[#FF6B24] hover:underline">
            View All →
          </Link>
        </div>
        {recentBatches.length === 0 ? <EmptyImportState /> : <ImportHistoryTable batches={recentBatches} />}
      </div>
    </div>
  );
}
