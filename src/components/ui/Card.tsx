import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  compact?: boolean;
  hoverable?: boolean;
  active?: boolean;
  className?: string;
}

/**
 * CAFM Shared Panel / Card Component
 * ==================================
 * Standard elevated card panel with rounded 14px corners,
 * crisp hairline border, and clean white ground.
 */
export function Card({
  children,
  header,
  actions,
  title,
  subtitle,
  badge,
  icon,
  compact = false,
  hoverable = false,
  active = false,
  className = '',
  ...props
}: CardProps) {
  const hasHeader = header || title || actions || badge || icon;

  return (
    <div
      className={`rounded-[14px] border bg-cafm-surface-card transition-all duration-200 ${
        active
          ? 'border-cafm-orange-vibrant ring-1 ring-cafm-orange-vibrant shadow-[0_4px_16px_rgba(234,88,12,0.08)]'
          : 'border-cafm-border-card shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
      } ${
        hoverable
          ? 'hover:border-cafm-border-subtle hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)] cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {hasHeader && (
        <div
          className={`flex items-center justify-between border-b border-cafm-border-card bg-cafm-surface-muted/60 ${
            compact ? 'px-4 py-2.5' : 'px-5 py-3.5'
          }`}
        >
          {header ? (
            header
          ) : (
            <div className="flex items-center gap-2.5 min-w-0">
              {icon && (
                <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-cafm-text-primary text-white shrink-0">
                  {icon}
                </span>
              )}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-[12px] font-normal uppercase tracking-wider text-cafm-text-primary truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-[11.5px] text-cafm-text-secondary truncate mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              {badge && <div className="shrink-0 ml-1">{badge}</div>}
            </div>
          )}
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={compact ? 'p-4' : 'p-5'}>{children}</div>
    </div>
  );
}
