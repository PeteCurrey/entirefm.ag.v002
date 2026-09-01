'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Printer, 
  PhoneCall, 
  Calendar, 
  FileText,
  Mail
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

interface PlannerSubmissionSuccessProps {
  referenceNumber: string;
  clientName: string;
  email: string;
  onPrint: () => void;
  onStartNew: () => void;
}

export function PlannerSubmissionSuccess({
  referenceNumber,
  clientName,
  email,
  onPrint,
  onStartNew,
}: PlannerSubmissionSuccessProps) {
  return (
    <div className="p-8 sm:p-12 rounded-sm bg-brand-carbon border border-brand-edge-dark text-center space-y-8 max-w-2xl mx-auto shadow-elevated">
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-normal uppercase tracking-widest text-emerald-400">
          INSPECTION BRIEF RECEIVED
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Thank you, <span className="font-light text-white">{clientName || 'Partner'}</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
          Your commercial drone survey brief has been delivered to our Aviation Operations Desk. A regional technical lead will review airspace permissions and contact you promptly.
        </p>
      </div>

      <div className="p-4 rounded-sm bg-brand-graphite border border-brand-edge-dark inline-block font-normal text-left space-y-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Your Reference Identifier:</span>
        <span className="text-lg font-light text-brand-pink tracking-wider">{referenceNumber}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
        <div className="p-4 rounded-sm bg-white/[0.03] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-normal text-white">
            <Mail className="w-4 h-4 text-brand-pink" />
            <span>Confirmation Email</span>
          </div>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            A confirmation record will be sent to <span className="text-slate-200">{email}</span>.
          </p>
        </div>

        <div className="p-4 rounded-sm bg-white/[0.03] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-normal text-white">
            <PhoneCall className="w-4 h-4 text-brand-pink" />
            <span>Direct Aviation Desk</span>
          </div>
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            Need immediate advice? Call <a href={CONTACT_CONFIG.mainPhone.href} className="text-brand-pink hover:underline">{CONTACT_CONFIG.mainPhone.display}</a>.
          </p>
        </div>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4 border-t border-brand-edge-dark">
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-normal text-white hover:bg-white/10 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF Brief</span>
        </button>

        <Link
          href="/services/drone-services"
          className="inline-flex items-center gap-2 rounded-sm bg-brand-pink px-5 py-2.5 text-xs font-normal text-white hover:bg-brand-pink-dark transition-colors"
        >
          <span>Explore Drone Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
