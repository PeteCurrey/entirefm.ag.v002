'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
} from 'lucide-react';
import type { AnnualBenchmarkingReport } from '@/server/benchmarking/types';

interface Props {
  initialReport: AnnualBenchmarkingReport;
  hasMemberSession: boolean;
}

export function TemplateBenchmarkingReport({ initialReport, hasMemberSession }: Props) {
  const [report, setReport] = useState<AnnualBenchmarkingReport>(initialReport);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  // Survey Form States
  const [salaryBand, setSalaryBand] = useState('£45,000 – £60,000');
  const [teamSize, setTeamSize] = useState('5–15 Engineers');
  const [primarySector, setPrimarySector] = useState('Commercial Offices');
  const [biggestChallenge, setBiggestChallenge] = useState('Statutory Compliance & Golden Thread');
  const [technologyAdoptionLevel, setTechnologyAdoptionLevel] = useState('Active CAFM & IoT Telemetry');
  const [sustainabilityTargetYear, setSustainabilityTargetYear] = useState('2030 (Net Zero Target)');
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
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setHasSubmitted(true);
        // Refresh aggregate report
        const repRes = await fetch('/api/lobby/benchmarking/report?year=2026');
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
                  Industry Intelligence Report
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  State of UK Facilities Management 2026
                </h1>
                <p className="mt-2 text-base sm:text-lg text-brand-silver max-w-2xl font-light">
                  Live operational benchmarks on salaries, contractor workforce sizes, Building Safety Act compliance bottlenecks, and technology adoption.
                </p>
              </div>

              <div>
                {hasSubmitted ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Your 2026 Benchmark Recorded</span>
                  </div>
                ) : hasMemberSession ? (
                  <button
                    onClick={() => setShowSurveyModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-semibold transition shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Participate in 2026 Survey</span>
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
            <div className="mt-8 rounded-xl border border-white/10 bg-brand-charcoal/30 p-4 text-xs text-brand-silver flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{report.sampleStatusText}</span>
              </div>
              <span className="font-mono text-white font-semibold shrink-0">
                {report.totalResponses} Verified Responses
              </span>
            </div>
          </div>
        </section>

        {/* Aggregate Benchmark Charts */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Top Operational Bottlenecks */}
            <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Top Operational Challenges</h2>
                  <p className="text-xs text-brand-silver mt-0.5">
                    What UK estate managers and hard FM heads identify as their greatest risk or friction point.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {report.topChallenges.length === 0 ? (
                  <p className="text-xs text-brand-slate py-4">No challenge data submitted yet.</p>
                ) : (
                  report.topChallenges.map((item, idx) => (
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
              </div>
            </div>

            {/* Salary Distribution & Team Sizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Salary Bands */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <h3 className="text-lg font-bold text-white">UK FM Salary Bands</h3>
                <div className="space-y-3">
                  {report.salaryDistribution.length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">Awaiting practitioner submissions.</p>
                  ) : (
                    report.salaryDistribution.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}%</span>
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
                </div>
              </div>

              {/* Team Sizes */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <h3 className="text-lg font-bold text-white">Contractor & Engineering Team Size</h3>
                <div className="space-y-3">
                  {report.teamSizeDistribution.length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">Awaiting practitioner submissions.</p>
                  ) : (
                    report.teamSizeDistribution.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}%</span>
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
                </div>
              </div>
            </div>

            {/* Technology & Decarbonisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technology Adoption */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <h3 className="text-lg font-bold text-white">CAFM & Telemetry Adoption</h3>
                <div className="space-y-3">
                  {report.technologyAdoption.length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">Awaiting practitioner submissions.</p>
                  ) : (
                    report.technologyAdoption.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}%</span>
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
                </div>
              </div>

              {/* Sustainability Targets */}
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md space-y-6">
                <h3 className="text-lg font-bold text-white">Estate Net Zero & Decarbonisation Commitments</h3>
                <div className="space-y-3">
                  {report.sustainabilityTargets.length === 0 ? (
                    <p className="text-xs text-brand-slate py-4">Awaiting practitioner submissions.</p>
                  ) : (
                    report.sustainabilityTargets.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-brand-silver">{item.label}</span>
                          <span className="text-white font-mono">{item.percentage}%</span>
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
                </div>
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
                2026 Annual Survey
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
                  Your inputs have been recorded in the 2026 benchmark dataset.
                </p>
                <button
                  onClick={() => {
                    setShowSurveyModal(false);
                    setSubmitSuccess(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-medium"
                >
                  Close & View Updated Benchmarks
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
                    <option value="Healthcare & NHS">Healthcare & NHS</option>
                    <option value="Higher Education & Universities">Higher Education & Universities</option>
                    <option value="Industrial & Logistics">Industrial & Logistics</option>
                    <option value="Residential Block Management">Residential Block Management</option>
                    <option value="Retail & Leisure">Retail & Leisure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    What is your single biggest operational challenge in 2026?
                  </label>
                  <select
                    value={biggestChallenge}
                    onChange={(e) => setBiggestChallenge(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="Statutory Compliance & Golden Thread">Statutory Compliance & Golden Thread</option>
                    <option value="Skilled Engineering Labour Shortage">Skilled Engineering Labour Shortage</option>
                    <option value="Budget Pressures & Cost of Parts">Budget Pressures & Cost of Parts</option>
                    <option value="Outdated Legacy CAFM Systems">Outdated Legacy CAFM Systems</option>
                    <option value="Decarbonisation & EPC B Upgrades">Decarbonisation & EPC B Upgrades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-silver mb-1">
                    Current CAFM & IoT Telemetry Adoption
                  </label>
                  <select
                    value={technologyAdoptionLevel}
                    onChange={(e) => setTechnologyAdoptionLevel(e.target.value)}
                    className="w-full bg-brand-void border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-electric"
                  >
                    <option value="Manual Spreadsheets & Paper Forms">Manual Spreadsheets & Paper Forms</option>
                    <option value="Basic CAFM Ticketing Only">Basic CAFM Ticketing Only</option>
                    <option value="Active CAFM & IoT Telemetry">Active CAFM & IoT Telemetry</option>
                    <option value="Advanced Automated Dispatch & AI">Advanced Automated Dispatch & AI</option>
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
