'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
  Share2,
  Copy,
  Check,
  EyeOff,
  Info,
} from 'lucide-react';
import type { AnnualBenchmarkingReport, ReportSection } from '@/server/benchmarking/types';

interface Props {
  initialReport: AnnualBenchmarkingReport;
  hasMemberSession: boolean;
}

function getVisibleItems(section: ReportSection | any[] | undefined): { label: string; count: number; percentage: number }[] {
  if (!section) return [];
  if (Array.isArray(section)) return section;
  const sec = section as ReportSection;
  return sec.visible || [];
}

function getSuppressedCount(section: ReportSection | any[] | undefined): number {
  if (!section || Array.isArray(section)) return 0;
  const sec = section as ReportSection;
  return sec.suppressedCount || 0;
}

export function TemplateBenchmarkingReport({ initialReport, hasMemberSession }: Props) {
  const [report, setReport] = useState<AnnualBenchmarkingReport>(initialReport);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Survey Form States (Structured enumerated inputs only)
  const [salaryBand, setSalaryBand] = useState('£45,000 – £60,000');
  const [teamSize, setTeamSize] = useState('5–15 Engineers');
  const [primarySector, setPrimarySector] = useState('Commercial Offices');
  const [biggestChallenge, setBiggestChallenge] = useState('Statutory Compliance & Golden Thread');
  const [technologyAdoptionLevel, setTechnologyAdoptionLevel] = useState('Active CAFM & IoT Telemetry');
  const [sustainabilityTargetYear, setSustainabilityTargetYear] = useState('2030 (Net Zero Target)');
  const [region, setRegion] = useState('London & South East');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hasMemberSession) {
      fetch('/api/lobby/benchmarking/survey')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.hasSubmitted) {
            setHasSubmitted(true);
          }
        })
        .catch(() => {});
    }
  }, [hasMemberSession]);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://entirefm.com/lobby/benchmarking';
    const title = `State of UK Facilities Management ${report.year} — The Lobby Benchmarks`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/lobby/benchmarking/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salaryBand,
          teamSize,
          primarySector,
          biggestChallenge,
          technologyAdoptionLevel,
          sustainabilityTargetYear,
          region,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setHasSubmitted(true);
        // Refresh aggregate report
        const repRes = await fetch(`/api/lobby/benchmarking/report?year=${report.year}`);
        const repData = await repRes.json();
        if (repData.success) {
          setReport(repData.report);
        }
      } else {
        setErrorMessage(data.error || 'Failed to record survey response.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error submitting response.');
    } finally {
      setSubmitting(false);
    }
  };

  const surveyPeriod = report.surveyPeriod || `Q${report.quarter || 3} ${report.year}`;

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header Hero */}
        <section className="border-b border-brand-graphite/40 bg-gradient-to-b from-brand-graphite/30 to-brand-void py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Pulse Aggregated Benchmarking • {surveyPeriod}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  State of UK Facilities Management {report.year}
                </h1>
                <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl font-light">
                  First-party aggregated benchmarks on FM salaries, contractor engineering workforce sizes, statutory Building Safety Act friction points, and CAFM adoption.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-brand-charcoal/60 hover:bg-brand-charcoal text-white text-xs font-medium transition shadow-sm"
                  title="Share or copy link to this benchmark"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied' : 'Share Benchmark'}</span>
                </button>

                {hasSubmitted ? (
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Your {report.year} Benchmark Recorded</span>
                  </div>
                ) : hasMemberSession ? (
                  <button
                    onClick={() => setShowSurveyModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-semibold transition shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Participate in {report.year} Survey</span>
                  </button>
                ) : (
                  <Link
                    href="/join"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-semibold transition shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Join The Lobby to Benchmark</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Sample Indicator Banner */}
            <div className="mt-8 rounded-xl border border-white/10 bg-brand-charcoal/30 p-4 text-xs text-brand-silver flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{report.sampleStatusText}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-brand-slate">Cycle: {surveyPeriod}</span>
                <span className="font-mono text-white font-semibold">
                  {report.totalResponses} Verified Responses
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Aggregate Benchmark Charts */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Top Operational Bottlenecks */}
            <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white">Top Operational Challenges</h2>
                  <p className="text-xs text-brand-silver mt-0.5">
                    What UK estate managers and hard FM heads identify as their greatest risk or friction point.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-brand-slate shrink-0">
                  Based on {report.totalResponses} responses, {surveyPeriod}
                </span>
              </div>

              <div className="space-y-4">
                {getVisibleItems(report.topChallenges).length === 0 ? (
                  <div className="rounded-xl border border-white/5 bg-brand-void/50 p-6 text-center text-xs text-brand-silver">
                    <EyeOff className="w-5 h-5 text-brand-slate mx-auto mb-2" />
                    <p className="font-medium text-white">Insufficient Data for Published Segments</p>
                    <p className="text-brand-slate mt-1">
                      No challenge category currently meets the minimum threshold (n ≥ 10 verified respondents).
                    </p>
                  </div>
                ) : (
                  getVisibleItems(report.topChallenges).map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white">{item.label}</span>
                        <span className="text-emerald-400 font-mono">{item.percentage}% ({item.count})</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-brand-void overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(item.percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}

                {getSuppressedCount(report.topChallenges) > 0 && (
                  <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-brand-slate">
                    <EyeOff className="w-3.5 h-3.5 text-brand-slate shrink-0" />
                    <span>
                      {getSuppressedCount(report.topChallenges)} segment(s) omitted — fewer than 10 responses in that category (privacy suppression rule).
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Salary Distribution & Team Sizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Salary Bands */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white">UK FM Salary Bands</h3>
                  <span className="text-[10.5px] font-mono text-brand-slate">
                    n={report.totalResponses} • {surveyPeriod}
                  </span>
                </div>

                <div className="space-y-3">
                  {getVisibleItems(report.salaryDistribution).length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">No segments meet minimum sample threshold (n ≥ 10).</p>
                  ) : (
                    getVisibleItems(report.salaryDistribution).map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}% ({item.count})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-void overflow-hidden">
                          <div
                            className="h-full bg-brand-electric rounded-full"
                            style={{ width: `${Math.max(item.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}

                  {getSuppressedCount(report.salaryDistribution) > 0 && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-brand-slate flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                      <span>{getSuppressedCount(report.salaryDistribution)} salary band(s) omitted (n &lt; 10).</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Team Sizes */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white">Contractor & Engineering Team Size</h3>
                  <span className="text-[10.5px] font-mono text-brand-slate">
                    n={report.totalResponses} • {surveyPeriod}
                  </span>
                </div>

                <div className="space-y-3">
                  {getVisibleItems(report.teamSizeDistribution).length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">No segments meet minimum sample threshold (n ≥ 10).</p>
                  ) : (
                    getVisibleItems(report.teamSizeDistribution).map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}% ({item.count})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-void overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${Math.max(item.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}

                  {getSuppressedCount(report.teamSizeDistribution) > 0 && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-brand-slate flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                      <span>{getSuppressedCount(report.teamSizeDistribution)} team size tier(s) omitted (n &lt; 10).</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sector Distribution */}
            <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">Primary Estate Sector Representation</h3>
                <span className="text-[10.5px] font-mono text-brand-slate">
                  n={report.totalResponses} • {surveyPeriod}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getVisibleItems(report.sectorDistribution).length === 0 ? (
                  <p className="text-xs text-brand-slate py-4">No sectors meet minimum sample threshold (n ≥ 10).</p>
                ) : (
                  getVisibleItems(report.sectorDistribution).map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-brand-void/40 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white font-medium">{item.label}</span>
                        <span className="text-emerald-400 font-mono font-semibold">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-brand-void overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.max(item.percentage, 4)}%` }}
                        />
                      </div>
                      <div className="text-[10.5px] text-brand-slate">{item.count} verified responses</div>
                    </div>
                  ))
                )}
              </div>

              {getSuppressedCount(report.sectorDistribution) > 0 && (
                <div className="pt-2 border-t border-white/5 text-[11px] text-brand-slate flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 shrink-0" />
                  <span>{getSuppressedCount(report.sectorDistribution)} sector(s) omitted — fewer than 10 respondents in segment.</span>
                </div>
              )}
            </div>

            {/* Technology & Decarbonisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technology Adoption */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white">CAFM & Telemetry Adoption</h3>
                  <span className="text-[10.5px] font-mono text-brand-slate">
                    n={report.totalResponses} • {surveyPeriod}
                  </span>
                </div>

                <div className="space-y-3">
                  {getVisibleItems(report.technologyAdoption).length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">No segments meet minimum sample threshold (n ≥ 10).</p>
                  ) : (
                    getVisibleItems(report.technologyAdoption).map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}% ({item.count})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-void overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${Math.max(item.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}

                  {getSuppressedCount(report.technologyAdoption) > 0 && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-brand-slate flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                      <span>{getSuppressedCount(report.technologyAdoption)} adoption tier(s) omitted (n &lt; 10).</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sustainability Targets */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white">Net Zero & Decarbonisation Timelines</h3>
                  <span className="text-[10.5px] font-mono text-brand-slate">
                    n={report.totalResponses} • {surveyPeriod}
                  </span>
                </div>

                <div className="space-y-3">
                  {getVisibleItems(report.sustainabilityTargets).length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">No segments meet minimum sample threshold (n ≥ 10).</p>
                  ) : (
                    getVisibleItems(report.sustainabilityTargets).map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}% ({item.count})</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-void overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.max(item.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}

                  {getSuppressedCount(report.sustainabilityTargets) > 0 && (
                    <div className="pt-2 border-t border-white/5 text-[11px] text-brand-slate flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 shrink-0" />
                      <span>{getSuppressedCount(report.sustainabilityTargets)} target timeline(s) omitted (n &lt; 10).</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Plain Methodology & Governance Note */}
            <div className="rounded-2xl border border-white/10 bg-brand-charcoal/20 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <Info className="w-4 h-4 text-brand-electric shrink-0" />
                <span>Methodology &amp; Privacy Governance</span>
              </div>
              <p className="text-xs text-brand-silver leading-relaxed font-light">
                <strong>Data Provenance:</strong> Statistics displayed in this benchmarking report are derived exclusively from self-reported survey submissions by verified EntireFM Lobby members. This dataset reflects practitioner sentiment and operational reality across participating UK estates; it is not a scientific sample or an exhaustive national census.
              </p>
              <p className="text-xs text-brand-silver leading-relaxed font-light">
                <strong>Privacy Suppression Rule:</strong> To eliminate any possibility of practitioner or estate deanonymisation through data linkage, any demographic or operational cut with fewer than 10 verified respondents (n &lt; 10) is suppressed and excluded from the public report. We never widen groupings silently or substitute estimated values.
              </p>
              <div className="pt-2 text-[11px] text-brand-slate font-mono">
                Pipeline execution run: {report.year} cycle • Data snapshot: {surveyPeriod} • Cell threshold: n ≥ 10
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Survey Submission Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-charcoal border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-brand-electric bg-brand-electric/15 px-2 py-0.5 rounded">
                {report.year} Annual Survey
              </span>
              <h2 className="text-xl font-bold text-white mt-2">State of UK FM Benchmarking</h2>
              <p className="text-xs text-brand-silver mt-1">
                Your responses are completely anonymised in aggregate benchmarking and help calibrate industry baselines.
              </p>
            </div>

            {submitSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Thank You for Participating!</h3>
                <p className="text-xs text-brand-silver">
                  Your inputs have been recorded in the {report.year} benchmark dataset.
                </p>
                <button
                  onClick={() => {
                    setShowSurveyModal(false);
                    setSubmitSuccess(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-medium"
                >
                  Close &amp; View Updated Benchmarks
                </button>
              </div>
            ) : (
              <form onSubmit={handleSurveySubmit} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    What is your approximate base salary band?
                  </label>
                  <select
                    value={salaryBand}
                    onChange={(e) => setSalaryBand(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="Under £35,000">Under £35,000</option>
                    <option value="£35,000 – £45,000">£35,000 – £45,000</option>
                    <option value="£45,000 – £60,000">£45,000 – £60,000</option>
                    <option value="£60,000 – £80,000">£60,000 – £80,000</option>
                    <option value="£80,000 – £110,000">£80,000 – £110,000</option>
                    <option value="£110,000+">£110,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    Primary UK Operating Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="London & South East">London &amp; South East</option>
                    <option value="Midlands">Midlands</option>
                    <option value="North of England">North of England</option>
                    <option value="South West & Wales">South West &amp; Wales</option>
                    <option value="Scotland">Scotland</option>
                    <option value="Northern Ireland">Northern Ireland</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    What is your direct/indirect operational team size?
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="Solo Practitioner">Solo Practitioner</option>
                    <option value="2–5 Engineers">2–5 Engineers</option>
                    <option value="5–15 Engineers">5–15 Engineers</option>
                    <option value="15–50 Engineers">15–50 Engineers</option>
                    <option value="50+ Engineers">50+ Engineers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    Primary Estate / Portfolio Sector
                  </label>
                  <select
                    value={primarySector}
                    onChange={(e) => setPrimarySector(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="Commercial Offices">Commercial Offices</option>
                    <option value="Healthcare & NHS">Healthcare &amp; NHS</option>
                    <option value="Higher Education & Universities">Higher Education &amp; Universities</option>
                    <option value="Industrial & Logistics">Industrial &amp; Logistics</option>
                    <option value="Residential Block Management">Residential Block Management</option>
                    <option value="Retail & Leisure">Retail &amp; Leisure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    What is your single biggest operational challenge in {report.year}?
                  </label>
                  <select
                    value={biggestChallenge}
                    onChange={(e) => setBiggestChallenge(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="Statutory Compliance & Golden Thread">Statutory Compliance &amp; Golden Thread</option>
                    <option value="Skilled Engineering Labour Shortage">Skilled Engineering Labour Shortage</option>
                    <option value="Budget Pressures & Cost of Parts">Budget Pressures &amp; Cost of Parts</option>
                    <option value="Outdated Legacy CAFM Systems">Outdated Legacy CAFM Systems</option>
                    <option value="Decarbonisation & EPC B Upgrades">Decarbonisation &amp; EPC B Upgrades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    Current CAFM &amp; IoT Telemetry Adoption
                  </label>
                  <select
                    value={technologyAdoptionLevel}
                    onChange={(e) => setTechnologyAdoptionLevel(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="Manual Spreadsheets & Paper Forms">Manual Spreadsheets &amp; Paper Forms</option>
                    <option value="Basic CAFM Ticketing Only">Basic CAFM Ticketing Only</option>
                    <option value="Active CAFM & IoT Telemetry">Active CAFM &amp; IoT Telemetry</option>
                    <option value="Advanced Automated Dispatch & AI">Advanced Automated Dispatch &amp; AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    Estate Net Zero / Decarbonisation Target Year
                  </label>
                  <select
                    value={sustainabilityTargetYear}
                    onChange={(e) => setSustainabilityTargetYear(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="2030 (Net Zero Target)">2030 (Net Zero Target)</option>
                    <option value="2035 (Net Zero Target)">2035 (Net Zero Target)</option>
                    <option value="2040 (Net Zero Target)">2040 (Net Zero Target)</option>
                    <option value="2050 (Statutory Net Zero)">2050 (Statutory Net Zero)</option>
                    <option value="No Formal Target Set">No Formal Target Set</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSurveyModal(false)}
                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-xs text-brand-silver hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-lg bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Benchmark'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
