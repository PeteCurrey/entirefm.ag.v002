'use client';

import React from 'react';
import { Users, Building2, Wrench, Layers, CheckCircle2, Clock, Database } from 'lucide-react';
import Link from 'next/link';
import { DataStatusSummary } from '@/server/data-import/types';

interface DataStatusPanelProps {
  status: DataStatusSummary;
}

export function DataStatusPanel({ status }: DataStatusPanelProps) {
  const metrics = [
    { label: 'Client Accounts', value: status.clientsCount, icon: Users, href: '/admin/estate/clients' },
    { label: 'Sites / Facilities', value: status.sitesCount, icon: Building2, href: '/admin/estate/sites' },
    { label: 'Contractors', value: status.contractorsCount, icon: Wrench, href: '/admin/estate/contractors' },
    { label: 'Assets', value: status.assetsCount, icon: Layers, href: '/admin/estate/assets' },
  ];

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#101010] text-white">
            <Database className="h-3.5 w-3.5" />
          </div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
            LIVE DATA STATUS — PRODUCTION RECORDS
          </h3>
        </div>
        {status.mockRecordsCount > 0 && (
          <span className="rounded-[5px] bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#DC2626]">
            {status.mockRecordsCount} MOCK RECORDS DETECTED
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          {metrics.map(({ label, value, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-[12px] border border-[#E4E4E1] bg-[#F9F9F8] p-3.5 text-center hover:border-[#D0D0CD] hover:bg-[#F0F0EE] transition-all group"
            >
              <Icon className="h-4 w-4 text-[#686866] mx-auto mb-2 group-hover:text-[#FF6B24] transition-colors" />
              <div className={`text-[24px] font-light tabular-nums ${value > 0 ? 'text-[#101010]' : 'text-[#9B9B97]'}`}>
                {value}
              </div>
              <div className="text-[10.5px] uppercase text-[#9B9B97] mt-0.5 leading-tight">{label}</div>
            </Link>
          ))}
        </div>

        {/* Import Activity Sidebar */}
        <div className="flex items-center justify-between rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />
              <span className="text-[12.5px] text-[#101010]">
                <span className="font-semibold">{status.completedBatches}</span> import{status.completedBatches !== 1 ? 's' : ''} completed
              </span>
            </div>
            {status.pendingBatches > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#D97706]" />
                <span className="text-[12.5px] text-[#D97706]">
                  <span className="font-semibold">{status.pendingBatches}</span> pending
                </span>
              </div>
            )}
          </div>
          <Link
            href="/admin/platform/imports/history"
            className="text-[12px] font-medium text-[#FF6B24] hover:text-[#E9540F] transition-colors"
          >
            View History →
          </Link>
        </div>

        {/* Empty-state guarantee */}
        {status.clientsCount === 0 && status.sitesCount === 0 && status.contractorsCount === 0 && (
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFBEB] border-[#FDE68A] p-3.5 text-[12.5px] text-[#B45309]">
            <strong className="font-semibold text-[#92400E]">Empty operational database.</strong>{' '}
            Import clients, sites, and contractors from SimPRO CSV exports or add records manually.
          </div>
        )}
      </div>
    </div>
  );
}
