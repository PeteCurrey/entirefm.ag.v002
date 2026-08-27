'use client';

import { useState } from 'react';
import type { ContractorActionRecord, ActionType } from '@/server/intelligence/intelligence-engine';
import type { NormalisedIntelligenceItem } from '@/server/intelligence/intelligence-engine';

interface IntelligenceActionModalProps {
  item: NormalisedIntelligenceItem;
  contractorOrgId: string;
  onClose: () => void;
  onActionRecorded: (record: ContractorActionRecord) => void;
  onAcknowledged: () => void;
}

const ACTION_LABELS: Record<ActionType, string> = {
  MARK_REVIEWED: 'Mark as reviewed',
  ASSIGN: 'Assign to team member',
  NOT_APPLICABLE: 'Not applicable to us',
  UPLOAD_EVIDENCE: 'Upload supporting document',
  LINK_REQUIREMENT: 'Link to compliance requirement',
  ADD_NOTE: 'Add internal note',
  REQUEST_CLARIFICATION: 'Request EntireFM clarification',
  ACKNOWLEDGE: 'Acknowledge',
};

export function IntelligenceActionModal({
  item,
  onClose,
  onActionRecorded,
  onAcknowledged,
}: IntelligenceActionModalProps) {
  const [actionType, setActionType] = useState<ActionType>('MARK_REVIEWED');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [notApplicableReason, setNotApplicableReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (actionType === 'ACKNOWLEDGE') {
        const res = await fetch('/api/contractor/intelligence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ACKNOWLEDGE', intelligenceItemId: item.id }),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to acknowledge');
        onAcknowledged();
        onClose();
        return;
      }

      const res = await fetch('/api/contractor/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intelligenceItemId: item.id,
          actionType,
          assignedTo: assignedTo || undefined,
          dueDate: dueDate || undefined,
          internalNote: internalNote || undefined,
          notApplicableReason: notApplicableReason || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Action failed');
      const data = await res.json();
      onActionRecorded(data.action);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const tierColour = item.authorityTier === 1
    ? 'bg-blue-100 text-blue-800'
    : item.authorityTier === 2
    ? 'bg-purple-100 text-purple-800'
    : 'bg-gray-100 text-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tierColour}`}>
                  Tier {item.authorityTier} Source
                </span>
                <span className="text-xs text-gray-500">{item.sourceName}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 leading-snug">{item.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Legal notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <strong>Important:</strong> EntireFM summaries are for awareness only. They do not constitute legal advice or impose obligations. Consult your legal or compliance adviser before taking regulatory action.
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">EntireFM Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{item.entirefmSummary}</p>
          </div>

          {item.suggestedContractorAction && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Suggested Action to Consider</h3>
              <p className="text-sm text-gray-600 leading-relaxed italic">{item.suggestedContractorAction}</p>
            </div>
          )}

          {/* Action form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record your response</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as ActionType)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {(Object.entries(ACTION_LABELS) as [ActionType, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {actionType === 'ASSIGN' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Name or email of team member"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {(actionType === 'ASSIGN' || actionType === 'MARK_REVIEWED') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due date (optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {actionType === 'NOT_APPLICABLE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason not applicable</label>
                <textarea
                  value={notApplicableReason}
                  onChange={(e) => setNotApplicableReason(e.target.value)}
                  placeholder="e.g. We do not work on higher-risk buildings; this regulation does not apply to our scope."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}

            {['ADD_NOTE', 'REQUEST_CLARIFICATION', 'MARK_REVIEWED', 'ASSIGN'].includes(actionType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal note (optional)</label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Your internal notes on this item…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition-colors"
              >
                {submitting ? 'Saving…' : ACTION_LABELS[actionType]}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Footer — source link */}
        <div className="px-6 pb-5">
          <a
            href={item.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline break-all"
          >
            View primary source: {item.canonicalUrl}
          </a>
          <p className="text-xs text-gray-400 mt-1">Licence: {item.rightsLicence}</p>
        </div>
      </div>
    </div>
  );
}
