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
    { key: 'in_progress', label: 'In Progress', count: data.inProgress, icon: Layers, alert: false, color: 'text-[#EA580C]' },
    { key: 'awaiting_parts', label: 'Awaiting Parts', count: data.awaitingParts, icon: PauseCircle, alert: data.awaitingParts > 2, color: 'text-[#6D6D68]' },
    { key: 'awaiting_client', label: 'Awaiting Client', count: data.awaitingClient, icon: AlertTriangle, alert: false, color: 'text-[#6D6D68]' },
    { key: 'completed_today', label: 'Completed Today', count: data.completedToday, icon: CheckCircle, alert: false, color: 'text-[#15803D]' },
  ];

  const totalActive = data.unassigned + data.scheduled + data.inProgress + data.awaitingParts + data.awaitingClient;
  const noData = counts === null;

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <Layers className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-semibold text-[#111111] uppercase tracking-wide">
              Live Workload Pipeline
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              {noData
                ? 'Active work orders lifecycle stage'
                : `${totalActive} active work orders across estate`}
            </p>
          </div>
        </div>
        <Link href="/admin/operations/work-orders" className="text-[11.5px] font-medium text-[#EA580C] hover:underline transition-colors">
          Work Orders Hub →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E8E5] bg-[#FFFFFF]">
        {steps.map((step) => {
          const Icon = step.icon;
          const isSelected = activeState === step.key;
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onStateSelect?.(step.key)}
              className={
                isSelected
                  ? 'p-3.5 text-left transition-all bg-[#FAFAF8] border-b-2 border-[#EA580C]'
                  : 'p-3.5 text-left transition-all hover:bg-[#FAFAF8]'
              }
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10.5px] uppercase font-medium text-[#6D6D68]">{step.label}</span>
                <Icon className={`h-3 w-3 ${step.color}`} />
              </div>
              <div className={`text-xl font-semibold tabular-nums ${step.color}`}>
                {noData ? '—' : step.count}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

