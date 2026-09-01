'use client';

/**
 * ENTIREFM AI-POWERED LOG A JOB CLIENT (Phase 01)
 * ===============================================
 * Premium CAFM Log a Job interface featuring:
 *   - Multimodal evidence capture (Photos, Video, Documents/PDF, Voice)
 *   - Firebase AI Logic / Gemini Multimodal Assessment
 *   - Real-time asset register matching & confirmation
 *   - Advisory AI Review Panel with full human editing and manual fallback
 *   - Direct camera/video capture for mobile field users
 *   - Canonical Work Order creation with real-time auditability
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Camera,
  Video,
  FileText,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Building2,
  Trash2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  FileSpreadsheet,
  Film,
  RotateCw,
  Info,
  Check,
  X,
  Layers,
  MapPin,
  Cpu,
} from 'lucide-react';
import { MultimodalJobAssessment, MultimodalEvidenceItem } from '@/server/ai/multimodal/types';

interface SiteOption {
  id: string;
  name: string;
  site_code?: string;
  city?: string;
  postcode?: string;
}

interface AssetOption {
  id: string;
  name: string;
  asset_reference: string;
  category?: string;
  location?: string;
  site_id?: string;
  manufacturer?: string;
  model?: string;
}

interface Props {
  clientName: string;
  initialSites: SiteOption[];
  initialAssets: AssetOption[];
  userName?: string;
}

const CANONICAL_CATEGORIES = [
  { id: 'HVAC', label: 'HVAC & Climate Control', trade: 'HVAC Engineer' },
  { id: 'PLUMBING', label: 'Plumbing & Drainage', trade: 'Plumbing Engineer' },
  { id: 'ELECTRICAL', label: 'Electrical & Power', trade: 'Electrical Engineer' },
  { id: 'FIRE_LIFE_SAFETY', label: 'Fire & Life Safety', trade: 'Fire Safety Specialist' },
  { id: 'BUILDING_FABRIC', label: 'Building Fabric & Doors', trade: 'Fabric & Joinery Tech' },
  { id: 'CLEANING', label: 'Cleaning & Environmental', trade: 'Specialist Cleaning Team' },
  { id: 'SECURITY', label: 'Security & Access Control', trade: 'Security Engineer' },
  { id: 'DRAINAGE', label: 'Drainage & Waste', trade: 'Drainage Specialist' },
  { id: 'GENERAL_MAINTENANCE', label: 'General Maintenance', trade: 'Multi-Skilled Handyman' },
];

const PRIORITIES = [
  { id: 'P1_CRITICAL', label: 'P1 - Critical / Emergency', sla: '4 Hours', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'P2_HIGH', label: 'P2 - High / Urgent Impact', sla: '8 Hours', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'P3_MEDIUM', label: 'P3 - Medium / Routine', sla: '24 Hours', badgeClass: 'bg-brand-electric/20 text-brand-electric-bright border-brand-electric/30' },
  { id: 'P4_LOW', label: 'P4 - Low / Minor Rectification', sla: '5 Days', badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
];

export default function AiLogAJobClient({ clientName, initialSites, initialAssets, userName }: Props) {
  // Step 1: Input State
  const [description, setDescription] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState(initialSites.length === 1 ? initialSites[0].id : '');
  const [locationNotes, setLocationNotes] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [accessNotes, setAccessNotes] = useState('');

  // Evidence Files
  const [evidenceList, setEvidenceList] = useState<MultimodalEvidenceItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hidden File Inputs for Direct Camera & Video
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Step 2 & 3: AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [aiAssessment, setAiAssessment] = useState<MultimodalJobAssessment | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [assetMatchDecision, setAssetMatchDecision] = useState<'CONFIRMED' | 'REJECTED' | 'MANUAL' | 'NONE'>('NONE');

  // Step 4: Editable Form Values
  const [confirmedTitle, setConfirmedTitle] = useState('');
  const [confirmedCategory, setConfirmedCategory] = useState('GENERAL_MAINTENANCE');
  const [confirmedTrade, setConfirmedTrade] = useState('Maintenance Engineer');
  const [confirmedPriority, setConfirmedPriority] = useState('P3_MEDIUM');

  // Step 5: Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Filter assets by selected site
  const siteAssets = initialAssets.filter((a) => !selectedSiteId || a.site_id === selectedSiteId);

  // Sync title from description if not manually edited
  useEffect(() => {
    if (!aiAssessment && description && !confirmedTitle) {
      setConfirmedTitle(description.slice(0, 70));
    }
  }, [description, aiAssessment, confirmedTitle]);

  // Voice Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          const newEvidence: MultimodalEvidenceItem = {
            id: 'voice-' + Date.now(),
            type: 'AUDIO',
            mimeType: 'audio/webm',
            filename: `voice-note-${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`,
            sizeBytes: audioBlob.size,
            base64Data: base64,
            previewUrl: URL.createObjectURL(audioBlob),
          };
          setEvidenceList((prev) => [...prev, newEvidence]);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      alert('Microphone access could not be initialized: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // File Processing Helper
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      // 20MB limit per file
      if (file.size > 20 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 20MB limit.`);
        return;
      }

      let type: MultimodalEvidenceItem['type'] = 'DOCUMENT';
      if (file.type.startsWith('image/')) type = 'IMAGE';
      else if (file.type.startsWith('video/')) type = 'VIDEO';
      else if (file.type.startsWith('audio/')) type = 'AUDIO';
      else if (file.type.includes('pdf')) type = 'DOCUMENT';

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const item: MultimodalEvidenceItem = {
          id: 'ev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          type,
          mimeType: file.type || 'application/octet-stream',
          filename: file.name,
          sizeBytes: file.size,
          base64Data: base64,
          previewUrl: type === 'IMAGE' || type === 'VIDEO' ? URL.createObjectURL(file) : undefined,
        };
        setEvidenceList((prev) => [...prev, item]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEvidence = (id: string) => {
    setEvidenceList((prev) => prev.filter((e) => e.id !== id));
  };

  // Trigger AI Analysis
  const handleAnalyze = async () => {
    if (!selectedSiteId) {
      alert('Please select a site before analysing with AI so the assessment can be grounded in your site asset register.');
      return;
    }

    if (!description && evidenceList.length === 0) {
      alert('Please enter a description or upload at least one photo, video, or document.');
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);

    // Realistic multi-step progress stages
    const steps = [
      'Reviewing description & symptoms...',
      'Analysing uploaded imagery & video frames...',
      'Inspecting technical documents & schematics...',
      'Identifying equipment & matching asset register...',
      'Assessing operational priority & safety flags...',
      'Preparing structured job classification...',
    ];

    let currentStepIdx = 0;
    setAnalysisStep(steps[0]);
    const stepInterval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setAnalysisStep(steps[currentStepIdx]);
      }
    }, 600);

    try {
      const payload = {
        description,
        evidence: evidenceList,
        site_id: selectedSiteId || undefined,
        correlation_id: 'log-job-' + Date.now(),
      };

      const res = await fetch('/api/clients/jobs/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Analysis request failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.assessment) {
        const assess = data.assessment as MultimodalJobAssessment;
        setAiAssessment(assess);
        setConfirmedTitle(assess.issue_summary || description.slice(0, 70));
        setConfirmedCategory(assess.category || 'GENERAL_MAINTENANCE');
        setConfirmedTrade(assess.recommended_trade || 'Maintenance Engineer');
        setConfirmedPriority(assess.priority || 'P3_MEDIUM');

        if (assess.asset_match?.asset_id) {
          setSelectedAssetId(assess.asset_match.asset_id);
          setAssetMatchDecision('CONFIRMED');
        }
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('[AI_ANALYZE_ERROR]:', err);
      setAiError(err.message || 'AI analysis unavailable. You can continue submitting manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Confirmed Job
  const handleSubmitJob = async () => {
    if (!selectedSiteId) {
      alert('Please select a site for this job.');
      return;
    }
    if (!confirmedTitle || !description) {
      alert('Please provide a job title and description.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        site_id: selectedSiteId,
        title: confirmedTitle,
        description,
        location_description: locationNotes || aiAssessment?.location || undefined,
        asset_id: selectedAssetId || undefined,
        category: confirmedCategory,
        priority: confirmedPriority,
        access_notes: accessNotes || undefined,
        ai_assessment: aiAssessment || undefined,
        ai_accepted: !!aiAssessment,
        evidence: evidenceList,
      };

      const res = await fetch('/api/clients/jobs/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit job');
      }

      const result = await res.json();
      setSubmissionResult(result);
    } catch (err: any) {
      setSubmissionError(err.message || 'An unexpected error occurred while logging the job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Banner View
  if (submissionResult) {
    const sr = submissionResult.service_request;
    const wo = submissionResult.work_order;
    const dispatch = submissionResult.dispatch;

    return (
      <div className="mx-auto max-w-4xl space-y-6 animate-fadeIn">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center backdrop-blur-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">Job Logged Successfully</h1>
          <p className="mt-2 text-sm text-emerald-200/80">
            Your maintenance request has been registered in the EntireFM CAFM system and dispatched to operations.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/80 p-4">
              <span className="text-[11px] uppercase tracking-wider text-brand-mist/60 font-medium">Service Request</span>
              <div className="mt-1 text-lg font-mono font-medium text-white">{sr?.reference}</div>
              <div className="mt-1 text-xs text-brand-mist/70">{sr?.title}</div>
            </div>

            <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/80 p-4">
              <span className="text-[11px] uppercase tracking-wider text-brand-mist/60 font-medium">Work Order Ref</span>
              <div className="mt-1 text-lg font-mono font-medium text-brand-electric-bright">{wo?.work_order_number}</div>
              <div className="mt-1 text-xs text-brand-mist/70">Status: {wo?.status}</div>
            </div>

            <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/80 p-4">
              <span className="text-[11px] uppercase tracking-wider text-brand-mist/60 font-medium">Target SLA</span>
              <div className="mt-1 text-lg font-medium text-amber-300">{sr?.sla_hours} Hours</div>
              <div className="mt-1 text-xs text-brand-mist/70">Resolution target active</div>
            </div>
          </div>

          {dispatch?.assigned_supplier && (
            <div className="mt-4 rounded-lg border border-brand-electric/30 bg-brand-electric/10 p-3.5 text-left flex items-start gap-3">
              <Wrench className="h-5 w-5 text-brand-electric-bright shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-medium text-white">Dispatched to: {dispatch.assigned_supplier}</span>
                <p className="text-brand-mist/80 mt-0.5">{dispatch.client_message}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/clients/work-orders"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-electric px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-electric/30 hover:bg-brand-electric/80 transition-all"
            >
              View Work Orders <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                setSubmissionResult(null);
                setDescription('');
                setEvidenceList([]);
                setAiAssessment(null);
                setConfirmedTitle('');
              }}
              className="rounded-lg border border-brand-edge-dark bg-brand-carbon px-5 py-2.5 text-sm font-normal text-brand-mist hover:bg-brand-void hover:text-white transition-all"
            >
              Log Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-brand-edge-dark/60 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Log a Job</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-electric/40 bg-brand-electric/10 px-3 py-0.5 text-[11px] font-medium text-brand-electric-bright">
                <Sparkles className="h-3 w-3" /> Multimodal AI Assisted
              </span>
            </div>
            <p className="mt-1.5 text-sm text-brand-mist/80 max-w-2xl">
              Tell us what’s wrong. Add photos, video or documents and EntireFM will help identify the issue, match equipment, and route it correctly.
            </p>
          </div>
          <span className="text-xs text-brand-mist/60 hidden sm:inline-block">
            {clientName} · {userName}
          </span>
        </div>
      </div>

      {/* Hidden Mobile Camera & Video Inputs */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,video/*,application/pdf"
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Intake & Evidence Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION A: Problem Description */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-electric/20 text-brand-electric-bright text-[11px]">1</span>
                What’s the Problem?
              </label>

              {/* Live Voice Recording Button */}
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/40 px-3 py-1 text-xs text-red-300 animate-pulse hover:bg-red-500/30 transition-colors"
                >
                  <MicOff className="h-3.5 w-3.5" /> Stop Recording ({recordingSeconds}s)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-1.5 rounded-full border border-brand-edge-dark bg-brand-void/80 px-2.5 py-1 text-xs text-brand-mist hover:text-white hover:border-brand-electric/40 transition-colors"
                >
                  <Mic className="h-3.5 w-3.5 text-brand-electric" /> Record Voice
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, fault or request in your own words (e.g. Water dripping from AHU-03 in 2nd floor plant room, alarm indicator blinking yellow)..."
              className="w-full rounded-lg border border-brand-edge-dark bg-brand-void/90 p-3.5 text-sm text-white placeholder-brand-mist/40 focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric resize-y transition-colors"
            />
          </div>

          {/* SECTION B: Media & Evidence Upload */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-electric/20 text-brand-electric-bright text-[11px]">2</span>
                Add Photos, Video or Documents
              </label>
              <span className="text-[11px] text-brand-mist/60">JPG, PNG, MP4, MOV, PDF</span>
            </div>

            {/* Mobile Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1 rounded-lg border border-brand-edge-dark bg-brand-void p-3 text-xs text-brand-mist hover:text-white hover:border-brand-electric/50 transition-colors"
              >
                <Camera className="h-5 w-5 text-brand-electric-bright" />
                <span>Take Photo</span>
              </button>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1 rounded-lg border border-brand-edge-dark bg-brand-void p-3 text-xs text-brand-mist hover:text-white hover:border-brand-electric/50 transition-colors"
              >
                <Video className="h-5 w-5 text-purple-400" />
                <span>Record Video</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1 rounded-lg border border-brand-edge-dark bg-brand-void p-3 text-xs text-brand-mist hover:text-white hover:border-brand-electric/50 transition-colors"
              >
                <Upload className="h-5 w-5 text-brand-mist" />
                <span>Files / PDF</span>
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                isDragging
                  ? 'border-brand-electric bg-brand-electric/10'
                  : 'border-brand-edge-dark/80 bg-brand-void/50 hover:border-brand-electric/50 hover:bg-brand-void/80'
              }`}
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-carbon border border-brand-edge-dark text-brand-mist mb-2">
                <Upload className="h-5 w-5 text-brand-electric" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-white">
                Drag and drop files here, or <span className="text-brand-electric-bright underline">browse</span>
              </p>
              <p className="mt-1 text-[11.5px] text-brand-mist/60">
                AI can analyse photos, video or equipment nameplates to identify faults and models.
              </p>
            </div>

            {/* Uploaded Evidence Cards */}
            {evidenceList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {evidenceList.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-3 rounded-lg border border-brand-edge-dark bg-brand-void/90 p-2.5 pr-8 group hover:border-brand-edge-light transition-colors"
                  >
                    {/* Thumbnail / Icon */}
                    <div className="h-12 w-12 shrink-0 rounded overflow-hidden bg-brand-carbon border border-brand-edge-dark flex items-center justify-center">
                      {item.type === 'IMAGE' && item.previewUrl ? (
                        <img src={item.previewUrl} alt={item.filename} className="h-full w-full object-cover" />
                      ) : item.type === 'VIDEO' ? (
                        <Film className="h-6 w-6 text-purple-400" />
                      ) : item.type === 'AUDIO' ? (
                        <Mic className="h-6 w-6 text-brand-electric" />
                      ) : (
                        <FileText className="h-6 w-6 text-brand-mist" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{item.filename}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] uppercase font-semibold text-brand-electric tracking-wider">
                          {item.type}
                        </span>
                        <span className="text-[10.5px] text-brand-mist/50">
                          {(item.sizeBytes / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEvidence(item.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-mist/40 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION C: Site & Location (Optional / Auto-resolved) */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-5 backdrop-blur-sm space-y-4">
            <label className="text-sm font-medium text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-electric/20 text-brand-electric-bright text-[11px]">3</span>
              Estate & Location Information
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11.5px] font-medium text-brand-mist/80 block mb-1">Site / Facility *</label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => {
                    setSelectedSiteId(e.target.value);
                    setSelectedAssetId('');
                  }}
                  className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2.5 text-xs text-white focus:border-brand-electric focus:outline-none"
                >
                  <option value="">Select site...</option>
                  {initialSites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.city ? `(${s.city})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11.5px] font-medium text-brand-mist/80 block mb-1">Specific Location / Room</label>
                <input
                  type="text"
                  value={locationNotes}
                  onChange={(e) => setLocationNotes(e.target.value)}
                  placeholder="e.g. Ground Floor, Plant Room B, Unit 4"
                  className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2.5 text-xs text-white focus:border-brand-electric focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-medium text-brand-mist/80 block mb-1">
                Asset (Optional — AI can match from photo)
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => {
                  setSelectedAssetId(e.target.value);
                  setAssetMatchDecision('MANUAL');
                }}
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2.5 text-xs text-white focus:border-brand-electric focus:outline-none"
              >
                <option value="">No specific asset / Unsure</option>
                {siteAssets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.asset_reference}) {a.location ? `— ${a.location}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11.5px] font-medium text-brand-mist/80 block mb-1">Access Notes / Permits</label>
              <input
                type="text"
                value={accessNotes}
                onChange={(e) => setAccessNotes(e.target.value)}
                placeholder="e.g. Key card required at reception; hot work permit needed"
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2.5 text-xs text-white focus:border-brand-electric focus:outline-none"
              />
            </div>
          </div>

          {/* Action: Analyse with EntireFM AI */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isAnalyzing || (!description && evidenceList.length === 0)}
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-electric to-blue-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-brand-electric/25 hover:from-brand-electric/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin text-white" />
                  <span>EntireFM AI is analysing your request...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-cyan-200" />
                  <span>Analyse with EntireFM AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis & Review Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Processing Indicator */}
          {isAnalyzing && (
            <div className="rounded-xl border border-brand-electric/40 bg-brand-carbon/90 p-6 backdrop-blur-md space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-electric/20 border border-brand-electric/40 flex items-center justify-center text-brand-electric-bright">
                  <Cpu className="h-4 w-4 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">EntireFM Multimodal Analysis</h3>
                  <p className="text-xs text-brand-electric-bright font-mono mt-0.5">{analysisStep}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-brand-mist/70 pt-2 border-t border-brand-edge-dark/60">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> <span>Reviewing description</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> <span>Analysing visual evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-electric animate-ping" /> <span>Matching estate equipment</span>
                </div>
                <div className="flex items-center gap-2 text-brand-mist/40">
                  <Clock className="h-3.5 w-3.5" /> <span>Assessing priority & routing</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis Error Notice */}
          {aiError && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-white">AI analysis notice:</span>
                <p className="mt-0.5 text-amber-200/80">{aiError}</p>
                <p className="mt-1 text-[11px] text-amber-300/70">You can still edit the details below and submit your job normally.</p>
              </div>
            </div>
          )}

          {/* Structured AI Review Panel */}
          {aiAssessment && (
            <div className="rounded-xl border border-brand-electric/40 bg-brand-carbon/90 p-5 backdrop-blur-md space-y-5 shadow-xl shadow-brand-electric/5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-electric" />
                  <h3 className="text-sm font-medium text-white">AI Assessment</h3>
                </div>
                <span className="rounded-full bg-brand-electric/10 border border-brand-electric/30 px-2.5 py-0.5 text-[10.5px] font-semibold text-brand-electric-bright">
                  {aiAssessment.confidence}% Confidence
                </span>
              </div>

              {/* Diagnosis & Summary */}
              <div className="space-y-2">
                <span className="text-[10.5px] uppercase tracking-wider text-brand-mist/60 font-semibold">Diagnosis</span>
                <p className="text-xs text-white font-medium bg-brand-void/80 rounded-lg p-3 border border-brand-edge-dark">
                  {aiAssessment.likely_issue}
                </p>
              </div>

              {/* Key Classification Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-brand-edge-dark bg-brand-void/60 p-2.5">
                  <span className="text-[10px] text-brand-mist/60 uppercase">Category</span>
                  <div className="font-medium text-white mt-0.5 truncate">{aiAssessment.category}</div>
                </div>

                <div className="rounded-lg border border-brand-edge-dark bg-brand-void/60 p-2.5">
                  <span className="text-[10px] text-brand-mist/60 uppercase">Recommended Trade</span>
                  <div className="font-medium text-brand-electric-bright mt-0.5 truncate">{aiAssessment.recommended_trade}</div>
                </div>

                <div className="rounded-lg border border-brand-edge-dark bg-brand-void/60 p-2.5">
                  <span className="text-[10px] text-brand-mist/60 uppercase">Suggested Priority</span>
                  <div className="font-medium text-amber-300 mt-0.5">{aiAssessment.priority.replace('_', ' ')}</div>
                </div>

                <div className="rounded-lg border border-brand-edge-dark bg-brand-void/60 p-2.5">
                  <span className="text-[10px] text-brand-mist/60 uppercase">Severity</span>
                  <div className="font-medium text-white mt-0.5">{aiAssessment.severity}</div>
                </div>
              </div>

              {/* Asset Match Card */}
              {aiAssessment.asset_match && (
                <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-200 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-purple-400" /> Possible Asset Match
                    </span>
                    <span className="text-[10.5px] text-purple-300 font-mono">
                      {aiAssessment.asset_match.confidence}% match
                    </span>
                  </div>

                  <div className="bg-brand-void/80 rounded p-2 border border-purple-500/20">
                    <p className="font-medium text-white">
                      {aiAssessment.asset_match.asset_name || aiAssessment.asset_identified}
                    </p>
                    {aiAssessment.asset_match.asset_reference && (
                      <p className="text-[11px] text-brand-mist/70 font-mono">
                        Ref: {aiAssessment.asset_match.asset_reference}
                      </p>
                    )}
                    <p className="text-[11px] text-purple-200/80 mt-1 italic">
                      "{aiAssessment.asset_match.reason}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {assetMatchDecision === 'CONFIRMED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <Check className="h-3.5 w-3.5" /> Asset Linked
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (aiAssessment.asset_match?.asset_id) {
                            setSelectedAssetId(aiAssessment.asset_match.asset_id);
                          }
                          setAssetMatchDecision('CONFIRMED');
                        }}
                        className="rounded bg-purple-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-purple-500 transition-colors"
                      >
                        Confirm Asset
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssetId('');
                        setAssetMatchDecision('REJECTED');
                      }}
                      className="rounded border border-brand-edge-dark bg-brand-void px-2.5 py-1 text-[11px] text-brand-mist hover:text-white transition-colors"
                    >
                      No Match
                    </button>
                  </div>
                </div>
              )}

              {/* Recommended Action */}
              {aiAssessment.recommended_action && (
                <div className="space-y-1 text-xs">
                  <span className="text-[10.5px] uppercase tracking-wider text-brand-mist/60 font-semibold">Recommended Action</span>
                  <p className="text-brand-mist/90 bg-brand-void/50 rounded-lg p-2.5 border border-brand-edge-dark/60">
                    {aiAssessment.recommended_action}
                  </p>
                </div>
              )}

              {/* Safety Flags */}
              {aiAssessment.safety_flags && aiAssessment.safety_flags.length > 0 && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 space-y-1.5 text-xs text-red-200">
                  <span className="font-semibold text-red-300 flex items-center gap-1.5 text-[11.5px]">
                    <ShieldAlert className="h-3.5 w-3.5 text-red-400" /> Safety Considerations
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-red-200/90">
                    {aiAssessment.safety_flags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence Reviewed Breakdown */}
              <div className="pt-2 border-t border-brand-edge-dark/60 flex items-center justify-between text-[11px] text-brand-mist/60">
                <span>Evidence: {evidenceList.length} attachment(s)</span>
                <span>Advisory assessment</span>
              </div>
            </div>
          )}

          {/* SECTION D: Human Review & Submission Form */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/80 p-5 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-medium text-white">Review & Confirm Job</h3>

            <div>
              <label className="text-[11.5px] font-medium text-brand-mist/80 block mb-1">Job Title *</label>
              <input
                type="text"
                value={confirmedTitle}
                onChange={(e) => setConfirmedTitle(e.target.value)}
                placeholder="Short summary of work order"
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2.5 text-xs text-white focus:border-brand-electric focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11.5px] font-medium text-brand-mist/80 block mb-1">Category</label>
                <select
                  value={confirmedCategory}
                  onChange={(e) => {
                    setConfirmedCategory(e.target.value);
                    const matched = CANONICAL_CATEGORIES.find((c) => c.id === e.target.value);
                    if (matched) setConfirmedTrade(matched.trade);
                  }}
                  className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2.5 text-xs text-white focus:border-brand-electric focus:outline-none"
                >
                  {CANONICAL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11.5px] font-medium text-brand-mist/80 block mb-1">Priority (SLA)</label>
                <select
                  value={confirmedPriority}
                  onChange={(e) => setConfirmedPriority(e.target.value)}
                  className="w-full rounded-lg border border-brand-edge-dark bg-brand-void p-2.5 text-xs text-white focus:border-brand-electric focus:outline-none"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.sla})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {submissionError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                {submissionError}
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting || !selectedSiteId || !confirmedTitle}
              onClick={handleSubmitJob}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Submitting to CAFM...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit Job</span>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-brand-mist/50">
              Creates a canonical work order in EntireFM with reactive dispatch routing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
