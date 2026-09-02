'use client';

import { useState } from 'react';
import EmptyState from '@/components/admin/EmptyState';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Briefcase } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1.5 border-b border-[#E8E8E5] pb-2">
        {(['OFFERED', 'ACCEPTED', 'ALL'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#FFFFFF] text-[#EA580C] border border-[#E8E8E5] shadow-xs'
                : 'text-[#6D6D68] hover:text-[#111111] hover:bg-[#FFFFFF]'
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
        <div className="space-y-3">
          {filtered.map(assignment => (
            <div
              key={assignment.id}
              className="bg-[#FFFFFF] border border-[#E8E8E5] rounded-[8px] p-5 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#111111] font-mono">
                    {assignment.work_order_id ? `WO-${assignment.work_order_id.slice(0, 8)}` : assignment.id.slice(0, 8)}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-[4px] font-semibold ${
                      assignment.status === 'OFFERED'
                        ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                        : assignment.status === 'ACCEPTED'
                        ? 'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                        : assignment.status === 'REJECTED'
                        ? 'bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]'
                        : 'bg-[#FAFAF8] text-[#6D6D68] border border-[#E8E8E5]'
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <div className="text-[11.5px] text-[#6D6D68] flex items-center gap-1 font-normal">
                  <Clock className="w-3.5 h-3.5 text-[#9A9A95]" />
                  <span>{new Date(assignment.created_at).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {assignment.status === 'OFFERED' && (
                <div className="flex gap-2.5 pt-3 border-t border-[#E8E8E5]">
                  <button
                    onClick={() => handleAccept(assignment.id)}
                    disabled={loadingId === assignment.id}
                    className="flex-1 bg-[#15803D] hover:bg-[#166534] text-white font-medium py-2 rounded-[6px] text-xs transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {loadingId === assignment.id ? 'Processing...' : 'Accept Job Offer'}
                  </button>
                  <button
                    onClick={() => setDeclineModalId(assignment.id)}
                    disabled={loadingId === assignment.id}
                    className="flex-1 bg-[#FFFFFF] border border-[#FECDD3] text-[#E11D48] hover:bg-[#FFF1F2] font-medium py-2 rounded-[6px] text-xs transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E8E8E5] rounded-[8px] max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
              Decline Work Assignment
            </h3>
            <p className="text-xs text-[#6D6D68] leading-relaxed">
              Please provide the operational reason for declining. EntireFM dispatch will re-route this requirement.
            </p>

            <div>
              <label className="text-xs font-medium text-[#111111] block mb-1">Reason *</label>
              <select
                value={declineReason}
                onChange={e => setDeclineReason(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E8E8E5] rounded-[6px] p-2 text-xs text-[#111111] focus:border-[#EA580C] focus:outline-none"
              >
                <option value="">Select reason...</option>
                {declineReasons.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#111111] block mb-1">Notes</label>
              <textarea
                value={declineNotes}
                onChange={e => setDeclineNotes(e.target.value)}
                placeholder="Optional explanation..."
                className="w-full bg-[#FFFFFF] border border-[#E8E8E5] rounded-[6px] p-2 text-xs text-[#111111] h-20 resize-none focus:border-[#EA580C] focus:outline-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeclineModalId(null)}
                className="flex-1 border border-[#E8E8E5] bg-[#FAFAF8] py-1.5 rounded-[6px] text-xs text-[#6D6D68] hover:bg-[#FFFFFF] hover:text-[#111111] font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                disabled={!declineReason || loadingId !== null}
                className="flex-1 bg-[#E11D48] hover:bg-[#BE123C] text-white font-medium py-1.5 rounded-[6px] text-xs disabled:opacity-50 shadow-xs"
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
