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
  { id: 1, title: '01 Parameters', subtitle: 'Cost & Supplier Inputs' },
  { id: 2, title: '02 Financial Model', subtitle: 'TCO & ROI Appraisal' },
];

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

  // Mathematical Model
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
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="FM ROI / TCO Calculator"
          purpose="Model the total cost of ownership across fragmented contractor setups vs consolidated delivery."
          timeEstimate="2 min"
          outputs={['PDF Financial Model']}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Input Sliders Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
                  01 / Parameter Baseline
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Estate Operating Cost Inputs
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Adjust parameter values to match your building or portfolio operating profile.
                </p>
              </div>

              {/* Reactive Spend */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Annual Reactive Maintenance &amp; Callout Spend
                  </label>
                  <span className="font-mono text-xs font-bold text-white">
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
                  className="w-full accent-slate-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Total annual expenditure on ad-hoc breakdown visits, out-of-hours callouts, and urgent repairs.
                </span>
              </div>

              {/* Current PPM Spend */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Annual Planned Maintenance (PPM) Contract Spend
                  </label>
                  <span className="font-mono text-xs font-bold text-white">
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
                  className="w-full accent-slate-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Routine scheduled servicing contracts across HVAC, fire safety, water hygiene, and electrical.
                </span>
              </div>

              {/* Supplier Count */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Number of Independent FM Contractors
                  </label>
                  <span className="font-mono text-xs font-bold text-white">
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
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>

              {/* Internal Admin Hours */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Internal Management &amp; Invoicing Overhead
                  </label>
                  <span className="font-mono text-xs font-bold text-white">
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
                  className="w-full accent-slate-400 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Staff time spent coordinating visits, validating supplier invoices, and tracking certificates.
                </span>
              </div>

              {/* Outage / Disruption Assumptions */}
              <div className="p-4 border border-slate-800 bg-[#09101f] rounded-[3px] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Unplanned Outages / Business Disruptions
                  </label>
                  <span className="font-mono text-xs font-bold text-white">
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
                  className="w-full accent-slate-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Financial Dashboard Column (5 cols) */}
            <div className="lg:col-span-5 border border-slate-800 bg-[#09101f] p-6 rounded-[4px] space-y-6 sticky top-36">
              <div>
                <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest">
                  02 / Financial Appraisal
                </span>
                <div className="mt-3 p-4 border border-slate-800 bg-[#0c1527] space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                    Projected Annual TCO Reduction
                  </span>
                  <p className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight">
                    £{calculation.totalPotentialSavings.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                    <span>5-Year Lifecycle Value:</span>
                    <strong className="text-white font-mono">£{calculation.fiveYearSavings.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Table */}
              <div className="space-y-2 text-xs">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Comparative Annual Breakdown
                </h3>
                <div className="border border-slate-800 bg-[#0c1527] divide-y divide-slate-800/80">
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Reactive Spend</span>
                    <div className="text-right">
                      <span className="text-slate-400 line-through text-[11px] mr-2">£{reactiveSpend.toLocaleString()}</span>
                      <strong className="text-white font-mono">£{calculation.projectedReactiveSpend.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">PPM Investment</span>
                    <div className="text-right">
                      <span className="text-slate-400 line-through text-[11px] mr-2">£{currentPpmSpend.toLocaleString()}</span>
                      <strong className="text-white font-mono">£{calculation.projectedPpmSpend.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Contract Administration</span>
                    <div className="text-right">
                      <span className="text-slate-400 line-through text-[11px] mr-2">£{calculation.annualAdminCost.toLocaleString()}</span>
                      <strong className="text-white font-mono">£{calculation.projectedAdminCost.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Outage Risk Cost</span>
                    <div className="text-right">
                      <span className="text-slate-400 line-through text-[11px] mr-2">£{calculation.annualOutageCost.toLocaleString()}</span>
                      <strong className="text-white font-mono">£{calculation.projectedOutageCost.toLocaleString()}</strong>
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

          <ToolConversionCTA
            toolName="FM ROI / TCO Calculator"
            heading="Explore a consolidated FM contract tender?"
            subheading="EntireFM delivers consolidated Hard FM, compliance tracking, and Helpdesk operations with guaranteed SLA performance."
            primaryActionLabel="Request Contract Benchmark"
            primaryActionHref="/contact-us#enquiry"
          />
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
