'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  Printer,
  RotateCcw,
  Building2,
  Layers,
  Sparkles,
  Info,
  TrendingUp,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { WizardProgress } from '@/components/tools/WizardProgress';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import type { TemplateProps } from '../types';

interface SectorMultiplier {
  name: string;
  baseRateSqFt: number; // Base annual PPM rate £/sq ft
  complexityFactor: number;
}

const SECTORS: Record<string, SectorMultiplier> = {
  office: { name: 'Commercial Office / Corporate HQ', baseRateSqFt: 1.45, complexityFactor: 1.0 },
  industrial: { name: 'Industrial & Manufacturing Facility', baseRateSqFt: 1.85, complexityFactor: 1.25 },
  logistics: { name: 'Logistics & Distribution Warehousing', baseRateSqFt: 0.95, complexityFactor: 0.85 },
  retail: { name: 'Retail & Shopping Centres', baseRateSqFt: 1.65, complexityFactor: 1.15 },
  healthcare: { name: 'Healthcare & Clinical Environments', baseRateSqFt: 2.25, complexityFactor: 1.4 },
  hospitality: { name: 'Hotels & Hospitality Estates', baseRateSqFt: 1.75, complexityFactor: 1.2 },
  education: { name: 'Education & University Campuses', baseRateSqFt: 1.35, complexityFactor: 0.95 },
};

const WIZARD_STEPS = [
  { id: 1, title: '01 Parameters', subtitle: 'Estate & Scope' },
  { id: 2, title: '02 Budget Model', subtitle: 'Cost Allocation & PDF' },
];

export function TemplatePpmEstimator({ route, content }: TemplateProps) {
  const [sectorKey, setSectorKey] = useState<string>('office');
  const [floorArea, setFloorArea] = useState<number>(25000); // in sq ft
  const [siteCount, setSiteCount] = useState<number>(1);
  const [serviceScope, setServiceScope] = useState<'compliance' | 'hard_fm' | 'total_fm'>('hard_fm');
  const [plantAge, setPlantAge] = useState<'new' | 'mid' | 'aged'>('mid');

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'PPM Cost Estimator', url: '/tools/ppm-estimator' },
  ];

  // Calculation model
  const estimation = useMemo(() => {
    const sector = SECTORS[sectorKey] || SECTORS.office;
    let baseRate = sector.baseRateSqFt;

    // Scope adjustment
    if (serviceScope === 'compliance') {
      baseRate = baseRate * 0.45; // Compliance testing only
    } else if (serviceScope === 'total_fm') {
      baseRate = baseRate * 1.85; // Hard + Soft FM combined
    }

    // Plant age adjustment
    let ageMultiplier = 1.0;
    if (plantAge === 'new') ageMultiplier = 0.88;
    if (plantAge === 'aged') ageMultiplier = 1.25;

    // Multi-site efficiency factor
    let siteMultiplier = 1.0;
    if (siteCount > 1) {
      siteMultiplier = 1 - Math.min(siteCount * 0.02, 0.15); // Up to 15% multi-site volume efficiency
    }

    const calculatedAnnualTotal = floorArea * siteCount * baseRate * ageMultiplier * siteMultiplier;
    const lowerBound = Math.round(calculatedAnnualTotal * 0.88);
    const upperBound = Math.round(calculatedAnnualTotal * 1.14);

    const costPerSqFtLow = (lowerBound / (floorArea * siteCount)).toFixed(2);
    const costPerSqFtHigh = (upperBound / (floorArea * siteCount)).toFixed(2);

    return {
      lowerBound,
      upperBound,
      costPerSqFtLow,
      costPerSqFtHigh,
      hardFmSplit: Math.round(calculatedAnnualTotal * 0.52),
      statutorySplit: Math.round(calculatedAnnualTotal * 0.28),
      managementCafmSplit: Math.round(calculatedAnnualTotal * 0.12),
      consumablesSplit: Math.round(calculatedAnnualTotal * 0.08),
    };
  }, [sectorKey, floorArea, siteCount, serviceScope, plantAge]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="PPM Cost Estimator"
          purpose="Model indicative annual planned maintenance budgets based on building square footage, sector complexity, and servicing scope."
          timeEstimate="2 min"
          outputs={['PDF Budget Estimate']}
          icon={Calculator}
        >
          {/* Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={0}
          />

          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Input Form Column (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                    01 Building Scope
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Estate &amp; Operational Inputs
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Adjust the parameters below to calibrate indicative budget ranges for your building portfolio.
                  </p>
                </div>

                {/* Sector Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Property Sector
                  </label>
                  <select
                    value={sectorKey}
                    onChange={(e) => setSectorKey(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-[#FF3E9D]"
                  >
                    {Object.entries(SECTORS).map(([key, s]) => (
                      <option key={key} value={key}>
                        {s.name} (Base Factor {s.complexityFactor}x)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Floor Area Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Total Floor Area (Gross Internal Area)
                    </label>
                    <span className="font-mono text-sm font-bold text-[#FF3E9D]">
                      {floorArea.toLocaleString()} sq ft
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="250000"
                    step="5000"
                    value={floorArea}
                    onChange={(e) => setFloorArea(Number(e.target.value))}
                    className="w-full accent-[#FF3E9D] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>5,000 sq ft</span>
                    <span>100,000 sq ft</span>
                    <span>250,000 sq ft</span>
                  </div>
                </div>

                {/* Site Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Number of Sites / Buildings
                    </label>
                    <span className="font-mono text-sm font-bold text-white">
                      {siteCount} {siteCount === 1 ? 'Site' : 'Sites'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={siteCount}
                    onChange={(e) => setSiteCount(Number(e.target.value))}
                    className="w-full accent-[#FF3E9D] cursor-pointer"
                  />
                </div>

                {/* Service Scope Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Maintenance Scope Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'compliance', label: 'Statutory Only', desc: 'Core life-safety, gas, water & EICR' },
                      { key: 'hard_fm', label: 'Hard FM (PPM)', desc: 'Statutory + full mechanical & electrical' },
                      { key: 'total_fm', label: 'Total FM Package', desc: 'Hard FM + cleaning & grounds care' },
                    ].map((scope) => (
                      <button
                        key={scope.key}
                        type="button"
                        onClick={() => setServiceScope(scope.key as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          serviceScope === scope.key
                            ? 'border-[#FF3E9D] bg-[#FF3E9D]/10 ring-1 ring-[#FF3E9D]/30'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className={`text-xs font-bold ${serviceScope === scope.key ? 'text-[#FF3E9D]' : 'text-white'}`}>
                          {scope.label}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{scope.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plant Age Condition */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Equipment / Plant Age Profile
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'new', label: '0–3 Years', sub: 'Modern / Under OEM warranty' },
                      { key: 'mid', label: '4–10 Years', sub: 'Established / Regular wear' },
                      { key: 'aged', label: '10+ Years', sub: 'Aged / Increased intervention' },
                    ].map((age) => (
                      <button
                        key={age.key}
                        type="button"
                        onClick={() => setPlantAge(age.key as any)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          plantAge === age.key
                            ? 'border-[#FF3E9D] bg-[#FF3E9D]/10 ring-1 ring-[#FF3E9D]/30'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                        }`}
                      >
                        <div className={`text-xs font-bold ${plantAge === age.key ? 'text-[#FF3E9D]' : 'text-white'}`}>
                          {age.label}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{age.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimate Output Column (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 sticky top-36">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#FF3E9D] uppercase tracking-wider">
                    02 Indicative Cost Model
                  </span>
                  <div className="mt-3 p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                      Estimated Annual PPM Budget Range
                    </span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                      £{estimation.lowerBound.toLocaleString()} – £{estimation.upperBound.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      ~£{estimation.costPerSqFtLow} – £{estimation.costPerSqFtHigh} / sq ft / annum
                    </p>
                  </div>
                </div>

                {/* 4-Tier Breakdown */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Indicative Discipline Allocation
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-300">Mechanical &amp; Electrical (52%)</span>
                      <span className="font-mono font-bold text-white">~£{estimation.hardFmSplit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-300">Statutory &amp; Life Safety (28%)</span>
                      <span className="font-mono font-bold text-rose-400">~£{estimation.statutorySplit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-300">CAFM &amp; Governance (12%)</span>
                      <span className="font-mono font-bold text-blue-400">~£{estimation.managementCafmSplit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-300">Consumables &amp; Sundries (8%)</span>
                      <span className="font-mono font-bold text-slate-400">~£{estimation.consumablesSplit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="PPM Cost Estimator"
                  onDownloadPdf={() => {
                    const pdfDoc: PdfDocumentDefinition = {
                      title: 'Indicative PPM Budget Feasibility Estimate',
                      subtitle: 'Annual maintenance budget modelling based on commercial property parameters.',
                      documentRef: `EFM-EST-${Date.now().toString().slice(-6)}`,
                      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                      badgeText: 'Budget Feasibility',
                      summaryStats: [
                        { label: 'Floor Area', value: `${(floorArea * siteCount).toLocaleString()} sq ft` },
                        { label: 'Annual Range', value: `£${estimation.lowerBound.toLocaleString()} – £${estimation.upperBound.toLocaleString()}` },
                        { label: 'Cost / sq ft', value: `£${estimation.costPerSqFtLow} – £${estimation.costPerSqFtHigh}` },
                        { label: 'Scope', value: serviceScope === 'compliance' ? 'Statutory Only' : serviceScope === 'hard_fm' ? 'Hard FM' : 'Total FM' },
                      ],
                      sections: [
                        {
                          type: 'table',
                          heading: '1. Estimated Discipline Cost Allocation',
                          columns: [
                            { header: 'Discipline / Service Allocation', widthPercent: 50 },
                            { header: 'Percentage Split', widthPercent: 20, align: 'center' },
                            { header: 'Estimated Annual Cost', widthPercent: 30, align: 'right' },
                          ],
                          rows: [
                            ['Scheduled Mechanical & Electrical Maintenance Visits', '52%', `~£${estimation.hardFmSplit.toLocaleString()}`],
                            ['Statutory Life Safety, Water & Fixed Wire Testing', '28%', `~£${estimation.statutorySplit.toLocaleString()}`],
                            ['CAFM Portal, Helpdesk Management & Compliance Governance', '12%', `~£${estimation.managementCafmSplit.toLocaleString()}`],
                            ['Minor Consumables, Lubricants & Servicing Sundries', '8%', `~£${estimation.consumablesSplit.toLocaleString()}`],
                            ['<strong>Total Estimated Annual Maintenance Contract Value</strong>', '<strong>100%</strong>', `<strong>£${Math.round((estimation.lowerBound + estimation.upperBound) / 2).toLocaleString()}</strong>`],
                          ],
                        },
                      ],
                    };
                    downloadPdfReport(pdfDoc);
                  }}
                  pdfLabel="Download Budget Estimate (PDF)"
                />
              </div>
            </div>

            {/* Next Steps CTA */}
            <ToolConversionCTA
              toolName="PPM Cost Estimator"
              heading="Receive a firm fixed-price quotation for your estate"
              subheading="EntireFM conducts free on-site engineering discovery surveys to quote exact contract values across nationwide commercial properties."
              primaryActionLabel="Book Engineering Survey"
              primaryActionHref="/contact-us#enquiry"
            />
          </div>
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
