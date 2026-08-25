'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, ArrowUpRight } from 'lucide-react';

export interface DisciplineCategory {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  trades: string[];
  standards: string[];
  href: string;
}

export const CAPABILITY_DISCIPLINES: DisciplineCategory[] = [
  {
    id: 'engineering',
    title: 'Hard FM & Engineering',
    eyebrow: 'M&E // CRITICAL SYSTEMS',
    description: 'Precision mechanical, electrical, HVAC and building management systems maintenance for high-load commercial and industrial property.',
    imageSrc: '/images/editorial/entirefm-switchgear-inspection-2000w.webp',
    imageAlt: 'EntireFM electrical engineer conducting switchgear testing in commercial switchroom',
    trades: ['Electrical Systems (NICEIC)', 'Mechanical & Heating (Gas Safe)', 'HVAC & Chillers (F-Gas / REFCOM)', 'BMS Controls & Telemetry', 'Standby Generators & UPS', 'Pumps & Pressurisation'],
    standards: ['BS 7671 Fixed Wire', 'SFG20 Maintenance Standards', 'Gas Safety Regulations', 'F-Gas Containment Register'],
    href: '/mechanical-electrical',
  },
  {
    id: 'fabric',
    title: 'Building Fabric & Envelope',
    eyebrow: 'STRUCTURAL // FABRIC MAINTENANCE',
    description: 'Structural integrity, weatherproofing, industrial roofing, commercial glazing, and proactive building fabric asset preservation.',
    imageSrc: '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp',
    imageAlt: 'EntireFM building surveyors inspecting commercial rooftop and envelope structure',
    trades: ['Commercial Roofing & Membrane Repairs', 'Architectural Glazing & Curtain Walling', 'Industrial Doors & Dock Levellers', 'Specialist Flooring & Screeds', 'Drainage & Civils', 'General Building Remedials'],
    standards: ['Building Regulations Compliance', 'NFRC Roofing Standards', 'DDA / Accessibility Standards', 'BS EN 12604 Doors'],
    href: '/building-maintenance',
  },
  {
    id: 'access',
    title: 'Specialist Access & Height',
    eyebrow: 'IRATA // HIGH-LEVEL ACCESS',
    description: 'Controlled high-level maintenance, façade inspections, BMU cradle operations, and rope access engineering across complex structures.',
    imageSrc: '/images/services/working-at-height/hero-rope-access.png',
    imageAlt: 'IRATA rope access specialist conducting high-level commercial façade maintenance',
    trades: ['IRATA Industrial Rope Access', 'Building Maintenance Units (BMU)', 'MEWP & Spider Boom Access (IPAF)', 'Fall Arrest & Latchway Certification', 'Confined Space Engineering', 'Specialist High-Level Façade Remedials'],
    standards: ['Work at Height Regulations 2005', 'BS 7985 Rope Access Code', 'LOLER 1998 Lifting Operations', 'IRATA International Framework'],
    href: '/working-at-height-rope-access-bmu',
  },
  {
    id: 'fire-life-safety',
    title: 'Fire & Life Safety Systems',
    eyebrow: 'STATUTORY // LIFE SAFETY',
    description: 'Fully accredited fire detection, emergency lighting, automated suppression, smoke ventilation, and certified fire door maintenance.',
    imageSrc: '/images/editorial/entirefm-access-control-install-2000w.webp',
    imageAlt: 'EntireFM safety technician inspecting commercial fire and life safety interface panel',
    trades: ['Addressable Fire Alarms (BAFE / FIA)', 'Emergency Lighting BS 5266', 'Sprinkler & Water Mist Systems', 'Gaseous Fire Suppression', 'Fire Door Inspection & Remedials', 'Dry & Wet Riser Statutory Testing'],
    standards: ['Regulatory Reform (Fire Safety) Order 2005', 'BS 5839 Fire Detection', 'BS 9999 Code of Practice', 'FIRAS / BM TRADA Fire Doors'],
    href: '/fire-emergency-systems',
  },
  {
    id: 'security',
    title: 'Security & Access Control',
    eyebrow: 'PROTECTION // ACCESS INTELLIGENCE',
    description: 'Enterprise access systems, IP CCTV networks, perimeter intruder detection, automated barrier controls, and SIA security presence.',
    imageSrc: '/images/editorial/entirefm-corporate-corridor-2000w.webp',
    imageAlt: 'EntireFM corporate security access point and identity control system',
    trades: ['Enterprise IP CCTV & Video Analytics', 'Biometric & RFID Access Control', 'Intruder Detection & Monitored Alarms', 'Automated Gates & Security Turnstiles', 'SIA Manned Guarding & Mobile Patrols', 'Keyholding & Alarm Response'],
    standards: ['SIA Approved Contractor Scheme', 'NSI Gold / SSAIB Standards', 'BS 7858 Security Screening', 'Data Protection Act / GDPR Video'],
    href: '/security-services',
  },
  {
    id: 'cleaning-environmental',
    title: 'Cleaning & Environmental',
    eyebrow: 'HYGIENE // ENVIRONMENTAL MANAGEMENT',
    description: 'Commercial contract cleaning, industrial decontamination, high-level sanitisation, grounds maintenance, and sustainable waste streams.',
    imageSrc: '/images/editorial/entirefm-reception-2000w.webp',
    imageAlt: 'EntireFM commercial hygiene and corporate facility presentation',
    trades: ['Commercial Contract Office Cleaning', 'Industrial & Process Plant Cleaning', 'High-Level Specialist Decontamination', 'Grounds & Winter Gritting', 'Commercial Waste & Recycling', 'Washroom & Hygiene Services'],
    standards: ['BICSc Cleaning Standards', 'COSHH Safety Governance', 'ISO 14001 Environmental Management', 'Duty of Care Waste Regulations'],
    href: '/cleaning-services',
  },
  {
    id: 'compliance-inspection',
    title: 'Compliance & Statutory Inspection',
    eyebrow: 'STATUTORY // AUDITABLE ASSURANCE',
    description: 'Independent statutory inspections, water hygiene Legionella monitoring, asbestos surveying, pressure systems, and digital compliance archiving.',
    imageSrc: '/images/editorial/entirefm-distribution-board-testing-2000w.webp',
    imageAlt: 'EntireFM statutory compliance technician conducting periodic technical inspection',
    trades: ['Fixed Wire Testing (EICR) & PAT', 'Water Hygiene & Legionella ACOP L8', 'Asbestos Management Surveys', 'Pressure Systems PSSR 2000', 'LEV Statutory Examination', 'F-Gas Containment & Audit'],
    standards: ['HSE Approved Codes of Practice', 'ACOP L8 / HSG274 Water Safety', 'Control of Asbestos Regs 2012', 'PSSR 2000 Statutory Regs'],
    href: '/compliance',
  },
  {
    id: 'technology-innovation',
    title: 'Technology & Asset Intelligence',
    eyebrow: 'CONNECTED // IOT & SENSORS',
    description: 'Integrating IoT vibration sensors, thermal drone surveys, energy telemetry, CAFM integrations, and predictive maintenance algorithms.',
    imageSrc: '/images/editorial/entirefm-client-review-2000w.webp',
    imageAlt: 'EntireFM engineering directors reviewing live building telemetry and sensor diagnostics',
    trades: ['IoT Vibration & Temp Sensors', 'Thermal Aerial Drone Surveys', 'Sub-metering & Energy Monitoring', 'CAFM API & Sensor Integrations', 'Predictive Maintenance Failure Models', 'Digital Reality Capture & 3D Twins'],
    standards: ['ISO 27001 Information Security', 'SFG20 Dynamic Frequencies', 'Open BEMS Protocol Standards', 'Cyber Essentials Plus'],
    href: '/services/drone-services',
  },
];

export function CapabilityLandscape() {
  const [selectedCategory, setSelectedCategory] = useState<string>('engineering');
  const active = CAPABILITY_DISCIPLINES.find((c) => c.id === selectedCategory) || CAPABILITY_DISCIPLINES[0];

  return (
    <section className="py-24 bg-brand-carbon text-white relative overflow-hidden border-b border-brand-edge-dark">
      <div className="facet-rule pointer-events-none absolute inset-0 opacity-40" />

      <div className="container-wide relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-brand-edge-dark">
          <div>
            <span className="eyebrow eyebrow-dark">SUPPLY CHAIN SCOPE</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
              Capability Landscape &amp; Specialist Disciplines
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-mist/70 font-light max-w-2xl">
              EntireFM integrates national Tier 1 contractors, specialist regional SMEs, OEM engineers, and technology innovators across eight structured operating disciplines.
            </p>
          </div>
          <Link
            href="/suppliers/partner-with-entirefm"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-electric-bright hover:text-white transition-colors"
          >
            Explore Supplier Opportunities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Navigation Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-white/10">
          {CAPABILITY_DISCIPLINES.map((item) => {
            const isSelected = item.id === selectedCategory;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-sm text-xs font-medium transition-all text-left flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-brand-mist/70 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-brand-pink' : 'bg-transparent'}`} />
                {item.title}
              </button>
            );
          })}
        </div>

        {/* Category Detail Showcase */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[400px] rounded-sm overflow-hidden border border-brand-edge-dark">
            <Image
              src={active.imageSrc}
              alt={active.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-graphite via-brand-graphite/60 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6">
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-brand-electric-bright">
                {active.eyebrow}
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-1">
                {active.title}
              </h3>
              <p className="mt-2 text-xs text-brand-mist/80 leading-relaxed font-light">
                {active.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-brand-graphite/70 border border-brand-edge-dark p-6 sm:p-8 rounded-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-brand-mist/50 mb-3">
                  APPROVED TRADE DISCIPLINES &amp; SPECIALISMS
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {active.trades.map((trade, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 bg-white/[0.03] border border-white/5 rounded-sm hover:border-brand-electric/30 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-brand-electric-bright shrink-0 mt-0.5" />
                      <span className="text-xs text-brand-mist/90 leading-snug">{trade}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[11px] font-mono uppercase tracking-wider text-brand-mist/50 mb-3">
                  GOVERNING COMPLIANCE &amp; ACCREDITATION BENCHMARKS
                </p>
                <div className="flex flex-wrap gap-2">
                  {active.standards.map((std, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-[11px] font-mono bg-white/[0.06] text-brand-mist/90 px-3 py-1 rounded-sm border border-white/10"
                    >
                      {std}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/suppliers/apply"
                className="btn-primary text-xs py-2.5 px-5"
              >
                Apply as a Specialist Contractor <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/suppliers/standards"
                className="text-xs text-brand-mist/70 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                Review Operating Standards <ArrowUpRight className="h-3.5 w-3.5 text-brand-electric-bright" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
