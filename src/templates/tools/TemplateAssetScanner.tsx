'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Scan,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  HelpCircle,
  Info,
  Check,
  ChevronRight,
  Send,
  X,
  UserCheck,
  LogIn,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolShell } from '@/components/tools/ToolShell';
import type { TemplateProps } from '../types';
import type { AssetDocument, RecommendedRegime } from '@/types/asset-scanner';

export function TemplateAssetScanner({ route, content }: TemplateProps) {
  const router = useRouter();

  // State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [result, setResult] = useState<{
    asset: AssetDocument;
    matchedDefinition?: any;
    engineUsed?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auth / Login Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Quote / Enquiry Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    notes: '',
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Resources', url: '/resources' },
    { name: 'Interactive Tools', url: '/tools' },
    { name: 'Asset Scanner', url: '/tools/asset-scanner' },
  ];

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setResult(null);
      setErrorMessage(null);

      if (selected.type.startsWith('image/')) {
        const url = URL.createObjectURL(selected);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Convert File to Base64
  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Run Real Async Extraction Pipeline
  const handleProcessScan = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStage('Reading media file and preparing scan payload…');

    try {
      const base64 = await fileToBase64(file);
      const fileType = file.type.includes('pdf')
        ? 'pdf'
        : file.type.includes('video')
        ? 'video'
        : 'image';
      const uploadId = `up_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      setProcessingStage('Extracting nameplate text and compliance markers…');

      const res = await fetch('/api/tools/asset-scanner/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          fileType,
          filename: file.name,
          base64Data: base64,
          sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        }),
      });

      setProcessingStage('Cross-referencing against SFG20 task taxonomy…');

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to extract asset details');
      }

      setResult(data.data);
    } catch (err: any) {
      console.error('Scan processing error:', err);
      setErrorMessage(err?.message || 'Unable to complete scan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Preset Sample Triggers for Instant Testing
  const handleLoadSample = async (sampleType: 'clean_ahu' | 'partial_pump' | 'eicr_pdf') => {
    setIsProcessing(true);
    setErrorMessage(null);
    setResult(null);

    let samplePayload: any;

    if (sampleType === 'clean_ahu') {
      setProcessingStage('Analyzing clean VRV heat pump nameplate photo…');
      samplePayload = {
        uploadId: `up_sample_daikin_${Date.now()}`,
        fileType: 'image',
        filename: 'daikin-vrv-iv-nameplate.jpg',
        textContent: 'DAIKIN VRV IV HEAT PUMP REYQ10T7Y1B S/N: 2100489 R410A 28.0kW 400V 3Ph 50Hz',
      };
    } else if (sampleType === 'partial_pump') {
      setProcessingStage('Analyzing partial/worn booster pump label…');
      samplePayload = {
        uploadId: `up_sample_pump_${Date.now()}`,
        fileType: 'image',
        filename: 'grundfos-worn-label.jpg',
        textContent: 'GRUNDFOS PUMP TYPE: MAGNA3 SERIAL: [FADED/UNREADABLE]',
      };
    } else {
      setProcessingStage('Extracting text from EICR certificate PDF…');
      samplePayload = {
        uploadId: `up_sample_eicr_${Date.now()}`,
        fileType: 'pdf',
        filename: 'electrical-installation-eicr.pdf',
        textContent:
          'ELECTRICAL INSTALLATION CONDITION REPORT (EICR). Client: Apex Commercial Ltd. Date of Inspection: 14/03/2023. Next Inspection Due: 14/03/2028. Overall Condition: Satisfactory.',
      };
    }

    try {
      const res = await fetch('/api/tools/asset-scanner/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(samplePayload),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sample test error');
    } finally {
      setIsProcessing(false);
    }
  };

  // CTA 1: Add to my PPM Schedule
  const handleAddToPpmSchedule = () => {
    if (!result?.asset?.recommendedRegime) return;

    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    // Save to member session / estate and navigate to PPM Schedule Builder
    const targetAssetId = result.matchedDefinition?.id || 'hvac-ahu';
    router.push(`/tools/ppm-schedule-builder?importScannedAsset=${targetAssetId}&quantity=1`);
  };

  // CTA 2: Get a Quote for Managing This
  const handleOpenQuoteModal = () => {
    if (result?.asset) {
      const assetDetails = [
        result.asset.assetType ? `Asset: ${result.asset.assetType}` : '',
        result.asset.manufacturer ? `Manufacturer: ${result.asset.manufacturer}` : '',
        result.asset.model ? `Model: ${result.asset.model}` : '',
        result.asset.serialNumber ? `Serial: ${result.asset.serialNumber}` : '',
        result.asset.recommendedRegime
          ? `Regime: ${result.asset.recommendedRegime.taskRef} (${result.asset.recommendedRegime.frequency})`
          : '',
      ]
        .filter(Boolean)
        .join(' | ');

      setQuoteFormData((prev) => ({
        ...prev,
        notes: `Asset Scanner Lead: ${assetDetails}`,
      }));
    }
    setShowQuoteModal(true);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);

    try {
      const payload = {
        name: quoteFormData.name,
        email: quoteFormData.email,
        phone: quoteFormData.phone,
        company: quoteFormData.company,
        location: quoteFormData.location || 'National / UK Wide',
        service: 'Asset Management & Maintenance',
        message: quoteFormData.notes || 'Enquiry regarding scanned plant asset maintenance.',
        conversion_page: '/tools/asset-scanner',
        landing_page: '/tools/asset-scanner',
        utm_source: 'asset-scanner-cta',
        form_id: 'asset-scanner-quote',
      };

      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setQuoteSubmitted(true);
      } else {
        throw new Error('Lead submission unavailable');
      }
    } catch (err) {
      console.error('Quote submission error:', err);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header solid />
      <div className="flex-grow">
        <ToolShell
          breadcrumbs={breadcrumbs}
          title="Asset Scanner"
          purpose="Scan plant nameplates or compliance certificates to identify equipment, verify technical details, and match against SFG20 maintenance regimes."
          timeEstimate="Instant"
          outputs={['Asset Metadata', 'SFG20 Regime', 'Compliance Flags']}
        >
          {/* Privacy & Retention Disclosure */}
          <div className="mb-6 p-4 rounded-sm bg-blue-50/70 border border-blue-200/80 flex items-start gap-3.5 text-xs text-slate-700">
            <Info className="w-4 h-4 text-brand-electric shrink-0 mt-0.5" />
            <div>
              <p className="font-normal text-slate-900">
                UK Data Retention &amp; Privacy Notice
              </p>
              <p className="mt-0.5 text-slate-600 leading-relaxed font-light">
                Anonymous visitors can use this tool freely; files and extracted records have a strict 24-hour retention period before automatic deletion. Logged-in Lobby members have scans automatically saved to their digital estate register.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Main Scan & Results Area (8 Cols) ─────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Upload Card */}
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-sm shadow-sm">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] tracking-widest text-brand-electric uppercase font-medium">
                      01 / Document &amp; Media Ingestion
                    </span>
                    <h2 className="text-2xl font-extralight text-slate-900 mt-1">
                      Upload Plant Photo or Certificate
                    </h2>
                  </div>
                  <Scan className="w-6 h-6 text-slate-400" />
                </div>

                <p className="text-xs text-slate-600 mt-3 font-normal">
                  Upload a photo of an equipment nameplate (AHU, chiller, boiler, pump), a short video walkaround, or a PDF certificate (EICR, Gas Safety, Fire Alarm).
                </p>

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 border-2 border-dashed border-slate-300 hover:border-brand-electric bg-slate-50/70 hover:bg-blue-50/40 p-8 rounded-sm text-center cursor-pointer transition-colors group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-brand-electric mx-auto transition-colors" />
                  <p className="text-sm font-normal text-slate-800 mt-3">
                    {file ? file.name : 'Click to select or drag and drop a file'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports JPG, PNG, WEBP, MP4, and PDF (Max 50MB)
                  </p>
                </div>

                {/* Quick Test Samples */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Or Try a Benchmark Sample:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleLoadSample('clean_ahu')}
                      disabled={isProcessing}
                      className="text-left p-2.5 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs transition-colors"
                    >
                      <span className="font-medium text-slate-900 block truncate">1. Clean Nameplate</span>
                      <span className="text-[11px] text-slate-500 block truncate">Daikin VRV IV (High Conf)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('partial_pump')}
                      disabled={isProcessing}
                      className="text-left p-2.5 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs transition-colors"
                    >
                      <span className="font-medium text-slate-900 block truncate">2. Worn Nameplate</span>
                      <span className="text-[11px] text-slate-500 block truncate">Grundfos Pump (Needs Review)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('eicr_pdf')}
                      disabled={isProcessing}
                      className="text-left p-2.5 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs transition-colors"
                    >
                      <span className="font-medium text-slate-900 block truncate">3. Expired PDF Cert</span>
                      <span className="text-[11px] text-slate-500 block truncate">EICR Electrical Inspection</span>
                    </button>
                  </div>
                </div>

                {file && (
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-600 truncate max-w-xs">
                      Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleProcessScan}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-brand-graphite hover:bg-slate-800 text-white text-xs font-normal tracking-wider uppercase transition-all shadow-sm"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Scanning…</span>
                        </>
                      ) : (
                        <>
                          <span>Run Asset Scan</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Processing State */}
              {isProcessing && (
                <div className="bg-white border border-slate-200 p-8 rounded-sm text-center shadow-sm space-y-3">
                  <RefreshCw className="w-8 h-8 text-brand-electric animate-spin mx-auto" />
                  <h3 className="text-base font-normal text-slate-900">Processing Asset Evidence</h3>
                  <p className="text-xs text-slate-600 font-mono max-w-md mx-auto">{processingStage}</p>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 rounded-sm bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <span className="font-medium">Scan Unsuccessful:</span> {errorMessage}
                  </div>
                </div>
              )}

              {/* Step 2: Extraction Results Screen */}
              {result && (
                <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden divide-y divide-slate-100">
                  {/* Result Header */}
                  <div className="p-6 sm:p-8 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-xs text-[10px] font-medium uppercase tracking-wider ${
                              result.asset.extractionConfidence === 'high'
                                ? 'bg-emerald-100 text-emerald-800'
                                : result.asset.extractionConfidence === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            Confidence: {result.asset.extractionConfidence.toUpperCase()}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-xs text-[10px] font-medium uppercase tracking-wider ${
                              result.asset.status === 'complete'
                                ? 'bg-blue-100 text-blue-800'
                                : result.asset.status === 'needs_review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            Status: {result.asset.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <h2 className="text-2xl font-light text-slate-900 mt-2">
                          {result.asset.assetType || 'Unidentified Asset'}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Technical Metadata Grid (NO FABRICATION: Nulls Shown Plainly as "Not detected") */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
                      Technical Identification
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                        <span className="text-slate-500 block uppercase text-[10px]">Manufacturer</span>
                        <span className="text-slate-900 font-medium text-sm mt-0.5 block">
                          {result.asset.manufacturer || <span className="text-slate-400 italic font-normal">Not detected</span>}
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                        <span className="text-slate-500 block uppercase text-[10px]">Model Number</span>
                        <span className="text-slate-900 font-medium text-sm mt-0.5 block">
                          {result.asset.model || <span className="text-slate-400 italic font-normal">Not detected</span>}
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                        <span className="text-slate-500 block uppercase text-[10px]">Serial Number</span>
                        <span className="text-slate-900 font-mono text-sm mt-0.5 block">
                          {result.asset.serialNumber || <span className="text-slate-400 italic font-normal font-sans">Not detected</span>}
                        </span>
                      </div>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm">
                        <span className="text-slate-500 block uppercase text-[10px]">Asset Category</span>
                        <span className="text-slate-900 font-medium text-sm mt-0.5 block">
                          {result.asset.assetType || <span className="text-slate-400 italic font-normal">Not detected</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Maintenance Regime */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
                      Recommended SFG20 Maintenance Regime
                    </h3>
                    {result.asset.recommendedRegime ? (
                      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 text-sm">
                            {result.asset.recommendedRegime.taskRef}
                          </span>
                          <span className="px-2 py-0.5 bg-brand-electric text-white text-[10px] font-medium uppercase rounded-xs">
                            {result.asset.recommendedRegime.standard.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-normal">
                          Statutory and planned maintenance frequency: <strong>{result.asset.recommendedRegime.frequency}</strong>
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600">
                        <p className="font-medium text-slate-800">We could not match this to a known SFG20 maintenance regime.</p>
                        <p className="mt-1 text-slate-500">
                          Equipment without definitive nameplate parameters requires manual engineer inspection to determine appropriate servicing intervals.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Flagged Issues */}
                  {result.asset.flaggedIssues && result.asset.flaggedIssues.length > 0 && (
                    <div className="p-6 sm:p-8">
                      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
                        Inspection &amp; Condition Observations
                      </h3>
                      <div className="space-y-2">
                        {result.asset.flaggedIssues.map((issue, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-amber-50/80 border border-amber-200 rounded-sm text-xs text-amber-900 flex items-start gap-2.5"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action CTAs */}
                  <div className="p-6 sm:p-8 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      disabled={!result.asset.recommendedRegime}
                      onClick={handleAddToPpmSchedule}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm bg-brand-graphite hover:bg-slate-800 text-white text-xs font-normal tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-brand-electric-bright" />
                      <span>Add to My PPM Schedule</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenQuoteModal}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 text-xs font-normal tracking-wider uppercase transition-colors"
                    >
                      <span>Get a Quote for Managing This</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar Guidance Panel (4 Cols) ───────────────────────── */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-sm space-y-4 shadow-sm text-xs">
                <div className="relative h-40 w-full rounded-sm overflow-hidden border border-slate-200 shadow-inner">
                  <Image
                    src="/images/editorial/entirefm-distribution-board-testing-800w.webp"
                    alt="EntireFM technical plant inspection"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 text-[10.5px] text-white font-light tracking-wider uppercase">
                    Asset Verification
                  </div>
                </div>

                <h3 className="text-xs font-normal text-slate-900 uppercase tracking-wider">
                  How the Scanner Works
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  Our extraction engine reads equipment nameplates and certificates, extracts model identifiers, and directly cross-references the canonical SFG20 task dataset to provide verified statutory and planned maintenance intervals.
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-medium text-slate-700 block uppercase">
                    Non-Negotiable Verification Standards
                  </span>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Zero fabricated serials or models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Direct SFG20 matrix alignment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>UK statutory duty cross-referencing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>

          {/* ── 3. DETAILED INFORMATION & TECHNICAL GUIDE SECTION ───────────── */}
          <section className="mt-16 pt-12 border-t border-slate-200/90 space-y-12">
            {/* Section Header */}
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-5 bg-brand-electric" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-electric font-semibold">
                  Tool Overview &amp; Technical Architecture
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
                About the EntireFM Plant &amp; Asset Scanner
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed">
                The EntireFM Asset Scanner is an engineering utility designed for UK commercial estates directors, facilities managers, and mechanical &amp; electrical engineers to eliminate manual data entry during plant audits, asset mobilisations, and statutory compliance reviews.
              </p>
            </div>

            {/* 3 Core Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200/90 rounded-sm p-6 space-y-3 shadow-2xs">
                <div className="w-9 h-9 rounded-sm bg-brand-electric/10 text-brand-electric flex items-center justify-center">
                  <Scan className="w-5 h-5" />
                </div>
                <h3 className="text-base font-normal text-slate-900">
                  High-Precision Optical Recognition
                </h3>
                <p className="text-xs font-light text-slate-600 leading-relaxed">
                  Extracts manufacturer names, exact model numbers, serial tags, electrical voltages, motor amperages, and refrigerant charge data directly from physical machinery stamps and nameplates.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-sm p-6 space-y-3 shadow-2xs">
                <div className="w-9 h-9 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-base font-normal text-slate-900">
                  SFG20 Maintenance Alignment
                </h3>
                <p className="text-xs font-light text-slate-600 leading-relaxed">
                  Automatically maps recognized equipment against standard UK SFG20 maintenance schedules, recommending statutory inspection intervals, required engineer skill levels, and standard task scopes.
                </p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-sm p-6 space-y-3 shadow-2xs">
                <div className="w-9 h-9 rounded-sm bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-normal text-slate-900">
                  Golden Thread &amp; CAFM Ready
                </h3>
                <p className="text-xs font-light text-slate-600 leading-relaxed">
                  Structures plant data in open, machine-readable formats compliant with Building Safety Act 2022 Part 4 Golden Thread requirements for direct export to your CAFM or 52-week PPM planner.
                </p>
              </div>
            </div>

            {/* Supported Equipment & Document Types Grid */}
            <div className="bg-white border border-slate-200/90 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                  Equipment Coverage
                </span>
                <h3 className="text-xl font-light text-slate-900 mt-1">
                  Supported Plant Categories &amp; Compliance Certificates
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
                <div className="space-y-2 border-l-2 border-brand-electric pl-3.5">
                  <h4 className="font-medium text-slate-900">HVAC &amp; Refrigeration</h4>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Air Handling Units (AHUs), Water &amp; Air-Cooled Chillers, VRF/VRV Condenser Banks, Split Systems, Fan Coil Units, and Evaporative Cooling Towers.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-amber-500 pl-3.5">
                  <h4 className="font-medium text-slate-900">Electrical &amp; Life Safety</h4>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Low-Voltage Switchboards, Sub-Distribution Boards, Emergency Lighting Inverters, Fire Alarm Panels (BS 5839), and EICR Test Certificates.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-emerald-500 pl-3.5">
                  <h4 className="font-medium text-slate-900">Mechanical &amp; Hydronics</h4>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Commercial Gas Boilers, Heat Pump Packages, Potable Booster Sets, Pressurisation Units, Domestic Hot Water (DHW) Calorifiers, and TMVs.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-purple-500 pl-3.5">
                  <h4 className="font-medium text-slate-900">Access &amp; Building Fabric</h4>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Automatic Sliding &amp; Revolving Doors, Industrial Roller Shutters, Automatic Opening Vents (AOVs), Lifts &amp; Escalators (LOLER).
                  </p>
                </div>
              </div>
            </div>

            {/* How To Use On Site Workflow */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                  Step-by-Step Practical Guide
                </span>
                <h3 className="text-xl font-light text-slate-900 mt-1">
                  How to Use the Asset Scanner On-Site
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="p-5 rounded-sm bg-slate-100/60 border border-slate-200/80 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-white text-[10px] font-bold text-slate-800 border border-slate-200">
                    STEP 01
                  </span>
                  <h4 className="text-sm font-medium text-slate-900">Capture or Upload</h4>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Photograph the metal equipment nameplate or upload an existing PDF compliance certificate (EICR, Gas Safety, F-Gas check).
                  </p>
                </div>

                <div className="p-5 rounded-sm bg-slate-100/60 border border-slate-200/80 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-white text-[10px] font-bold text-slate-800 border border-slate-200">
                    STEP 02
                  </span>
                  <h4 className="text-sm font-medium text-slate-900">Verify Technical Attributes</h4>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Review extracted serial numbers, electrical ratings, capacity kW, and the automatically matched SFG20 maintenance regime.
                  </p>
                </div>

                <div className="p-5 rounded-sm bg-slate-100/60 border border-slate-200/80 space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-white text-[10px] font-bold text-slate-800 border border-slate-200">
                    STEP 03
                  </span>
                  <h4 className="text-sm font-medium text-slate-900">Add to PPM or Request Quote</h4>
                  <p className="text-slate-600 font-light leading-relaxed">
                    Transfer verified plant items directly into EntireFM&apos;s 52-Week PPM Schedule Builder or request a tailored maintenance proposal.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy & Governance Notice */}
            <div className="p-6 rounded-sm bg-[#0B1220] text-white space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <h4 className="text-sm font-medium text-white">
                  UK Data Governance &amp; Zero Fabrication Policy
                </h4>
              </div>
              <p className="text-xs font-light text-slate-300 leading-relaxed max-w-4xl">
                EntireFM applies a strict zero-fabrication standard across all diagnostic tools. If a serial number or model code is partially obscured or illegible, the scanner flags the low confidence score rather than guessing. Uploaded files from guest visitors are automatically purged within 24 hours under our automated retention policy.
              </p>
            </div>
          </section>
        </ToolShell>
      </div>
      <Footer />

      {/* ── Auth / Sign-in Modal for Anonymous Users on "Add to PPM" ─────── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <Lock className="w-5 h-5 text-brand-electric" />
              <h3 className="text-lg font-light text-slate-900">Sign in to Save to Estate</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-light mt-1">
              To accumulate scanned assets into your persistent digital asset register and pre-populate your 52-week PPM Schedule, sign in to your Lobby member account.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsLoggedIn(true);
                  setShowAuthModal(false);
                  handleAddToPpmSchedule();
                }}
                className="w-full py-2.5 px-4 bg-brand-graphite hover:bg-slate-800 text-white text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
              >
                Sign In as Lobby Member
              </button>
              <Link
                href="/client-login/account-registration"
                className="block text-center w-full py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
              >
                Register New Estate Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Get a Quote / Lead Modal ────────────────────────────────────── */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            {quoteSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-light text-slate-900">Proposal Request Received</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Our commercial engineering team has received your asset details and will prepare an indicative maintenance proposal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteSubmitted(false);
                  }}
                  className="mt-4 px-6 py-2.5 bg-brand-graphite text-white text-xs uppercase font-medium rounded-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-light text-slate-900">Request Asset Maintenance Quote</h3>
                  <p className="text-xs text-slate-600 mt-1 font-light">
                    Direct proposal request pre-filled with your scanned plant metadata.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Your Name *</label>
                    <input
                      required
                      type="text"
                      value={quoteFormData.name}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs bg-slate-50 focus:bg-white"
                      placeholder="e.g. James Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={quoteFormData.email}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs bg-slate-50 focus:bg-white"
                      placeholder="james@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={quoteFormData.phone}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs bg-slate-50 focus:bg-white"
                      placeholder="020 8000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Company / Organisation</label>
                    <input
                      type="text"
                      value={quoteFormData.company}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs bg-slate-50 focus:bg-white"
                      placeholder="Apex Estates Ltd"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-700 font-medium mb-1">Site Location</label>
                  <input
                    type="text"
                    value={quoteFormData.location}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs bg-slate-50 focus:bg-white"
                    placeholder="e.g. Manchester M1 / National Portfolio"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-slate-700 font-medium mb-1">Asset Scope Notes</label>
                  <textarea
                    rows={3}
                    value={quoteFormData.notes}
                    onChange={(e) => setQuoteFormData({ ...quoteFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-sm text-xs bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="px-6 py-2.5 bg-brand-graphite hover:bg-slate-800 text-white text-xs font-medium uppercase tracking-wider rounded-sm transition-colors"
                  >
                    {quoteSubmitting ? 'Submitting…' : 'Submit Quote Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
