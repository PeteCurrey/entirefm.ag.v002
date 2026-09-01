'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  FileCheck,
  CheckCircle2,
  Building2,
  PiggyBank,
  BadgePercent,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { downloadPdfReport, PdfDocumentDefinition } from '@/lib/pdf/generator';
import type { TemplateProps } from '../types';

export function TemplateRoiCalculator({ route, content }: TemplateProps) {
  // Inputs
  const [reactiveSpend, setReactiveSpend] = useState<number>(45000); // £/year reactive callouts
  const [supplierCount, setSupplierCount] = useState<number>(5); // Number of independent FM contractors
  const [adminHoursPerMonth, setAdminHoursPerMonth] = useState<number>(20); // Hours/month managing FM/invoices
  const [hourlyAdminRate, setHourlyAdminRate] = useState<number>(35); // Internal rate £/hour
  const [unplannedOutages, setUnplannedOutages] = useState<number>(4); // Outages/year
  const [avgOutageCost, setAvgOutageCost] = useState<number>(2500); // Disruption cost per outage (£)
  const [currentPpmSpend, setCurrentPpmSpend] = useState<number>(30000); // Current PPM spend (£)

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'FM ROI / TCO Calculator', url: '/tools/fm-roi-calculator' },
  ];

  // Mathematical Model (100% preserved)
  const calculation = useMemo(() => {
    // Current Model
    const annualAdminCost = adminHoursPerMonth * 12 * hourlyAdminRate;
    const annualOutageCost = unplannedOutages * avgOutageCost;
    const currentTotalTco = reactiveSpend + currentPpmSpend + annualAdminCost + annualOutageCost;

    // Consolidated Model Projections (Realistic Conservative Ratios)
    const projectedReactiveSpend = Math.round(reactiveSpend * 0.65);
    const projectedPpmSpend = Math.round(currentPpmSpend * 0.95);
    const projectedAdminCost = Math.round(annualAdminCost * 0.25);
    const projectedOutageCost = Math.round(annualOutageCost * 0.40);
    const projectedTotalTco = projectedReactiveSpend + projectedPpmSpend + projectedAdminCost + projectedOutageCost;

    const totalPotentialSavings = currentTotalTco - projectedTotalTco;
    const percentageSavings = currentTotalTco > 0 ? Math.round((totalPotentialSavings / currentTotalTco) * 100) : 0;
    const fiveYearSavings = totalPotentialSavings * 5;

    return {
      annualAdminCost,
      annualOutageCost,
      currentTotalTco,
      projectedReactiveSpend,
      projectedPpmSpend,
      projectedAdminCost,
      projectedOutageCost,
      projectedTotalTco,
      totalPotentialSavings,
      percentageSavings,
      fiveYearSavings,
    };
  }, [reactiveSpend, currentPpmSpend, adminHoursPerMonth, hourlyAdminRate, unplannedOutages, avgOutageCost]);

  const handleDownloadPdf = () => {
    const pdfDoc: PdfDocumentDefinition = {
      title: 'Facilities Management TCO & Operational ROI Appraisal',
      subtitle: 'Comparative financial model: Fragmented contractor baseline vs. Consolidated delivery.',
      documentRef: `EFM-ROI-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      badgeText: 'Commercial Cost Appraisal',
      summaryStats: [
        { label: 'Baseline Annual TCO', value: `£${calculation.currentTotalTco.toLocaleString()}` },
        { label: 'Projected Annual TCO', value: `£${calculation.projectedTotalTco.toLocaleString()}` },
        { label: 'Annual Benefit', value: `£${calculation.totalPotentialSavings.toLocaleString()}`, detail: `${calculation.percentageSavings}% Reduction` },
        { label: '5-Year Value', value: `£${calculation.fiveYearSavings.toLocaleString()}` },
      ],
      sections: [
        {
          type: 'table',
          heading: '1. Comparative Financial Cost Allocation',
          columns: [
            { header: 'Cost Category', widthPercent: 35 },
            { header: 'Current Baseline', widthPercent: 25, align: 'right' },
            { header: 'Consolidated Model', widthPercent: 25, align: 'right' },
            { header: 'Variance', widthPercent: 15, align: 'right' },
          ],
          rows: [
            ['Reactive Repairs & Emergency Callouts', `£${reactiveSpend.toLocaleString()}`, `£${calculation.projectedReactiveSpend.toLocaleString()}`, `-£${(reactiveSpend - calculation.projectedReactiveSpend).toLocaleString()}`],
            ['Planned Preventative Maintenance (PPM)', `£${currentPpmSpend.toLocaleString()}`, `£${calculation.projectedPpmSpend.toLocaleString()}`, `-£${(currentPpmSpend - calculation.projectedPpmSpend).toLocaleString()}`],
            ['Internal Contract Admin & Invoicing Overhead', `£${calculation.annualAdminCost.toLocaleString()}`, `£${calculation.projectedAdminCost.toLocaleString()}`, `-£${(calculation.annualAdminCost - calculation.projectedAdminCost).toLocaleString()}`],
            ['Unplanned Outages & Disruption Cost', `£${calculation.annualOutageCost.toLocaleString()}`, `£${calculation.projectedOutageCost.toLocaleString()}`, `-£${(calculation.annualOutageCost - calculation.projectedOutageCost).toLocaleString()}`],
            ['TOTAL ANNUAL TCO', `£${calculation.currentTotalTco.toLocaleString()}`, `£${calculation.projectedTotalTco.toLocaleString()}`, `-£${calculation.totalPotentialSavings.toLocaleString()}`],
          ],
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
          title="FM ROI / TCO Calculator"
          purpose="Model the commercial total cost of ownership across fragmented contractor setups versus a consolidated planned delivery model."
          timeEstimate="2 min"
          outputs={['PDF Financial Model']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Sliders Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-electric" />
                    <span className="text-[11px] tracking-widest text-slate-500 uppercase font-light">
                      01 / Parameter Baseline
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extralight text-slate-900 mt-1">
                    Estate Operating Cost Profile
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Adjust parameter sliders to reflect your current portfolio maintenance expenditure and management burden.
                  </p>
                </div>

                {/* Reactive Spend Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Annual Reactive Repairs &amp; Callout Spend
                    </label>
                    <span className="text-sm font-normal text-brand-electric bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
                      £{reactiveSpend.toLocaleString()} / yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="250000"
                    step="5000"
                    value={reactiveSpend}
                    onChange={(e) => setReactiveSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <span className="text-[11.5px] text-slate-600 block">
                    Expenditure on reactive breakdown callouts, emergency contractor visits, and urgent repairs.
                  </span>
                </div>

                {/* Current PPM Spend Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Annual Planned Maintenance (PPM) Contracts
                    </label>
                    <span className="text-sm font-normal text-brand-electric bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-100">
                      £{currentPpmSpend.toLocaleString()} / yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={currentPpmSpend}
                    onChange={(e) => setCurrentPpmSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <span className="text-[11.5px] text-slate-600 block">
                    Routine scheduled servicing contracts across HVAC, fire alarms, electrical, and water hygiene.
                  </span>
                </div>

                {/* Supplier Count Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Number of Independent FM Contractors
                    </label>
                    <span className="text-sm font-normal text-slate-900 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
                      {supplierCount} Contractors
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={supplierCount}
                    onChange={(e) => setSupplierCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                </div>

                {/* Internal Admin Hours */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Internal Management &amp; Invoicing Overhead
                    </label>
                    <span className="text-sm font-normal text-slate-900 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
                      {adminHoursPerMonth} hrs / mo (~£{calculation.annualAdminCost.toLocaleString()}/yr)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={adminHoursPerMonth}
                    onChange={(e) => setAdminHoursPerMonth(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                  <span className="text-[11.5px] text-slate-600 block">
                    Internal management hours spent chasing contractors, auditing work orders, and validating invoices.
                  </span>
                </div>

                {/* Outage / Disruption Assumptions */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                      Unplanned Asset Outages / Disruptions
                    </label>
                    <span className="text-sm font-normal text-rose-700 bg-rose-50 px-2.5 py-1 rounded-sm border border-rose-100">
                      {unplannedOutages} Events (~£{calculation.annualOutageCost.toLocaleString()}/yr)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    value={unplannedOutages}
                    onChange={(e) => setUnplannedOutages(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-electric"
                  />
                </div>
              </div>
            </div>

            {/* Financial Dashboard Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="bg-white border border-slate-200 rounded-sm shadow-md p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                    02 / Financial Model Output
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    {calculation.percentageSavings}% Efficiency Gain
                  </span>
                </div>

                {/* Primary Financial Benefit Card */}
                <div className="rounded-sm bg-[#0B1220] p-6 text-white space-y-2 relative overflow-hidden shadow-sm">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(ellipse at 80% 0%, rgba(37, 99, 235, 0.6), transparent 70%)`,
                    }}
                  />
                  <span className="text-[11px] font-normal uppercase tracking-wider text-slate-300 block">
                    Projected Annual TCO Reduction
                  </span>
                  <p className="text-3xl sm:text-4xl font-light text-emerald-400 tracking-tight tabular-nums">
                    £{calculation.totalPotentialSavings.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-300">
                    <span>5-Year Cumulative Value:</span>
                    <strong className="text-white font-normal text-sm">£{calculation.fiveYearSavings.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Comparative Breakdown Table */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-normal text-slate-800 uppercase tracking-wider">
                    Comparative Annual Cost Allocation
                  </h3>
                  <div className="border border-slate-200 rounded-sm bg-slate-50/50 divide-y divide-slate-200 text-xs">
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">Reactive Spend</span>
                      <div className="text-right">
                        <span className="text-slate-600 line-through text-[11px] mr-2">£{reactiveSpend.toLocaleString()}</span>
                        <strong className="text-slate-900 font-light">£{calculation.projectedReactiveSpend.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">PPM Maintenance</span>
                      <div className="text-right">
                        <span className="text-slate-600 line-through text-[11px] mr-2">£{currentPpmSpend.toLocaleString()}</span>
                        <strong className="text-slate-900 font-light">£{calculation.projectedPpmSpend.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">Contract Administration</span>
                      <div className="text-right">
                        <span className="text-slate-600 line-through text-[11px] mr-2">£{calculation.annualAdminCost.toLocaleString()}</span>
                        <strong className="text-slate-900 font-light">£{calculation.projectedAdminCost.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-slate-700 font-normal">Outage Disruption Risk</span>
                      <div className="text-right">
                        <span className="text-slate-600 line-through text-[11px] mr-2">£{calculation.annualOutageCost.toLocaleString()}</span>
                        <strong className="text-slate-900 font-light">£{calculation.projectedOutageCost.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50/70 flex items-center justify-between font-light">
                      <span className="text-slate-900">Total Estate TCO</span>
                      <div className="text-right">
                        <span className="text-slate-600 line-through text-[11px] mr-2 font-normal">£{calculation.currentTotalTco.toLocaleString()}</span>
                        <strong className="text-brand-electric font-normal text-sm">£{calculation.projectedTotalTco.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="FM ROI / TCO Calculator"
                  onDownloadPdf={handleDownloadPdf}
                  pdfLabel="Download Financial Model (PDF)"
                />
              </div>
            </div>
          </div>

          <ToolConversionCTA
            toolName="FM ROI / TCO Calculator"
            heading="Explore a consolidated FM contract tender?"
            subheading="EntireFM delivers consolidated Hard FM, compliance tracking, and Helpdesk operations with guaranteed SLA performance across commercial estates."
            primaryActionLabel="Request Contract Benchmark"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </div>
      <Footer />
    </div>
  );
}
