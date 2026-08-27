'use client';

import React, { useState } from 'react';
import { Calculator, Percent, DollarSign, Clock, Wrench, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export function BusinessToolsCalculators() {
  const [activeTool, setActiveTool] = useState<'LABOUR' | 'MARGIN' | 'CALLOUT'>('LABOUR');

  // 1. Labour Rate State
  const [annualSalary, setAnnualSalary] = useState<number>(42000);
  const [billableHoursPerWeek, setBillableHoursPerWeek] = useState<number>(32);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(46);
  const [monthlyVanAndToolCost, setMonthlyVanAndToolCost] = useState<number>(650);
  const [overheadPercentage, setOverheadPercentage] = useState<number>(20);
  const [targetMarginPercentage, setTargetMarginPercentage] = useState<number>(25);

  const annualHours = billableHoursPerWeek * weeksPerYear;
  const employerNI = annualSalary * 0.138;
  const pension = annualSalary * 0.03;
  const totalDirectCost = annualSalary + employerNI + pension + monthlyVanAndToolCost * 12;
  const totalWithOverhead = totalDirectCost * (1 + overheadPercentage / 100);
  const totalWithMargin = targetMarginPercentage < 100 ? totalWithOverhead / (1 - targetMarginPercentage / 100) : totalWithOverhead;
  const hourlyChargeRate = annualHours > 0 ? Math.round(totalWithMargin / annualHours) : 0;
  const hourlyCostRate = annualHours > 0 ? Math.round(totalDirectCost / annualHours) : 0;

  // 2. Job Margin State
  const [quoteNetGbp, setQuoteNetGbp] = useState<number>(1850);
  const [materialsCostGbp, setMaterialsCostGbp] = useState<number>(420);
  const [labourCostGbp, setLabourCostGbp] = useState<number>(560);
  const [plantAndHireGbp, setPlantAndHireGbp] = useState<number>(120);

  const totalJobCost = materialsCostGbp + labourCostGbp + plantAndHireGbp;
  const grossProfitGbp = quoteNetGbp - totalJobCost;
  const grossMarginPct = quoteNetGbp > 0 ? Math.round((grossProfitGbp / quoteNetGbp) * 1000) / 10 : 0;

  // 3. Emergency Callout State
  const [baseHourlyRate, setBaseHourlyRate] = useState<number>(65);
  const [calloutMultiplier, setCalloutMultiplier] = useState<number>(1.5);
  const [minHoursCharged, setMinHoursCharged] = useState<number>(2);
  const [travelChargeGbp, setTravelChargeGbp] = useState<number>(45);

  const calloutRatePerHour = baseHourlyRate * calloutMultiplier;
  const minimumAttendanceCost = calloutRatePerHour * minHoursCharged + travelChargeGbp;

  return (
    <div className="space-y-6">
      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-edge-dark pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTool('LABOUR')}
          className={`px-4 py-2 rounded-lg text-xs font-normal transition-colors flex items-center gap-2 ${
            activeTool === 'LABOUR'
              ? 'bg-brand-electric text-white font-medium'
              : 'bg-brand-carbon border border-brand-edge-dark text-brand-mist/70 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Labour Rate Calculator
        </button>

        <button
          onClick={() => setActiveTool('MARGIN')}
          className={`px-4 py-2 rounded-lg text-xs font-normal transition-colors flex items-center gap-2 ${
            activeTool === 'MARGIN'
              ? 'bg-brand-electric text-white font-medium'
              : 'bg-brand-carbon border border-brand-edge-dark text-brand-mist/70 hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" />
          Job Margin &amp; Profitability
        </button>

        <button
          onClick={() => setActiveTool('CALLOUT')}
          className={`px-4 py-2 rounded-lg text-xs font-normal transition-colors flex items-center gap-2 ${
            activeTool === 'CALLOUT'
              ? 'bg-brand-electric text-white font-medium'
              : 'bg-brand-carbon border border-brand-edge-dark text-brand-mist/70 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Emergency Call-Out Calculator
        </button>
      </div>

      {/* 1. Labour Rate Calculator */}
      {activeTool === 'LABOUR' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Engineer Cost Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-brand-mist/70 block mb-1">Engineer Annual Base Salary (£)</label>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Billable Hours / Week</label>
                <input
                  type="number"
                  value={billableHoursPerWeek}
                  onChange={(e) => setBillableHoursPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Working Weeks / Year (excl holiday)</label>
                <input
                  type="number"
                  value={weeksPerYear}
                  onChange={(e) => setWeeksPerYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Monthly Van, Fuel &amp; Tools (£)</label>
                <input
                  type="number"
                  value={monthlyVanAndToolCost}
                  onChange={(e) => setMonthlyVanAndToolCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Company Overheads (%)</label>
                <input
                  type="number"
                  value={overheadPercentage}
                  onChange={(e) => setOverheadPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Target Gross Margin (%)</label>
                <input
                  type="number"
                  value={targetMarginPercentage}
                  onChange={(e) => setTargetMarginPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
                RECOMMENDED CHARGE RATE
              </span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-light text-white font-mono">£{hourlyChargeRate}</span>
                  <span className="text-brand-mist/50 text-sm font-mono">/ hour + VAT</span>
                </div>
                <p className="text-xs text-brand-mist/60 mt-1">
                  Delivers your {targetMarginPercentage}% target gross margin.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-brand-edge-dark text-xs font-mono">
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>Direct Cost Rate:</span>
                  <span className="text-white">£{hourlyCostRate}/hr</span>
                </div>
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>Annual Billable Hours:</span>
                  <span className="text-white">{annualHours} hrs</span>
                </div>
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>Annual Total Cost:</span>
                  <span className="text-white">£{Math.round(totalDirectCost).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-brand-void/80 border border-brand-edge-dark text-[11px] text-brand-mist/60 font-light">
              Calculations include statutory Employer NI (13.8%), auto-enrolment pension (3%), fleet costs, and overhead allocation.
            </div>
          </div>
        </div>
      )}

      {/* 2. Job Margin Calculator */}
      {activeTool === 'MARGIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Job Commercial Values
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-brand-mist/70 block mb-1">Quote Price (Net Excl. VAT) (£)</label>
                <input
                  type="number"
                  value={quoteNetGbp}
                  onChange={(e) => setQuoteNetGbp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Materials &amp; Parts Cost (£)</label>
                <input
                  type="number"
                  value={materialsCostGbp}
                  onChange={(e) => setMaterialsCostGbp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Direct Labour Cost (£)</label>
                <input
                  type="number"
                  value={labourCostGbp}
                  onChange={(e) => setLabourCostGbp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Plant Hire &amp; Access (£)</label>
                <input
                  type="number"
                  value={plantAndHireGbp}
                  onChange={(e) => setPlantAndHireGbp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
                GROSS PROFIT &amp; MARGIN
              </span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-5xl font-light font-mono ${
                      grossMarginPct >= 25 ? 'text-emerald-400' : grossMarginPct >= 15 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {grossMarginPct}%
                  </span>
                </div>
                <p className="text-xs text-brand-mist/60 mt-1">
                  Gross Profit: <strong className="text-white font-mono">£{grossProfitGbp.toFixed(2)}</strong>
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-brand-edge-dark text-xs font-mono">
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>Total Job Direct Cost:</span>
                  <span className="text-white">£{totalJobCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>VAT at 20%:</span>
                  <span className="text-white">£{(quoteNetGbp * 0.2).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>Total Invoice (Inc. VAT):</span>
                  <span className="text-brand-electric-bright">£{(quoteNetGbp * 1.2).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Emergency Callout Calculator */}
      {activeTool === 'CALLOUT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Out of Hours Call-Out Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-brand-mist/70 block mb-1">Standard Daytime Hourly Rate (£)</label>
                <input
                  type="number"
                  value={baseHourlyRate}
                  onChange={(e) => setBaseHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Out of Hours Multiplier</label>
                <select
                  value={calloutMultiplier}
                  onChange={(e) => setCalloutMultiplier(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-mono"
                >
                  <option value={1.5}>1.5x (Evening / Saturday)</option>
                  <option value={2.0}>2.0x (Sunday / Bank Holiday)</option>
                  <option value={2.5}>2.5x (Christmas / Critical Urgent)</option>
                </select>
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Minimum Hours Charged On Site</label>
                <input
                  type="number"
                  value={minHoursCharged}
                  onChange={(e) => setMinHoursCharged(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>

              <div>
                <label className="text-brand-mist/70 block mb-1">Travel &amp; Dispatch Surcharge (£)</label>
                <input
                  type="number"
                  value={travelChargeGbp}
                  onChange={(e) => setTravelChargeGbp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
                MINIMUM CALL-OUT INVOICE
              </span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-light text-white font-mono">£{minimumAttendanceCost.toFixed(0)}</span>
                  <span className="text-brand-mist/50 text-sm font-mono">+ VAT</span>
                </div>
                <p className="text-xs text-brand-mist/60 mt-1">
                  Includes first {minHoursCharged} hours attendance + travel.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-brand-edge-dark text-xs font-mono">
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>OOH Hourly Rate:</span>
                  <span className="text-white">£{calloutRatePerHour.toFixed(2)}/hr</span>
                </div>
                <div className="flex items-center justify-between text-brand-mist/70">
                  <span>Additional Hours:</span>
                  <span className="text-white">£{calloutRatePerHour.toFixed(2)}/hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
