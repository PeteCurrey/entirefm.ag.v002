import React from 'react';
import { computeSlaStatus } from '@/server/work';

interface SLAPillProps {
  resolutionDueAt?: string | Date;
  isCompleted?: boolean;
  compact?: boolean;
}

export function SLAPill({ resolutionDueAt, isCompleted = false, compact = false }: SLAPillProps) {
  const { status, remainingMinutes } = computeSlaStatus(resolutionDueAt, isCompleted);

  const getBadgeStyle = () => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'BREACHED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'AT_RISK':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'WARNING':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-brand-edge-dark/60 text-brand-mist/80 border-brand-edge-dark';
    }
  };

  const formatRemaining = () => {
    if (status === 'COMPLETED') return 'Achieved';
    if (status === 'BREACHED') return `Breached by ${Math.abs(remainingMinutes)}m`;
    if (remainingMinutes < 60) return `${remainingMinutes}m left`;
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    return `${hours}h ${mins}m left`;
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium ${getBadgeStyle()}`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium ${getBadgeStyle()}`}
      >
        {status}
      </span>
      <span className="font-mono text-[10px] text-brand-mist/50">
        {formatRemaining()}
      </span>
    </div>
  );
}
