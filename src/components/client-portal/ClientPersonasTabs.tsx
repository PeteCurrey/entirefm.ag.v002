'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Building,
  DollarSign,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Lock
} from 'lucide-react';
import Link from 'next/link';

const PERSONAS = [
  {
    id: 'fm-director',
    label: 'FM Director',
    role: 'ESTATES & TECHNICAL LEADERSHIP',
    icon: UserCheck,
    focus: 'Strategic portfolio health, SLA governance, and contract delivery',
    metrics: [
      { label: 'SLA Performance', value: '96.2%' },
      { label: 'Statutory Compliance', value: '98.4%' },
      { label: 'Managed Facilities', value: '42 Sites' },
      { label: 'Open Work Orders', value: '127 Jobs' },
    ],
    bullets: [
      'Estate-wide telemetry view showing live contractor status and open work orders across all sites.',
      'SLA risk radar alerting you to jobs nearing breach windows before a failure occurs.',
      'Comprehensive maintenance schedule visibility across both Hard and Soft FM disciplines.',
      'Autonomous escalation triggers for high-risk critical plantroom incidents.',
    ],
  },
  {
    id: 'property-director',
    label: 'Property / Asset Director',
    role: 'ASSET STRATEGY & OCCUPIER GOVERNANCE',
    icon: Building,
    focus: 'Building condition, asset lifecycle preservation, and tenant continuity',
    metrics: [
      { label: 'Registered Assets', value: '3,846' },
      { label: 'Live Sensor Nodes', value: '48 Nodes' },
      { label: 'Monitored GIA', value: '8,450 m²' },
      { label: 'Statutory Misses', value: '0 Breaches' },
    ],
    bullets: [
      'Site 360 physical asset canvas providing a complete digital operating picture of every building.',
      'Full asset hierarchy from central plant chillers down to tenant-floor distribution boards.',
      'Occupier impact tracking for maintenance activities and planned engineering shutdowns.',
      'Long-term capital renewal insights based on empirical work order history and asset age.',
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance & Safety Officer',
    role: 'STATUTORY SAFETY & LEGAL AUDIT',
    icon: ShieldCheck,
    focus: 'Statutory testing schedules, certification vault, and verifiable audit trails',
    metrics: [
      { label: 'SFG20 Alignment', value: '100%' },
      { label: 'Vault Categories', value: '16 Disciplines' },
      { label: 'Trade Verification', value: 'Gas / NICEIC' },
      { label: 'Audit Violations', value: '0 Violations' },
    ],
    bullets: [
      'Auditable digital compliance vault storing EICR certificates, gas CP12/15s, and water logbooks.',
      'Immutable chronological activity ledger documenting exactly when and who performed every check.',
      'SFG20 maintenance standard cross-referencing for all preventative maintenance tasks.',
      'Instant export of building safety compliance packs for insurance or local authority inspections.',
    ],
  },
  {
    id: 'finance',
    label: 'Finance / Commercial Lead',
    role: 'COMMERCIAL CONTROL & PROCUREMENT',
    icon: DollarSign,
    focus: 'Works in progress (WIP), quote authorisations, and transparent billing',
    metrics: [
      { label: 'Works in Progress', value: '£185k' },
      { label: 'Pending Quotes', value: '£4,850' },
      { label: 'Digital Orders', value: '100%' },
      { label: 'Disputed Invoices', value: '0 Invoices' },
    ],
    bullets: [
      'Live WIP tracking showing committed, approved, and completed reactive works expenditure.',
      'Digital approval gates allowing instant review and authorisation of quoted repair variations.',
      'Line-item transparency linking every invoice directly to engineer timesheets and site sign-off evidence.',
      'Budget forecasting comparing scheduled PPM expenditure against ad-hoc reactive maintenance costs.',
    ],
  },
  {
    id: 'site-team',
    label: 'Site & Facilities Team',
    role: 'DAY-TO-DAY BUILDING OPERATIONS',
    icon: Wrench,
    focus: 'On-site engineer attendance, access protocols, and immediate defect logging',
    metrics: [
      { label: 'Engineers on Site', value: '2 Active' },
      { label: 'Access Protocols', value: '24/7 Monitored' },
      { label: 'Defect Logging', value: 'Instant' },
      { label: 'Critical Response', value: '< 34m ETA' },
    ],
    bullets: [
      'Real-time view of verified engineers checked into the building with valid access permits.',
      'Immediate defect reporting via direct portal submission without telephone hold times.',
      'Site-specific access notes, gatekeeper protocols, and plantroom emergency shut-off maps.',
      'Daily operations timeline detailing scheduled contractor visits and planned maintenance windows.',
    ],
  },
];

export function ClientPersonasTabs() {
  const [activePersonaId, setActivePersonaId] = useState(PERSONAS[0].id);
  const activePersona = PERSONAS.find((p) => p.id === activePersonaId) || PERSONAS[0];
  const Icon = activePersona.icon;

  return (
    <section className="py-24 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">ROLE-BASED GOVERNANCE</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
            Different roles. One version of the truth.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Authorised stakeholders receive granular role-based permissions and dedicated workspaces aligned precisely with their operational responsibilities.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-200 mb-8">
          {PERSONAS.map((p) => {
            const isSelected = p.id === activePersonaId;
            const TabIcon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersonaId(p.id)}
                className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-light tracking-wide transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white font-normal shadow-sm border border-slate-900'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <TabIcon className={`h-3.5 w-3.5 ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200 rounded-sm p-8 lg:p-12 shadow-sm">
          {/* Left Column: Role Details & Key Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  {activePersona.role}
                </span>
                <h3 className="text-2xl font-light text-slate-900">{activePersona.label}</h3>
              </div>
            </div>

            <p className="text-base font-light text-slate-800 italic">
              &ldquo;{activePersona.focus}&rdquo;
            </p>

            <div className="pt-2 space-y-3">
              <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block">
                CORE PORTAL WORKFLOWS
              </span>
              <ul className="space-y-2.5">
                {activePersona.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 font-light">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Key Telemetry Points & Action */}
          <div className="lg:col-span-5 bg-[#FAF9FB] p-7 rounded-sm border border-slate-200 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block">
                REPRESENTATIVE TELEMETRY FOCUS
              </span>

              <div className="grid grid-cols-2 gap-3">
                {activePersona.metrics.map((m, i) => (
                  <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-sm">
                    <div className="text-lg font-light text-slate-900">{m.value}</div>
                    <div className="text-[11px] text-slate-500 font-light mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-slate-500 font-light leading-relaxed">
                Protected by granular role-based access control (RBAC) and enterprise single sign-on (SSO).
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <Link
                href="/contact-us?subject=Book%20a%20Live%20Client%20Portal%20Demonstration"
                className="btn-primary w-full justify-center text-xs py-3"
              >
                Demonstrate {activePersona.label} View <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
