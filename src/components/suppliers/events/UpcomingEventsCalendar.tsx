'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

type EventCategory = 'all' | 'technical' | 'networking' | 'oem' | 'training' | 'innovation' | 'regional';

interface ScheduledEvent {
  id: string;
  title: string;
  format: string;
  category: EventCategory;
  discipline: string;
  status: 'PLANNED' | 'REGISTRATION OPENING SOON' | 'INVITATION ONLY';
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
    title: 'Commercial HVAC & Chiller Technology',
    format: 'Meet the Manufacturer',
    category: 'oem',
    discipline: 'HVAC & Plant Engineering',
    status: 'PLANNED',
    targetQuarter: 'Q3 2026',
    location: 'London & Manchester (Rotational)',
    audience: 'HVAC Contractors, Chiller Specialists, M&E Engineers, FM Directors',
    overview: 'Technical session exploring commercial plant efficiency, low-GWP refrigerant transition (F-Gas compliance), heat pump retrofits, and intelligent controls.',
    sampleAgenda: [
      { time: '08:30', activity: 'Arrival, coffee & networking' },
      { time: '09:00', activity: 'OEM Technical Briefing: Next-Gen Chiller Architecture' },
      { time: '09:45', activity: 'F-Gas & Low-GWP Compliance Panel' },
      { time: '10:30', activity: 'Q&A and technical breakout discussions' },
      { time: '11:15', activity: 'Informal networking & close' },
    ],
    keyTopics: ['F-Gas (EC 517/2014) Phase-Down', 'Commercial Heat Pump COP Optimisation', 'Chiller Telemetry & Vibration Diagnostics'],
  },
  {
    id: 'fire-safety-breakfast',
    title: 'Fire & Life Safety — Compliance in Occupied Buildings',
    format: 'Technical Breakfast',
    category: 'technical',
    discipline: 'Life Safety & Compliance',
    status: 'PLANNED',
    targetQuarter: 'Q1 2026',
    location: 'Birmingham & Leeds',
    audience: 'Fire Alarm Engineers, Compliance Managers, Property Directors',
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
    status: 'REGISTRATION OPENING SOON',
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
    status: 'PLANNED',
    targetQuarter: 'Q2 2026',
    location: 'Sheffield & Regional Hubs',
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
    status: 'REGISTRATION OPENING SOON',
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
    status: 'PLANNED',
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
    <section id="event-programme" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-brand-pink" />
              <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
                2026 / 2027 PARTNER NETWORK PROGRAMME
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 leading-[1.15]">
              Upcoming sessions &amp; planned forums
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-light leading-relaxed">
              Explore the upcoming schedule of technical breakfasts, manufacturer seminars, and procurement roundtables. Register your interest below to receive priority access upon date confirmation.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-[#FAF9FB] p-1 rounded-sm border border-slate-200 shrink-0 self-start lg:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-normal transition-all ${
                viewMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-normal transition-all ${
                viewMode === 'calendar' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
                className={`whitespace-nowrap px-3.5 py-2 text-xs font-normal rounded-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-[#FAF9FB] text-slate-600 border border-slate-200/90 hover:bg-slate-100 hover:text-slate-900'
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
              return (
                <div
                  key={evt.id}
                  className="bg-[#FAF9FB] border border-slate-200/90 rounded-sm p-6 sm:p-7 hover:border-brand-pink transition-all duration-200 shadow-xs space-y-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-slate-900 text-white px-2 py-0.5 rounded-xs">
                          {evt.format}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-brand-pink/10 text-brand-pink border border-brand-pink/20 px-2 py-0.5 rounded-xs">
                          {evt.status}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {evt.targetQuarter}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-light text-slate-900">
                        {evt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-light max-w-3xl leading-relaxed">
                        {evt.overview}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      <button
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className="btn-outline text-xs py-2 px-3.5"
                      >
                        {isExpanded ? 'Hide Agenda' : 'View Sample Agenda'}
                      </button>
                      <a
                        href="#event-interest"
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelector('#event-interest')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="btn-primary text-xs py-2 px-4 justify-center"
                      >
                        <span>Register Interest</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-light">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-pink" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Audience: <strong className="font-normal text-slate-700">{evt.audience}</strong></span>
                    </div>
                  </div>

                  {/* Expandable Sample Agenda & Key Topics */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xs border border-slate-200/70 animate-in fade-in duration-300">
                      <div>
                        <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 block font-light mb-3">
                          Example Format &amp; Indicative Agenda:
                        </span>
                        <div className="space-y-2 border-l-2 border-slate-100 pl-3">
                          {evt.sampleAgenda.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-xs">
                              <span className="font-mono text-brand-pink shrink-0 font-medium">
                                {item.time}
                              </span>
                              <span className="text-slate-700 font-light">{item.activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 block font-light">
                          Key Technical Topics:
                        </span>
                        <div className="space-y-1.5">
                          {evt.keyTopics.map((topic, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink shrink-0" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'].map((quarter) => {
              const eventsInQuarter = PLANNED_EVENTS.filter(e => e.targetQuarter.includes(quarter));
              return (
                <div key={quarter} className="bg-[#FAF9FB] border border-slate-200 rounded-sm p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono text-sm font-semibold text-slate-900">{quarter}</span>
                    <span className="text-[10px] font-mono text-brand-pink uppercase">{eventsInQuarter.length} Sessions</span>
                  </div>

                  <div className="space-y-3">
                    {eventsInQuarter.map((evt) => (
                      <div key={evt.id} className="p-3.5 bg-white border border-slate-200/80 rounded-xs shadow-2xs space-y-2">
                        <span className="text-[9.5px] font-mono uppercase text-slate-400 block">
                          {evt.format}
                        </span>
                        <div className="text-xs font-medium text-slate-900 leading-snug">
                          {evt.title}
                        </div>
                        <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-brand-pink shrink-0" />
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
