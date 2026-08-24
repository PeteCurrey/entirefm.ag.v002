'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Building,
  DollarSign,
  ShieldCheck,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

const PERSONAS = [
  {
    id: 'fm-director',
    label: 'FM Director',
    role: 'Estates & Technical Leadership',
    icon: UserCheck,
    focus: 'Strategic portfolio health, SLA performance, and contract delivery',
    metrics: ['96.2% SLA Performance', '98.4% Statutory Compliance', '42 Managed Facilities', '127 Open Jobs'],
    bullets: [
      'Estate-wide telemetry view showing live contractor status and open work orders.',
      'SLA risk radar alerting you to jobs nearing breach windows before failure occurs.',
      'Comprehensive maintenance schedule visibility across both Hard and Soft FM services.',
      'Autonomous escalation triggers for high-risk critical plantroom incidents.',
    ],
  },
  {
    id: 'property-director',
    label: 'Property / Estates Director',
    role: 'Asset Strategy & Occupier Governance',
    icon: Building,
    focus: 'Building condition, asset lifecycle preservation, and tenant continuity',
    metrics: ['3,846 Registered Assets', '48 Live Sensor Feeds', '8,450 m² GIA Monitored', '0 Missed Statutory Tasks'],
    bullets: [
      'Site 360 physical asset canvas providing a complete digital operating picture of every building.',
      'Full asset hierarchy from central plant chillers down to tenant-floor distribution boards.',
      'Occupier impact tracking for maintenance activities and planned engineering shutdowns.',
      'Long-term capital renewal insights based on empirical work order history and asset age.',
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance Officer',
    role: 'Statutory Safety & Legal Audit',
    icon: ShieldCheck,
    focus: 'Statutory testing schedules, certification vault, and verifiable audit trails',
    metrics: ['100% SFG20 Alignment', '16 Compliance Vault Categories', 'BS 7671 / Gas Safe Verified', 'Zero Audit Violations'],
    bullets: [
      'Auditable digital compliance vault storing EICR certificates, gas CP12/15s, and water logbooks.',
      'Immutable chronological activity ledger documenting exactly when and who performed every check.',
      'SFG20 maintenance standard cross-referencing for all preventative maintenance tasks.',
      'Instant export of building safety compliance packs for insurance or local authority inspections.',
    ],
  },
  {
    id: 'finance',
    label: 'Finance / Commercial',
    role: 'Commercial Control & Procurement',
    icon: DollarSign,
    focus: 'Works in progress (WIP), quote authorizations, and transparent billing',
    metrics: ['£185k Works in Progress', '£4,850 Pending Authorizations', '100% Digital Work Orders', 'Zero Disputed Invoices'],
    bullets: [
      'Live WIP tracking showing committed, approved, and completed reactive works expenditure.',
      'Digital approval gates allowing instant review and authorisation of quoted repair variations.',
      'Line-item transparency linking every invoice directly to engineer timesheets and site sign-off evidence.',
      'Budget forecasting comparing scheduled PPM expenditure against ad-hoc reactive maintenance costs.',
    ],
  },
  {
    id: 'site-team',
    label: 'Site / Building Team',
    role: 'Day-to-Day Facility Operations',
    icon: Wrench,
    focus: 'On-site engineer attendance, access protocols, and immediate defect logging',
    metrics: ['2 Active Engineers on Site', '24/7 Keyholder Access', 'Direct Incident Logging', '< 34m ETA on Criticals'],
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

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#FED7AA] bg-[#FFF7ED] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#C2410C] mb-2">
          ROLE-BASED GOVERNANCE
        </span>
        <h3 className="text-2xl sm:text-3xl font-semibold text-[#101010] tracking-tight">
          Different roles. One version of the truth.
        </h3>
        <p className="text-[13.5px] text-[#686866] mt-1.5">
          Authorised users receive granular permissions and tailored dashboards matching their operational responsibilities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E4E4E1] pb-4 mb-6">
        {PERSONAS.map((p) => {
          const isSelected = p.id === activePersonaId;
          return (
            <button
              key={p.id}
              onClick={() => setActivePersonaId(p.id)}
              className={`inline-flex items-center gap-2 rounded-[8px] px-3.5 py-2 text-[13px] font-medium transition-all ${
                isSelected
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'bg-[#F5F5F3] text-[#686866] hover:bg-[#E4E4E1] hover:text-[#101010]'
              }`}
            >
              <p.icon className={`h-4 w-4 ${isSelected ? 'text-[#EA580C]' : 'text-[#9B9B97]'}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Persona Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#EA580C] font-semibold">
              {activePersona.role}
            </span>
            <h4 className="text-xl font-semibold text-[#101010] mt-0.5">
              {activePersona.focus}
            </h4>
          </div>

          <ul className="space-y-3 pt-2">
            {activePersona.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#374151] leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Key Telemetry Points */}
        <div className="lg:col-span-5 rounded-[10px] border border-[#E4E4E1] bg-[#FBFBFA] p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9B9B97] mb-3">
            Key Telemetry Available in this View
          </p>
          <div className="grid grid-cols-2 gap-3">
            {activePersona.metrics.map((m, idx) => (
              <div
                key={idx}
                className="rounded-[8px] border border-[#E4E4E1] bg-white p-3 shadow-sm"
              >
                <span className="font-mono text-[12.5px] font-semibold text-[#101010] block">
                  {m.split(' ')[0]}
                </span>
                <span className="text-[11px] text-[#686866] block mt-0.5">
                  {m.split(' ').slice(1).join(' ')}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E4E1] text-[11px] font-mono text-[#9B9B97]">
            EntireCAFM enforces fine-grained RBAC with full multi-factor authentication.
          </div>
        </div>
      </div>
    </div>
  );
}
