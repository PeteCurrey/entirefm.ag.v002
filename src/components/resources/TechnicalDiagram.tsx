'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Database, UserCheck, HardHat, FileCheck, Layers } from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  actor: string;
  role: 'AI / Model' | 'System / CAFM' | 'Human Engineer' | 'Duty Manager' | 'Tenant / Client';
  description: string;
  outputTag?: string;
  checkpoint?: boolean;
}

interface ProcessFlowProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  steps: ProcessStep[];
}

export function ProcessFlow({
  eyebrow = 'Operational Architecture',
  title,
  intro,
  steps,
}: ProcessFlowProps) {
  return (
    <div className="my-12 p-8 sm:p-10 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm font-sans">
      <div className="max-w-2xl mb-8 space-y-2">
        {eyebrow && (
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
              {eyebrow}
            </span>
          </div>
        )}
        <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
          {title}
        </h3>
        {intro && <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">{intro}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const isHuman = step.role.includes('Human') || step.role.includes('Duty Manager');
          const isAI = step.role.includes('AI');

          return (
            <div
              key={idx}
              className={`p-6 rounded-sm border flex flex-col justify-between transition-all space-y-4 ${
                step.checkpoint
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-sm'
                  : isAI
                  ? 'bg-brand-carbon border-brand-pink/30'
                  : isHuman
                  ? 'bg-brand-carbon border-blue-500/30'
                  : 'bg-brand-carbon border-brand-edge-dark'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-sm font-extralight text-brand-pink">
                    {step.number}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-sm border uppercase tracking-wider ${
                      isAI
                        ? 'bg-brand-pink/10 text-brand-pink border-brand-pink/30'
                        : isHuman
                        ? 'bg-blue-950 text-blue-300 border-blue-700'
                        : 'bg-white/10 text-slate-300 border-white/15'
                    }`}
                  >
                    {step.role}
                  </span>
                </div>

                <h4 className="text-base font-light text-white mb-2 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              {step.outputTag && (
                <div className="mt-4 pt-3 border-t border-brand-edge-dark text-xs flex items-center justify-between text-slate-400 font-light">
                  <span className="text-slate-500">Output:</span>
                  <span className="text-brand-pink font-medium truncate max-w-[70%]">{step.outputTag}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface LayeredArchitectureProps {
  title?: string;
  intro?: string;
}

export function CafmLayeredArchitecture({
  title = 'EntireCAFM Operational Layer Architecture',
  intro = 'How live sensor telemetry, helpdesk intake, and human engineer workflows unify into a single operational system.',
}: LayeredArchitectureProps) {
  const layers = [
    {
      title: '01. Data Ingestion & Physical Telemetry',
      badge: 'Input Plane',
      items: ['BACnet / Modbus BMS Gateways', 'IoT Vibration & Temp Sensors', 'Tenant Helpdesk Tickets (Email / Portal)', 'EICR & Statutory PDF Certificates'],
      accent: 'border-blue-500/30 bg-brand-carbon text-blue-300',
    },
    {
      title: '02. EntireCAFM Core Operational Engine',
      badge: 'Logic & Asset Register',
      items: ['SFG20 Maintenance Task Library', 'Spatial & Hierarchy Asset Model', 'Accreditation & Skill Matrix Roster', 'SLA Contract Rules & Escalations'],
      accent: 'border-white/15 bg-brand-carbon text-slate-200',
    },
    {
      title: '03. AI & Automation Intelligence Layer',
      badge: 'Triage & Forecasting',
      items: ['NLP Entity & Location Extraction', 'Predictive SLA Breach Scoring', 'Anomaly Waveform Detection', 'OCR Certificate Defect Parsing'],
      accent: 'border-brand-pink/40 bg-brand-carbon text-brand-pink font-light',
    },
    {
      title: '04. Human Engineering & Action Outputs',
      badge: 'Field Execution',
      items: ['Mobile Engineer Tablet Dispatch', 'Mandatory Human Scope Approval', 'Digital Photographic Work Sign-Off', 'Executive Compliance Dashboard'],
      accent: 'border-emerald-500/30 bg-brand-carbon text-emerald-300',
    },
  ];

  return (
    <div className="my-12 p-8 sm:p-10 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm font-sans">
      <div className="max-w-2xl mb-8 space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-pink" />
          <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
            System Blueprint
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">{intro}</p>
      </div>

      <div className="space-y-4 relative">
        {layers.map((layer, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-sm border ${layer.accent} shadow-sm transition-all`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h4 className="text-base font-light text-white">{layer.title}</h4>
              <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-sm bg-black/40 border border-white/10 text-slate-300 font-medium">
                {layer.badge}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {layer.items.map((it, itIdx) => (
                <div
                  key={itIdx}
                  className="p-3 rounded-sm bg-black/30 border border-white/10 text-xs text-slate-200 flex items-center gap-2 font-light"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
                  <span className="truncate">{it}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
