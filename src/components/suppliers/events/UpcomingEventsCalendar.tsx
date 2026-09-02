'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Sparkles,
  Tag
} from 'lucide-react';

type EventCategory = 'all' | 'technical' | 'networking' | 'oem' | 'training' | 'innovation';

interface ScheduledEvent {
  id: string;
  title: string;
  format: string;
  category: EventCategory;
  discipline: string;
  status: 'CONFIRMED' | 'PLANNED / INDICATIVE' | 'INVITATION ONLY';
  membershipTier: 'ALL MEMBERS' | 'NETWORK PARTNER PRIORITY' | 'OPEN ACCESS';
  targetQuarter: string;
  location: string;
  audience: string;
  overview: string;
  sampleAgenda: Array<{ time: string; activity: string }>;
  keyTopics: string[];
}

const PLANNED_EVENTS: ScheduledEvent[] = [
  {
    id: 'hvac-oem-session',
    title: 'Commercial HVAC & Chiller Technology Briefing',
    format: 'Meet the Manufacturer',
    category: 'oem',
    discipline: 'HVAC & Plant Engineering',
    status: 'CONFIRMED',
    membershipTier: 'ALL MEMBERS',
    targetQuarter: 'Q3 2026',
    location: 'London (ExCeL Hub) & Manchester (Central)',
    audience: 'HVAC Contractors, Chiller Specialists, M&E Engineers, FM Operations',
    overview: 'Technical session exploring commercial plant efficiency, low-GWP refrigerant transition (F-Gas compliance), heat pump retrofits, and intelligent controls with factory engineering teams.',
    sampleAgenda: [
      { time: '08:30', activity: 'Arrival, breakfast rolls & networking' },
      { time: '09:00', activity: 'OEM Technical Briefing: Next-Gen Chiller Architecture' },
      { time: '09:45', activity: 'F-Gas & Low-GWP Compliance Panel' },
      { time: '10:30', activity: 'Live diagnostic breakout & engineer Q&A' },
      { time: '11:15', activity: 'Informal networking & close' },
    ],
    keyTopics: ['F-Gas (EC 517/2014) Phase-Down', 'Commercial Heat Pump COP Optimisation', 'Chiller Telemetry & Vibration Diagnostics'],
  },
  {
    id: 'fire-safety-breakfast',
    title: 'Fire & Life Safety — Compliance in Occupied Buildings',
    format: 'Technical Breakfast',
    category: 'technical',
    discipline: 'Life Safety & Statutory Compliance',
    status: 'CONFIRMED',
    membershipTier: 'ALL MEMBERS',
    targetQuarter: 'Q1 2026',
    location: 'Birmingham (NEC) & Leeds (City Hub)',
    audience: 'Fire Alarm Engineers, Compliance Managers, Managing Agents, Property Directors',
    overview: 'Practical morning briefing addressing BS 5839 addressable fire systems, smoke damper drop testing, emergency lighting 3-hour duration records, and Building Safety Act audits.',
    sampleAgenda: [
      { time: '08:00', activity: 'Hot breakfast & registration' },
      { time: '08:30', activity: 'Regulatory Review: BSA & Fire Safety Order 2005' },
      { time: '09:15', activity: 'Case Study: Managing Life Safety in Multi-Tenant Estates' },
      { time: '09:45', activity: 'Auditor Q&A & Certificate Archiving Standards' },
      { time: '10:15', activity: 'Networking & close' },
    ],
    keyTopics: ['BS 5839-1 & BS 5266-1', 'Digital Fire Logbook Verification', 'Damper Drop Test Evidence'],
  },
  {
    id: 'predictive-iot-session',
    title: 'Predictive Maintenance, IoT & Asset Telemetry',
    format: 'FM Innovation Session',
    category: 'innovation',
    discipline: 'PropTech & Asset Intelligence',
    status: 'PLANNED / INDICATIVE',
    membershipTier: 'NETWORK PARTNER PRIORITY',
    targetQuarter: 'Q3 2026',
    location: 'London (City Hub) & Online Stream',
    audience: 'PropTech Providers, OEMs, Engineering Contractors, FM Innovation Leads',
    overview: 'Hands-on session exploring how IoT vibration, temperature, and power-quality sensors integrate with EntireCAFM to trigger automatic work orders before equipment failure.',
    sampleAgenda: [
      { time: '09:30', activity: 'Coffee & demonstration exhibits' },
      { time: '10:00', activity: 'Keynote: Moving from SFG20 Time-Based to Condition-Based PPM' },
      { time: '10:45', activity: 'Live Telemetry & EntireCAFM Integration Demo' },
      { time: '11:30', activity: 'Contractor Panel: Commercial Value of Predictive FM' },
      { time: '12:15', activity: 'Buffet lunch & technology showcase' },
    ],
    keyTopics: ['IoT Sensor Deployment on Critical Pumps/Chillers', 'Automated Anomaly Work Orders', 'Reducing Unplanned Emergency Callouts'],
  },
  {
    id: 'procurement-briefing',
    title: 'Commercial FM Procurement & Work Allocation',
    format: 'Meet the Buyer',
    category: 'networking',
    discipline: 'Procurement & Commercial Delivery',
    status: 'CONFIRMED',
    membershipTier: 'OPEN ACCESS',
    targetQuarter: 'Q2 2026',
    location: 'Sheffield, Leeds & Regional Hubs',
    audience: 'Approved Contractors, New Supplier Applicants, Trade SMEs',
    overview: 'Transparent briefings on EntireFM property portfolio requirements, standard payment terms, tender evaluation matrices, and how work is allocated fairly to verified local partners.',
    sampleAgenda: [
      { time: '09:00', activity: 'Registration & coffee' },
      { time: '09:30', activity: 'EntireFM Procurement Framework & 2026 Package Scope' },
      { time: '10:15', activity: 'Quality, Safety & SLA Expectations for Trade Contractors' },
      { time: '10:45', activity: '1-on-1 Discussions with EntireFM Contract Managers' },
      { time: '11:45', activity: 'Close' },
    ],
    keyTopics: ['Prompt Payment & Automated Invoicing in CAFM', 'Fair Work Allocation Tiers', 'Scope Requirements by Trade'],
  },
  {
    id: 'supplier-academy-safety',
    title: 'RAMS, Safety Passports & EntireCAFM Mobile Workflows',
    format: 'Supplier Academy',
    category: 'training',
    discipline: 'Operations & Compliance Standards',
    status: 'CONFIRMED',
    membershipTier: 'ALL MEMBERS',
    targetQuarter: 'Q2 2026',
    location: 'National (Online Interactive Masterclass)',
    audience: 'Field Technicians, Subcontractor Supervisors, Operations Admins',
    overview: 'Interactive workshop training field teams on generating audit-ready dynamic RAMS, taking date-stamped photo evidence, and closing work orders smoothly via the EntireCAFM mobile app.',
    sampleAgenda: [
      { time: '10:00', activity: 'Welcome & Objectives' },
      { time: '10:15', activity: 'Standard of Excellence: RAMS & Dynamic Risk Assessment' },
      { time: '11:00', activity: 'Step-by-Step EntireCAFM App Walkthrough' },
      { time: '11:45', activity: 'Common Certificate Errors & How to Avoid Delays' },
      { time: '12:15', activity: 'Interactive Q&A & Certificate of Completion' },
    ],
    keyTopics: ['Audit-Ready Worksheets', 'Date-Stamped Photo Evidence', 'Accelerating Invoice Approval'],
  },
  {
    id: 'fixed-wire-breakfast',
    title: 'Fixed Wire Testing (EICR) & Electrical Distribution',
    format: 'Technical Breakfast',
    category: 'technical',
    discipline: 'Electrical Engineering',
    status: 'PLANNED / INDICATIVE',
    membershipTier: 'ALL MEMBERS',
    targetQuarter: 'Q4 2026',
    location: 'Manchester & Midlands Hubs',
    audience: 'Qualified Electricians, 18th Edition Inspectors, Commercial Landlords',
    overview: 'Deep dive into 18th Edition Amendment 2 inspection standards, thermal imaging thermography protocols, and resolving C1/C2 observation codes without site shutdown.',
    sampleAgenda: [
      { time: '08:00', activity: 'Breakfast rolls & registration' },
      { time: '08:30', activity: 'BS 7671 EICR Coding & Inspection Defect Consistency' },
      { time: '09:15', activity: 'Thermal Imaging & Load Balancing Case Studies' },
      { time: '09:45', activity: 'Q&A on Remediations & Statutory Compliance Records' },
      { time: '10:15', activity: 'Networking' },
    ],
    keyTopics: ['Observation Coding Standards (C1/C2/C3/FI)', 'Thermographic Survey Evidence', 'Safe Isolation Protocols'],
  },
];

const CATEGORY_TABS: Array<{ id: EventCategory; label: string }> = [
  { id: 'all', label: 'All Formats' },
  { id: 'technical', label: 'Technical Breakfasts' },
  { id: 'networking', label: 'Meet the Buyer / Networking' },
  { id: 'oem', label: 'OEM & Manufacturer' },
  { id: 'training', label: 'Supplier Academy' },
  { id: 'innovation', label: 'Innovation & Telemetry' },
];

export function UpcomingEventsCalendar() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return PLANNED_EVENTS.filter((e) => {
      return selectedCategory === 'all' || e.category === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <section id="upcoming-events" className="py-20 lg:py-28 bg-[#FFFFFF] border-b border-[#E8E8E5] scroll-mt-20">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                2026 / 2027 PARTNER NETWORK PROGRAMME
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
              Upcoming sessions &amp; planned forums
            </h2>
            <p className="text-sm sm:text-base text-[#6D6D68] font-light leading-relaxed">
              Explore the scheduled programme of technical breakfasts, manufacturer briefings, and commercial roundtables across our regional hubs. Register interest for priority delegate confirmation.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1.5 bg-[#FAFAF8] p-1 rounded-[6px] border border-[#E8E8E5] shrink-0 self-start lg:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Quarter View</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`whitespace-nowrap px-3.5 py-2 text-xs font-medium rounded-[4px] transition-all duration-200 ${
                  isActive
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#FAFAF8] text-[#6D6D68] border border-[#E8E8E5] hover:bg-[#FFFFFF] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* LIST VIEW */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const isExpanded = expandedEventId === evt.id;
              const isConfirmed = evt.status === 'CONFIRMED';

              return (
                <div
                  key={evt.id}
                  className="bg-[#FAFAF8] border border-[#E8E8E5] rounded-[8px] p-6 sm:p-7 hover:border-[#EA580C]/30 hover:bg-[#FFFFFF] transition-all duration-200 shadow-xs space-y-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#111111] text-white px-2 py-0.5 rounded-[3px]">
                          {evt.format}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] border ${
                            isConfirmed
                              ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                              : 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                          }`}
                        >
                          {evt.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] px-2 py-0.5 rounded-[3px]">
                          {evt.membershipTier}
                        </span>
                        <span className="text-xs text-[#9A9A95] font-light">
                          {evt.targetQuarter}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold text-[#111111]">
                        {evt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6D6D68] font-light max-w-3xl leading-relaxed">
                        {evt.overview}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className="px-4 py-2.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#FAFAF8] border border-[#E8E8E5] text-xs font-semibold text-[#111111] transition-all"
                      >
                        {isExpanded ? 'Hide Agenda' : 'View Sample Agenda'}
                      </button>
                      <a
                        href="#event-interest"
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector('#event-interest')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2.5 rounded-[4px] bg-[#EA580C] hover:bg-[#C2410C] text-xs font-semibold text-white uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>Register Interest</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-4 border-t border-[#E8E8E5] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6D6D68] font-light">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#9A9A95]" />
                      <span>Audience: <strong className="font-medium text-[#111111]">{evt.audience}</strong></span>
                    </div>
                  </div>

                  {/* Expandable Sample Agenda & Key Topics */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#E8E8E5] grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FFFFFF] p-5 rounded-[6px] border border-[#E8E8E5]">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A95] block mb-3">
                          Example Format &amp; Indicative Agenda:
                        </span>
                        <div className="space-y-2 border-l-2 border-[#EA580C]/30 pl-3">
                          {evt.sampleAgenda.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-xs">
                              <span className="text-[#EA580C] shrink-0 font-semibold tabular-nums">
                                {item.time}
                              </span>
                              <span className="text-[#2D2D2D] font-light">{item.activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9A95] block">
                          Key Technical Topics:
                        </span>
                        <div className="space-y-2">
                          {evt.keyTopics.map((topic, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#2D2D2D]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* QUARTER / CALENDAR VIEW */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'].map((quarter) => {
              const eventsInQuarter = PLANNED_EVENTS.filter(e => e.targetQuarter.includes(quarter));
              return (
                <div key={quarter} className="bg-[#FAFAF8] border border-[#E8E8E5] rounded-[8px] p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-2">
                    <span className="text-sm font-semibold text-[#111111]">{quarter}</span>
                    <span className="text-[10px] font-bold text-[#EA580C] uppercase">{eventsInQuarter.length} Sessions</span>
                  </div>

                  <div className="space-y-3">
                    {eventsInQuarter.map((evt) => (
                      <div key={evt.id} className="p-3.5 bg-white border border-[#E8E8E5] rounded-[6px] shadow-2xs space-y-2">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#9A9A95] block">
                          {evt.format}
                        </span>
                        <div className="text-xs font-semibold text-[#111111] leading-snug">
                          {evt.title}
                        </div>
                        <div className="text-[10.5px] text-[#6D6D68] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#EA580C] shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
