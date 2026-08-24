'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Download,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Building2,
  CheckSquare,
  Square,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { WizardProgress } from '@/components/tools/WizardProgress';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import type { TemplateProps } from '../types';

const WIZARD_STEPS = [
  { id: 1, title: '01 Parameters', subtitle: 'Scope & SLA Specification' },
  { id: 2, title: '02 Tender Document', subtitle: 'Interactive RFP Preview' },
];

export function TemplateTenderBrief({ route, content }: TemplateProps) {
  // Form State
  const [orgName, setOrgName] = useState('Acme Commercial Properties');
  const [sector, setSector] = useState('Commercial Multi-Tenant Offices');
  const [siteCount, setSiteCount] = useState('3 Sites');
  const [totalSqFt, setTotalSqFt] = useState('65,000 sq ft');
  const [locations, setLocations] = useState('London, Manchester & Leeds');
  const [contractTerm, setContractTerm] = useState('3 Years (36 Months)');
  const [targetStartDate, setTargetStartDate] = useState('Q4 2026');

  // Service Scopes Selected
  const [services, setServices] = useState<string[]>([
    'Mechanical & Electrical (M&E) Maintenance',
    'HVAC, Chiller & Air Conditioning Servicing',
    'Statutory Compliance Testing (EICR, Fire, Gas, Water)',
    '24/7/365 Emergency Reactive Helpdesk Cover',
    'CAFM & Digital Portal Asset Tracking',
  ]);

  const [slaTarget, setSlaTarget] = useState('2-hour emergency response / 24-hour routine');
  const [painPoints, setPainPoints] = useState('Uncoordinated subcontractors, fragmented compliance records, and lack of real-time CAFM reporting.');
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'Tender Brief Generator', url: '/tools/tender-brief' },
  ];

  const ALL_SERVICE_OPTIONS = [
    'Mechanical & Electrical (M&E) Maintenance',
    'Planned Preventative Maintenance (PPM)',
    'HVAC, Chiller & Air Conditioning Servicing',
    'Statutory Compliance Testing (EICR, Fire, Gas, Water)',
    'Commercial Gas & Boiler Plant Servicing',
    'Emergency Lighting & Fire Alarm Testing',
    'Commercial Office & Daily Contract Cleaning',
    'Industrial & High-Level Cleaning',
    'Manned Security & Access Control Maintenance',
    'Grounds Maintenance & External Landscaping',
    '24/7/365 Emergency Reactive Helpdesk Cover',
    'CAFM & Digital Portal Asset Tracking',
  ];

  const toggleService = (srv: string) => {
    if (services.includes(srv)) {
      setServices(services.filter((s) => s !== srv));
    } else {
      setServices([...services, srv]);
    }
  };

  const tenderDocumentText = `# FACILITIES MANAGEMENT (FM) PROCUREMENT SPECIFICATION BRIEF

## 1. EXECUTIVE SUMMARY & ORGANISATION
* **Client Organisation:** ${orgName}
* **Property Sector:** ${sector}
* **Portfolio Scope:** ${siteCount} across ${locations}
* **Total Floor Area:** ${totalSqFt}
* **Target Commencement:** ${targetStartDate}
* **Proposed Contract Duration:** ${contractTerm}

---

## 2. SCOPE OF REQUIRED SERVICES
The appointed facilities management partner will be responsible for delivering the following agreed service lines under a single coordinated framework:

${services.map((s, idx) => `${idx + 1}. **${s}**`).join('\n')}

---

## 3. STATUTORY COMPLIANCE & ASSET GOVERNANCE
1. **Statutory Standards:** All mechanical, electrical, and life-safety systems must be maintained in strict accordance with UK statutory legislation (Health and Safety at Work Act 1974, RRO 2005, Electricity at Work Regulations 1989, ACOP L8, and LOLER 1998).
2. **Digital Record-Keeping:** Contemporaneous digital records, inspection logbooks, and statutory certificates must be uploaded to a centralised CAFM client portal within 48 hours of service execution.
3. **Asset Survey & Verification:** The contractor will conduct a comprehensive physical asset survey during mobilisation to benchmark plant condition and compile an authoritative asset register.

---

## 4. SERVICE LEVEL AGREEMENTS (SLAs) & HELPDESK
* **Emergency Response Requirement:** ${slaTarget}
* **Helpdesk Availability:** 24/7/365 dedicated desk with direct engineer dispatch and escalation protocols.
* **Account Management:** Designated named Contract Manager with monthly performance reviews and SLA tracking.

---

## 5. COMMERCIAL OBJECTIVES & CURRENT PAIN POINTS
* **Key Procurement Objectives:** Consolidated accountability, transparent fixed-schedule pricing, improved compliance auditing, and proactive lifecycle asset care.
* **Addressed Challenges:** ${painPoints}

---
*Generated via EntireFM Intelligence Toolkit · Technical FM Procurement Framework*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tenderDocumentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([tenderDocumentText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FM_Tender_Brief_${orgName.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'Facilities Management Tender & RFP Specification Brief',
      subtitle: `Procurement output specification and governance framework for ${orgName}.`,
      documentRef: `EFM-RFP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      organisationName: orgName,
      badgeText: 'Procurement Specification',
      summaryStats: [
        { label: 'Client', value: orgName },
        { label: 'Estate Scope', value: siteCount, detail: locations },
        { label: 'Services', value: `${services.length} Lines` },
        { label: 'Target Term', value: contractTerm },
      ],
      sections: [
        {
          type: 'cards',
          heading: '1. Executive Procurement Summary',
          items: [
            {
              title: 'Estate Profile & Commencement',
              body: `Sector: ${sector} | Floor Area: ${totalSqFt} | Term: ${contractTerm} | Target Start: ${targetStartDate}`,
            },
            {
              title: 'Primary Commercial Objectives',
              body: painPoints,
            },
          ],
        },
        {
          type: 'table',
          heading: '2. Scope of Tendered Service Lines',
          columns: [
            { header: 'Item', widthPercent: 12, align: 'center' },
            { header: 'Tendered Service Discipline', widthPercent: 88 },
          ],
          rows: services.map((s, idx) => [`0${idx + 1}`, s]),
        },
        {
          type: 'cards',
          heading: '3. Compliance Governance & SLA Targets',
          items: [
            {
              title: 'Statutory Assurance Duty',
              body: 'Contractor must maintain all mechanical, electrical, and life safety plant in full compliance with UK statutory requirements (RRO 2005, EAWR 1989, ACOP L8, LOLER 1998) with digital certificate upload inside 48 hours.',
            },
            {
              title: 'Service Level Agreement (SLA)',
              body: `Contractual response requirement: ${slaTarget}. 24/7/365 helpdesk dispatch and monthly KPI reviews.`,
            },
          ],
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
          title="FM Tender Brief Generator"
          purpose="Structure a comprehensive Facilities Management output specification and RFP brief ready for tender issuance."
          timeEstimate="3–5 min"
          outputs={['PDF Specification', 'Markdown Brief']}
          icon={FileText}
        >
          {/* Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={generated ? 1 : 0}
            onSelectStep={(idx) => {
              if (idx === 0 && generated) {
                setGenerated(false);
              }
            }}
          />

          <div className="max-w-6xl mx-auto space-y-8">
            {!generated ? (
              /* Configuration Workspace */
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-8">
                <div className="border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                    01 Tender Requirements
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Contract Parameters &amp; Service Scope
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Define portfolio size, required FM disciplines, and service level targets to generate a tender specification document.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Client / Organisation Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Property Sector
                    </label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Portfolio Sites &amp; Locations
                    </label>
                    <input
                      type="text"
                      value={locations}
                      onChange={(e) => setLocations(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Approximate Total Floor Area
                    </label>
                    <input
                      type="text"
                      value={totalSqFt}
                      onChange={(e) => setTotalSqFt(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Target Contract Duration
                    </label>
                    <input
                      type="text"
                      value={contractTerm}
                      onChange={(e) => setContractTerm(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Target Commencement Date
                    </label>
                    <input
                      type="text"
                      value={targetStartDate}
                      onChange={(e) => setTargetStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>
                </div>

                {/* Service Scope Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Tendered Service Disciplines ({services.length} Selected)
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ALL_SERVICE_OPTIONS.map((srv) => {
                      const isSelected = services.includes(srv);
                      return (
                        <div
                          key={srv}
                          onClick={() => toggleService(srv)}
                          className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2.5 transition-all ${
                            isSelected
                              ? 'border-[#FF3E9D] bg-[#FF3E9D]/10 text-white ring-1 ring-[#FF3E9D]/30'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              isSelected ? 'bg-[#FF3E9D] border-[#FF3E9D] text-white' : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{srv}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SLAs & Objectives */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      SLA Response Target
                    </label>
                    <input
                      type="text"
                      value={slaTarget}
                      onChange={(e) => setSlaTarget(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Primary Challenges to Rectify
                    </label>
                    <input
                      type="text"
                      value={painPoints}
                      onChange={(e) => setPainPoints(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <span className="text-xs text-slate-500 font-mono">
                    Zero lead gating · Immediate document export.
                  </span>
                  <button
                    type="button"
                    onClick={() => setGenerated(true)}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Tender Brief</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Generated Document Workspace Preview */
              <div className="space-y-8">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                        Procurement Output Specification
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {orgName} — FM Tender Brief
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Scope: <strong>{services.length} Service Lines</strong> · Portfolio: <strong>{siteCount}</strong> ({locations})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGenerated(false)}
                        className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                      >
                        ← Edit Parameters
                      </button>
                    </div>
                  </div>

                  {/* Document Action Toolbar */}
                  <ExportToolbar
                    toolName="FM Tender Brief Generator"
                    onDownloadPdf={handleDownloadPdf}
                    onDownloadMarkdown={handleDownloadMarkdown}
                    onCopyContent={handleCopy}
                    isCopied={copied}
                    pdfLabel="Download Specification (PDF)"
                    markdownLabel="Download Markdown (.md)"
                    copyLabel={copied ? 'Copied Specification!' : 'Copy to Clipboard'}
                  />
                </div>

                {/* Professional Document Preview Shell */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 font-mono text-xs sm:text-sm leading-relaxed text-slate-300 overflow-x-auto">
                  <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">
                      DOCUMENT PREVIEW // OUTPUT SPECIFICATION
                    </span>
                    <span className="text-[10px] text-[#FF3E9D] font-bold">
                      VERIFIED EFM-RFP-SPEC
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-200">
                    {tenderDocumentText}
                  </pre>
                </div>

                {/* Next Steps CTA */}
                <ToolConversionCTA
                  toolName="FM Tender Brief Generator"
                  heading="Invite EntireFM to submit a tender proposal"
                  subheading="EntireFM delivers consolidated national Hard & Soft FM contracts with fixed SLAs and real-time EntireCAFM compliance tracking."
                  primaryActionLabel="Submit Tender Invitation"
                  primaryActionHref="/contact-us#enquiry"
                />
              </div>
            )}
          </div>
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
