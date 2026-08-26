'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Wrench, 
  ShieldCheck, 
  Cpu, 
  Flame, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  Lock
} from 'lucide-react';

interface OemDiscipline {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  supportedEquipment: string[];
  partnershipPillars: string[];
  engineerTraining: string;
  warrantyProtection: string;
}

const OEM_DISCIPLINES: OemDiscipline[] = [
  {
    id: 'chillers-refrigeration',
    name: 'Chillers & Industrial Refrigeration',
    badge: 'HVAC & COOLING // FACTORY COMMISSIONING',
    tagline: 'Maintaining factory warranty integrity across screw, scroll, and centrifugal chillers.',
    description: 'We collaborate directly with tier-1 chiller manufacturers (Daikin, Trane, Carrier, York, Mitsubishi Electric) to ensure factory-approved maintenance protocols, genuine OEM compressor overhauls, and certified F-Gas compliance.',
    icon: Cpu,
    supportedEquipment: [
      'Air-cooled and water-cooled screw chillers',
      'Magnetic bearing oil-free centrifugal chillers (Turbocor)',
      'Variable Refrigerant Flow (VRF / VRV) multi-split heat recovery systems',
      'Close-control precision CRAC units for data centres',
    ],
    partnershipPillars: [
      'Guaranteed factory-certified parts procurement within 24–48 hours',
      'Direct Tier-3 manufacturer engineering escalation for complex fault diagnostics',
      'Joint compressor overhaul programmes with OEM warranty continuity',
    ],
    engineerTraining: 'REFCOM F-Gas certified engineers with direct manufacturer factory courses.',
    warrantyProtection: '100% genuine OEM components preserving active manufacturer warranties.',
  },
  {
    id: 'commercial-boilers',
    name: 'Commercial Boilers & High-Efficiency Heat Pumps',
    badge: 'HEATING & COMBUSTION // COMMERCIAL GAS',
    tagline: 'Precision burner calibration, heat pump cascading, and low-NOx compliance.',
    description: 'Partnering with commercial heating innovators (Ideal Commercial, Viessmann, Remeha, Hamworthy, Vaillant) for annual statutory combustion efficiency testing, plate heat exchanger descaling, and hybrid heat pump retrofits.',
    icon: Flame,
    supportedEquipment: [
      'Modular condensing gas boilers up to 2MW output',
      'Commercial air-source and ground-source heat pump cascades',
      'Pressurisation units, expansion vessels & plate heat exchangers',
      'Commercial calorifiers, unvented cylinders & buffer vessels',
    ],
    partnershipPillars: [
      'Flue gas analysis calibrated directly to manufacturer stoichiometric curves',
      'Early access to hybrid heat pump replacement specifications',
      'Manufacturer technical bulletins integrated directly into EntireCAFM asset logs',
    ],
    engineerTraining: 'Gas Safe commercial core (COCN1, CIGA1, CDGA1) + manufacturer courses.',
    warrantyProtection: 'Manufacturer commissioning sign-off for extended 5–10 year warranty packages.',
  },
  {
    id: 'electrical-switchgear',
    name: 'Electrical Switchgear & Standby Power (UPS / Genset)',
    badge: 'POWER RESILIENCE // HV & LV DISTRIBUTION',
    tagline: 'Ensuring zero downtime for critical commercial power infrastructure.',
    description: 'Working with switchgear and power protection leaders (Schneider Electric, ABB, Eaton, Cummins, Kohler-SDMO) for thermal imaging, ACB servicing, and automatic transfer switch (ATS) testing.',
    icon: Zap,
    supportedEquipment: [
      'Low voltage main distribution switchboards up to 3200A',
      'Air Circuit Breakers (ACBs) & Moulded Case Circuit Breakers (MCCBs)',
      'Static uninterruptible power supplies (UPS) and battery strings',
      'Standby diesel generators, ATS panels & resistive load banks',
    ],
    partnershipPillars: [
      'OEM certified ACB secondary injection testing & trip unit calibration',
      'Factory diagnostic software for UPS microprocessor and inverter telemetry',
      'Certified battery conductance testing and safe hazardous recycling',
    ],
    engineerTraining: 'NICEIC Approved Contractors with High Voltage AP / SAP authorisations.',
    warrantyProtection: 'Full adherence to OEM maintenance schedules preserving business interruption insurance.',
  },
  {
    id: 'bms-controls',
    name: 'BMS, Controls & Smart Building Gateways',
    badge: 'BUILDING AUTOMATION // OPEN PROTOCOLS',
    tagline: 'Optimising building management systems for energy reduction and occupant comfort.',
    description: 'Collaborating with leading control vendors (Trend, Tridium Niagara, Siemens, Honeywell, Schneider EcoStruxure) for graphics upgrades, BACnet integration, and continuous strategy tuning.',
    icon: Building2,
    supportedEquipment: [
      'Trend IQ3 / IQ4 / IQX controllers and supervisor software',
      'Tridium Niagara N4 JACE controllers and web interfaces',
      'Siemens Desigo CC automation stations and field devices',
      'BACnet IP, Modbus RTU, and M-Bus open communication networks',
    ],
    partnershipPillars: [
      'Official engineering licensing and controller firmware security patches',
      'Standardized open-protocol integration preventing proprietary vendor lock-in',
      'Direct sensor-to-cloud telemetry pipelines into EntireFM energy analytics',
    ],
    engineerTraining: 'Certified Trend / Niagara N4 Advanced Systems Integrator engineers.',
    warrantyProtection: 'Authorised software upgrades protecting controller firmware integrity.',
  },
];

export function OemDisciplineGrid() {
  const [activeDisciplineId, setActiveDisciplineId] = useState(OEM_DISCIPLINES[0].id);

  const selected = OEM_DISCIPLINES.find((d) => d.id === activeDisciplineId) || OEM_DISCIPLINES[0];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">OEM &amp; MANUFACTURER ALLIANCES</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            Engineering Partnerships Across Core Plant Disciplines
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            EntireFM maintains collaborative technical relationships with equipment manufacturers and tier-1 OEMs to guarantee factory-standard maintenance, genuine parts, and warranty integrity.
          </p>
        </div>

        {/* Discipline Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {OEM_DISCIPLINES.map((disc) => {
            const isSelected = disc.id === activeDisciplineId;
            const DiscIcon = disc.icon;
            return (
              <button
                key={disc.id}
                onClick={() => setActiveDisciplineId(disc.id)}
                className={`text-left p-5 rounded-sm border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-sm ${isSelected ? 'bg-brand-pink text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                    <DiscIcon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-normal uppercase tracking-wider ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    DISCIPLINE
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] font-light mb-1 line-clamp-1">{disc.name}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Discipline Detail Container */}
        <div className="rounded-sm border border-slate-200 bg-[#FAF9FB] p-8 lg:p-12 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-sm bg-slate-900 text-white flex items-center justify-center">
                <Icon className="h-6 w-6 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink font-semibold">
                  {selected.badge}
                </span>
                <h3 className="text-2xl font-light text-slate-900">{selected.name}</h3>
              </div>
            </div>

            <Link href="/suppliers/apply" className="btn-primary text-xs py-2.5 px-4">
              Explore OEM Partnership <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-700 font-light leading-relaxed max-w-4xl">
            {selected.description}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pt-8 border-t border-slate-200">
            {/* Supported Plant & Pillars */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block mb-2">
                  COVERED ASSET CATEGORIES
                </span>
                <ul className="space-y-2">
                  {selected.supportedEquipment.map((eq, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-slate-700 font-light">
                      <CheckCircle2 className="h-4 w-4 text-brand-pink shrink-0 mt-0.5" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block mb-2">
                  COLLABORATION &amp; SUPPORT PROTOCOL
                </span>
                <ul className="space-y-2">
                  {selected.partnershipPillars.map((pil, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-slate-700 font-light">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pil}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Engineer & Warranty Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-500 block">
                  ENGINEER QUALIFICATION STANDARDS
                </span>
                <p className="text-xs text-slate-700 font-light leading-relaxed">
                  {selected.engineerTraining}
                </p>
              </div>

              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-emerald-700 block font-medium">
                  WARRANTY &amp; GENUINE PARTS PLEDGE
                </span>
                <p className="text-xs text-slate-700 font-light leading-relaxed">
                  {selected.warrantyProtection}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
