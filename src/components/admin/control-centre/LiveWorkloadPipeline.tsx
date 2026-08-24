'use client';

import React from 'react';
import { ArrowRight, Layers, CheckCircle, Clock, AlertTriangle, UserX, PauseCircle } from 'lucide-react';
import Link from 'next/link';

export interface WorkloadStateCount {
  unassigned: number;
  scheduled: number;
  inProgress: number;
  awaitingParts: number;
  awaitingClient: number;
  completedToday: number;
}

interface LiveWorkloadPipelineProps {
  counts: WorkloadStateCount | null;
  activeState?: string | null;
  onStateSelect?: (stateKey: string) => void;
}

export function LiveWorkloadPipeline({
  counts,
  activeState,
  onStateSelect,
}: LiveWorkloadPipelineProps) {
  const data: WorkloadStateCount = counts ?? {
    unassigned: 0,
    scheduled: 0,
    inProgress: 0,
    awaitingParts: 0,
    awaitingClient: 0,
    completedToday: 0,
  };

  const steps = [
    { key: 'unassigned', label: 'Unassigned', count: data.unassigned, icon: UserX, alert: data.unassigned > 5, color: 'text-[#B45309]' },
    { key: 'scheduled', label: 'Scheduled', count: data.scheduled, icon: Clock, alert: false, color: 'text-[#1D4ED8]' },
    { key: 'in_progress', label: 'In Progress', count: data.inProgress, icon: Layers, alert: false, color: 'text-[#FF6B24]' },
    { key: 'awaiting_parts', label: 'Awaiting Parts', count: data.awaitingParts, icon: PauseCircle, alert: data.awaitingParts > 2, color: 'text-[#686866]' },
    { key: 'awaiting_client', label: 'Awaiting Client', count: data.awaitingClient, icon: AlertTriangle, alert: false, color: 'text-[#686866]' },
    { key: 'completed_today', label: 'Completed Today', count: data.completedToday, icon: CheckCircle, alert: false, color: 'text-[#15803D]' },
  ];

  const totalActive = data.unassigned + data.scheduled + data.inProgress + data.awaitingParts + data.awaitingClient;
  const noData = counts === null;

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#FF6B24] text-white">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              LIVE WORKLOAD PIPELINE
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              {noData
                ? 'Work order pipeline stages'
                : totalActive > 0
                ? `${totalActive} active work orders across pipeline`
                : 'No active work orders'}
            </p>
          </div>
        </div>
        <Link href="/admin/operations/work-orders" className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#FF6B24] hover:text-[#E9540F] transition-colors">
          <span>Full Workload</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="p-5">
        <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeState === step.key;
            return (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => onStateSelect?.(step.key)}
                  className={`flex flex-col items-center justify-between rounded-[12px] border p-3.5 min-w-[90px] transition-all ${
                    isActive
                      ? 'border-[#FF6B24] bg-[#FFF7F3] shadow-[0_0_0_2px_rgba(255,107,36,0.15)]'
                      : 'border-[#E4E4E1] bg-[#F9F9F8] hover:border-[#D0D0CD]'
                  }`}
                >
                  <Icon className={`h-4 w-4 mb-2 ${step.alert && step.count > 0 ? 'text-[#DC2626]' : step.color}`} />
                  <div className={`font-mono text-[20px] font-light tabular-nums ${
                    noData ? 'text-[#C0C0BD]' : step.alert && step.count > 0 ? 'text-[#DC2626]' : step.color
                  }`}>
                    {step.count}
                  </div>
                  <div className="text-[9.5px] uppercase tracking-wider text-[#9B9B97] mt-1 text-center leading-tight">
                    {step.label}
                  </div>
                </button>
                {i < steps.length - 1 && (
                  <div className="flex items-center shrink-0">
                    <ArrowRight className="h-4 w-4 text-[#D0D0CD]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {noData && (
          <p className="text-center text-[12px] text-[#9B9B97] mt-3">
            Work order data will appear here once operations are active.
          </p>
        )}
      </div>
    </div>
  );
}
