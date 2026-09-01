'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Calendar,
  Cpu,
  TrendingUp,
  AlertCircle,
  Building2,
  ChevronRight,
  Wrench,
  Flame,
  Droplets,
  Wind,
  X,
  BarChart2,
  Users,
  MapPin,
  Gauge,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// MOCK DATA — MARKETING / SCREENSHOT ONLY
// ─────────────────────────────────────────────────────────────

const METRICS = {
  statutoryCompliance: 99.7,
  dueThisWeek: 42,
  autoDispatchRate: 94.2,
  verifiedVisitsYTD: 1242,
  routingSavings: '£18.4k',
  missedStatutory: 0,
  activePlanItems: 1428,
  dueThisMonth: 186,
  overdue: 0,
  mtdTrend: '+2.8%',
};

const ESTATES = [
  {
    id: 'est-01',
    name: 'Manchester City Tower',
    client: 'Aviva Real Estate UK',
    city: 'Manchester',
    planCode: 'PPM-2026-001',
    assets: 420,
    tasks: 84,
    weeklyVisits: 12,
    compliance: 100,
    autopilotState: 'ACTIVE',
    image: '/images/locations/manchester/facilities-management-manchester-deansgate-city-centre-1600w.webp',
    nextVisit: 'Tomorrow 08:30',
    leadEngineer: 'D. Hughes — HVAC Cat 1',
  },
  {
    id: 'est-02',
    name: 'London Southbank Plaza',
    client: 'Savills Property Management',
    city: 'London',
    planCode: 'PPM-2026-004',
    assets: 312,
    tasks: 62,
    weeklyVisits: 14,
    compliance: 99.4,
    autopilotState: 'ACTIVE',
    image: '/images/locations/london/facilities-management-london-city-of-london-skyline-1600w.webp',
    nextVisit: '27 Aug 09:00',
    leadEngineer: 'J. Wilson — NICEIC',
  },
  {
    id: 'est-03',
    name: 'Birmingham Logistics Campus',
    client: 'Prologis UK Distribution',
    city: 'Birmingham',
    planCode: 'PPM-2026-008',
    assets: 188,
    tasks: 38,
    weeklyVisits: 9,
    compliance: 100,
    autopilotState: 'ACTIVE',
    image: '/images/locations/birmingham/facilities-management-birmingham-industrial-plant-survey-1600w.webp',
    nextVisit: '29 Aug 11:30',
    leadEngineer: 'A. Taylor — Water Hygiene',
  },
  {
    id: 'est-04',
    name: 'Leeds Innovation Quarter',
    client: 'JLL Property & Asset Mgmt',
    city: 'Leeds',
    planCode: 'PPM-2026-012',
    assets: 254,
    tasks: 51,
    weeklyVisits: 7,
    compliance: 98.8,
    autopilotState: 'ACTIVE',
    image: '/images/editorial/entirefm-hero-headquarters-1920w.webp',
    nextVisit: '28 Aug 08:00',
    leadEngineer: 'S. Jenkins — Gas Safe',
  },
];

const ASSET_CATEGORIES = [
  {
    id: 'hvac',
    label: 'HVAC & Refrigeration',
    count: 186,
    compliance: 100,
    image: '/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp',
    standard: 'SFG20 01-04',
    nextDue: '2 items due this week',
  },
  {
    id: 'electrical',
    label: 'HV / LV Distribution',
    count: 94,
    compliance: 100,
    image: '/images/editorial/entirefm-distribution-board-testing-1200w.webp',
    standard: 'BS 7671 / NICEIC',
    nextDue: 'Thermography: 27 Aug',
  },
  {
    id: 'fire',
    label: 'Fire & Life Safety',
    count: 312,
    compliance: 99.7,
    image: '/images/editorial/entirefm-access-control-install-1200w.webp',
    standard: 'BS 5839 / BS 5306',
    nextDue: 'Weekly test: Mon',
  },
  {
    id: 'water',
    label: 'Water Hygiene Systems',
    count: 148,
    compliance: 100,
    image: '/images/editorial/entirefm-plumbing-booster-set-1200w.webp',
    standard: 'ACOP L8 / HSG274',
    nextDue: 'Monthly: 29 Aug',
  },
  {
    id: 'thermal',
    label: 'Thermal & Combustion',
    count: 72,
    compliance: 100,
    image: '/images/editorial/entirefm-hvac-thermal-survey-1200w.webp',
    standard: 'Gas Safety Reg 35',
    nextDue: 'Annual: 28 Aug',
  },
  {
    id: 'pressure',
    label: 'Pressure Systems',
    count: 56,
    compliance: 98.2,
    image: '/images/editorial/entirefm-plumbing-pressure-test-1200w.webp',
    standard: 'PSSR 2000 / L122',
    nextDue: '1 item advisory',
  },
];

const INTELLIGENCE_FEED = [
  {
    id: 'feed-01',
    type: 'ROUTE_OPT',
    typeLabel: 'Route Optimisation',
    colour: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA',
    title: 'Proximity Cluster Bundle Applied',
    detail: 'Bundled 4 × AHU quarterly filter services with Chiller CH-01 annual inspection at Manchester City Tower. 1 engineer vs 2 separate callouts.',
    impact: '£320 travel surcharge saved',
    time: 'Today 06:14',
    icon: 'route',
  },
  {
    id: 'feed-02',
    type: 'STATUTORY',
    typeLabel: 'Statutory Update',
    colour: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    title: 'SFG20 Frequency Auto-Levelling',
    detail: 'Updated 14 distribution board inspection tasks to match BS 7671 Amendment 3 thermography guidelines. Digital work orders regenerated.',
    impact: '100% audit trail maintained',
    time: 'Yesterday 18:30',
    icon: 'statutory',
  },
  {
    id: 'feed-03',
    type: 'SKILL',
    typeLabel: 'Engineer Matching',
    colour: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    title: 'Accreditation Matrix Verified',
    detail: 'Confirmed valid F-Gas Cat 1 and Gas Safe Commercial certs for all 18 engineers prior to work order release across 4 active estates.',
    impact: 'Zero compliance dispatch violations',
    time: 'Yesterday 14:05',
    icon: 'skill',
  },
  {
    id: 'feed-04',
    type: 'ANOMALY',
    typeLabel: 'Asset Signal',
    colour: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    title: 'AHU-04 Vibration Anomaly Detected',
    detail: 'Motor bearing vibration increased 14% above SFG20 baseline on AHU-04 at Leeds Innovation Quarter. Inspection advanced from 14 Sep → 2 Sep.',
    impact: 'Pre-failure intervention triggered',
    time: 'Today 04:42',
    icon: 'anomaly',
  },
];

const WEEK_VISITS = [
  { day: 'Mon', visits: 38, auto: 36 },
  { day: 'Tue', visits: 51, auto: 48 },
  { day: 'Wed', visits: 44, auto: 41 },
  { day: 'Thu', visits: 63, auto: 59 },
  { day: 'Fri', visits: 49, auto: 46 },
  { day: 'Sat', visits: 12, auto: 12 },
  { day: 'Sun', visits: 8, auto: 8 },
];

const ENGINEERS = [
  {
    id: 'eng-01',
    name: 'Daniel Hughes',
    trade: 'HVAC / F-Gas Cat 1',
    badge: 'F-Gas',
    capacity: 92,
    visits: 12,
    estates: ['Manchester', 'Leeds'],
    initials: 'DH',
    colour: '#EA580C',
  },
  {
    id: 'eng-02',
    name: 'Sarah Bennett',
    trade: 'Electrical / NICEIC',
    badge: 'NICEIC',
    capacity: 78,
    visits: 9,
    estates: ['London', 'Birmingham'],
    initials: 'SB',
    colour: '#2563EB',
  },
  {
    id: 'eng-03',
    name: 'Imran Shah',
    trade: 'Gas Safe Commercial',
    badge: 'Gas Safe',
    capacity: 85,
    visits: 11,
    estates: ['Leeds', 'Manchester'],
    initials: 'IS',
    colour: '#059669',
  },
];

const ACTIVE_PLANS = [
  {
    id: 'p1',
    number: 'PPM-2026-001',
    name: 'Manchester City Tower — Core M&E & Life Safety',
    client: 'Aviva Real Estate UK',
    discipline: 'Mechanical & Electrical',
    assets: 420,
    tasks: 84,
    annualVisits: 168,
    compliance: '100%',
    city: 'Manchester',
    image: '/images/locations/manchester/facilities-management-manchester-hero-1200w.webp',
  },
  {
    id: 'p2',
    number: 'PPM-2026-004',
    name: 'London Southbank Plaza — Commercial HVAC & BMS',
    client: 'Savills Property Management',
    discipline: 'HVAC & Refrigeration',
    assets: 312,
    tasks: 62,
    annualVisits: 124,
    compliance: '99.4%',
    city: 'London',
    image: '/images/locations/london/facilities-management-london-rooftop-plant-inspection-1600w.webp',
  },
  {
    id: 'p3',
    number: 'PPM-2026-008',
    name: 'Birmingham Logistics Hub — HV & Fire Systems',
    client: 'Prologis UK Distribution',
    discipline: 'Electrical & Fire Safety',
    assets: 188,
    tasks: 38,
    annualVisits: 76,
    compliance: '100%',
    city: 'Birmingham',
    image: '/images/locations/birmingham/facilities-management-birmingham-city-centre-offices-1600w.webp',
  },
  {
    id: 'p4',
    number: 'PPM-2026-012',
    name: 'Leeds Innovation Campus — Critical Plant & Water',
    client: 'JLL Property & Asset Mgmt',
    discipline: 'Water Hygiene & HVAC',
    assets: 254,
    tasks: 51,
    annualVisits: 102,
    compliance: '98.8%',
    city: 'Leeds',
    image: '/images/editorial/entirefm-hero-headquarters-1920w.webp',
  },
  {
    id: 'p5',
    number: 'PPM-2026-015',
    name: 'Midlands Commercial Estates — Statutory Register',
    client: 'Knight Frank Asset Management',
    discipline: 'Statutory Compliance',
    assets: 254,
    tasks: 49,
    annualVisits: 98,
    compliance: '100%',
    city: 'Birmingham',
    image: '/images/locations/birmingham/facilities-management-birmingham-industrial-plant-survey-1600w.webp',
  },
];

const OCCURRENCES = [
  {
    id: 'occ-01',
    number: 'OCC-2026-0842',
    asset: 'Water-Cooled Chiller (450kW)',
    tag: 'CH-01-ROOF',
    site: 'Manchester City Tower · Roof Deck',
    standard: 'SFG20 01-04 (Q3 Inspection)',
    due: 'Tomorrow 08:30',
    engineer: 'Dave Miller — F-Gas Cat 1',
    status: 'DISPATCHED',
    trade: 'HVAC',
  },
  {
    id: 'occ-02',
    number: 'OCC-2026-0843',
    asset: 'Main LV Distribution Board',
    tag: 'MSB-01-B1',
    site: 'London Southbank Plaza · Switchroom B1',
    standard: 'BS 7671 / Thermographic Survey',
    due: '27 Aug 09:00',
    engineer: 'James Wilson — NICEIC',
    status: 'CONFIRMED',
    trade: 'Electrical',
  },
  {
    id: 'occ-03',
    number: 'OCC-2026-0844',
    asset: 'Commercial Gas Boiler Cascade (600kW)',
    tag: 'BLR-01/02',
    site: 'Leeds Campus · Basement Plantroom',
    standard: 'Gas Safety Reg 35 (CP15 Annual)',
    due: '28 Aug 08:00',
    engineer: 'Sarah Jenkins — Gas Safe',
    status: 'SCHEDULED',
    trade: 'Gas',
  },
  {
    id: 'occ-04',
    number: 'OCC-2026-0845',
    asset: 'Cold Water Storage Tank & Calorifier',
    tag: 'CWST-02',
    site: 'Birmingham Logistics Hub · Riser 2',
    standard: 'ACOP L8 / HSG274 Monthly Check',
    due: '29 Aug 11:30',
    engineer: 'Alex Taylor — Water Hygiene',
    status: 'READY',
    trade: 'Water',
  },
];

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function SiteDrawer({
  estate,
  onClose,
}: {
  estate: (typeof ESTATES)[number] | null;
  onClose: () => void;
}) {
  if (!estate) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-[480px] overflow-y-auto bg-white shadow-2xl flex flex-col">
        {/* Header image */}
        <div className="relative h-48 bg-[#F5F5F3] shrink-0">
          <Image
            src={estate.image}
            alt={estate.name}
            fill
            className="object-cover"
            sizes="480px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#101010] shadow hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-5">
            <p className="text-[10px] font-light uppercase tracking-widest text-white/70">
              {estate.planCode}
            </p>
            <h2 className="text-lg font-light text-white leading-tight">
              {estate.name}
            </h2>
            <p className="text-[12px] text-white/80">{estate.client}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 space-y-5">
          {/* Status strip */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-normal text-[#059669]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
              AUTOPILOT ACTIVE
            </span>
            <span className="inline-flex items-center gap-1 rounded-[5px] border border-[#E4E4E1] bg-[#F5F5F3] px-2 py-0.5 font-normal text-[10px] text-[#686866]">
              <MapPin className="h-2.5 w-2.5" />
              {estate.city}
            </span>
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Assets', value: estate.assets },
              { label: 'Tasks', value: estate.tasks },
              { label: 'This Week', value: `${estate.weeklyVisits} visits` },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-3 text-center"
              >
                <div className="text-[18px] font-normal text-[#101010]">
                  {k.value}
                </div>
                <div className="text-[10px] text-[#9B9B97] font-normal mt-0.5">
                  {k.label}
                </div>
              </div>
            ))}
          </div>

          {/* Compliance bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-normal text-[#101010]">
                Statutory Compliance
              </span>
              <span className="text-[12px] font-normal text-[#059669]">
                {estate.compliance}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#E4E4E1] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#059669] transition-all"
                style={{ width: `${estate.compliance}%` }}
              />
            </div>
          </div>

          {/* Lead engineer */}
          <div className="rounded-[8px] border border-[#E4E4E1] bg-[#FBFBFA] p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B9B97] mb-1.5">
              Lead Engineer
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#FF6B24] flex items-center justify-center text-[11px] font-normal text-white">
                {estate.leadEngineer.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="text-[13px] font-normal text-[#101010]">
                  {estate.leadEngineer}
                </div>
                <div className="text-[11px] text-[#9B9B97] font-normal">
                  Next visit: {estate.nextVisit}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming visits */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#9B9B97] mb-2">
              Upcoming Visits
            </p>
            <div className="space-y-2">
              {OCCURRENCES.filter((o) =>
                o.site.toLowerCase().includes(estate.city.toLowerCase())
              )
                .slice(0, 2)
                .map((o) => (
                  <div
                    key={o.id}
                    className="flex items-start justify-between rounded-[8px] border border-[#E4E4E1] bg-white px-3.5 py-2.5"
                  >
                    <div>
                      <div className="text-[12px] font-normal text-[#101010]">
                        {o.asset}
                      </div>
                      <div className="text-[10.5px] font-normal text-[#9B9B97]">
                        {o.standard}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-[10px] font-normal text-[#686866]">
                        {o.due}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E4E4E1] p-4 flex gap-2 shrink-0">
          <Link
            href={`/admin/planned-maintenance/plans`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-[8px] bg-[#FF6B24] px-4 py-2 text-[12px] font-normal text-white hover:bg-[#E9540F] transition-colors"
          >
            View Maintenance Plan
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#E4E4E1] px-4 py-2 text-[12px] font-normal text-[#686866] hover:bg-[#F5F5F3] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN CLIENT PAGE
// ─────────────────────────────────────────────────────────────

export default function PPMAutopilotClient() {
  const [selectedEstate, setSelectedEstate] = useState<
    (typeof ESTATES)[number] | null
  >(null);

  const maxVisits = Math.max(...WEEK_VISITS.map((w) => w.visits));
  const weekTotal = WEEK_VISITS.reduce((a, w) => a + w.visits, 0);

  // Radial gauge SVG parameters
  const radius = 72;
  const cx = 90;
  const cy = 90;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const pct = METRICS.statutoryCompliance / 100;
  const dash = pct * circumference;
  const gap = circumference - dash;

  const statusColour = (s: string) => {
    if (s === 'DISPATCHED') return 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]';
    if (s === 'CONFIRMED') return 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]';
    if (s === 'READY') return 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]';
    return 'bg-[#F5F5F3] text-[#686866] border border-[#E4E4E1]';
  };

  return (
    <div className="space-y-8">
      {/* ── 1. HERO HEADER ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E4E4E1] pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-[10px] font-light uppercase tracking-[0.12em] text-[#686866]">
              Planned Preventative Maintenance
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#A7F3D0] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-normal text-[#059669]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#059669]" />
              PPM AUTOPILOT ACTIVE
            </span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-[#101010] sm:text-[28px]">
            PPM Autopilot{' '}
            <span className="font-light">Control Desk</span>
          </h1>
          <p className="mt-1 max-w-2xl text-[13px] text-[#686866] leading-relaxed">
            Autonomous estate maintenance planning — orchestrating asset registers, SFG20 statutory schedules, engineer skill matrices, and field dispatch across commercial estates.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-normal text-[#9B9B97]">
              Next planning cycle
            </span>
            <span className="text-[12px] font-light text-[#101010]">
              Today 18:00 · 42 planned visits
            </span>
          </div>
          <Link
            href="/admin/estate/mobilisations"
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#FF6B24] px-4 py-2 text-[12px] font-normal text-white shadow-[0_1px_2px_rgba(255,107,36,0.25)] hover:bg-[#E9540F] transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            + Mobilise New Estate Plan
          </Link>
        </div>
      </div>

      {/* ── 2. KPI LAYER ────────────────────────────────────────── */}
      {/* Row 1: Large + Medium KPIs + Gauge */}
      <div className="grid grid-cols-12 gap-4">
        {/* Radial Gauge — Estate PPM Coverage */}
        <div className="col-span-12 sm:col-span-5 lg:col-span-4 rounded-[10px] border border-[#E4E4E1] bg-white p-5 flex flex-col gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div>
            <p className="text-[10px] font-light uppercase tracking-wider text-[#9B9B97]">
              Estate PPM Coverage
            </p>
            <p className="text-[13px] font-normal text-[#101010] mt-0.5">
              Statutory Compliance Gauge
            </p>
          </div>
          <div className="flex items-center gap-5">
            {/* SVG Gauge */}
            <div className="relative shrink-0">
              <svg width="180" height="180" viewBox="0 0 180 180">
                {/* Background ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="#F0F0EE"
                  strokeWidth={strokeWidth}
                />
                {/* Progress ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="#059669"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={circumference * 0.25}
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
                {/* Centre text */}
                <text
                  x={cx}
                  y={cy - 8}
                  textAnchor="middle"
                  className="font-normal"
                  style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 700, fill: '#101010' }}
                >
                  {METRICS.statutoryCompliance}%
                </text>
                <text
                  x={cx}
                  y={cy + 12}
                  textAnchor="middle"
                  style={{ fontFamily: 'monospace', fontSize: '9px', fill: '#9B9B97', letterSpacing: '0.08em' }}
                >
                  COMPLIANCE
                </text>
              </svg>
            </div>
            {/* Supporting stats */}
            <div className="space-y-2.5 flex-1">
              {[
                { label: 'Active Items', value: '1,428', colour: '#101010' },
                { label: 'Due This Month', value: '186', colour: '#2563EB' },
                { label: 'Due This Week', value: '42', colour: '#EA580C' },
                { label: 'Overdue', value: '0', colour: '#059669' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#686866]">{s.label}</span>
                  <span
                    className="text-[13px] font-normal"
                    style={{ color: s.colour }}
                  >
                    {s.value}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-1 pt-1">
                <TrendingUp className="h-3 w-3 text-[#059669]" />
                <span className="text-[10px] text-[#059669] font-light">
                  {METRICS.mtdTrend} vs prev. month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI cards — right side */}
        <div className="col-span-12 sm:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Large KPI */}
          <div className="col-span-2 sm:col-span-1 rounded-[10px] border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#9B9B97] mb-0.5">
              Statutory Compliance
            </p>
            <div className="text-[40px] font-normal leading-none text-[#101010] mt-2">
              {METRICS.statutoryCompliance}%
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#059669]" />
              <span className="text-[11px] text-[#059669] font-light">
                0 Missed Activities
              </span>
            </div>
          </div>

          {/* Medium KPIs */}
          <div className="rounded-[10px] border border-[#E4E4E1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between text-[#9B9B97] mb-2">
              <span className="text-[10px] font-medium uppercase tracking-wider">
                Due This Week
              </span>
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div className="text-[32px] font-normal text-[#2563EB] leading-none">
              {METRICS.dueThisWeek}
            </div>
            <div className="mt-1.5 text-[10.5px] font-normal text-[#059669]">
              100% Dispatched & Assigned
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between text-[#9B9B97] mb-2">
              <span className="text-[10px] font-medium uppercase tracking-wider">
                Auto-Dispatch Rate
              </span>
              <Cpu className="h-3.5 w-3.5" />
            </div>
            <div className="text-[32px] font-normal text-[#EA580C] leading-none">
              {METRICS.autoDispatchRate}%
            </div>
            <div className="mt-1.5 text-[10.5px] font-normal text-[#686866]">
              Autonomous Batching
            </div>
          </div>

          {/* Small KPIs */}
          {[
            { label: 'Verified Visits YTD', value: METRICS.verifiedVisitsYTD.toLocaleString(), icon: CheckCircle2, colour: '#059669', sub: 'Field sign-offs confirmed' },
            { label: 'Est. Routing Savings', value: METRICS.routingSavings, icon: TrendingUp, colour: '#EA580C', sub: 'Cluster optimisation YTD' },
            { label: 'Missed Statutory', value: METRICS.missedStatutory.toString(), icon: ShieldCheck, colour: '#101010', sub: 'Zero tolerance maintained' },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-[10px] border border-[#E4E4E1] bg-[#FBFBFA] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center justify-between text-[#9B9B97] mb-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {k.label}
                </span>
                <k.icon className="h-3.5 w-3.5" />
              </div>
              <div
                className="text-[22px] font-normal leading-none"
                style={{ color: k.colour }}
              >
                {k.value}
              </div>
              <div className="mt-1 text-[10px] font-normal text-[#9B9B97]">
                {k.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. ESTATES UNDER AUTOPILOT ─────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-normal text-[#101010]">
              Estates Under Autopilot
            </h2>
            <p className="text-[12px] text-[#686866] mt-0.5">
              4 commercial estates with autonomous PPM planning and SFG20 compliance monitoring active.
            </p>
          </div>
          <Link
            href="/admin/planned-maintenance/plans"
            className="text-[12px] font-normal text-[#EA580C] hover:underline flex items-center gap-1"
          >
            All Plans <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ESTATES.map((estate) => (
            <button
              key={estate.id}
              onClick={() => setSelectedEstate(estate)}
              className="group text-left rounded-[10px] border border-[#E4E4E1] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#D1D1CD] transition-all"
            >
              {/* Site photo */}
              <div className="relative h-36 bg-[#F5F5F3] overflow-hidden">
                <Image
                  src={estate.image}
                  alt={estate.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Compliance badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="inline-flex items-center gap-1 rounded-[5px] border border-[#A7F3D0] bg-[#ECFDF5] px-1.5 py-0.5 text-[9px] font-normal text-[#059669]">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    {estate.compliance}%
                  </span>
                </div>
                {/* View overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="rounded-[6px] bg-white/90 px-3 py-1.5 text-[11px] font-normal text-[#101010] shadow">
                    View Estate →
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-3.5">
                <p className="text-[9.5px] font-normal text-[#9B9B97] mb-0.5">
                  {estate.planCode}
                </p>
                <h3 className="text-[13px] font-normal text-[#101010] leading-snug">
                  {estate.name}
                </h3>
                <p className="text-[11px] text-[#686866] mt-0.5">{estate.client}</p>
                <div className="flex items-center gap-3 mt-2.5 text-[10.5px] font-normal text-[#686866]">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {estate.assets} assets
                  </span>
                  <span className="flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    {estate.tasks} tasks
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. AUTOPILOT INTELLIGENCE FEED + ASSET CATEGORIES ──── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Intelligence Feed */}
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-normal text-[#101010]">
                Autopilot Intelligence Feed
              </h2>
              <p className="text-[12px] text-[#686866] mt-0.5">
                Live stream of autonomous planning decisions, optimisations, and asset signals.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#E4E4E1] bg-[#F5F5F3] px-2 py-0.5 font-normal text-[10px] text-[#686866]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-3">
            {INTELLIGENCE_FEED.map((item) => (
              <div
                key={item.id}
                className="rounded-[10px] border border-[#E4E4E1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
              >
                <div className="flex items-start gap-3">
                  {/* Type indicator */}
                  <div
                    className="mt-0.5 shrink-0 h-7 w-7 rounded-[6px] flex items-center justify-center"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}
                  >
                    {item.type === 'ROUTE_OPT' && (
                      <TrendingUp className="h-3.5 w-3.5" style={{ color: item.colour }} />
                    )}
                    {item.type === 'STATUTORY' && (
                      <ShieldCheck className="h-3.5 w-3.5" style={{ color: item.colour }} />
                    )}
                    {item.type === 'SKILL' && (
                      <Users className="h-3.5 w-3.5" style={{ color: item.colour }} />
                    )}
                    {item.type === 'ANOMALY' && (
                      <AlertCircle className="h-3.5 w-3.5" style={{ color: item.colour }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className="text-[10px] font-light uppercase tracking-wider"
                        style={{ color: item.colour }}
                      >
                        {item.typeLabel}
                      </span>
                      <span className="text-[10px] font-normal text-[#9B9B97] shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-normal text-[#101010]">
                      {item.title}
                    </h3>
                    <p className="text-[12px] text-[#686866] mt-0.5 leading-relaxed">
                      {item.detail}
                    </p>
                    <div
                      className="mt-2 inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[10px] font-light"
                      style={{
                        background: item.bg,
                        border: `1px solid ${item.border}`,
                        color: item.colour,
                      }}
                    >
                      {item.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Category Grid */}
        <div className="col-span-12 lg:col-span-5">
          <div className="mb-4">
            <h2 className="text-[15px] font-normal text-[#101010]">
              Asset Coverage
            </h2>
            <p className="text-[12px] text-[#686866] mt-0.5">
              Statutory maintenance coverage by plant category across all estates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ASSET_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="rounded-[10px] border border-[#E4E4E1] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_3px_8px_rgba(0,0,0,0.06)] transition-shadow"
              >
                <div className="relative h-24 bg-[#F5F5F3]">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="text-[11.5px] font-normal text-[#101010] leading-snug">
                    {cat.label}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-normal text-[#9B9B97]">
                      {cat.count} assets
                    </span>
                    <span
                      className={`text-[9px] font-light ${
                        cat.compliance >= 100
                          ? 'text-[#059669]'
                          : 'text-[#D97706]'
                      }`}
                    >
                      {cat.compliance}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-[#F0F0EE] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${cat.compliance}%`,
                        background: cat.compliance >= 100 ? '#059669' : '#D97706',
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-[9.5px] font-normal text-[#9B9B97]">
                    {cat.nextDue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. PLANNING TIMELINE + ENGINEER CAPACITY ───────────── */}
      <div className="grid grid-cols-12 gap-6">
        {/* 7-Day Planning Timeline */}
        <div className="col-span-12 lg:col-span-8 rounded-[10px] border border-[#E4E4E1] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-normal text-[#101010]">
                Next 7 Days — Planning Timeline
              </h2>
              <p className="text-[12px] text-[#686866] mt-0.5">
                {weekTotal} total visits · 93.8% auto-assigned · 18 engineers · 4 estates
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10.5px] font-normal text-[#9B9B97]">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#EA580C] inline-block" />
                Total
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#059669] inline-block" />
                Auto-dispatched
              </span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3 h-36">
            {WEEK_VISITS.map((w) => {
              const totalH = Math.round((w.visits / maxVisits) * 100);
              const autoH = Math.round((w.auto / maxVisits) * 100);
              return (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-normal text-[#686866]">
                    {w.visits}
                  </span>
                  <div className="relative w-full flex-1 flex flex-col justify-end rounded-t-[3px] overflow-hidden bg-[#F5F5F3]">
                    {/* Total bar */}
                    <div
                      className="w-full rounded-t-[3px] bg-[#EA580C]/20 transition-all"
                      style={{ height: `${totalH}%` }}
                    />
                    {/* Auto bar overlay */}
                    <div
                      className="absolute bottom-0 left-0 w-full rounded-t-[3px] bg-[#059669]/30 transition-all"
                      style={{ height: `${autoH}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-light text-[#101010]">
                    {w.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Autonomous checklist */}
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 border-t border-[#E4E4E1] pt-4">
            {[
              'SFG20 frequencies cross-referenced',
              'Engineer accreditations verified',
              'Cluster proximity optimised',
              'Client access restrictions applied',
              'Work orders auto-generated',
              'Contractor SLAs confirmed',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#059669]" />
                <span className="text-[11.5px] text-[#686866]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engineer Capacity */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="mb-1">
            <h2 className="text-[15px] font-normal text-[#101010]">
              Engineer Capacity
            </h2>
            <p className="text-[12px] text-[#686866] mt-0.5">
              Mobile engineers assigned this week.
            </p>
          </div>
          {ENGINEERS.map((eng) => (
            <div
              key={eng.id}
              className="rounded-[10px] border border-[#E4E4E1] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-normal text-white shrink-0"
                  style={{ background: eng.colour }}
                >
                  {eng.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-normal text-[#101010] truncate">
                    {eng.name}
                  </p>
                  <p className="text-[10.5px] font-normal text-[#9B9B97] truncate">
                    {eng.trade}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-[4px] px-1.5 py-0.5 text-[9px] font-light text-white"
                  style={{ background: eng.colour }}
                >
                  {eng.badge}
                </span>
              </div>
              {/* Capacity bar */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-normal text-[#9B9B97]">Capacity</span>
                <span
                  className="text-[11px] font-light"
                  style={{ color: eng.colour }}
                >
                  {eng.capacity}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#F0F0EE] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${eng.capacity}%`, background: eng.colour }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[10.5px] font-normal text-[#686866]">
                <span>{eng.visits} visits assigned</span>
                <span>{eng.estates.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. ASSET REQUIRING ATTENTION ───────────────────────── */}
      <div className="rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Asset image */}
          <div className="relative h-40 w-full sm:h-auto sm:w-48 shrink-0 rounded-[8px] overflow-hidden bg-[#F5F5F3]">
            <Image
              src="/images/editorial/entirefm-hvac-rooftop-condensers-1280w.webp"
              alt="Chiller CH-01 Daikin EWYD500"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          </div>
          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-[#FDE68A] bg-[#FEF9C3] px-2 py-0.5 text-[10px] font-normal text-[#D97706]">
                <AlertCircle className="h-3 w-3" />
                ASSET SIGNAL — ACTION RECOMMENDED
              </span>
              <span className="text-[10px] font-normal text-[#9B9B97]">Today 04:42</span>
            </div>
            <h2 className="text-[16px] font-normal text-[#101010]">
              Chiller CH-01 — Daikin EWYD500 · Leeds Innovation Quarter
            </h2>
            <p className="text-[12.5px] text-[#686866] mt-1 leading-relaxed">
              Motor bearing vibration has increased{' '}
              <strong className="text-[#D97706]">+14% above SFG20 baseline</strong> over the past 72 hours. Autopilot has cross-referenced maintenance history and recommends advancing the scheduled inspection.
            </p>
            {/* Vibration trend */}
            <div className="mt-3 flex items-end gap-0.5 h-8">
              {[40, 42, 43, 41, 45, 48, 51, 55, 58, 62, 65, 68].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    height: `${(v / 80) * 100}%`,
                    background: i >= 8 ? '#D97706' : '#E4E4E1',
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] font-normal text-[#9B9B97] mt-1">
              Vibration trend (72h) — amber threshold exceeded at t+48h
            </p>
            {/* Recommendation */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="rounded-[7px] border border-[#FDE68A] bg-white px-3.5 py-2">
                <p className="text-[9.5px] font-medium uppercase tracking-wider text-[#9B9B97]">
                  Current Schedule
                </p>
                <p className="text-[13px] font-normal text-[#101010]">14 September 2026</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#D97706]" />
              <div className="rounded-[7px] border border-[#D97706] bg-[#FFFBEB] px-3.5 py-2">
                <p className="text-[9.5px] font-medium uppercase tracking-wider text-[#D97706]">
                  Autopilot Recommends
                </p>
                <p className="text-[13px] font-normal text-[#101010]">2 September 2026</p>
              </div>
              <Link
                href="/admin/planned-maintenance/schedule"
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#D97706] bg-[#D97706] px-4 py-2 text-[12px] font-normal text-white hover:bg-[#B45309] transition-colors"
              >
                Review Recommendation
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. MAINTENANCE PROGRAMMES TABLE ────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-normal text-[#101010]">
              Active Maintenance Programmes
            </h2>
            <p className="text-[12px] text-[#686866] mt-0.5">
              Approved PPM contracts operating under SFG20 and statutory UK maintenance frequencies.
            </p>
          </div>
          <span className="text-[11px] font-normal text-[#9B9B97]">
            {ACTIVE_PLANS.length} Active
          </span>
        </div>
        <div className="rounded-[10px] border border-[#E4E4E1] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E4E4E1] bg-[#FBFBFA]">
                  {['Plan', 'Estate / Building', 'Client', 'Discipline', 'Assets', 'Tasks', 'Annual Visits', 'Compliance', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10px] font-light uppercase tracking-wider text-[#9B9B97] first:pl-5 last:pr-5 last:text-center whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EE]">
                {ACTIVE_PLANS.map((plan) => (
                  <tr
                    key={plan.id}
                    className="group hover:bg-[#FBFBFA] transition-colors"
                  >
                    <td className="pl-5 pr-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {/* Site thumbnail */}
                        <div className="relative h-8 w-8 rounded-[5px] overflow-hidden shrink-0 bg-[#F5F5F3]">
                          <Image
                            src={plan.image}
                            alt={plan.city}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                        <span className="text-[10.5px] font-normal text-[#101010]">
                          {plan.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[12.5px] font-normal text-[#101010] max-w-[200px] truncate">
                        {plan.name}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-[#686866] whitespace-nowrap">
                      {plan.client}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] font-normal text-[#9B9B97] whitespace-nowrap">
                      {plan.discipline}
                    </td>
                    <td className="px-4 py-3.5 text-right text-[12px] text-[#101010] font-normal">
                      {plan.assets}
                    </td>
                    <td className="px-4 py-3.5 text-right font-normal text-[12px] text-[#686866]">
                      {plan.tasks}
                    </td>
                    <td className="px-4 py-3.5 text-right text-[12px] font-normal text-[#EA580C]">
                      {plan.annualVisits}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-normal ${
                          parseFloat(plan.compliance) >= 100
                            ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                            : 'bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]'
                        }`}
                      >
                        {plan.compliance}
                      </span>
                    </td>
                    <td className="pr-5 pl-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-[4px] bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-normal text-[#2563EB] border border-[#BFDBFE]">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 8. UPCOMING OCCURRENCES ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-normal text-[#101010]">
              Upcoming Planned Occurrences
            </h2>
            <p className="text-[12px] text-[#686866] mt-0.5">
              Live queue of statutory maintenance visits scheduled and auto-dispatched to certified field engineers.
            </p>
          </div>
          <Link
            href="/admin/planned-maintenance/schedule"
            className="text-[12px] font-normal text-[#EA580C] hover:underline flex items-center gap-1"
          >
            52-Week Schedule <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="rounded-[10px] border border-[#E4E4E1] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E4E4E1] bg-[#FBFBFA]">
                  {['Occurrence', 'Asset', 'Site', 'Standard', 'Scheduled', 'Assigned Engineer', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10px] font-light uppercase tracking-wider text-[#9B9B97] first:pl-5 last:pr-5 last:text-center"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0EE]">
                {OCCURRENCES.map((occ) => (
                  <tr key={occ.id} className="hover:bg-[#FBFBFA] transition-colors">
                    <td className="pl-5 pr-4 py-3.5 text-[10.5px] font-normal text-[#EA580C]">
                      {occ.number}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[12.5px] font-normal text-[#101010]">
                        {occ.asset}
                      </div>
                      <div className="text-[10px] font-normal text-[#9B9B97]">
                        {occ.tag}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-[#686866]">
                      {occ.site}
                    </td>
                    <td className="px-4 py-3.5 font-normal text-[11px] text-[#686866]">
                      {occ.standard}
                    </td>
                    <td className="px-4 py-3.5 text-[11.5px] font-normal text-[#101010] whitespace-nowrap">
                      {occ.due}
                    </td>
                    <td className="px-4 py-3.5 text-[12px] text-[#686866]">
                      {occ.engineer}
                    </td>
                    <td className="pr-5 pl-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-normal${statusColour(occ.status)}`}
                      >
                        {occ.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── 9. QUICK NAVIGATION ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            href: '/admin/estate/mobilisations',
            title: 'Estate Mobilisations',
            description: 'Import asset registers, run AI column matching, and verify equipment hierarchies prior to Autopilot activation.',
          },
          {
            href: '/admin/planned-maintenance/requirements',
            title: 'Maintenance Standards & SFG20',
            description: 'Review approved statutory frequencies, British Standards, and the full equipment task library.',
          },
          {
            href: '/admin/planned-maintenance/exceptions',
            title: 'PPM Exceptions & SLA Desk',
            description: 'Monitor client access restrictions, asset anomalies, and contractor SLA escalations.',
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-[10px] border border-[#E4E4E1] bg-white p-5 hover:border-[#D1D1CD] hover:shadow-[0_3px_8px_rgba(0,0,0,0.06)] transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13.5px] font-normal text-[#101010] group-hover:text-[#EA580C] transition-colors">
                {link.title}
              </span>
              <ArrowRight className="h-4 w-4 text-[#9B9B97] group-hover:translate-x-0.5 group-hover:text-[#EA580C] transition-all" />
            </div>
            <p className="text-[12px] text-[#686866] leading-relaxed">
              {link.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Site Drawer */}
      <SiteDrawer
        estate={selectedEstate}
        onClose={() => setSelectedEstate(null)}
      />
    </div>
  );
}
