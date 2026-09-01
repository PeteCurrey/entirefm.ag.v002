'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CalendarDays, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { generatePpm12MonthPlan, PpmAssetTaskInput, PpmFrequency } from '@/server/contractor/business-calculations';

const DISCIPLINE_OPTIONS = [
  'Electrical',
  'HVAC',
  'Plumbing & Water Hygiene',
  'Fire Safety',
  'Emergency Lighting',
  'Access Control',
  'Building Fabric',
  'Gas',
  'Lifts & Conveyances',
  'Pest Control',
  'Cleaning',
  'Security',
];

const FREQUENCY_OPTIONS: { value: PpmFrequency; label: string; visitsPerYear: number }[] = [
  { value: 'WEEKLY', label: 'Weekly (52×/yr)', visitsPerYear: 52 },
  { value: 'MONTHLY', label: 'Monthly (12×/yr)', visitsPerYear: 12 },
  { value: 'QUARTERLY', label: 'Quarterly (4×/yr)', visitsPerYear: 4 },
  { value: 'SIX_MONTHLY', label: 'Six-Monthly (2×/yr)', visitsPerYear: 2 },
  { value: 'ANNUAL', label: 'Annual (1×/yr)', visitsPerYear: 1 },
];

export function PpmPlannerClient() {
  const [tasks, setTasks] = useState<PpmAssetTaskInput[]>([
    { id: '1', assetName: 'AHU-01 & AHU-02', discipline: 'HVAC', frequency: 'QUARTERLY', estimatedHoursPerVisit: 4 },
    { id: '2', assetName: 'Emergency Lighting', discipline: 'Emergency Lighting', frequency: 'MONTHLY', estimatedHoursPerVisit: 2 },
    { id: '3', assetName: 'Water Temperature Monitoring', discipline: 'Plumbing & Water Hygiene', frequency: 'MONTHLY', estimatedHoursPerVisit: 1.5 },
    { id: '4', assetName: 'Distribution Board Inspection', discipline: 'Electrical', frequency: 'ANNUAL', estimatedHoursPerVisit: 6 },
    { id: '5', assetName: 'Fire Alarm Quarterly Inspection', discipline: 'Fire Safety', frequency: 'QUARTERLY', estimatedHoursPerVisit: 3 },
  ]);
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const addTask = () => {
    const id = String(Date.now());
    setTasks((prev) => [
      ...prev,
      { id, assetName: '', discipline: 'Electrical', frequency: 'QUARTERLY', estimatedHoursPerVisit: 2 },
    ]);
  };

  const updateTask = (id: string, key: keyof PpmAssetTaskInput, value: any) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)));
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const plan = generatePpm12MonthPlan(tasks.filter((t) => t.assetName.trim().length > 0));

  // Annual summary by discipline
  const disciplineSummary: Record<string, { visits: number; hours: number }> = {};
  plan.months.forEach((m) => {
    m.scheduledTasks.forEach((t) => {
      if (!disciplineSummary[t.discipline]) disciplineSummary[t.discipline] = { visits: 0, hours: 0 };
      disciplineSummary[t.discipline].visits += 1;
      disciplineSummary[t.discipline].hours += t.estimatedHours;
    });
  });

  return (
    <div className="space-y-6">
      {/* Asset Task List */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-edge-dark">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              PPM ASSET & ACTIVITY REGISTER
            </span>
            <p className="text-xs text-brand-mist/60 mt-0.5">Add assets and assign frequencies to generate your 12-month plan.</p>
          </div>
          <button
            onClick={addTask}
            className="px-3.5 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Activity
          </button>
        </div>

        <div className="divide-y divide-brand-edge-dark/30">
          {tasks.map((task) => (
            <div key={task.id} className="px-5 py-3 grid grid-cols-12 gap-3 items-center text-xs font-normal">
              <div className="col-span-4">
                <input
                  type="text"
                  value={task.assetName}
                  onChange={(e) => updateTask(task.id, 'assetName', e.target.value)}
                  placeholder="Asset / Activity name..."
                  className="w-full p-2 rounded bg-brand-void border border-brand-edge-dark text-white font-sans focus:border-brand-electric focus:outline-none"
                />
              </div>
              <div className="col-span-3">
                <select
                  value={task.discipline}
                  onChange={(e) => updateTask(task.id, 'discipline', e.target.value)}
                  className="w-full p-2 rounded bg-brand-void border border-brand-edge-dark text-white focus:border-brand-electric focus:outline-none"
                >
                  {DISCIPLINE_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <select
                  value={task.frequency}
                  onChange={(e) => updateTask(task.id, 'frequency', e.target.value as PpmFrequency)}
                  className="w-full p-2 rounded bg-brand-void border border-brand-edge-dark text-white focus:border-brand-electric focus:outline-none"
                >
                  {FREQUENCY_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <div className="relative">
                  <input
                    type="number"
                    value={task.estimatedHoursPerVisit}
                    min={0.5}
                    step={0.5}
                    onChange={(e) => updateTask(task.id, 'estimatedHoursPerVisit', Number(e.target.value))}
                    className="w-full p-2 rounded bg-brand-void border border-brand-edge-dark text-white text-center focus:border-brand-electric focus:outline-none"
                  />
                </div>
                <span className="text-[9px] text-brand-mist/40 block text-center mt-0.5">hrs/visit</span>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => removeTask(task.id)}
                  className="p-1.5 rounded hover:bg-rose-950/30 text-brand-mist/40 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Output */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-edge-dark">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-brand-electric" />
            <div>
              <span className="text-sm font-medium text-white block">12-Month PPM Schedule</span>
              <span className="text-[10.5px] font-normal text-brand-mist/50 block">
                {plan.annualTotalVisits} planned visits &bull; {plan.annualTotalHours} engineer hours / year
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors ${
                viewMode === 'CALENDAR' ? 'bg-brand-electric text-white' : 'border border-brand-edge-dark text-brand-mist/60 hover:text-white'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors ${
                viewMode === 'LIST' ? 'bg-brand-electric text-white' : 'border border-brand-edge-dark text-brand-mist/60 hover:text-white'
              }`}
            >
              By Month
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'CALENDAR' && (
          <div className="p-5">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
              {plan.months.map((month) => (
                <div
                  key={month.monthNumber}
                  className={`rounded-lg border p-2.5 space-y-1 ${
                    month.scheduledTasks.length > 0
                      ? 'border-brand-electric/30 bg-brand-void'
                      : 'border-brand-edge-dark/40 bg-brand-void/40'
                  }`}
                >
                  <div className="text-[10.5px] font-bold text-white">{month.monthLabel}</div>
                  {month.scheduledTasks.length === 0 ? (
                    <div className="text-[9px] text-brand-mist/30 font-normal">—</div>
                  ) : (
                    <>
                      <div className="text-[11px] text-brand-electric-bright font-bold">
                        {month.scheduledTasks.length} visit{month.scheduledTasks.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-[9.5px] text-brand-mist/50 font-normal">{month.totalHours}h</div>
                      <div className="space-y-0.5">
                        {month.scheduledTasks.slice(0, 3).map((t, i) => (
                          <div key={i} className="text-[8.5px] text-brand-mist/60 truncate">{t.assetName}</div>
                        ))}
                        {month.scheduledTasks.length > 3 && (
                          <div className="text-[8.5px] text-brand-electric/60">+{month.scheduledTasks.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'LIST' && (
          <div className="divide-y divide-brand-edge-dark/30">
            {plan.months.map((month) => (
              <div key={month.monthNumber}>
                <button
                  onClick={() => setExpandedMonth(expandedMonth === month.monthNumber ? null : month.monthNumber)}
                  className="w-full px-5 py-3 flex items-center justify-between text-xs font-normal hover:bg-brand-edge-dark/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold w-6">{month.monthLabel}</span>
                    <span className="text-brand-mist/50">
                      {month.scheduledTasks.length} visit{month.scheduledTasks.length !== 1 ? 's' : ''} &bull; {month.totalHours}h
                    </span>
                  </div>
                  {expandedMonth === month.monthNumber ? (
                    <ChevronUp className="w-3.5 h-3.5 text-brand-mist/40" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-brand-mist/40" />
                  )}
                </button>
                {expandedMonth === month.monthNumber && month.scheduledTasks.length > 0 && (
                  <div className="bg-brand-void/30 px-5 py-2 divide-y divide-brand-edge-dark/20">
                    {month.scheduledTasks.map((t, i) => (
                      <div key={i} className="py-2 flex items-center justify-between text-[11px] font-normal">
                        <div>
                          <span className="text-white font-medium block">{t.assetName}</span>
                          <span className="text-brand-mist/50 block">{t.discipline} &bull; {t.frequency.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-brand-electric-bright shrink-0">{t.estimatedHours}h</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Annual Summary by Trade */}
      <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-5 space-y-3">
        <h3 className="text-xs font-medium text-brand-mist/60 uppercase tracking-widest">Annual Trade Demand Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(disciplineSummary).map(([disc, data]) => (
            <div key={disc} className="p-3 rounded-lg bg-brand-void border border-brand-edge-dark space-y-1">
              <span className="text-[10.5px] font-normal text-brand-mist/60 block">{disc}</span>
              <span className="text-white font-bold text-sm block">{data.hours}h</span>
              <span className="text-brand-mist/40 text-[10px] block">{data.visits} visits</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
