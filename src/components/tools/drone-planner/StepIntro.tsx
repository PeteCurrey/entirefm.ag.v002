'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Layers, 
  Search, 
  ListFilter, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck 
} from 'lucide-react';
import { CONTACT_CONFIG } from '@/config/contact';

interface StepIntroProps {
  onStart: () => void;
  hasSavedState: boolean;
  onResume: () => void;
  onClearState: () => void;
}

export function StepIntro({ onStart, hasSavedState, onResume, onClearState }: StepIntroProps) {
  return (
    <div className="space-y-10">
      {/* Intro Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
          <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
          <span className="text-[11.5px] uppercase tracking-wider text-white/90 font-light">
            DECISION-SUPPORT &amp; SURVEY SCOPE BUILDER
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
          Plan a Commercial <br />
          <span className="text-hero-pink">
            Drone Inspection
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
          Tell us about the building, asset or site you need inspected. EntireFM will use your answers to recommend an appropriate inspection approach and create a structured survey brief for our operations team.
        </p>
      </div>

      {/* Approximate Journey Roadmap */}
      <div className="p-6 rounded-sm bg-brand-carbon border border-brand-edge-dark space-y-4">
        <span className="font-mono text-xs font-normal uppercase tracking-wider text-slate-400 block">
          Configurator Journey Overview
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { num: '01', title: 'Site & Scale', desc: 'Property classification' },
            { num: '02', title: 'Asset Area', desc: 'Roof, façade, plant' },
            { num: '03', title: 'Investigation', desc: 'Leaks, defects, PPM' },
            { num: '04', title: 'Access / Height', desc: 'Storeys & site limits' },
            { num: '05', title: 'Deliverables', desc: 'Images, thermal, CAD' },
            { num: '06', title: 'Action Plan', desc: 'Structured brief' },
          ].map((item) => (
            <div key={item.num} className="p-3 bg-brand-graphite rounded-sm border border-brand-edge-dark/60 space-y-1">
              <span className="font-mono text-xs font-normal text-brand-pink block">{item.num}</span>
              <h4 className="text-xs font-normal text-white leading-snug">{item.title}</h4>
              <p className="text-[10.5px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Session Alert (if exists) */}
      {hasSavedState && (
        <div className="p-4 rounded-sm bg-brand-pink/10 border border-brand-pink/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-pink animate-pulse shrink-0" />
            <span className="text-xs text-white">
              You have an unfinished inspection brief saved in this browser.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onResume}
              className="text-xs font-normal text-brand-pink hover:underline"
            >
              Resume Brief
            </button>
            <span className="text-slate-500">|</span>
            <button
              type="button"
              onClick={onClearState}
              className="text-xs text-slate-400 hover:text-white"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-8 py-4 text-sm font-normal text-white shadow-elevated hover:shadow-pink-500/25 transition-all hover:scale-[1.02]"
        >
          <span>Start Inspection Planner</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <a
          href={CONTACT_CONFIG.mainPhone.href}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-4 text-sm font-normal text-white hover:bg-white/10 transition-colors"
        >
          <PhoneCall className="h-4 w-4 text-brand-pink" />
          <span>Speak to Drone Services ({CONTACT_CONFIG.mainPhone.display})</span>
        </a>
      </div>

      {/* Governance Strip */}
      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          UK CAA Compliant Planning
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Deterministic Rule Engine
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Direct Trade Remedial Scopes
        </span>
      </div>
    </div>
  );
}
