'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Building2,
  Layers,
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

  const sector = SECTORS[sectorKey] || SECTORS.office;

  // Calculation logic
  const estimate = useMemo(() => {
    const scopeMultiplier = serviceScope === 'compliance' ? 0.45 : serviceScope === 'hard_fm' ? 1.0 : 1.65;
    const ageMultiplier = plantAge === 'new' ? 0.85 : plantAge === 'mid' ? 1.0 : 1.3;
    const multiSiteDiscount = siteCount > 5 ? 0.88 : siteCount > 1 ? 0.94 : 1.0;

    const baseCost = floorArea * sector.baseRateSqFt * scopeMultiplier * ageMultiplier * siteCount * multiSiteDiscount;
    const lowerBound = Math.round(baseCost * 0.9);
    const upperBound = Math.round(baseCost * 1.15);
    const midPoint = Math.round((lowerBound + upperBound) / 2);

    // Indicative Category Allocation
    const hvac = Math.round(midPoint * 0.38);
    const electrical = Math.round(midPoint * 0.22);
    const fireSafety = Math.round(midPoint * 0.18);
    const waterHygiene = Math.round(midPoint * 0.12);
    const otherFabric = Math.round(midPoint * 0.10);

    return {
      lowerBound,
      upperBound,
      midPoint,
      ratePerSqFt: (midPoint / (floorArea * siteCount)).toFixed(2),
      breakdown: { hvac, electrical, fireSafety, waterHygiene, otherFabric },
    };
  }, [sector, floorArea, siteCount, serviceScope, plantAge]);

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'PPM Budget & Maintenance Cost Estimate',
      subtitle: `Indicative financial estimate for ${floorArea.toLocaleString()} sq ft (${sector.name}).`,
      documentRef: `EFM-EST-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      badgeText: 'PPM Financial Estimate',
      summaryStats: [
        { label: 'Estimated Budget Range', value: `£${estimate.lowerBound.toLocaleString()} – £${estimate.upperBound.toLocaleString()}` },
        { label: 'Mid-Point PPM', value: `£${estimate.midPoint.toLocaleString()} / yr` },
        { label: 'Rate per Sq Ft', value: `£${estimate.ratePerSqFt} / sq ft` },
      ],
      sections: [
        {
          type: 'table',
          heading: '1. Indicative Trade Cost Allocation',
          columns: [
            { header: 'Engineering Discipline', widthPercent: 50 },
            { header: 'Allocation %', widthPercent: 25, align: 'center' },
            { header: 'Estimated Annual Cost', widthPercent: 25, align: 'right' },
          ],
          rows: [
            ['HVAC, Air Conditioning & Mechanical Plant', '38%', `£${estimate.breakdown.hvac.toLocaleString()}`],
            ['Electrical Distribution, EICR & Lighting', '22%', `£${estimate.breakdown.electrical.toLocaleString()}`],
            ['Fire Detection, Alarms & Emergency Lighting', '18%', `£${estimate.breakdown.fireSafety.toLocaleString()}`],
            ['Water Hygiene, Legionella (LRA) & Testing', '12%', `£${estimate.breakdown.waterHygiene.toLocaleString()}`],
            ['Building Fabric, Roof & Access Maintenance', '10%', `£${estimate.breakdown.otherFabric.toLocaleString()}`],
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
          title="PPM Cost Estimator"
          purpose="Calculate indicative planned preventative maintenance budgets tailored to commercial estate size and sector."
          timeEstimate="2 min"
          outputs={['PDF Budget Specification']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* 7 Columns: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                  01 / Estate Parameters
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Property &amp; Scope Specification
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Configure building parameters to generate an accurate SFG20 budget projection.
                </p>
              </div>

              {/* Sector Selection */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Property Sector / Building Type
                </label>
                <select
                  value={sectorKey}
                  onChange={(e) => setSectorKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0c1527] border border-slate-700 rounded-[2px] text-xs text-white"
                >
                  {Object.entries(SECTORS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor Area Slider */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Floor Area (sq ft)
                  </label>
                  <span className="font-mono text-xs font-bold text-white">
                    {floorArea.toLocaleString()} sq ft
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={floorArea}
                  onChange={(e) => setFloorArea(Number(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>

              {/* Scope Level Toggle */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Service Scope Level
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'compliance', label: 'Statutory Only', desc: 'Mandatory duties only' },
                    { key: 'hard_fm', label: 'Full Hard FM', desc: 'Statutory + SFG20 plant care' },
                    { key: 'total_fm', label: 'Total FM', desc: 'Hard FM + 24/7 helpdesk' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setServiceScope(s.key as any)}
                      className={`p-2.5 rounded-[2px] border text-left transition-colors ${
                        serviceScope === s.key
                          ? 'border-slate-500 bg-[#0c1527] text-white'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold block">{s.label}</span>
                      <span className="text-[10px] text-slate-500 block">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plant Age */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Plant &amp; Asset Age Profile
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'new', label: '0–3 Years', desc: 'Modern under warranty' },
                    { key: 'mid', label: '4–10 Years', desc: 'Established plant' },
                    { key: 'aged', label: '10+ Years', desc: 'Legacy systems' },
                  ].map((a) => (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => setPlantAge(a.key as any)}
                      className={`p-2.5 rounded-[2px] border text-left transition-colors ${
                        plantAge === a.key
                          ? 'border-slate-500 bg-[#0c1527] text-white'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold block">{a.label}</span>
                      <span className="text-[10px] text-slate-500 block">{a.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 Columns: Budget Projection Output */}
            <div className="lg:col-span-5 border border-slate-800 bg-[#09101f] p-6 rounded-[4px] space-y-6 sticky top-36">
              <div>
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest">
                  02 / Indicative Budget
                </span>
                <div className="mt-3 p-4 border border-slate-800 bg-[#0c1527] space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                    Estimated Annual PPM Range
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                    £{estimate.lowerBound.toLocaleString()} – £{estimate.upperBound.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                    <span>Rate per sq ft:</span>
                    <strong className="text-white font-mono">£{estimate.ratePerSqFt} / sq ft</strong>
                  </div>
                </div>
              </div>

              {/* Trade Cost Breakdown Table */}
              <div className="space-y-2 text-xs">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Indicative Trade Allocation
                </h3>
                <div className="border border-slate-800 bg-[#0c1527] divide-y divide-slate-800/80">
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">HVAC &amp; Mechanical (38%)</span>
                    <strong className="text-white font-mono">£{estimate.breakdown.hvac.toLocaleString()}</strong>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Electrical &amp; Lighting (22%)</span>
                    <strong className="text-white font-mono">£{estimate.breakdown.electrical.toLocaleString()}</strong>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Fire Safety &amp; Alarms (18%)</span>
                    <strong className="text-white font-mono">£{estimate.breakdown.fireSafety.toLocaleString()}</strong>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Water Hygiene &amp; LRA (12%)</span>
                    <strong className="text-white font-mono">£{estimate.breakdown.waterHygiene.toLocaleString()}</strong>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Fabric &amp; Drainage (10%)</span>
                    <strong className="text-white font-mono">£{estimate.breakdown.otherFabric.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Export Toolbar */}
              <ExportToolbar
                toolName="PPM Cost Estimator"
                onDownloadPdf={handleDownloadPdf}
                pdfLabel="Download Budget Estimate (PDF)"
              />
            </div>
          </div>

          <ToolConversionCTA
            toolName="PPM Cost Estimator"
            heading="Require a formal competitive PPM tender?"
            subheading="EntireFM delivers transparent fixed-price Planned Preventative Maintenance proposals tailored to Uniclass asset registers."
            primaryActionLabel="Request Formal Tender Proposal"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
