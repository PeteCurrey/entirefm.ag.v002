'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Building2,
  CheckSquare,
  Square,
  ShieldCheck,
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
    { name: 'Tender / RFP Brief Generator', url: '/tools/tender-brief' },
  ];

  const ALL_SERVICES = [
    'Mechanical & Electrical (M&E) Maintenance',
    'HVAC, Chiller & Air Conditioning Servicing',
    'Statutory Compliance Testing (EICR, Fire, Gas, Water)',
    'Commercial Gas & Boiler Plant Maintenance',
    'Fire Safety, Detection & Emergency Lighting',
    'Water Hygiene, Legionella Monitoring & LRA',
    'Lifting & Vertical Transport Management',
    'Building Fabric, Roofing & Glazing Repairs',
    '24/7/365 Emergency Reactive Helpdesk Cover',
    'CAFM & Digital Portal Asset Tracking',
    'Grounds Maintenance & External Landscaping',
    'Specialist Commercial & Industrial Cleaning',
  ];

  const toggleService = (srv: string) => {
    setServices((prev) => (prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]));
  };

  const tenderMarkdown = `
# INVITATION TO TENDER (ITT) / REQUEST FOR PROPOSAL (RFP)
## Facilities Management & Maintenance Services Specification

**Client Organisation:** ${orgName}
**Property Sector:** ${sector}
**Portfolio Scale:** ${siteCount} (${totalSqFt})
**Locations:** ${locations}
**Contract Duration:** ${contractTerm}
**Target Mobilisation Date:** ${targetStartDate}

---

### 1. Executive Summary & Objective
${orgName} invites formal proposals from established Facilities Management providers to deliver high-quality, fully compliant maintenance and technical management services across our commercial property portfolio.

**Primary Objectives:**
- Establish single-point accountability for statutory compliance.
- Modernise digital reporting via live CAFM systems.
- Address current contract pain points: "${painPoints}".

---

### 2. Required Scope of Services
The appointed contractor shall be responsible for delivering:
${services.map((s, i) => `${i + 1}. **${s}**`).join('\n')}

---

### 3. Service Level Agreement (SLA) & Response Requirements
- **Emergency Breakdown Response:** ${slaTarget}
- **Statutory Logbook Delivery:** 100% cloud-accessible digital compliance certification within 48 hours of visit.
- **Helpdesk Operations:** 24/7 UK-based call answering and ticket tracking.

---

### 4. Submission & Contact Guidelines
Proposals should include company accreditations (ISO 9001/14001/45001, SafeContractor, BESA), sample SFG20 asset schedules, and a transparent fixed annual fee structure.
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(tenderMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'Facilities Management Tender Specification & Brief',
      subtitle: `RFP document for ${orgName} (${sector}).`,
      documentRef: `EFM-RFP-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      badgeText: 'Technical Tender Brief',
      summaryStats: [
        { label: 'Client Organisation', value: orgName },
        { label: 'Estate Scale', value: `${siteCount} (${totalSqFt})` },
        { label: 'Term & Term Date', value: `${contractTerm} · ${targetStartDate}` },
        { label: 'Service Scope', value: `${services.length} Core Regimes` },
      ],
      sections: [
        {
          type: 'text',
          heading: '1. Executive Context & Contract Objectives',
          paragraphs: [
            `Client: ${orgName} (${sector}).`,
            `Locations: ${locations}.`,
            `Current Operational Objective: Address pain points: "${painPoints}".`,
          ],
        },
        {
          type: 'table',
          heading: '2. Required Scope of Maintenance Disciplines',
          columns: [
            { header: 'No.', widthPercent: 10, align: 'center' },
            { header: 'Service Discipline & Requirements', widthPercent: 90 },
          ],
          rows: services.map((s, i) => [i + 1, s]),
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
          title="Tender / RFP Brief Generator"
          purpose="Generate structured Facilities Management tender briefs and RFP scopes for contractor procurement."
          timeEstimate="3 min"
          outputs={['PDF Tender Document', 'Markdown RFP']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                  01 / Contract Scope
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Procurement Specifications
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Define your estate parameters to automatically build a procurement-ready ITT.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Client Organisation Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0c1527] border border-slate-700 rounded-[2px] text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      Property Sector
                    </label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0c1527] border border-slate-700 rounded-[2px] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      Total Floor Area
                    </label>
                    <input
                      type="text"
                      value={totalSqFt}
                      onChange={(e) => setTotalSqFt(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0c1527] border border-slate-700 rounded-[2px] text-xs text-white"
                    />
                  </div>
                </div>

                {/* Services Checkboxes */}
                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-2">
                    Scope of Services Required ({services.length} Selected)
                  </label>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin border border-slate-800 p-2.5 bg-[#09101f] rounded-[3px]">
                    {ALL_SERVICES.map((srv) => {
                      const isChecked = services.includes(srv);
                      return (
                        <div
                          key={srv}
                          onClick={() => toggleService(srv)}
                          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer py-1"
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center ${
                              isChecked ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                          </div>
                          <span>{srv}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Current Challenges / Pain Points
                  </label>
                  <textarea
                    rows={2}
                    value={painPoints}
                    onChange={(e) => setPainPoints(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0c1527] border border-slate-700 rounded-[2px] text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Column (6 cols) */}
            <div className="lg:col-span-6 border border-slate-800 bg-[#09101f] p-6 rounded-[4px] space-y-4 sticky top-36">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest">
                  02 / Tender Document Preview
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Live Markdown</span>
              </div>

              <div className="p-4 border border-slate-800 bg-[#0c1527] text-slate-300 font-mono text-xs max-h-[380px] overflow-y-auto whitespace-pre-wrap leading-relaxed rounded-[2px] scrollbar-thin">
                {tenderMarkdown}
              </div>

              {/* Export Toolbar */}
              <ExportToolbar
                toolName="Tender / RFP Brief Generator"
                onDownloadPdf={handleDownloadPdf}
                onCopyContent={handleCopy}
                isCopied={copied}
                pdfLabel="Download RFP (PDF)"
                copyLabel="Copy Markdown RFP"
              />
            </div>
          </div>

          <ToolConversionCTA
            toolName="Tender / RFP Brief Generator"
            heading="Submit your RFP specification to EntireFM?"
            subheading="EntireFM responds to commercial FM tenders with fully transparent asset pricing, dedicated Account Managers, and guaranteed CAFM integration."
            primaryActionLabel="Submit Tender Brief"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
