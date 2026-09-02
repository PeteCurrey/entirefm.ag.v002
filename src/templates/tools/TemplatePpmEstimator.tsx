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
  Sliders,
  CheckCircle2,
  BadgePoundSterling,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
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

  // Calculation logic (100% preserved)
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="PPM Cost Estimator"
          purpose="Model indicative planned preventative maintenance expenditure ranges based on commercial estate footprint, sector complexity, and service intensity."
          timeEstimate="2 min"
          outputs={['PDF Budget Specification']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 7 Columns: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-electric" />
                    <span className="text-[11px] tracking-widest text-slate-500 uppercase font-light">
                      01 / Estate Parameters
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extralight text-slate-900 mt-1">
                    Property &amp; Scope Specification
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Configure your building parameters to calculate an indicative SFG20 maintenance budget projection.
                  </p>
                </div>

                {/* Sector Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block">
                    Property Sector / Building Type
                  </label>
                  <select
                    value={sectorKey}
                    onChange={(e) => setSectorKey(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-sm text-sm text-slate-900 font-normal focus:bg-white focus:border-brand-electric focus:ring-1 focus:ring-brand-electric transition-colors"
                  >
                    {Object.entries(SECTORS).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Floor Area Slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Gross Internal Floor Area
                    </label>
                    <span className="text-sm font-normal text-brand-electric bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <div className="flex justify-between text-[11px] font-normal text-slate-600">
                    <span>5,000 sq ft</span>
                    <span>100,000 sq ft</span>
                    <span>200,000+ sq ft</span>
                  </div>
                </div>

                {/* Scope Level Toggle */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block">
                    Service Scope Intensity
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'compliance', label: 'Statutory Only', desc: 'Mandatory duties only' },
                      { key: 'hard_fm', label: 'Full Hard FM', desc: 'Statutory + SFG20 plant care' },
                      { key: 'total_fm', label: 'Total FM Care', desc: 'Hard FM + 24/7 helpdesk' },
                    ].map((s) => {
                      const isActive = serviceScope === s.key;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setServiceScope(s.key as any)}
                          className={`p-3.5 rounded-sm border text-left transition-all ${
                            isActive
                              ? 'border-brand-electric bg-blue-50/60 ring-1 ring-brand-electric text-slate-900'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className={`font-normal text-xs block ${isActive ? 'text-brand-electric' : 'text-slate-900'}`}>
                            {s.label}
                          </span>
                          <span className="text-[11px] text-slate-600 block mt-0.5">
                            {s.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plant Age */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-normal text-slate-800 uppercase tracking-wider block">
                    Plant &amp; Primary Asset Age Profile
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'new', label: '0–3 Years', desc: 'Modern under warranty' },
                      { key: 'mid', label: '4–10 Years', desc: 'Established plant' },
                      { key: 'aged', label: '10+ Years', desc: 'Legacy aged systems' },
                    ].map((a) => {
                      const isActive = plantAge === a.key;
                      return (
                        <button
                          key={a.key}
                          type="button"
                          onClick={() => setPlantAge(a.key as any)}
                          className={`p-3.5 rounded-sm border text-left transition-all ${
                            isActive
                              ? 'border-brand-electric bg-blue-50/60 ring-1 ring-brand-electric text-slate-900'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className={`font-normal text-xs block ${isActive ? 'text-brand-electric' : 'text-slate-900'}`}>
                            {a.label}
                          </span>
                          <span className="text-[11px] text-slate-600 block mt-0.5">
                            {a.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Columns: Budget Projection Output */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="bg-white border border-slate-200 rounded-sm shadow-md p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                    02 / Indicative Budget Model
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Live Estimate
                  </span>
                </div>

                {/* Primary Metric Banner */}
                <div className="rounded-sm bg-[#0B1220] p-6 text-white space-y-2 relative overflow-hidden shadow-sm">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(ellipse at 80% 0%, rgba(37, 99, 235, 0.6), transparent 70%)`,
                    }}
                  />
                  <span className="text-[11px] font-normal uppercase tracking-wider text-slate-300 block">
                    Estimated Annual PPM Range
                  </span>
                  <p className="text-2xl sm:text-3xl font-light text-white tracking-tight tabular-nums">
                    £{estimate.lowerBound.toLocaleString()} – £{estimate.upperBound.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-300">
                    <span>Target Rate:</span>
                    <strong className="text-white font-normal text-sm">£{estimate.ratePerSqFt} / sq ft</strong>
                  </div>
                </div>

                {/* Trade Cost Breakdown Table */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                    Indicative Trade Allocation
                  </h3>
                  <div className="border border-slate-200 rounded-sm bg-slate-50/50 divide-y divide-slate-200 text-xs">
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">HVAC &amp; Mechanical (38%)</span>
                      <strong className="text-slate-900 font-light">£{estimate.breakdown.hvac.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">Electrical &amp; Lighting (22%)</span>
                      <strong className="text-slate-900 font-light">£{estimate.breakdown.electrical.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">Fire Safety &amp; Alarms (18%)</span>
                      <strong className="text-slate-900 font-light">£{estimate.breakdown.fireSafety.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">Water Hygiene &amp; LRA (12%)</span>
                      <strong className="text-slate-900 font-light">£{estimate.breakdown.waterHygiene.toLocaleString()}</strong>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">Fabric &amp; Drainage (10%)</span>
                      <strong className="text-slate-900 font-light">£{estimate.breakdown.otherFabric.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="PPM Cost Estimator"
                  onDownloadPdf={handleDownloadPdf}
                  pdfLabel="Download PDF Specification"
                />
              </div>
            </div>
          </div>

          <ToolConversionCTA
            toolName="PPM Cost Estimator"
            heading="Require a formal competitive PPM tender proposal?"
            subheading="EntireFM delivers transparent fixed-price Planned Preventative Maintenance proposals tailored to your property asset register and SFG20 maintenance regimes."
            primaryActionLabel="Request Formal Tender Proposal"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </div>
      <Footer />
    </div>
  );
}
