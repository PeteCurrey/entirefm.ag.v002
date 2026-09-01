'use client';

import React from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { EmptyState } from '@/components/admin/EmptyState';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export default function PPMAutopilotClient() {
  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <AdminPageHeader
        category="Planned Maintenance"
        title="PPM Autopilot"
        description="Autonomous statutory maintenance planning, SFG20 task sequencing, and engineer dispatch orchestration."
      />

      {/* ── Metric Summary Bar (Live Status) ─────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: 'Active Autopilot Plans',
            value: '0',
            icon: Zap,
            color: 'text-[#9B9B97]',
          },
          {
            label: 'Scheduled This Week',
            value: '0',
            icon: Calendar,
            color: 'text-[#9B9B97]',
          },
          {
            label: 'Statutory Coverage',
            value: '—',
            icon: ShieldCheck,
            color: 'text-[#9B9B97]',
          },
          {
            label: 'Autonomous Dispatch Rate',
            value: '—',
            icon: CheckCircle2,
            color: 'text-[#9B9B97]',
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-normal uppercase tracking-wider text-[#686866]">
                {m.label}
              </span>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </div>
            <div className="text-[22px] font-light text-[#101010]">{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── Empty State ─────────────────────────────────────────── */}
      <EmptyState
        title="No Active Autopilot Estates"
        description="PPM Autopilot activates automatically when maintenance plans with SFG20 statutory frequencies are approved during estate mobilisation."
        actionText="View Maintenance Plans"
        actionHref="/admin/planned-maintenance/plans"
      />

      {/* ── Quick Navigation ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            href: '/admin/estate/mobilisations',
            title: 'Estate Mobilisations',
            description: 'Import asset registers, run AI column matching, and verify equipment hierarchies prior to Autopilot activation.',
          },
          {
            href: '/admin/planned-maintenance/requirements',
            title: 'Maintenance Standards & SFG20',
            description: 'Review approved statutory frequencies, British Standards, and the full equipment task library.',
          },
          {
            href: '/admin/planned-maintenance/exceptions',
            title: 'PPM Exceptions & SLA Desk',
            description: 'Monitor client access restrictions, asset anomalies, and contractor SLA escalations.',
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-[10px] border border-[#E4E4E1] bg-white p-5 hover:border-[#D1D1CD] hover:shadow-[0_3px_8px_rgba(0,0,0,0.06)] transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13.5px] font-normal text-[#101010] group-hover:text-[#EA580C] transition-colors">
                {link.title}
              </span>
              <ArrowRight className="h-4 w-4 text-[#9B9B97] group-hover:translate-x-0.5 group-hover:text-[#EA580C] transition-all" />
            </div>
            <p className="text-[12px] text-[#686866] leading-relaxed">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
