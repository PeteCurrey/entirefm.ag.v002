'use client';

import React from 'react';
import { Activity, Clock, Zap, CheckCircle2 } from 'lucide-react';

interface TelemetryChartProps {
  type?: 'vibration-waveform' | 'bms-hvac-demand' | 'sla-response-timeline';
  title?: string;
  subtitle?: string;
  assetContext?: string;
}

export function TelemetryChart({
  type = 'vibration-waveform',
  title = 'Condition-Based Telemetry & Anomaly Detection',
  subtitle = 'Illustrative operational sensor trend: baseline operating band vs subtle harmonic deviation.',
  assetContext = 'Asset: Primary Water-Cooled Chiller CH-01 (450kW) · Bearing Velocity RMS',
}: TelemetryChartProps) {
  if (type === 'sla-response-timeline') {
    const timeline = [
      { time: '00:00', label: 'Ticket Logged', desc: 'Tenant reports server room AC alarm via portal', actor: 'Occupant' },
      { time: '00:04', label: 'NLP Classification', desc: 'Categorized as Priority 1 (Thermal Critical)', actor: 'AI Engine' },
      { time: '00:07', label: 'BMS Asset Match', desc: 'Pulls telemetry: PAC-02 fan failure confirmed', actor: 'CAFM' },
      { time: '00:11', label: 'Human Checkpoint', desc: 'Duty manager verifies scope and authorizes dispatch', actor: 'Duty Manager' },
      { time: '00:45', label: 'Engineer on Site', desc: 'Qualified AC engineer arrives with replacement belt', actor: 'Mobile Fleet' },
      { time: '01:20', label: 'System Commissioned', desc: 'Airflow verified at 18.2°C; photos logged to CAFM', actor: 'Sign-Off' },
    ];

    return (
      <div className="my-12 p-8 sm:p-10 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm font-sans">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-pink" />
              <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                Operational Timeline Sequence
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light">{subtitle}</p>
          </div>
          <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-sm bg-white/10 border border-white/15 text-slate-300 font-medium">
            Verified Dispatch SLA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {timeline.map((item, idx) => (
            <div key={idx} className="p-4 rounded-sm bg-brand-carbon border border-brand-edge-dark flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-brand-pink">{item.time}</span>
                  <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded-sm bg-black/40 text-slate-300 border border-white/10">
                    {item.actor}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-normal text-white mb-1">{item.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'bms-hvac-demand') {
    return (
      <div className="my-12 p-8 sm:p-10 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm font-sans">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-pink" />
              <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
                BMS Multi-Variable Demand Analysis
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light">{subtitle}</p>
          </div>
          <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-sm bg-blue-950 border border-blue-800 text-blue-300 font-medium">
            Dynamic BMS Tuning
          </span>
        </div>

        {/* CSS Multi-Curve Telemetry Simulation */}
        <div className="p-6 bg-brand-carbon rounded-sm border border-brand-edge-dark space-y-6">
          <div className="flex flex-wrap gap-4 text-xs text-slate-300 border-b border-brand-edge-dark pb-4 font-light">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-rose-400 inline-block" /> External Ambient Temp (°C)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-blue-400 inline-block" /> Floor Occupancy Index (%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> Chilled Water Valve Demand (%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-brand-pink inline-block" /> AI Optimized Setpoint
            </span>
          </div>

          <div className="relative h-44 w-full bg-black/40 rounded-sm p-4 flex items-end justify-between gap-1 overflow-hidden border border-brand-edge-dark">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className="border-b border-slate-500 w-full" />
              <div className="border-b border-slate-500 w-full" />
              <div className="border-b border-slate-500 w-full" />
              <div className="border-b border-slate-500 w-full" />
            </div>

            {/* Simulated Data Points */}
            {[40, 48, 55, 62, 70, 78, 85, 80, 72, 60, 50, 42].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end z-10">
                <div
                  className="w-full max-w-[12px] bg-gradient-to-t from-blue-600/40 to-brand-pink/80 rounded-t-xs transition-all hover:brightness-125"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[9px] text-slate-400 font-light">{i * 2}:00</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 font-light">
            <span>Occupancy Deadband Delta: ±1.8°C Adjusted</span>
            <span className="text-emerald-400 font-medium">14.2% kWh Energy Reduction Verified</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Vibration Waveform & Anomaly Detection
  return (
    <div className="my-12 p-8 sm:p-10 bg-brand-carbon/60 border border-brand-edge-dark rounded-sm font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-pink" />
            <span className="text-xs uppercase tracking-widest text-brand-pink font-medium">
              Continuous Condition Telemetry
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extralight text-white tracking-tight">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-300 font-light">{subtitle}</p>
        </div>
        <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-sm bg-brand-pink/10 border border-brand-pink/30 text-brand-pink font-medium">
          ISO 10816-3 Threshold
        </span>
      </div>

      <div className="p-6 bg-brand-carbon rounded-sm border border-brand-edge-dark space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 border-b border-brand-edge-dark pb-4 font-light">
          <span className="text-slate-200">{assetContext}</span>
          <span className="text-brand-pink font-medium">Sampling Rate: 10 kHz</span>
        </div>

        {/* Stylized Waveform Grid */}
        <div className="relative h-44 w-full bg-black/40 rounded-sm p-4 flex items-center justify-between overflow-hidden border border-brand-edge-dark">
          {/* Threshold Alert Line */}
          <div className="absolute top-8 inset-x-0 border-t border-dashed border-rose-500/70 z-10 flex justify-end pr-4">
            <span className="text-[10px] text-rose-400 bg-black/80 px-2 py-0.5 rounded-sm font-medium">
              ISO Critical Threshold (4.5 mm/s)
            </span>
          </div>

          {/* Baseline Safe Line */}
          <div className="absolute top-24 inset-x-0 border-t border-dashed border-emerald-500/40 z-10 flex justify-end pr-4">
            <span className="text-[10px] text-emerald-400 bg-black/80 px-2 py-0.5 rounded-sm font-medium">
              Baseline Mean (1.8 mm/s)
            </span>
          </div>

          {/* Stylized Waveform Bars */}
          <div className="w-full flex items-end justify-between h-28 gap-0.5 z-0">
            {Array.from({ length: 48 }).map((_, i) => {
              const isAnomaly = i > 34 && i < 44;
              const h = isAnomaly ? 60 + Math.sin(i) * 35 : 25 + Math.sin(i * 0.8) * 15;
              return (
                <div
                  key={i}
                  className={`w-full rounded-t-xs transition-all ${
                    isAnomaly ? 'bg-rose-500' : 'bg-brand-pink/70'
                  }`}
                  style={{ height: `${Math.max(10, h)}%` }}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-sm bg-black/30 border border-brand-edge-dark space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">Peak Velocity (RMS)</span>
            <span className="text-sm font-normal text-white">3.4 mm/s (Advisory Alert)</span>
          </div>
          <div className="p-3.5 rounded-sm bg-black/30 border border-brand-edge-dark space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">Forecasted MTBF Window</span>
            <span className="text-sm font-normal text-brand-pink">28–35 Days to Intervention</span>
          </div>
          <div className="p-3.5 rounded-sm bg-black/30 border border-brand-edge-dark space-y-1">
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-medium">Recommended Action</span>
            <span className="text-sm font-normal text-emerald-400">Schedule Bearing Lubrication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
