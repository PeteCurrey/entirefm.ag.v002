import React from 'react';
import Link from 'next/link';
import { PackageOpen, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  action,
  onActionClick,
  icon,
}: EmptyStateProps) {
  const resolvedText = action?.label || actionText;
  const resolvedHref = action?.href || actionHref;
  const resolvedClick = action?.onClick || onActionClick;
  return (
    <div className="flex flex-col items-center justify-center rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-7 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] text-[#6D6D68]">
        {icon || <PackageOpen className="h-4 w-4" />}
      </div>
      <h3 className="mt-3 text-[14px] font-medium text-[#111111]">{title}</h3>
      <p className="mt-1 max-w-sm text-[12.5px] leading-relaxed text-[#6D6D68]">
        {description}
      </p>
      {resolvedText && (
        resolvedHref ? (
          <Link
            href={resolvedHref}
            className="mt-4 inline-flex items-center gap-1.5 rounded-[6px] bg-[#EA580C] px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#C2410C] transition-all"
          >
            <span>{resolvedText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : resolvedClick ? (
          <button
            onClick={resolvedClick}
            className="mt-4 inline-flex items-center gap-1.5 rounded-[6px] bg-[#EA580C] px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#C2410C] transition-all"
          >
            <span>{resolvedText}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : null
      )}
    </div>
  );
}

export default EmptyState;
