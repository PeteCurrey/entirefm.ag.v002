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
  Check,
  List,
  LayoutGrid,
  CalendarDays,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { WizardProgress } from '@/components/tools/WizardProgress';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import { generateIcsCalendar, downloadIcsFile } from '@/lib/exports/ics-exporter';
import { generateCsv, downloadCsvFile } from '@/lib/exports/csv-exporter';
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
    rationale: 'Annual combustion efficiency, safety interlock tests, burner clean, and CP15/CP17 certification.',
  },

  // Air Conditioning / F-Gas
  {
    id: 'ev-fgas-6m',
    system: 'HVAC & Air Conditioning',
    title: 'F-Gas Refrigerant Leak Check & Logbook Update',
    frequency: '6-Monthly',
    applicableMonths: [5, 11],
    legislation: 'GB Fluorinated Greenhouse Gases Regulations 2015',
    dutyHolder: 'F-Gas Certified Engineer (REFCOM)',
    rationale: 'Mandatory direct/indirect refrigerant leak inspection for systems >5 tonnes CO2e.',
  },

  // Lifting Equipment
  {
    id: 'ev-loler-6m',
    system: 'Lifts & Lifting Gear (LOLER)',
    title: 'Passenger Lift Thorough Examination (LOLER)',
    frequency: '6-Monthly',
    applicableMonths: [4, 10],
    legislation: 'LOLER 1998 Regulation 9 / SAFed Guidelines',
    dutyHolder: 'Independent Competent Person (Insurance Surveyor)',
    rationale: 'Statutory 6-monthly thorough examination of passenger-carrying lift mechanisms and safety gears.',
  },

  // Fall Protection
  {
    id: 'ev-fall-annual',
    system: 'Roof Safety & Fall Arrest',
    title: 'Mansafe Fall Arrest System Pull-Test & Recertification',
    frequency: 'Annually',
    applicableMonths: [7],
    legislation: 'Work at Height Regs 2005 / BS EN 795',
    dutyHolder: 'Specialist Fall Protection Engineer',
    rationale: 'Proof-load test and visual inspection of roof cables, eyebolts, and PPE attachment points.',
  },
];

const SYSTEMS = Array.from(new Set(ALL_COMPLIANCE_EVENTS.map((e) => e.system)));
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WIZARD_STEPS = [
  { id: 1, title: '01 Systems', subtitle: 'Select Regimes' },
  { id: 2, title: '02 Schedule', subtitle: 'Interactive Timetable' },
];

export function TemplateComplianceCalendar({ route, content }: TemplateProps) {
  const [selectedSystems, setSelectedSystems] = useState<string[]>(SYSTEMS);
  const [activeMonth, setActiveMonth] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'calendar' | 'programme' | 'list'>('calendar');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
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

  // Filter events
  const activeEvents = useMemo(() => {
    return ALL_COMPLIANCE_EVENTS.filter((e) => selectedSystems.includes(e.system));
  }, [selectedSystems]);

  const monthEvents = useMemo(() => {
    return activeEvents.filter((e) => e.applicableMonths.includes(activeMonth));
  }, [activeEvents, activeMonth]);

  const handleDownloadIcs = () => {
    const calendarEvents = activeEvents.map((evt) => {
      const targetMonth = evt.applicableMonths[0] || 1;
      const date = new Date(2026, targetMonth - 1, 15, 9, 0);

      return {
        id: `efm-${evt.id}`,
        title: `[Statutory Compliance] ${evt.title}`,
        description: `Legislation: ${evt.legislation}\nDuty Holder: ${evt.dutyHolder}\nRationale: ${evt.rationale}\n\nManaged via EntireFM Statutory Compliance Portal.`,
        startDate: date,
        durationMinutes: 120,
        reminderDaysBefore: 7, // 7-day advance notification VALARM
        categories: ['Compliance', 'Statutory', evt.system],
      };
    });

    const icsContent = generateIcsCalendar('EntireFM Statutory Compliance Schedule 2026', calendarEvents);
    downloadIcsFile(icsContent, 'EntireFM_Statutory_Compliance_Calendar.ics');
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCsv(activeEvents, [
      { header: 'System', accessor: (d) => d.system },
      { header: 'Compliance Activity', accessor: (d) => d.title },
      { header: 'Frequency', accessor: (d) => d.frequency },
      { header: 'Governing Legislation', accessor: (d) => d.legislation },
      { header: 'Responsible Duty Holder', accessor: (d) => d.dutyHolder },
      { header: 'Statutory Rationale', accessor: (d) => d.rationale },
      { header: 'Applicable Months', accessor: (d) => d.applicableMonths.map((m) => MONTH_NAMES[m - 1].slice(0, 3)).join(', ') },
    ]);
    downloadCsvFile(csvContent, 'EntireFM_Compliance_Calendar.csv');
  };

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'Annual Statutory Building Compliance Inspection Calendar',
      subtitle: '12-Month schedule of statutory inspections, periodic tests, and competent engineer examinations.',
      documentRef: `EFM-CAL-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      badgeText: 'Compliance Timetable',
      summaryStats: [
        { label: 'Selected Systems', value: `${selectedSystems.length} Regimes` },
        { label: 'Total Events', value: `${activeEvents.length} Tasks`, detail: 'Annual Schedule' },
        { label: 'Current Month', value: `${MONTH_NAMES[activeMonth - 1]} (${monthEvents.length} tasks)` },
        { label: 'Weekly / Monthly Tests', value: `${activeEvents.filter((e) => e.frequency === 'Weekly' || e.frequency === 'Monthly').length} Ongoing` },
      ],
      sections: [
        {
          type: 'table',
          heading: '1. 12-Month Statutory Compliance Schedule Matrix',
          columns: [
            { header: 'Building System', widthPercent: 24 },
            { header: 'Statutory Inspection Activity', widthPercent: 36 },
            { header: 'Frequency', widthPercent: 14, align: 'center' },
            { header: 'Governing Legislation', widthPercent: 26 },
          ],
          rows: activeEvents.map((e) => [
            e.system,
            e.title,
            e.frequency,
            e.legislation,
          ]),
        },
      ],
    };
    downloadPdfReport(pdfDoc);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="Compliance Calendar Builder"
          purpose="Generate an interactive 12-month schedule of statutory testing milestones with legal duty breakdowns and calendar export."
          timeEstimate="3 min"
          outputs={['PDF Schedule', 'CSV Matrix', 'iCal (.ics)']}
          icon={CalendarCheck}
        >
          {/* Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={0}
          />

          <div className="max-w-6xl mx-auto space-y-8">
            {/* System Selection Toolbar */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#FF3E9D] uppercase tracking-wider">
                    Filter Regimes
                  </span>
                  <h3 className="text-sm font-bold text-white">Active Building Systems</h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button type="button" onClick={selectAll} className="text-[#FF3E9D] hover:underline font-semibold">
                    Select All
                  </button>
                  <span className="text-slate-700">|</span>
                  <button type="button" onClick={selectNone} className="text-slate-400 hover:text-white">
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {SYSTEMS.map((sys) => {
                  const active = selectedSystems.includes(sys);
                  return (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => toggleSystem(sys)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all ${
                        active
                          ? 'border-[#FF3E9D] bg-[#FF3E9D]/10 text-white font-semibold ring-1 ring-[#FF3E9D]/30'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                        active ? 'bg-[#FF3E9D] border-[#FF3E9D] text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{sys}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Switcher & Month Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Month Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {MONTH_NAMES.map((name, idx) => {
                  const mNum = idx + 1;
                  const count = activeEvents.filter((e) => e.applicableMonths.includes(mNum)).length;
                  const isCurrent = activeMonth === mNum;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setActiveMonth(mNum)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-[#FF3E9D] text-white shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {name.slice(0, 3)}
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isCurrent ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'calendar' ? 'bg-[#0B1220] text-[#FF3E9D] border border-[#FF3E9D]/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Month</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('programme')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'programme' ? 'bg-[#0B1220] text-[#FF3E9D] border border-[#FF3E9D]/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Annual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'list' ? 'bg-[#0B1220] text-[#FF3E9D] border border-[#FF3E9D]/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Display Area */}
            {viewMode === 'calendar' && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                      {MONTH_NAMES[activeMonth - 1]} 2026
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Statutory Testing Milestones ({monthEvents.length} Tasks)
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monthEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm text-white">{evt.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          {evt.frequency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{evt.rationale}</p>
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-400 font-mono">{evt.legislation}</span>
                        <span className="text-slate-300 font-semibold">{evt.dutyHolder}</span>
                      </div>
                    </div>
                  ))}
                  {monthEvents.length === 0 && (
                    <div className="col-span-2 py-12 text-center text-slate-500 font-medium">
                      No statutory inspections scheduled for this month under selected filters.
                    </div>
                  )}
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="Compliance Calendar"
                  onDownloadPdf={handleDownloadPdf}
                  onDownloadCsv={handleDownloadCsv}
                  onDownloadIcs={handleDownloadIcs}
                  pdfLabel="Download PDF Timetable"
                  csvLabel="Export CSV Calendar"
                  icsLabel="Export RFC 5545 iCalendar (.ics)"
                />
              </div>
            )}

            {viewMode === 'programme' && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white">Annual Inspection Roadmap (Jan–Dec)</h3>
                  <p className="text-xs text-slate-400">12-month visual timeline distribution across all selected statutory regimes.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {MONTH_NAMES.map((mName, mIdx) => {
                    const mNum = mIdx + 1;
                    const mTasks = activeEvents.filter((e) => e.applicableMonths.includes(mNum));
                    return (
                      <div
                        key={mName}
                        onClick={() => {
                          setActiveMonth(mNum);
                          setViewMode('calendar');
                        }}
                        className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-[#FF3E9D]/60 cursor-pointer transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white">{mName.slice(0, 3)}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                            {mTasks.length} tasks
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 line-clamp-2">
                          {mTasks.slice(0, 2).map((t) => t.title.split(' ')[0]).join(', ')}...
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'list' && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white">Complete Statutory Duty Registry</h3>
                  <p className="text-xs text-slate-400">All mandated periodic inspections with governing legislation and responsible party.</p>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <th className="p-3.5">System</th>
                        <th className="p-3.5">Activity</th>
                        <th className="p-3.5">Frequency</th>
                        <th className="p-3.5">Governing Legislation</th>
                        <th className="p-3.5">Duty Holder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {activeEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-slate-800/40">
                          <td className="p-3.5 font-bold text-white whitespace-nowrap">{evt.system}</td>
                          <td className="p-3.5 text-slate-300">{evt.title}</td>
                          <td className="p-3.5 font-mono text-white font-semibold">{evt.frequency}</td>
                          <td className="p-3.5 font-mono text-slate-400 text-[10.5px]">{evt.legislation}</td>
                          <td className="p-3.5 text-slate-300">{evt.dutyHolder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Conversion CTA */}
            <ToolConversionCTA
              toolName="Compliance Calendar"
              heading="Let EntireFM automate your statutory compliance calendar"
              subheading="Never miss a statutory inspection deadline. EntireFM integrates with EntireCAFM to track engineer visits and certificate renewals in real-time."
              primaryActionLabel="Schedule Compliance Audit"
              primaryActionHref="/contact-us#enquiry"
            />
          </div>
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
