import React from 'react';
import { AlertCircle, Info, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface LegalCalloutProps {
  type?: 'info' | 'important' | 'warning' | 'statutory' | 'practical' | 'takeaway';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function LegalCallout({
  type = 'info',
  title,
  children,
  className = '',
}: LegalCalloutProps) {
  const configs = {
    info: {
      bg: 'bg-slate-50 border-slate-200 text-slate-800',
      iconBg: 'bg-slate-100 text-slate-700',
      icon: Info,
      defaultTitle: 'Important Context',
    },
    important: {
      bg: 'bg-indigo-50/70 border-indigo-200/80 text-slate-800',
      iconBg: 'bg-indigo-100 text-indigo-700',
      icon: AlertCircle,
      defaultTitle: 'Key Legal Provision',
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-slate-850',
      iconBg: 'bg-amber-100 text-amber-800',
      icon: AlertTriangle,
      defaultTitle: 'Compliance Notice',
    },
    statutory: {
      bg: 'bg-sky-50/70 border-sky-200 text-slate-850',
      iconBg: 'bg-sky-100 text-sky-800',
      icon: ShieldCheck,
      defaultTitle: 'Statutory Obligation (UK Legislation)',
    },
    practical: {
      bg: 'bg-emerald-50/70 border-emerald-200 text-slate-850',
      iconBg: 'bg-emerald-100 text-emerald-800',
      icon: CheckCircle2,
      defaultTitle: 'Practical Application in Facilities Management',
    },
    takeaway: {
      bg: 'bg-slate-900 border-slate-800 text-white',
      iconBg: 'bg-slate-800 text-brand-electric-bright',
      icon: FileText,
      defaultTitle: 'Summary at a Glance',
    },
  };

  const current = configs[type];
  const Icon = current.icon;
  const isDark = type === 'takeaway';

  return (
    <aside
      className={`my-6 rounded-xl border p-5 transition-all duration-200 sm:p-6 ${current.bg} ${className}`}
      role="note"
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${current.iconBg}`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-normal tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {title || current.defaultTitle}
          </p>
          <div className={`mt-2 text-[14px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
