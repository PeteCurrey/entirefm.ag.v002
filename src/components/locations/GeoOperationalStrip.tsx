import React from 'react';
import { Building2, Clock, Layers, ClipboardCheck, ShieldCheck, Wrench, Cpu, CheckCircle2 } from 'lucide-react';

interface GeoOperationalStripProps {
  city: string;
  items?: Array<{
    label: string;
    value: string;
    detail: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function GeoOperationalStrip({ city, items }: GeoOperationalStripProps) {
  const defaultItems = [
    {
      label: 'Regional Delivery',
      value: `${city} Mobile Units`,
      detail: `Assigned M&E, HVAC and compliance engineers covering ${city} and regional transport corridors.`,
      icon: Building2,
    },
    {
      label: 'Response SLA',
      value: 'Contracted Cover',
      detail: 'Emergency out-of-hours attendance agreed per site by building priority and asset criticality.',
      icon: Clock,
    },
    {
      label: 'Full Scope',
      value: 'Hard & Soft FM',
      detail: 'Mechanical, electrical, fabric, statutory testing and daily facilities management under one contract.',
      icon: Layers,
    },
    {
      label: 'Digital Audit',
      value: 'SFG20 & Vault',
      detail: 'Work sheets, gas CP12, EICR and compliance certificates archived live in our CAFM portal.',
      icon: ClipboardCheck,
    },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  return (
    <section className="section-tight bg-brand-surface border-b border-brand-edge">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item, i) => {
            const Icon = item.icon || ShieldCheck;
            return (
              <div
                key={item.label}
                className="group relative bg-white p-7 transition-colors duration-500 ease-brand hover:bg-brand-surface"
                data-reveal
                style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
              >
                {/* Gradient tick on top edge on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
                />
                <div className="mb-5 flex items-start justify-between">
                  <span className="eyebrow">{item.label}</span>
                  <Icon className="h-4 w-4 shrink-0 text-brand-silver transition-colors duration-500 group-hover:text-brand-electric" />
                </div>
                <p className="text-[1.3rem] font-light leading-tight tracking-tight text-brand-graphite">
                  {item.value}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-brand-silver">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
