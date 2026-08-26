'use client';

import React, { useState, useMemo } from 'react';
import { 
  History, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Cpu, 
  Coffee,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export type PastEventCategory = 
  | 'all'
  | 'breakfast'
  | 'technical-training'
  | 'oem-partner-days'
  | 'open-days'
  | 'evening-networking'
  | 'product-demos'
  | 'industry-forums'
  | 'supplier-development';

export interface PastEventRecord {
  id: string;
  title: string;
  category: PastEventCategory;
  categoryLabel: string;
  period: string;
  year: string;
  location: string;
  hostPartner: string;
  audience: string;
  summary: string;
  practicalContext: string;
  keyTopics: string[];
  formalisationNote: string;
}

const PAST_EVENTS_ARCHIVE: PastEventRecord[] = [
  // ── 2026 EVENTS ──
  {
    id: 'event-breakfast-2026',
    title: 'Supplier Breakfast Morning — Relationship, Standards & Service Delivery',
    category: 'breakfast',
    categoryLabel: 'Supplier Breakfasts',
    period: '2026',
    year: '2026',
    location: 'Midlands Commercial Hub',
    hostPartner: 'EntireFM Operations Leadership & Supply Chain Desk',
    audience: 'Regional Approved Contractors, Specialists, Facilities Leads',
    summary: 'A practical morning session focused on relationships, service quality, communication and the evolving standards expected within the EntireFM supply chain.',
    practicalContext: 'Morning relationship forum sharing estate performance data, client feedback themes, and upcoming regional maintenance programmes.',
    keyTopics: [
      'Supply Chain Communication Channels & CAFM Dispatch Improvements',
      'Quality Assurance Benchmarks on Building Fabric & M&E Services',
      'Transparent 30-Day Payment Schedules & Invoicing Best Practice',
      'Expanding Regional Work Order Opportunities across the Midlands'
    ],
    formalisationNote: 'Scheduled bi-annually as part of the Partner Network regional engagement.'
  },
  {
    id: 'event-open-day-2026',
    title: 'Manufacturer Open Day — Commercial Electrical & Technical Solutions',
    category: 'open-days',
    categoryLabel: 'Open Days',
    period: '2026',
    year: '2026',
    location: 'Regional Innovation & Plant Centre',
    hostPartner: 'Building Systems & Electrical OEM Partners',
    audience: 'Electrical Engineers, Technical Contractors, Project Managers',
    summary: 'An open-day style session giving suppliers and technical contacts access to products, systems and manufacturer insight relevant to commercial FM environments.',
    practicalContext: 'Hands-on open day showcasing the latest energy-efficient plantroom equipment, LED lighting controls, and power-monitoring hardware.',
    keyTopics: [
      'Commercial Lighting Controls & DALI-2 System Commissioning',
      'Sub-Metering & Building Energy Management Systems (BEMS)',
      'EV Charging Infrastructure Installation & Load Balancing',
      'Direct Technical Support Channels with Equipment Manufacturers'
    ],
    formalisationNote: 'Part of the open days stream connecting contractors with leading OEMs.'
  },
  {
    id: 'event-training-2026',
    title: 'Partner Training Day — Supplier Development & Technical Knowledge',
    category: 'technical-training',
    categoryLabel: 'Technical Training',
    period: '2026',
    year: '2026',
    location: 'Northern Engineering Centre',
    hostPartner: 'EntireFM Technical Compliance Desk',
    audience: 'Front-Line Technicians, Qualified Trades, Service Supervisors',
    summary: 'A development-focused training session supporting supplier capability, technical knowledge and stronger field delivery outcomes.',
    practicalContext: 'Practical engineering workshop reinforcing statutory testing standards, gas safety protocols, and mechanical equipment servicing checklists.',
    keyTopics: [
      'Commercial Gas Safety (Installation & Use) Regulations & CP17 Certificates',
      'F-Gas Logbook Accuracy & Leak-Check Verification',
      'Emergency Lighting 3-Hour Discharge Testing Best Practice',
      'High-Quality Asset Data Collection for Digital O&M Records'
    ],
    formalisationNote: 'A foundational component of the Supplier Academy curriculum.'
  },
  {
    id: 'event-collaboration-2026',
    title: 'Industry Collaboration Session — Innovation, Technology & FM Operations',
    category: 'oem-partner-days',
    categoryLabel: 'Manufacturer Partner Days',
    period: '2026',
    year: '2026',
    location: 'Manchester Technology Suite',
    hostPartner: 'EntireFM Innovation Team & Technology Partners',
    audience: 'PropTech Providers, Asset Managers, Specialist Engineering Contractors',
    summary: 'A collaborative session around operational improvement, innovation and practical technology relevance within FM service delivery.',
    practicalContext: 'Collaborative forum evaluating how live sensor telemetry, mobile CAFM features, and automated job dispatch reduce client downtime.',
    keyTopics: [
      'Predictive Maintenance Workflows & Sensor-Triggered Job Tickets',
      'Client Portal Transparency & Real-Time Service Verification',
      'Carbon & Energy Reduction Opportunities in Commercial Plant',
      'Future Technical Skills & Supply Chain Apprenticeship Development'
    ],
    formalisationNote: 'Now an integral part of the Annual Partner Network Innovation stream.'
  },

  // ── 2025 EVENTS ──
  {
    id: 'event-london-evening-2025',
    title: 'London Supplier & Industry Evening',
    category: 'evening-networking',
    categoryLabel: 'Evening Networking',
    period: 'Spring 2025',
    year: '2025',
    location: 'London Hub',
    hostPartner: 'EntireFM Southern Operations & Trade Network',
    audience: 'Supplier Contacts, Technical Specialists, Commercial Property Leads',
    summary: 'An informal evening session bringing together supplier contacts, technical specialists and wider property-industry relationships for discussion around FM delivery, market trends and future collaboration.',
    practicalContext: 'Organised to discuss regional commercial property trends, tenant service levels, and out-of-hours project coordination across London and the South East.',
    keyTopics: [
      'London Commercial Office Occupancy & Maintenance Expectations',
      'Permit to Work (PTW) & High-Security Building Access Protocols',
      'Collaborative Delivery across Multi-Tenant Commercial Estates',
      'Contractor Feedback on Rapid Payment & Digital Job Dispatch'
    ],
    formalisationNote: 'Now embedded in the bi-annual Regional Supplier Networking schedule.'
  },
  {
    id: 'event-oem-electrical-2025',
    title: 'Manufacturer Partner Day — Electrical Systems & Product Development',
    category: 'oem-partner-days',
    categoryLabel: 'Manufacturer Partner Days',
    period: 'Summer 2025',
    year: '2025',
    location: 'Midlands Technical Centre',
    hostPartner: 'Electrical Switchgear & Distribution OEM Partner',
    audience: 'Commercial Electricians, NICEIC Contractors, M&E Project Managers',
    summary: 'A practical manufacturer-led session focused on evolving electrical products, installation considerations and supply-chain collaboration relevant to commercial facilities management.',
    practicalContext: 'Conducted in collaboration with equipment manufacturers to review modern distribution board retrofits, surge protection, and harmonic mitigation in live estates.',
    keyTopics: [
      'BS 7671 18th Edition Amendment Compliance & Surge Protection (SPD)',
      'Thermographic Survey Standards on Commercial Switchgear',
      'Smart Energy Metering & Modbus Telemetry Integration',
      'Manufacturer Warranty Standards & Approved Installer Certification'
    ],
    formalisationNote: 'Part of the core "Meet the Manufacturer" OEM collaboration programme.'
  },
  {
    id: 'event-breakfast-yorkshire-2025',
    title: 'Supplier Breakfast — Regional Performance, Service Standards & Growth',
    category: 'breakfast',
    categoryLabel: 'Supplier Breakfasts',
    period: 'Autumn 2025',
    year: '2025',
    location: 'Yorkshire & Humber Regional Hub',
    hostPartner: 'EntireFM Northern Operations Team',
    audience: 'Regional Trade Contractors, M&E Specialists, Fabric Teams',
    summary: 'A breakfast session with regional trade contractors discussing service expectations, operational standards, supply-chain capability and future opportunities.',
    practicalContext: 'Face-to-face breakfast briefing held to align regional trade contractors with newly secured industrial and logistics estate contracts across the region.',
    keyTopics: [
      'First-Time-Fix Ratios & SLA Adherence on Reactive Work Orders',
      'Digital Evidence Capture & Photographic Upload Standards in CAFM',
      'Planned Maintenance (PPM) Asset Register Verification',
      'Transparent Rate Cards & Emergency Callout Frameworks'
    ],
    formalisationNote: 'Standardised into the regular regional supplier breakfast series.'
  },
  {
    id: 'event-technical-training-2025',
    title: 'Technical Training Workshop — Equipment, Compliance & Safe Delivery',
    category: 'technical-training',
    categoryLabel: 'Technical Training',
    period: 'Late 2025',
    year: '2025',
    location: 'Regional Specialist Training Facility',
    hostPartner: 'EntireFM Compliance Desk & Technical Safety Partners',
    audience: 'Subcontractor Supervisors, Trade Engineers, Safety Leads',
    summary: 'A supplier-development session focused on practical competence, technical understanding and safe operational delivery across specialist FM services.',
    practicalContext: 'Organised to support supplier development, ensuring front-line operatives adhere to strict safe isolation, working at height, and RAMS procedures.',
    keyTopics: [
      'Safe Isolation Procedures & Lockout/Tagout (LOTO) Auditing',
      'Dynamic Risk Assessment (DRA) in Occupied Environments',
      'Working at Height Hierarchy & Temporary Access Equipment Protocols',
      'Statutory Certification Turnaround & Digital Handover'
    ],
    formalisationNote: 'Integrated into the Supplier Academy training curriculum.'
  },

  // ── 2024 EVENTS ──
  {
    id: 'past-chiller-training-2024',
    title: 'Commercial Chiller Efficiency & Low-GWP Refrigerant Transition',
    category: 'technical-training',
    categoryLabel: 'Technical Training',
    period: 'Autumn 2024',
    year: '2024',
    location: 'Manchester Engineering Centre',
    hostPartner: 'Jointly attended with OEM Technical Specialists',
    audience: 'HVAC Contractors, Chiller Engineers, EntireFM Technical Leads',
    summary: 'Practical hands-on technical workshop covering the operational transition to A2L lower-GWP refrigerants (R32 and R454B), compressor overhaul diagnostics, and F-Gas containment protocols across commercial estates.',
    practicalContext: 'Organised as an engineering training session to align regional sub-contractor teams with emerging F-Gas Phase-Down milestones and commercial chiller overhaul best practice.',
    keyTopics: [
      'A2L Mildly Flammable Refrigerant Handling & Leak Detection (BS EN 378)',
      'Variable Speed Inverter Compressor Diagnostics & Vibration Analysis',
      'Electronic Expansion Valve (EEV) Tuning for Energy Reduction',
      'F-Gas Logbook Compliance & Automated Leak-Check Records in CAFM'
    ],
    formalisationNote: 'Now formalised into the quarterly "Meet the Manufacturer" OEM series within the EntireFM Partner Network.'
  },
  {
    id: 'past-sheffield-breakfast-2024',
    title: 'Yorkshire Trade Contractors Morning: Procurement, SLAs & CAFM Integration',
    category: 'breakfast',
    categoryLabel: 'Supplier Breakfasts',
    period: 'Summer 2024',
    year: '2024',
    location: 'Sheffield Central Hub',
    hostPartner: 'EntireFM Operations Team & Regional Supply Chain',
    audience: 'Mechanical, Electrical, Fabric & Roofing Contractors (Yorkshire Region)',
    summary: 'Informal breakfast session bringing together local Yorkshire trade specialists to review EntireFM property portfolio expansion, transparent 30-day payment processes, and mobile job sheet standards.',
    practicalContext: 'Initiated to replace email ping-pong with a face-to-face briefing on local estate allocations, response SLAs, and clear expectations for trade sign-offs.',
    keyTopics: [
      'EntireFM Commercial Estate Pipeline across South & West Yorkshire',
      'First-Time-Fix SLA Expectations for Reactive Maintenance',
      'Digital Job Sign-Off & Evidence Photo Standards',
      'Open Q&A on Rate Cards, Emergency Standby & Out-of-Hours Works'
    ],
    formalisationNote: 'Now structured into the bi-annual Regional Supplier Breakfasts across Northern, Midlands and London hubs.'
  },

  // ── 2023 EVENTS ──
  {
    id: 'past-fire-damper-demo-2023',
    title: 'Fire Damper Testing & Smoke Control Verification in Occupied Estates',
    category: 'product-demos',
    categoryLabel: 'Product Demonstrations',
    period: 'Winter 2023',
    year: '2023',
    location: 'Leeds Commercial Facility',
    hostPartner: 'Specialist Fire & Smoke Control Partner',
    audience: 'Fire Safety Engineers, Compliance Auditors, Facilities Managers',
    summary: 'Live physical drop-testing demonstration of motorized and thermal fuse fire dampers within a live commercial ductwork layout, highlighting common access restrictions and photographic verification standards.',
    practicalContext: 'A practical demonstration session arranged after building audits identified inaccessible ceiling dampers across legacy multi-tenant properties.',
    keyTopics: [
      'BS 9999 Annual Fire Damper Inspection & Physical Drop Verification',
      'Access Hatch Retrofit Best Practice in Suspended Ceilings',
      'Fusible Link Replacement & Micro-Switch Telemetry Integration',
      'Audit-Ready Photographic Evidence Generation for Building Safety Regulators'
    ],
    formalisationNote: 'Incorporated into the Life Safety & Compliance Technical Focus track of the Partner Network.'
  },
  {
    id: 'past-london-networking-2023',
    title: 'London & South East Contractor Relationship & Property Briefing',
    category: 'evening-networking',
    categoryLabel: 'Evening Networking',
    period: 'Autumn 2023',
    year: '2023',
    location: 'City of London Hub',
    hostPartner: 'EntireFM Southern Operations',
    audience: 'M&E Specialists, Fabric Contractors, Specialist Cleaning Partners',
    summary: 'Informal evening gathering of key London contractor partners and EntireFM operations managers to review commercial office trends, out-of-hours access protocols, and 2024 estate growth.',
    practicalContext: 'An informal evening to thank dependable supplier partners, gather direct feedback on contract terms, and discuss upcoming portfolio tenders face-to-face.',
    keyTopics: [
      'City of London & Docklands Estate Maintenance Requirements',
      'Permit to Work (PTW) Protocols & High-Security Building Access',
      'Contractor Feedback on Invoicing Speeds & CAFM Ease-of-Use',
      'Collaborative Tendering Opportunities for Multi-Site Accounts'
    ],
    formalisationNote: 'Evolved into the formal Annual Supplier Networking Evening scheduled across core regional cities.'
  },
  {
    id: 'past-bms-oem-day-2023',
    title: 'Building Management Systems (BMS), Tridium Niagara & Energy Optimisation',
    category: 'oem-partner-days',
    categoryLabel: 'Manufacturer Partner Days',
    period: 'Spring 2023',
    year: '2023',
    location: 'Midlands Controls Facility',
    hostPartner: 'Controls & Telemetry OEM Partner',
    audience: 'BMS Controls Engineers, Energy Managers, Technical Supervisors',
    summary: 'Technical OEM partner day focusing on BACnet IP integration, HVAC set-point drift remediation, weather compensation tuning, and cloud telemetry gateways.',
    practicalContext: 'Technical collaboration day held at an OEM technical centre to evaluate how smart controls could be retrofitted onto aging client boiler and chiller plants without full replacement.',
    keyTopics: [
      'BACnet MS/TP to IP Routing & Network Troubleshooting',
      'Deadband Optimization & Optimised Start/Stop Algorithms',
      'Energy Consumption Benchmarking via Real-Time Telemetry',
      'Early Fault Detection in Variable Speed Drives & Chilled Water Loops'
    ],
    formalisationNote: 'Now a key pillar of the Partner Network Industry & OEM Partner stream.'
  },

  // ── 2022 EVENTS ──
  {
    id: 'past-water-hygiene-workshop-2022',
    title: 'ACOP L8 Compliance, Water Hygiene & Calorifier Inspection Workshop',
    category: 'supplier-development',
    categoryLabel: 'Supplier Development',
    period: 'Autumn 2022',
    year: '2022',
    location: 'Sheffield Technical Training Room',
    hostPartner: 'Water Treatment Specialist & EntireFM Compliance Team',
    audience: 'Plumbing Contractors, Water Hygiene Technicians, Building Managers',
    summary: 'Practical supplier development session covering legionella risk assessment execution, cold water storage tank inspection criteria, sentinel temperature logging, and microbiological sampling.',
    practicalContext: 'Organised to bring regional plumbing sub-contractors onto a single standardised logbook and sampling methodology across all EntireFM managed properties.',
    keyTopics: [
      'HSE ACOP L8 & HSG274 Part 2 / Part 3 Practical Application',
      'Calorifier Blowdown & Inspection Port Inspection Procedures',
      'Temperature Monitoring Best Practice & Digital Logbook Archiving',
      'Disinfection & Remedial Action Protocols for Stagnant Pipework'
    ],
    formalisationNote: 'Standardised into the Supplier Academy compliance training curriculum.'
  },
  {
    id: 'past-height-safety-demo-2022',
    title: 'Safe Working at Height, Mansafe Systems & Anchor Testing Demonstration',
    category: 'open-days',
    categoryLabel: 'Open Days',
    period: 'Summer 2022',
    year: '2022',
    location: 'North West Specialist Training Grounds',
    hostPartner: 'Height Safety Equipment Specialist',
    audience: 'Roofing Contractors, Rope Access Technicians, Facade Engineers',
    summary: 'Interactive open day featuring pull-testing demonstrations on concrete and steel chemical anchors, mansafe cable tensioning, and rescue plan drills for rooftop maintenance teams.',
    practicalContext: 'Conducted to reinforce zero-compromise height safety standards and share best practices in anchor pull-testing certification ahead of major rooftop refurbishment works.',
    keyTopics: [
      'BS EN 795 Anchor Testing & EN 365 Personal Fall Protection Inspection',
      'Safe Rigging Protocols for Fragile Roof Environments',
      'Dynamic Risk Assessment (DRA) under WAHR 2005',
      'Emergency Rescue Planning & Equipment Deployment Drills'
    ],
    formalisationNote: 'Formalised within the High-Risk Compliance & Assurance module of the Partner Network.'
  },

  // ── 2021 EVENTS ──
  {
    id: 'past-proptech-forum-2021',
    title: 'PropTech, IoT Sensors & Predictive Maintenance Roundtable',
    category: 'industry-forums',
    categoryLabel: 'Industry Forums',
    period: 'Winter 2021',
    year: '2021',
    location: 'London Technology Suite',
    hostPartner: 'EntireFM Innovation Working Group & IoT Sensor Partners',
    audience: 'Sensor Manufacturers, CAFM Architects, Maintenance Directors',
    summary: 'Industry roundtable discussing the practical realities of deploying wireless vibration and temperature sensors on plantroom machinery to move away from purely reactive callouts.',
    practicalContext: 'An exploratory industry forum that directly influenced EntireFM’s development of automated sensor work orders within the EntireCAFM platform.',
    keyTopics: [
      'LoRaWAN vs Cellular Gateways in Heavy Concrete Plantrooms',
      'Vibration FFT Analysis for Early Bearing Failure Detection',
      'Integrating Sensor Anomaly Alerts into Automated Work Orders',
      'Commercial Payback Models for Building Owners & Managing Agents'
    ],
    formalisationNote: 'Now permanently established as the Partner Network Innovation & PropTech Stream.'
  }
];

const ARCHIVE_CATEGORIES = [
  { id: 'all', label: 'All Past Activity' },
  { id: 'breakfast', label: 'Supplier Breakfasts' },
  { id: 'technical-training', label: 'Technical Training' },
  { id: 'oem-partner-days', label: 'Manufacturer Partner Days' },
  { id: 'open-days', label: 'Open Days' },
  { id: 'evening-networking', label: 'Evening Networking' },
  { id: 'product-demos', label: 'Product Demonstrations' },
  { id: 'industry-forums', label: 'Industry Forums' },
  { id: 'supplier-development', label: 'Supplier Development' },
];

export function PastEventsArchiveSection() {
  const [selectedCategory, setSelectedCategory] = useState<PastEventCategory>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const years = ['all', '2026', '2025', '2024', '2023', '2022', '2021'];

  const filteredEvents = useMemo(() => {
    return PAST_EVENTS_ARCHIVE.filter((evt) => {
      const matchCat = selectedCategory === 'all' || evt.category === selectedCategory;
      const matchYear = selectedYear === 'all' || evt.year === selectedYear;
      return matchCat && matchYear;
    });
  }, [selectedCategory, selectedYear]);

  return (
    <section id="past-events" className="py-20 sm:py-28 bg-[#FAF9FB] border-b border-slate-200 font-sans">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              HISTORICAL PARTNER ACTIVITY &amp; COLLABORATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
            We&apos;ve been bringing suppliers together for years.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Not every past session carried an EntireFM event brand or formal programme title. Many were practical supplier, training and manufacturer sessions organised with partners or attended by EntireFM teams. We are now bringing those activities together as part of the wider Partner Network story.
          </p>
        </div>

        {/* Narrative Box - Confident, natural positioning with zero defensive language */}
        <div className="mb-10 p-6 sm:p-7 rounded-sm bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-normal uppercase tracking-wider text-brand-pink">
              <History className="w-4 h-4" />
              <span>Evolution into the EntireFM Partner Network</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-light leading-relaxed">
              The EntireFM Partner Network formalises and builds on years of supplier breakfasts, technical sessions, manufacturer engagement and training activity. What was once delivered more informally is now being shaped into a more structured programme of relationship-building, learning and industry collaboration.
            </p>
          </div>

          <a
            href="/suppliers/partner-network"
            className="btn-outline text-xs py-2.5 px-4 shrink-0 inline-flex items-center gap-1.5 font-normal"
          >
            <span>Explore Partner Network</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {ARCHIVE_CATEGORIES.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as PastEventCategory)}
                  className={`whitespace-nowrap px-3 py-1.5 text-xs font-normal rounded-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Year Select Filter */}
          <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto">
            <span className="text-[11px] font-normal uppercase tracking-wider text-slate-400">Filter Year:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-slate-200">
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 text-xs rounded-xs font-normal transition-all ${
                    selectedYear === yr
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {yr === 'all' ? 'All' : yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="space-y-5">
          {filteredEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-slate-500 font-light text-sm">
              No historical records found for this category and year combination.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const isExpanded = expandedId === evt.id;
              return (
                <div
                  key={evt.id}
                  className="bg-white border border-slate-200/90 rounded-sm p-6 sm:p-7 hover:border-slate-300 transition-all duration-200 shadow-2xs space-y-5"
                >
                  {/* Card Header Row */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-normal uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-xs">
                          {evt.categoryLabel}
                        </span>
                        <span className="text-[10px] font-normal uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-xs">
                          {evt.period}
                        </span>
                        <span className="text-[11px] font-light text-slate-400">
                          {evt.hostPartner}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-light text-slate-900 leading-tight">
                        {evt.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 font-light max-w-4xl leading-relaxed">
                        {evt.summary}
                      </p>
                    </div>

                    <div className="shrink-0 pt-1">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                        className="btn-outline text-xs py-2 px-3.5 inline-flex items-center gap-1 font-normal"
                      >
                        <span>{isExpanded ? 'Hide Technical Context' : 'View Full Details & Topics'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-light">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-pink shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Participants: <strong className="font-normal text-slate-700">{evt.audience}</strong></span>
                    </div>
                  </div>

                  {/* Expandable Technical Context & Key Topics */}
                  {isExpanded && (
                    <div className="mt-4 pt-5 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#FAF9FB] p-5 sm:p-6 rounded-xs border border-slate-200/80 animate-in fade-in duration-300">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-400 block mb-1.5">
                            PRACTICAL CONTEXT:
                          </span>
                          <p className="text-xs text-slate-700 font-light leading-relaxed">
                            {evt.practicalContext}
                          </p>
                        </div>

                        <div className="p-3.5 bg-white rounded-xs border border-brand-pink/20">
                          <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink block mb-1">
                            HOW THIS IS NOW FORMALISED:
                          </span>
                          <p className="text-xs text-slate-800 font-light leading-relaxed">
                            {evt.formalisationNote}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10.5px] font-normal uppercase tracking-wider text-slate-400 block">
                          CORE TECHNICAL &amp; OPERATIONAL FOCUS AREAS:
                        </span>
                        <div className="space-y-2">
                          {evt.keyTopics.map((topic, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink shrink-0 mt-0.5" />
                              <span className="font-light">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Closing Note on Historical Records */}
        <div className="mt-12 p-6 rounded-sm bg-white border border-slate-200/80 text-center max-w-3xl mx-auto space-y-2">
          <p className="text-xs text-slate-500 font-light">
            Have you participated in a previous supplier breakfast, training session or technical demonstration with EntireFM?
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-normal">
            <a href="/suppliers/partner-network" className="text-brand-pink hover:underline">
              Join the formal Partner Network →
            </a>
            <span className="text-slate-300">|</span>
            <a href="/suppliers/apply" className="text-slate-700 hover:underline">
              Apply as an Approved Supplier →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
