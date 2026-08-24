import React from 'react';
import { Building2, Clock, Layers, ClipboardCheck } from 'lucide-react';

/**
 * CAPABILITY BLOCK
 * ================
 * Four statements of what EntireFM actually does, presented as a single
 * hairline-divided band rather than four floating boxes — closer to a
 * specification sheet than a feature grid.
 *
 * CLAIM GOVERNANCE
 * ----------------
 * The previous version of this component asserted four things the claims
 * registry does not support:
 *   "Regional engineering hubs across UK"  → GEO_REGIONAL_CENTRES  DO_NOT_USE
 *   "Self-Delivered"                       → OPS_SELF_DELIVERY     TO_VERIFY
 *   "100% Audit-Ready"                     → LEGAL_COMPLIANCE_GUARANTEE DO_NOT_USE
 *   "24/7/365"                             → OPS_247_EMERGENCY     TO_VERIFY
 *
 * Each has been replaced with a description of the service that is true as
 * written. "Nationwide coverage" is a statement of where we work; "regional
 * engineering hubs" is a claim about premises we cannot evidence.
 */

const CAPABILITIES = [
  {
    label: 'Coverage',
    value: 'Nationwide',
    detail: 'Regional operations covering the UK, with response times agreed per site.',
    icon: Building2,
  },
  {
    label: 'Response',
    value: 'Out of hours',
    detail: 'Emergency cover for contracted sites, by agreed priority band.',
    icon: Clock,
  },
  {
    label: 'Scope',
    value: 'Hard & soft FM',
    detail: 'Engineering, compliance and support services under a single contract.',
    icon: Layers,
  },
  {
    label: 'Records',
    value: 'Evidenced',
    detail: 'Statutory testing, certification and job history held in one place.',
    icon: ClipboardCheck,
  },
];

export function StatBlock() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge sm:grid-cols-2 lg:grid-cols-4">
      {CAPABILITIES.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="group relative bg-white p-7 transition-colors duration-500 ease-brand hover:bg-brand-surface"
            data-reveal
            style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}
          >
            {/* A gradient tick that grows along the top edge on hover. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-spectrum transition-transform duration-500 ease-brand group-hover:scale-x-100"
            />
            <div className="mb-6 flex items-start justify-between">
              <span className="eyebrow">{item.label}</span>
              <Icon className="h-4 w-4 shrink-0 text-brand-silver transition-colors duration-500 group-hover:text-brand-electric" />
            </div>
            <p className="text-[1.375rem] font-bold leading-tight tracking-tight text-brand-graphite">
              {item.value}
            </p>
            <p className="mt-2.5 text-[13px] leading-relaxed text-brand-silver">{item.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * SECTOR RAIL
 * ===========
 * The estate types EntireFM works across. Each reveals its supporting line on
 * hover — the detail is always in the DOM, only its presentation is deferred.
 */

import { VERIFIED_CLIENTS } from './ClientLogos';

const SECTORS = [
  { name: 'Commercial offices', note: 'Multi-tenant estates and managing agents' },
  { name: 'Logistics & distribution', note: 'Dock levellers, shutters and yard lighting' },
  { name: 'Industrial & manufacturing', note: 'Process plant, LEV and high-load power' },
  { name: 'Retail & shopping centres', note: 'Public realm and long trading hours' },
  { name: 'Education & public sector', note: 'Campus estates and vacation turnaround' },
];

export function ClientLogoRail() {
  return (
    <section className="section-tight border-y border-brand-edge bg-brand-surface">
      <div className="container-custom">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4" data-reveal>
          <div>
            <p className="eyebrow">Proven client delivery</p>
            <h2 className="mt-3 text-display-sm text-brand-graphite">
              Trusted across UK commercial property &amp; national estates
            </h2>
          </div>
          <p className="max-w-md text-xs text-brand-silver">
            EntireFM coordinates planned maintenance, mechanical engineering, and compliance management for leading commercial occupiers and managing agents.
          </p>
        </div>

        {/* Verified Real Client Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 mb-10" data-reveal>
          {VERIFIED_CLIENTS.map((client, i) => {
            const LogoComponent = client.Logo;
            return (
              <div
                key={client.id}
                title={`${client.name} — ${client.category}`}
                className="group relative flex flex-col items-center justify-center rounded-sm border border-brand-edge bg-white px-4 py-4 min-h-[82px] shadow-sm transition-all duration-300 ease-brand hover:border-brand-electric/40 hover:shadow-md"
                style={{ '--reveal-delay': `${i * 40}ms` } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-spectrum transition-transform duration-300 ease-brand group-hover:scale-x-100"
                />
                <div className="flex items-center justify-center w-full h-full">
                  <LogoComponent className="h-6 sm:h-7 w-auto max-w-[130px] transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="sr-only">{client.name} ({client.category})</span>
              </div>
            );
          })}
        </div>

        <div className="mb-4 max-w-2xl" data-reveal>
          <p className="eyebrow">Estate disciplines</p>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-brand-edge bg-brand-edge sm:grid-cols-2 lg:grid-cols-5">
          {SECTORS.map((sector, i) => (
            <li
              key={sector.name}
              className="group bg-white p-6 transition-colors duration-500 ease-brand hover:bg-brand-surface-muted"
              data-reveal
              style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
            >
              <p className="text-sm font-semibold leading-snug text-brand-graphite">{sector.name}</p>
              <div className="reveal-on-hover">
                <p className="pt-2 text-[12px] leading-snug text-brand-silver">{sector.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
