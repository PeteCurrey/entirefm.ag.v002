'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Camera, 
  AlertTriangle, 
  MapPin, 
  FileText, 
  Wrench, 
  CheckCircle2, 
  History,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

const WORKFLOW_NODES = [
  {
    step: '01',
    title: 'Drone Inspection',
    icon: Camera,
    desc: 'High-resolution aerial optical, thermal or mapping survey flown across the building or site.',
    tag: 'DATA CAPTURE',
  },
  {
    step: '02',
    title: 'Defect Identified',
    icon: AlertTriangle,
    desc: 'Anomaly, water pooling, perished sealant, or thermal leak isolated by surveyor.',
    tag: 'DIAGNOSTIC TRIAGE',
  },
  {
    step: '03',
    title: 'Asset & Location',
    icon: MapPin,
    desc: 'Defect pinned to specific building elevation, roof bay, or plant asset QR register.',
    tag: 'SPATIAL REGISTRY',
  },
  {
    step: '04',
    title: 'Priority & Evidence',
    icon: FileText,
    desc: 'High-res photos, thermal datasets & RAG priority score attached to observation.',
    tag: 'EVIDENCE AUDIT',
  },
  {
    step: '05',
    title: 'Work Order Scope',
    icon: Wrench,
    desc: 'Actionable remedial job issued directly to EntireFM rope access, roofing, or M&E teams.',
    tag: 'REMEDIAL DISPATCH',
  },
  {
    step: '06',
    title: 'Completion Evidence',
    icon: CheckCircle2,
    desc: 'Post-repair photographic signoff and technician notes verified for client signoff.',
    tag: 'VERIFICATION',
  },
  {
    step: '07',
    title: 'Asset History',
    icon: History,
    desc: 'Full lifecycle record preserved in EntireCAFM for audits, insurance & CapEx forecasting.',
    tag: 'LIFECYCLE INTELLIGENCE',
  },
];

export function DroneCafmWorkflow() {
  return (
    <section className="py-24 bg-[#0B1220] text-white relative overflow-hidden border-b border-brand-edge-dark" id="entirecafm">
      <div className="container-custom relative z-10 space-y-16">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <Smartphone className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-white font-semibold">
                DIGITAL OPERATING MODEL
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              Designed to integrate with <br />
              <span className="font-bold text-hero-pink">EntireCAFM</span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
              Aerial data acquisition achieves its highest value when connected directly to facilities maintenance operations. EntireFM’s digital operating architecture is designed to incorporate aerial survey findings directly into your live asset management register.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right">
            <Link
              href="/client-portal"
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <span>Explore EntireCAFM Portal</span>
              <ArrowRight className="h-3.5 w-3.5 text-brand-pink" />
            </Link>
          </div>
        </div>

        {/* Visual Conceptual Workflow Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 relative">
          {WORKFLOW_NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div
                key={node.step}
                className="p-5 rounded-sm bg-brand-carbon border border-brand-edge-dark flex flex-col justify-between space-y-4 hover:border-brand-pink/60 transition-colors relative group"
              >
                {/* Node Connector Line for Desktop */}
                {idx < WORKFLOW_NODES.length - 1 && (
                  <div 
                    aria-hidden="true" 
                    className="hidden lg:block absolute -right-2.5 top-8 w-5 h-0.5 bg-brand-edge-dark z-20 group-hover:bg-brand-pink transition-colors"
                  />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-pink">
                      {node.step}
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-brand-graphite border border-brand-edge-dark flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-pink-light transition-colors leading-snug">
                      {node.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
                      {node.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-edge-dark/60">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold block truncate">
                    {node.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsible Architecture Note */}
        <div className="p-6 rounded-sm bg-brand-graphite border border-brand-edge-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white font-semibold">End-to-End Governance:</strong> Aerial inspection evidence can form part of your property’s statutory logbook and forward 5-year capital expenditure forecast, moving building records away from disjointed PDF email attachments into an auditable digital lifecycle.
            </p>
          </div>

          <Link
            href="/client-portal/compliance-reporting"
            className="text-xs font-semibold text-brand-pink hover:underline whitespace-nowrap inline-flex items-center gap-1"
          >
            <span>Compliance Reporting</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
