'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PlannerSiteInput, 
  PlannerInspectionInput, 
  PlannerContactInput, 
  DroneRecommendationResult 
} from '@/config/dronePlanner';
import { 
  ArrowRight, 
  Printer, 
  RotateCcw, 
  ShieldCheck,
  Send, 
  Lock,
  Camera,
  Thermometer,
  Map,
  FileText,
  Wrench,
  Zap,
  AlertTriangle,
  TrendingUp,
  Box,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';
import { SaveToWorkspaceButton } from '@/components/tools/SaveToWorkspaceButton';

// ---------------------------------------------------------------------------
// DELIVERABLE ICON CLASSIFIER
// Maps a deliverable string to an icon + category label based on keywords
// ---------------------------------------------------------------------------
type DeliverableCategory = 'imagery' | 'thermal' | 'geospatial' | 'reporting' | 'remedial';

interface ClassifiedDeliverable {
  text: string;
  category: DeliverableCategory;
  categoryLabel: string;
  icon: React.ElementType;
  accentClass: string;
  bgClass: string;
}

function classifyDeliverable(text: string): ClassifiedDeliverable {
  const lower = text.toLowerCase();

  // Thermal / spectral
  if (
    lower.includes('thermal') ||
    lower.includes('flir') ||
    lower.includes('infrared') ||
    lower.includes('delta-t') ||
    lower.includes('radiometric') ||
    lower.includes('hotspot')
  ) {
    return { text, category: 'thermal', categoryLabel: 'Thermal / Spectral', icon: Thermometer, accentClass: 'text-amber-400', bgClass: 'bg-amber-500/10 border-amber-500/25' };
  }

  // Geospatial / 3D / mapping
  if (
    lower.includes('orthomosaic') ||
    lower.includes('3d') ||
    lower.includes('point cloud') ||
    lower.includes('volumetric') ||
    lower.includes('dimensional') ||
    lower.includes('topograph') ||
    lower.includes('las') ||
    lower.includes('rcp') ||
    lower.includes('mesh') ||
    lower.includes('gsd') ||
    lower.includes('georef') ||
    lower.includes('cad') ||
    lower.includes('milestone')
  ) {
    return { text, category: 'geospatial', categoryLabel: 'Geospatial / 3D Data', icon: Map, accentClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10 border-cyan-500/25' };
  }

  // Reporting / compliance / documentation
  if (
    lower.includes('report') ||
    lower.includes('schedule') ||
    lower.includes('register') ||
    lower.includes('executive') ||
    lower.includes('condition') ||
    lower.includes('evidence') ||
    lower.includes('insurance') ||
    lower.includes('cafm') ||
    lower.includes('logbook') ||
    lower.includes('matrix') ||
    lower.includes('rag') ||
    lower.includes('rag graded') ||
    lower.includes('capex') ||
    lower.includes('forecast') ||
    lower.includes('maintenance') ||
    lower.includes('scope') ||
    lower.includes('proposal')
  ) {
    return { text, category: 'reporting', categoryLabel: 'Report / Documentation', icon: FileText, accentClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10 border-emerald-500/25' };
  }

  // Remedial / dispatch (less common in deliverables)
  if (lower.includes('remedial') || lower.includes('repair') || lower.includes('make-safe') || lower.includes('dispatch')) {
    return { text, category: 'remedial', categoryLabel: 'Remedial Scope', icon: Wrench, accentClass: 'text-rose-400', bgClass: 'bg-rose-500/10 border-rose-500/25' };
  }

  // Default: visual imagery
  return { text, category: 'imagery', categoryLabel: 'Visual Imagery', icon: Camera, accentClass: 'text-brand-pink', bgClass: 'bg-brand-pink/10 border-brand-pink/25' };
}

// ---------------------------------------------------------------------------
// SCOPE CATEGORY VISUAL CONFIG
// ---------------------------------------------------------------------------
const SCOPE_CATEGORIES = [
  { id: 'Focused inspection', label: 'Focused', shortLabel: 'Focused' },
  { id: 'Standard commercial inspection', label: 'Standard', shortLabel: 'Standard' },
  { id: 'Multi-asset survey', label: 'Multi-Asset', shortLabel: 'Multi-Asset' },
  { id: 'Estate-scale programme', label: 'Estate / Campus', shortLabel: 'Estate' },
  { id: 'Recurring programme', label: 'Recurring', shortLabel: 'Recurring' },
] as const;

// ---------------------------------------------------------------------------
// LEAD PRIORITY VISUAL CONFIG
// ---------------------------------------------------------------------------
function PriorityBadge({ priority }: { priority: 'HIGH' | 'MEDIUM' | 'STANDARD' }) {
  const configs = {
    HIGH: {
      label: 'HIGH PRIORITY',
      sublabel: 'Emergency / Urgent commercial requirement',
      icon: AlertTriangle,
      classes: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
      iconClass: 'text-rose-400',
      dotClass: 'bg-rose-400',
    },
    MEDIUM: {
      label: 'MEDIUM PRIORITY',
      sublabel: 'Standard commercial inspection timeline',
      icon: TrendingUp,
      classes: 'bg-sky-500/15 border-sky-500/40 text-sky-300',
      iconClass: 'text-sky-400',
      dotClass: 'bg-sky-400',
    },
    STANDARD: {
      label: 'STANDARD PRIORITY',
      sublabel: 'Planned / PPM maintenance programme',
      icon: CheckCircle2,
      classes: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      iconClass: 'text-emerald-400',
      dotClass: 'bg-emerald-400',
    },
  };
  const c = configs[priority];
  const Icon = c.icon;
  return (
    <div className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-sm border ${c.classes}`}>
      <span className={`h-2 w-2 rounded-full animate-pulse shrink-0 ${c.dotClass}`} />
      <Icon className={`w-3.5 h-3.5 shrink-0 ${c.iconClass}`} />
      <div>
        <div className="text-[10px] font-normal uppercase tracking-widest leading-none">{c.label}</div>
        <div className="text-[10px] font-light opacity-70 mt-0.5 leading-none hidden sm:block">{c.sublabel}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SCOPE CATEGORY STEP BAR
// ---------------------------------------------------------------------------
function ScopeCategoryBar({ activeCategory }: { activeCategory: string }) {
  const activeIdx = SCOPE_CATEGORIES.findIndex((s) => s.id === activeCategory);
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
        Inspection Scope Classification
      </span>
      <div className="flex items-center gap-1">
        {SCOPE_CATEGORIES.map((cat, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx < activeIdx;
          return (
            <React.Fragment key={cat.id}>
              <div
                className={`flex-1 min-w-0 px-2 py-1.5 rounded-sm border text-center transition-colors ${
                  isActive
                    ? 'bg-brand-pink/20 border-brand-pink text-brand-pink'
                    : isPast
                    ? 'bg-white/5 border-white/15 text-slate-400'
                    : 'bg-transparent border-brand-edge-dark text-slate-600'
                }`}
              >
                <span
                  className={`text-[9px] sm:text-[10px] font-normal uppercase tracking-wide leading-none block truncate ${
                    isActive ? 'text-brand-pink' : isPast ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {cat.shortLabel}
                </span>
              </div>
              {idx < SCOPE_CATEGORIES.length - 1 && (
                <div className={`w-2 h-px flex-shrink-0 ${idx < activeIdx ? 'bg-brand-pink/40' : 'bg-brand-edge-dark'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
interface PlannerRecommendationViewProps {
  site: PlannerSiteInput;
  inspection: PlannerInspectionInput;
  contact: PlannerContactInput;
  recommendation: DroneRecommendationResult;
  referenceNumber: string;
  onContactChange: (updated: Partial<PlannerContactInput>) => void;
  onInspectionChange: (updated: Partial<PlannerInspectionInput>) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  onDownloadPdf: () => void;
  onStartAgain: () => void;
}

export function PlannerRecommendationView({
  site,
  inspection,
  contact,
  recommendation,
  referenceNumber,
  onContactChange,
  onInspectionChange,
  onSubmit,
  isSubmitting,
  submitError,
  onDownloadPdf,
  onStartAgain,
}: PlannerRecommendationViewProps) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!contact.firstName?.trim()) errs.firstName = 'First name is required';
    if (!contact.lastName?.trim()) errs.lastName = 'Last name is required';
    if (!contact.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errs.email = 'A valid business email is required';
    }
    if (!contact.phone?.trim()) errs.phone = 'Contact telephone is required';
    if (!contact.company?.trim()) errs.company = 'Company / Organisation is required';
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    await onSubmit();
  };

  // Classify deliverables for visual grouping
  const classifiedDeliverables = recommendation.suggestedOutputs.map(classifyDeliverable);

  return (
    <div className="space-y-10">

      {/* ── Header & Reference ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-edge-dark pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/15 border border-brand-pink/30">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-[11.5px] uppercase tracking-wider text-brand-pink font-light">
              STRUCTURED INSPECTION BRIEF
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extralight text-white tracking-tight">
            Your Recommended <span className="text-hero-pink">Drone Inspection Plan</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-left sm:text-right font-normal">
            <span className="text-[10px] text-slate-400 block uppercase">Reference ID</span>
            <span className="text-xs sm:text-sm font-normal text-white bg-brand-graphite px-2.5 py-1 rounded border border-brand-edge-dark">
              {referenceNumber}
            </span>
          </div>
          <SaveToWorkspaceButton
            toolName="Drone Inspection Planner"
            defaultTitle={`${site.siteName || site.siteType} — Drone Inspection Brief`}
            inputsJson={{
              site,
              inspection,
            }}
            outputsJson={{
              recommendation,
              referenceNumber,
            }}
            summaryKpis={{
              primaryService: recommendation.primaryService.title,
              inspectionPack: recommendation.inspectionPack?.title || 'Custom Scope',
              scopeCategory: recommendation.scopeCategory,
              leadPriority: recommendation.leadPriority,
              deliverablesCount: recommendation.suggestedOutputs.length,
              remedialCount: recommendation.remedialServices.length,
            }}
            pdfReference={referenceNumber}
            buttonText="Save to Workspace"
            className="hidden sm:inline-flex"
          />

          <button
            type="button"
            onClick={onDownloadPdf}
            className="p-2.5 sm:px-3.5 rounded-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-2 text-xs font-normal shadow-xs"
            title="Download Formal Drone Survey Brief (PDF)"
          >
            <Printer className="w-4 h-4 text-brand-pink" />
            <span>Download PDF Pack</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* MATCH SUMMARY VISUAL BAR                                              */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="p-5 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-4">
        <span className="text-[10px] font-normal uppercase tracking-widest text-slate-400 block">
          Survey Scope Assessment
        </span>
        <div className="flex flex-col lg:flex-row lg:items-end gap-5">
          {/* Scope category bar */}
          <div className="flex-1">
            <ScopeCategoryBar activeCategory={recommendation.scopeCategory} />
          </div>
          {/* Divider */}
          <div className="hidden lg:block w-px h-10 bg-brand-edge-dark self-end" />
          {/* Priority badge */}
          <div className="flex-shrink-0 space-y-2">
            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider block">
              Operational Priority
            </span>
            <PriorityBadge priority={recommendation.leadPriority} />
          </div>
        </div>
        {/* Rationale strip */}
        <div className="pt-3 border-t border-brand-edge-dark">
          <p className="text-xs text-slate-300 leading-relaxed font-light">
            <span className="text-white font-normal">Assessment rationale: </span>
            {recommendation.summaryRationale}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* RECOMMENDATION CARD                                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

        {/* Primary Recommendation Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-normal text-brand-pink uppercase tracking-wider">
              PRIMARY RECOMMENDED SERVICE &bull; {recommendation.primaryService.badge}
            </span>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extralight text-white">
              {recommendation.primaryService.title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
              {recommendation.primaryService.description}
            </p>
          </div>
        </div>

        {/* Recommended Package */}
        {recommendation.inspectionPack && (
          <div className="p-5 rounded-sm bg-brand-graphite border border-brand-pink/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-normal text-brand-pink uppercase">
                RECOMMENDED INSPECTION PACKAGE
              </span>
              <span className="text-[9px] uppercase font-light text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                {recommendation.inspectionPack.badge}
              </span>
            </div>
            <h3 className="text-lg font-light text-white">{recommendation.inspectionPack.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{recommendation.inspectionPack.description}</p>
          </div>
        )}

        {/* Cross-Sell / Associated Services */}
        {recommendation.additionalServices && recommendation.additionalServices.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light uppercase tracking-wider text-slate-300 block">
                Associated &amp; Cross-Discipline Surveys to Consider:
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Complementary Aerial Scopes
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendation.additionalServices.map((srv, idx) => (
                <Link
                  key={idx}
                  href={srv.href}
                  className="p-4 bg-brand-graphite/70 rounded-sm border border-brand-edge-dark hover:border-brand-pink/50 hover:bg-white/[0.04] transition-all flex flex-col justify-between group space-y-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-normal text-white group-hover:text-brand-pink transition-colors">
                        {srv.title}
                      </h4>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light">{srv.reason}</p>
                  </div>
                  <span className="text-[10px] text-brand-pink font-light uppercase tracking-wider inline-flex items-center gap-1">
                    Explore Scope <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Deliverables & Remedials ── */}
        <div className="space-y-8 pt-4 border-t border-brand-edge-dark">

          {/* VISUAL DELIVERABLES GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light uppercase tracking-wider text-slate-300">
                Suggested Survey Deliverables
              </span>
              <span className="text-[10px] text-slate-500 font-normal hidden sm:block">
                {classifiedDeliverables.length} deliverable{classifiedDeliverables.length !== 1 ? 's' : ''} identified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {classifiedDeliverables.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-sm border ${item.bgClass} transition-colors`}
                  >
                    <div className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 bg-white/5`}>
                      <Icon className={`w-3.5 h-3.5 ${item.accentClass}`} />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs text-slate-100 leading-snug font-normal">{item.text}</p>
                      <span className={`text-[9.5px] font-normal uppercase tracking-wider ${item.accentClass} opacity-70`}>
                        {item.categoryLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EntireFM Remedial Capabilities */}
          <div className="space-y-3">
            <span className="text-xs font-light uppercase tracking-wider text-slate-300 block">
              EntireFM Remedial Works Alignment
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {recommendation.remedialServices.map((rem, idx) => (
                <div key={idx} className="p-3.5 bg-brand-graphite rounded-sm border border-brand-edge-dark text-xs space-y-1 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-sm bg-white/5 border border-brand-edge-dark flex items-center justify-center shrink-0">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <strong className="text-white block font-normal text-[11.5px] leading-snug">{rem.name}</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">{rem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Review / Aviation Caveats */}
        <div className="p-5 rounded-sm bg-brand-graphite/60 border border-brand-edge-dark space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-light uppercase text-white tracking-wider">
              Operational Review &amp; Compliance Notes
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {recommendation.operationalCaveats.map((cav, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 mt-1.5 shrink-0" />
                <span>{cav}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-400 pt-1 italic">
            This brief is an initial technical recommendation based on the supplied details and is subject to formal operational review and weather/airspace authorization.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* LEAD CAPTURE FORM                                                     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div className="p-6 sm:p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-pink">
              SUBMIT INSPECTION BRIEF
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extralight text-white">
            Send This Brief to EntireFM Aviation Desk
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Provide your contact details below to receive a formal proposal, airspace review, and flight schedule from our commercial operations team.
          </p>
        </div>

        {submitError && (
          <div className="p-4 rounded-sm bg-red-950/50 border border-red-500/50 text-red-200 text-xs">
            {submitError}
          </div>
        )}

        <form onSubmit={validateAndSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="plannerFirstName" className="block text-xs font-light text-slate-300">
                First Name <span className="text-brand-pink">*</span>
              </label>
              <input
                id="plannerFirstName"
                type="text"
                value={contact.firstName || ''}
                onChange={(e) => onContactChange({ firstName: e.target.value })}
                className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
                placeholder="e.g. David"
              />
              {formErrors.firstName && <span className="text-[11px] text-red-400">{formErrors.firstName}</span>}
            </div>
            <div className="space-y-1">
              <label htmlFor="plannerLastName" className="block text-xs font-light text-slate-300">
                Last Name <span className="text-brand-pink">*</span>
              </label>
              <input
                id="plannerLastName"
                type="text"
                value={contact.lastName || ''}
                onChange={(e) => onContactChange({ lastName: e.target.value })}
                className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
                placeholder="e.g. Wright"
              />
              {formErrors.lastName && <span className="text-[11px] text-red-400">{formErrors.lastName}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="plannerEmail" className="block text-xs font-light text-slate-300">
                Business Work Email <span className="text-brand-pink">*</span>
              </label>
              <input
                id="plannerEmail"
                type="email"
                value={contact.email || ''}
                onChange={(e) => onContactChange({ email: e.target.value })}
                className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
                placeholder="e.g. david.wright@company.com"
              />
              {formErrors.email && <span className="text-[11px] text-red-400">{formErrors.email}</span>}
            </div>
            <div className="space-y-1">
              <label htmlFor="plannerPhone" className="block text-xs font-light text-slate-300">
                Contact Telephone <span className="text-brand-pink">*</span>
              </label>
              <input
                id="plannerPhone"
                type="tel"
                value={contact.phone || ''}
                onChange={(e) => onContactChange({ phone: e.target.value })}
                className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
                placeholder="e.g. 07700 900123"
              />
              {formErrors.phone && <span className="text-[11px] text-red-400">{formErrors.phone}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="plannerCompany" className="block text-xs font-light text-slate-300">
                Company / Managing Agency <span className="text-brand-pink">*</span>
              </label>
              <input
                id="plannerCompany"
                type="text"
                value={contact.company || ''}
                onChange={(e) => onContactChange({ company: e.target.value })}
                className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
                placeholder="e.g. Apex Property Management"
              />
              {formErrors.company && <span className="text-[11px] text-red-400">{formErrors.company}</span>}
            </div>
            <div className="space-y-1">
              <label htmlFor="plannerJobTitle" className="block text-xs font-light text-slate-300">
                Job Title / Role (Optional)
              </label>
              <input
                id="plannerJobTitle"
                type="text"
                value={contact.jobTitle || ''}
                onChange={(e) => onContactChange({ jobTitle: e.target.value })}
                className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
                placeholder="e.g. Senior Facilities Director / Building Surveyor"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="plannerNotes" className="block text-xs font-light text-slate-300">
              Additional Site Notes / Special Access Requirements (Optional)
            </label>
            <textarea
              id="plannerNotes"
              rows={3}
              value={inspection.notes || ''}
              onChange={(e) => onInspectionChange({ notes: e.target.value })}
              placeholder="Provide any additional site details, security gates, specific dates, or previous survey context..."
              className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
            />
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-edge-dark">
            <button
              type="button"
              onClick={onStartAgain}
              className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Again</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-8 py-3.5 text-sm font-normal text-white shadow-elevated hover:shadow-pink-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Submitting Brief...</span>
                </>
              ) : (
                <>
                  <span>Send This Brief to EntireFM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
