import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';

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
      <div className="my-12 p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
              Operational Timeline Simulation
            </span>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">
            ILLUSTRATIVE DISPATCH SLA
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {timeline.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-pink-400">{item.time}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {item.actor}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{item.label}</h4>
                <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'bms-hvac-demand') {
    return (
      <div className="my-12 p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
              BMS Multi-Variable Demand Analysis
            </span>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-blue-300">
            DYNAMIC BMS TUNING
          </span>
        </div>

        {/* CSS Multi-Curve Telemetry Simulation */}
        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
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
              <span className="w-2.5 h-0.5 bg-pink-400 inline-block" /> AI Optimized Setpoint
            </span>
          </div>

          <div className="relative h-44 w-full bg-slate-950 rounded-lg p-4 flex items-end justify-between gap-1 overflow-hidden border border-slate-800/80">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-20">
              <div className="border-b border-slate-500 w-full" />
              <div className="border-b border-slate-500 w-full" />
              <div className="border-b border-slate-500 w-full" />
              <div className="border-b border-slate-500 w-full" />
            </div>

            {/* Visual Bar Grouping simulation */}
            {[
              { time: '06:00', ambient: 14, valve: 10, opt: 18 },
              { time: '08:00', ambient: 18, valve: 45, opt: 38 },
              { time: '10:00', ambient: 22, valve: 70, opt: 55 },
              { time: '12:00', ambient: 27, valve: 92, opt: 74 },
              { time: '14:00', ambient: 29, valve: 95, opt: 80 },
              { time: '16:00', ambient: 26, valve: 78, opt: 62 },
              { time: '18:00', ambient: 21, valve: 35, opt: 28 },
              { time: '20:00', ambient: 17, valve: 12, opt: 10 },
            ].map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end z-10">
                <div className="w-full max-w-[28px] bg-slate-800 rounded-t flex flex-col justify-end h-32 relative overflow-hidden">
                  <div style={{ height: `${d.valve}%` }} className="w-full bg-rose-500/40 border-t border-rose-400 transition-all" />
                  <div style={{ height: `${d.opt}%` }} className="w-full bg-emerald-500/60 border-t border-emerald-300 transition-all" />
                </div>
                <span className="text-[9px] font-mono text-slate-500">{d.time}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Result: 14.8% reduction in peak chiller plant electrical draw via predictive deadband tuning.</span>
            <span className="text-pink-400 font-bold">ILLUSTRATIVE BMS EXAMPLE</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Vibration Waveform Anomaly Chart
  return (
    <div className="my-12 p-6 sm:p-8 bg-slate-950 border border-slate-800 rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
            Condition-Monitoring Waveform
          </span>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">
          ISO 10816-3 VIBRATION STANDARD
        </span>
      </div>

      <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
        <div className="text-slate-400 text-xs border-b border-slate-800 pb-2">
          {assetContext}
        </div>

        {/* Graphical Waveform Simulation */}
        <div className="relative h-36 w-full bg-slate-950 rounded-lg p-3 overflow-hidden border border-slate-800/80 flex items-center justify-between">
          <div className="absolute inset-x-0 top-1/4 border-b border-red-500/40 stroke-dashed" />
          <span className="absolute top-2 right-3 text-[10px] font-mono text-red-400 font-bold">
            CRITICAL ALARM THRESHOLD (4.5 mm/s)
          </span>

          <div className="absolute inset-x-0 top-1/2 border-b border-amber-500/40 stroke-dashed" />
          <span className="absolute top-[45%] right-3 text-[10px] font-mono text-amber-400 font-bold">
            ANOMALY WARNING ZONE (2.8 mm/s)
          </span>

          {/* Waveform SVG */}
          <svg className="w-full h-full text-pink-500" viewBox="0 0 600 120" preserveAspectRatio="none">
            {/* Nominal band */}
            <path
              d="M 0,90 Q 25,85 50,90 T 100,90 T 150,88 T 200,92 T 250,88 T 300,90 T 350,75 T 400,60 T 450,42 T 500,32 T 550,22 T 600,18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Nominal Baseline</span>
            <span className="text-emerald-400 font-bold">0.8 – 1.4 mm/s</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Deviation Detected</span>
            <span className="text-amber-400 font-bold">+2.2 mm/s (Harmonic Peak)</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">CAFM Trigger</span>
            <span className="text-pink-400 font-bold">Pre-Failure Work Order Issued</span>
          </div>
        </div>
      </div>
    </div>
  );
}
