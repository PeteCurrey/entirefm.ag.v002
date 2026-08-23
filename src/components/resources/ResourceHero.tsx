import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Clock, ShieldCheck, Cpu, ArrowRight, Layers, FileText } from 'lucide-react';

interface ResourceHeroProps {
  breadcrumbs: { name: string; url: string }[];
  category: string;
  categoryHref?: string;
  title: string;
  intro: string;
  readingTime?: string;
  technicalTier?: string;
  audience?: string;
  standard?: string;
  visualType?: 'telemetry' | 'cafm-radar' | 'chiller-condition' | 'thermal-scan' | 'spatial-hierarchy' | 'image';
  imageSrc?: string;
  imageAlt?: string;
  systemMetrics?: { label: string; value: string; status?: 'normal' | 'active' | 'warning' }[];
}

export function ResourceHero({
  breadcrumbs,
  category,
  categoryHref = '/resources',
  title,
  intro,
  readingTime = '12 min read',
  technicalTier = 'Level 3 · Operations & Engineering',
  audience = 'Estates Directors, FM Heads & Operations Teams',
  standard = '2026 Authoritative Standard',
  visualType = 'telemetry',
  imageSrc,
  imageAlt,
  systemMetrics = [
    { label: 'System Protocol', value: 'BACnet / Modbus / MQTT', status: 'normal' },
    { label: 'CAFM Synchronization', value: 'Real-Time Event Bus', status: 'active' },
    { label: 'Security Boundary', value: 'Air-Gapped Life Safety', status: 'normal' },
  ],
}: ResourceHeroProps) {
  return (
    <section className="relative pt-28 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#060c16] via-[#0b1320] to-[#0f172a] border-b border-slate-800 text-white">
      {/* Background Subtle Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      
      {/* Faint Technical Ambient Glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial & Metadata */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <Link href={categoryHref} className="hover:underline">
                {category}
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] font-sans">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              {intro}
            </p>

            {/* Technical Metadata Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-xs font-mono">
              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-md">
                <span className="text-slate-500 block uppercase text-[10px] tracking-wider mb-1">Depth</span>
                <span className="text-slate-200 font-medium">{technicalTier}</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-md">
                <span className="text-slate-500 block uppercase text-[10px] tracking-wider mb-1">Audience</span>
                <span className="text-slate-200 font-medium truncate block">{audience}</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-md col-span-2 sm:col-span-1">
                <span className="text-slate-500 block uppercase text-[10px] tracking-wider mb-1">Standard</span>
                <span className="text-pink-400 font-medium">{standard}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Counterpart */}
          <div className="lg:col-span-5 xl:col-span-5">
            {imageSrc ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={imageSrc}
                    alt={imageAlt || title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>
                {/* Live Overlaid Telemetry Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-3 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-slate-300">EntireFM Live Telemetry</span>
                  </div>
                  <span className="text-pink-400 text-[10px] font-bold">24/7 ACTIVE</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-pink-400" />
                    <span>OPERATIONAL TELEMETRY DESK</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    CONNECTED
                  </span>
                </div>

                {/* Animated Technical Canvas Simulation */}
                <div className="space-y-3 font-mono text-xs">
                  {systemMetrics.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400">{m.label}</span>
                      <span className={`font-semibold ${m.status === 'active' ? 'text-pink-400' : 'text-slate-200'}`}>
                        {m.value}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>BMS Data Stream Quality</span>
                      <span className="text-pink-400 font-bold">99.8% Nominal</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-blue-500 to-pink-500 h-1.5 rounded-full w-[94%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>LATENCY: 14ms</span>
                  <span>SFG20 COMPLIANT LOGIC</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
