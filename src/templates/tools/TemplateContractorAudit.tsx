'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Layers,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import { ExportToolbar } from '@/components/tools/ExportToolbar';
import { ToolConversionCTA } from '@/components/tools/ToolConversionCTA';
import { ContractorEntryForm } from '@/components/tools/contractor-audit/ContractorEntryForm';
import { ContractorListTable } from '@/components/tools/contractor-audit/ContractorListTable';
import { ContractorFragmentationSummary } from '@/components/tools/contractor-audit/ContractorFragmentationSummary';
import {
  ContractorEntry,
  calculateFragmentationSummary,
  getSampleContractors,
} from '@/types/contractor-audit';
import type { TemplateProps } from '../types';

export function TemplateContractorAudit({ route, content }: TemplateProps) {
  // Pre-populate with realistic 6-contractor sample portfolio for immediate evaluation
  const [contractors, setContractors] = useState<ContractorEntry[]>(getSampleContractors);
  const [editingContractor, setEditingContractor] = useState<ContractorEntry | null>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'FM Tools', url: '/tools' },
    { name: 'Contractor Audit', url: '/tools/contractor-audit' },
  ];

  // Dynamic portfolio fragmentation summary
  const summary = useMemo(() => {
    return calculateFragmentationSummary(contractors);
  }, [contractors]);

  // Handlers for repeatable contractor list
  const handleAddContractor = (newContractor: Omit<ContractorEntry, 'id'>) => {
    const id = `contractor-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setContractors((prev) => [
      {
        id,
        ...newContractor,
      },
      ...prev,
    ]);
  };

  const handleUpdateContractor = (id: string, updated: Omit<ContractorEntry, 'id'>) => {
    setContractors((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    setEditingContractor(null);
  };

  const handleDeleteContractor = (id: string) => {
    setContractors((prev) => prev.filter((item) => item.id !== id));
    if (editingContractor?.id === id) {
      setEditingContractor(null);
    }
  };

  const handleDuplicateContractor = (source: ContractorEntry) => {
    const id = `contractor-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setContractors((prev) => [
      {
        ...source,
        id,
        contractorName: `${source.contractorName} (Copy)`,
      },
      ...prev,
    ]);
  };

  const handleClearAll = () => {
    setContractors([]);
    setEditingContractor(null);
  };

  const handleLoadSample = () => {
    setContractors(getSampleContractors());
    setEditingContractor(null);
  };

  // CSV export generator
  const handleDownloadCsv = () => {
    if (contractors.length === 0) return;
    const headers = [
      'Discipline',
      'Contractor Name',
      'Annual Spend (GBP)',
      'Contract End Date',
      'Notice Period (Days)',
      'Notes',
    ];
    const rows = contractors.map((c) => [
      `"${c.discipline.replace(/"/g, '""')}"`,
      `"${c.contractorName.replace(/"/g, '""')}"`,
      c.annualSpend,
      c.endDate,
      c.noticePeriodDays,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EntireFM-Contractor-Consolidation-Audit-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="Contractor Consolidation Audit"
          eyebrow="COMMERCIAL PROCUREMENT & CONSOLIDATION TIMELINE"
          purpose="Map fragmented facilities contractors across your estate, track contractual notice trigger deadlines, and identify strategic consolidation windows before automatic rollover traps occur."
          timeEstimate="2 min"
          outputs={['Timeline Visualisation', 'Fragmentation Summary', 'PDF Executive Pack']}
        >
          <div className="space-y-8">
            {/* 1. REAL-TIME FRAGMENTATION KPI SUMMARY CARDS */}
            <section aria-labelledby="fragmentation-summary-heading">
              <h2 id="fragmentation-summary-heading" className="sr-only">
                Estate Contractor Fragmentation Summary
              </h2>
              <ContractorFragmentationSummary summary={summary} />
            </section>

            {/* 2. REPEATABLE CONTRACTOR ENTRY WORKSPACE (Phase 1 Focus) */}
            <section aria-labelledby="contractor-workspace-heading" className="space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-electric" />
                    <span className="text-[11px] tracking-widest text-slate-500 uppercase font-light">
                      Step 1 / Contractor &amp; Agreement Inventory
                    </span>
                  </div>
                  <h2 id="contractor-workspace-heading" className="text-2xl font-light text-slate-900 mt-1">
                    Manage Outsourced Supplier Agreements
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-light mt-1 max-w-3xl">
                    Add each outsourced maintenance provider below. The system automatically computes
                    statutory and contractual notice trigger dates, flags rollover traps, and isolates
                    clustering windows across your estate.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-normal transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset 6-Supplier Sample</span>
                  </button>
                </div>
              </div>

              {/* Form & Table Layout: Two columns on large screens */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Column (5 cols) */}
                <div className="lg:col-span-5">
                  <ContractorEntryForm
                    onAddContractor={handleAddContractor}
                    onUpdateContractor={handleUpdateContractor}
                    editingContractor={editingContractor}
                    onCancelEdit={() => setEditingContractor(null)}
                  />
                </div>

                {/* Table Column (7 cols) */}
                <div className="lg:col-span-7">
                  <ContractorListTable
                    contractors={contractors}
                    onEditContractor={(c) => setEditingContractor(c)}
                    onDeleteContractor={handleDeleteContractor}
                    onDuplicateContractor={handleDuplicateContractor}
                    onClearAll={handleClearAll}
                    onLoadSample={handleLoadSample}
                  />
                </div>
              </div>
            </section>

            {/* 3. PHASE 2 PREVIEW / PLACEHOLDER: 24-MONTH VISUAL TIMELINE & CLUSTERING */}
            <section className="bg-white border border-dashed border-slate-300 rounded-sm p-6 sm:p-8 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-electric/10 text-brand-electric text-xs font-medium">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Phase 2 Next: 24-Month Visual Timeline Engine</span>
              </div>
              <div className="max-w-2xl mx-auto space-y-2">
                <h3 className="text-lg font-light text-slate-900">
                  Renewal &amp; Notice Timeline Visualization
                </h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  Once you review and approve the repeatable contractor-entry pattern above, we will render
                  the 24-month visual timeline mapping each supplier’s notice deadline and contract end date,
                  highlighting high-leverage renewal clusters and expired notice traps.
                </p>
              </div>
            </section>

            {/* 4. EXPORT TOOLBAR */}
            <ExportToolbar
              toolName="Contractor Consolidation Audit"
              onDownloadCsv={handleDownloadCsv}
              csvLabel="Export CSV Data"
              pdfLabel="Download PDF Appraisal"
              extraActions={
                <span className="text-[11px] text-slate-400 font-light hidden sm:inline-block">
                  PDF appraisal available upon confirmation
                </span>
              }
            />

            {/* 5. STRATEGIC CONVERSION CTA */}
            <ToolConversionCTA
              toolName="Contractor Consolidation Audit"
              heading="Ready to eliminate contractor fragmentation?"
              subheading="EntireFM delivers unified Hard &amp; Soft facilities management with dedicated commercial managers, guaranteed SLAs, and single-source invoicing across your commercial portfolio."
              primaryActionLabel="Schedule Consolidation Appraisal"
              primaryActionHref="/contact-us#enquiry"
            />
          </div>
        </ToolShell>
      </div>
      <Footer />
    </div>
  );
}
