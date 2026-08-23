'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, ChevronLeft, AlertTriangle, CheckCircle2, XCircle,
  Mic, Camera, Plus, Square, Navigation, PhoneOff, Bot, Sparkles,
  Search, ShieldAlert, FileText, Check, ArrowRight, ShieldCheck,
  Wrench, Upload, RefreshCw
} from 'lucide-react';

interface FieldJobScreenProps {
  visit: any;
  tasks: any[];
  readings: any[];
  parts: any[];
  serviceReport: any | null;
  session: { personId: string; displayName: string };
}

// ─── Priority badge ────────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    P1: 'bg-red-600 text-white',
    P2: 'bg-amber-500 text-black',
    P3: 'bg-brand-electric text-black',
    P4: 'bg-green-700 text-white',
    P5: 'bg-zinc-600 text-white',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${map[priority] || 'bg-zinc-700 text-white'}`}>
      {priority}
    </span>
  );
}

// ─── Status action button ──────────────────────────────────────────────────────
function StatusBar({
  visitId,
  status,
  onStatusChange,
}: {
  visitId: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [noAccessOpen, setNoAccessOpen] = useState(false);

  const callApi = async (endpoint: string, body?: object) => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleJourneyStart = async () => {
    const res = await callApi(`/api/engineer/visits/${visitId}/journey-start`);
    if (res.success) onStatusChange('EN_ROUTE');
  };

  const handleArrive = async () => {
    const res = await callApi(`/api/engineer/visits/${visitId}/arrive`, { method: 'MANUAL' });
    if (res.success) onStatusChange('ON_SITE');
  };

  const handleStartWork = async () => {
    const res = await callApi(`/api/engineer/visits/${visitId}/start-work`);
    if (res.success) onStatusChange('IN_PROGRESS');
  };

  if (status === 'COMPLETED') {
    return (
      <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
        <div>
          <span className="text-green-300 font-medium block">Visit completed</span>
          <span className="text-xs text-green-400/80">Service report submitted for review</span>
        </div>
      </div>
    );
  }

  if (status === 'NO_ACCESS') {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 flex items-center gap-3">
        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span className="text-red-300 font-medium">No access recorded</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {(status === 'PLANNED' || status === 'CONFIRMED') && (
        <button
          onClick={handleJourneyStart}
          disabled={loading}
          className="w-full bg-brand-electric text-black font-bold py-4 rounded-xl text-base hover:bg-brand-electric-bright transition-colors disabled:opacity-50 active:scale-98"
          style={{ minHeight: '56px' }}
        >
          {loading ? 'Starting…' : '🚗  Start Journey'}
        </button>
      )}
      {status === 'EN_ROUTE' && (
        <>
          <button
            onClick={handleArrive}
            disabled={loading}
            className="w-full bg-brand-electric text-black font-bold py-4 rounded-xl text-base hover:bg-brand-electric-bright transition-colors disabled:opacity-50 active:scale-98"
            style={{ minHeight: '56px' }}
          >
            {loading ? 'Recording…' : '📍  Arrived On Site'}
          </button>
          <button
            onClick={() => setNoAccessOpen(true)}
            className="w-full bg-transparent border border-red-700 text-red-400 font-medium py-3 rounded-xl text-sm hover:bg-red-900/20 transition-colors"
          >
            <PhoneOff className="w-4 h-4 inline mr-2" />
            No Access
          </button>
        </>
      )}
      {status === 'ON_SITE' && (
        <>
          <button
            onClick={handleStartWork}
            disabled={loading}
            className="w-full bg-brand-electric text-black font-bold py-4 rounded-xl text-base hover:bg-brand-electric-bright transition-colors disabled:opacity-50 active:scale-98"
            style={{ minHeight: '56px' }}
          >
            {loading ? 'Starting…' : '🔧  Start Work'}
          </button>
          <button
            onClick={() => setNoAccessOpen(true)}
            className="w-full bg-transparent border border-red-700 text-red-400 font-medium py-3 rounded-xl text-sm hover:bg-red-900/20 transition-colors"
          >
            <PhoneOff className="w-4 h-4 inline mr-2" />
            No Access
          </button>
        </>
      )}
      {noAccessOpen && (
        <NoAccessModal visitId={visitId} onClose={() => setNoAccessOpen(false)} onConfirm={(s) => { setNoAccessOpen(false); onStatusChange(s); }} />
      )}
    </div>
  );
}

// ─── No Access Modal ───────────────────────────────────────────────────────────
function NoAccessModal({ visitId, onClose, onConfirm }: { visitId: string; onClose: () => void; onConfirm: (status: string) => void }) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [contactAttempted, setContactAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: 'KEYBOX_FAILURE', label: 'Keybox failure' },
    { value: 'CONTACT_UNAVAILABLE', label: 'Contact unavailable' },
    { value: 'HAZARD_PRESENT', label: 'Hazard present' },
    { value: 'ACCESS_REFUSED', label: 'Access refused' },
    { value: 'WRONG_ADDRESS', label: 'Wrong address' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visitId}/no-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, notes, contactAttempted }),
      });
      const data = await res.json();
      if (data.success) onConfirm('NO_ACCESS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end" role="dialog" aria-modal="true" aria-label="Record no access">
      <div className="bg-brand-carbon rounded-t-2xl w-full p-6 space-y-4 pb-safe">
        <h2 className="text-white font-bold text-lg">Record No Access</h2>

        <div>
          <label className="text-brand-mist text-sm block mb-2">Reason *</label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-3 text-white"
          >
            <option value="">Select reason…</option>
            {reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div>
          <label className="text-brand-mist text-sm block mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-3 text-white h-20 resize-none"
            placeholder="Additional details…"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={contactAttempted}
            onChange={e => setContactAttempted(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-white text-sm">Contact was attempted</span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-brand-edge-dark text-brand-mist py-3 rounded-xl font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason || loading}
            className="flex-1 bg-red-700 text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? 'Recording…' : 'Record No Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Voice Intelligence Modal (Phase 0C-R Pipeline) ───────────────────────────
function VoiceIntelligenceModal({
  visitId,
  workOrderId,
  assetId,
  onClose,
  onConfirmedRecord,
}: {
  visitId: string;
  workOrderId?: string;
  assetId?: string;
  onClose: () => void;
  onConfirmedRecord: () => void;
}) {
  const [state, setState] = useState<'IDLE' | 'RECORDING' | 'TRANSCRIBING' | 'STRUCTURING' | 'REVIEW' | 'CONFIRMED' | 'FAILED'>('IDLE');
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [structuredProposal, setStructuredProposal] = useState<any>(null);
  const [editedClassification, setEditedClassification] = useState<string>('OBSERVATION');
  const [editedObservation, setEditedObservation] = useState<string>('');
  const [editedSeverity, setEditedSeverity] = useState<string>('MAJOR');
  const [editedRecommendation, setEditedRecommendation] = useState<string>('REPAIR');
  const [quoteScope, setQuoteScope] = useState<{ hours: number; engineers: number; desc: string }>({ hours: 4, engineers: 2, desc: '' });
  const [isLowConfidence, setIsLowConfidence] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      const chunks: Blob[] = [];

      mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setState('TRANSCRIBING');

        // Simulate voice transcription and structuring pipeline
        setTimeout(async () => {
          setState('STRUCTURING');
          const sampleAudioNotes = transcript || 'Supply fan bearing on AHU four is noisy and noticeable play. Recommend replacing both bearings within two weeks. Allow two engineers for four hours.';
          setTranscript(sampleAudioNotes);

          try {
            const res = await fetch('/api/engineer/voice/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transcript: sampleAudioNotes,
                visitId,
              }),
            });
            const data = await res.json();
            if (data.success) {
              setStructuredProposal(data);
              setEditedClassification(data.actionType || 'DEFECT');
              setEditedObservation(data.proposedObservation || sampleAudioNotes);
              if (data.proposedDefect) {
                setEditedSeverity(data.proposedDefect.severity || 'MAJOR');
              }
              if (data.proposedRecommendation) {
                setEditedRecommendation(data.proposedRecommendation || 'QUOTE');
              }
              if (data.proposedQuoteScope) {
                setQuoteScope({
                  hours: data.proposedQuoteScope.estimatedHours || 4,
                  engineers: data.proposedQuoteScope.engineersCount || 2,
                  desc: data.proposedQuoteScope.scopeDescription || '',
                });
              }
              setIsLowConfidence(data.isLowConfidence || false);
              setState('REVIEW');
            } else {
              setState('FAILED');
            }
          } catch {
            setState('FAILED');
          }
        }, 1200);
      };

      mr.start();
      setState('RECORDING');
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {
      setState('FAILED');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'RECORDING') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleConfirm = async () => {
    setState('STRUCTURING');
    try {
      // If Quote Scope action, save to field_quote_scopes
      if (editedRecommendation === 'QUOTE' || editedClassification === 'QUOTE_SCOPE') {
        await fetch('/api/engineer/quotes/scope', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitId,
            workOrderId,
            assetId,
            scopeDescription: editedObservation || quoteScope.desc || transcript,
            engineersCount: quoteScope.engineers,
            estimatedHours: quoteScope.hours,
            materialsSummary: 'Parts/bearings specified on site',
          }),
        });
      }

      setState('CONFIRMED');
      setTimeout(() => {
        onConfirmedRecord();
        onClose();
      }, 1000);
    } catch {
      setState('FAILED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-end" role="dialog" aria-modal="true">
      <div className="bg-brand-carbon rounded-t-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto pb-safe">
        <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-electric" />
            <h2 className="text-white font-bold text-lg">Talk to EntireFM</h2>
            <span className="text-xs bg-brand-void text-brand-electric px-2 py-0.5 rounded font-mono">ASSIST</span>
          </div>
          <button onClick={onClose} className="text-brand-mist hover:text-white">✕</button>
        </div>

        {state === 'IDLE' && (
          <div className="text-center py-6 space-y-4">
            <p className="text-brand-mist text-sm">
              Tap the microphone and speak naturally. Describe findings, readings, defects, or quote requirements.
            </p>
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center mx-auto transition-transform active:scale-95 shadow-lg shadow-red-900/50"
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
          </div>
        )}

        {state === 'RECORDING' && (
          <div className="text-center py-6 space-y-4">
            <button
              onClick={stopRecording}
              className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-red-900/50"
            >
              <Square className="w-8 h-8 text-white" />
            </button>
            <p className="text-red-400 font-mono text-2xl">
              {String(Math.floor(duration / 60)).padStart(2, '0')}:{String(duration % 60).padStart(2, '0')}
            </p>
            <p className="text-brand-mist text-sm">Tap square to stop & structure notes</p>
          </div>
        )}

        {(state === 'TRANSCRIBING' || state === 'STRUCTURING') && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-electric animate-spin mx-auto" />
            <p className="text-white font-semibold">
              {state === 'TRANSCRIBING' ? 'Transcribing Voice Audio…' : 'Field Structuring Agent Processing…'}
            </p>
            <p className="text-xs text-brand-mist">Classifying action and extracting structured field parameters</p>
          </div>
        )}

        {state === 'REVIEW' && (
          <div className="space-y-4">
            {isLowConfidence && (
              <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200">
                  EntireFM isn&apos;t fully confident in this extraction. Please review and confirm the parameters below.
                </p>
              </div>
            )}

            <div className="bg-brand-void rounded-xl p-4 border border-brand-edge-dark space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-brand-mist">Action Classification</span>
                <select
                  value={editedClassification}
                  onChange={e => setEditedClassification(e.target.value)}
                  className="bg-brand-carbon border border-brand-edge-dark text-white text-xs rounded px-2 py-1"
                >
                  <option value="OBSERVATION">OBSERVATION</option>
                  <option value="DEFECT">DEFECT</option>
                  <option value="QUOTE_SCOPE">QUOTE SCOPE</option>
                  <option value="JOB_NOTE">JOB NOTE</option>
                  <option value="PARTS_NOTE">PARTS NOTE</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-brand-mist block mb-1">Observation / Findings</label>
                <textarea
                  value={editedObservation}
                  onChange={e => setEditedObservation(e.target.value)}
                  className="w-full bg-brand-carbon border border-brand-edge-dark rounded-lg p-2.5 text-xs text-white h-16 resize-none"
                />
              </div>

              {editedClassification === 'DEFECT' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-brand-mist block mb-1">Severity</label>
                    <select
                      value={editedSeverity}
                      onChange={e => setEditedSeverity(e.target.value)}
                      className="w-full bg-brand-carbon border border-brand-edge-dark text-white text-xs rounded p-2"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="MAJOR">MAJOR</option>
                      <option value="MINOR">MINOR</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-brand-mist block mb-1">Recommendation</label>
                    <select
                      value={editedRecommendation}
                      onChange={e => setEditedRecommendation(e.target.value)}
                      className="w-full bg-brand-carbon border border-brand-edge-dark text-white text-xs rounded p-2"
                    >
                      <option value="REPAIR">REPAIR</option>
                      <option value="REPLACE">REPLACE</option>
                      <option value="QUOTE">QUOTE (Talk-to-Quote)</option>
                      <option value="INVESTIGATE">INVESTIGATE</option>
                      <option value="MONITOR">MONITOR</option>
                      <option value="NO_ACTION">NO ACTION</option>
                    </select>
                  </div>
                </div>
              )}

              {editedRecommendation === 'QUOTE' && (
                <div className="bg-brand-edge-dark/30 border border-brand-electric/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-electric">Draft Field Quote Scope</span>
                    <span className="text-[10px] bg-brand-void text-brand-mist px-1.5 py-0.5 rounded font-mono">UNPRICED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-brand-mist block">Estimated Labour</span>
                      <span className="text-white font-mono">{quoteScope.engineers} engineers × {quoteScope.hours} hrs</span>
                    </div>
                    <div>
                      <span className="text-brand-mist block">Pricing Status</span>
                      <span className="text-amber-400 font-semibold">NOT ISSUED / DRAFT</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setState('IDLE')}
                className="flex-1 border border-brand-edge-dark py-3 rounded-xl text-xs font-medium text-brand-mist"
              >
                Re-record
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-brand-electric text-black py-3 rounded-xl text-xs font-bold hover:bg-brand-electric-bright transition-colors"
              >
                Confirm & Save Record
              </button>
            </div>
          </div>
        )}

        {state === 'CONFIRMED' && (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
            <p className="text-white font-bold">Field Record Confirmed & Saved</p>
            <p className="text-xs text-brand-mist">Authoritative operational record created with audit provenance.</p>
          </div>
        )}

        {state === 'FAILED' && (
          <div className="py-6 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-white font-bold">Voice Processing Failed</p>
            <p className="text-xs text-brand-mist">Audio could not be transcribed. You can retry or type manually.</p>
            <button
              onClick={() => setState('IDLE')}
              className="bg-brand-void border border-brand-edge-dark text-white px-4 py-2 rounded-lg text-xs font-semibold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Field Copilot V1 Drawer ──────────────────────────────────────────────────
function FieldCopilotDrawer({
  visitId,
  workOrderId,
  assetId,
  onClose,
}: {
  visitId: string;
  workOrderId?: string;
  assetId?: string;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; citations?: string[]; isSafetyRefusal?: boolean }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your EntireFM Field Copilot. I have access to this site, asset history, open defects, and task requirements. What do you need to know?',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (qText?: string) => {
    const textToSend = qText || query;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/engineer/copilot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, visitId, workOrderId, assetId }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer,
          citations: data.citations,
          isSafetyRefusal: data.safetyRefusal,
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Error connecting to Field Copilot retrieval engine.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-end" role="dialog" aria-modal="true">
      <div className="bg-brand-carbon rounded-t-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col pb-safe">
        <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-electric" />
            <h2 className="text-white font-bold text-base">Field Copilot V1</h2>
            <span className="text-[10px] bg-brand-void text-brand-electric px-2 py-0.5 rounded font-mono">SCOPED RBAC</span>
          </div>
          <button onClick={onClose} className="text-brand-mist hover:text-white">✕</button>
        </div>

        {/* Quick queries */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => handleSend('What happened to this asset last time?')}
            className="bg-brand-void border border-brand-edge-dark text-brand-mist hover:text-white px-2.5 py-1.5 rounded-lg whitespace-nowrap"
          >
            Last attendance?
          </button>
          <button
            onClick={() => handleSend('What evidence do I need?')}
            className="bg-brand-void border border-brand-edge-dark text-brand-mist hover:text-white px-2.5 py-1.5 rounded-lg whitespace-nowrap"
          >
            Evidence needed?
          </button>
          <button
            onClick={() => handleSend('What tasks remain?')}
            className="bg-brand-void border border-brand-edge-dark text-brand-mist hover:text-white px-2.5 py-1.5 rounded-lg whitespace-nowrap"
          >
            Open tasks?
          </button>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-80">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-electric/15 text-white ml-8 border border-brand-electric/30'
                  : m.isSafetyRefusal
                  ? 'bg-red-950/40 text-red-200 border border-red-800'
                  : 'bg-brand-void text-white/90 mr-6 border border-brand-edge-dark'
              }`}
            >
              <p>{m.text}</p>
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 pt-1 border-t border-brand-edge-dark/50 text-[10px] font-mono text-brand-electric">
                  {m.citations.join(' ')}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="bg-brand-void p-3 rounded-xl text-xs text-brand-mist flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-electric" />
              <span>Retrieving operational history…</span>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex gap-2 pt-2 border-t border-brand-edge-dark">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask Copilot about this job or asset…"
            className="flex-1 bg-brand-void border border-brand-edge-dark rounded-xl px-3 py-2.5 text-xs text-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || loading}
            className="bg-brand-electric text-black px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-electric-bright disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Nameplate Scanner Modal ──────────────────────────────────────────────────
function NameplateScannerModal({
  asset,
  onClose,
}: {
  asset?: any;
  onClose: () => void;
}) {
  const [rawOcr, setRawOcr] = useState('MITSUBISHI ELECTRIC\nPUZ-ZM100VKA2\nSerial: 7X193829\nVoltage: 230V 50Hz');
  const [extraction, setExtraction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/engineer/vision/nameplate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: rawOcr, assetId: asset?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setExtraction(data.extraction);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-end" role="dialog" aria-modal="true">
      <div className="bg-brand-carbon rounded-t-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto pb-safe">
        <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
          <h2 className="text-white font-bold text-base">Visual Nameplate Scanner</h2>
          <button onClick={onClose} className="text-brand-mist hover:text-white">✕</button>
        </div>

        <p className="text-xs text-brand-mist">
          Photograph or simulate equipment rating plate to extract manufacturer, model, and serial number.
        </p>

        <div>
          <label className="text-xs text-brand-mist block mb-1">OCR / Nameplate Text</label>
          <textarea
            value={rawOcr}
            onChange={e => setRawOcr(e.target.value)}
            className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-2.5 text-xs font-mono text-white h-20"
          />
        </div>

        <button
          onClick={handleScan}
          disabled={loading || !rawOcr.trim()}
          className="w-full bg-brand-electric text-black font-bold py-3 rounded-xl text-xs hover:bg-brand-electric-bright disabled:opacity-50"
        >
          {loading ? 'Analysing Nameplate…' : 'Extract Equipment Metadata'}
        </button>

        {extraction && (
          <div className="bg-brand-void border border-brand-edge-dark rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Extracted Metadata</span>
              <span className="text-[10px] bg-green-950 text-green-400 px-2 py-0.5 rounded font-mono">
                {Math.round(extraction.confidence * 100)}% Confidence
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-brand-mist block">Manufacturer</span>
                <span className="text-white font-semibold">{extraction.manufacturer || '—'}</span>
              </div>
              <div>
                <span className="text-brand-mist block">Model</span>
                <span className="text-white font-semibold">{extraction.model || '—'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-brand-mist block">Serial Number</span>
                <span className="text-white font-mono font-semibold">{extraction.serialNumber || '—'}</span>
              </div>
            </div>

            {extraction.discrepancies && extraction.discrepancies.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-800 rounded-lg p-2.5 space-y-1">
                <span className="text-xs font-bold text-amber-400 block">Existing Value Discrepancy</span>
                {extraction.discrepancies.map((d: any, i: number) => (
                  <p key={i} className="text-[11px] text-amber-200">
                    {d.field}: Stored &quot;{d.existingValue}&quot; vs Captured &quot;{d.proposedValue}&quot;
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function FieldJobScreen({
  visit,
  tasks,
  readings,
  parts,
  serviceReport,
  session,
}: FieldJobScreenProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(visit.status || 'PLANNED');
  const [showVoice, setShowVoice] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showNameplate, setShowNameplate] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [localTasks, setLocalTasks] = useState(tasks);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);

  const wo = visit.work_order;
  const site = visit.site;
  const asset = visit.asset;

  const hasSafetyRequirements = !!(wo?.safety_warnings || wo?.permit_required || wo?.asbestos_risk);
  const mapsUrl = site ? `https://maps.google.com/?q=${encodeURIComponent([site.address_line1, site.town, site.postcode].filter(Boolean).join(', '))}` : null;

  const handleStatusChange = (newStatus: string) => setCurrentStatus(newStatus);
  const handleComplete = () => setCurrentStatus('COMPLETED');

  return (
    <div className="min-h-screen bg-brand-void pb-36">
      {/* Safety header */}
      {hasSafetyRequirements && (
        <div className="bg-red-900/40 border-b border-red-700 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 font-bold text-sm mb-1">Safety Requirements</p>
              {wo?.safety_warnings && <p className="text-red-200 text-sm">{wo.safety_warnings}</p>}
              {wo?.permit_required && <p className="text-amber-300 text-xs mt-1">⚠ Permit required before starting work</p>}
              {!safetyAcknowledged && (
                <button
                  onClick={() => setSafetyAcknowledged(true)}
                  className="mt-3 bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold w-full hover:bg-red-600 transition-colors"
                >
                  I have read the safety requirements
                </button>
              )}
              {safetyAcknowledged && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-4 space-y-4">
        {/* Back link + reference */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/engineer" className="text-brand-mist hover:text-white transition-colors" aria-label="Back to home">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-brand-mist text-sm font-mono">{wo?.reference ?? visit.id.slice(0, 8)}</span>
            {wo?.priority && <span className="ml-1"><PriorityBadge priority={wo.priority} /></span>}
          </div>

          {/* Copilot button */}
          <button
            onClick={() => setShowCopilot(true)}
            className="flex items-center gap-1.5 bg-brand-electric/15 text-brand-electric border border-brand-electric/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-electric/25 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Field Copilot</span>
          </button>
        </div>

        {/* Job overview */}
        <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4">
          <h1 className="text-white text-xl font-bold mb-2 leading-tight">
            {site?.name ?? 'Site'}
          </h1>
          {wo?.description && (
            <p className="text-brand-mist text-sm leading-relaxed mb-3">{wo.description}</p>
          )}
          {wo?.sla_snapshot?.attendance_deadline && (
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-brand-mist shrink-0" />
              <span className="text-brand-mist">Attend by </span>
              <span className="text-white font-medium">
                {new Date(wo.sla_snapshot.attendance_deadline).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        {/* Evidence Requirements Checklist */}
        <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-brand-mist tracking-wider">Evidence Status</span>
            <span className="text-xs text-brand-electric font-mono">CCP-01 Policy</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-brand-void p-2.5 rounded-lg border border-brand-edge-dark flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-white">Before Photo</span>
            </div>
            <div className="bg-brand-void p-2.5 rounded-lg border border-brand-edge-dark flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-brand-mist">After Photo (Req.)</span>
            </div>
          </div>
        </div>

        {/* Location & Asset */}
        {site && (
          <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4">
            <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-2">Location</p>
            <p className="text-white font-medium">{site.name}</p>
            {site.address_line1 && <p className="text-brand-mist text-sm mt-0.5">{site.address_line1}</p>}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-brand-electric text-sm font-medium hover:text-brand-electric-bright transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Open in Maps
              </a>
            )}
          </div>
        )}

        {asset && (
          <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider">Asset</p>
              <button
                onClick={() => setShowNameplate(true)}
                className="text-xs text-brand-electric hover:underline flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                Scan Nameplate
              </button>
            </div>
            <p className="text-white font-medium">{asset.name}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-brand-mist">
              <span>Mfr: <span className="text-white">{asset.manufacturer || '—'}</span></span>
              <span>Model: <span className="text-white">{asset.model || '—'}</span></span>
              <span className="col-span-2">Serial: <span className="text-white font-mono">{asset.serial_number || '—'}</span></span>
            </div>
          </div>
        )}

        {/* Operational state bar */}
        <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4">
          <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-3">Status</p>
          <StatusBar visitId={visit.id} status={currentStatus} onStatusChange={handleStatusChange} />
        </div>

        {/* Task list */}
        {['ON_SITE', 'IN_PROGRESS', 'COMPLETION_PENDING'].includes(currentStatus) && (
          <div>
            <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-2">Tasks</p>
            <div className="space-y-2">
              {localTasks.map(task => (
                <div key={task.id} className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{task.title || task.name || 'Task'}</span>
                    <span className="text-xs text-brand-mist">{task.status || 'PENDING'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ready to Complete */}
        {currentStatus === 'IN_PROGRESS' && (
          <button
            onClick={() => setShowCompletion(true)}
            className="w-full bg-green-800 text-white font-bold py-4 rounded-xl text-base hover:bg-green-700 transition-colors border border-green-700 active:scale-98"
            style={{ minHeight: '56px' }}
          >
            Ready to Complete? →
          </button>
        )}
      </div>

      {/* Field action bar — fixed above bottom nav */}
      {currentStatus === 'IN_PROGRESS' && (
        <div className="fixed bottom-14 left-0 right-0 z-40 bg-brand-carbon border-t border-brand-edge-dark px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setShowVoice(true)}
              className="flex flex-col items-center gap-1 py-2 rounded-xl bg-brand-void text-brand-electric hover:bg-brand-edge-dark transition-colors active:scale-95"
            >
              <Mic className="w-5 h-5" />
              <span className="text-xs text-brand-mist">Talk</span>
            </button>
            <button
              onClick={() => setShowNameplate(true)}
              className="flex flex-col items-center gap-1 py-2 rounded-xl bg-brand-void text-purple-400 hover:bg-brand-edge-dark transition-colors active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span className="text-xs text-brand-mist">Nameplate</span>
            </button>
            <button
              onClick={() => setShowCopilot(true)}
              className="flex flex-col items-center gap-1 py-2 rounded-xl bg-brand-void text-green-400 hover:bg-brand-edge-dark transition-colors active:scale-95"
            >
              <Bot className="w-5 h-5" />
              <span className="text-xs text-brand-mist">Copilot</span>
            </button>
            <button
              onClick={() => setShowVoice(true)}
              className="flex flex-col items-center gap-1 py-2 rounded-xl bg-brand-void text-amber-400 hover:bg-brand-edge-dark transition-colors active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs text-brand-mist">Defect</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showVoice && (
        <VoiceIntelligenceModal
          visitId={visit.id}
          workOrderId={visit.work_order_id}
          assetId={visit.asset_id}
          onClose={() => setShowVoice(false)}
          onConfirmedRecord={() => {}}
        />
      )}
      {showCopilot && (
        <FieldCopilotDrawer
          visitId={visit.id}
          workOrderId={visit.work_order_id}
          assetId={visit.asset_id}
          onClose={() => setShowCopilot(false)}
        />
      )}
      {showNameplate && (
        <NameplateScannerModal
          asset={asset}
          onClose={() => setShowNameplate(false)}
        />
      )}
      {showCompletion && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-end">
          <div className="bg-brand-carbon rounded-t-2xl w-full p-6 space-y-4 pb-safe">
            <h2 className="text-white font-bold text-lg">Submit Field Service Report</h2>
            <p className="text-xs text-brand-mist">
              A Field Service Report (<span className="font-mono text-brand-electric">EFM-FSR-2026-XXXXXX</span>) will be generated and submitted for operational sign-off.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompletion(false)}
                className="flex-1 border border-brand-edge-dark text-brand-mist py-3 rounded-xl font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/engineer/visits/${visit.id}/submit-completion`, { method: 'POST' });
                  setShowCompletion(false);
                  handleComplete();
                }}
                className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold text-xs"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
