'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SaveToWorkspaceButton } from '@/components/tools/SaveToWorkspaceButton';
import {
  Bookmark,
  Calculator,
  Wrench,
  ShieldCheck,
  Building2,
  RefreshCw,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export default function SaveToWorkspaceTestHarnessPage() {
  const [savedRecords, setSavedRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<any>(null);

  const fetchOutputs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/member/workspace/outputs');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSavedRecords(json.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch outputs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/member/me');
      const json = await res.json();
      setAuthStatus(json);
    } catch (err) {
      setAuthStatus({ authenticated: false });
    }
  };

  useEffect(() => {
    fetchAuth();
    fetchOutputs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this test output record?')) return;
    try {
      const res = await fetch(`/api/member/workspace/outputs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Mock Tool 1: PPM Cost Estimator
  const mockPpmEstimator = {
    toolName: 'ppm-estimator',
    defaultTitle: '2026 Head Office PPM Baseline (45,000 sq ft)',
    inputsJson: {
      sector: 'Commercial Office / Corporate HQ',
      floorAreaSqFt: 45000,
      region: 'london',
      operatingProfile: 'standard',
      ageBand: 'established',
    },
    outputsJson: {
      totalAnnualPpm: 65250,
      monthlyPpm: 5437,
      coreMeSpend: 42412,
      statutoryComplianceSpend: 13050,
      fabricGroundsSpend: 9788,
    },
    summaryKpis: {
      annualPpm: 65250,
      monthlyPpm: 5437,
      floorArea: '45,000 sq ft',
      buildingType: 'Commercial Office',
    },
  };

  // Mock Tool 2: FM ROI / TCO Calculator
  const mockRoiCalculator = {
    toolName: 'fm-roi-calculator',
    defaultTitle: 'Portfolio Consolidation ROI (3 Sites, 5 Suppliers)',
    inputsJson: {
      portfolioSites: 3,
      reactiveSpend: 45000,
      currentPpmSpend: 30000,
      supplierCount: 5,
      adminHoursPerMonth: 20,
    },
    outputsJson: {
      currentTco: 93400,
      consolidatedTco: 65000,
      annualSaving: 28400,
      roiPercentage: 30.4,
    },
    summaryKpis: {
      annualSaving: 28400,
      portfolioSites: 3,
      currentSpend: 75000,
      savingsPct: '30.4%',
    },
  };

  // Mock Tool 3: Statutory Compliance Checker
  const mockComplianceChecker = {
    toolName: 'compliance-checker',
    defaultTitle: 'Q3 Statutory Audit — Distribution Hub',
    inputsJson: {
      regimesChecked: 10,
      completedDate: '2026-09-07',
    },
    outputsJson: {
      overallScore: 85,
      status: 'ROBUST_CONTROL',
      actionItemsCount: 2,
    },
    summaryKpis: {
      complianceScore: '85%',
      riskStatus: 'Low Risk',
      actionItems: 2,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-neutral-900 font-sans">
      <Header solid={true} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">
        {/* Test Harness Header */}
        <div className="border-b border-neutral-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-electric" />
            <span className="text-[10px] uppercase font-mono tracking-widest text-brand-electric">
              COMPONENT TEST HARNESS &amp; DEMO
            </span>
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight">
            SaveToWorkspaceButton Demo
          </h1>
          <p className="text-sm font-extralight text-neutral-600 max-w-3xl leading-relaxed">
            This isolated harness tests the shared <code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded-sm">SaveToWorkspaceButton</code> component against the live PostgreSQL database. Verify logged-out vs logged-in behavior, site profile selection, and instant ledger persistence.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs font-light">
            <span className="text-neutral-500">Current Auth State:</span>
            {authStatus?.authenticated ? (
              <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-medium">
                Authenticated ({authStatus.member?.displayName || authStatus.member?.email})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-sm bg-neutral-200 text-neutral-700">
                Logged Out (Sign-in prompt modal will trigger)
              </span>
            )}
          </div>
        </div>

        {/* 3 Tool Mock Cards with Live Save Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: PPM Estimator */}
          <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-sm bg-brand-electric/10 text-brand-electric flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">Tool Output Simulation</span>
                <h3 className="text-base font-normal text-neutral-900">PPM Cost Estimator</h3>
              </div>
              <div className="p-3 bg-neutral-50 rounded-sm border border-neutral-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Est. Annual PPM:</span>
                  <span className="font-medium text-neutral-900">£65,250 / yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Monthly Budget:</span>
                  <span className="font-medium text-neutral-900">£5,437 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Floor Area:</span>
                  <span className="text-neutral-700">45,000 sq ft</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <SaveToWorkspaceButton
                toolName={mockPpmEstimator.toolName}
                defaultTitle={mockPpmEstimator.defaultTitle}
                inputsJson={mockPpmEstimator.inputsJson}
                outputsJson={mockPpmEstimator.outputsJson}
                summaryKpis={mockPpmEstimator.summaryKpis}
                onSaveSuccess={() => fetchOutputs()}
                className="w-full justify-center"
              />
            </div>
          </div>

          {/* Card 2: ROI Calculator */}
          <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-sm bg-brand-electric/10 text-brand-electric flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">Tool Output Simulation</span>
                <h3 className="text-base font-normal text-neutral-900">FM ROI / TCO Calculator</h3>
              </div>
              <div className="p-3 bg-neutral-50 rounded-sm border border-neutral-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Projected Saving:</span>
                  <span className="font-medium text-emerald-700">£28,400 / yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Estate Scope:</span>
                  <span className="font-medium text-neutral-900">3 Sites, 5 Suppliers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Efficiency Gain:</span>
                  <span className="text-neutral-700">30.4% TCO Reduction</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <SaveToWorkspaceButton
                toolName={mockRoiCalculator.toolName}
                defaultTitle={mockRoiCalculator.defaultTitle}
                inputsJson={mockRoiCalculator.inputsJson}
                outputsJson={mockRoiCalculator.outputsJson}
                summaryKpis={mockRoiCalculator.summaryKpis}
                onSaveSuccess={() => fetchOutputs()}
                className="w-full justify-center"
              />
            </div>
          </div>

          {/* Card 3: Compliance Diagnostic */}
          <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-sm bg-brand-electric/10 text-brand-electric flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">Tool Output Simulation</span>
                <h3 className="text-base font-normal text-neutral-900">Compliance Checker</h3>
              </div>
              <div className="p-3 bg-neutral-50 rounded-sm border border-neutral-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Compliance Score:</span>
                  <span className="font-medium text-emerald-700">85% (Low Risk)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Action Items:</span>
                  <span className="font-medium text-amber-600">2 Actions Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-light">Regimes Audited:</span>
                  <span className="text-neutral-700">10 Statutory Acts</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <SaveToWorkspaceButton
                toolName={mockComplianceChecker.toolName}
                defaultTitle={mockComplianceChecker.defaultTitle}
                inputsJson={mockComplianceChecker.inputsJson}
                outputsJson={mockComplianceChecker.outputsJson}
                summaryKpis={mockComplianceChecker.summaryKpis}
                onSaveSuccess={() => fetchOutputs()}
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>

        {/* Live Database Ledger Inspection */}
        <section className="bg-white border border-neutral-200 rounded-md p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">
                LIVE POSTGRES LEDGER
              </span>
              <h2 className="text-xl font-light text-neutral-900">
                Workspace Outputs for Authenticated Member ({savedRecords.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={fetchOutputs}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-sm hover:bg-neutral-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
          </div>

          {savedRecords.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-neutral-50 rounded-sm border border-dashed border-neutral-200">
              <Bookmark className="w-6 h-6 text-neutral-400 mx-auto" />
              <p className="text-sm font-light text-neutral-700">
                No saved outputs in your workspace ledger yet.
              </p>
              <p className="text-xs font-extralight text-neutral-500">
                Click &quot;Save to Workspace&quot; on any card above to save a record into the database.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {savedRecords.map((record) => (
                <div
                  key={record.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[3px] bg-neutral-100 text-neutral-700 text-[10px] uppercase font-mono">
                        {record.tool_name}
                      </span>
                      {record.site_profile && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-light">
                          <Building2 className="w-3 h-3 text-neutral-400" />
                          <span>{record.site_profile.name}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-neutral-900">{record.title}</h4>
                    <div className="text-xs text-neutral-500 font-light flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                      {record.summary_kpis &&
                        Object.entries(record.summary_kpis)
                          .slice(0, 3)
                          .map(([k, v]) => (
                            <span key={k}>
                              <strong className="font-normal text-neutral-700">
                                {k.replace(/([A-Z])/g, ' $1')}:
                              </strong>{' '}
                              {String(v)}
                            </span>
                          ))}
                      <span>• Saved {new Date(record.created_at).toLocaleString('en-GB')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-sm hover:bg-rose-50 transition-colors"
                      title="Delete Output"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
