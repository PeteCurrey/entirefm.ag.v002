'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCheck,
  Table,
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { NewsletterSignupSection } from '@/components/newsletter/NewsletterSignupSection';
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
    description: 'Standardised UK asset register format with 14 structured columns for equipment tagging, location hierarchy, condition grading, and maintenance cycles.',
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
    <div className="bg-[#060A14] text-white min-h-screen flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC HERO (85svh)                                                 */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85svh] lg:min-h-[88svh] flex items-center justify-center bg-[#060A14] overflow-hidden pt-28 pb-16 sm:py-24 border-b border-brand-edge-dark">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/editorial/entirefm-client-review-2000w.webp"
              alt="EntireFM Document Vault — Operational Templates & Logbooks"
              fill
              priority
              className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-[1.1]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#060A14]/80 to-[#060A14]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060A14] via-[#060A14]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10 w-full">
            <div className="max-w-4xl space-y-6">
              
              <div className="mb-2">
                <Breadcrumbs items={breadcrumbs} className="text-slate-300 font-light text-xs" />
              </div>

              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  Free Operational Downloads
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extralight tracking-tight text-white leading-[1.06]">
                FM Document Vault: <br />
                <span className="font-light text-hero-pink">
                  Templates &amp; Logbooks.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-200 font-light leading-relaxed max-w-3xl">
                Ready-to-use CSV registers, statutory compliance log sheets, tender briefs, and contractor induction checklists for commercial facilities managers and duty holders.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 font-light border-t border-white/15">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Instant Direct Download
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  No Email Wall Required
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  SFG20 &amp; ACOP L8 Formatted
                </span>
              </div>

            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. DOCUMENT REPOSITORY TABLE                                              */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white text-slate-900 border-b border-slate-200">
          <div className="container-custom space-y-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium block">
                  Document Repository
                </span>
                <h2 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                  Available Templates &amp; Logbooks
                </h2>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {['ALL', 'Registers & Schedules', 'Compliance Logbooks', 'Procurement & Operations'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-sm text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-pink text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Templates' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-8 rounded-sm border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-6 shadow-sm hover:border-brand-pink transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <span className="px-2.5 py-1 rounded-sm bg-white border border-slate-200 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        {doc.category}
                      </span>
                      <span className="text-xs font-medium text-brand-pink uppercase tracking-wider">
                        {doc.format} Format
                      </span>
                    </div>

                    <h3 className="text-2xl font-light text-slate-900 leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-sm text-slate-600 font-light leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-2 bg-brand-pink hover:bg-brand-pink/90 text-white text-xs uppercase tracking-widest font-medium py-3 px-5 rounded-sm transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {doc.format}</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-light truncate max-w-[160px]">
                      {doc.filename}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        <NewsletterSignupSection />
        <ProposalSection />
      </main>

      <Footer />
    </div>
  );
}
