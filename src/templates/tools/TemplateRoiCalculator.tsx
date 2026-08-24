'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Printer,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  FileCheck,
  CheckCircle2,
  Sliders,
  FileSpreadsheet,
  Building2,
  DollarSign,
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
    const projectedAdminHours = Math.round(adminHoursPerMonth * 0.35);
    const projectedAdminCost = projectedAdminHours * 12 * hourlyAdminRate;
    const projectedOutageCost = Math.round(annualOutageCost * 0.5);

    const projectedTotalTco = projectedReactiveSpend + projectedPpmSpend + projectedAdminCost + projectedOutageCost;
    const totalPotentialSavings = Math.max(0, currentTotalTco - projectedTotalTco);
    const fiveYearSavings = totalPotentialSavings * 5;
    const annualHoursSaved = (adminHoursPerMonth - projectedAdminHours) * 12;

    return {
      currentTotalTco,
      annualAdminCost,
      annualOutageCost,
      projectedReactiveSpend,
      projectedPpmSpend,
      projectedAdminCost,
      projectedOutageCost,
      projectedTotalTco,
      totalPotentialSavings,
      fiveYearSavings,
      annualHoursSaved,
    };
  }, [reactiveSpend, currentPpmSpend, adminHoursPerMonth, hourlyAdminRate, unplannedOutages, avgOutageCost]);

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a]">
      <Header />
      <main id="main" className="flex-grow pt-20">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="FM ROI & TCO Calculator"
          purpose="Model commercial savings and internal efficiency gained by consolidating dispersed FM suppliers into a single planned maintenance partner."
          timeEstimate="2–3 min"
          outputs={['PDF TCO Appraisal']}
          icon={TrendingUp}
        >
          {/* Stepper */}
          <WizardProgress
            steps={WIZARD_STEPS}
            currentStep={0}
          />

          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Input Parameters Column (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <span className="font-mono text-xs font-bold text-[#FF3E9D] uppercase tracking-wider">
                    01 Baseline Expenditure
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Current Operational Expenditure
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Adjust slider parameters to reflect your estate's current annual maintenance spend and contractor management profile.
                  </p>
                </div>

                {/* Reactive Spend Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Annual Reactive Repairs &amp; Callouts
                    </label>
                    <span className="font-mono text-sm font-bold text-rose-400">
                      £{reactiveSpend.toLocaleString()} / yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={reactiveSpend}
                    onChange={(e) => setReactiveSpend(Number(e.target.value))}
                    className="w-full accent-[#FF3E9D] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Ad-hoc invoices for emergency repairs, out-of-hours attendances, and breakdown callouts.
                  </span>
                </div>

                {/* Current PPM Spend Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Current Planned Maintenance (PPM) Contracts
                    </label>
                    <span className="font-mono text-sm font-bold text-white">
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
                    className="w-full accent-[#FF3E9D] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Routine scheduled servicing contracts across HVAC, fire safety, water hygiene, and electrical.
                  </span>
                </div>

                {/* Supplier Count */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Number of Dispersed FM Contractors
                    </label>
                    <span className="font-mono text-sm font-bold text-[#FF3E9D]">
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
                    className="w-full accent-[#FF3E9D] cursor-pointer"
                  />
                </div>

                {/* Internal Admin Hours */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Management &amp; Invoicing Overhead
                    </label>
                    <span className="font-mono text-sm font-bold text-amber-400">
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
                    className="w-full accent-[#FF3E9D] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Internal staff time spent coordinating visits, validating multiple supplier invoices, and chasing logbooks.
                  </span>
                </div>

                {/* Outage / Disruption Assumptions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Unplanned Outages / Business Disruptions
                    </label>
                    <span className="font-mono text-sm font-bold text-rose-300">
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
                    className="w-full accent-[#FF3E9D] cursor-pointer"
                  />
                </div>
              </div>

              {/* Financial Dashboard Column (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 sticky top-36">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#FF3E9D] uppercase tracking-wider">
                    02 Financial Appraisal
                  </span>
                  <div className="mt-3 p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                      Potential Annual Opportunity
                    </span>
                    <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                      £{calculation.totalPotentialSavings.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <span>5-Year Lifecycle Value:</span>
                      <strong className="text-white font-mono">£{calculation.fiveYearSavings.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Side-by-side financial comparison */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Model Comparison Breakdown
                  </h3>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-white border-b border-slate-800 pb-1.5">
                      <span>Current Dispersed Model:</span>
                      <span className="font-mono text-rose-400">£{calculation.currentTotalTco.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>· Reactive Callout Invoices:</span>
                      <span className="font-mono">£{reactiveSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>· Current PPM Contracts:</span>
                      <span className="font-mono">£{currentPpmSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>· Internal Management Cost:</span>
                      <span className="font-mono">£{calculation.annualAdminCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>· Unplanned Disruption Impact:</span>
                      <span className="font-mono">£{calculation.annualOutageCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-emerald-300 border-b border-emerald-800/40 pb-1.5">
                      <span>Consolidated EntireFM Model:</span>
                      <span className="font-mono text-emerald-400">£{calculation.projectedTotalTco.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>· Planned M&amp;E Maintenance:</span>
                      <span className="font-mono">£{calculation.projectedPpmSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>· Managed Reactive Spend (Est):</span>
                      <span className="font-mono">£{calculation.projectedReactiveSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>· Single-Portal Admin Overhead:</span>
                      <span className="font-mono">£{calculation.projectedAdminCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>· Mitigated Outage Risk:</span>
                      <span className="font-mono">£{calculation.projectedOutageCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Export Toolbar */}
                <ExportToolbar
                  toolName="FM ROI / TCO Calculator"
                  onDownloadPdf={() => {
                    const pdfDoc: PdfDocumentDefinition = {
                      title: 'Total Cost of Ownership & FM Consolidation ROI Report',
                      subtitle: 'Commercial financial model comparing fragmented multi-supplier reactive spend against a consolidated planned maintenance regime.',
                      documentRef: `EFM-ROI-${Date.now().toString().slice(-6)}`,
                      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                      badgeText: 'Financial Appraisal',
                      summaryStats: [
                        { label: 'Current Annual TCO', value: `£${calculation.currentTotalTco.toLocaleString()}`, detail: 'Dispersed Model' },
                        { label: 'Projected Total TCO', value: `£${calculation.projectedTotalTco.toLocaleString()}`, detail: 'Consolidated Model' },
                        { label: 'Est. Annual Savings', value: `£${calculation.totalPotentialSavings.toLocaleString()}`, detail: 'Annual Opportunity' },
                        { label: '5-Year Value', value: `£${calculation.fiveYearSavings.toLocaleString()}`, detail: 'Lifecycle Benefit' },
                      ],
                      sections: [
                        {
                          type: 'table',
                          heading: '1. Side-by-Side Model Comparison (Annualized GBP)',
                          columns: [
                            { header: 'Expenditure Component', widthPercent: 35 },
                            { header: 'Current Fragmented Spend', widthPercent: 32, align: 'right' },
                            { header: 'Consolidated EntireFM Model', widthPercent: 33, align: 'right' },
                          ],
                          rows: [
                            ['Reactive Emergency Invoices', `£${reactiveSpend.toLocaleString()}`, `£${calculation.projectedReactiveSpend.toLocaleString()}`],
                            ['Planned Maintenance (PPM)', `£${currentPpmSpend.toLocaleString()}`, `£${calculation.projectedPpmSpend.toLocaleString()}`],
                            ['Internal Management & Admin Overhead', `£${calculation.annualAdminCost.toLocaleString()}`, `£${calculation.projectedAdminCost.toLocaleString()}`],
                            ['Disruption & Unplanned Outage Costs', `£${calculation.annualOutageCost.toLocaleString()}`, `£${calculation.projectedOutageCost.toLocaleString()}`],
                            ['<strong>Total Annual Cost of Ownership</strong>', `<strong>£${calculation.currentTotalTco.toLocaleString()}</strong>`, `<strong>£${calculation.projectedTotalTco.toLocaleString()}</strong>`],
                          ],
                        },
                      ],
                    };
                    downloadPdfReport(pdfDoc);
                  }}
                  pdfLabel="Download Financial Report (PDF)"
                />
              </div>
            </div>

            {/* Next Steps CTA */}
            <ToolConversionCTA
              toolName="FM ROI / TCO Calculator"
              heading={`£${calculation.totalPotentialSavings.toLocaleString()} modelled annual efficiency opportunity`}
              subheading="EntireFM can validate your estate expenditure and structure a single consolidated FM proposal within 5 working days."
              primaryActionLabel="Request Commercial Proposal"
              primaryActionHref="/contact-us#enquiry"
            />
          </div>
        </ToolShell>
      </main>
      <Footer />
    </div>
  );
}
