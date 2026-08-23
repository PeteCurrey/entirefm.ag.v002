import React from 'react';

interface AdminPageHeaderProps {
  category: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({
  category,
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-brand-edge-dark pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-brand-electric-bright">
          {category}
        </div>
        <h1 className="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 text-[13px] text-brand-mist/60">{description}</p>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
