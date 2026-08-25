'use client';

import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Wind, 
  MapPin, 
  HardHat, 
  Users,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const COMPLIANCE_PILLARS = [
  {
    title: 'UK Aviation Regulations',
    desc: 'Operations conducted strictly in accordance with UK Civil Aviation Authority (CAA) frameworks, including Open and Specific Category operational risk assessments where applicable.',
    icon: ShieldCheck,
  },
  {
    title: 'Site-Specific RAMS',
    desc: 'Detailed Risk Assessment and Method Statements (RAMS) prepared prior to every flight, covering flight paths, emergency landing zones, and site hazard mitigations.',
    icon: FileCheck2,
  },
  {
    title: 'Airspace & ATC Approvals',
    desc: 'Proactive coordination with local Air Traffic Control, NATS, and airport authorities for operations within Flight Restriction Zones (FRZs) or congested urban airspaces.',
    icon: MapPin,
  },
  {
    title: 'Weather Safety Thresholds',
    desc: 'Strict operational limits on wind speeds (gust thresholds <20–25 knots), active precipitation, and cloud base to guarantee aircraft stability and crisp imaging.',
    icon: Wind,
  },
  {
    title: 'Reducing Work at Height',
    desc: 'Drones eliminate the requirement for initial physical access equipment. Physical personnel (rope access / MEWPs) are deployed only when targeted repair is required.',
    icon: HardHat,
  },
  {
    title: 'Occupant & Public Protection',
    desc: 'Controlled ground exclusion cordons, safety marshals, and out-of-hours scheduling ensure zero operational risk to tenants, visitors, or members of the public.',
    icon: Users,
  },
];

export function DroneComplianceSection() {
  return (
    <section className="py-24 bg-[#FAF9FB] border-b border-slate-200" id="safety-compliance">
      <div className="container-custom space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700">
              SAFETY, GOVERNANCE &amp; UK AVIATION RULES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Commercial drone safety, planned properly
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-light">
            Commercial drone flights demand the same engineering rigor, regulatory compliance, and risk management as any high-level building operation. We plan every survey around site constraints, airspace regulations, and operational safety.
          </p>
        </div>

        {/* 6 Compliance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {COMPLIANCE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-[14px] bg-white border border-slate-200 shadow-sm space-y-3.5 hover:border-brand-pink hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 rounded-[10px] bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-pink shadow-subtle">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Responsible Safety Positioning Banner */}
        <div className="p-8 rounded-[14px] bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Operational Integrity &amp; Risk Mitigation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 font-mono">
            <div className="border-l-2 border-brand-pink pl-4 space-y-1">
              <strong className="text-slate-900 font-sans text-xs uppercase block">
                Trained Flight Crews
              </strong>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Commercial flyers trained in spatial hazard assessment, fail-safe RTL protocols, and redundant telemetry monitoring.
              </p>
            </div>

            <div className="border-l-2 border-brand-pink pl-4 space-y-1">
              <strong className="text-slate-900 font-sans text-xs uppercase block">
                Aviation Liability Insurance
              </strong>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Dedicated commercial aviation third-party liability insurance compliant with EC 785/2004 requirements.
              </p>
            </div>

            <div className="border-l-2 border-brand-pink pl-4 space-y-1">
              <strong className="text-slate-900 font-sans text-xs uppercase block">
                Confidentiality &amp; Privacy
              </strong>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Flight paths planned to eliminate unnecessary capture of neighbouring properties and private residential windows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
