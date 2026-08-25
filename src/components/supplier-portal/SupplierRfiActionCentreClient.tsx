'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Upload, MessageSquare, ArrowRight, Clock, FileText, Send } from 'lucide-react';
import { SupplierRfiRecord } from '@/server/suppliers/rfi-store';

interface Props {
  initialRfis: SupplierRfiRecord[];
  supplierId: string;
}

export function SupplierRfiActionCentreClient({ initialRfis, supplierId }: Props) {
  const [rfis, setRfis] = useState<SupplierRfiRecord[]>(initialRfis);
  const [activeRfiId, setActiveRfiId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pendingRfis = rfis.filter((r) => r.status === 'ACTION_REQUIRED');
  const submittedRfis = rfis.filter((r) => r.status === 'RESPONSE_SUBMITTED' || r.status === 'RESOLVED');

  const handleRespond = async (rfiId: string) => {
    if (!responseText.trim()) return;
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/supplier/application/rfi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfiId,
          supplierId,
          responseText,
          documentId: documentName ? `doc-${Date.now()}` : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRfis((prev) =>
          prev.map((r) => (r.id === rfiId ? { ...r, status: 'RESPONSE_SUBMITTED', supplier_response_text: responseText } : r))
        );
        setActiveRfiId(null);
        setResponseText('');
        setDocumentName('');
        setSuccessMessage('Response submitted successfully for review without any additional fee.');
      }
    } catch (err) {
      console.error('Error submitting RFI response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Pending Action Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
            Action Required ({pendingRfis.length})
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            No fee for submitting requested information
          </span>
        </div>

        {pendingRfis.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-sm text-center text-xs text-slate-500 font-light">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <span>No pending clarification requests. All information is currently with the EntireFM assurance desk.</span>
          </div>
        ) : (
          pendingRfis.map((rfi) => {
            const isReplying = activeRfiId === rfi.id;
            return (
              <div
                key={rfi.id}
                className="bg-white border-2 border-amber-300 p-5 rounded-sm shadow-sm space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {rfi.section_key.toUpperCase()} RFI
                      </span>
                      <span className="text-slate-400 text-[10.5px] font-mono">Ref: {rfi.id}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{rfi.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {rfi.requirement_description}
                    </p>
                  </div>
                  {rfi.due_date && (
                    <span className="text-[10.5px] font-mono text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200 self-start">
                      Due: {rfi.due_date}
                    </span>
                  )}
                </div>

                {isReplying ? (
                  <div className="pt-3 border-t border-slate-200 space-y-3 bg-slate-50 p-4 rounded">
                    <label className="block text-xs font-bold text-slate-900">
                      Your Response / Clarification:
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Provide the requested details or update context here..."
                      rows={3}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-slate-900 font-sans"
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 text-xs">
                        <label className="btn-secondary text-[11px] py-1.5 px-3 cursor-pointer flex items-center gap-1.5">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{documentName || 'Attach Evidence File (PDF/JPG)'}</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) setDocumentName(e.target.files[0].name);
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveRfiId(null)}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!responseText.trim() || isSubmitting}
                          onClick={() => handleRespond(rfi.id)}
                          className="btn-primary text-xs py-1.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Requested Information</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setActiveRfiId(rfi.id);
                        setResponseText('');
                      }}
                      className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 font-bold"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Respond to Request &rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Submitted / Resolved History */}
      {submittedRfis.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans block">
            Clarification History ({submittedRfis.length})
          </span>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-sm bg-white">
            {submittedRfis.map((rfi) => (
              <div key={rfi.id} className="p-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rfi.title}</span>
                  <span className="text-emerald-700 font-mono font-bold text-[10.5px]">
                    {rfi.status.replace('_', ' ')}
                  </span>
                </div>
                {rfi.supplier_response_text && (
                  <p className="text-slate-600 text-[11px] font-sans bg-slate-50 p-2.5 rounded">
                    <strong>Response:</strong> {rfi.supplier_response_text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
