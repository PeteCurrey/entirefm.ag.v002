'use client';

/**
 * ENTIREFM — /LOG-A-JOB
 * TENANT & MANAGING AGENT SAFE WORK-ORDER INTAKE
 * =========================================================================
 * Institutional FM Work-Order Intake & Service Desk Interface.
 * Built with Work Sans typography, clean white form surfaces, and strict
 * tenant-safe data isolation for occupiers, managing agents, and clients.
 *
 * Information Model:
 *   PROPERTY + LOCATION + ISSUE + URGENCY + ACCESS + REPORTER
 *
 * Security & Isolation:
 *   - No internal client accounts, notes, other tenants, or pricing exposed
 *   - No global property enumeration; strictly scoped to user permissions
 *   - Clean EFM-XXXXXX safe reference on completion
 */

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Camera,
  Video,
  FileText,
  Trash2,
  Mic,
  MicOff,
  Check,
  AlertCircle,
  ArrowRight,
  Phone,
  Paperclip,
  CheckCircle2,
  Building2,
  Clock,
  Shield,
  User,
  KeyRound,
  MapPin,
  Wrench,
} from 'lucide-react';

export interface SiteOption {
  id: string;
  name: string;
  site_code?: string;
  city?: string;
  postcode?: string;
  address_line1?: string;
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
  userEmail?: string;
  isPublic?: boolean;
  prefillProperty?: string;
  prefillUnit?: string;
}

const CANONICAL_CATEGORIES = [
  { id: 'GENERAL_MAINTENANCE', label: 'General Maintenance & Handyman', trade: 'Multi-Skilled Technician' },
  { id: 'HVAC', label: 'Heating, Ventilation & Air Conditioning (HVAC)', trade: 'HVAC Engineer' },
  { id: 'PLUMBING', label: 'Plumbing, Drainage & Water Services', trade: 'Plumbing Engineer' },
  { id: 'ELECTRICAL', label: 'Electrical Systems & Distribution', trade: 'Electrical Engineer' },
  { id: 'FIRE_LIFE_SAFETY', label: 'Fire & Life Safety Systems', trade: 'Fire Safety Specialist' },
  { id: 'BUILDING_FABRIC', label: 'Building Fabric, Roofs, Windows & Doors', trade: 'Fabric & Roofing Tech' },
  { id: 'CLEANING', label: 'Specialist & Environmental Cleaning', trade: 'Cleaning Operations' },
  { id: 'SECURITY', label: 'Access Control, CCTV, Gates & Security', trade: 'Security Engineer' },
  { id: 'DRAINAGE', label: 'Drainage & Below-Ground Waste', trade: 'Drainage Specialist' },
];

const LOCATION_TYPES = [
  { id: 'FLAT_UNIT', label: 'Flat / Apartment / Unit' },
  { id: 'OFFICE_SUITE', label: 'Office / Suite' },
  { id: 'FLOOR_LEVEL', label: 'Floor / Level' },
  { id: 'ROOM_AREA', label: 'Room / Kitchen / Bathroom' },
  { id: 'COMMUNAL', label: 'Communal / Entrance Area' },
  { id: 'PLANT_ROOM', label: 'Plant Room / Riser' },
  { id: 'EXTERNAL', label: 'Car Park / External Area' },
  { id: 'OTHER', label: 'Other' },
];

const IMPACT_OPTIONS = [
  { id: 'NO_DISRUPTION', label: 'No significant disruption', desc: 'Minor cosmetic or non-urgent maintenance defect' },
  { id: 'PARTIAL_PREMISES', label: 'Affecting part of the premises', desc: 'Isolated area or single fixture out of action' },
  { id: 'BUSINESS_OPERATIONS', label: 'Affecting business operations', desc: 'Impacts normal daily operations or tenant trade' },
  { id: 'ACCESS_SECURITY', label: 'Affecting access / security', desc: 'Issue with entrance doors, locks, barriers or gates' },
  { id: 'HEALTH_SAFETY', label: 'Health / safety concern', desc: 'Potential hazard requiring prompt evaluation' },
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

const REPORTING_ON_BEHALF_OPTIONS = [
  { id: 'MYSELF', label: 'Myself / my premises' },
  { id: 'COMPANY', label: 'My company / tenant organisation' },
  { id: 'MANAGING_AGENT', label: 'My managing agent / landlord' },
  { id: 'COMMUNAL', label: 'Building / communal area' },
  { id: 'OTHER', label: 'Other' },
];

const ACCESS_TYPES = [
  { id: 'YES', label: 'Yes — Unrestricted access during standard hours' },
  { id: 'NO', label: 'No — Restricted or locked area' },
  { id: 'ARRANGEMENT', label: 'Requires arrangement / Call before attending' },
];

export default function AiLogAJobClient({
  clientName = 'Commercial Property',
  initialSites = [],
  initialAssets = [],
  userName = '',
  userEmail = '',
  isPublic = false,
  prefillProperty = '',
  prefillUnit = '',
}: Props) {
  // ── Form State: Property & Location ──
  const [selectedSiteId, setSelectedSiteId] = useState(initialSites.length === 1 ? initialSites[0].id : '');
  const [propertyAddress, setPropertyAddress] = useState(prefillProperty || '');
  const [managingAgentName, setManagingAgentName] = useState('');
  const [locationType, setLocationType] = useState('FLAT_UNIT');
  const [locationNotes, setLocationNotes] = useState('');
  const [unitNumber, setUnitNumber] = useState(prefillUnit || '');

  // ── Form State: Issue & Impact ──
  const [category, setCategory] = useState('GENERAL_MAINTENANCE');
  const [impact, setImpact] = useState('NO_DISRUPTION');
  const [priority, setPriority] = useState<'P3_MEDIUM' | 'P2_HIGH' | 'P1_CRITICAL'>('P3_MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');

  // ── Form State: Access ──
  const [accessType, setAccessType] = useState('YES');
  const [accessNotes, setAccessNotes] = useState('');
  const [preferredTimes, setPreferredTimes] = useState('ANYTIME');

  // ── Form State: Reporter Details ──
  const [reportingOnBehalfOf, setReportingOnBehalfOf] = useState('MYSELF');
  const [contactName, setContactName] = useState(userName || '');
  const [contactEmail, setContactEmail] = useState(userEmail || '');
  const [contactPhone, setContactPhone] = useState('');
  const [occupierName, setOccupierName] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');

  // ── Evidence & Attachments State ──
  const [evidenceList, setEvidenceList] = useState<MultimodalEvidenceItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // ── Voice Recording State ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Hidden File Inputs ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ── Submission State ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Filtered site-scoped assets (only relevant for authenticated clients with explicit assets)
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

    if (initialSites.length > 1 && !selectedSiteId) {
      errors.siteId = 'Please select the property from your authorised list.';
    }

    if (isPublic && !propertyAddress.trim()) {
      errors.propertyAddress = 'Please enter the building name, property address, or postcode.';
    }

    if (!description.trim()) {
      errors.description = 'Please describe the maintenance issue.';
    }

    if (!contactName.trim()) {
      errors.contactName = 'Please enter your full name.';
    }

    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      errors.contactEmail = 'Please provide a valid email address for confirmation.';
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
    const locationTypeLabel = LOCATION_TYPES.find((l) => l.id === locationType)?.label || locationType;
    const impactLabel = IMPACT_OPTIONS.find((i) => i.id === impact)?.label || impact;
    const behalfLabel = REPORTING_ON_BEHALF_OPTIONS.find((b) => b.id === reportingOnBehalfOf)?.label || reportingOnBehalfOf;
    const accessLabel = ACCESS_TYPES.find((a) => a.id === accessType)?.label || accessType;

    const resolvedTitle =
      title.trim() ||
      `${categoryObj?.label || 'General Maintenance'}${locationNotes ? ` — ${locationNotes}` : ''}`;

    try {
      const payload = {
        site_id: selectedSiteId || (isPublic ? 'PUBLIC_ESTATE' : ''),
        title: resolvedTitle,
        description: description.trim(),
        location_type: locationTypeLabel,
        location_description: locationNotes.trim() || undefined,
        unit_number: unitNumber.trim() || undefined,
        impact: impactLabel,
        equipment_description: equipmentDescription.trim() || undefined,
        asset_id: selectedAssetId || undefined,
        category,
        priority,
        access_type: accessLabel,
        access_notes: accessNotes.trim() || undefined,
        preferred_times: preferredTimes,
        reporting_on_behalf_of: behalfLabel,
        occupier_name: occupierName.trim() || contactName.trim() || undefined,
        managing_agent_name: managingAgentName.trim() || undefined,
        preferred_contact_method: preferredContactMethod,
        evidence: evidenceList,
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        contact_phone: contactPhone.trim() || undefined,
        property_address: propertyAddress.trim() || undefined,
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
  // CONFIRMATION VIEW (TENANT & CLIENT SAFE)
  // ─────────────────────────────────────────────────────────────────────────
  if (submissionResult) {
    const refNumber =
      submissionResult.reference ||
      submissionResult.service_request?.reference ||
      submissionResult.work_order?.work_order_number ||
      'EFM-' + Math.floor(100000 + Math.random() * 900000);

    const categoryLabel = CANONICAL_CATEGORIES.find((c) => c.id === category)?.label || 'Maintenance Request';

    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-5 w-5 stroke-[2.5]" />
              </span>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700 block">
                  Job Logged
                </span>
                <h1 className="text-2xl font-light text-slate-900 tracking-tight">
                  Your maintenance request has been received.
                </h1>
              </div>
            </div>
          </div>

          {/* Reference Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block">
                Job Reference Number
              </span>
              <span className="text-2xl font-mono font-medium text-slate-950 mt-0.5 block tracking-tight">
                {refNumber}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                Safe reference to quote for follow-ups with EntireFM or your managing agent.
              </span>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Queued for Triage</span>
              </span>
            </div>
          </div>

          {/* Request Summary */}
          <div className="rounded-sm border border-slate-100 bg-slate-50/50 p-4 space-y-2 text-xs text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Property / Location:</span>
              <span className="font-normal text-slate-900 text-right">
                {initialSites.find((s) => s.id === selectedSiteId)?.name || propertyAddress || 'Commercial Property'}
                {unitNumber ? ` (Unit ${unitNumber})` : ''}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Discipline / Trade:</span>
              <span className="font-normal text-slate-900">{categoryLabel}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Priority:</span>
              <span className="font-normal text-slate-900">
                {PRIORITIES.find((p) => p.id === priority)?.title || 'Routine'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Contact Confirmation:</span>
              <span className="font-normal text-slate-900">{contactEmail}</span>
            </div>
          </div>

          {/* Operational Context Summary */}
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            <p>
              The request has been submitted to the appropriate facilities-management workflow. Our technical desk will
              review the details and coordinate attendance according to site access protocols.
            </p>
            <p className="text-xs text-slate-500 font-normal">
              A confirmation record has been generated. If access instructions or circumstances change, please quote
              reference <strong className="text-slate-800 font-semibold">{refNumber}</strong>.
            </p>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <span className="font-medium text-slate-800">Need immediate assistance on this job?</span>
              <p className="text-slate-500 mt-0.5">Contact the 24/7 Operations Desk on 020 4617 0228.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setSubmissionResult(null);
                  setDescription('');
                  setTitle('');
                  setLocationNotes('');
                  setEquipmentDescription('');
                  setAccessNotes('');
                  setEvidenceList([]);
                }}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-normal border border-slate-300 rounded-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Log Another Issue
              </button>
              {!isPublic ? (
                <Link
                  href="/clients/work-orders"
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-normal bg-brand-graphite text-white rounded-sm hover:bg-slate-800 transition-colors text-center"
                >
                  View Work Orders →
                </Link>
              ) : (
                <Link
                  href="/"
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-normal bg-brand-graphite text-white rounded-sm hover:bg-slate-800 transition-colors text-center"
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
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center space-x-2 text-xs text-slate-500 font-light">
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
          <span className="text-slate-900 font-normal">Log a Job</span>
        </nav>

        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-electric" />
            <span className="text-[11px] tracking-widest text-slate-500 uppercase font-light">
              Maintenance Helpdesk &amp; Work-Order Intake
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
            Log a Maintenance Job
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-light max-w-3xl leading-relaxed">
            Report a reactive maintenance issue, equipment breakdown, or building services fault. All requests are logged
            directly into the EntireFM Operations Desk and queued for review and attendance.
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

      {/* ── 2-Column Corporate Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Operational Expectations & Immediate Assistance (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {/* Operational Workflow Card */}
          <div className="rounded-sm border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Operational Workflow
            </h3>
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  01
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Request Received</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 font-light">
                    Durable EFM reference generated and timestamped immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  02
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Technical Triage</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 font-light">
                    Helpdesk classifies trade discipline, validates urgency, and checks access notes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  03
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Attendance Arranged</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 font-light">
                    Qualified trade contractor or mobile engineer dispatched with appropriate parts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-700">
                  04
                </span>
                <div>
                  <h4 className="text-xs font-medium text-slate-900">Completion &amp; Sign-off</h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 font-light">
                    On-site rectification, photographic proof-of-work, and digital closure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Operations Box */}
          <div className="rounded-sm border border-slate-200 bg-slate-50/90 p-5 space-y-3.5 shadow-2xs">
            <div className="border-b border-slate-200 pb-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Immediate Assistance
              </h3>
            </div>
            <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-normal">
              <p>
                If there is an immediate danger to life or property, or someone may be at risk of serious harm, call <strong className="font-semibold text-slate-950 underline decoration-slate-400 decoration-1 underline-offset-2">999</strong> first. Do not wait for a response from EntireFM.
              </p>
              <p className="text-slate-600 text-[11.5px] font-light">
                Once the emergency has been dealt with, you can log the issue here for our records and follow-up.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                24/7 Operations Desk
              </span>
              <a
                href="tel:02046170228"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-brand-electric transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                <span>020 4617 0228</span>
              </a>
              <span className="block text-[11px] text-slate-500 mt-0.5 font-light">
                For non-life-threatening urgent FM coordination
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Unified Tenant-Safe Form Surface (8 cols) */}
        <main className="lg:col-span-8">
          <form onSubmit={handleSubmit} noValidate className="rounded-sm border border-slate-200 bg-white p-6 sm:p-8 space-y-8 shadow-sm">
            {/* Global Server Error Display */}
            {serverError && (
              <div className="flex items-start gap-3 rounded-sm bg-red-50 border border-red-200 p-4 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Submission could not be completed</span>
                  <p className="mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            {/* ── SAFETY NOTICE: IMMEDIATE ASSISTANCE ── */}
            <div className="border-l-2 border-slate-400 bg-slate-50/80 px-4 py-3.5 rounded-r text-xs text-slate-700 leading-relaxed space-y-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-900">
                Immediate Assistance
              </h3>
              <p className="text-slate-800 font-normal">
                If there is an immediate danger to life or property, or someone may be at risk of serious harm, call <strong className="font-semibold text-slate-950 underline decoration-slate-400 decoration-1 underline-offset-2">999</strong> first. Do not wait for a response from EntireFM.
              </p>
              <p className="text-slate-600 text-[11.5px] font-light">
                Once the emergency has been dealt with, you can log the issue here for our records and follow-up.
              </p>
            </div>

            {/* ── SECTION 1: PROPERTY & LOCATION WITHIN PROPERTY ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  1. Property &amp; Location Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Property Scope */}
                {initialSites.length === 1 ? (
                  // Single Authorised Site (Pre-selected, no dropdown)
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Authorised Property
                    </label>
                    <div className="flex items-center gap-2 p-2.5 px-3 rounded-sm bg-slate-50 border border-slate-200 text-sm text-slate-900">
                      <Building2 className="h-4 w-4 text-slate-500 shrink-0" />
                      <span className="font-medium">{initialSites[0].name}</span>
                      {initialSites[0].city && (
                        <span className="text-xs text-slate-500">({initialSites[0].city})</span>
                      )}
                    </div>
                  </div>
                ) : initialSites.length > 1 ? (
                  // Multiple Authorised Sites (Strictly scoped)
                  <div className="sm:col-span-2">
                    <label htmlFor="site-select" className="text-xs font-medium text-slate-800 block mb-1">
                      Select Authorised Property <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="site-select"
                      value={selectedSiteId}
                      onChange={(e) => {
                        setSelectedSiteId(e.target.value);
                        setSelectedAssetId('');
                        if (formErrors.siteId) setFormErrors((prev) => ({ ...prev, siteId: '' }));
                      }}
                      className={`w-full rounded-sm border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-1 ${
                        formErrors.siteId
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                          : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                      }`}
                    >
                      <option value="">Select from your authorised properties...</option>
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
                  // Tenant / Public Entry (No database browse leak)
                  <>
                    <div className="sm:col-span-2">
                      <label htmlFor="property-address" className="text-xs font-medium text-slate-800 block mb-1">
                        Building Name &amp; Address / Postcode <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="property-address"
                        type="text"
                        value={propertyAddress}
                        onChange={(e) => {
                          setPropertyAddress(e.target.value);
                          if (formErrors.propertyAddress) setFormErrors((prev) => ({ ...prev, propertyAddress: '' }));
                        }}
                        placeholder="e.g. St Paul's House, 10 Norfolk Street, Sheffield, S1 2JE"
                        className={`w-full rounded-sm border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
                          formErrors.propertyAddress
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                            : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                        }`}
                      />
                      {formErrors.propertyAddress && (
                        <p className="text-xs text-red-600 mt-1 font-normal">{formErrors.propertyAddress}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="managing-agent" className="text-xs font-medium text-slate-700 block mb-1">
                        Managing Agent / Landlord Name (Optional)
                      </label>
                      <input
                        id="managing-agent"
                        type="text"
                        value={managingAgentName}
                        onChange={(e) => setManagingAgentName(e.target.value)}
                        placeholder="e.g. Apex Property Management (if reporting on their behalf)"
                        className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                      />
                    </div>
                  </>
                )}

                {/* Location Type Selector */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-800 block mb-1.5">
                    Where is the problem? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LOCATION_TYPES.map((loc) => {
                      const isSelected = locationType === loc.id;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setLocationType(loc.id)}
                          className={`px-3 py-2 text-left rounded-sm border text-xs font-normal transition-all ${
                            isSelected
                              ? 'border-brand-graphite bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {loc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Location Detail */}
                <div>
                  <label htmlFor="location-room" className="text-xs font-medium text-slate-800 block mb-1">
                    Specific Room / Floor / Area Description
                  </label>
                  <input
                    id="location-room"
                    type="text"
                    value={locationNotes}
                    onChange={(e) => setLocationNotes(e.target.value)}
                    placeholder="e.g. Third floor, outside Suite 3B, or kitchen sink"
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                </div>

                {/* Unit / Suite Number */}
                <div>
                  <label htmlFor="unit-number" className="text-xs font-medium text-slate-800 block mb-1">
                    Flat / Unit / Suite Number (If applicable)
                  </label>
                  <input
                    id="unit-number"
                    type="text"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    placeholder="e.g. Flat 12, Unit 4B, Suite 301"
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 2: ISSUE DETAILS & PRACTICAL IMPACT ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  2. Issue Details &amp; Impact
                </h2>
              </div>

              {/* Trade Category */}
              <div>
                <label htmlFor="category-select" className="text-xs font-medium text-slate-800 block mb-1">
                  Service Trade / Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                >
                  {CANONICAL_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Practical Impact Selector */}
              <div>
                <label className="text-xs font-medium text-slate-800 block mb-1.5">
                  What is the practical impact?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {IMPACT_OPTIONS.map((opt) => {
                    const isSelected = impact === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setImpact(opt.id)}
                        className={`text-left p-3 rounded-sm border text-xs transition-all ${
                          isSelected
                            ? 'border-brand-graphite bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className="font-medium block">{opt.label}</span>
                        <span
                          className={`text-[11px] block mt-0.5 font-light ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Operational Priority */}
              <div>
                <label className="text-xs font-medium text-slate-800 block mb-2">
                  Operational Urgency <span className="text-red-500">*</span>
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
                        className={`text-left p-3.5 rounded-sm border transition-all ${
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
                        <span className="block text-[11px] text-slate-500 mt-1 leading-normal font-light">
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Title & Description */}
              <div>
                <label htmlFor="job-title" className="text-xs font-medium text-slate-800 block mb-1">
                  Brief Summary / Title (Optional)
                </label>
                <input
                  id="job-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Water leak under kitchen sink in Flat 12"
                  className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="job-desc" className="text-xs font-medium text-slate-800 block">
                    Problem Description <span className="text-red-500">*</span>
                  </label>

                  {/* Voice Note Option */}
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
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-light transition-colors"
                    >
                      <Mic className="h-3.5 w-3.5 text-slate-500" />
                      <span>Record Voice Note</span>
                    </button>
                  )}
                </div>
                <textarea
                  id="job-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) setFormErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  placeholder="Please describe what is happening, where it is located, and any visible symptoms."
                  className={`w-full rounded-sm border bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors resize-y focus:outline-none focus:ring-1 ${
                    formErrors.description
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                      : 'border-slate-300 focus:border-slate-800 focus:ring-slate-800'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-600 mt-1 font-normal">{formErrors.description}</p>
                )}
              </div>

              {/* Affected Equipment / Asset */}
              <div>
                <label htmlFor="equipment-desc" className="text-xs font-medium text-slate-800 block mb-1">
                  Affected Equipment / Asset (Optional)
                </label>
                {siteAssets.length > 0 ? (
                  <select
                    id="asset-select"
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  >
                    <option value="">Select registered equipment (or describe below)...</option>
                    {siteAssets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.asset_reference}) {a.location ? `— ${a.location}` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="equipment-desc"
                    type="text"
                    value={equipmentDescription}
                    onChange={(e) => setEquipmentDescription(e.target.value)}
                    placeholder="e.g. Air conditioning unit, toilet cistern, lighting circuit, entrance door lock"
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                )}
              </div>
            </div>

            {/* ── SECTION 3: ACCESS & ATTENDANCE ARRANGEMENTS ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  3. Access &amp; Attendance Arrangements
                </h2>
              </div>

              {/* Can engineer access? */}
              <div>
                <label className="text-xs font-medium text-slate-800 block mb-1.5">
                  Can an engineer access the affected area?
                </label>
                <div className="space-y-2">
                  {ACCESS_TYPES.map((acc) => {
                    const isSelected = accessType === acc.id;
                    return (
                      <label
                        key={acc.id}
                        className={`flex items-center gap-3 p-2.5 px-3 rounded-sm border cursor-pointer text-xs transition-colors ${
                          isSelected
                            ? 'border-brand-graphite bg-slate-50 font-medium text-slate-900'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="access-type"
                          value={acc.id}
                          checked={isSelected}
                          onChange={() => setAccessType(acc.id)}
                          className="text-brand-graphite focus:ring-brand-graphite"
                        />
                        <span>{acc.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Access Notes */}
              <div>
                <label htmlFor="access-notes" className="text-xs font-medium text-slate-800 block mb-1">
                  Access &amp; Attendance Notes
                </label>
                <input
                  id="access-notes"
                  type="text"
                  value={accessNotes}
                  onChange={(e) => setAccessNotes(e.target.value)}
                  placeholder="e.g. Reception can provide access between 08:00 and 17:00, or call tenant before attending"
                  className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              {/* Preferred Attendance Times */}
              <div>
                <label htmlFor="preferred-times" className="text-xs font-medium text-slate-800 block mb-1">
                  Preferred Attendance Times
                </label>
                <select
                  id="preferred-times"
                  value={preferredTimes}
                  onChange={(e) => setPreferredTimes(e.target.value)}
                  className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                >
                  <option value="ANYTIME">Anytime during normal hours (08:00 – 17:00)</option>
                  <option value="MORNING">Morning preferred (08:00 – 12:00)</option>
                  <option value="AFTERNOON">Afternoon preferred (12:00 – 17:00)</option>
                  <option value="OUT_OF_HOURS">Out of hours / By prior arrangement only</option>
                </select>
              </div>
            </div>

            {/* ── SECTION 4: PHOTOGRAPHS & DOCUMENTS ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  4. Photographs &amp; Documents
                </h2>
              </div>

              <p className="text-xs text-slate-500 font-light">
                Photos can help us understand the issue before arranging attendance.
              </p>

              {/* Mobile Camera & File Buttons */}
              <div className="grid grid-cols-3 gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-sm border border-slate-300 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Camera className="h-4 w-4 text-slate-600" />
                  <span>Take Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-sm border border-slate-300 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Video className="h-4 w-4 text-slate-600" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-sm border border-slate-300 bg-slate-50 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Paperclip className="h-4 w-4 text-slate-600" />
                  <span>Files</span>
                </button>
              </div>

              {/* Drag & Drop Upload Zone */}
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
                className={`cursor-pointer rounded-sm border border-dashed p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-slate-700 bg-slate-100/70'
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <p className="text-xs sm:text-sm font-medium text-slate-800">
                  Drag and drop files here, or <span className="text-[#0066CC] underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-slate-500 font-light">
                  JPG, PNG, MP4, MOV or PDF (up to 20MB per file)
                </p>
              </div>

              {/* Uploaded Evidence Cards */}
              {evidenceList.length > 0 && (
                <div className="space-y-2 pt-1">
                  {evidenceList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-sm border border-slate-200 bg-slate-50/70 p-2.5 px-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{item.filename}</span>
                        <span className="text-slate-400 shrink-0 font-light">
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

            {/* ── SECTION 5: REPORTER & TENANT DETAILS ── */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  5. Reporter &amp; Contact Information
                </h2>
              </div>

              {/* Reporting On Behalf Of */}
              <div>
                <label className="text-xs font-medium text-slate-800 block mb-1.5">
                  I am reporting this issue on behalf of:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {REPORTING_ON_BEHALF_OPTIONS.map((opt) => {
                    const isSelected = reportingOnBehalfOf === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setReportingOnBehalfOf(opt.id)}
                        className={`p-2 px-3 text-left rounded-sm border text-xs transition-colors ${
                          isSelected
                            ? 'border-brand-graphite bg-slate-900 text-white shadow-xs font-normal'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                    className={`w-full rounded-sm border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
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
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value);
                      if (formErrors.contactEmail) setFormErrors((prev) => ({ ...prev, contactEmail: '' }));
                    }}
                    placeholder="e.g. s.jenkins@example.co.uk"
                    className={`w-full rounded-sm border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-1 ${
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
                    Telephone / Mobile Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. 07700 900123"
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                </div>

                <div>
                  <label htmlFor="occupier-name" className="text-xs font-medium text-slate-800 block mb-1">
                    Occupier / Company Name (Optional)
                  </label>
                  <input
                    id="occupier-name"
                    type="text"
                    value={occupierName}
                    onChange={(e) => setOccupierName(e.target.value)}
                    placeholder="e.g. Acorn Design Ltd or Tenant Name"
                    className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* ── SUBMISSION ACTION ── */}
            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-light">
                By submitting, this work order is queued for review by the EntireFM Technical Helpdesk.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-hero-pink px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-hero-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span>Submitting request...</span>
                ) : (
                  <>
                    <span>LOG MAINTENANCE REQUEST</span>
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
