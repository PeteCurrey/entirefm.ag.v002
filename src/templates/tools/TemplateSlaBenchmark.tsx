'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowUpDown,
  ThermometerSnowflake,
  Zap,
  Droplets,
  Lock,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Mail,
  Send,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import {
  SLA_DISCIPLINES,
  SLA_RESPONSE_OPTIONS,
  PORTFOLIO_PRESETS,
  CONTRACT_PITFALLS,
  evaluateSlaPerformance,
  SlaDisciplineBenchmark,
} from '@/lib/tools/sla-benchmark-taxonomy';
import { downloadSlaBenchmarkReport } from '@/lib/pdf/sla-benchmark-pack-builder';
import type { TemplateProps } from '../types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  ArrowUpDown,
  ThermometerSnowflake,
  Zap,
  Droplets,
  Lock,
  Building,
};

export function TemplateSlaBenchmark({ route, content }: TemplateProps) {
  // User inputs: disciplineId -> hours
  const [userInputs, setUserInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SLA_DISCIPLINES.forEach((d) => {
      initial[d.id] = d.defaultResponseHours;
    });
    return initial;
  });

  // Expandable regulatory context cards
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  // Optional single-field email capture (non-gated, convenience only)
  const [emailInput, setEmailInput] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
    { name: 'SLA Benchmark', url: '/tools/sla-benchmark' },
  ];

  // Apply a preset
  const handleApplyPreset = (presetId: string) => {
    const preset = PORTFOLIO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setUserInputs({ ...preset.values });
    }
  };

  const handleResetDefaults = () => {
    const defaults: Record<string, number> = {};
    SLA_DISCIPLINES.forEach((d) => {
      defaults[d.id] = d.defaultResponseHours;
    });
    setUserInputs(defaults);
  };

  const toggleDetail = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Evaluation calculations
  const evaluations = useMemo(() => {
    let faster = 0;
    let within = 0;
    let slower = 0;

    const list = SLA_DISCIPLINES.map((disc) => {
      const hours = userInputs[disc.id] ?? disc.defaultResponseHours;
      const perf = evaluateSlaPerformance(disc, hours);
      if (perf.status === 'FASTER') faster++;
      else if (perf.status === 'WITHIN_BAND') within++;
      else slower++;

      return {
        discipline: disc,
        userHours: hours,
        perf,
      };
    });

    const total = list.length;
    const alignmentPct = Math.round(((faster + within) / total) * 100);

    return {
      list,
      faster,
      within,
      slower,
      total,
      alignmentPct,
    };
  }, [userInputs]);

  // Ungated PDF Download
  const handleDownloadPdf = () => {
    downloadSlaBenchmarkReport(
      {
        userInputs,
      },
      'EntireFM-Commercial-SLA-Benchmark.pdf'
    );
  };

  // Ungated CSV Export
  const handleDownloadCsv = () => {
    const rows = [
      ['EntireFM Commercial FM SLA & Response Benchmark'],
      ['Generated Date', new Date().toLocaleDateString('en-GB')],
      ['Estate Alignment Rating', `${evaluations.alignmentPct}%`],
      ['Total Disciplines Evaluated', evaluations.total.toString()],
      ['Upper Quartile (Faster)', evaluations.faster.toString()],
      ['Market Standard (Within Band)', evaluations.within.toString()],
      ['Lagging Standard (Slower)', evaluations.slower.toString()],
      [''],
      [
        'DISCIPLINE',
        'FAILURE MODE',
        'YOUR TYPICAL RESPONSE',
        'UK COMMERCIAL BAND (INDUSTRY PRACTICE)',
        'STATUS',
        'WHY IT MATTERS (REGULATORY / OPERATIONAL CONTEXT)',
      ],
      ...evaluations.list.map((item) => [
        item.discipline.name,
        item.discipline.metricLabel,
        item.userHours < 1 ? `${Math.round(item.userHours * 60)} mins` : `${item.userHours} hours`,
        item.discipline.benchmark.bandDisplay,
        item.perf.statusLabel,
        item.discipline.whyItMatters,
      ]),
      [''],
      ['NOTICE', 'Commercial response bands represent standard UK FM Helpdesk practice, not statutory arrival mandates.'],
      ['ENTIREFM CONTACT', '020 4617 0228 | enquiries@entirefm.com | www.entirefm.com'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'EntireFM-SLA-Benchmark-Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Optional single-field email submit
  const handleEmailScorecard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) return;

    setEmailSubmitting(true);
    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          service: 'SLA Benchmark Tool (Email Scorecard)',
          lead_source: 'SLA Benchmark Tool',
          conversion_page: '/tools/sla-benchmark',
          message: `User requested SLA benchmark summary. Estate alignment score: ${evaluations.alignmentPct}%. Faster: ${evaluations.faster}, Typical: ${evaluations.within}, Slower: ${evaluations.slower}.`,
          user_inputs: userInputs,
        }),
      });
    } catch {
      // Non-blocking fail-soft
    } finally {
      setEmailSubmitting(false);
      setEmailSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="Commercial FM SLA & Response Benchmark"
          purpose="Compare your estate's current emergency response and fix times against typical UK commercial FM contract bands across 7 critical disciplines."
          timeEstimate="1 min"
          outputs={['PDF Benchmark Scorecard', 'CSV Data Export']}
        >
          {/* Preset Bar */}
          <div className="mb-8 p-4 bg-white border border-slate-200 rounded-sm shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-electric" />
              <span className="text-xs font-medium text-slate-900 uppercase tracking-wider">
                Benchmark Presets:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {PORTFOLIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p.id)}
                  className="text-xs px-3 py-1.5 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer font-light"
                  title={p.description}
                >
                  {p.name}
                </button>
              ))}

              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-xs px-2.5 py-1.5 rounded-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset to default baseline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Discipline Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[11px] font-light uppercase tracking-wider text-brand-electric">
                  Step 1 / Estate Inputs
                </span>
                <h2 className="text-xl sm:text-2xl font-extralight text-slate-900 mt-1">
                  Contracted / Typical Response Times
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Select your current emergency attendance or make-safe response time for each discipline.
                </p>
              </div>

              {evaluations.list.map(({ discipline, userHours, perf }) => {
                const IconComponent = ICON_MAP[discipline.iconName] || Clock;
                const isExpanded = !!expandedDetails[discipline.id];

                return (
                  <div
                    key={discipline.id}
                    className="p-5 sm:p-6 bg-white border border-slate-200 rounded-sm shadow-2xs space-y-4 transition-all hover:border-slate-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-sm bg-blue-50 border border-blue-100 text-brand-electric flex items-center justify-center shrink-0 mt-0.5">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10.5px] uppercase tracking-wider text-slate-600 font-medium">
                              {discipline.category}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-500 font-light">
                              {discipline.metricLabel}
                            </span>
                          </div>
                          <h3 className="text-base font-normal text-slate-900 mt-0.5">
                            {discipline.name}
                          </h3>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-sm border shrink-0 ${perf.badgeClass}`}
                      >
                        {perf.status === 'FASTER' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {perf.status === 'WITHIN_BAND' && <Clock className="w-3 h-3 text-blue-600" />}
                        {perf.status === 'SLOWER' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        <span>{perf.statusLabel}</span>
                      </span>
                    </div>

                    {/* Stepped Response Time Selector */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-normal text-slate-700">Your Current Typical Response:</span>
                        <span className="font-semibold text-slate-900">
                          {userHours < 1 ? `${Math.round(userHours * 60)} mins` : `${userHours} hours`}
                        </span>
                      </div>

                      {/* Pill options */}
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {SLA_RESPONSE_OPTIONS.map((opt) => {
                          const isSelected = userInputs[discipline.id] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() =>
                                setUserInputs((prev) => ({
                                  ...prev,
                                  [discipline.id]: opt.value,
                                }))
                              }
                              className={`py-1.5 px-1 text-[11px] rounded-xs border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0B1220] text-white border-[#0B1220] font-medium shadow-2xs'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Comparison Bar Visualiser */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>
                          UK Commercial Market Band:{' '}
                          <strong className="text-slate-800 font-medium">
                            {discipline.benchmark.bandDisplay}
                          </strong>
                        </span>
                        <span className="italic">{perf.summaryText}</span>
                      </div>

                      {/* Visual segmented spectrum */}
                      <div className="h-2 w-full bg-slate-100 rounded-xs overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: '25%' }}
                          title="Upper Quartile (< 2h)"
                        />
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: '35%' }}
                          title="Typical Commercial Band (2–4h)"
                        />
                        <div
                          className="h-full bg-rose-400"
                          style={{ width: '40%' }}
                          title="Lagging / At Risk (> 4h)"
                        />
                      </div>
                      <div className="flex justify-between text-[9.5px] text-slate-400 pt-1">
                        <span>Upper Quartile (&lt; 2h)</span>
                        <span>Standard UK Commercial SLA (2–4h)</span>
                        <span>Lagging (&gt; 4h)</span>
                      </div>
                    </div>

                    {/* Toggleable "Why It Matters" Note */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggleDetail(discipline.id)}
                        className="flex items-center justify-between w-full text-left text-xs text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-medium">
                          <Info className="w-3.5 h-3.5 text-brand-electric" />
                          <span>Why It Matters &amp; Regulatory Context</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 p-3 rounded-sm bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-medium">Regulatory / Safety Context:</strong>{' '}
                            <span>{discipline.whyItMatters}</span>
                          </div>
                          <div>
                            <strong className="text-rose-700 font-medium">Risk If Attendance Delayed:</strong>{' '}
                            <span className="text-rose-900">{discipline.riskIfDelayed}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Scorecard & Export (5 cols, sticky) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              {/* Executive Summary Card */}
              <div className="bg-white border border-slate-200 rounded-sm shadow-md p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-light uppercase tracking-wider text-slate-600">
                    Step 2 / Portfolio Scorecard
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {evaluations.total} Disciplines Evaluated
                  </span>
                </div>

                {/* Primary Alignment KPI */}
                <div className="rounded-sm bg-[#0B1220] p-6 text-white space-y-2 relative overflow-hidden shadow-sm">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-25"
                    style={{
                      backgroundImage: `radial-gradient(ellipse at 85% 10%, rgba(37, 99, 235, 0.7), transparent 70%)`,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-light uppercase tracking-wider text-slate-300 block">
                      Estate SLA Alignment Index
                    </span>
                    <span className="text-[10px] text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800/60 font-medium">
                      UK Benchmark
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-light text-white tracking-tight tabular-nums">
                      {evaluations.alignmentPct}%
                    </span>
                    <span className="text-xs text-slate-300 font-light">
                      at or above market standard
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 pt-2 border-t border-slate-800 font-light">
                    {evaluations.slower > 0 ? (
                      <>
                        <strong className="text-rose-400 font-medium">
                          {evaluations.slower} discipline{evaluations.slower > 1 ? 's' : ''}
                        </strong>{' '}
                        exceed typical UK commercial response thresholds, presenting potential tenant disruption or
                        compliance risks.
                      </>
                    ) : (
                      <>
                        All 7 disciplines align with or outperform typical UK commercial FM Helpdesk SLA benchmarks.
                      </>
                    )}
                  </p>
                </div>

                {/* Status Tally */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-sm bg-emerald-50/70 border border-emerald-200">
                    <div className="text-[10px] uppercase font-light text-emerald-700">Upper Quartile</div>
                    <div className="text-xl font-semibold text-emerald-800 mt-0.5 tabular-nums">
                      {evaluations.faster}
                    </div>
                  </div>
                  <div className="p-3 rounded-sm bg-blue-50/70 border border-blue-200">
                    <div className="text-[10px] uppercase font-light text-blue-700">Market Standard</div>
                    <div className="text-xl font-semibold text-blue-800 mt-0.5 tabular-nums">
                      {evaluations.within}
                    </div>
                  </div>
                  <div className="p-3 rounded-sm bg-rose-50/70 border border-rose-200">
                    <div className="text-[10px] uppercase font-light text-rose-700">Lagging</div>
                    <div className="text-xl font-semibold text-rose-800 mt-0.5 tabular-nums">
                      {evaluations.slower}
                    </div>
                  </div>
                </div>

                {/* Critical Risk Alerts */}
                {evaluations.slower > 0 && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-sm space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Key Exposure Warnings</span>
                    </div>
                    <ul className="text-xs text-rose-700 space-y-1 font-light list-disc list-inside">
                      {evaluations.list
                        .filter((item) => item.perf.status === 'SLOWER')
                        .map((item) => (
                          <li key={item.discipline.id}>
                            <strong>{item.discipline.name}:</strong>{' '}
                            {item.discipline.riskIfDelayed}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Factual Integrity Distinction Note */}
                <div className="text-[11px] text-slate-500 font-light leading-relaxed border-t border-slate-100 pt-3">
                  <p>
                    <strong>Statutory vs Commercial Distinction:</strong> Response bands (e.g. 2–4 hours) reflect
                    standard UK commercial FM Helpdesk contracts rather than direct legal mandates, except where
                    specific standards enforce triggers (such as BS 5839-1 four-hour compensatory fire watches and BS EN
                    81-28 passenger entrapment rescues).
                  </p>
                </div>

                {/* 100% Ungated Export Toolbar */}
                <ExportToolbar
                  toolName="Commercial FM SLA Benchmark"
                  onDownloadPdf={handleDownloadPdf}
                  onDownloadCsv={handleDownloadCsv}
                  pdfLabel="Download Scorecard (PDF)"
                  csvLabel="Export Matrix (CSV)"
                />

                {/* Optional Email Scorecard Single-Field Box (Convenience only) */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Email a Copy to Your Inbox (Optional)</span>
                  </div>
                  {emailSubmitted ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Summary recorded! Download your PDF anytime above.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailScorecard} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="work.email@company.co.uk"
                        className="text-xs px-3 py-2 border border-slate-300 rounded-sm flex-grow focus:outline-hidden focus:ring-1 focus:ring-brand-electric text-slate-900"
                      />
                      <button
                        type="submit"
                        disabled={emailSubmitting}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-sm text-xs font-normal transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>Send</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                  )}
                  <p className="text-[10.5px] text-slate-400 font-light">
                    Direct instant download above remains 100% free and ungated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Section: Contract Pitfalls */}
          <div className="mt-14 border-t border-slate-200 pt-10">
            <div className="max-w-3xl mb-6">
              <span className="text-[11px] font-light uppercase tracking-wider text-brand-electric">
                Commercial Advisory
              </span>
              <h2 className="text-2xl font-light text-slate-900 mt-1">
                FM Contract Pitfalls: Behind the SLA Numbers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                When auditing facilities management contracts, published response times rarely tell the whole story.
                Estate managers must watch for these common contractual loopholes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CONTRACT_PITFALLS.map((pitfall, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10.5px] font-semibold text-brand-electric uppercase tracking-wider">
                      0{idx + 1} / Caution
                    </span>
                    <h3 className="text-base font-normal text-slate-900">{pitfall.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">{pitfall.body}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 bg-blue-50/50 p-2.5 rounded-xs text-xs text-blue-900 font-light">
                    <strong className="font-semibold text-blue-950 block mb-0.5">Procurement Action:</strong>
                    {pitfall.takeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft CTA */}
          <ToolConversionCTA
            toolName="Commercial FM SLA Benchmark"
            heading="Reviewing your estate FM tender or contractor SLAs?"
            subheading="EntireFM delivers guaranteed emergency response with direct 24/7 CAFM GPS job tracking, audited first-time fix rates, and dedicated contract managers."
            primaryActionLabel="Request Contract Benchmark"
            primaryActionHref="/contact-us#enquiry"
            secondaryActionLabel="Speak with Technical Ops"
            secondaryActionHref="/contact-us"
          />
        </ToolShell>
      </div>
      <Footer />
    </div>
  );
}
