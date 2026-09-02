import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export interface CrossLink {
  title: string;
  href: string;
  badge: string;
}

interface ToolCrossLinksProps {
  heading?: string;
  links: CrossLink[];
}

export function ToolCrossLinks({
  heading = 'Related Resources',
  links,
}: ToolCrossLinksProps) {
  if (!links.length) return null;

  return (
    <section aria-labelledby="cross-links-heading" className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-px flex-1 bg-slate-200" />
        <h2
          id="cross-links-heading"
          className="text-[11px] font-medium tracking-widest text-slate-500 uppercase shrink-0"
        >
          {heading}
        </h2>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="list">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-center justify-between gap-3 rounded-sm border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 hover:border-brand-electric/40 hover:text-brand-electric transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric focus-visible:ring-offset-1"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="inline-flex shrink-0 items-center px-1.5 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-[9px] font-medium text-slate-500 uppercase tracking-wider">
                  {link.badge}
                </span>
                <span className="truncate font-light">{link.title}</span>
              </span>
              <ExternalLink
                className="h-3 w-3 shrink-0 text-slate-400 group-hover:text-brand-electric transition-colors"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
