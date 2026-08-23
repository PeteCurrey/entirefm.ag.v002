'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, ChevronLeft, AlertTriangle, CheckCircle2, XCircle,
  Mic, Camera, Plus, Square, Navigation, PhoneOff,
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
        <span className="text-green-300 font-medium">Visit completed</span>
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

// ─── Task list ─────────────────────────────────────────────────────────────────
function TaskList({ tasks, visitStatus }: { tasks: any[]; visitStatus: string }) {
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>(
    Object.fromEntries(tasks.map(t => [t.id, t.status || 'PENDING']))
  );
  const [loading, setLoading] = useState<string | null>(null);

  const updateTask = async (taskId: string, status: string) => {
    setLoading(taskId);
    try {
      const res = await fetch(`/api/engineer/tasks/${taskId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) setTaskStatuses(prev => ({ ...prev, [taskId]: status }));
    } finally {
      setLoading(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4 text-center">
        <p className="text-brand-mist text-sm">No tasks defined for this work order</p>
      </div>
    );
  }

  const taskStatusConfig: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pending', color: 'text-brand-mist' },
    IN_PROGRESS: { label: 'In Progress', color: 'text-brand-electric' },
    COMPLETED: { label: 'Done', color: 'text-green-400' },
    BLOCKED: { label: 'Blocked', color: 'text-amber-400' },
    NOT_APPLICABLE: { label: 'N/A', color: 'text-zinc-500' },
  };

  return (
    <div className="space-y-2">
      {tasks.map(task => {
        const currentStatus = taskStatuses[task.id];
        const cfg = taskStatusConfig[currentStatus] || taskStatusConfig.PENDING;
        const isWorking = visitStatus === 'IN_PROGRESS';
        const isComplete = currentStatus === 'COMPLETED';
        const isLoading = loading === task.id;

        return (
          <div
            key={task.id}
            className={`bg-brand-carbon rounded-xl border p-4 transition-colors ${isComplete ? 'border-green-800 opacity-75' : 'border-brand-edge-dark'}`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                {task.is_mandatory && (
                  <span className="text-red-400 text-xs font-semibold mr-2">REQUIRED</span>
                )}
                <span className="text-white text-sm font-medium">{task.title || task.name || 'Task'}</span>
                {task.description && (
                  <p className="text-brand-mist text-xs mt-1 leading-relaxed">{task.description}</p>
                )}
              </div>
              <span className={`text-xs font-medium shrink-0 ${cfg.color}`}>{cfg.label}</span>
            </div>

            {isWorking && !isComplete && (
              <div className="flex gap-2">
                {currentStatus === 'PENDING' && (
                  <button
                    onClick={() => updateTask(task.id, 'IN_PROGRESS')}
                    disabled={isLoading}
                    className="flex-1 bg-brand-electric/10 text-brand-electric text-xs font-semibold py-2.5 rounded-lg border border-brand-electric/30 hover:bg-brand-electric/20 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? '…' : 'Start'}
                  </button>
                )}
                {currentStatus === 'IN_PROGRESS' && (
                  <>
                    <button
                      onClick={() => updateTask(task.id, 'COMPLETED')}
                      disabled={isLoading}
                      className="flex-1 bg-green-800 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? '…' : '✓ Complete'}
                    </button>
                    <button
                      onClick={() => updateTask(task.id, 'BLOCKED')}
                      disabled={isLoading}
                      className="flex-1 bg-amber-900/50 text-amber-400 text-xs font-semibold py-2.5 rounded-lg border border-amber-700/50 hover:bg-amber-900 transition-colors disabled:opacity-50"
                    >
                      Blocked
                    </button>
                  </>
                )}
                {!task.is_mandatory && currentStatus === 'PENDING' && (
                  <button
                    onClick={() => updateTask(task.id, 'NOT_APPLICABLE')}
                    disabled={isLoading}
                    className="px-3 bg-zinc-800 text-zinc-400 text-xs py-2.5 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
                  >
                    N/A
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Voice capture modal ───────────────────────────────────────────────────────
function VoiceCaptureModal({
  visitId,
  workOrderId,
  onClose,
}: {
  visitId: string;
  workOrderId?: string;
  onClose: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'done' | 'error'>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setStatus('processing');
        setTranscription('Processing voice capture… (AI transcription in next phase)');
        // Save voice capture metadata to server
        if (workOrderId) {
          await fetch('/api/engineer/voice/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ visitId, workOrderId, durationSeconds: duration }),
          });
        }
        setStatus('done');
        setTranscription('Voice capture saved. Review and confirm in the captures list.');
      };
      mr.start();
      setIsRecording(true);
      setStatus('recording');
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {
      setStatus('error');
      setTranscription('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatDuration = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-end" role="dialog" aria-modal="true" aria-label="Voice capture">
      <div className="bg-brand-carbon rounded-t-2xl w-full p-6 space-y-5 pb-safe">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Voice Capture</h2>
          <button onClick={onClose} className="text-brand-mist hover:text-white" aria-label="Close">✕</button>
        </div>

        <p className="text-brand-mist text-sm leading-relaxed">
          Speak naturally — describe what you observe, defects found, or work completed. EntireFM will help structure your notes.
        </p>

        <div className="flex flex-col items-center gap-4">
          {status === 'idle' && (
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors active:scale-95 shadow-lg shadow-red-900/50"
              aria-label="Start recording"
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
          )}
          {status === 'recording' && (
            <>
              <button
                onClick={stopRecording}
                className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center animate-pulse shadow-lg shadow-red-900/50"
                aria-label="Stop recording"
              >
                <Square className="w-8 h-8 text-white" />
              </button>
              <p className="text-red-400 font-mono text-xl">{formatDuration(duration)}</p>
              <p className="text-brand-mist text-sm">Tap to stop recording</p>
            </>
          )}
          {status === 'processing' && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-brand-electric border-t-transparent animate-spin" />
              <p className="text-brand-mist text-sm">Processing…</p>
            </div>
          )}
        </div>

        {transcription && (
          <div className="bg-brand-void border border-brand-edge-dark rounded-xl p-4">
            <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-2">Result</p>
            <p className="text-white text-sm leading-relaxed">{transcription}</p>
          </div>
        )}

        {status === 'done' && (
          <button onClick={onClose} className="w-full bg-brand-electric text-black font-bold py-4 rounded-xl">
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Completion modal ──────────────────────────────────────────────────────────
function CompletionModal({
  visitId,
  tasks,
  onClose,
  onComplete,
}: {
  visitId: string;
  tasks: any[];
  onClose: () => void;
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [signatoryName, setSignatoryName] = useState('');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const totalTasks = tasks.length;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/engineer/visits/${visitId}/submit-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatoryName: signatoryName || null }),
      });
      const data = await res.json();
      if (data.success) onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-end" role="dialog" aria-modal="true" aria-label="Complete visit">
      <div className="bg-brand-carbon rounded-t-2xl w-full p-6 space-y-4 pb-safe max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Complete Visit</h2>
          <button onClick={onClose} className="text-brand-mist hover:text-white" aria-label="Close">✕</button>
        </div>

        <div className="bg-brand-void rounded-xl border border-brand-edge-dark p-4 space-y-3">
          <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-1">Completion checklist</p>

          <CheckItem
            label={`Tasks: ${completedTasks} / ${totalTasks} complete`}
            ok={completedTasks === totalTasks || totalTasks === 0}
          />
        </div>

        <div>
          <label className="text-brand-mist text-sm block mb-2">Site representative name (optional)</label>
          <input
            type="text"
            value={signatoryName}
            onChange={e => setSignatoryName(e.target.value)}
            className="w-full bg-brand-void border border-brand-edge-dark rounded-lg p-3 text-white"
            placeholder="Full name of site contact"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-brand-edge-dark text-brand-mist py-3 rounded-xl font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit Completion'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {ok
        ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
        : <XCircle className="w-4 h-4 text-amber-400 shrink-0" />}
      <span className="text-white text-sm">{label}</span>
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
        <div className="flex items-center gap-2">
          <Link href="/engineer" className="text-brand-mist hover:text-white transition-colors" aria-label="Back to home">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-brand-mist text-sm font-mono">{wo?.reference ?? visit.id.slice(0, 8)}</span>
          {wo?.priority && <span className="ml-1"><PriorityBadge priority={wo.priority} /></span>}
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

        {/* Site location */}
        {site && (
          <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4">
            <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-2">Location</p>
            <p className="text-white font-medium">{site.name}</p>
            {site.address_line1 && <p className="text-brand-mist text-sm mt-0.5">{site.address_line1}</p>}
            {(site.town || site.postcode) && <p className="text-brand-mist text-sm">{[site.town, site.postcode].filter(Boolean).join(' ')}</p>}
            {site.access_notes && (
              <div className="mt-3 bg-amber-900/20 border border-amber-700/40 rounded-lg p-3">
                <p className="text-amber-300 text-xs font-semibold mb-1">Access notes</p>
                <p className="text-amber-200 text-sm">{site.access_notes}</p>
              </div>
            )}
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

        {/* Asset card */}
        {asset && (
          <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4">
            <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-2">Asset</p>
            <p className="text-white font-medium">{asset.name}</p>
            {asset.asset_reference && <p className="text-brand-mist text-sm font-mono">Ref: {asset.asset_reference}</p>}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
              {asset.manufacturer && <span className="text-brand-mist">Mfr: <span className="text-white">{asset.manufacturer}</span></span>}
              {asset.model && <span className="text-brand-mist">Model: <span className="text-white">{asset.model}</span></span>}
              {asset.serial_number && <span className="text-brand-mist col-span-2">Serial: <span className="text-white font-mono">{asset.serial_number}</span></span>}
            </div>
          </div>
        )}

        {/* Operational state bar */}
        <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-4">
          <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-3">Status</p>
          <StatusBar visitId={visit.id} status={currentStatus} onStatusChange={handleStatusChange} />
        </div>

        {/* Task list — visible when on site or in progress */}
        {['ON_SITE', 'IN_PROGRESS', 'COMPLETION_PENDING'].includes(currentStatus) && (
          <div>
            <p className="text-brand-mist text-xs font-semibold uppercase tracking-wider mb-2">Tasks</p>
            <TaskList tasks={localTasks} visitStatus={currentStatus} />
          </div>
        )}

        {/* Summary counts */}
        {(readings.length > 0 || parts.length > 0) && (
          <div className="grid grid-cols-2 gap-3">
            {readings.length > 0 && (
              <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-3 text-center">
                <p className="text-white text-2xl font-bold">{readings.length}</p>
                <p className="text-brand-mist text-xs">Reading{readings.length !== 1 ? 's' : ''}</p>
              </div>
            )}
            {parts.length > 0 && (
              <div className="bg-brand-carbon rounded-xl border border-brand-edge-dark p-3 text-center">
                <p className="text-white text-2xl font-bold">{parts.length}</p>
                <p className="text-brand-mist text-xs">Part{parts.length !== 1 ? 's' : ''} used</p>
              </div>
            )}
          </div>
        )}

        {/* Complete button */}
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

      {/* Field action bar — fixed above bottom nav when in progress */}
      {currentStatus === 'IN_PROGRESS' && (
        <div className="fixed bottom-14 left-0 right-0 z-40 bg-brand-carbon border-t border-brand-edge-dark px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            <ActionBarButton
              icon={<Mic className="w-5 h-5" />}
              label="Talk"
              onClick={() => setShowVoice(true)}
              color="text-brand-electric"
            />
            <ActionBarButton
              icon={<Camera className="w-5 h-5" />}
              label="Capture"
              onClick={() => {/* Photo capture handled by file input */}}
              color="text-purple-400"
            />
            <ActionBarButton
              icon={<Square className="w-5 h-5" />}
              label="Scan"
              onClick={() => {/* QR scan stub */}}
              color="text-green-400"
            />
            <ActionBarButton
              icon={<Plus className="w-5 h-5" />}
              label="Add"
              onClick={() => {/* Add action menu stub */}}
              color="text-amber-400"
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {showVoice && (
        <VoiceCaptureModal
          visitId={visit.id}
          workOrderId={visit.work_order_id}
          onClose={() => setShowVoice(false)}
        />
      )}
      {showCompletion && (
        <CompletionModal
          visitId={visit.id}
          tasks={localTasks}
          onClose={() => setShowCompletion(false)}
          onComplete={() => { setShowCompletion(false); handleComplete(); }}
        />
      )}
    </div>
  );
}

function ActionBarButton({
  icon,
  label,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 rounded-xl bg-brand-void hover:bg-brand-edge-dark transition-colors active:scale-95 ${color}`}
      style={{ minHeight: '56px' }}
      aria-label={label}
    >
      {icon}
      <span className="text-xs text-brand-mist">{label}</span>
    </button>
  );
}
