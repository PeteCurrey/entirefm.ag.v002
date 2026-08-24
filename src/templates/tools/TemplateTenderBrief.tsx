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
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ToolHero } from '@/components/resources/ToolHero';
import { StepProgress } from '@/components/resources/StepProgress';
import { ResultsConversionBridge } from '@/components/resources/ResultsConversionBridge';
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
  const [generated, setGenerated] = useState(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
    { name: 'FM Tender Brief Generator', url: '/tools/tender-brief' },
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
* **Identified Estate Challenges:** ${painPoints}

---

## 6. PROPOSAL SUBMISSION REQUIREMENTS
Prospective tenderers should provide:
1. Schedule of rates and annual fixed-fee PPM breakdown.
2. Mobilisation methodology and asset onboarding timeline.
3. Relevant commercial references across comparable property estates.
4. Health & safety accreditations (SafeContractor, BESA, Gas Safe, NICEIC or equivalent).`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tenderDocumentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([tenderDocumentText], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `FM_Tender_Brief_${orgName.replace(/\s+/g, '_')}_2026.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        <ToolHero
          breadcrumbs={breadcrumbs}
          eyebrow="Procurement Specification Tool"
          title="FM Tender Brief Generator"
          description="Generate a professional, structured Facilities Management tender brief and RFP specification to issue to prospective maintenance contractors."
          timeEstimate="~4 minutes"
          deliverables={[
            'Structured 7-section FM RFP specification document',
            'Full service scope definition and SLA framework',
            'Statutory compliance & KPI governance clauses',
            'Direct Markdown (.md) and text download',
            'One-click clipboard copy for tender packs',
          ]}
          accent="amber"
          icon={FileText}
        />

        {/* Tender Form Section */}
        <section className="py-14 bg-brand-carbon">
          <div className="container-custom max-w-5xl">
            {!generated ? (
              <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-10 space-y-8">
                <div className="border-b border-brand-edge-dark pb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Step 1: Define Your Estate & Contract Requirements
                  </h2>
                  <p className="text-xs text-brand-mist/60 mt-0.5">
                    Fill out the key procurement parameters below to build your RFP specification.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Organisation / Client Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Estate / Sector Type
                    </label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Number of Sites & Approximate Floor Area
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={siteCount}
                        onChange={(e) => setSiteCount(e.target.value)}
                        placeholder="e.g. 3 Sites"
                        className="h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={totalSqFt}
                        onChange={(e) => setTotalSqFt(e.target.value)}
                        placeholder="e.g. 50,000 sq ft"
                        className="h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Geographic Locations / Regions
                    </label>
                    <input
                      type="text"
                      value={locations}
                      onChange={(e) => setLocations(e.target.value)}
                      className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Proposed Contract Term
                    </label>
                    <input
                      type="text"
                      value={contractTerm}
                      onChange={(e) => setContractTerm(e.target.value)}
                      className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Target Mobilisation / Start Window
                    </label>
                    <input
                      type="text"
                      value={targetStartDate}
                      onChange={(e) => setTargetStartDate(e.target.value)}
                      className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Service scope selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-3">
                    Select Required Service Lines for Tender Scope ({services.length} selected)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ALL_SERVICE_OPTIONS.map((srv) => {
                      const active = services.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => toggleService(srv)}
                          className={`flex items-center gap-2.5 p-3 rounded-sm border text-xs text-left transition-all ${
                            active
                              ? 'border-brand-electric-bright bg-brand-electric/15 text-white font-medium'
                              : 'border-brand-edge-dark bg-white/[0.02] text-brand-mist/50 hover:bg-white/[0.04]'
                          }`}
                        >
                          {active ? (
                            <CheckSquare className="h-4 w-4 text-brand-electric-bright shrink-0" />
                          ) : (
                            <Square className="h-4 w-4 text-brand-mist/30 shrink-0" />
                          )}
                          <span className="truncate">{srv}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SLA and Pain Points */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Required SLA / Emergency Response
                    </label>
                    <input
                      type="text"
                      value={slaTarget}
                      onChange={(e) => setSlaTarget(e.target.value)}
                      className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-mist/70 mb-2">
                      Primary Challenges / Pain Points to Solve
                    </label>
                    <input
                      type="text"
                      value={painPoints}
                      onChange={(e) => setPainPoints(e.target.value)}
                      className="w-full h-10 rounded-sm border border-brand-edge-dark bg-brand-carbon px-3 text-xs text-white focus:border-brand-electric/80 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4 border-t border-brand-edge-dark flex justify-end">
                  <button
                    type="button"
                    onClick={() => setGenerated(true)}
                    className="btn-primary py-2.5 px-5 text-xs"
                  >
                    Generate Tender Brief
                    <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                  </button>
                </div>
              </div>
            ) : (
              /* Generated Output View */
              <div className="space-y-6">
                <div className="rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 shadow-elevated">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-edge-dark pb-6 mb-6">
                    <div>
                      <span className="eyebrow eyebrow-dark">Document Ready</span>
                      <h2 className="mt-1 text-2xl font-bold text-white">
                        FM Tender & RFP Specification
                      </h2>
                      <p className="text-xs text-brand-mist/60 mt-0.5">
                        Copy or download your formatted procurement brief below.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="btn-primary py-2 px-3 text-xs"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="btn-ghost-light py-2 px-3 text-xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download .MD
                      </button>
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="btn-ghost-light py-2 px-3 text-xs"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenerated(false)}
                        className="btn-ghost-light py-2 px-3 text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Edit Form
                      </button>
                    </div>
                  </div>

                  {/* Formatted Output Document */}
                  <div className="p-6 sm:p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark font-mono text-xs text-brand-mist/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {tenderDocumentText}
                  </div>
                </div>

                {/* Conversion Bridge */}
                <ResultsConversionBridge
                  headline="Include EntireFM in your tender procurement?"
                  body="Send this specification directly to our commercial estimating team for a transparent, asset-surveyed contract proposal based on your exact building profile."
                  ctaPrimary={{ label: 'Submit RFP to EntireFM', href: '/contact-us' }}
                  ctaSecondary={{ label: 'Speak to our procurement lead', href: '/contact-us' }}
                  accent="amber"
                />
              </div>
            )}
          </div>
        </section>

        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
