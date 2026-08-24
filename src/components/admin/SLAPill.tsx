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
        return 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]';
      case 'BREACHED':
        return 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]';
      case 'AT_RISK':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      case 'WARNING':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
      default:
        return 'bg-[#F0F0EE] text-[#686866] border-[#E4E4E1]';
    }
  };

  const formatRemaining = () => {
    if (status === 'COMPLETED') return 'Achieved';
    if (status === 'BREACHED') return `Breached by ${Math.abs(remainingMinutes)}m`;
    if (remainingMinutes < 60) return `${remainingMinutes}m remaining`;
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    return `${hours}h ${mins}m remaining`;
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider ${getBadgeStyle()}`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center rounded-[5px] border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider ${getBadgeStyle()}`}
      >
        {status}
      </span>
      <span className="font-mono text-[10.5px] text-[#686866] tabular-nums">
        {formatRemaining()}
      </span>
    </div>
  );
}
