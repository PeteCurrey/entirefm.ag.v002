import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  actions?: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  compact?: boolean;
  hoverable?: boolean;
  active?: boolean;
  className?: string;
}

export function Card({
  children,
  header,
  actions,
  title,
  subtitle,
  badge,
  compact = false,
  hoverable = false,
  active = false,
  className = '',
  ...props
}: CardProps) {
  const hasHeader = header || title || actions || badge;

  return (
    <div
      className={`rounded-[14px] border bg-[#FFFFFF] transition-all duration-200 ${
        active
          ? 'border-[#FF6B24] ring-1 ring-[#FF6B24] shadow-[0_4px_16px_rgba(255,107,36,0.08)]'
          : 'border-[#E4E4E1] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
      } ${
        hoverable
          ? 'hover:border-[#D1D1CD] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {hasHeader && (
        <div
          className={`flex items-center justify-between border-b border-[#E4E4E1] ${
            compact ? 'px-4 py-2.5' : 'px-5 py-3.5'
          }`}
        >
          {header ? (
            header
          ) : (
            <div className="flex items-center gap-2.5 min-w-0">
              {title && (
                <h3 className="font-mono text-[12px] font-normal uppercase tracking-wider text-[#101010] truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <span className="text-[12px] text-[#686866] truncate">{subtitle}</span>
              )}
              {badge}
            </div>
          )}
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={compact ? 'p-3' : 'p-5'}>{children}</div>
    </div>
  );
}
