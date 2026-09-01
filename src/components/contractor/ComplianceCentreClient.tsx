'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import {
  ContractorComplianceSummary,
  EvaluatedRequirement,
  ComplianceCategory,
} from '@/server/contractor/compliance-engine';
import { DocumentUploadModal } from './DocumentUploadModal';

interface Props {
  initialSummary: ContractorComplianceSummary;
  orgId: string;
}

export function ComplianceCentreClient({ initialSummary, orgId }: Props) {
  const [summary, setSummary] = useState<ContractorComplianceSummary>(initialSummary);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    INSURANCE: true,
    HEALTH_AND_SAFETY: true,
    TRADE_SPECIFIC: true,
  });
  const [selectedReqForUpload, setSelectedReqForUpload] = useState<EvaluatedRequirement | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const refreshSummary = async () => {
    try {
      const res = await fetch(`/api/contractor/compliance/requirements?orgId=${encodeURIComponent(orgId)}`);
      const data = await res.json();
      if (data.complianceScorePct !== undefined) {
        setSummary(data);
      }
    } catch (err) {
      console.error('Failed to refresh compliance summary:', err);
    }
  };

  const isRestricted = summary.operationalStatus === 'RESTRICTED';
  const isSuspended = summary.operationalStatus === 'SUSPENDED';

  return (
    <div className="space-y-8">
      {/* 1. Top Executive Compliance Command Header */}
      <div className="rounded-2xl border border-brand-edge-dark bg-gradient-to-r from-brand-carbon via-brand-carbon/90 to-brand-void p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              COMPLIANCE INTELLIGENCE &bull; {summary.contractorName}
            </span>
            <span
              className={`text-[11px] font-normal px-2.5 py-0.5 rounded border ${
                summary.operationalStatus === 'COMPLIANT'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : summary.operationalStatus === 'COMPLIANT_RENEWALS_UPCOMING'
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : summary.operationalStatus === 'RESTRICTED'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {summary.operationalStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Supply Chain Compliance Control Centre
          </h1>
          <p className="text-xs text-brand-mist/70 max-w-2xl font-light">
            Continuous verification of statutory insurances, trade body accreditations, health &amp; safety standards, and workforce competency.
          </p>
        </div>

        {/* Big Score Gauge */}
        <div className="flex items-center gap-6 bg-brand-void/60 border border-brand-edge-dark p-4 rounded-xl shrink-0">
          <div>
            <span className="text-[10px] font-normal text-brand-mist/50 uppercase block">Compliance Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-4xl font-light tracking-tight ${
                  summary.complianceScorePct >= 90
                    ? 'text-emerald-400 font-normal'
                    : summary.complianceScorePct >= 70
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {summary.complianceScorePct}%
              </span>
            </div>
            <span className="text-[10.5px] font-normal text-brand-mist/40 mt-0.5 block">
              {summary.totalSatisfiedMandatory} of {summary.totalApplicableMandatory} mandatory controls satisfied
            </span>
          </div>
        </div>
      </div>

      {/* Critical Operational Warning Banner if Restricted */}
      {isRestricted && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-5 flex items-start gap-4 shadow-lg">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-rose-200">Work Order Dispatch Restricted</h3>
            <p className="text-xs text-rose-200/80 font-light leading-relaxed">
              One or more mandatory compliance requirements (such as Public Liability insurance) have expired or require immediate verification. EntireFM will not dispatch new field assignments until valid evidence is submitted and verified.
            </p>
          </div>
        </div>
      )}

      {/* Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Critical Actions</span>
          <p className={`text-2xl font-light mt-1 ${summary.criticalActionsCount > 0 ? 'text-rose-400 font-normal' : 'text-white'}`}>
            {summary.criticalActionsCount}
          </p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Blocks work allocation</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Upcoming Renewals</span>
          <p className={`text-2xl font-light mt-1 ${summary.upcomingRenewalsCount > 0 ? 'text-amber-400 font-normal' : 'text-white'}`}>
            {summary.upcomingRenewalsCount}
          </p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Expiring within 30 days</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Under Review</span>
          <p className="text-2xl font-light text-cyan-400 mt-1">{summary.underReviewCount}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">EntireFM verification pending</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Total Requirements</span>
          <p className="text-2xl font-light text-white mt-1">{summary.requirements.filter((r) => r.isApplicable).length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Applicable to your profile</span>
        </div>
      </div>

      {/* 2. Priority Actions Required Queue */}
      {summary.actions.length > 0 && (
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Compliance Actions Required ({summary.actions.length})</h2>
            </div>
            <span className="text-xs font-normal text-brand-mist/50">Prioritised by urgency</span>
          </div>

          <div className="divide-y divide-brand-edge-dark/30">
            {summary.actions.map((act) => (
              <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        act.priority === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : act.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-brand-void text-brand-mist border border-brand-edge-dark'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-sm font-normal text-white">{act.title}</span>
                  </div>
                  <p className="text-xs text-brand-mist/70 font-light">{act.reason}</p>
                </div>

                <button
                  onClick={() => {
                    const req = summary.requirements.find((r) => r.code === act.requirementCode);
                    setSelectedReqForUpload(req || null);
                    setIsUploadModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric/85 transition-colors shrink-0 self-start sm:self-auto shadow-md shadow-brand-electric/20"
                >
                  {act.resolutionCta} &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Structured Categories View */}
      <div className="space-y-4">
        <h2 className="text-base font-light text-white tracking-tight">Compliance Requirements by Category</h2>

        <div className="space-y-3">
          {summary.categories.map((catSummary) => {
            const isExpanded = expandedCategories[catSummary.category] ?? false;
            const categoryReqs = summary.requirements.filter((r) => r.category === catSummary.category && r.isApplicable);

            return (
              <div key={catSummary.category} className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
                {/* Category Header Bar */}
                <button
                  onClick={() => toggleCategory(catSummary.category)}
                  className="w-full p-4 flex items-center justify-between bg-brand-void/50 hover:bg-brand-void/80 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-normal text-white">{catSummary.title}</span>
                    <span className="text-xs font-normal text-brand-mist/50">
                      ({catSummary.satisfiedCount}/{catSummary.totalApplicable} Valid)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10.5px] font-normal px-2 py-0.5 rounded border ${
                        catSummary.status === 'COMPLIANT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : catSummary.status === 'WARNING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : catSummary.status === 'UNDER_REVIEW'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {catSummary.status}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-brand-mist/50" /> : <ChevronDown className="w-4 h-4 text-brand-mist/50" />}
                  </div>
                </button>

                {/* Category Requirements List */}
                {isExpanded && (
                  <div className="divide-y divide-brand-edge-dark/30 p-2">
                    {categoryReqs.map((req) => (
                      <div key={req.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-brand-void/30 rounded-lg transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-white">{req.title}</span>
                            {req.criticality === 'CRITICAL' && (
                              <span className="text-[9px] font-normal px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                                CRITICAL
                              </span>
                            )}
                          </div>
                          <p className="text-[11.5px] text-brand-mist/60 font-light max-w-xl">{req.description}</p>

                          {req.evidenceFileName && (
                            <div className="flex items-center gap-2 pt-0.5">
                              <span className="text-[11px] font-normal text-brand-mist/50">
                                File: {req.evidenceFileName} {req.expiryDate ? `&bull; Exp: ${req.expiryDate}` : ''}
                              </span>
                            </div>
                          )}

                          {req.rejectionReason && (
                            <p className="text-xs text-rose-300 font-light mt-1">
                              <strong>Rejection feedback:</strong> {req.rejectionReason}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-medium border ${
                              req.state === 'COMPLIANT'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : req.state === 'EXPIRING'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : req.state === 'EXPIRED'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold'
                                : req.state === 'UNDER_REVIEW'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                : req.state === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-brand-void text-brand-mist/50 border-brand-edge-dark'
                            }`}
                          >
                            {req.state}
                          </span>

                          <button
                            onClick={() => {
                              setSelectedReqForUpload(req);
                              setIsUploadModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-brand-edge-dark bg-brand-void text-brand-mist hover:text-white hover:border-brand-electric text-xs transition-colors"
                          >
                            {req.state === 'COMPLIANT' || req.state === 'EXPIRING' ? 'Replace' : 'Upload Evidence'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={refreshSummary}
        orgId={orgId}
        defaultRequirementCode={selectedReqForUpload?.code}
        defaultCategory={selectedReqForUpload?.category || 'INSURANCE'}
        defaultTitle={selectedReqForUpload?.title || ''}
      />
    </div>
  );
}
