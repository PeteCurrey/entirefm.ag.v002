import React from 'react';

interface AdminPageHeaderProps {
  category: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AdminPageHeader({
  category,
  title,
  description,
  action,
  breadcrumbs,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#E4E4E1] pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-[#9B9B97] mb-1">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                {b.href ? (
                  <a href={b.href} className="hover:text-[#FF6B24] transition-colors">
                    {b.label}
                  </a>
                ) : (
                  <span className="text-[#FF6B24] font-normal">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="font-mono text-[10.5px] font-normal uppercase tracking-wider text-[#FF6B24]">
            {category}
          </div>
        )}
        <h1 className="mt-1 text-2xl font-extralight tracking-tight text-[#101010] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-[13px] text-[#686866] max-w-3xl">{description}</p>
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  );
}
