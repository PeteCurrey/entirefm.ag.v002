'use client';

import { useState } from 'react';
import EmptyState from '@/components/admin/EmptyState';
import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface Assignment {
  id: string;
  work_order_id?: string;
  status: string;
  created_at: string;
  rejection_reason?: string;
}

export default function ContractorWorkClient({
  initialAssignments,
}: {
  initialAssignments: Assignment[];
}) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [activeTab, setActiveTab] = useState<'OFFERED' | 'ACCEPTED' | 'ALL'>('OFFERED');
  const [declineModalId, setDeclineModalId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [declineNotes, setDeclineNotes] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/contractor/assignments/${id}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(prev =>
          prev.map(a => (a.id === id ? { ...a, status: 'ACCEPTED' } : a))
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async () => {
    if (!declineModalId || !declineReason) return;
    setLoadingId(declineModalId);
    try {
      const res = await fetch(`/api/contractor/assignments/${declineModalId}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: declineReason, notes: declineNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(prev =>
          prev.map(a =>
            a.id === declineModalId
              ? { ...a, status: 'REJECTED', rejection_reason: declineReason }
              : a
          )
        );
        setDeclineModalId(null);
        setDeclineReason('');
        setDeclineNotes('');
      }
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = assignments.filter(a => {
    if (activeTab === 'OFFERED') return a.status === 'OFFERED';
    if (activeTab === 'ACCEPTED') return ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(a.status);
    return true;
  });

  const declineReasons = [
    { value: 'NO_RESOURCE', label: 'No resource / engineer available' },
    { value: 'OUTSIDE_CAPABILITY', label: 'Outside technical capability / trade' },
    { value: 'UNABLE_TO_MEET_SLA', label: 'Unable to meet required SLA attendance' },
    { value: 'COMMERCIAL_ISSUE', label: 'Commercial terms / rate issue' },
    { value: 'ACCESS_ISSUE', label: 'Geographic or access constraint' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-edge-dark pb-2">
        {(['OFFERED', 'ACCEPTED', 'ALL'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-brand-electric text-black'
                : 'text-brand-mist hover:text-white hover:bg-brand-carbon'
            }`}
          >
            {tab === 'OFFERED' ? 'New Offers' : tab === 'ACCEPTED' ? 'Active & Accepted' : 'All Work'}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'OFFERED' ? 'Pending Offers' : 'Assignments'} Found`}
          description="There are currently no work order assignments matching this filter."
          icon="Briefcase"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(assignment => (
            <div
              key={assignment.id}
              className="bg-brand-carbon border border-brand-edge-dark rounded-xl p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-white">
                    {assignment.work_order_id ? `WO-${assignment.work_order_id.slice(0, 8)}` : assignment.id.slice(0, 8)}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold ${
                      assignment.status === 'OFFERED'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : assignment.status === 'ACCEPTED'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : assignment.status === 'REJECTED'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-brand-void text-brand-mist'
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <div className="text-xs text-brand-mist flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(assignment.created_at).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {assignment.status === 'OFFERED' && (
                <div className="flex gap-3 pt-2 border-t border-brand-edge-dark">
                  <button
                    onClick={() => handleAccept(assignment.id)}
                    disabled={loadingId === assignment.id}
                    className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {loadingId === assignment.id ? 'Processing...' : 'Accept Job Offer'}
                  </button>
                  <button
                    onClick={() => setDeclineModalId(assignment.id)}
                    disabled={loadingId === assignment.id}
                    className="flex-1 bg-brand-void border border-red-800 text-red-400 hover:bg-red-950/40 font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    Decline...
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Decline Modal */}
      {declineModalId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Decline Work Assignment
            </h3>
            <p className="text-sm text-brand-mist">
              Please provide the operational reason for declining. EntireFM dispatch will re-route this requirement.
            </p>

            <div>
              <label className="text-xs font-semibold text-brand-mist block mb-1">Reason *</label>
              <select
                value={declineReason}
                onChange={e => setDeclineReason(e.target.value)}
                className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-2.5 text-sm text-white"
              >
                <option value="">Select reason...</option>
                {declineReasons.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-mist block mb-1">Notes</label>
              <textarea
                value={declineNotes}
                onChange={e => setDeclineNotes(e.target.value)}
                placeholder="Optional explanation..."
                className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-2.5 text-sm text-white h-20 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeclineModalId(null)}
                className="flex-1 border border-brand-edge-dark py-2 rounded-lg text-sm text-brand-mist hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                disabled={!declineReason || loadingId !== null}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
