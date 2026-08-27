'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  FileText,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react';

interface QuoteLineItem {
  id: string;
  type: 'LABOUR' | 'MATERIALS' | 'PLANT' | 'SUBCONTRACT' | 'TRAVEL' | 'OTHER';
  description: string;
  quantity: number;
  unit: string;
  internalCostUnit: number;
  sellPriceUnit: number;
}

function newLine(type: QuoteLineItem['type'] = 'LABOUR'): QuoteLineItem {
  return {
    id: String(Date.now() + Math.random()),
    type,
    description: '',
    quantity: 1,
    unit: type === 'LABOUR' ? 'hrs' : type === 'MATERIALS' ? 'item' : 'day',
    internalCostUnit: 0,
    sellPriceUnit: 0,
  };
}

function fmt(v: number, dp = 2) {
  return v.toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

const LINE_TYPE_OPTIONS: { value: QuoteLineItem['type']; label: string }[] = [
  { value: 'LABOUR', label: 'Labour' },
  { value: 'MATERIALS', label: 'Materials' },
  { value: 'PLANT', label: 'Plant / Access' },
  { value: 'SUBCONTRACT', label: 'Subcontract' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'OTHER', label: 'Other' },
];

export function QuoteBuilderClient() {
  // Quote metadata
  const [quoteRef, setQuoteRef] = useState(`Q-${new Date().getFullYear()}-0001`);
  const [clientName, setClientName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [scopeSummary, setScopeSummary] = useState('');
  const [assumptions, setAssumptions] = useState('');
  const [exclusions, setExclusions] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [vatRatePct, setVatRatePct] = useState(20);
  const [targetMarginPct, setTargetMarginPct] = useState(30);

  // Line items
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([
    { id: '1', type: 'LABOUR', description: 'Senior Electrician — Standard Rate', quantity: 8, unit: 'hrs', internalCostUnit: 38, sellPriceUnit: 65 },
    { id: '2', type: 'MATERIALS', description: 'LED Panels & Fittings', quantity: 12, unit: 'item', internalCostUnit: 24, sellPriceUnit: 42 },
    { id: '3', type: 'TRAVEL', description: 'Travel & Fuel Allowance', quantity: 1, unit: 'visit', internalCostUnit: 45, sellPriceUnit: 55 },
  ]);

  const [showInternalCosts, setShowInternalCosts] = useState(false);

  const addLine = (type: QuoteLineItem['type']) => {
    setLineItems((prev) => [...prev, newLine(type)]);
  };

  const updateLine = (id: string, key: keyof QuoteLineItem, value: any) => {
    setLineItems((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  };

  const removeLine = (id: string) => {
    setLineItems((prev) => prev.filter((l) => l.id !== id));
  };

  const duplicateLine = (id: string) => {
    const found = lineItems.find((l) => l.id === id);
    if (!found) return;
    setLineItems((prev) => [...prev, { ...found, id: String(Date.now() + Math.random()) }]);
  };

  // ── Calculations ────────────────────────────────────────────
  const totalInternalCost = lineItems.reduce((sum, l) => sum + l.quantity * l.internalCostUnit, 0);
  const totalSellNet = lineItems.reduce((sum, l) => sum + l.quantity * l.sellPriceUnit, 0);
  const grossProfit = totalSellNet - totalInternalCost;
  const grossMarginPct = totalSellNet > 0 ? (grossProfit / totalSellNet) * 100 : 0;
  const vatAmount = totalSellNet * (vatRatePct / 100);
  const totalGross = totalSellNet + vatAmount;
  const isLoss = grossProfit < 0;
  const isBelowTarget = !isLoss && grossMarginPct < targetMarginPct;
  const targetSellForMargin = targetMarginPct < 100 ? totalInternalCost / (1 - targetMarginPct / 100) : totalInternalCost;

  return (
    <div className="space-y-6">
      {/* Quote Metadata */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
          <h3 className="text-sm font-medium text-white">Quote Details</h3>
          <span className="text-[10px] font-mono text-brand-mist/40 uppercase tracking-widest">Private to your organisation</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Quote Reference</label>
            <input type="text" value={quoteRef} onChange={(e) => setQuoteRef(e.target.value)}
              className="w-full p-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono focus:border-brand-electric focus:outline-none" />
          </div>
          <div className="space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Client / Company</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Savills Property Management"
              className="w-full p-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans focus:border-brand-electric focus:outline-none" />
          </div>
          <div className="space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Site</label>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g. One Canada Square, E14"
              className="w-full p-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans focus:border-brand-electric focus:outline-none" />
          </div>
          <div className="space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Valid For (days)</label>
            <input type="number" value={validDays} min={1} onChange={(e) => setValidDays(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono focus:border-brand-electric focus:outline-none" />
          </div>
          <div className="space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">VAT Rate</label>
            <div className="relative">
              <input type="number" value={vatRatePct} min={0} onChange={(e) => setVatRatePct(Number(e.target.value))}
                className="w-full p-2 pr-7 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono focus:border-brand-electric focus:outline-none" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mist/40 text-xs">%</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Target Margin</label>
            <div className="relative">
              <input type="number" value={targetMarginPct} min={0} max={90} onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                className="w-full p-2 pr-7 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono focus:border-brand-electric focus:outline-none" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mist/40 text-xs">%</span>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-3 space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Scope Summary</label>
            <textarea rows={2} value={scopeSummary} onChange={(e) => setScopeSummary(e.target.value)}
              placeholder="Brief description of the work..."
              className="w-full p-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none" />
          </div>
          <div className="col-span-1 space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Assumptions</label>
            <textarea rows={2} value={assumptions} onChange={(e) => setAssumptions(e.target.value)}
              placeholder="e.g. Clear, unobstructed access..."
              className="w-full p-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none" />
          </div>
          <div className="col-span-1 space-y-0.5">
            <label className="text-[11px] font-mono text-brand-mist/60 uppercase tracking-wide block">Exclusions</label>
            <textarea rows={2} value={exclusions} onChange={(e) => setExclusions(e.target.value)}
              placeholder="e.g. Making good, redecoration..."
              className="w-full p-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-edge-dark">
          <h3 className="text-sm font-medium text-white">Line Items</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInternalCosts(!showInternalCosts)}
              className="text-[10.5px] font-mono text-brand-mist/50 hover:text-white flex items-center gap-1 transition-colors"
            >
              {showInternalCosts ? '▼' : '▶'} Internal Costs
            </button>
          </div>
        </div>

        {/* Header row */}
        <div className={`hidden sm:grid px-5 py-2 bg-brand-void/50 text-[10px] font-mono text-brand-mist/40 uppercase tracking-wide border-b border-brand-edge-dark gap-2 ${showInternalCosts ? 'grid-cols-[1fr_auto_80px_70px_80px_80px_80px_32px]' : 'grid-cols-[1fr_auto_80px_70px_80px_80px_32px]'}`}>
          <span>Description</span>
          <span>Type</span>
          <span>Qty</span>
          <span>Unit</span>
          {showInternalCosts && <span>Cost/Unit</span>}
          <span>Sell/Unit</span>
          <span>Line Total</span>
          <span />
        </div>

        <div className="divide-y divide-brand-edge-dark/20">
          {lineItems.map((line) => {
            const lineTotal = line.quantity * line.sellPriceUnit;
            const lineCost = line.quantity * line.internalCostUnit;
            const lineMargin = lineTotal > 0 ? ((lineTotal - lineCost) / lineTotal) * 100 : 0;
            return (
              <div key={line.id} className={`px-5 py-2.5 grid items-center gap-2 text-xs font-mono ${showInternalCosts ? 'grid-cols-[1fr_auto_80px_70px_80px_80px_80px_32px]' : 'grid-cols-[1fr_auto_80px_70px_80px_80px_32px]'}`}>
                <input
                  type="text"
                  value={line.description}
                  onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                  placeholder="Description..."
                  className="w-full p-1.5 rounded bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                />
                <select
                  value={line.type}
                  onChange={(e) => updateLine(line.id, 'type', e.target.value)}
                  className="p-1.5 rounded bg-brand-void border border-brand-edge-dark text-white text-[10.5px] focus:border-brand-electric focus:outline-none"
                >
                  {LINE_TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <input
                  type="number"
                  value={line.quantity}
                  min={0}
                  step={0.5}
                  onChange={(e) => updateLine(line.id, 'quantity', Number(e.target.value))}
                  className="w-full p-1.5 rounded bg-brand-void border border-brand-edge-dark text-white text-center focus:border-brand-electric focus:outline-none"
                />
                <input
                  type="text"
                  value={line.unit}
                  onChange={(e) => updateLine(line.id, 'unit', e.target.value)}
                  className="w-full p-1.5 rounded bg-brand-void border border-brand-edge-dark text-white text-center focus:border-brand-electric focus:outline-none"
                />
                {showInternalCosts && (
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-mist/40 text-[10px]">£</span>
                    <input
                      type="number"
                      value={line.internalCostUnit}
                      min={0}
                      onChange={(e) => updateLine(line.id, 'internalCostUnit', Number(e.target.value))}
                      className="w-full pl-5 pr-1 py-1.5 rounded bg-brand-void border border-brand-edge-dark text-white focus:border-brand-electric focus:outline-none"
                    />
                  </div>
                )}
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-mist/40 text-[10px]">£</span>
                  <input
                    type="number"
                    value={line.sellPriceUnit}
                    min={0}
                    onChange={(e) => updateLine(line.id, 'sellPriceUnit', Number(e.target.value))}
                    className="w-full pl-5 pr-1 py-1.5 rounded bg-brand-void border border-brand-edge-dark text-white focus:border-brand-electric focus:outline-none"
                  />
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold">£{fmt(lineTotal)}</span>
                  {showInternalCosts && (
                    <span className={`block text-[9.5px] ${lineMargin < 0 ? 'text-rose-400' : lineMargin < targetMarginPct ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {fmt(lineMargin, 1)}% mgn
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => duplicateLine(line.id)} className="p-1 rounded hover:bg-brand-edge-dark text-brand-mist/30 hover:text-brand-mist transition-colors" title="Duplicate">
                    <Copy className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeLine(line.id)} className="p-1 rounded hover:bg-rose-950/30 text-brand-mist/30 hover:text-rose-400 transition-colors" title="Remove">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add line row */}
        <div className="px-5 py-3 border-t border-brand-edge-dark/60 flex flex-wrap gap-2">
          {LINE_TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => addLine(t.value)}
              className="px-2.5 py-1 rounded border border-brand-edge-dark text-brand-mist/60 hover:text-white hover:border-brand-mist/40 text-[10.5px] font-mono flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Commercial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Private internal summary */}
        {showInternalCosts && (
          <div className="rounded-xl border border-amber-800/30 bg-amber-950/10 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              <span>INTERNAL COST VIEW</span>
              <span className="text-[9px] text-amber-400/60 normal-case">Private — not shown on client quote</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-brand-mist/70">
                <span>Total Internal Cost:</span>
                <span className="text-white">£{fmt(totalInternalCost)}</span>
              </div>
              <div className="flex justify-between text-brand-mist/70">
                <span>Gross Profit:</span>
                <span className={grossProfit < 0 ? 'text-rose-400' : 'text-emerald-400'}>£{fmt(grossProfit)}</span>
              </div>
              <div className="flex justify-between text-brand-mist/70 border-t border-brand-edge-dark/40 pt-1.5">
                <span>Gross Margin:</span>
                <span className={`font-bold ${isLoss ? 'text-rose-400' : isBelowTarget ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {fmt(grossMarginPct, 1)}%
                </span>
              </div>
            </div>
            {isLoss && (
              <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[10.5px] font-sans flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                Estimated Loss — Sell price below total cost.
              </div>
            )}
            {isBelowTarget && !isLoss && (
              <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[10.5px] font-sans flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Below {targetMarginPct}% target. Need £{fmt(targetSellForMargin)} net to hit target.
              </div>
            )}
          </div>
        )}

        {/* Client-facing totals */}
        <div className={`rounded-xl border border-brand-edge-dark bg-gradient-to-b from-brand-carbon to-brand-void p-6 space-y-4 ${showInternalCosts ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold block">
            QUOTE SUMMARY — {quoteRef}
          </span>
          {clientName && <p className="text-xs text-brand-mist/60 font-mono">{clientName} &bull; {siteName}</p>}
          <div className="space-y-1.5 text-sm font-mono">
            <div className="flex justify-between text-brand-mist/70">
              <span>Net Total (Excl. VAT):</span>
              <span className="text-white font-semibold">£{fmt(totalSellNet)}</span>
            </div>
            <div className="flex justify-between text-brand-mist/70">
              <span>VAT ({vatRatePct}%):</span>
              <span className="text-white">£{fmt(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-base border-t border-brand-edge-dark pt-2 mt-2">
              <span>Total Invoice (Inc. VAT):</span>
              <span className="text-brand-electric-bright">£{fmt(totalGross)}</span>
            </div>
          </div>
          <p className="text-[10.5px] text-brand-mist/40 font-mono">
            Valid for {validDays} days from date of issue.
          </p>
        </div>
      </div>
    </div>
  );
}
