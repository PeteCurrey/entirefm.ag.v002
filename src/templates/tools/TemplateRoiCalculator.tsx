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
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TrustBar } from '@/components/trust/TrustBar';
import { ProposalSection } from '@/components/conversion/PhoneCTA';
import { ToolHero } from '@/components/resources/ToolHero';
import { ResultsConversionBridge } from '@/components/resources/ResultsConversionBridge';
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
    { name: 'FM Tools', url: '/tools' },
    { name: 'FM ROI / TCO Calculator', url: '/tools/fm-roi-calculator' },
  ];

  // Mathematical Model
  const calculation = useMemo(() => {
    // Current Model
    const annualAdminCost = adminHoursPerMonth * 12 * hourlyAdminRate;
    const annualOutageCost = unplannedOutages * avgOutageCost;
    const currentTotalTco = reactiveSpend + currentPpmSpend + annualAdminCost + annualOutageCost;

    // Consolidated Model Projections (Realistic Conservative Ratios)
    // 1. Reactive spend reduction through planned preventative care (~30-40% reduction in emergency calls)
    const projectedReactiveSpend = Math.round(reactiveSpend * 0.65);

    // 2. Consolidated PPM investment (structured delivery across single contract)
    const projectedPpmSpend = Math.round(currentPpmSpend * 0.95);

    // 3. Admin & Supplier coordination reduction (single portal/account manager saves ~65% admin time)
    const projectedAdminHours = Math.round(adminHoursPerMonth * 0.35);
    const projectedAdminCost = projectedAdminHours * 12 * hourlyAdminRate;

    // 4. Outage risk reduction through early thermal/vibration detection (~50% reduction)
    const projectedOutageCost = Math.round(annualOutageCost * 0.5);

    const projectedTotalTco = projectedReactiveSpend + projectedPpmSpend + projectedAdminCost + projectedOutageCost;
    const totalPotentialSavings = Math.max(0, currentTotalTco - projectedTotalTco);
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
      annualHoursSaved,
    };
  }, [reactiveSpend, currentPpmSpend, adminHoursPerMonth, hourlyAdminRate, unplannedOutages, avgOutageCost]);

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
          eyebrow="Commercial Model Comparison"
          title="FM Total Cost of Ownership & ROI Calculator"
          description="Compare your current multiple-supplier reactive expenditure against a consolidated planned maintenance model. Evaluate hidden admin overhead and avoidable plant failure costs."
          timeEstimate="~2 minutes"
          deliverables={[
            'Current vs Consolidated FM TCO comparison',
            'Annual reactive spend reduction estimate',
            'Internal admin hours recovery calculation',
            'Unplanned outage cost reduction modelling',
            'Printable financial comparison summary',
          ]}
          accent="violet"
          icon={TrendingUp}
        />

        {/* Calculator App Section */}
        <section className="py-14 bg-brand-carbon">
          <div className="container-custom max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Input Form (7 cols) */}
              <div className="lg:col-span-7 rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-6">
                <div className="border-b border-brand-edge-dark pb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Current Maintenance & Operating Costs
                  </h2>
                  <p className="text-xs text-brand-mist/60 mt-0.5">
                    Adjust the sliders to match your organisation's current annual expenditure.
                  </p>
                </div>

                {/* Reactive Spend Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                      Annual Reactive Repairs & Emergency Callouts
                    </label>
                    <span className="font-mono text-xs font-bold text-rose-400">
                      £{reactiveSpend.toLocaleString()} / year
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={reactiveSpend}
                    onChange={(e) => setReactiveSpend(Number(e.target.value))}
                    className="w-full accent-brand-electric-bright cursor-pointer"
                  />
                  <span className="text-[10px] text-brand-mist/40 block mt-1">
                    Direct invoices for ad-hoc callouts, emergency fixes, and out-of-hours attendances.
                  </span>
                </div>

                {/* Current PPM Spend Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                      Current Planned Maintenance (PPM) Contract Spend
                    </label>
                    <span className="font-mono text-xs font-bold text-white">
                      £{currentPpmSpend.toLocaleString()} / year
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={currentPpmSpend}
                    onChange={(e) => setCurrentPpmSpend(Number(e.target.value))}
                    className="w-full accent-brand-electric-bright cursor-pointer"
                  />
                </div>

                {/* Supplier Count */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                      Number of Separate FM Suppliers Managed
                    </label>
                    <span className="font-mono text-xs font-bold text-brand-electric-bright">
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
                    className="w-full accent-brand-electric-bright cursor-pointer"
                  />
                </div>

                {/* Internal Admin Hours */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                      Internal Management & Invoicing Hours per Month
                    </label>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {adminHoursPerMonth} hrs / month (~£{calculation.annualAdminCost.toLocaleString()}/yr)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={adminHoursPerMonth}
                    onChange={(e) => setAdminHoursPerMonth(Number(e.target.value))}
                    className="w-full accent-brand-electric-bright cursor-pointer"
                  />
                  <span className="text-[10px] text-brand-mist/40 block mt-1">
                    Time spent chasing contractor certificates, managing work orders, and validating invoices.
                  </span>
                </div>

                {/* Outage / Disruption Assumptions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                      Unplanned Outages / Disruptions per Year
                    </label>
                    <span className="font-mono text-xs font-bold text-rose-300">
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
                    className="w-full accent-brand-electric-bright cursor-pointer"
                  />
                </div>
              </div>

              {/* Output Results Column (5 cols) */}
              <div className="lg:col-span-5 rounded-sm border border-brand-edge-dark bg-brand-graphite p-6 sm:p-8 space-y-6">
                <div>
                  <span className="eyebrow eyebrow-dark">TCO Model Output</span>
                  <div className="mt-3 p-5 rounded-sm bg-brand-carbon border border-brand-edge-dark">
                    <span className="text-[11px] font-semibold text-brand-mist/50 uppercase tracking-wider block">
                      Estimated Potential Annual Efficiency
                    </span>
                    <p className="mt-2 text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                      £{calculation.totalPotentialSavings.toLocaleString()} / year
                    </p>
                    <p className="mt-1 text-xs text-brand-mist/70">
                      + <span className="text-white font-bold">{calculation.annualHoursSaved} hours</span> internal management time saved
                    </p>
                  </div>
                </div>

                {/* Side-by-side comparison */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-mist/70">
                    Side-by-Side Model Comparison
                  </h3>

                  <div className="rounded-sm border border-brand-edge-dark bg-white/[0.02] p-4 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-white border-b border-brand-edge-dark pb-1.5">
                      <span>Current Dispersed Model:</span>
                      <span className="font-mono text-rose-300">£{calculation.currentTotalTco.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/60 text-[11px]">
                      <span>· Reactive Invoices:</span>
                      <span className="font-mono">£{reactiveSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/60 text-[11px]">
                      <span>· PPM Contracts:</span>
                      <span className="font-mono">£{currentPpmSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/60 text-[11px]">
                      <span>· Internal Admin Overhead:</span>
                      <span className="font-mono">£{calculation.annualAdminCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/60 text-[11px]">
                      <span>· Unplanned Disruption Impact:</span>
                      <span className="font-mono">£{calculation.annualOutageCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/[0.04] p-4 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-emerald-200 border-b border-emerald-500/20 pb-1.5">
                      <span>Consolidated PPM Model:</span>
                      <span className="font-mono text-emerald-400">£{calculation.projectedTotalTco.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/70 text-[11px]">
                      <span>· Planned M&E Maintenance:</span>
                      <span className="font-mono">£{calculation.projectedPpmSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/70 text-[11px]">
                      <span>· Managed Callout Spend (Est):</span>
                      <span className="font-mono">£{calculation.projectedReactiveSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/70 text-[11px]">
                      <span>· Single-Portal Admin Overhead:</span>
                      <span className="font-mono">£{calculation.projectedAdminCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brand-mist/70 text-[11px]">
                      <span>· Mitigated Outage Risk:</span>
                      <span className="font-mono">£{calculation.projectedOutageCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn-ghost-light w-full py-2.5 text-xs justify-center"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print ROI Comparison
                  </button>
                </div>

                {/* Transparency note */}
                <div className="text-[11px] leading-relaxed text-brand-mist/50 pt-2 border-t border-brand-edge-dark">
                  <p>
                    <strong>Calculation Logic:</strong> Projections model empirical UK maintenance patterns where structured preventative servicing reduces emergency callout frequency by ~35% and single-point contract administration saves ~65% in internal procurement and coordination hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Conversion Bridge */}
            <div className="mt-8">
              <ResultsConversionBridge
                headline={`£${calculation.totalPotentialSavings.toLocaleString()} annual efficiency opportunity identified`}
                body="These figures model real FM consolidation patterns. EntireFM can structure a commercial proposal based on your actual estate profile within 5 working days."
                ctaPrimary={{ label: 'Request a Commercial Proposal', href: '/contact-us' }}
                ctaSecondary={{ label: 'Learn about EntireFM managed FM', href: '/services' }}
                accent="violet"
              />
            </div>
          </div>
        </section>

        <TrustBar />
        <ProposalSection />
      </main>
      <Footer />
    </>
  );
}
