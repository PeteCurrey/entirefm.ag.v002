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
      <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E5]">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              PPM ASSET & ACTIVITY REGISTER
            </span>
            <p className="text-xs text-[#6D6D68] mt-0.5">Add assets and assign frequencies to generate your 12-month plan.</p>
          </div>
          <button
            onClick={addTask}
            className="px-3.5 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Activity
          </button>
        </div>

        <div className="divide-y divide-[#E8E8E5]">
          {tasks.map((task) => (
            <div key={task.id} className="px-5 py-3 grid grid-cols-12 gap-3 items-center text-xs font-normal">
              <div className="col-span-4">
                <input
                  type="text"
                  value={task.assetName}
                  onChange={(e) => updateTask(task.id, 'assetName', e.target.value)}
                  placeholder="Asset / Activity name..."
                  className="w-full p-2 rounded bg-[#FAFAF8] border border-[#E8E8E5] text-white font-sans focus:border-brand-electric focus:outline-none"
                />
              </div>
              <div className="col-span-3">
                <select
                  value={task.discipline}
                  onChange={(e) => updateTask(task.id, 'discipline', e.target.value)}
                  className="w-full p-2 rounded bg-[#FAFAF8] border border-[#E8E8E5] text-white focus:border-brand-electric focus:outline-none"
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
                  className="w-full p-2 rounded bg-[#FAFAF8] border border-[#E8E8E5] text-white focus:border-brand-electric focus:outline-none"
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
                    className="w-full p-2 rounded bg-[#FAFAF8] border border-[#E8E8E5] text-white text-center focus:border-brand-electric focus:outline-none"
                  />
                </div>
                <span className="text-[9px] text-[#9A9A95] block text-center mt-0.5">hrs/visit</span>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => removeTask(task.id)}
                  className="p-1.5 rounded hover:bg-rose-950/30 text-[#9A9A95] hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Output */}
      <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E5]">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-brand-electric" />
            <div>
              <span className="text-sm font-medium text-[#111111] block">12-Month PPM Schedule</span>
              <span className="text-[10.5px] font-normal text-[#9A9A95] block">
                {plan.annualTotalVisits} planned visits &bull; {plan.annualTotalHours} engineer hours / year
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors ${
                viewMode === 'CALENDAR' ? 'bg-brand-electric text-white' : 'border border-[#E8E8E5] text-[#6D6D68] hover:text-white'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors ${
                viewMode === 'LIST' ? 'bg-brand-electric text-white' : 'border border-[#E8E8E5] text-[#6D6D68] hover:text-white'
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
                      ? 'border-brand-electric/30 bg-[#FAFAF8]'
                      : 'border-[#E8E8E5] bg-[#FAFAF8]'
                  }`}
                >
                  <div className="text-[10.5px] font-bold text-[#111111]">{month.monthLabel}</div>
                  {month.scheduledTasks.length === 0 ? (
                    <div className="text-[9px] text-[#9A9A95] font-normal">—</div>
                  ) : (
                    <>
                      <div className="text-[11px] text-brand-electric-bright font-bold">
                        {month.scheduledTasks.length} visit{month.scheduledTasks.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-[9.5px] text-[#9A9A95] font-normal">{month.totalHours}h</div>
                      <div className="space-y-0.5">
                        {month.scheduledTasks.slice(0, 3).map((t, i) => (
                          <div key={i} className="text-[8.5px] text-[#6D6D68] truncate">{t.assetName}</div>
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
          <div className="divide-y divide-[#E8E8E5]">
            {plan.months.map((month) => (
              <div key={month.monthNumber}>
                <button
                  onClick={() => setExpandedMonth(expandedMonth === month.monthNumber ? null : month.monthNumber)}
                  className="w-full px-5 py-3 flex items-center justify-between text-xs font-normal hover:bg-[#F5F5F3] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#111111] font-bold w-6">{month.monthLabel}</span>
                    <span className="text-[#9A9A95]">
                      {month.scheduledTasks.length} visit{month.scheduledTasks.length !== 1 ? 's' : ''} &bull; {month.totalHours}h
                    </span>
                  </div>
                  {expandedMonth === month.monthNumber ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#9A9A95]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#9A9A95]" />
                  )}
                </button>
                {expandedMonth === month.monthNumber && month.scheduledTasks.length > 0 && (
                  <div className="bg-[#FAFAF8] px-5 py-2 divide-y divide-[#E8E8E5]">
                    {month.scheduledTasks.map((t, i) => (
                      <div key={i} className="py-2 flex items-center justify-between text-[11px] font-normal">
                        <div>
                          <span className="text-[#111111] font-medium block">{t.assetName}</span>
                          <span className="text-[#9A9A95] block">{t.discipline} &bull; {t.frequency.replace(/_/g, ' ')}</span>
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
      <div className="rounded-xl border border-[#E8E8E5] bg-white shadow-sm p-5 space-y-3">
        <h3 className="text-xs font-medium text-[#6D6D68] uppercase tracking-widest">Annual Trade Demand Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(disciplineSummary).map(([disc, data]) => (
            <div key={disc} className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E8E8E5] space-y-1">
              <span className="text-[10.5px] font-normal text-[#6D6D68] block">{disc}</span>
              <span className="text-[#111111] font-bold text-sm block">{data.hours}h</span>
              <span className="text-[#9A9A95] text-[10px] block">{data.visits} visits</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
