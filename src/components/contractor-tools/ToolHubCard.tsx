import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, CheckSquare } from 'lucide-react';

export interface ToolHubCardProps {
  number: string;
  title: string;
  description: string;
  href: string;
  timeEstimate: string;
  badge?: string;
}

export function ToolHubCard({
  number,
  title,
  description,
  href,
  timeEstimate,
  badge,
}: ToolHubCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col border border-slate-200 bg-white rounded-sm shadow-sm hover:shadow transition-all duration-200 hover:border-brand-electric/40 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-electric focus-visible:ring-offset-2"
      aria-label={`Open ${title}`}
    >
      {/* Number + Badge row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-[11px] font-light tracking-widest text-slate-400 uppercase">
          {number}
        </span>
        {badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-600 uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-light text-slate-900 leading-snug mb-2 group-hover:text-brand-electric transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed flex-1 font-light">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          <span>{timeEstimate}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-normal text-brand-electric group-hover:gap-2 transition-all">
          <CheckSquare className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Start Tool</span>
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
