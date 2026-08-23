'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Download,
  Printer,
  CheckSquare,
  Square,
  Clock,
  ShieldCheck,
  Calendar as CalendarIcon,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { TemplateProps } from '../types';

interface CalendarEvent {
  id: string;
  system: string;
  title: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | '6-Monthly' | 'Annually' | 'Periodic';
  applicableMonths: number[]; // 1-12
  legislation: string;
  dutyHolder: string;
  rationale: string;
}

const ALL_COMPLIANCE_EVENTS: CalendarEvent[] = [
  // Fire Alarm
  {
    id: 'ev-fa-weekly',
    system: 'Fire Safety & Detection',
    title: 'Fire Alarm Weekly Call Point Test',
    frequency: 'Weekly',
    applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    legislation: 'BS 5839-1 / RRO 2005 Article 17',
    dutyHolder: 'Responsible Person / Building Caretaker',
    rationale: 'Verify operation of a different manual call point every week and test sounder audibility.',
  },
  {
    id: 'ev-fa-6m',
    system: 'Fire Safety & Detection',
    title: 'Fire Alarm 6-Monthly Service Inspection',
    frequency: '6-Monthly',
    applicableMonths: [4, 10],
    legislation: 'BS 5839-1',
    dutyHolder: 'Certified Fire Alarm Engineer',
    rationale: 'Thorough inspection of control panel, standby batteries, detectors, sounders, and monitoring link.',
  },

  // Emergency Lighting
  {
    id: 'ev-el-monthly',
    system: 'Emergency Lighting',
    title: 'Emergency Lighting Monthly Function Test',
    frequency: 'Monthly',
    applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    legislation: 'BS 5266-1',
    dutyHolder: 'Trained Internal Staff / Maintenance Tech',
    rationale: 'Brief flick test of luminaires to confirm battery changeover and lamp operation on loss of mains.',
  },
  {
    id: 'ev-el-annual',
    system: 'Emergency Lighting',
    title: 'Emergency Lighting Annual 3-Hour Duration Test',
    frequency: 'Annually',
    applicableMonths: [11],
    legislation: 'BS 5266-1',
    dutyHolder: 'Competent Electrical Engineer',
    rationale: 'Full-duration continuous discharge to verify battery life under sustained emergency power outage.',
  },

  // Water Hygiene
  {
    id: 'ev-water-monthly',
    system: 'Water Hygiene & Legionella',
    title: 'Monthly Sentinel Outlet Temperature Log',
    frequency: 'Monthly',
    applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    legislation: 'ACOP L8 / HSG274 Part 2',
    dutyHolder: 'Nominated Responsible Person (Water)',
    rationale: 'Check principal hot and cold sentinel taps. Cold < 20°C in 2 min, Hot > 50°C in 1 min.',
  },
  {
    id: 'ev-water-annual',
    system: 'Water Hygiene & Legionella',
    title: 'Annual Water Storage Tank & Calorifier Inspection',
    frequency: 'Annually',
    applicableMonths: [6],
    legislation: 'ACOP L8 / HSG274',
    dutyHolder: 'Water Hygiene Specialist',
    rationale: 'Internal inspection of cold water tanks and calorifiers for sediment, stagnation, and insect screens.',
  },

  // Fixed Electrical
  {
    id: 'ev-eicr',
    system: 'Fixed Electrical & EICR',
    title: 'Fixed Wire Periodic Inspection & Testing (EICR)',
    frequency: 'Periodic',
    applicableMonths: [3],
    legislation: 'Electricity at Work Regs 1989 / BS 7671',
    dutyHolder: 'Approved Scheme Registered Electrician',
    rationale: 'Periodic verification of circuit integrity, earthing, RCD trips, and distribution boards.',
  },
  {
    id: 'ev-pat',
    system: 'Fixed Electrical & EICR',
    title: 'Portable Appliance Testing (PAT) Review',
    frequency: 'Annually',
    applicableMonths: [9],
    legislation: 'Electricity at Work Regs 1989 / IET Code of Practice',
    dutyHolder: 'Competent PAT Technician',
    rationale: 'Risk-based inspection and electrical test of portable electrical equipment and trailing leads.',
  },

  // Commercial Gas
  {
    id: 'ev-gas-annual',
    system: 'Commercial Gas & Boilers',
    title: 'Annual Commercial Gas Plant Service & Safety Audit',
    frequency: 'Annually',
    applicableMonths: [9],
    legislation: 'Gas Safety (Installation and Use) Regs 1998 Reg 35',
    dutyHolder: 'Gas Safe Commercial Engineer',
    rationale: 'Combustion analysis, flue check, ventilation interlock verification, and safety valve testing before heating season.',
  },

  // LOLER Lifts
  {
    id: 'ev-lift-6m',
    system: 'Lifts & Vertical Transport',
    title: 'Passenger Lift LOLER Thorough Examination',
    frequency: '6-Monthly',
    applicableMonths: [5, 11],
    legislation: 'LOLER 1998 Regulation 9(3)(a)',
    dutyHolder: 'Independent Competent Person (Insurance / Inspection Body)',
    rationale: 'Statutory 6-month thorough examination for all lifting equipment carrying persons.',
  },
  {
    id: 'ev-lift-goods',
    system: 'Lifts & Vertical Transport',
    title: 'Goods Lift & Dock Leveller LOLER Examination',
    frequency: 'Annually',
    applicableMonths: [5],
    legislation: 'LOLER 1998 Regulation 9(3)(b)',
    dutyHolder: 'Independent Competent Person',
    rationale: 'Statutory 12-month thorough examination for non-passenger goods lifting equipment.',
  },

  // HVAC / F-Gas
  {
    id: 'ev-fgas-6m',
    system: 'HVAC & F-Gas Refrigeration',
    title: 'F-Gas Refrigerant Leak Inspection',
    frequency: '6-Monthly',
    applicableMonths: [2, 8],
    legislation: 'GB F-Gas Regulations',
    dutyHolder: 'Certified F-Gas Engineer',
    rationale: 'Mandatory leak testing on systems exceeding CO2e refrigerant charge thresholds.',
  },
];

const SYSTEMS = Array.from(new Set(ALL_COMPLIANCE_EVENTS.map((e) => e.system)));
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function TemplateComplianceCalendar({ route, content }: TemplateProps) {
  const [selectedSystems, setSelectedSystems] = useState<string[]>(SYSTEMS);
  const [activeMonth, setActiveMonth] = useState<number>(1); // 1 = January

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
    { name: 'Compliance Calendar', url: '/tools/compliance-calendar' },
  ];

  const toggleSystem = (sys: string) => {
    if (selectedSystems.includes(sys)) {
      setSelectedSystems(selectedSystems.filter((s) => s !== sys));
    } else {
      setSelectedSystems([...selectedSystems, sys]);
    }
  };

  const selectAll = () => setSelectedSystems(SYSTEMS);
  const selectNone = () => setSelectedSystems([]);

  const activeEvents = useMemo(() => {
    return ALL_COMPLIANCE_EVENTS.filter((e) => selectedSystems.includes(e.system));
  }, [selectedSystems]);

  const monthEvents = useMemo(() => {
    return activeEvents.filter((e) => e.applicableMonths.includes(activeMonth));
  }, [activeEvents, activeMonth]);

  // Generate standard ICS calendar file
  const handleDownloadIcs = () => {
    const year = new Date().getFullYear();
    let icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EntireFM//FM Statutory Compliance Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    activeEvents.forEach((ev, idx) => {
      ev.applicableMonths.forEach((m) => {
        const monthStr = m < 10 ? `0${m}` : `${m}`;
        const dtStart = `${year}${monthStr}01T090000Z`;
        const dtEnd = `${year}${monthStr}01T100000Z`;

        icsData.push(
          'BEGIN:VEVENT',
          `UID:entirefm-compliance-${idx}-${m}-${year}@entirefm.com`,
          `DTSTAMP:${year}0101T000000Z`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:[FM Compliance] ${ev.title}`,
          `DESCRIPTION:${ev.rationale}\\n\\nDuty Holder: ${ev.dutyHolder}\\nGoverning Basis: ${ev.legislation}`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      });
    });

    icsData.push('END:VCALENDAR');
    const icsBlob = new Blob([icsData.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(icsBlob);
    link.setAttribute('download', `EntireFM_Compliance_Calendar_${year}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-void text-white">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20 border-b border-brand-edge-dark">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[15%] -top-[30%] h-[36rem] w-[36rem] rounded-full opacity-20 blur-[130px]"
            style={{ background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)' }}
          />

          <div className="container-custom relative">
            <Breadcrumbs items={breadcrumbs} className="mb-6" />
            <div className="max-w-3xl">
              <span className="eyebrow eyebrow-dark inline-block mb-3">Statutory Testing Roadmap</span>
              <h1 className="text-display-md text-white font-extrabold tracking-tight">
                FM Compliance Calendar Builder
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-brand-mist/75">
                Generate a 12-month schedule of statutory maintenance, periodic testing, and inspection milestones tailored to your building services. Export directly to Outlook, Google Calendar, or PDF.
              </p>
            </div>
          </div>
        </section>

        {/* Calendar Builder Body */}
        <section className="py-14 bg-brand-carbon">
          <div className="container-custom">
            {/* System Selector */}
            <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-edge-dark pb-4 mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Step 1: Select Your Building Systems
                  </h2>
                  <p className="text-xs text-brand-mist/60 mt-0.5">
                    Include only the plant and services present on your estate.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-brand-electric-bright hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    type="button"
                    onClick={selectNone}
                    className="text-brand-mist/50 hover:text-white"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {SYSTEMS.map((sys) => {
                  const active = selectedSystems.includes(sys);
                  return (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => toggleSystem(sys)}
                      className={`flex items-center gap-2 p-2.5 rounded-sm border text-xs text-left transition-all ${
                        active
                          ? 'border-brand-electric-bright bg-brand-electric/10 text-white font-medium'
                          : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/50 hover:bg-white/[0.04]'
                      }`}
                    >
                      {active ? (
                        <CheckSquare className="h-3.5 w-3.5 text-brand-electric-bright shrink-0" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-brand-mist/30 shrink-0" />
                      )}
                      <span className="truncate">{sys}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons & Month Selector */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
              {/* Month Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
                {MONTH_NAMES.map((name, idx) => {
                  const mNum = idx + 1;
                  const count = activeEvents.filter((e) => e.applicableMonths.includes(mNum)).length;
                  const isCurrent = activeMonth === mNum;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setActiveMonth(mNum)}
                      className={`px-3 py-2 rounded-sm text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-brand-electric-bright text-white shadow-glow-sm'
                          : 'bg-brand-graphite border border-brand-edge-dark text-brand-mist/70 hover:text-white'
                      }`}
                    >
                      {name.slice(0, 3)}
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isCurrent ? 'bg-black/30 text-white' : 'bg-white/10 text-brand-mist/60'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Export triggers */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="btn-primary py-2 px-3 text-xs"
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Download .ICS Calendar
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-ghost-light py-2 px-3 text-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Schedule
                </button>
              </div>
            </div>

            {/* Month Events Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-brand-electric-bright" />
                  {MONTH_NAMES[activeMonth - 1]} Compliance Tasks ({monthEvents.length})
                </h3>
                <span className="text-xs text-brand-mist/50">
                  Showing statutory milestones for {MONTH_NAMES[activeMonth - 1]}
                </span>
              </div>

              {monthEvents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {monthEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-5 hover:border-brand-electric/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-electric-bright">
                          {ev.system}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-brand-mist">
                          {ev.frequency}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">
                        {ev.title}
                      </h4>
                      <p className="mt-2 text-xs text-brand-mist/75 leading-relaxed">
                        {ev.rationale}
                      </p>

                      <div className="mt-4 pt-3 border-t border-brand-edge-dark grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-brand-mist/40 block">Duty Holder:</span>
                          <span className="text-brand-mist/80 font-medium">{ev.dutyHolder}</span>
                        </div>
                        <div>
                          <span className="text-brand-mist/40 block">Governing Basis:</span>
                          <span className="text-brand-mist/80 font-mono">{ev.legislation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-brand-mist/50 bg-brand-graphite rounded-sm border border-brand-edge-dark">
                  No statutory events scheduled for {MONTH_NAMES[activeMonth - 1]} under your selected systems.
                </div>
              )}
            </div>

            {/* Statutory Disclaimer */}
            <div className="mt-10 rounded-sm bg-white/[0.02] border border-brand-edge-dark p-5 text-xs text-brand-mist/60 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 text-brand-electric-bright shrink-0 mt-0.5" />
                <p>
                  <strong>Statutory Schedule Notice:</strong> Frequencies listed above represent baseline UK statutory requirements and standard guidance under BS 5266, BS 5839, BS 7671, ACOP L8, and LOLER 1998. Site-specific risks or heavy industrial usage may dictate more frequent testing. Consult the <Link href="/compliance" className="text-brand-electric-bright underline">EntireFM Compliance Centre</Link> for full legislative details.
                </p>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
