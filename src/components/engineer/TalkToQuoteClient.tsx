'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Camera,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Wrench,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Building,
  MapPin,
  Send,
  Loader2,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { FieldIntelligenceResult, AmbiguityResolution } from '@/server/field-intelligence/types';

interface Props {
  initialContext?: {
    siteId?: string;
    siteName?: string;
    clientAccountId?: string;
    clientName?: string;
    locationId?: string;
    locationName?: string;
    assetId?: string;
    assetReference?: string;
    workOrderId?: string;
    workOrderNumber?: string;
  };
  engineerName: string;
}

type Stage =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'ENRICHING'
  | 'DISAMBIGUATION'
  | 'REVIEW'
  | 'QUOTE_CREATED';

export function TalkToQuoteClient({ initialContext = {}, engineerName }: Props) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [liveSpeech, setLiveSpeech] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [result, setResult] = useState<FieldIntelligenceResult | null>(null);
  const [ambiguity, setAmbiguity] = useState<AmbiguityResolution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdQuoteId, setCreatedQuoteId] = useState<string | null>(null);
  const [createdQuoteNumber, setCreatedQuoteNumber] = useState<string | null>(null);

  // Manual follow-up text input
  const [followUpText, setFollowUpText] = useState('');
  const [isCreatingQuote, setIsCreatingQuote] = useState(false);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialise Speech Recognition if supported in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-GB';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript((prev) => `${prev} ${event.results[i][0].transcript}`.trim());
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setLiveSpeech(interim);
      };

      recognition.onerror = (e: any) => {
        console.warn('[SPEECH_REC_ERROR]', e.error);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // ─── START VOICE CAPTURE ─────────────────────────────────────────────────────

  const startListening = async () => {
    setError(null);
    setLiveSpeech('');
    setTranscript('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
      setStage('LISTENING');

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch (err: any) {
      setError('Microphone access denied or unavailable. You can also type your notes.');
      setStage('IDLE');
    }
  };

  // ─── STOP VOICE CAPTURE & PROCESS ───────────────────────────────────────────

  const stopListening = async () => {
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }

    setStage('PROCESSING');

    // Wait 400ms for final audio chunks
    setTimeout(async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      let finalTranscript = transcript.trim() || liveSpeech.trim();

      // If Whisper endpoint is available and audio exists, try server transcribe
      if (audioBlob.size > 1000) {
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          const tRes = await fetch('/api/engineer/talk-to-quote/transcribe', {
            method: 'POST',
            body: formData,
          });
          const tData = await tRes.json();
          if (tData.success && tData.transcript) {
            finalTranscript = tData.transcript;
          }
        } catch {
          // fallback to Web Speech transcript
        }
      }

      if (!finalTranscript) {
        setError('No speech detected. Please try speaking again or type your note.');
        setStage('IDLE');
        return;
      }

      setTranscript(finalTranscript);
      await processTranscript(finalTranscript);
    }, 400);
  };

  // ─── AI FIELD INTELLIGENCE ENRICHMENT ────────────────────────────────────────

  const processTranscript = async (textToProcess: string, selectedAssetId?: string) => {
    setStage('ENRICHING');
    setError(null);

    try {
      const res = await fetch('/api/engineer/talk-to-quote/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: textToProcess,
          sessionId,
          context: {
            ...initialContext,
            assetId: selectedAssetId || initialContext.assetId,
          },
          imageUrl: selectedPhoto,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process field notes');
      }

      const resObj: FieldIntelligenceResult = data.result;
      setResult(resObj);
      setSessionId(resObj.sessionId);

      if (resObj.ambiguities && resObj.ambiguities.length > 0) {
        setAmbiguity(resObj.ambiguities[0]);
        setStage('DISAMBIGUATION');
      } else {
        setAmbiguity(null);
        setStage('REVIEW');
      }
    } catch (err: any) {
      setError(err.message || 'Error running AI Field Intelligence');
      setStage('IDLE');
    }
  };

  // ─── DISAMBIGUATION SELECTION ────────────────────────────────────────────────

  const handleSelectAmbiguousAsset = async (opt: { id: string; title: string }) => {
    if (!result) return;
    const followUp = `The correct asset is ${opt.title}.`;
    setTranscript((prev) => `${prev}. ${followUp}`);
    setAmbiguity(null);
    await processTranscript(followUp, opt.id);
  };

  // ─── FOLLOW-UP / CORRECTION ──────────────────────────────────────────────────

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim()) return;
    const note = followUpText.trim();
    setFollowUpText('');
    setTranscript((prev) => `${prev}. ${note}`);
    await processTranscript(note);
  };

  // ─── CREATE REAL QUOTE DRAFT ─────────────────────────────────────────────────

  const handleGenerateQuote = async () => {
    if (!result) return;
    setIsCreatingQuote(true);
    setError(null);

    try {
      const res = await fetch('/api/engineer/talk-to-quote/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          fieldScope: result,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create quote record');
      }

      setCreatedQuoteId(data.quoteId);
      setCreatedQuoteNumber(data.quoteNumber);
      setStage('QUOTE_CREATED');
    } catch (err: any) {
      setError(err.message || 'Failed to create quotation');
    } finally {
      setIsCreatingQuote(false);
    }
  };

  // ─── PHOTO UPLOAD HANDLER ────────────────────────────────────────────────────

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ─── RESET ───────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setStage('IDLE');
    setTranscript('');
    setLiveSpeech('');
    setResult(null);
    setAmbiguity(null);
    setError(null);
    setSelectedPhoto(null);
    setCreatedQuoteId(null);
    setCreatedQuoteNumber(null);
  };

  return (
    <div className="space-y-5 pb-24 max-w-xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-electric-bright">
              TALK TO QUOTE &bull; AI FIELD ENGINE
            </span>
          </div>
          <span className="text-[11px] text-brand-mist/60">{engineerName}</span>
        </div>

        {/* Current CAFM Context Banner */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px] bg-brand-void/80 border border-brand-edge-dark/80 rounded-xl p-3">
          <div>
            <span className="text-brand-mist/40 text-[9.5px] uppercase block">Client / Site</span>
            <span className="text-white font-medium truncate block">
              {initialContext.siteName || initialContext.clientName || 'General Survey'}
            </span>
          </div>
          <div>
            <span className="text-brand-mist/40 text-[9.5px] uppercase block">Asset / Location</span>
            <span className="text-brand-electric-bright font-medium truncate block">
              {initialContext.assetReference || initialContext.locationName || 'Unassigned / Walkaround'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── STAGE 1: IDLE / RECORDING / PROCESSING ─────────────────────────── */}
      {(stage === 'IDLE' || stage === 'LISTENING' || stage === 'PROCESSING' || stage === 'ENRICHING') && (
        <div className="bg-brand-carbon border border-brand-edge-dark rounded-3xl p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
          {/* Status Label */}
          <div>
            {stage === 'IDLE' && (
              <>
                <h2 className="text-lg font-light text-white">Tell EntireCAFM what you found</h2>
                <p className="text-xs text-brand-mist/70 mt-1">
                  Describe the site, asset, fault and work required. You can speak naturally.
                </p>
              </>
            )}
            {stage === 'LISTENING' && (
              <>
                <h2 className="text-lg font-normal text-rose-400 animate-pulse flex items-center justify-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  Listening...
                </h2>
                <p className="text-xs text-brand-mist/80 mt-1">Tap microphone again when finished speaking.</p>
              </>
            )}
            {stage === 'PROCESSING' && (
              <>
                <h2 className="text-lg font-normal text-brand-electric-bright flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-electric" />
                  Transcribing notes...
                </h2>
                <p className="text-xs text-brand-mist/80 mt-1">Converting voice audio to verified text.</p>
              </>
            )}
            {stage === 'ENRICHING' && (
              <>
                <h2 className="text-lg font-normal text-brand-electric flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 animate-spin text-brand-electric" />
                  Enriching CAFM Data...
                </h2>
                <p className="text-xs text-brand-mist/80 mt-1">
                  Matching asset history, checking rate cards, and verifying supplier catalogues.
                </p>
              </>
            )}
          </div>

          {/* Primary Microphone Trigger (Min 80px target) */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              type="button"
              onClick={isRecording ? stopListening : startListening}
              disabled={stage === 'PROCESSING' || stage === 'ENRICHING'}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white shadow-rose-600/50 ring-8 ring-rose-500/20 animate-pulse'
                  : 'bg-brand-electric text-white shadow-brand-electric/30 hover:bg-brand-electric/90 ring-4 ring-brand-electric/20'
              }`}
              aria-label={isRecording ? 'Stop Recording' : 'Start Talking'}
            >
              {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>

            {/* Photo Capture button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-14 h-14 rounded-full border border-brand-edge-dark flex items-center justify-center transition-colors ${
                selectedPhoto ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-brand-void text-brand-mist hover:text-white'
              }`}
              title="Photograph asset nameplate / defect"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>

          {selectedPhoto && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1 text-xs text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" /> Photo attached for visual model verification
            </div>
          )}

          {/* Live Transcript / Speech Feedback */}
          {(transcript || liveSpeech) && (
            <div className="bg-brand-void/90 border border-brand-edge-dark rounded-xl p-3.5 text-left text-xs text-white/90 leading-relaxed max-h-32 overflow-y-auto">
              <span className="text-brand-mist/50 text-[10px] uppercase block mb-1">Live Dictation</span>
              {transcript} {liveSpeech && <span className="text-brand-electric-bright italic">{liveSpeech}</span>}
            </div>
          )}

          {/* Helper examples if idle */}
          {stage === 'IDLE' && !transcript && (
            <div className="bg-brand-void/60 border border-brand-edge-dark/60 rounded-xl p-3 text-left">
              <p className="text-brand-mist/60 text-[10px] uppercase tracking-wider font-semibold mb-1.5">
                Example dictations:
              </p>
              <ul className="text-xs text-brand-mist/80 space-y-1 italic">
                <li>&ldquo;Site is City Lofts Sheffield, plant room one, Grundfos ABC122 boost set leaking, requires new seal set.&rdquo;</li>
                <li>&ldquo;Supply fan motor on AHU-02 has bearing wear. Allow 3 hours mechanical labour.&rdquo;</li>
              </ul>
            </div>
          )}

          {/* Text fallback input */}
          {stage === 'IDLE' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (transcript.trim()) processTranscript(transcript.trim());
              }}
              className="flex gap-2 pt-1"
            >
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Or type what you found here..."
                className="flex-1 bg-brand-void border border-brand-edge-dark rounded-xl px-3 py-2 text-xs text-white placeholder-brand-mist/40 focus:outline-none focus:border-brand-electric"
              />
              <button
                type="submit"
                disabled={!transcript.trim()}
                className="bg-brand-electric/20 border border-brand-electric/40 text-brand-electric-bright px-3 py-2 rounded-xl text-xs font-medium hover:bg-brand-electric hover:text-white transition-colors disabled:opacity-40"
              >
                Analyse
              </button>
            </form>
          )}
        </div>
      )}

      {/* ─── STAGE 2: DISAMBIGUATION MODAL / STEP ───────────────────────────── */}
      {stage === 'DISAMBIGUATION' && ambiguity && (
        <div className="bg-brand-carbon border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Confirmation Required</h3>
              <p className="text-xs text-brand-mist/90 mt-0.5">{ambiguity.promptQuestion}</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {ambiguity.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectAmbiguousAsset(opt)}
                className="w-full text-left bg-brand-void hover:bg-brand-electric/15 border border-brand-edge-dark hover:border-brand-electric/40 rounded-xl p-3.5 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-medium text-white group-hover:text-brand-electric-bright">
                    {opt.title}
                  </div>
                  {opt.description && (
                    <div className="text-[11px] text-brand-mist/60 mt-0.5">{opt.description}</div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-brand-mist/40 group-hover:text-brand-electric-bright shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── STAGE 3: ENRICHED RESULT & REVIEW ──────────────────────────────── */}
      {stage === 'REVIEW' && result && (
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-brand-edge-dark/60 pb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-electric-bright flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI FIELD INTELLIGENCE SUMMARY
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  result.confidenceLevel === 'HIGH'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : result.confidenceLevel === 'REVIEW'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {result.confidenceLevel} CONFIDENCE ({(result.confidenceScore * 100).toFixed(0)}%)
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed">{result.aiResponseNarrative}</p>

            {/* Extracted Entity Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-brand-void p-2.5 rounded-lg border border-brand-edge-dark/60">
                <span className="text-[9.5px] text-brand-mist/50 uppercase block">Site & Location</span>
                <span className="text-white font-medium">{result.understanding.siteName || 'Site Identified'}</span>
                {result.understanding.locationName && (
                  <span className="text-brand-mist/70 text-[11px] block">{result.understanding.locationName}</span>
                )}
              </div>
              <div className="bg-brand-void p-2.5 rounded-lg border border-brand-edge-dark/60">
                <span className="text-[9.5px] text-brand-mist/50 uppercase block">Identified Asset</span>
                <span className="text-brand-electric-bright font-medium">
                  {result.understanding.assetReference || result.understanding.assetName || 'General Equipment'}
                </span>
                {result.assetIntelligence && (
                  <span className="text-emerald-400 text-[10px] block">
                    &bull; {result.assetIntelligence.previousMaintenanceCount || 0} previous service(s)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Scope of Works Card */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist flex items-center justify-between">
              <span>Proposed Scope of Works ({result.scopeOfWorks.length})</span>
              <span className="text-[10px] font-normal text-brand-mist/60">Engineer &bull; Inferred</span>
            </h3>

            <ol className="space-y-1.5 text-xs text-white/90 list-decimal list-inside">
              {result.scopeOfWorks.map((item) => (
                <li key={item.id} className="leading-relaxed">
                  <span>{item.title}</span>
                  {item.source === 'AI_INFERRED' && (
                    <span className="ml-1.5 text-[9.5px] bg-brand-void text-brand-electric-bright border border-brand-electric/30 px-1.5 py-0.2 rounded font-normal">
                      Inferred
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Parts & Labour Schedule */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-mist">
              Commercial Breakdown &bull; Rate Card Intelligence
            </h3>

            {/* Labour line */}
            <div className="bg-brand-void p-3 rounded-xl border border-brand-edge-dark flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-brand-electric" />
                  {result.labour.trade} ({result.labour.estimatedHours}h &times; {result.labour.engineersCount} eng)
                </div>
                <div className="text-[10.5px] text-brand-mist/60">{result.labour.basis}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white">£{result.labour.totalLabourGbp.toFixed(2)}</div>
                <div className="text-[10px] text-brand-mist/50">@ £{result.labour.hourlyRateGbp}/h</div>
              </div>
            </div>

            {/* Parts lines */}
            {result.parts.map((p, idx) => (
              <div key={idx} className="bg-brand-void p-3 rounded-xl border border-brand-edge-dark flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-brand-electric" />
                    {p.description} (Qty {p.quantity})
                  </div>
                  <div className="text-[10.5px] text-brand-mist/60">
                    {p.isFromCatalogue ? (
                      <span className="text-emerald-400">Verified Catalogue Part &bull; #{p.itemCode}</span>
                    ) : (
                      <span className="text-amber-400">Unconfirmed &bull; Pending Supplier Quote</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">
                    {p.unitSellGbp ? `£${(p.unitSellGbp * p.quantity).toFixed(2)}` : 'Pending'}
                  </div>
                  {p.unitSellGbp && <div className="text-[10px] text-brand-mist/50">£{p.unitSellGbp}/unit</div>}
                </div>
              </div>
            ))}

            {/* Additional Costs */}
            {result.additionalCosts.filter(c => c.totalGbp > 0).map((c) => (
              <div key={c.id} className="bg-brand-void p-3 rounded-xl border border-brand-edge-dark flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">{c.description}</div>
                  <div className="text-[10.5px] text-brand-mist/60">{c.justification}</div>
                </div>
                <div className="text-xs font-bold text-white">£{c.totalGbp.toFixed(2)}</div>
              </div>
            ))}

            {/* Totals Box */}
            <div className="pt-2 border-t border-brand-edge-dark flex items-center justify-between text-xs">
              <span className="text-brand-mist">Estimated Quote Total (Net + VAT):</span>
              <div className="text-right">
                <span className="text-base font-black text-white">£{result.financials.totalGrossGbp.toFixed(2)}</span>
                <span className="text-[10.5px] text-brand-mist/60 block">
                  (Net: £{result.financials.subtotalNetGbp.toFixed(2)} &bull; VAT: £{result.financials.vatAmountGbp.toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          {/* Follow up dialogue / Voice note addition */}
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-2xl p-4 shadow-lg space-y-2">
            <span className="text-[10.5px] uppercase font-bold text-brand-mist/60 block">
              Adjust with voice or text (e.g. &ldquo;Labour is 4 hours&rdquo; or &ldquo;Exclude testing&rdquo;)
            </span>
            <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
              <button
                type="button"
                onClick={isRecording ? stopListening : startListening}
                className="bg-brand-void hover:bg-brand-electric/20 text-brand-electric p-2.5 rounded-xl border border-brand-edge-dark"
                title="Speak adjustment"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                placeholder="Type an adjustment or add notes..."
                className="flex-1 bg-brand-void border border-brand-edge-dark rounded-xl px-3 py-2 text-xs text-white placeholder-brand-mist/40 focus:outline-none focus:border-brand-electric"
              />
              <button
                type="submit"
                disabled={!followUpText.trim()}
                className="bg-brand-electric text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-brand-indigo transition-colors disabled:opacity-40 flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-brand-void border border-brand-edge-dark text-brand-mist hover:text-white rounded-xl py-3.5 text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
            <button
              type="button"
              onClick={handleGenerateQuote}
              disabled={isCreatingQuote}
              className="flex-2 bg-brand-electric hover:bg-brand-indigo text-white rounded-xl py-3.5 px-5 text-xs font-bold shadow-lg shadow-brand-electric/25 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isCreatingQuote ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Quote...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" /> Create Quote Draft &rarr;
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── STAGE 4: QUOTE CREATED / CONFIRMATION ──────────────────────────── */}
      {stage === 'QUOTE_CREATED' && (
        <div className="bg-brand-carbon border border-emerald-500/30 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              QUOTE DRAFT GENERATED
            </span>
            <h2 className="text-xl font-bold text-white">{createdQuoteNumber}</h2>
            <p className="text-xs text-brand-mist/80 mt-1 max-w-sm mx-auto">
              Genuine commercial quotation record created in EntireCAFM. Line items, rate cards, and audit snapshot saved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <a
              href={`/api/engineer/talk-to-quote/quote/${createdQuoteId}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-void border border-brand-edge-dark hover:border-brand-electric/50 text-white rounded-xl p-3 flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-brand-electric" /> View Branded PDF
            </a>
            <Link
              href={`/engineer/talk/quote/${createdQuoteId}`}
              className="bg-brand-electric hover:bg-brand-indigo text-white font-bold rounded-xl p-3 flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              Review &amp; Deploy &rarr;
            </Link>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-brand-mist/60 hover:text-white transition-colors pt-2 block mx-auto"
          >
            + Create another quote for this site
          </button>
        </div>
      )}
    </div>
  );
}
