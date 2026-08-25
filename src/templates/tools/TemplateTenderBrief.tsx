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
  Briefcase,
  FileCheck2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import type { TemplateProps } from '../types';

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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow pt-16">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="Tender / RFP Brief Generator"
          purpose="Configure procurement requirements to generate structured Facilities Management tender briefs and RFP specifications."
          timeEstimate="3 min"
          outputs={['PDF Tender Document', 'Markdown RFP']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-electric" />
                    <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-light">
                      01 / Contract Scope &amp; Parameters
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extralight text-slate-900 mt-1">
                    Procurement Specifications
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Define your estate parameters to automatically build a procurement-ready ITT.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-1.5">
                      Client Organisation Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-1.5">
                        Property Sector
                      </label>
                      <input
                        type="text"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-1.5">
                        Total Floor Area
                      </label>
                      <input
                        type="text"
                        value={totalSqFt}
                        onChange={(e) => setTotalSqFt(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-1.5">
                        Locations / Regions
                      </label>
                      <input
                        type="text"
                        value={locations}
                        onChange={(e) => setLocations(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-1.5">
                        Contract Term
                      </label>
                      <input
                        type="text"
                        value={contractTerm}
                        onChange={(e) => setContractTerm(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                      />
                    </div>
                  </div>

                  {/* Services Checkboxes */}
                  <div>
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-2">
                      Required Services Scope ({services.length} Selected)
                    </label>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin border border-slate-200 p-3 bg-slate-50 rounded-sm">
                      {ALL_SERVICES.map((srv) => {
                        const isChecked = services.includes(srv);
                        return (
                          <div
                            key={srv}
                            onClick={() => toggleService(srv)}
                            className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer py-1 select-none"
                          >
                            <div
                              className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-brand-electric border-brand-electric text-white' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={isChecked ? 'font-light text-slate-900' : 'text-slate-600'}>{srv}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block mb-1.5">
                      Current Contract Challenges / Pain Points
                    </label>
                    <textarea
                      rows={2}
                      value={painPoints}
                      onChange={(e) => setPainPoints(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6 sticky top-24">
              <div className="bg-white border border-slate-200 rounded-sm shadow-md p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                    02 / Tender Document Preview
                  </span>
                  <span className="text-[11px] font-mono font-light text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    Live Markdown Preview
                  </span>
                </div>

                <div className="p-5 bg-slate-900 text-slate-100 font-mono text-xs max-h-[400px] overflow-y-auto whitespace-pre-wrap leading-relaxed rounded-sm border border-slate-800 shadow-inner scrollbar-thin">
                  {tenderMarkdown}
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="Tender / RFP Brief Generator"
                  onDownloadPdf={handleDownloadPdf}
                  onCopyContent={handleCopy}
                  isCopied={copied}
                  pdfLabel="Download RFP Brief (PDF)"
                  copyLabel="Copy Markdown RFP"
                />
              </div>
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
      </div>
      <Footer />
    </div>
  );
}
