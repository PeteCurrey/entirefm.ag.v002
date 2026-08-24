import React from 'react';
import Link from 'next/link';
import { PackageOpen, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-[#E4E4E1] bg-[#FFFFFF] p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E4E4E1] bg-[#F5F5F3] text-[#686866]">
        {icon || <PackageOpen className="h-5 w-5" />}
      </div>
      <h3 className="mt-3.5 text-[15px] font-medium text-[#101010]">{title}</h3>
      <p className="mt-1 max-w-md text-[13px] leading-relaxed text-[#686866]">
        {description}
      </p>
      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="mt-5 inline-flex items-center gap-1.5 rounded-[8px] bg-[#FF6B24] px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-[0_1px_2px_rgba(255,107,36,0.2)] hover:bg-[#E9540F] transition-all"
          >
            <span>{actionText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : onActionClick ? (
          <button
            onClick={onActionClick}
            className="mt-5 inline-flex items-center gap-1.5 rounded-[8px] bg-[#FF6B24] px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-[0_1px_2px_rgba(255,107,36,0.2)] hover:bg-[#E9540F] transition-all"
          >
            <span>{actionText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : null
      )}
    </div>
  );
}

export default EmptyState;
