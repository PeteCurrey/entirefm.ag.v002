'use client';

/**
 * ENTIREFM CLIENT CONVERSATIONAL HELPDESK CLIENT (Phase 0M Addendum)
 * =================================================================
 * Dual-mode interactive issue logging:
 *   Mode 1: Conversational Helpdesk (Progressive structured extraction)
 *   Mode 2: Standard Form Fallback (Direct manual input)
 *
 * Rules:
 *   - Client is already known; never interrogates
 *   - Restrained, clean EntireFM styling (no generic cartoon chatbot bubbles)
 *   - Pre-submission structured review card
 *   - Returns real canonical SR-XXXX reference upon submission
 *   - Live activity stream on created job
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Send,
  Building2,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Paperclip,
  ArrowRight,
  RotateCcw,
  Sparkles,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { ConversationalHelpdeskState } from '@/app/api/clients/helpdesk/chat/route';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  chips?: Array<{ label: string; action: () => void }>;
  is_summary_prompt?: boolean;
}

interface ClientSite {
  id: string;
  name: string;
  city?: string;
}

interface Props {
  clientName: string;
  initialSites: ClientSite[];
}

export default function ClientHelpdeskConversationalClient({ clientName, initialSites }: Props) {
  const [mode, setMode] = useState<'CHAT' | 'FORM'>('CHAT');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Structured extraction state
  const [state, setState] = useState<ConversationalHelpdeskState>({
    client_id: '',
    client_name: clientName,
    missing_fields: [],
    is_ready_to_submit: false,
    site_id: initialSites.length === 1 ? initialSites[0].id : undefined,
    site_name: initialSites.length === 1 ? initialSites[0].name : undefined,
  });

  // Standard Form State
  const [formSiteId, setFormSiteId] = useState(initialSites.length === 1 ? initialSites[0].id : '');
  const [formLocation, setFormLocation] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTrade, setFormTrade] = useState('PLUMBING');
  const [formPriority, setFormPriority] = useState('P3_MEDIUM');
  const [formAccessNotes, setFormAccessNotes] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    let initialGreeting = `Hello! How can the EntireFM Helpdesk assist you today with ${clientName}?`;
    if (initialSites.length === 1) {
      initialGreeting = `Hello! How can we assist you with ${initialSites[0].name} today?`;
    }

    setMessages([
      {
        id: 'msg-0',
        role: 'assistant',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [clientName, initialSites]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  // Send message to conversational API
  async function handleSendMessage(overrideText?: string) {
    const textToSend = overrideText || inputText.trim();
    if (!textToSend || loading) return;

    setInputText('');
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/clients/helpdesk/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory.map((m) => ({ role: m.role, text: m.text })),
          current_state: state,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();

      setState(data.state);

      // Prepare chip suggestions if site is needed
      let chips: Array<{ label: string; action: () => void }> | undefined = undefined;
      if (!data.state.site_id && data.available_sites?.length > 0) {
        chips = data.available_sites.map((s: ClientSite) => ({
          label: s.name,
          action: () => handleSelectSite(s),
        }));
      } else if (data.state.asset_candidates?.length > 0 && !data.state.asset_id) {
        chips = [
          ...data.state.asset_candidates.map((a: any) => ({
            label: `${a.reference} (${a.name})`,
            action: () => handleSelectAsset(a),
          })),
          {
            label: "I'm not sure",
            action: () => handleSelectAsset(null),
          },
        ];
      }

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips,
        is_summary_prompt: data.state.is_ready_to_submit,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          text: "I've noted that. Please provide any additional details or use the standard form on the right.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSite(site: ClientSite) {
    setState((prev) => ({ ...prev, site_id: site.id, site_name: site.name }));
    handleSendMessage(`This is at the ${site.name} site.`);
  }

  function handleSelectAsset(asset: { id: string; name: string; reference: string } | null) {
    if (asset) {
      setState((prev) => ({ ...prev, asset_id: asset.id, asset_name: asset.name }));
      handleSendMessage(`The asset is ${asset.reference} - ${asset.name}.`);
    } else {
      handleSendMessage(`I'm not sure which specific asset unit it is.`);
    }
  }

  // Submit issue via API
  async function handleSubmitIssue() {
    setSubmitting(true);
    try {
      const payload =
        mode === 'CHAT'
          ? {
              site_id: state.site_id,
              location_description: state.floor_or_location,
              asset_id: state.asset_id,
              title: state.issue_summary || 'Reported Maintenance Issue',
              description: state.issue_description || state.issue_summary || 'Logged via Client Helpdesk',
              trade: state.trade || 'GENERAL_MAINTENANCE',
              priority: state.suggested_priority || 'P3_MEDIUM',
              access_notes: state.access_notes,
            }
          : {
              site_id: formSiteId,
              location_description: formLocation,
              title: formTitle,
              description: formDescription,
              trade: formTrade,
              priority: formPriority,
              access_notes: formAccessNotes,
            };

      const res = await fetch('/api/clients/helpdesk/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSubmissionResult(data);
    } catch (err: any) {
      alert(`Error submitting request: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  // Reset for another submission
  function handleReset() {
    setSubmissionResult(null);
    setState({
      client_id: '',
      client_name: clientName,
      missing_fields: [],
      is_ready_to_submit: false,
      site_id: initialSites.length === 1 ? initialSites[0].id : undefined,
      site_name: initialSites.length === 1 ? initialSites[0].name : undefined,
    });
    setFormTitle('');
    setFormDescription('');
    setFormLocation('');
    setMessages([
      {
        id: 'msg-init-reset',
        role: 'assistant',
        text: `How else can the EntireFM Helpdesk assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }

  // ─── POST-SUBMISSION SUCCESS SCREEN ─────────────────────────────────────────
  if (submissionResult) {
    const sr = submissionResult.service_request;
    const wo = submissionResult.work_order;
    const dispatch = submissionResult.dispatch;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold">
              ISSUE SUCCESSFULLY LOGGED
            </span>
            <h2 className="text-2xl font-light text-white mt-1">{sr.title}</h2>
            <p className="text-sm text-brand-mist/70 mt-1 font-normal">
              Canonical Reference: <span className="text-brand-electric-bright font-bold">{sr.reference}</span>
            </p>
          </div>

          {/* Key Ticket Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-4 border-t border-brand-edge-dark/60">
            <div className="bg-brand-carbon/60 p-3 rounded-lg border border-brand-edge-dark">
              <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Priority</span>
              <p className="text-sm font-semibold text-white mt-0.5">{sr.priority}</p>
            </div>
            <div className="bg-brand-carbon/60 p-3 rounded-lg border border-brand-edge-dark">
              <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Contractual SLA</span>
              <p className="text-sm font-semibold text-emerald-400 mt-0.5">{sr.sla_hours} Hours Target</p>
            </div>
            <div className="bg-brand-carbon/60 p-3 rounded-lg border border-brand-edge-dark">
              <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Work Order</span>
              <p className="text-sm font-normal text-brand-electric-bright mt-0.5">{wo?.work_order_number || 'Generated'}</p>
            </div>
            <div className="bg-brand-carbon/60 p-3 rounded-lg border border-brand-edge-dark">
              <span className="text-[10px] font-normal text-brand-mist/50 uppercase">Current Status</span>
              <p className="text-sm font-semibold text-white mt-0.5">{wo?.status || 'LOGGED'}</p>
            </div>
          </div>

          {/* Dispatch Notice if assigned */}
          {dispatch && dispatch.assigned_supplier && (
            <div className="bg-brand-electric/10 border border-brand-electric/30 p-4 rounded-lg text-left text-sm text-brand-electric-bright flex items-start gap-3">
              <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Reactive Auto-Dispatch Activated: </span>
                {dispatch.client_message || `Assigned to approved partner ${dispatch.assigned_supplier}. Attendance target initiated.`}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/clients/work-orders`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-brand-electric text-white text-sm font-medium hover:bg-brand-electric/80 transition-colors inline-flex items-center justify-center gap-2"
            >
              Track in Work Orders <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-brand-edge-dark bg-brand-void text-brand-mist text-sm font-medium hover:text-white hover:bg-brand-carbon transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-edge-dark/60 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
            ENTIREFM HELPDESK &bull; CLIENT ISSUE INTAKE
          </span>
          <h1 className="text-2xl font-light text-white mt-1">Report a Maintenance Issue</h1>
          <p className="text-xs text-brand-mist/60 font-light mt-0.5">
            Log reactive faults directly with our central dispatch desk. Client: <span className="text-white font-medium">{clientName}</span>
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="inline-flex rounded-lg border border-brand-edge-dark bg-brand-carbon/60 p-1">
          <button
            onClick={() => setMode('CHAT')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              mode === 'CHAT' ? 'bg-brand-electric text-white' : 'text-brand-mist/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Conversational Helpdesk
          </button>
          <button
            onClick={() => setMode('FORM')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              mode === 'FORM' ? 'bg-brand-electric text-white' : 'text-brand-mist/60 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Standard Form
          </button>
        </div>
      </div>

      {/* Emergency Notification Banner */}
      {state.is_emergency && (
        <div className="rounded-lg border border-red-500/50 bg-red-950/40 p-4 text-red-200 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-red-100 uppercase tracking-wider text-[11px]">
              CRITICAL LIFE-SAFETY / EMERGENCY CLASSIFICATION
            </span>
            <p>
              This request contains safety-critical triggers. It will be dispatched on a <strong>P1 Emergency 4-Hour Response SLA</strong> upon submission. For active fire or gas leaks, please evacuate and call 999 immediately.
            </p>
          </div>
        </div>
      )}

      {/* ─── MODE 1: CONVERSATIONAL HELPDESK ─────────────────────────────────── */}
      {mode === 'CHAT' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Window (2 Cols) */}
          <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon/40 flex flex-col h-[560px] overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-[13.5px] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-brand-electric text-white rounded-br-none'
                        : 'bg-brand-void/80 border border-brand-edge-dark text-brand-mist rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] font-normal text-brand-mist/40 mt-1 px-1">{m.timestamp}</span>

                  {/* Suggestion Chips */}
                  {m.chips && m.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                      {m.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={chip.action}
                          className="px-3 py-1 rounded-full border border-brand-electric/40 bg-brand-electric/10 hover:bg-brand-electric/20 text-brand-electric-bright text-xs font-medium transition-colors"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-brand-mist/50 p-2">
                  <span className="w-2 h-2 rounded-full bg-brand-electric animate-ping" />
                  EntireFM Helpdesk is processing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-brand-edge-dark bg-brand-carbon/80 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe your issue (e.g. water leak in second floor kitchen)..."
                  className="flex-1 rounded-lg border border-brand-edge-dark bg-brand-void px-3.5 py-2.5 text-[13px] text-white placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="rounded-lg bg-brand-electric px-4 py-2.5 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-electric/80 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Structured Draft Review Card (1 Col) */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-brand-edge-dark/60 pb-3">
                <span className="text-[10px] uppercase tracking-widest text-brand-mist/50 font-bold">
                  STRUCTURED SERVICE REQUEST
                </span>
                <h3 className="text-base font-normal text-white mt-0.5">Issue Summary</h3>
              </div>

              {/* Site */}
              <div>
                <span className="text-[10.5px] font-normal text-brand-mist/50 uppercase">Site</span>
                <p className="text-sm font-medium text-white">
                  {state.site_name || <span className="text-amber-400/80 italic text-xs">Pending location selection</span>}
                </p>
              </div>

              {/* Location */}
              {state.floor_or_location && (
                <div>
                  <span className="text-[10.5px] font-normal text-brand-mist/50 uppercase">Location on Site</span>
                  <p className="text-sm text-brand-mist">{state.floor_or_location}</p>
                </div>
              )}

              {/* Trade & Priority */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10.5px] font-normal text-brand-mist/50 uppercase">Trade</span>
                  <p className="text-xs font-normal text-white mt-0.5">{state.trade || 'PLUMBING'}</p>
                </div>
                <div>
                  <span className="text-[10.5px] font-normal text-brand-mist/50 uppercase">Priority</span>
                  <p className={`text-xs font-bold mt-0.5 ${
                    state.suggested_priority === 'P1_CRITICAL' ? 'text-red-400' : 'text-brand-electric-bright'
                  }`}>
                    {state.suggested_priority || 'P3_MEDIUM'}
                  </p>
                </div>
              </div>

              {/* Canonical SLA */}
              <div>
                <span className="text-[10.5px] font-normal text-brand-mist/50 uppercase">Target Response SLA</span>
                <p className="text-xs font-normal text-emerald-400 mt-0.5">
                  {state.canonical_sla_hours ? `${state.canonical_sla_hours} Hours Response` : '24 Hours Response'}
                </p>
              </div>

              {/* Issue Description */}
              <div>
                <span className="text-[10.5px] font-normal text-brand-mist/50 uppercase">Extracted Fault</span>
                <p className="text-xs text-brand-mist/90 bg-brand-void/60 p-2.5 rounded border border-brand-edge-dark/60 mt-1 line-clamp-3">
                  {state.issue_summary || state.issue_description || <span className="italic text-brand-mist/40">Awaiting issue details...</span>}
                </p>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-brand-edge-dark/60 mt-4">
              <button
                onClick={handleSubmitIssue}
                disabled={submitting || !state.site_id || (!state.issue_summary && !state.issue_description)}
                className="w-full py-3 rounded-lg bg-brand-electric text-white text-sm font-medium hover:bg-brand-electric/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-electric/20"
              >
                {submitting ? 'Submitting to CAFM...' : 'Report Issue'} <ArrowRight className="w-4 h-4" />
              </button>
              {!state.is_ready_to_submit && (
                <p className="text-[11px] text-brand-mist/40 text-center mt-2">
                  Please identify the site and issue before submitting.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ─── MODE 2: STANDARD FORM FALLBACK ───────────────────────────────── */
        <div className="max-w-2xl mx-auto rounded-xl border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-5">
          <div>
            <h3 className="text-lg font-light text-white">Standard Issue Report Form</h3>
            <p className="text-xs text-brand-mist/60 mt-0.5">
              Submit your request directly to the EntireFM Helpdesk.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitIssue();
            }}
            className="space-y-4"
          >
            {/* Site Select */}
            <div>
              <label className="block text-xs font-normal text-brand-mist/70 uppercase mb-1">Select Site *</label>
              <select
                value={formSiteId}
                onChange={(e) => setFormSiteId(e.target.value)}
                required
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-electric"
              >
                <option value="">-- Choose Authorised Site --</option>
                {initialSites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.city ? `(${s.city})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Location within Site */}
            <div>
              <label className="block text-xs font-normal text-brand-mist/70 uppercase mb-1">Location on Site</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="e.g. 2nd Floor, Server Room, Reception"
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void px-3 py-2 text-sm text-white placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric"
              />
            </div>

            {/* Issue Title */}
            <div>
              <label className="block text-xs font-normal text-brand-mist/70 uppercase mb-1">Issue Title / Headline *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Water leak in washroom ceiling"
                required
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void px-3 py-2 text-sm text-white placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-normal text-brand-mist/70 uppercase mb-1">Detailed Description *</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Provide details about the fault, when it started, and any symptoms..."
                rows={3}
                required
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void px-3 py-2 text-sm text-white placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric resize-none"
              />
            </div>

            {/* Trade & Priority Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-normal text-brand-mist/70 uppercase mb-1">Trade Category</label>
                <select
                  value={formTrade}
                  onChange={(e) => setFormTrade(e.target.value)}
                  className="w-full rounded-lg border border-brand-edge-dark bg-brand-void px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-electric"
                >
                  <option value="PLUMBING">Plumbing & Drainage</option>
                  <option value="HVAC">HVAC & Mechanical</option>
                  <option value="ELECTRICAL">Electrical & Lighting</option>
                  <option value="FIRE_LIFE_SAFETY">Fire & Life Safety</option>
                  <option value="BUILDING_FABRIC">Building Fabric / Joinery</option>
                  <option value="CLEANING">Cleaning & Waste</option>
                  <option value="SECURITY">Security & Access</option>
                  <option value="OTHER">General / Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-normal text-brand-mist/70 uppercase mb-1">Urgency / Priority</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value)}
                  className="w-full rounded-lg border border-brand-edge-dark bg-brand-void px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-electric"
                >
                  <option value="P1_CRITICAL">P1 - Emergency (4hr SLA)</option>
                  <option value="P2_HIGH">P2 - Urgent (8hr SLA)</option>
                  <option value="P3_MEDIUM">P3 - Standard (24hr SLA)</option>
                  <option value="P4_LOW">P4 - Routine (5-day SLA)</option>
                </select>
              </div>
            </div>

            {/* Access notes */}
            <div>
              <label className="block text-xs font-normal text-brand-mist/70 uppercase mb-1">Access Instructions / Hours</label>
              <input
                type="text"
                value={formAccessNotes}
                onChange={(e) => setFormAccessNotes(e.target.value)}
                placeholder="e.g. Keys at reception, access 08:00 - 18:00"
                className="w-full rounded-lg border border-brand-edge-dark bg-brand-void px-3 py-2 text-sm text-white placeholder:text-brand-mist/40 focus:outline-none focus:border-brand-electric"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting || !formSiteId || !formTitle || !formDescription}
                className="w-full py-3 rounded-lg bg-brand-electric text-white text-sm font-medium hover:bg-brand-electric/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting to CAFM...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
