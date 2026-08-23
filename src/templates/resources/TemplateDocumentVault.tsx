'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCheck,
  Table,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import type { TemplateProps } from '../types';

interface DocumentItem {
  id: string;
  title: string;
  category: 'Registers & Schedules' | 'Compliance Logbooks' | 'Procurement & Operations';
  format: 'CSV' | 'Markdown' | 'Spreadsheet';
  filename: string;
  description: string;
  contentGenerator: () => string;
  mimeType: string;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-asset-register',
    title: 'FM Asset Register Master Template (CSV)',
    category: 'Registers & Schedules',
    format: 'CSV',
    filename: 'EntireFM_Asset_Register_Master_Template_2026.csv',
    description: 'Standardised UK asset register format with 12 structured columns for equipment tagging, location, condition, and maintenance cycles.',
    mimeType: 'text/csv;charset=utf-8',
    contentGenerator: () => {
      const headers = [
        'Asset_Tag_ID',
        'Building_Location',
        'Floor_Room_Area',
        'Asset_Category',
        'Equipment_Type',
        'Manufacturer',
        'Model_Number',
        'Serial_Number',
        'Installation_Year',
        'Condition_Rating_1_5',
        'Criticality_Level',
        'PPM_Frequency',
        'Assigned_Contractor',
        'Notes',
      ];
      const sampleRow1 = [
        'AHU-01',
        'Main Building',
        'Plantroom Roof L4',
        'HVAC',
        'Air Handling Unit',
        'Daikin',
        'AHU-5000-X',
        'SN-98234-A',
        '2021',
        '4 - Good',
        'High',
        'Quarterly',
        'EntireFM M&E',
        'Filters replaced March 2026',
      ];
      const sampleRow2 = [
        'DB-GF-01',
        'Main Building',
        'Ground Floor Switchroom',
        'Electrical',
        '3-Phase Distribution Board',
        'Schneider',
        'Acti9-12W',
        'SN-11029-B',
        '2019',
        '5 - Excellent',
        'Critical',
        'Annual Thermal / 5-Yr EICR',
        'EntireFM Electrical',
        'Satisfactory EICR on file',
      ];
      return [headers.join(','), sampleRow1.join(','), sampleRow2.join(',')].join('\n');
    },
  },
  {
    id: 'doc-water-log',
    title: 'Water Hygiene Sentinel Temperature Log (CSV)',
    category: 'Compliance Logbooks',
    format: 'CSV',
    filename: 'EntireFM_Water_Hygiene_Sentinel_Log_2026.csv',
    description: 'ACOP L8 compliant monthly temperature logging spreadsheet for calorifier flow/return and principal hot/cold sentinel outlets.',
    mimeType: 'text/csv;charset=utf-8',
    contentGenerator: () => {
      const headers = [
        'Date_Recorded',
        'Outlet_ID',
        'Location_Description',
        'Outlet_Type',
        'Sentinel_Status',
        'Temperature_Target_C',
        'Temperature_Actual_C',
        'Compliant_Y_N',
        'Little_Used_Flushed_Y_N',
        'Recorded_By',
        'Remedial_Action_Required',
      ];
      const sampleRow1 = [
        '2026-08-01',
        'CW-SENT-GF',
        'Ground Floor Disabled WC Tap',
        'Cold Water',
        'Sentinel (Nearest to Tank)',
        '< 20.0 C in 2 mins',
        '16.4',
        'Y',
        'Y',
        'P. Currey',
        'None - Normal',
      ];
      const sampleRow2 = [
        '2026-08-01',
        'HW-SENT-L2',
        'Level 2 Tea Point Far Tap',
        'Hot Water',
        'Sentinel (Furthest from Calorifier)',
        '> 50.0 C in 1 min',
        '53.8',
        'Y',
        'N',
        'P. Currey',
        'None - Normal',
      ];
      return [headers.join(','), sampleRow1.join(','), sampleRow2.join(',')].join('\n');
    },
  },
  {
    id: 'doc-contractor-induction',
    title: 'Contractor Site Induction & Safety Checklist',
    category: 'Procurement & Operations',
    format: 'Markdown',
    filename: 'EntireFM_Contractor_Site_Induction_Checklist.md',
    description: 'Pre-work contractor checklist covering Asbestos register sign-off, Hot Works permits, lone working, and plantroom access protocols.',
    mimeType: 'text/markdown;charset=utf-8',
    contentGenerator: () => {
      return `# COMMERCIAL PROPERTY CONTRACTOR SITE INDUCTION CHECKLIST

## 1. CONTRACTOR & VISIT DETAILS
* **Contractor Company:** __________________________________
* **Lead Engineer Name:** __________________________________
* **Contact Phone:** __________________________________
* **Site Address:** __________________________________
* **Scope of Works:** __________________________________
* **Date & Arrival Time:** __________________________________

---

## 2. PRE-WORK STATUTORY CHECKS (MANDATORY)
- [ ] **Asbestos Register Inspected:** Confirmed no disturbance of ACMs in work location.
- [ ] **RAMS Approved:** Risk Assessment and Method Statement reviewed and on file.
- [ ] **Permits to Work (PTW) Issued (if applicable):**
  - [ ] Hot Works Permit (Gas cutting, welding, blowlamps)
  - [ ] Roof / Work at Height Permit
  - [ ] Confined Space Entry Permit
  - [ ] Electrical Isolation / High Voltage Isolation
- [ ] **Competence Verification:** CSCS / Gas Safe / F-Gas / ECS cards checked.

---

## 3. BUILDING ORIENTATION & EMERGENCY PROTOCOLS
- [ ] Emergency fire escape routes and assembly point identified.
- [ ] First aid point and appointed first aiders located.
- [ ] Fire alarm test day/time communicated to engineers.
- [ ] Plantroom sign-in and key sign-out completed.
- [ ] Welfare facilities (toilets, water, designated parking) briefed.

---

## 4. WORK COMPLETION & SIGN-OFF
* **Work Completed Satisfactorily:** [ ] Yes  [ ] No (Remedial Required)
* **Plantroom Secured & Cleaned:** [ ] Yes
* **Keys Returned & Logged:** [ ] Yes
* **Engineer Signature:** ______________________  **Date:** ________
* **Building Manager Signature:** ______________________  **Date:** ________`;
    },
  },
  {
    id: 'doc-fire-logbook',
    title: 'Weekly Fire Safety Inspection Log (CSV)',
    category: 'Compliance Logbooks',
    format: 'CSV',
    filename: 'EntireFM_Weekly_Fire_Safety_Inspection_Log.csv',
    description: 'Weekly fire safety log sheet tracking manual call point tests, emergency door operation, and escape route obstruction checks.',
    mimeType: 'text/csv;charset=utf-8',
    contentGenerator: () => {
      const headers = [
        'Week_Commencing',
        'Call_Point_ID_Tested',
        'Call_Point_Location',
        'Sounder_Audible_Y_N',
        'Panel_Reset_Normal_Y_N',
        'Fire_Doors_Clear_Y_N',
        'Escape_Routes_Unobstructed_Y_N',
        'Tested_By_Name',
        'Defects_Logged',
      ];
      const sampleRow = [
        '2026-08-17',
        'MCP-04',
        'First Floor Stairwell East',
        'Y',
        'Y',
        'Y',
        'Y',
        'J. Smith',
        'None - All operating normally',
      ];
      return [headers.join(','), sampleRow.join(',')].join('\n');
    },
  },
];

export function TemplateDocumentVault({ route, content }: TemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Document Vault', url: '/resources/document-vault' },
  ];

  const filteredDocs = selectedCategory === 'ALL'
    ? DOCUMENTS
    : DOCUMENTS.filter((d) => d.category === selectedCategory);

  const handleDownload = (doc: DocumentItem) => {
    const textData = doc.contentGenerator();
    const blob = new Blob([textData], { type: doc.mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = doc.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <span className="eyebrow eyebrow-dark inline-block mb-3">Downloadable FM Resources</span>
              <h1 className="text-display-md text-white font-extrabold tracking-tight">
                FM Document Vault
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-brand-mist/75">
                Clean, functional facilities management spreadsheets, asset registers, compliance logbooks, and contractor induction forms. 100% free and ungated.
              </p>
            </div>
          </div>
        </section>

        {/* Documents Grid Section */}
        <section className="py-16 bg-brand-carbon">
          <div className="container-custom">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                {['ALL', 'Registers & Schedules', 'Compliance Logbooks', 'Procurement & Operations'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-brand-electric-bright text-white'
                        : 'bg-brand-graphite border border-brand-edge-dark text-brand-mist/60 hover:text-white'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Templates' : cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-brand-mist/50">
                {filteredDocs.length} Verified Templates Available
              </span>
            </div>

            {/* Document Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 flex flex-col justify-between hover:border-brand-electric/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-brand-electric-bright">
                        {doc.format}
                      </span>
                      <span className="text-[11px] text-brand-mist/50 font-medium">
                        {doc.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {doc.title}
                    </h3>
                    <p className="mt-2 text-xs text-brand-mist/75 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-edge-dark flex items-center justify-between">
                    <span className="text-[11px] font-mono text-brand-mist/40 truncate max-w-[220px]">
                      {doc.filename}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="btn-primary py-2 px-3 text-xs inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ungated Assurance */}
            <div className="mt-12 rounded-sm bg-white/[0.02] border border-brand-edge-dark p-6 text-xs text-brand-mist/60 leading-relaxed">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-brand-electric-bright shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Genuine Ungated Downloads</h4>
                  <p className="mt-1">
                    Every document in this vault is generated dynamically as real CSV or Markdown files. You do not need to register, provide an email address, or request sales permission to download and use these templates across your estates.
                  </p>
                </div>
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
