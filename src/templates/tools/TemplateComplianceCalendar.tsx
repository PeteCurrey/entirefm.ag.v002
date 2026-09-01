'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Check,
  List,
  LayoutGrid,
  CalendarDays,
  Clock,
  ShieldCheck,
  Building2,
  Filter,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
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
    applicableMonths: [3, 9],
    legislation: 'BS 5839-1 Section 45',
    dutyHolder: 'BAFE-Certified Fire Engineer',
    rationale: 'Inspect control panel standby batteries, cause-and-effect links, and automatic detectors.',
  },
  {
    id: 'ev-el-monthly',
    system: 'Emergency Lighting',
    title: 'Emergency Lighting Monthly Functional Flick Test',
    frequency: 'Monthly',
    applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    legislation: 'BS 5266-1 / RRO 2005 Article 14',
    dutyHolder: 'Appointed Building Custodian',
    rationale: 'Simulate mains power failure via key switch to confirm every luminaire illuminates.',
  },
  {
    id: 'ev-el-annual',
    system: 'Emergency Lighting',
    title: 'Emergency Lighting Full 3-Hour Discharge Test',
    frequency: 'Annually',
    applicableMonths: [10],
    legislation: 'BS 5266-8 / EN 50172',
    dutyHolder: 'Qualified Electrical Engineer',
    rationale: 'Full duration battery discharge test to ensure all emergency luminaires stay illuminated for 3 hours.',
  },
  {
    id: 'ev-wat-monthly',
    system: 'Water Hygiene & Legionella',
    title: 'Legionella Sentinel Temperature Checks & Flushing',
    frequency: 'Monthly',
    applicableMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    legislation: 'HSE ACoP L8 / HSG274 Part 2',
    dutyHolder: 'Trained Water Hygiene Technician',
    rationale: 'Record sentinel hot/cold water temperatures and flush little-used outlets.',
  },
  {
    id: 'ev-gas-annual',
    system: 'Commercial Gas & Boilers',
    title: 'Commercial Gas Safety Inspection (CP17/CP12)',
    frequency: 'Annually',
    applicableMonths: [8],
    legislation: 'Gas Safety (Installation and Use) Regs 1998',
    dutyHolder: 'Gas Safe Registered Engineer (Commercial)',
    rationale: 'Mandatory annual safety check of gas boilers, pipework tightness, and flue spillage.',
  },
  {
    id: 'ev-lift-6m',
    system: 'Lifting & Vertical Transport',
    title: 'LOLER Thorough Examination (Passenger Lifts)',
    frequency: '6-Monthly',
    applicableMonths: [4, 10],
    legislation: 'LOLER 1998 Regulation 9',
    dutyHolder: 'Competent Lift Insurance Engineer',
    rationale: 'Independent statutory examination of suspension ropes, safety gear, overspeed governor, and landing door locks.',
  },
  {
    id: 'ev-fgas-6m',
    system: 'HVAC & Air Conditioning',
    title: 'F-Gas Refrigerant Leak Inspection (Systems >5t CO2e)',
    frequency: '6-Monthly',
    applicableMonths: [5, 11],
    legislation: 'Fluorinated Greenhouse Gases Regs 2015',
    dutyHolder: 'F-Gas Certified Refrigeration Specialist',
    rationale: 'Mandatory leak testing and logbook updating for commercial air conditioning and chiller circuits.',
  },
  {
    id: 'ev-pat-annual',
    system: 'Electrical Systems',
    title: 'PAT / In-Service Portable Appliance Testing',
    frequency: 'Annually',
    applicableMonths: [2],
    legislation: 'EAWR 1989 / IET Code of Practice',
    dutyHolder: 'Qualified PAT Testing Technician',
    rationale: 'Inspect and electrically test all portable plug-in equipment across office and workshop areas.',
  },
  {
    id: 'ev-ext-annual',
    system: 'Fire Safety & Detection',
    title: 'Fire Extinguisher Annual Maintenance',
    frequency: 'Annually',
    applicableMonths: [6],
    legislation: 'BS 5306-3 / RRO 2005 Article 13',
    dutyHolder: 'BAFE Registered Extinguisher Technician',
    rationale: 'Inspect seals, gauge pressures, horn nozzles, and discharge hoses on all portable fire fighting appliances.',
  },
];

const SYSTEMS = Array.from(new Set(ALL_COMPLIANCE_EVENTS.map((e) => e.system)));

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function TemplateComplianceCalendar({ route, content }: TemplateProps) {
  const [selectedSystems, setSelectedSystems] = useState<string[]>(SYSTEMS);
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState<'calendar' | 'programme' | 'list'>('calendar');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'Compliance Calendar Builder', url: '/tools/compliance-calendar' },
  ];

  const toggleSystem = (sys: string) => {
    setSelectedSystems((prev) =>
      prev.includes(sys) ? prev.filter((s) => s !== sys) : [...prev, sys]
    );
  };

  const selectAll = () => setSelectedSystems(SYSTEMS);
  const selectNone = () => setSelectedSystems([]);

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
        reminderDaysBefore: 7,
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
      { header: 'Legislation', accessor: (d) => d.legislation },
      { header: 'Competent Person', accessor: (d) => d.dutyHolder },
      { header: 'Rationale', accessor: (d) => d.rationale },
    ]);
    downloadCsvFile(csvContent, 'EntireFM_Statutory_Compliance_Matrix.csv');
  };

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'Annual Statutory Compliance Calendar & Testing Schedule',
      subtitle: 'Periodic statutory inspection milestones and duty-holder governance.',
      documentRef: `EFM-CAL-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      badgeText: 'Statutory Compliance Timetable',
      summaryStats: [
        { label: 'Active Systems', value: `${selectedSystems.length} / ${SYSTEMS.length}` },
        { label: 'Planned Milestones', value: `${activeEvents.length} Regimes` },
      ],
      sections: [
        {
          type: 'table',
          heading: '1. Statutory Compliance Schedule by System',
          columns: [
            { header: 'Discipline', widthPercent: 25 },
            { header: 'Compliance Activity', widthPercent: 40 },
            { header: 'Frequency', widthPercent: 15, align: 'center' },
            { header: 'Governing Legislation', widthPercent: 20 },
          ],
          rows: activeEvents.map((e) => [e.system, e.title, e.frequency, e.legislation]),
        },
      ],
    };
    downloadPdfReport(pdfDoc);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow pt-16">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="Compliance Calendar Builder"
          purpose="Generate an interactive 12-month schedule of statutory testing milestones with legal duty breakdowns and calendar export."
          timeEstimate="3 min"
          outputs={['PDF Schedule', 'CSV Matrix', 'iCal (.ics)']}
        >
          <div className="max-w-6xl mx-auto space-y-8">
            {/* System Selection Toolbar */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-electric" />
                  <h3 className="text-sm font-normal text-slate-900 uppercase tracking-wider">
                    Filter Active Building Systems
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button type="button" onClick={selectAll} className="text-brand-electric hover:underline font-light">
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button type="button" onClick={selectNone} className="text-slate-500 hover:text-slate-900">
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
                      className={`flex items-center gap-2 p-2.5 rounded-sm border text-xs text-left transition-all ${
                        active
                          ? 'border-brand-electric bg-blue-50/70 text-slate-900 font-light ring-1 ring-brand-electric shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center border shrink-0 ${
                        active ? 'bg-brand-electric border-brand-electric text-white' : 'border-slate-300 bg-white'
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
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin text-xs">
                {MONTH_NAMES.map((name, idx) => {
                  const mNum = idx + 1;
                  const count = activeEvents.filter((e) => e.applicableMonths.includes(mNum)).length;
                  const isCurrent = activeMonth === mNum;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setActiveMonth(mNum)}
                      className={`px-3 py-1.5 font-light whitespace-nowrap rounded-t-sm transition-all ${
                        isCurrent
                          ? 'bg-white border-t-2 border-brand-electric text-brand-electric shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      {name.slice(0, 3)} ({count})
                    </button>
                  );
                })}
              </div>

              {/* View Mode Buttons */}
              <div className="flex items-center gap-1 border border-slate-200 p-1 rounded-sm bg-white shadow-2xs self-start md:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-xs flex items-center gap-1.5 font-medium transition-colors ${
                    viewMode === 'calendar' ? 'bg-brand-graphite text-white font-light' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" /> Month Focus
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('programme')}
                  className={`px-3 py-1.5 rounded-xs flex items-center gap-1.5 font-medium transition-colors ${
                    viewMode === 'programme' ? 'bg-brand-graphite text-white font-light' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> 12-Month Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-xs flex items-center gap-1.5 font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-brand-graphite text-white font-light' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Full Matrix
                </button>
              </div>
            </div>

            {/* MONTH FOCUS VIEW */}
            {viewMode === 'calendar' && (
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-sm shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-widest font-light">
                      Scheduled Testing
                    </span>
                    <h3 className="text-xl font-light text-slate-900 mt-0.5">
                      {MONTH_NAMES[activeMonth - 1]} 2026 — Statutory Milestones
                    </h3>
                  </div>
                  <span className="text-xs font-light text-brand-electric bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
                    {monthEvents.length} Active Obligations
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {monthEvents.map((evt) => (
                    <div key={evt.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-light text-slate-900 text-sm">{evt.title}</span>
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-normal uppercase rounded-sm">
                            {evt.frequency}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-snug">{evt.rationale}</p>
                        <div className="text-[11.5px] font-normal text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                          <span className="text-brand-electric font-light">{evt.system}</span>
                          <span>·</span>
                          <span>{evt.legislation}</span>
                          <span>·</span>
                          <span className="text-slate-700 font-light">{evt.dutyHolder}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {monthEvents.length === 0 && (
                    <p className="text-slate-500 py-8 text-center">No statutory events scheduled for this month.</p>
                  )}
                </div>
              </div>
            )}

            {/* 12-MONTH GRID VIEW */}
            {viewMode === 'programme' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {MONTH_NAMES.map((name, idx) => {
                  const mNum = idx + 1;
                  const events = activeEvents.filter((e) => e.applicableMonths.includes(mNum));
                  return (
                    <div key={name} className="p-5 bg-white border border-slate-200 rounded-sm shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-sm font-normal text-slate-900">{name}</span>
                        <span className="text-[11px] font-light text-brand-electric bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100">{events.length} Tasks</span>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                        {events.map((e) => (
                          <div key={e.id} className="p-2 rounded-xs bg-slate-50 border border-slate-100 space-y-0.5">
                            <span className="font-light text-slate-900 block">{e.title}</span>
                            <span className="text-slate-500 block text-[10.5px]">{e.frequency} · {e.legislation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FULL MATRIX VIEW */}
            {viewMode === 'list' && (
              <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-light uppercase tracking-wider text-[10.5px] border-b border-slate-200">
                      <th className="p-3.5">Discipline</th>
                      <th className="p-3.5">Compliance Milestone</th>
                      <th className="p-3.5 text-center">Frequency</th>
                      <th className="p-3.5">Governing Legislation</th>
                      <th className="p-3.5">Duty Holder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activeEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-light text-slate-900 whitespace-nowrap">{evt.system}</td>
                        <td className="p-3.5 font-normal text-slate-800">{evt.title}</td>
                        <td className="p-3.5 text-center font-light text-slate-700">{evt.frequency}</td>
                        <td className="p-3.5 font-normal text-[11px] text-slate-500">{evt.legislation}</td>
                        <td className="p-3.5 text-slate-600 font-normal">{evt.dutyHolder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Export Toolbar */}
            <ExportToolbar
              toolName="Compliance Calendar"
              onDownloadPdf={handleDownloadPdf}
              onDownloadCsv={handleDownloadCsv}
              onDownloadIcs={handleDownloadIcs}
              pdfLabel="Download Calendar (PDF)"
              csvLabel="Export Matrix (CSV)"
              icsLabel="Add to Outlook / Google Calendar (.ics)"
            />

            <ToolConversionCTA
              toolName="Compliance Calendar"
              heading="Require automated statutory compliance management?"
              subheading="EntireFM automates all statutory calendar duties with digital logbook certification, automated reminder triggers, and certified engineer dispatch."
              primaryActionLabel="Request Compliance Onboarding"
              primaryActionHref="/contact-us#enquiry"
            />
          </div>
        </ToolShell>
      </div>
      <Footer />
    </div>
  );
}
