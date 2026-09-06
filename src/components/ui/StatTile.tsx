import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface StatTileProps {
  label: string;
  value: string | number;
  sublabel?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  href?: string;
  active?: boolean;
  variant?: 'default' | 'critical' | 'warning' | 'nominal';
  className?: string;
}

/**
 * CAFM Shared Stat Tile Component
 * ================================
 * High-clarity SaaS KPI card: icon container + uppercase micro-label +
 * large numeric value + explanatory sublabel / trend.
 */
export function StatTile({
  label,
  value,
  sublabel,
  icon,
  badge,
  href,
  active = false,
  variant = 'default',
  className = '',
}: StatTileProps) {
  const variantStyles = {
    default: 'border-cafm-border-card bg-cafm-surface-card hover:border-cafm-border-subtle',
    critical: 'border-cafm-critical-border/70 bg-cafm-critical-surface/30 hover:border-cafm-critical-border',
    warning: 'border-cafm-warning-border/70 bg-cafm-warning-surface/30 hover:border-cafm-warning-border',
    nominal: 'border-cafm-nominal-border/70 bg-cafm-nominal-surface/30 hover:border-cafm-nominal-border',
  };

  const activeStyles = active
    ? 'ring-1 ring-cafm-orange border-cafm-orange shadow-[0_4px_16px_rgba(234,88,12,0.08)]'
    : '';

  const content = (
    <div
      className={`rounded-[14px] border p-5 transition-all duration-200 ${variantStyles[variant]} ${activeStyles} ${
        href ? 'cursor-pointer group hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon && (
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-cafm-surface-muted border border-cafm-border text-cafm-text-secondary group-hover:text-cafm-orange transition-colors shrink-0">
              {icon}
            </div>
          )}
          <span className="text-[10.5px] font-normal uppercase tracking-wider text-cafm-text-secondary truncate">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {href && (
            <ArrowUpRight className="h-3.5 w-3.5 text-cafm-text-muted group-hover:text-cafm-orange transition-colors" />
          )}
        </div>
      </div>

      <div className="mt-2.5">
        <div className="text-2xl sm:text-3xl font-light text-cafm-text-primary tracking-tight">
          {value}
        </div>
        {sublabel && (
          <div className="text-[11.5px] text-cafm-text-secondary mt-1 truncate">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
