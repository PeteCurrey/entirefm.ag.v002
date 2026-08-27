'use client';

import React, { useState } from 'react';
import {
  Calculator,
  Percent,
  Clock,
  Car,
  Users,
  BarChart2,
  FileText,
  DollarSign,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  calculateLabourRate,
  calculateJobMargin,
  calculateCallOutRate,
  calculateTravelCost,
  calculateEngineerUtilisation,
  calculateVat,
} from '@/server/contractor/business-calculations';

type ActiveTool =
  | 'LABOUR'
  | 'MARGIN'
  | 'CALLOUT'
  | 'TRAVEL'
  | 'UTILISATION'
  | 'VAT';

function fmt(v: number, decimals = 2) {
  return v.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function CurrencyInput({ label, value, onChange, note }: { label: string; value: number; onChange: (v: number) => void; note?: string }) {
  return (
    <div className="space-y-0.5">
      <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-mist/50 text-xs font-mono">£</span>
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full pl-6 pr-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono text-sm focus:outline-none focus:border-brand-electric"
        />
      </div>
      {note && <p className="text-[10.5px] text-brand-mist/40 font-sans">{note}</p>}
    </div>
  );
}

function NumberInput({ label, value, onChange, suffix, note }: { label: string; value: number; onChange: (v: number) => void; suffix?: string; note?: string }) {
  return (
    <div className="space-y-0.5">
      <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full pl-3 pr-8 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono text-sm focus:outline-none focus:border-brand-electric"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mist/50 text-xs font-mono">{suffix}</span>}
      </div>
      {note && <p className="text-[10.5px] text-brand-mist/40 font-sans">{note}</p>}
    </div>
  );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${highlight ? 'border-t border-brand-edge-dark' : ''}`}>
      <span className="text-[11.5px] font-mono text-brand-mist/70">{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? 'text-brand-electric-bright' : 'text-white'}`}>{value}</span>
    </div>
  );
}

const TOOLS: { id: ActiveTool; label: string; icon: React.ReactNode; group: string }[] = [
  { id: 'LABOUR', label: 'Labour Rate', icon: <Calculator className="w-4 h-4" />, group: 'PRICING' },
  { id: 'MARGIN', label: 'Job Margin', icon: <Percent className="w-4 h-4" />, group: 'PRICING' },
  { id: 'CALLOUT', label: 'Call-Out Cost', icon: <Clock className="w-4 h-4" />, group: 'PRICING' },
  { id: 'TRAVEL', label: 'Travel Cost', icon: <Car className="w-4 h-4" />, group: 'COSTS' },
  { id: 'UTILISATION', label: 'Utilisation', icon: <Users className="w-4 h-4" />, group: 'PLANNING' },
  { id: 'VAT', label: 'VAT', icon: <DollarSign className="w-4 h-4" />, group: 'COSTS' },
];

export function BusinessToolsCalculators() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('LABOUR');
  const [showHowCalc, setShowHowCalc] = useState(false);

  // ─── Labour Inputs ───────────────────────────────────────────
  const [lSalary, setLSalary] = useState(42000);
  const [lNiPct, setLNiPct] = useState(13.8);
  const [lPensionPct, setLPensionPct] = useState(3.0);
  const [lBonus, setLBonus] = useState(0);
  const [lHoursWeek, setLHoursWeek] = useState(40);
  const [lWeeksYear, setLWeeksYear] = useState(52);
  const [lLeaveDays, setLLeaveDays] = useState(25);
  const [lBankHols, setLBankHols] = useState(8);
  const [lTrainingDays, setLTrainingDays] = useState(5);
  const [lSickDays, setLSickDays] = useState(4);
  const [lNonBillableHrs, setLNonBillableHrs] = useState(4);
  const [lVanMonthly, setLVanMonthly] = useState(450);
  const [lFuelAnnual, setLFuelAnnual] = useState(2400);
  const [lMaintenance, setLMaintenance] = useState(600);
  const [lTools, setLTools] = useState(500);
  const [lPhone, setLPhone] = useState(360);
  const [lPpe, setLPpe] = useState(250);
  const [lOverhead, setLOverhead] = useState(6000);
  const [lTargetMargin, setLTargetMargin] = useState(25);

  const labourResult = calculateLabourRate({
    annualSalary: lSalary,
    employerNiRatePct: lNiPct,
    employerPensionRatePct: lPensionPct,
    annualBonusOrAllowances: lBonus,
    contractedHoursPerWeek: lHoursWeek,
    workingWeeksPerYear: lWeeksYear,
    annualLeaveDays: lLeaveDays,
    bankHolidayDays: lBankHols,
    annualTrainingDays: lTrainingDays,
    annualSickUnproductiveDays: lSickDays,
    nonBillableHoursPerWeek: lNonBillableHrs,
    monthlyVanAndInsurance: lVanMonthly,
    annualFuelCost: lFuelAnnual,
    annualMaintenanceAndTyres: lMaintenance,
    annualToolsAndCalibration: lTools,
    annualPhoneAndSoftware: lPhone,
    annualPpeAndUniform: lPpe,
    annualOverheadAllocation: lOverhead,
    targetMarginPct: lTargetMargin,
  });

  // ─── Margin Inputs ───────────────────────────────────────────
  const [mSell, setMSell] = useState(1850);
  const [mLabourHrs, setMLabourHrs] = useState(14);
  const [mLabourRate, setMLabourRate] = useState(labourResult.trueCostPerProductiveHour);
  const [mMaterials, setMMaterials] = useState(420);
  const [mWastePct, setMWastePct] = useState(5);
  const [mPlant, setMPlant] = useState(120);
  const [mSubcontract, setMSubcontract] = useState(0);
  const [mTravel, setMTravel] = useState(45);
  const [mOther, setMOther] = useState(0);
  const [mOverheadPct, setMOverheadPct] = useState(10);
  const [mTargetMargin, setMTargetMargin] = useState(30);

  const marginResult = calculateJobMargin({
    sellPriceNet: mSell,
    labourHours: mLabourHrs,
    labourCostPerHour: mLabourRate,
    materialsBuyCost: mMaterials,
    materialsWasteDeliveryPct: mWastePct,
    plantAndAccessHireCost: mPlant,
    subcontractCost: mSubcontract,
    travelAndParkingCost: mTravel,
    otherDirectCosts: mOther,
    allocatedOverheadPct: mOverheadPct,
    desiredTargetMarginPct: mTargetMargin,
  });

  // ─── Call-Out Inputs ─────────────────────────────────────────
  const [coCostRate, setCoCostRate] = useState(labourResult.trueCostPerProductiveHour);
  const [coTravelMiles, setCoTravelMiles] = useState(20);
  const [coTravelHrs, setCoTravelHrs] = useState(0.75);
  const [coOnSiteHrs, setCoOnSiteHrs] = useState(2);
  const [coMultiplier, setCoMultiplier] = useState(1.5);
  const [coMinHrs, setCoMinHrs] = useState(2);
  const [coParking, setCoParking] = useState(10);
  const [coMaterials, setCoMaterials] = useState(0);
  const [coMargin, setCoMargin] = useState(30);

  const callOutResult = calculateCallOutRate({
    hourlyCostRate: coCostRate,
    travelDistanceMiles: coTravelMiles,
    travelTimeHours: coTravelHrs,
    onSiteTimeHours: coOnSiteHrs,
    callOutTypeMultiplier: coMultiplier,
    minimumCallOutHours: coMinHrs,
    parkingAndTollsGbp: coParking,
    materialsCostGbp: coMaterials,
    targetMarginPct: coMargin,
  });

  // ─── Travel Inputs ───────────────────────────────────────────
  const [trMiles, setTrMiles] = useState(60);
  const [trCostPerMile, setTrCostPerMile] = useState(0.45);
  const [trTimeHrs, setTrTimeHrs] = useState(1.5);
  const [trLabourRate, setTrLabourRate] = useState(labourResult.trueCostPerProductiveHour);
  const [trParking, setTrParking] = useState(12);
  const [trTolls, setTrTolls] = useState(0);

  const travelResult = calculateTravelCost({
    roundTripDistanceMiles: trMiles,
    vehicleFuelAndWearCostPerMile: trCostPerMile,
    travelTimeHours: trTimeHrs,
    engineerHourlyLabourCost: trLabourRate,
    parkingGbp: trParking,
    tollsAndUlezGbp: trTolls,
  });

  // ─── Utilisation Inputs ──────────────────────────────────────
  const [uEngineers, setUEngineers] = useState(5);
  const [uHoursWeek, setUHoursWeek] = useState(40);
  const [uWeeksYear, setUWeeksYear] = useState(52);
  const [uLeave, setULeave] = useState(25);
  const [uBankHols, setUBankHols] = useState(8);
  const [uTraining, setUTraining] = useState(6);
  const [uTargetPct, setUTargetPct] = useState(75);
  const [uChargeRate, setUChargeRate] = useState(labourResult.chargeOutRateAtTargetMargin);

  const utilisationResult = calculateEngineerUtilisation({
    engineerHeadcount: uEngineers,
    contractedHoursPerWeek: uHoursWeek,
    workingWeeksPerYear: uWeeksYear,
    annualLeaveDays: uLeave,
    bankHolidayDays: uBankHols,
    trainingAndMeetingDays: uTraining,
    targetBillablePct: uTargetPct,
    averageChargeOutRatePerHour: uChargeRate,
  });

  // ─── VAT Inputs ──────────────────────────────────────────────
  const [vatAmount, setVatAmount] = useState(1000);
  const [vatRate, setVatRate] = useState(20);
  const [vatDirection, setVatDirection] = useState<'ADD' | 'REMOVE'>('ADD');

  const vatResult = calculateVat(vatAmount, vatRate, vatDirection);

  return (
    <div className="space-y-6">
      {/* Tool Selector — grouped */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-4">
        <div className="flex flex-wrap gap-1.5">
          {['PRICING', 'PLANNING', 'COSTS'].map((group) => {
            const groupTools = TOOLS.filter((t) => t.group === group);
            return (
              <React.Fragment key={group}>
                <div className="flex items-center gap-1.5 mr-3">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-brand-mist/30 hidden sm:inline">
                    {group}
                  </span>
                  {groupTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                        activeTool === tool.id
                          ? 'bg-brand-electric text-white font-semibold'
                          : 'border border-brand-edge-dark text-brand-mist/70 hover:text-white hover:border-brand-mist/30'
                      }`}
                    >
                      {tool.icon}
                      {tool.label}
                    </button>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          1. LABOUR RATE CALCULATOR
      ═══════════════════════════════════════ */}
      {activeTool === 'LABOUR' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Labour Rate Calculator — True Cost per Productive Hour
            </h3>

            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/40 border-b border-brand-edge-dark/40 pb-1.5">Employment Costs</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <CurrencyInput label="Annual Base Salary" value={lSalary} onChange={setLSalary} />
                <NumberInput label="Employer NI Rate" value={lNiPct} onChange={setLNiPct} suffix="%" note="Current: 13.8%" />
                <NumberInput label="Employer Pension" value={lPensionPct} onChange={setLPensionPct} suffix="%" note="Auto-enrolment min: 3%" />
                <CurrencyInput label="Bonuses / Allowances" value={lBonus} onChange={setLBonus} note="Annual total" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/40 border-b border-brand-edge-dark/40 pb-1.5">Working Time</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <NumberInput label="Contracted Hrs/Week" value={lHoursWeek} onChange={setLHoursWeek} suffix="hrs" />
                <NumberInput label="Working Weeks/Year" value={lWeeksYear} onChange={setLWeeksYear} suffix="wks" />
                <NumberInput label="Annual Leave Days" value={lLeaveDays} onChange={setLLeaveDays} suffix="days" />
                <NumberInput label="Bank Holidays" value={lBankHols} onChange={setLBankHols} suffix="days" />
                <NumberInput label="Training Days" value={lTrainingDays} onChange={setLTrainingDays} suffix="days" />
                <NumberInput label="Sick / Unproductive" value={lSickDays} onChange={setLSickDays} suffix="days" />
                <NumberInput label="Non-Billable Admin Hrs/Wk" value={lNonBillableHrs} onChange={setLNonBillableHrs} suffix="hrs" note="Loading, meetings, admin" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/40 border-b border-brand-edge-dark/40 pb-1.5">Vehicle & Direct Operative Costs</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <CurrencyInput label="Van Lease & Insurance /Mo" value={lVanMonthly} onChange={setLVanMonthly} />
                <CurrencyInput label="Annual Fuel" value={lFuelAnnual} onChange={setLFuelAnnual} />
                <CurrencyInput label="Maintenance & Tyres /Yr" value={lMaintenance} onChange={setLMaintenance} />
                <CurrencyInput label="Tools & Calibration /Yr" value={lTools} onChange={setLTools} />
                <CurrencyInput label="Phone & Software /Yr" value={lPhone} onChange={setLPhone} />
                <CurrencyInput label="PPE & Uniform /Yr" value={lPpe} onChange={setLPpe} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/40 border-b border-brand-edge-dark/40 pb-1.5">Overhead & Target</div>
              <div className="grid grid-cols-2 gap-3">
                <CurrencyInput label="Annual Overhead Allocation" value={lOverhead} onChange={setLOverhead} note="Office, management, admin etc." />
                <NumberInput label="Target Gross Margin" value={lTargetMargin} onChange={setLTargetMargin} suffix="%" note="Margin ≠ Markup" />
              </div>
            </div>

            {/* Expandable explainer */}
            <button
              onClick={() => setShowHowCalc(!showHowCalc)}
              className="flex items-center gap-1.5 text-[11px] text-brand-mist/50 hover:text-brand-mist font-mono transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              Why productive hours matter
              {showHowCalc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showHowCalc && (
              <div className="p-4 rounded-lg bg-brand-void border border-brand-edge-dark text-[11.5px] text-brand-mist/70 font-sans leading-relaxed space-y-2">
                <p>
                  Your engineer may be contracted for approximately <strong className="text-white">{labourResult.grossPaidHours.toLocaleString()} hours</strong> this year — but annual leave, bank holidays, training days, and non-billable administration reduce the available billable time to around <strong className="text-white">{labourResult.annualBillableHours.toLocaleString()} hours</strong>.
                </p>
                <p>
                  Every recoverable cost — salary, employer contributions, vehicle, tools, and overhead — is divided across those productive hours only. This produces a break-even rate of <strong className="text-brand-electric-bright">£{fmt(labourResult.trueCostPerProductiveHour)}/hr</strong> before any margin.
                </p>
                <p className="text-brand-mist/50 text-[10.5px]">
                  Note: 30% margin means 30% of the sell price is profit. This is not the same as 30% markup (which is 30% added to cost).
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold block">
                CHARGE-OUT RATE — {lTargetMargin}% MARGIN
              </span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-light text-white font-mono">£{fmt(labourResult.chargeOutRateAtTargetMargin, 2)}</span>
                  <span className="text-brand-mist/50 text-sm font-mono">/hr + VAT</span>
                </div>
                <p className="text-xs text-brand-mist/60 mt-1">
                  Day rate (8h): <strong className="text-white font-mono">£{fmt(labourResult.equivalentDayRate)}</strong>
                </p>
              </div>

              <div className="border-t border-brand-edge-dark/60 pt-3 space-y-0.5">
                <ResultRow label="Break-Even Rate" value={`£${fmt(labourResult.trueCostPerProductiveHour)}/hr`} />
                <ResultRow label="Markup at Target Rate" value={`${fmt(labourResult.markupAtTargetRatePct, 1)}%`} />
                <ResultRow label="Billable Hours (Annual)" value={`${labourResult.annualBillableHours.toLocaleString()} hrs`} />
                <ResultRow label="Total Employment Cost" value={`£${Math.round(labourResult.annualEmploymentCost).toLocaleString()}`} />
                <ResultRow label="Fully Loaded Annual Cost" value={`£${Math.round(labourResult.totalFullyLoadedAnnualCost).toLocaleString()}`} highlight />
              </div>

              {/* Scenarios */}
              <div className="border-t border-brand-edge-dark/60 pt-3 space-y-2">
                <div className="text-[10px] font-mono uppercase text-brand-mist/40 tracking-wide">Utilisation Scenarios</div>
                {(['conservative', 'base', 'target'] as const).map((s) => {
                  const row = labourResult.scenarios[s];
                  return (
                    <div key={s} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-mist/50 capitalize">{s}</span>
                      <span className="text-white">{row.billableHours.toLocaleString()}h → <span className="text-brand-electric-bright">£{fmt(row.targetRate)}/hr</span></span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark text-[10.5px] text-brand-mist/50 font-sans leading-relaxed">
                Minimum call-out suggestion: <strong className="text-white">£{fmt(labourResult.minimumCallOutChargeSuggested)}</strong> + VAT (1.5× rate)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          2. JOB MARGIN CALCULATOR
      ═══════════════════════════════════════ */}
      {activeTool === 'MARGIN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Job Margin Calculator — Revenue, Cost, Profit &amp; Sensitivity
            </h3>

            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/40 border-b border-brand-edge-dark/40 pb-1.5">Revenue</div>
              <div className="grid grid-cols-2 gap-3">
                <CurrencyInput label="Quoted Sell Price (Net)" value={mSell} onChange={setMSell} />
                <NumberInput label="Target Gross Margin" value={mTargetMargin} onChange={setMTargetMargin} suffix="%" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-brand-mist/40 border-b border-brand-edge-dark/40 pb-1.5">Direct Costs</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <NumberInput label="Labour Hours" value={mLabourHrs} onChange={setMLabourHrs} suffix="hrs" />
                <CurrencyInput label="Labour Cost Rate /Hr" value={mLabourRate} onChange={setMLabourRate} note="Use Labour Rate calc output" />
                <CurrencyInput label="Materials Buy Cost" value={mMaterials} onChange={setMMaterials} />
                <NumberInput label="Waste & Delivery %" value={mWastePct} onChange={setMWastePct} suffix="%" />
                <CurrencyInput label="Plant & Access Hire" value={mPlant} onChange={setMPlant} />
                <CurrencyInput label="Subcontract" value={mSubcontract} onChange={setMSubcontract} />
                <CurrencyInput label="Travel & Parking" value={mTravel} onChange={setMTravel} />
                <CurrencyInput label="Other Direct Costs" value={mOther} onChange={setMOther} />
                <NumberInput label="Overhead Allocation" value={mOverheadPct} onChange={setMOverheadPct} suffix="%" />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold block">
                JOB ECONOMICS
              </span>

              {marginResult.isLossMaking ? (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center gap-2 text-rose-300 text-xs font-mono">
                  <TrendingDown className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Estimated Loss — Cost exceeds sell price.</span>
                </div>
              ) : marginResult.isBelowTargetMargin ? (
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 flex items-center gap-2 text-amber-300 text-xs font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Below your {mTargetMargin}% target margin.</span>
                </div>
              ) : null}

              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-5xl font-light font-mono ${
                      marginResult.isLossMaking
                        ? 'text-rose-400'
                        : marginResult.isBelowTargetMargin
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {fmt(marginResult.grossMarginPct, 1)}%
                  </span>
                </div>
                <p className="text-xs text-brand-mist/60 mt-1">
                  Gross Margin (Profit as % of Revenue)
                </p>
              </div>

              <div className="border-t border-brand-edge-dark/60 pt-3 space-y-0.5">
                <ResultRow label="Revenue (Net)" value={`£${fmt(marginResult.sellPriceNet)}`} />
                <ResultRow label="Total Direct Cost" value={`£${fmt(marginResult.totalDirectCost)}`} />
                <ResultRow label="Cost with Overhead" value={`£${fmt(marginResult.totalCostWithOverhead)}`} />
                <ResultRow label="Gross Profit" value={`£${fmt(marginResult.grossProfitGbp)}`} highlight />
                <ResultRow label="Markup %" value={`${fmt(marginResult.markupPct, 1)}%`} />
              </div>

              <div className="border-t border-brand-edge-dark/60 pt-3 space-y-2">
                <div className="text-[10px] font-mono uppercase text-brand-mist/40 tracking-wide">To Achieve {mTargetMargin}% Margin</div>
                <div className="text-xl font-mono font-semibold text-brand-electric-bright">£{fmt(marginResult.targetSellPriceForDesiredMargin)}</div>
              </div>

              <div className="border-t border-brand-edge-dark/60 pt-3 space-y-2">
                <div className="text-[10px] font-mono uppercase text-brand-mist/40 tracking-wide">Sensitivity</div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-brand-mist/60">+4 hrs labour:</span>
                    <span className="text-amber-400">{fmt(marginResult.sensitivity.ifExtra4HoursLabour.newMarginPct, 1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-mist/60">Materials +10%:</span>
                    <span className="text-amber-400">{fmt(marginResult.sensitivity.ifMaterialsPlus10Pct.newMarginPct, 1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          3. CALL-OUT COST CALCULATOR
      ═══════════════════════════════════════ */}
      {activeTool === 'CALLOUT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Call-Out &amp; Emergency Attendance Pricing
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <CurrencyInput label="Engineer Cost Rate /Hr" value={coCostRate} onChange={setCoCostRate} note="From Labour Rate output" />
              <NumberInput label="Travel Miles (round trip)" value={coTravelMiles} onChange={setCoTravelMiles} suffix="mi" />
              <NumberInput label="Travel Time" value={coTravelHrs} onChange={setCoTravelHrs} suffix="hrs" />
              <NumberInput label="On-Site Time" value={coOnSiteHrs} onChange={setCoOnSiteHrs} suffix="hrs" />
              <div className="space-y-0.5">
                <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Rate Type Multiplier</label>
                <select
                  value={coMultiplier}
                  onChange={(e) => setCoMultiplier(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-mono focus:outline-none focus:border-brand-electric"
                >
                  <option value={1.0}>1.0× — Standard Daytime</option>
                  <option value={1.5}>1.5× — Evening / Saturday</option>
                  <option value={2.0}>2.0× — Sunday / Bank Holiday</option>
                  <option value={2.5}>2.5× — Emergency / Christmas</option>
                </select>
              </div>
              <NumberInput label="Minimum Hours Charged" value={coMinHrs} onChange={setCoMinHrs} suffix="hrs" />
              <CurrencyInput label="Parking / Tolls" value={coParking} onChange={setCoParking} />
              <CurrencyInput label="Materials Cost" value={coMaterials} onChange={setCoMaterials} />
              <NumberInput label="Target Margin" value={coMargin} onChange={setCoMargin} suffix="%" />
            </div>
          </div>

          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold block">
              CALL-OUT PRICING
            </span>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-light text-white font-mono">£{fmt(callOutResult.recommendedSellPrice, 0)}</span>
                <span className="text-brand-mist/50 text-sm font-mono">+ VAT</span>
              </div>
              <p className="text-xs text-brand-mist/60 mt-1">Recommended sell price at {coMargin}% margin</p>
            </div>
            <div className="border-t border-brand-edge-dark/60 pt-3 space-y-0.5">
              <ResultRow label="Vehicle Cost" value={`£${fmt(callOutResult.vehicleCost)}`} />
              <ResultRow label="Travel Labour" value={`£${fmt(callOutResult.travelLabourCost)}`} />
              <ResultRow label="On-Site Labour" value={`£${fmt(callOutResult.onSiteLabourCost)}`} />
              <ResultRow label="Break-Even" value={`£${fmt(callOutResult.breakEvenSellPrice)}`} />
              <ResultRow label="Min Charge Suggested" value={`£${fmt(callOutResult.suggestedMinimumCharge)}`} highlight />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          4. TRAVEL COST
      ═══════════════════════════════════════ */}
      {activeTool === 'TRAVEL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Mileage &amp; True Visit Travel Cost
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <NumberInput label="Round-Trip Distance" value={trMiles} onChange={setTrMiles} suffix="mi" />
              <NumberInput label="Vehicle Cost Per Mile" value={trCostPerMile} onChange={setTrCostPerMile} suffix="£/mi" note="Default: £0.45/mi (incl. wear)" />
              <NumberInput label="Travel Time" value={trTimeHrs} onChange={setTrTimeHrs} suffix="hrs" />
              <CurrencyInput label="Labour Rate /Hr" value={trLabourRate} onChange={setTrLabourRate} note="From Labour Rate output" />
              <CurrencyInput label="Parking" value={trParking} onChange={setTrParking} />
              <CurrencyInput label="Tolls / ULEZ" value={trTolls} onChange={setTrTolls} />
            </div>
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark text-[11px] text-brand-mist/50 font-sans">
              HMRC mileage allowance (currently 45p/mi) represents tax relief on employee expenses — not the true business cost, which includes depreciation, insurance, and maintenance.
            </div>
          </div>

          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold block">
              VISIT TRAVEL COST
            </span>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-light text-white font-mono">£{fmt(travelResult.totalTrueTravelCost, 0)}</span>
              </div>
              <p className="text-xs text-brand-mist/60 mt-1">True total cost to send this engineer</p>
            </div>
            <div className="border-t border-brand-edge-dark/60 pt-3 space-y-0.5">
              <ResultRow label="Vehicle Cost" value={`£${fmt(travelResult.vehicleCost)}`} />
              <ResultRow label="Labour Travel Cost" value={`£${fmt(travelResult.labourTravelCost)}`} />
              <ResultRow label="Other (Parking/Tolls)" value={`£${fmt(travelResult.otherTravelCost)}`} />
              <ResultRow label="Cost Per Mile" value={`£${fmt(travelResult.costPerMile)}/mi`} highlight />
              <ResultRow label="Suggested Recoverable" value={`£${fmt(travelResult.recommendedRecoverableTravelPrice)}`} />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          5. UTILISATION
      ═══════════════════════════════════════ */}
      {activeTool === 'UTILISATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              Engineer Utilisation &amp; Revenue Delivery Capacity
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <NumberInput label="Number of Engineers" value={uEngineers} onChange={setUEngineers} suffix="ppl" />
              <NumberInput label="Contracted Hrs/Week" value={uHoursWeek} onChange={setUHoursWeek} suffix="hrs" />
              <NumberInput label="Working Weeks/Year" value={uWeeksYear} onChange={setUWeeksYear} suffix="wks" />
              <NumberInput label="Annual Leave Days" value={uLeave} onChange={setULeave} suffix="days" />
              <NumberInput label="Bank Holidays" value={uBankHols} onChange={setUBankHols} suffix="days" />
              <NumberInput label="Training & Meeting Days" value={uTraining} onChange={setUTraining} suffix="days" />
              <NumberInput label="Target Billable Utilisation" value={uTargetPct} onChange={setUTargetPct} suffix="%" />
              <CurrencyInput label="Average Charge-Out Rate/Hr" value={uChargeRate} onChange={setUChargeRate} note="Optional — from Labour Rate" />
            </div>
            <div className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark text-[11px] text-brand-mist/50 font-sans">
              Illustrative planning estimate only. Revenue capacity assumes all billable hours are sold at the stated rate with no downtime, sickness, or sales pipeline gaps.
            </div>
          </div>

          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold block">
              TEAM DELIVERY CAPACITY
            </span>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-light text-white font-mono">
                  {utilisationResult.targetBillableHoursAnnual.toLocaleString()}
                </span>
                <span className="text-brand-mist/50 text-sm font-mono">billable hrs/yr</span>
              </div>
              <p className="text-xs text-brand-mist/60 mt-1">
                Across {uEngineers} engineer{uEngineers > 1 ? 's' : ''} at {uTargetPct}% utilisation
              </p>
            </div>
            <div className="border-t border-brand-edge-dark/60 pt-3 space-y-0.5">
              <ResultRow label="Total Paid Hours" value={utilisationResult.totalPaidHours.toLocaleString()} />
              <ResultRow label="Total Productive Hours" value={utilisationResult.totalProductiveHours.toLocaleString()} />
              <ResultRow label="Weekly Billable Target" value={`${utilisationResult.targetBillableHoursWeekly.toLocaleString()} hrs`} />
              <ResultRow label="Monthly Billable Target" value={`${utilisationResult.targetBillableHoursMonthly.toLocaleString()} hrs`} highlight />
              {uChargeRate > 0 && (
                <>
                  <ResultRow label="Annual Revenue Capacity" value={`£${utilisationResult.annualRevenueDeliveryCapacityGbp.toLocaleString()}`} />
                  <ResultRow label="Monthly Revenue Capacity" value={`£${utilisationResult.monthlyRevenueDeliveryCapacityGbp.toLocaleString()}`} />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          6. VAT CALCULATOR
      ═══════════════════════════════════════ */}
      {activeTool === 'VAT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-6">
            <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3">
              VAT Calculator — Add or Remove
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <CurrencyInput label="Amount" value={vatAmount} onChange={setVatAmount} />
              <NumberInput label="VAT Rate" value={vatRate} onChange={setVatRate} suffix="%" note="Standard: 20%" />
              <div className="space-y-0.5">
                <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Direction</label>
                <select
                  value={vatDirection}
                  onChange={(e) => setVatDirection(e.target.value as 'ADD' | 'REMOVE')}
                  className="w-full px-3 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-mono focus:outline-none focus:border-brand-electric"
                >
                  <option value="ADD">Add VAT to Net Amount</option>
                  <option value="REMOVE">Remove VAT from Gross Amount</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold block">
              VAT BREAKDOWN
            </span>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-light text-white font-mono">£{fmt(vatResult.grossAmount)}</span>
              </div>
              <p className="text-xs text-brand-mist/60 mt-1">Gross (Inc. VAT)</p>
            </div>
            <div className="border-t border-brand-edge-dark/60 pt-3 space-y-0.5">
              <ResultRow label="Net (Excl. VAT)" value={`£${fmt(vatResult.netAmount)}`} />
              <ResultRow label={`VAT (${vatRate}%)`} value={`£${fmt(vatResult.vatAmount)}`} />
              <ResultRow label="Gross (Inc. VAT)" value={`£${fmt(vatResult.grossAmount)}`} highlight />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
