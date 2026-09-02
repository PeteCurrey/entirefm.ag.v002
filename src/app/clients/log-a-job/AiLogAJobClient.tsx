'use client';

/**
 * ENTIREFM — /LOG-A-JOB
 * PREMIUM CORPORATE OPERATIONAL TOOL
 * =========================================================================
 * Institutional FM Work-Order Intake & Service Desk Interface.
 * Built with Work Sans typography, clean white form surfaces, and clear
 * operational hierarchy for facility managers, property directors, and tenants.
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload,
  Camera,
  Video,
  FileText,
  Trash2,
  Mic,
  MicOff,
  Check,
  AlertCircle,
  ArrowRight,
  Clock,
  Phone,
  Building,
  MapPin,
  Paperclip,
} from 'lucide-react';

export interface SiteOption {
  id: string;
  name: string;
  site_code?: string;
  city?: string;
  postcode?: string;
}

export interface AssetOption {
  id: string;
  name: string;
  asset_reference?: string;
  category?: string;
  sub_category?: string;
  location?: string;
  site_id?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
}

export interface MultimodalEvidenceItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  mimeType: string;
  filename: string;
  sizeBytes: number;
  base64Data?: string;
  previewUrl?: string;
  storagePath?: string;
}

interface Props {
  clientName?: string;
  initialSites?: SiteOption[];
  initialAssets?: AssetOption[];
  userName?: string;
  isPublic?: boolean;
}

const CANONICAL_CATEGORIES = [
  { id: 'GENERAL_MAINTENANCE', label: 'General Maintenance & Handyman', trade: 'Multi-Skilled Technician' },
  { id: 'HVAC', label: 'Heating, Ventilation & Air Conditioning (HVAC)', trade: 'HVAC Engineer' },
  { id: 'PLUMBING', label: 'Plumbing & Water Services', trade: 'Plumbing Engineer' },
  { id: 'ELECTRICAL', label: 'Electrical Systems & Distribution', trade: 'Electrical Engineer' },
  { id: 'FIRE_LIFE_SAFETY', label: 'Fire & Life Safety Systems', trade: 'Fire Safety Specialist' },
  { id: 'BUILDING_FABRIC', label: 'Building Fabric, Roofs & Doors', trade: 'Fabric & Roofing Tech' },
  { id: 'CLEANING', label: 'Specialist & Environmental Cleaning', trade: 'Cleaning Operations' },
  { id: 'SECURITY', label: 'Access Control, CCTV & Security', trade: 'Security Engineer' },
  { id: 'DRAINAGE', label: 'Drainage & Below-Ground Waste', trade: 'Drainage Specialist' },
];

const PRIORITIES = [
  {
    id: 'P3_MEDIUM',
    title: 'Routine',
    sla: 'Standard SLA — 24 Hour Attendance',
    desc: 'Non-urgent maintenance, minor defects, or cosmetic rectification.',
  },
  {
    id: 'P2_HIGH',
    title: 'Urgent',
    sla: 'Prompt Attendance — 8 Hour Target',
    desc: 'Core service degraded or significant operational impact to occupants.',
  },
  {
    id: 'P1_CRITICAL',
    title: 'Emergency',
    sla: 'Immediate Response — 4 Hour Attendance',
    desc: 'Critical health and safety hazard, power failure, or active water leak.',
  },
];

export default function AiLogAJobClient({
  clientName = 'Commercial Client',
  initialSites = [],
  initialAssets = [],
  userName = '',
  isPublic = false,
}: Props) {
  // ── Form State ──
  const [selectedSiteId, setSelectedSiteId] = useState(initialSites.length === 1 ? initialSites[0].id : '');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [category, setCategory] = useState('GENERAL_MAINTENANCE');
  const [priority, setPriority] = useState<'P3_MEDIUM' | 'P2_HIGH' | 'P1_CRITICAL'>('P3_MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessNotes, setAccessNotes] = useState('');

  // ── Contact State ──
  const [contactName, setContactName] = useState(userName || '');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [companyName, setCompanyName] = useState(isPublic ? '' : clientName);

  // ── Evidence & Attachments State ──
  const [evidenceList, setEvidenceList] = useState<MultimodalEvidenceItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // ── Voice Recording State ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Hidden File Inputs for Mobile Devices ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ── Submission State ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Assets filtered by selected site
  const siteAssets = initialAssets.filter((a) => !selectedSiteId || a.site_id === selectedSiteId);

  // ── Voice Recording Handlers ──
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
            filename: `Voice-Record-${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`,
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

  // ── File Upload Handlers ──
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 20MB limit.`);
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

  // ── Form Validation ──
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (initialSites.length > 0 && !selectedSiteId) {
      errors.siteId = 'Please select a facility or site from your estate.';
    }

    if (isPublic && !propertyAddress.trim() && !locationNotes.trim()) {
      errors.propertyAddress = 'Please enter the building name, address, or postcode.';
    }

    if (!description.trim()) {
      errors.description = 'Please provide a clear description of the maintenance issue.';
    }

    if (isPublic) {
      if (!contactName.trim()) {
        errors.contactName = 'Please enter your full name.';
      }
      if (!contactEmail.trim() || !contactEmail.includes('@')) {
        errors.contactEmail = 'Please provide a valid work email address.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit Job ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const categoryObj = CANONICAL_CATEGORIES.find((c) => c.id === category);
    const resolvedTitle = title.trim() || `${categoryObj?.label || 'General Maintenance'} — ${description.slice(0, 55).trim()}`;

    try {
      const payload = {
        site_id: selectedSiteId || (isPublic ? 'PUBLIC_ESTATE' : ''),
        title: resolvedTitle,
        description: description.trim(),
        location_description: locationNotes.trim() || propertyAddress.trim() || undefined,
        asset_id: selectedAssetId || undefined,
        category,
        priority,
        access_notes: accessNotes.trim() || undefined,
        evidence: evidenceList,
        contact_name: contactName.trim() || undefined,
        contact_email: contactEmail.trim() || undefined,
        contact_phone: contactPhone.trim() || undefined,
        company_name: companyName.trim() || undefined,
        property_address: propertyAddress.trim() || locationNotes.trim() || undefined,
      };

      const res = await fetch('/api/clients/jobs/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit maintenance request. Please try again.');
      }

      setSubmissionResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('[SUBMISSION_ERROR]:', err);
      setServerError(err.message || 'An unexpected error occurred while communicating with EntireCAFM.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIRMATION VIEW (AFTER SUCCESSFUL SUBMISSION)
  // ─────────────────────────────────────────────────────────────────────────
  if (submissionResult) {
    const refNumber =
      submissionResult.service_request?.reference ||
      submissionResult.work_order?.work_order_number ||
      'EFM-' + Math.floor(100000 + Math.random() * 900000);
    const woNumber = submissionResult.work_order?.work_order_number;
    const slaHours = submissionResult.service_request?.sla_hours || (priority === 'P1_CRITICAL' ? 4 : priority === 'P2_HIGH' ? 8 : 24);

    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white border border-slate-200 rounded p-8 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-light text-slate-900 tracking-tight">Maintenance Job Logged</h1>
                <p className="text-xs text-slate-500 mt-0.5">Your work order has been logged into EntireCAFM.</p>
              </div>
            </div>
          </div>

          {/* Reference Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded p-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block">Reference Number</span>
              <span className="text-base font-medium text-slate-900 font-mono mt-0.5 block">{refNumber}</span>
            </div>
            {woNumber && (
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block">Work Order</span>
                <span className="text-base font-medium text-slate-900 font-mono mt-0.5 block">{woNumber}</span>
              </div>
            )}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block">Target Resolution</span>
              <span className="text-base font-medium text-slate-900 mt-0.5 block">{slaHours} Hours (SLA)</span>
            </div>
          </div>

          {/* Operational Context Summary */}
          <div className="space-y-3 text-sm text-slate-600 font-normal leading-relaxed">
            <p>
              Your request has been routed to EntireFM Technical Operations Desk. An operations coordinator has been assigned to
              triage the issue, verify contractor competency, and authorize attendance.
            </p>
            <p className="text-xs text-slate-500">
              A formal confirmation notice has been queued for your records. If access protocols or health & safety permits change,
              please quote reference <strong className="text-slate-800">{refNumber}</strong> when contacting our desk.
            </p>
          </div>

          {/* Emergency / Contact Helpdesk Banner */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <span className="font-medium text-slate-800">Need immediate assistance on this job?</span>
              <p className="text-slate-500 mt-0.5">Contact the 24/7 EntireFM Helpdesk on 020 4586 5422.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setSubmissionResult(null);
                  setDescription('');
                  setTitle('');
                  setEvidenceList([]);
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Log Another Job
              </button>
              {!isPublic ? (
                <Link
                  href="/clients/work-orders"
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-center"
                >
                  View Work Orders →
                </Link>
              ) : (
                <Link
                  href="/"
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors text-center"
                >
                  Return to Home →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN WORK-ORDER INTAKE INTERFACE
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ── Breadcrumb & Page Context Header ── */}
      <div>
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center space-x-2 text-xs text-slate-500 font-normal">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          {!isPublic && (
            <>
              <Link href="/clients" className="hover:text-slate-900 transition-colors">
                Client Portal
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900 font-medium">Log a Job</span>
        </nav>

        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Log a Maintenance Job
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 font-normal max-w-3xl leading-relaxed">
            Report a reactive maintenance issue, equipment breakdown, or building services fault. All requests are logged
            directly into EntireCAFM, reviewed by our technical helpdesk, and assigned for contractor attendance.
          </p>
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

      {/* ── 2-Column Corporate Grid (Left: Process / Helpdesk, Right: Work-Order Form) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Operational Expectations & Emergency Contacts (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Operational Workflow Card */}
          <div className="rounded border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Operational Workflow
            </h3>
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  01
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Request Received</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5">
                    Durable CAFM reference generated and timestamped immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  02
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Technical Triage</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5">
                    Engineering desk classifies trade discipline, verifies warranty, and validates priority SLA.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  03
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Engineer Assigned</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5">
                    Qualified contractor or mobile technician dispatched with required equipment parts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  04
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Attendance & Closure</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5">
                    On-site rectification, photographic proof-of-work, and digital sign-off completed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Operations Box */}
          <div className="rounded border border-slate-200 bg-slate-50/80 p-5 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Immediate Assistance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              For major building safety emergencies, active sprinkler activations, uncontained structural water leaks, or total power failure:
            </p>
            <div className="pt-2">
              <a
                href="tel:02045865422"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-hero-pink transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                <span>020 4586 5422</span>
              </a>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                EntireFM 24/7 National Operations Desk
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Unified Form Surface (8 cols) */}
        <main className="lg:col-span-8">
          <form onSubmit={handleSubmit} noValidate className="rounded border border-slate-200 bg-white p-6 sm:p-8 space-y-8 shadow-sm">
            {/* Global Server Error Display */}
            {serverError && (
              <div className="flex items-start gap-3 rounded bg-red-50 border border-red-200 p-4 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Submission could not be completed</span>
                  <p className="mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            {/* ── SECTION 1: SITE & LOCATION ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  1. Site & Location Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialSites.length > 0 ? (
                  <div className="sm:col-span-2">
                    <label htmlFor="site-select" className="text-xs font-medium text-slate-800 block mb-1">
                      Facility / Property Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="site-select"
                      value={selectedSiteId}
                      onChange={(e) => {
                        setSelectedSiteId(e.target.value);
                        setSelectedAssetId('');
                        if (formErrors.siteId) setFormErrors((prev) => ({ ...prev, siteId: '' }));
                      }}
                      className={`w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-1 ${
                        formErrors.siteId
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                          : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                      }`}
                    >
                      <option value="">Select facility...</option>
                      {initialSites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.city ? `(${s.city})` : ''}
                        </option>
                      ))}
                    </select>
                    {formErrors.siteId && (
                      <p className="text-xs text-red-600 mt-1 font-normal">{formErrors.siteId}</p>
                    )}
                  </div>
                ) : (
                  <div className="sm:col-span-2">
                    <label htmlFor="property-address" className="text-xs font-medium text-slate-800 block mb-1">
                      Building Name & Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="property-address"
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => {
                        setPropertyAddress(e.target.value);
                        if (formErrors.propertyAddress) setFormErrors((prev) => ({ ...prev, propertyAddress: '' }));
                      }}
                      placeholder="e.g. Unit 4, St. Peter's Business Park, Manchester, M1 2AB"
                      className={`w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
                        formErrors.propertyAddress
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                          : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                      }`}
                    />
                    {formErrors.propertyAddress && (
                      <p className="text-xs text-red-600 mt-1 font-normal">{formErrors.propertyAddress}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="location-room" className="text-xs font-medium text-slate-800 block mb-1">
                    Specific Room / Floor / Area
                  </label>
                  <input
                    id="location-room"
                    type="text"
                    value={locationNotes}
                    onChange={(e) => setLocationNotes(e.target.value)}
                    placeholder="e.g. Ground Floor, Plant Room B, Unit 4"
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="asset-select" className="text-xs font-medium text-slate-800 block mb-1">
                    Equipment / Asset (Optional)
                  </label>
                  <select
                    id="asset-select"
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  >
                    <option value="">No specific asset / Unsure</option>
                    {siteAssets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.asset_reference}) {a.location ? `— ${a.location}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ── SECTION 2: ISSUE TYPE & PRIORITY ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  2. Classification & Priority
                </h2>
              </div>

              <div>
                <label htmlFor="category-select" className="text-xs font-medium text-slate-800 block mb-1">
                  Service Trade / Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                >
                  {CANONICAL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-800 block mb-2">
                  Operational Priority <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRIORITIES.map((p) => {
                    const isSelected = priority === p.id;
                    const isEmergency = p.id === 'P1_CRITICAL';
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as any)}
                        className={`text-left p-3.5 rounded border transition-all ${
                          isSelected
                            ? isEmergency
                              ? 'border-red-600 bg-red-50/50 ring-1 ring-red-600'
                              : 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold tracking-wide uppercase ${
                              isSelected
                                ? isEmergency
                                  ? 'text-red-800'
                                  : 'text-slate-900'
                                : 'text-slate-700'
                            }`}
                          >
                            {p.title}
                          </span>
                          {isSelected && (
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isEmergency ? 'bg-red-600' : 'bg-slate-900'
                              }`}
                            />
                          )}
                        </div>
                        <span className="block text-[11px] font-medium text-slate-500 mt-1">
                          {p.sla}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-1 leading-normal font-normal">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── SECTION 3: DESCRIPTION OF ISSUE ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  3. Description of Issue
                </h2>

                {/* Subtle Voice Recording Option */}
                {isRecording ? (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    <MicOff className="h-3.5 w-3.5" />
                    <span>Stop Recording ({recordingSeconds}s)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-normal transition-colors"
                  >
                    <Mic className="h-3.5 w-3.5 text-slate-500" />
                    <span>Record Voice Note</span>
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="job-title" className="text-xs font-medium text-slate-800 block mb-1">
                  Brief Summary / Title (Optional)
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Water leak from AHU-03 in roof plant room"
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label htmlFor="job-desc" className="text-xs font-medium text-slate-800 block mb-1">
                  Detailed Observations & Symptoms <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="job-desc"
                  rows={5}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) setFormErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  placeholder="Please describe the issue, what you have observed and where it is located."
                  className={`w-full rounded border bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors resize-y focus:outline-none focus:ring-1 ${
                    formErrors.description
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                      : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{formErrors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="access-notes" className="text-xs font-medium text-slate-800 block mb-1">
                  Access Requirements / Permits (Optional)
                </label>
                <input
                  id="access-notes"
                  type="text"
                  value={accessNotes}
                  onChange={(e) => setAccessNotes(e.target.value)}
                  placeholder="e.g. Sign in at reception; ladder access required; roof permit needed"
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            {/* ── SECTION 4: ATTACHMENTS & PHOTOGRAPHS ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  4. Attachments & Photographs
                </h2>
              </div>

              <p className="text-xs text-slate-500 font-normal">
                Photos or technical documentation help our engineering team identify the issue and dispatch correct components before attendance.
              </p>

              {/* Mobile Camera & File Buttons */}
              <div className="grid grid-cols-3 gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded border border-slate-300 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Camera className="h-4 w-4 text-slate-600" />
                  <span>Take Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded border border-slate-300 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Video className="h-4 w-4 text-slate-600" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded border border-slate-300 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Paperclip className="h-4 w-4 text-slate-600" />
                  <span>Files</span>
                </button>
              </div>

              {/* Subtle Drag & Drop Upload Zone */}
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
                className={`cursor-pointer rounded border border-dashed p-6 text-center transition-colors ${
                  isDragging ? 'border-slate-700 bg-slate-100/70' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <p className="text-xs sm:text-sm font-medium text-slate-800">
                  Drag and drop files here, or <span className="text-[#0066CC] underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-slate-500 font-normal">
                  JPG, PNG, MP4, MOV or PDF (up to 20MB per file)
                </p>
              </div>

              {/* Uploaded Evidence Cards */}
              {evidenceList.length > 0 && (
                <div className="space-y-2 pt-1">
                  {evidenceList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded border border-slate-200 bg-slate-50/70 p-2.5 px-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{item.filename}</span>
                        <span className="text-slate-400 shrink-0 font-normal">
                          ({(item.sizeBytes / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidence(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        aria-label={`Remove ${item.filename}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── SECTION 5: CONTACT DETAILS ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  5. Requester & Contact Information
                </h2>
              </div>

              {isPublic ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="text-xs font-medium text-slate-800 block mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => {
                        setContactName(e.target.value);
                        if (formErrors.contactName) setFormErrors((prev) => ({ ...prev, contactName: '' }));
                      }}
                      placeholder="e.g. Sarah Jenkins"
                      className={`w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
                        formErrors.contactName
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                          : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                      }`}
                    />
                    {formErrors.contactName && (
                      <p className="text-xs text-red-600 mt-1 font-normal">{formErrors.contactName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="text-xs font-medium text-slate-800 block mb-1">
                      Work Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => {
                        setContactEmail(e.target.value);
                        if (formErrors.contactEmail) setFormErrors((prev) => ({ ...prev, contactEmail: '' }));
                      }}
                      placeholder="e.g. s.jenkins@company.co.uk"
                      className={`w-full rounded border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
                        formErrors.contactEmail
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                          : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                      }`}
                    />
                    {formErrors.contactEmail && (
                      <p className="text-xs text-red-600 mt-1 font-normal">{formErrors.contactEmail}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="text-xs font-medium text-slate-800 block mb-1">
                      Telephone / Mobile
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 07700 900123"
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                    />
                  </div>

                  <div>
                    <label htmlFor="company-name" className="text-xs font-medium text-slate-800 block mb-1">
                      Company / Organization
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acorn Logistics Ltd"
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-1">
                  <span className="font-medium text-slate-800 block">
                    Reporting on behalf of: <span className="font-normal text-slate-700">{clientName}</span>
                  </span>
                  <span className="text-slate-500 block">
                    Logged-in user: <span className="text-slate-700 font-medium">{userName || 'Authorised Client Contact'}</span>
                  </span>
                </div>
              )}
            </div>

            {/* ── SUBMISSION ACTION ── */}
            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-normal">
                By submitting, this work order is queued for review by EntireFM Technical Helpdesk.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-hero-pink px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-hero-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span>Submitting job...</span>
                ) : (
                  <>
                    <span>LOG MAINTENANCE JOB</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
