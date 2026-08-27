'use client';

import { useState } from 'react';
import type {
  EntireFMTenderRecord,
  TenderBidStage,
} from '@/server/intelligence/intelligence-engine';
import { ENTIREFM_CORE_SERVICES } from '@/server/intelligence/intelligence-engine';

interface AdminTenderRadarClientProps {
  initialTenders: EntireFMTenderRecord[];
}

const STAGES: { id: TenderBidStage | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Opportunities' },
  { id: 'NEW', label: 'New' },
  { id: 'REVIEWING', label: 'Reviewing' },
  { id: 'BID_DECISION', label: 'Bid Decision' },
  { id: 'BID_PLANNED', label: 'Bid Planned' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'SUBMITTED', label: 'Submitted' },
  { id: 'WON', label: 'Won' },
  { id: 'LOST', label: 'Lost' },
];

export function AdminTenderRadarClient({ initialTenders }: AdminTenderRadarClientProps) {
  const [tenders, setTenders] = useState<EntireFMTenderRecord[]>(initialTenders);
  const [selectedStage, setSelectedStage] = useState<TenderBidStage | 'ALL'>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTender, setActiveTender] = useState<EntireFMTenderRecord | null>(null);

  // Pipeline update state
  const [targetStage, setTargetStage] = useState<TenderBidStage>('REVIEWING');
  const [assignedTo, setAssignedTo] = useState('');
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter tenders
  const filteredTenders = tenders.filter((t) => {
    if (selectedStage !== 'ALL' && t.bidStage !== selectedStage) return false;
    if (selectedService !== 'ALL' && !t.matchedServices.includes(selectedService)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${t.opportunity.title} ${t.opportunity.buyerName} ${t.opportunity.buyerRegion}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  async function handleUpdatePipeline(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTender) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/intelligence/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderId: activeTender.id,
          bidStage: targetStage,
          assignedTo: assignedTo || undefined,
          note: noteText || undefined,
        }),
      });

      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update tender');
      const data = await res.json();

      setTenders((prev) => prev.map((t) => (t.id === data.tender.id ? data.tender : t)));
      setActiveTender(data.tender);
      setNoteText('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                EntireFM Internal BD
              </span>
              <span className="text-xs text-slate-400">Strictly confidential • Not shared with contractors</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Public Sector Tender Radar & Bid Pipeline</h1>
            <p className="text-slate-300 text-sm mt-1">
              Live algorithmic matching of Contracts Finder & Find a Tender notices against EntireFM core service capabilities.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
              <span className="block text-2xl font-bold text-indigo-300">{tenders.length}</span>
              <span className="text-[10px] text-slate-300 uppercase">Tracked</span>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
              <span className="block text-2xl font-bold text-emerald-400">
                {tenders.filter((t) => t.matchStrength === 'STRONG').length}
              </span>
              <span className="text-[10px] text-slate-300 uppercase">Strong Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Stage Filter */}
        <div className="flex overflow-x-auto gap-1 pb-2 lg:pb-0 w-full lg:w-auto">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStage(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStage === s.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Service filter & search */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none"
          >
            <option value="ALL">All EntireFM Services</option>
            {ENTIREFM_CORE_SERVICES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search tender notices…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none"
          />
        </div>
      </div>

      {/* Tender List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTenders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No tender opportunities found matching the selected stage and filter criteria.
          </div>
        ) : (
          filteredTenders.map((record) => {
            const { opportunity, matchScore, matchStrength, matchReasons, deadlineUrgency, bidStage } = record;

            return (
              <div
                key={record.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        matchStrength === 'STRONG' ? 'bg-emerald-100 text-emerald-800' :
                        matchStrength === 'MODERATE' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        Match: {matchScore}% ({matchStrength})
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {opportunity.source} • OCID: {opportunity.ocid}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Stage: {bidStage.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-gray-900 leading-snug">{opportunity.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">{opportunity.buyerName} • {opportunity.buyerRegion}</p>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">{opportunity.description}</p>

                    {/* Match Reasons */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {matchReasons.map((r, idx) => (
                        <span key={idx} className="text-[10px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded">
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Commercials & Actions */}
                  <div className="flex flex-col items-start md:items-end justify-between gap-3 self-stretch border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                    <div className="text-left md:text-right">
                      {opportunity.estimatedValueFormatted && (
                        <span className="text-base font-bold text-gray-900 block">
                          {opportunity.estimatedValueFormatted}
                        </span>
                      )}
                      {opportunity.closingDate && (
                        <span className={`text-xs font-medium block mt-0.5 ${
                          deadlineUrgency === 'IMMINENT' ? 'text-rose-600 font-bold' : 'text-gray-500'
                        }`}>
                          Closing: {opportunity.closingDate}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => {
                          setActiveTender(record);
                          setTargetStage(record.bidStage);
                          setAssignedTo(record.assignedTo || '');
                        }}
                        className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap"
                      >
                        Manage Bid & Pipeline
                      </button>
                      <a
                        href={opportunity.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                      >
                        Notice ↗
                      </a>
                    </div>
                  </div>
                </div>

                {/* Internal Notes Preview */}
                {record.internalNotes.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block">Internal Bid Notes ({record.internalNotes.length}):</span>
                    {record.internalNotes.slice(-2).map((n) => (
                      <p key={n.id} className="text-slate-600">
                        <strong>{n.createdBy}:</strong> {n.note}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bid Management Modal */}
      {activeTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  EntireFM Bid Pipeline
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-2">{activeTender.opportunity.title}</h2>
              </div>
              <button
                onClick={() => setActiveTender(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdatePipeline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pipeline Stage</label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as TenderBidStage)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {STAGES.filter((s) => s.id !== 'ALL').map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Bid Lead</label>
                <input
                  type="text"
                  placeholder="EntireFM team member name/email"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Add Internal Note</label>
                <textarea
                  rows={3}
                  placeholder="Bid decision rationale, margin targets, partnering strategy…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  {submitting ? 'Updating…' : 'Save Pipeline Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTender(null)}
                  className="px-4 py-2.5 border border-gray-200 text-xs font-semibold rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
