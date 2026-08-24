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
  counts?: WorkloadStateCount;
  activeState?: string | null;
  onStateSelect?: (stateKey: string) => void;
}

export function LiveWorkloadPipeline({
  counts,
  activeState,
  onStateSelect,
}: LiveWorkloadPipelineProps) {
  const data: WorkloadStateCount = counts || {
    unassigned: 6,
    scheduled: 18,
    inProgress: 14,
    awaitingParts: 3,
    awaitingClient: 4,
    completedToday: 21,
  };

  const steps = [
    {
      key: 'unassigned',
      label: 'Unassigned',
      count: data.unassigned,
      icon: UserX,
      alert: data.unassigned > 5,
      color: 'text-[#B45309]',
    },
    {
      key: 'scheduled',
      label: 'Scheduled',
      count: data.scheduled,
      icon: Clock,
      alert: false,
      color: 'text-[#1D4ED8]',
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      count: data.inProgress,
      icon: Layers,
      alert: false,
      color: 'text-[#FF6B24]',
    },
    {
      key: 'awaiting_parts',
      label: 'Awaiting Parts',
      count: data.awaitingParts,
      icon: AlertTriangle,
      alert: false,
      color: 'text-[#686866]',
    },
    {
      key: 'awaiting_client',
      label: 'Awaiting Client',
      count: data.awaitingClient,
      icon: PauseCircle,
      alert: false,
      color: 'text-[#686866]',
    },
    {
      key: 'completed_today',
      label: 'Completed Today',
      count: data.completedToday,
      icon: CheckCircle,
      alert: false,
      color: 'text-[#15803D]',
    },
  ];

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B24]" />
          LIVE WORKLOAD DISPATCH PIPELINE
        </div>
        <Link
          href="/admin/operations/work-orders"
          className="text-[11.5px] font-medium text-[#686866] hover:text-[#101010] transition-colors"
        >
          Work Orders Queue →
        </Link>
      </div>

      {/* Pipeline Strip */}
      <div className="grid grid-cols-2 divide-y divide-[#E4E4E1] sm:grid-cols-3 sm:divide-y-0 sm:divide-x lg:grid-cols-6 bg-[#FFFFFF]">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeState === step.key;

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onStateSelect && onStateSelect(step.key)}
              className={`p-4 text-left transition-all duration-150 relative group ${
                isSelected
                  ? 'bg-[#FFF7ED] ring-1 ring-inset ring-[#FF6B24]'
                  : 'hover:bg-[#F5F5F3]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF6B24]" />
              )}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#686866] font-medium truncate">
                  {step.label}
                </span>
                <Icon className={`h-3.5 w-3.5 ${step.color}`} />
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span
                  className={`text-2xl font-light tracking-tight tabular-nums ${
                    step.alert ? 'text-[#B45309] font-normal' : 'text-[#101010]'
                  }`}
                >
                  {step.count}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block h-3 w-3 text-[#E4E4E1] group-hover:text-[#9B9B97] transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
