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
  CheckCircle2, 
  ArrowRight, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  Layers, 
  FileText, 
  Wrench, 
  Send, 
  PhoneCall, 
  Lock,
  Boxes
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

interface PlannerRecommendationViewProps {
  site: PlannerSiteInput;
  inspection: PlannerInspectionInput;
  contact: PlannerContactInput;
  recommendation: DroneRecommendationResult;
  referenceNumber: string;
  onContactChange: (updated: Partial<PlannerContactInput>) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  onPrint: () => void;
  onStartAgain: () => void;
}

export function PlannerRecommendationView({
  site,
  inspection,
  contact,
  recommendation,
  referenceNumber,
  onContactChange,
  onSubmit,
  isSubmitting,
  submitError,
  onPrint,
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

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormErrors({});
    await onSubmit();
  };

  return (
    <div className="space-y-12">
      {/* Header & Reference Code */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-edge-dark pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/15 border border-brand-pink/30">
            <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-pink font-light">
              STRUCTURED INSPECTION BRIEF
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-light text-white tracking-tight">
            Your Recommended <span className="font-light text-hero-pink">Drone Inspection Plan</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-left sm:text-right font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">Reference ID</span>
            <span className="text-xs sm:text-sm font-normal text-white bg-brand-graphite px-2.5 py-1 rounded border border-brand-edge-dark">
              {referenceNumber}
            </span>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="p-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-1.5 text-xs font-normal"
            title="Print or Save PDF Brief"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Brief</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. THE RECOMMENDATION CARD */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />

        {/* Primary Recommendation Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-mono text-xs font-normal text-brand-pink uppercase tracking-wider">
              PRIMARY RECOMMENDED SERVICE &bull; {recommendation.primaryService.badge}
            </span>
            <span className="font-mono text-[10px] font-normal text-slate-400 bg-brand-graphite px-2.5 py-0.5 rounded border border-brand-edge-dark">
              SCOPE: {recommendation.scopeCategory.toUpperCase()}
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

        {/* Recommended Package (if applicable) */}
        {recommendation.inspectionPack && (
          <div className="p-5 rounded-sm bg-brand-graphite border border-brand-pink/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-normal text-brand-pink uppercase">
                RECOMMENDED INSPECTION PACKAGE
              </span>
              <span className="font-mono text-[9px] uppercase font-light text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                {recommendation.inspectionPack.badge}
              </span>
            </div>
            <h3 className="text-lg font-light text-white">
              {recommendation.inspectionPack.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {recommendation.inspectionPack.description}
            </p>
          </div>
        )}

        {/* Deliverables Checklist & Remediation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-brand-edge-dark">
          {/* Suggested Deliverables */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono font-light uppercase tracking-wider text-slate-300 block">
              Suggested Survey Deliverables:
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {recommendation.suggestedOutputs.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-pink mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EntireFM Remedial Capabilities */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono font-light uppercase tracking-wider text-slate-300 block">
              EntireFM Remedial Works Alignment:
            </span>
            <div className="space-y-2.5">
              {recommendation.remedialServices.map((rem, idx) => (
                <div key={idx} className="p-3 bg-brand-graphite rounded-sm border border-brand-edge-dark text-xs space-y-0.5">
                  <strong className="text-white block font-light">{rem.name}</strong>
                  <p className="text-slate-400 text-[11.5px] leading-relaxed">{rem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Review / Aviation Caveats */}
        <div className="p-5 rounded-sm bg-brand-graphite/60 border border-brand-edge-dark space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-light uppercase text-white tracking-wider">
              Operational Review &amp; Compliance Notes
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {recommendation.operationalCaveats.map((cav, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                <span>{cav}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-400 pt-1 italic">
            This brief is an initial technical recommendation based on the supplied details and is subject to formal operational review and weather/airspace authorization.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STRUCTURED LEAD CAPTURE FORM */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Send className="w-4 h-4 text-brand-pink" />
            <span className="font-mono text-xs font-normal uppercase tracking-wider text-brand-pink">
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
              <label htmlFor="plannerFirstName" className="block text-xs font-mono font-light text-slate-300">
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
              <label htmlFor="plannerLastName" className="block text-xs font-mono font-light text-slate-300">
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
              <label htmlFor="plannerEmail" className="block text-xs font-mono font-light text-slate-300">
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
              <label htmlFor="plannerPhone" className="block text-xs font-mono font-light text-slate-300">
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
              <label htmlFor="plannerCompany" className="block text-xs font-mono font-light text-slate-300">
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
              <label htmlFor="plannerJobTitle" className="block text-xs font-mono font-light text-slate-300">
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
            <label htmlFor="plannerNotes" className="block text-xs font-mono font-light text-slate-300">
              Additional Site Notes / Special Access Requirements (Optional)
            </label>
            <textarea
              id="plannerNotes"
              rows={3}
              value={inspection.notes || ''}
              onChange={(e) => onContactChange({ ...contact })}
              placeholder="Provide any additional site details, security gates, specific dates, or previous survey context..."
              className="w-full bg-brand-graphite border border-brand-edge-dark rounded-sm p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-pink"
            />
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-edge-dark">
            <button
              type="button"
              onClick={onStartAgain}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
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
