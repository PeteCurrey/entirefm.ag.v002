'use client';

import React, { useState } from 'react';
import { SupplierOpportunityRecord, DeclineReason, OpportunityResponseDecision } from '@/server/allocation/allocation-types';
import {
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  Send,
  X,
  PoundSterling,
} from 'lucide-react';

interface OpportunitiesListClientProps {
  initialOpportunities: SupplierOpportunityRecord[];
  contractorOrgId: string;
}

export function OpportunitiesListClient({
  initialOpportunities,
  contractorOrgId,
}: OpportunitiesListClientProps) {
  const [opportunities, setOpportunities] = useState<SupplierOpportunityRecord[]>(initialOpportunities);
  const [activeModalOpp, setActiveModalOpp] = useState<SupplierOpportunityRecord | null>(null);
  const [responseMode, setResponseMode] = useState<'QUOTE' | 'DECLINE' | 'ACCEPT'>('QUOTE');

  // Form states
  const [quotedPrice, setQuotedPrice] = useState<string>('');
  const [leadTimeHours, setLeadTimeHours] = useState<string>('24');
  const [plannedDate, setPlannedDate] = useState<string>('');
  const [declineReason, setDeclineReason] = useState<DeclineReason>('NO_CAPACITY');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [respondedIds, setRespondedIds] = useState<Record<string, string>>({});

  const openModal = (opp: SupplierOpportunityRecord, defaultMode: 'QUOTE' | 'DECLINE' | 'ACCEPT' = 'QUOTE') => {
    setActiveModalOpp(opp);
    setResponseMode(defaultMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setQuotedPrice(opp.not_to_exceed_gbp ? String(opp.not_to_exceed_gbp) : '');
    setLeadTimeHours('24');
    setPlannedDate('');
    setDeclineReason('NO_CAPACITY');
    setNotes('');
  };

  const closeModal = () => {
    setActiveModalOpp(null);
    setErrorMsg(null);
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOpp) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    let decision: OpportunityResponseDecision = 'SUBMIT_QUOTE';
    if (responseMode === 'DECLINE') decision = 'DECLINE';
    if (responseMode === 'ACCEPT') decision = 'ACCEPT';

    if (decision === 'SUBMIT_QUOTE' && (!quotedPrice || isNaN(Number(quotedPrice)) || Number(quotedPrice) <= 0)) {
      setErrorMsg('Please provide a valid quote price greater than £0.00');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        decision,
        notes: notes.trim() || undefined,
      };

      if (decision === 'SUBMIT_QUOTE') {
        payload.quoted_price_gbp = Number(quotedPrice);
        payload.quoted_lead_time_hours = leadTimeHours ? Number(leadTimeHours) : undefined;
        payload.planned_attendance_date = plannedDate ? new Date(plannedDate).toISOString() : undefined;
      } else if (decision === 'DECLINE') {
        payload.decline_reason = declineReason;
      } else if (decision === 'ACCEPT') {
        payload.planned_attendance_date = plannedDate ? new Date(plannedDate).toISOString() : undefined;
      }

      const res = await fetch(`/api/supplier-portal/opportunities/${activeModalOpp.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit response');
      }

      // Mark opportunity as responded locally
      setRespondedIds((prev) => ({
        ...prev,
        [activeModalOpp.id]: decision === 'DECLINE' ? 'Declined' : decision === 'SUBMIT_QUOTE' ? `Quoted £${Number(quotedPrice).toFixed(2)}` : 'Accepted',
      }));

      setSuccessMsg(data.message || 'Response submitted successfully.');
      setTimeout(() => {
        closeModal();
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {opportunities.length > 0 ? (
        <div className="space-y-4">
          {opportunities.map((o) => {
            const hasResponded = Boolean(respondedIds[o.id]);
            const responseLabel = respondedIds[o.id];

            return (
              <div
                key={o.id}
                className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4 text-xs font-light transition-all hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 font-sans text-base">{o.title}</h3>
                    <span className="text-slate-400 text-[11px]">
                      Ref: {o.id} &middot; Type: {o.opportunity_type.replace(/_/g, ' ')} &middot; Priority: {o.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasResponded ? (
                      <span className="text-blue-800 bg-blue-50 font-medium px-2.5 py-1 rounded text-xs">
                        {responseLabel}
                      </span>
                    ) : (
                      <span className="text-emerald-800 bg-emerald-100 font-medium px-2.5 py-1 rounded text-xs">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-700 font-sans text-xs leading-relaxed">{o.scope_summary}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-600 bg-slate-50 p-3 rounded">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Location</span>
                    <strong>{o.site_city}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Commercial Basis</span>
                    <strong>{o.commercial_basis.replace(/_/g, ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Budget / NTE</span>
                    <strong>{o.not_to_exceed_gbp ? `£${o.not_to_exceed_gbp.toFixed(2)}` : 'To Be Quoted'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Response Deadline</span>
                    <strong>{new Date(o.response_deadline).toLocaleDateString('en-GB')}</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400">
                    Trade Slug: <code className="text-slate-600 font-mono">{o.service_slug}</code>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasResponded ? (
                      <button
                        disabled
                        className="px-4 py-1.5 text-xs font-medium text-slate-400 bg-slate-100 rounded-sm cursor-not-allowed"
                      >
                        Response Submitted
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => openModal(o, 'DECLINE')}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 rounded-sm transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => openModal(o, 'QUOTE')}
                          className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-sm shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          Submit Quotation &rarr;
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-sm space-y-2">
          <Building2 className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-800">No open project opportunities</p>
          <p className="text-slate-500 text-[11.5px]">
            Regional subcontract tenders, scheduled PPM renewals, and quoted work requests addressed to your organisation
            will appear here for your review and bidding.
          </p>
        </div>
      )}

      {/* Interactive Response Modal */}
      {activeModalOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-sm shadow-xl max-w-lg w-full overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  RESPOND TO WORK OPPORTUNITY
                </span>
                <h2 className="text-sm font-semibold truncate mt-0.5">{activeModalOpp.title}</h2>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Opportunity Context Banner */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Location</span>
                <strong>{activeModalOpp.site_city}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Basis</span>
                <strong>{activeModalOpp.commercial_basis.replace(/_/g, ' ')}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">NTE Budget</span>
                <strong>{activeModalOpp.not_to_exceed_gbp ? `£${activeModalOpp.not_to_exceed_gbp.toFixed(2)}` : 'Open'}</strong>
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-slate-200 bg-slate-100/60 p-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setResponseMode('QUOTE');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 text-center font-medium text-xs rounded transition-colors ${
                  responseMode === 'QUOTE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Submit Quote
              </button>
              <button
                type="button"
                onClick={() => {
                  setResponseMode('DECLINE');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 text-center font-medium text-xs rounded transition-colors ${
                  responseMode === 'DECLINE' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Decline
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitResponse} className="p-5 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {responseMode === 'QUOTE' && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-medium text-[11px]">
                      Quoted Fixed Price (£ net) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-mono">£</span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={quotedPrice}
                        onChange={(e) => setQuotedPrice(e.target.value)}
                        placeholder="e.g. 450.00"
                        className="w-full pl-7 pr-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:border-slate-900 focus:outline-hidden"
                      />
                    </div>
                    {activeModalOpp.not_to_exceed_gbp && Number(quotedPrice) > activeModalOpp.not_to_exceed_gbp && (
                      <p className="text-amber-600 text-[10.5px]">
                        Note: Quote exceeds stated client NTE limit of £{activeModalOpp.not_to_exceed_gbp.toFixed(2)}. Special approval required.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-slate-700 font-medium text-[11px]">Lead Time (Hours)</label>
                      <input
                        type="number"
                        min="1"
                        value={leadTimeHours}
                        onChange={(e) => setLeadTimeHours(e.target.value)}
                        placeholder="24"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-slate-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-700 font-medium text-[11px]">Target Attendance Date</label>
                      <input
                        type="date"
                        value={plannedDate}
                        onChange={(e) => setPlannedDate(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-medium text-[11px]">Scope &amp; Operative Notes</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Outline attendance plan, materials inclusions, or qualifications..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-slate-900 focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              {responseMode === 'DECLINE' && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-medium text-[11px]">
                      Reason for Declining <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value as DeclineReason)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-slate-900 focus:outline-hidden bg-white"
                    >
                      <option value="NO_CAPACITY">No Capacity / Fully Committed</option>
                      <option value="OUTSIDE_AREA">Outside Geographic Coverage Area</option>
                      <option value="SKILL_UNAVAILABLE">Specialist Skill Currently Unavailable</option>
                      <option value="PARTS_UNAVAILABLE">Required Parts / Materials Unavailable</option>
                      <option value="SLA_UNACHIEVABLE">Target Attendance Window Unachievable</option>
                      <option value="COMMERCIAL_RATE">Commercial Rate / Budget Mismatch</option>
                      <option value="OTHER">Other Reason</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-medium text-[11px]">Additional Feedback</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Help us route future opportunities by providing details..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:border-slate-900 focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-1.5 text-xs font-medium text-white rounded-sm shadow-sm transition-colors flex items-center gap-1.5 ${
                    responseMode === 'DECLINE' ? 'bg-rose-700 hover:bg-rose-800' : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : responseMode === 'DECLINE' ? (
                    'Confirm Decline'
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Submit Quotation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
