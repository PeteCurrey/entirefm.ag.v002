'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Activity, 
  Eye, 
  Zap, 
  Droplets, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Layers, 
  Server 
} from 'lucide-react';

interface InnovationTrack {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  liveDeployments: string[];
  techRequirements: string[];
  pilotPhases: string;
  targetOutcome: string;
}

const TRACKS: InnovationTrack[] = [
  {
    id: 'iot-vibration',
    name: 'Condition-Based IoT Vibration & Thermal Telemetry',
    badge: 'PREDICTIVE MAINTENANCE // PLANTROOM IOT',
    tagline: 'Wireless tri-axial vibration and surface temperature monitoring for commercial pumps and fans.',
    description: 'We partner with hardware sensor manufacturers to deploy magnetic and screw-mounted LoRaWAN / Cellular vibration sensors across critical AHUs, primary heating pumps, and condenser fan arrays.',
    icon: Activity,
    liveDeployments: [
      'High-rise commercial plantrooms in London & Manchester',
      'Hospital critical chilled water distribution pumps',
      'Distribution centre primary ventilation fan bearings',
    ],
    techRequirements: ['LoRaWAN / NB-IoT / Cellular connectivity', 'IP67 waterproof rating', 'MQTT / REST API webhook support'],
    pilotPhases: '4-week baseline data gathering &rarr; 8-week automated anomaly detection pilot',
    targetOutcome: 'Pre-emptive bearing failure detection 14–21 days prior to catastrophic seizure',
  },
  {
    id: 'drone-vision',
    name: 'Computer Vision & Autonomous Drone Façade Surveys',
    badge: 'AERIAL INSPECTIONS // THERMAL ENVELOPE',
    tagline: 'High-resolution photogrammetry and thermal imaging for high-rise roofs and building envelopes.',
    description: 'Eliminating dangerous high-level scaffolding for routine envelope inspections. We work with certified drone survey teams delivering AI-tagged defect orthomosaics directly into EntireCAFM.',
    icon: Eye,
    liveDeployments: [
      'Multi-storey commercial glass and stone facades',
      'Industrial warehouse flat roofing condition audits',
      'Solar PV array thermal hotspot detection',
    ],
    techRequirements: ['CAA certified GVC / OA flight clearance', '4K radiometric thermal sensor', 'Geo-referenced TIFF export'],
    pilotPhases: 'Single-estate proof of concept &rarr; Multi-portfolio scheduled annual inspection roster',
    targetOutcome: '90% reduction in high-level access inspection costs and zero working-at-height risk',
  },
  {
    id: 'ai-energy',
    name: 'AI Dynamic HVAC Optimisation & BMS Tuning',
    badge: 'ENERGY INTEL // SUB-METERING',
    tagline: 'Predictive weather-compensated setpoint adjustments reducing gas and electricity burn.',
    description: 'Deploying edge compute and cloud AI algorithms interfacing with existing Trend, Tridium, and Siemens BMS controllers to dynamically optimize heating curves and chiller staging.',
    icon: Zap,
    liveDeployments: [
      'Grade-A corporate office headquarters',
      'Secondary healthcare outpatient clinics',
      'Higher education multi-building campuses',
    ],
    techRequirements: ['BACnet IP / Modbus gateway compatibility', 'Cloud API encryption (TLS 1.3)', 'Read/write control overrides'],
    pilotPhases: '2-week non-invasive passive monitoring &rarr; 60-day active closed-loop optimisation',
    targetOutcome: 'Verified 14–22% kWh reduction in HVAC energy consumption without tenant thermal complaints',
  },
  {
    id: 'smart-water',
    name: 'Wireless Water Hygiene & Legionella Telemetry',
    badge: 'STATUTORY WATER // WIRELESS TEMPERATURE',
    tagline: 'Automated pipe temperature logging replacing manual monthly thermometer checks.',
    description: 'Automated clamp-on pipe temperature sensors that log sentinel tap flow temperatures, calorifier flow/return, and cold storage tank ambient temperatures 24 hours a day under ACoP L8 standards.',
    icon: Droplets,
    liveDeployments: [
      'Commercial multi-tenanted office washrooms',
      'Residential care and healthcare accommodation',
      'Hotel hot water generation and return loops',
    ],
    techRequirements: ['Pipe-surface non-invasive clamp sensors', '10-year battery life', 'Automated HSG274 compliance reporting'],
    pilotPhases: '30-day side-by-side verification against manual logbook readings',
    targetOutcome: 'Continuous 24/7 water safety compliance and elimination of manual paper logbooks',
  },
];

export function InnovationTracksExplorer() {
  const [activeTrackId, setActiveTrackId] = useState(TRACKS[0].id);

  const selected = TRACKS.find((t) => t.id === activeTrackId) || TRACKS[0];
  const Icon = selected.icon;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="container-wide">
        <div className="max-w-3xl mb-14">
          <span className="eyebrow eyebrow-light">DIGITAL FM &amp; SMART BUILDINGS</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-slate-900 leading-tight">
            Four Priority Innovation &amp; Technology Tracks
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            We partner with IoT innovators, sensor manufacturers, and software developers to pilot, validate, and scale intelligent building technologies across live commercial property portfolios.
          </p>
        </div>

        {/* Track Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId;
            const TrackIcon = track.icon;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                className={`text-left p-5 rounded-sm border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-pink bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-[#FAF9FB] text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-sm ${isSelected ? 'bg-brand-pink text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                    <TrackIcon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-normal uppercase tracking-wider ${isSelected ? 'text-brand-pink' : 'text-slate-400'}`}>
                    TRACK
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] font-light mb-1 line-clamp-1">{track.name.split(' ')[0]} {track.name.split(' ')[1]}</h3>
                  <span className="text-[11px] text-slate-500 font-light block line-clamp-1">{track.badge.split('//')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Track Detail Card */}
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
              Submit Technology for Pilot <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-700 font-light leading-relaxed max-w-4xl">
            {selected.description}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pt-8 border-t border-slate-200">
            {/* Deployments & Tech Specs */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block mb-2">
                  LIVE TESTBED APPLICATIONS
                </span>
                <ul className="space-y-2">
                  {selected.liveDeployments.map((dep, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-slate-700 font-light">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{dep}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-normal uppercase tracking-wider text-slate-500 block mb-2">
                  TECHNICAL COMPATIBILITY REQUIREMENTS
                </span>
                <div className="flex flex-wrap gap-2">
                  {selected.techRequirements.map((req, j) => (
                    <span key={j} className="px-3 py-1 bg-white border border-slate-200 text-xs text-slate-800 font-light rounded-sm">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pilot Phase & Outcome Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-brand-pink block font-medium">
                  STANDARD PILOT ROADMAP
                </span>
                <p className="text-xs text-slate-900 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: selected.pilotPhases }} />
              </div>

              <div className="bg-white p-5 rounded-sm border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-normal uppercase tracking-wider text-emerald-700 block font-medium">
                  COMMERCIAL TARGET OUTCOME
                </span>
                <p className="text-xs text-slate-700 font-light leading-relaxed">
                  {selected.targetOutcome}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
