import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export type ToolAccent = 'blue' | 'emerald' | 'amber' | 'violet' | 'cyan';

interface ToolHeroProps {
  breadcrumbs: { name: string; url: string }[];
  eyebrow: string;
  title: string;
  description: string;
  timeEstimate: string;
  deliverables: string[];
  accent?: ToolAccent;
  icon: React.ComponentType<{ className?: string }>;
}

const ACCENT_CLASSES: Record<ToolAccent, {
  eyebrow: string;
  icon: string;
  iconBg: string;
  pill: string;
  glow: string;
  deliverableDot: string;
}> = {
  blue: {
    eyebrow: 'text-brand-electric-bright',
    icon: 'text-brand-electric-bright',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    pill: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    glow: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
    deliverableDot: 'bg-blue-400',
  },
  emerald: {
    eyebrow: 'text-emerald-400',
    icon: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    glow: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
    deliverableDot: 'bg-emerald-400',
  },
  amber: {
    eyebrow: 'text-amber-400',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    pill: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    glow: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
    deliverableDot: 'bg-amber-400',
  },
  violet: {
    eyebrow: 'text-violet-400',
    icon: 'text-violet-400',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    pill: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    glow: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
    deliverableDot: 'bg-violet-400',
  },
  cyan: {
    eyebrow: 'text-cyan-400',
    icon: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    pill: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    glow: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
    deliverableDot: 'bg-cyan-400',
  },
};

export function ToolHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  timeEstimate,
  deliverables,
  accent = 'blue',
  icon: Icon,
}: ToolHeroProps) {
  const cls = ACCENT_CLASSES[accent];

  return (
    <section className="relative overflow-hidden pt-32 pb-16 border-b border-brand-edge-dark bg-brand-void print:hidden">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] -top-[20%] h-[36rem] w-[36rem] rounded-full opacity-15 blur-[120px]"
        style={{ background: cls.glow }}
      />
      {/* Facet grid */}
      <div aria-hidden="true" className="facet-rule pointer-events-none absolute inset-0 opacity-30" />

      <div className="container-custom relative">
        <Breadcrumbs items={breadcrumbs} className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-sm border ${cls.iconBg}`}>
                <Icon className={`h-5 w-5 ${cls.icon}`} />
              </span>
              <span className={`text-xs font-normal uppercase tracking-widest font-mono ${cls.eyebrow}`}>
                {eyebrow}
              </span>
            </div>

            <h1 className="text-display-md sm:text-display-lg text-white font-light tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-base leading-relaxed text-brand-mist/70 max-w-2xl font-light">
              {description}
            </p>

            {/* Time estimate pill */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-normal border ${cls.pill}`}>
                <Clock className="h-3 w-3" />
                {timeEstimate}
              </span>
              <span className="text-xs text-brand-mist/40 font-mono">· Free · No registration required</span>
            </div>
          </div>

          {/* Right: deliverables card */}
          <div className="lg:col-span-5">
            <div className="bg-brand-graphite border border-brand-edge-dark rounded-sm p-6 space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-widest text-brand-mist/50 font-light">
                What you get
              </p>
              <ul className="space-y-2.5">
                {deliverables.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-brand-mist/80">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${cls.deliverableDot}`} />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-brand-edge-dark flex items-center gap-1.5 text-[11px] text-brand-mist/40 font-mono">
                <ArrowRight className="h-3 w-3" />
                <span>Scroll down to get started</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
