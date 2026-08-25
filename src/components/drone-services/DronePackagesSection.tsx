'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Layers, 
  Flame, 
  Building2, 
  CloudLightning, 
  Construction, 
  CalendarClock, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface PackageItem {
  title: string;
  badge: string;
  icon: React.ElementType;
  tagline: string;
  description: string;
  scopePoints: string[];
  deliverables: string[];
  cadence: string;
  recommendedFor: string;
}

const DRONE_PACKAGES: PackageItem[] = [
  {
    title: 'Roof Condition Pack',
    badge: 'WATERPROOFING & DRAINAGE',
    icon: Layers,
    tagline: 'Comprehensive roof membrane, gutter & flashing audit',
    description: 'Complete visual and drainage condition assessment of flat roofs, pitched roofscapes, valleys, copings, and roof-mounted plant assets.',
    scopePoints: [
      'Membrane seam and puncture inspection',
      'Valley gutter and downpipe silt review',
      'Lead flashing, coping and parapet check',
      'HVAC penetration and plinth seal audit',
    ],
    deliverables: ['High-res georeferenced orthomosaic', 'Annotated defect register (PDF)', 'Actionable remedial quotation'],
    cadence: 'Biannual / Pre-Winter',
    recommendedFor: 'Logistics hubs, retail units, commercial offices, industrial plants',
  },
  {
    title: 'Building Envelope Pack',
    badge: 'EXTERNAL FABRIC & CLADDING',
    icon: Building2,
    tagline: 'Roof, façade, glazing & vertical envelope audit',
    description: 'Unified external envelope survey capturing high-level cladding, rain-screens, curtain walling, mastic joints, and parapet integrity.',
    scopePoints: [
      'Multi-storey vertical facade inspection',
      'Curtain wall glazing and gasket condition',
      'Mastic expansion joint degradation check',
      'High-level masonry spalling & panel alignment',
    ],
    deliverables: ['Façade elevation anomaly maps', 'Defect priority logbook', 'Rope access & BMU remedial scopes'],
    cadence: 'Annual / Strategic PPM',
    recommendedFor: 'Multi-tenanted city towers, corporate HQs, mixed-use developments',
  },
  {
    title: 'Energy Intelligence Pack',
    badge: 'THERMOGRAPHY & RENEWABLES',
    icon: Flame,
    tagline: 'Thermal heat loss & solar PV array inspection',
    description: 'Radiometric infrared survey quantifying building envelope heat loss, flat roof moisture entrapment, and photovoltaic electrical hotspots.',
    scopePoints: [
      'FLIR radiometric roof moisture survey',
      'Building thermal bridging & air leakage',
      'Solar PV module hotspot detection (IEC 62446-3)',
      'Rooftop HVAC thermal dissipation profiling',
    ],
    deliverables: ['Radiometric temperature datasets', 'Thermal anomaly defect map', 'Energy remediation recommendations'],
    cadence: 'Annual / Night Survey',
    recommendedFor: 'Commercial solar installations, heated warehouses, estates seeking ESG gains',
  },
  {
    title: 'Estate Condition Pack',
    badge: 'MULTI-ASSET REVIEWS',
    icon: Building2,
    tagline: 'Coordinated survey across multi-building estates',
    description: 'Multi-asset inspection programme capturing all buildings, access roads, drainage paths, and external perimeters across a large commercial estate.',
    scopePoints: [
      'Complete aerial estate baseline survey',
      'Standardized RAG condition score across assets',
      'Boundary, lighting & road surface audit',
      'Centralized CAFM asset register update',
    ],
    deliverables: ['Full estate master orthomosaic', 'Cross-property condition matrix', '5-Year CapEx maintenance forecast'],
    cadence: 'Annual / Strategic Portfolio Review',
    recommendedFor: 'Business parks, university campuses, NHS hospital trusts, retail parks',
  },
  {
    title: 'Storm Response Pack',
    badge: 'URGENT INCIDENT RESPONSE',
    icon: CloudLightning,
    tagline: 'Rapid post-incident damage & insurance triage',
    description: 'Rapid aerial deployment following severe weather, high winds, impact damage, or fire to safely evaluate damage and formulate make-safe scopes.',
    scopePoints: [
      'Safe visual access to dangerous structures',
      'Dislodged sheet & broken glass detection',
      'Geotagged loss adjuster evidence pack',
      'Immediate temporary weatherproofing scoping',
    ],
    deliverables: ['Urgent damage summary report', 'High-res insurance photo bundle', 'Same-day make-safe quotation'],
    cadence: 'Reactive (24–48h Attendance)',
    recommendedFor: 'Property managers, insurers, landlords following major storm events',
  },
  {
    title: 'Construction Monitoring Pack',
    badge: 'DEVELOPMENT TRACKING',
    icon: Construction,
    tagline: 'Scheduled repeat flight progress records',
    description: 'Recurring aerial capture from identical GPS-locked waypoints tracking groundworks, steel framing, envelope enclosure, and handover milestones.',
    scopePoints: [
      'Automated repeat-angle milestone photography',
      'Monthly georeferenced orthomosaic overlays',
      'Earthworks cut/fill volume monitoring',
      'Subcontractor progress verification archive',
    ],
    deliverables: ['Monthly progress reports (PDF)', 'Web viewer orthomosaics', 'Timestamped dispute evidence archive'],
    cadence: 'Weekly / Fortnightly / Monthly',
    recommendedFor: 'Main contractors, developers, fund monitors, project managers',
  },
  {
    title: 'Drone PPM Pack',
    badge: 'SFG20 INTEGRATED PPM',
    icon: CalendarClock,
    tagline: 'Cyclical drone audits embedded in planned maintenance',
    description: 'Long-term planned preventative maintenance programme integrating quarterly drainage sweeps, biannual roof audits, and annual envelope thermography.',
    scopePoints: [
      'Quarterly high-risk gutter & drain sweeps',
      'Biannual roof fabric & plant surveys',
      'Annual thermal & electrical scans',
      'Continuous EntireCAFM asset history sync',
    ],
    deliverables: ['Annual condition audit dashboard', 'Integrated maintenance work orders', 'Statutory compliance archive'],
    cadence: 'Continuous 52-Week Program',
    recommendedFor: 'Estate directors, managing agents seeking preventative FM governance',
  },
];

export function DronePackagesSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-200" id="packages">
      <div className="container-custom space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="font-mono text-xs font-normal uppercase tracking-wider text-brand-pink">
              OUTCOME-LED SURVEY PACKAGES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 leading-tight">
            Commercial Drone Inspection Packs
          </h2>

          <p className="text-base text-slate-600 leading-relaxed font-light">
            Tailored inspection scopes designed around real facilities management, building fabric, and estate governance requirements.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {DRONE_PACKAGES.map((pkg, idx) => {
            const Icon = pkg.icon;
            const isFeatured = idx === 0 || idx === 6; // Highlight Roof Pack and Drone PPM Pack
            return (
              <div
                key={idx}
                className={`p-7 rounded-[14px] border transition-all duration-300 flex flex-col justify-between group ${
                  isFeatured
                    ? 'bg-[#FAF9FB] border-brand-pink/60 shadow-md hover:border-brand-pink hover:shadow-lg'
                    : 'bg-white border-slate-200 shadow-sm hover:border-brand-pink hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-[10px] bg-white border border-slate-200 flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors shadow-subtle">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[9.5px] uppercase font-light text-slate-700 bg-slate-100 px-2 py-0.5 rounded-[4px]">
                      {pkg.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs font-normal text-brand-pink mt-0.5">
                      {pkg.tagline}
                    </p>
                    <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Scope Checklist */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10.5px] font-mono uppercase font-light text-slate-500 block">
                      Scope Includes:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {pkg.scopePoints.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-pink mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cadence & Recommended Meta */}
                  <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] font-mono text-slate-600">
                    <div>
                      <strong className="text-slate-900">Cadence:</strong> {pkg.cadence}
                    </div>
                    <div className="line-clamp-1">
                      <strong className="text-slate-900">Best for:</strong> {pkg.recommendedFor}
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={`/contact-us#enquiry`}
                    className="inline-flex items-center justify-between w-full text-xs font-normal text-brand-pink group-hover:text-brand-pink-dark transition-colors"
                  >
                    <span>Discuss {pkg.title} Scope</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Packages CTA Bar */}
        <div className="p-8 rounded-[14px] bg-[#0B1220] text-white flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h4 className="text-xl font-light text-white">
              Need a bespoke multi-site drone survey programme?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              We structure custom framework agreements across regional property portfolios and nationwide corporate estates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/contact-us#enquiry"
              className="inline-flex items-center gap-2 rounded-[8px] bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-5 py-3 text-xs font-normal text-white shadow-md hover:scale-[1.02] transition-all"
            >
              <span>Discuss an Inspection Programme</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
