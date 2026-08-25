import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Cpu, Database, UserCheck, HardHat, FileCheck, Layers, Sparkles } from 'lucide-react';

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
    <div className="my-12 p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl">
      <div className="max-w-2xl mb-8">
        {eyebrow && (
          <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block mb-1">
            {eyebrow}
          </span>
        )}
        <h3 className="text-xl sm:text-2xl font-extralight text-white mb-2">
          {title}
        </h3>
        {intro && <p className="text-xs sm:text-sm text-slate-400">{intro}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const isHuman = step.role.includes('Human') || step.role.includes('Duty Manager');
          const isAI = step.role.includes('AI');

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                step.checkpoint
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : isAI
                  ? 'bg-pink-950/20 border-pink-500/30'
                  : isHuman
                  ? 'bg-blue-950/20 border-blue-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-light text-slate-500">
                    {step.number}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-light px-2 py-0.5 rounded border uppercase tracking-wider ${
                      isAI
                        ? 'bg-pink-950 text-pink-300 border-pink-700'
                        : isHuman
                        ? 'bg-blue-950 text-blue-300 border-blue-700'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {step.role}
                  </span>
                </div>

                <h4 className="text-sm font-normal text-white mb-1.5 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {step.outputTag && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono flex items-center justify-between text-slate-400">
                  <span className="text-slate-500">Output:</span>
                  <span className="text-pink-400 font-light truncate max-w-[70%]">{step.outputTag}</span>
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
      accent: 'border-blue-500/30 bg-blue-950/20 text-blue-300',
    },
    {
      title: '02. EntireCAFM Core Operational Engine',
      badge: 'Logic & Asset Register',
      items: ['SFG20 Maintenance Task Library', 'Spatial & Hierarchy Asset Model', 'Accreditation & Skill Matrix Roster', 'SLA Contract Rules & Escalations'],
      accent: 'border-slate-700 bg-slate-900 text-slate-200',
    },
    {
      title: '03. AI & Automation Intelligence Layer',
      badge: 'Triage & Forecasting',
      items: ['NLP Entity & Location Extraction', 'Predictive SLA Breach Scoring', 'Anomaly Waveform Detection', 'OCR Certificate Defect Parsing'],
      accent: 'border-pink-500/40 bg-pink-950/25 text-pink-300 font-light',
    },
    {
      title: '04. Human Engineering & Action Outputs',
      badge: 'Field Execution',
      items: ['Mobile Engineer Tablet Dispatch', 'Mandatory Human Scope Approval', 'Digital Photographic Work Sign-Off', 'Executive Compliance Dashboard'],
      accent: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    },
  ];

  return (
    <div className="my-12 p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl">
      <div className="max-w-2xl mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-light block mb-1">
          System Blueprint
        </span>
        <h3 className="text-xl sm:text-2xl font-extralight text-white mb-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">{intro}</p>
      </div>

      <div className="space-y-4 relative">
        {layers.map((layer, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border ${layer.accent} shadow-md transition-all`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="text-sm font-normal text-white">{layer.title}</h4>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                {layer.badge}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {layer.items.map((it, itIdx) => (
                <div
                  key={itIdx}
                  className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
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
