'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  PoundSterling,
  Clock,
  Building2,
  Check,
  X,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import {
  ContractorEntry,
  FM_DISCIPLINES,
  NOTICE_PERIOD_OPTIONS,
  getRelativeIsoDate,
} from '@/types/contractor-audit';

interface ContractorEntryFormProps {
  onAddContractor: (contractor: Omit<ContractorEntry, 'id'>) => void;
  onUpdateContractor?: (id: string, updated: Omit<ContractorEntry, 'id'>) => void;
  editingContractor?: ContractorEntry | null;
  onCancelEdit?: () => void;
}

export function ContractorEntryForm({
  onAddContractor,
  onUpdateContractor,
  editingContractor,
  onCancelEdit,
}: ContractorEntryFormProps) {
  const [contractorName, setContractorName] = useState('');
  const [discipline, setDiscipline] = useState(FM_DISCIPLINES[0].name);
  const [customDiscipline, setCustomDiscipline] = useState('');
  const [endDate, setEndDate] = useState(getRelativeIsoDate(6, 28));
  const [annualSpend, setAnnualSpend] = useState('15000');
  const [noticePeriodDays, setNoticePeriodDays] = useState(90);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync when entering/leaving edit mode
  useEffect(() => {
    if (editingContractor) {
      setContractorName(editingContractor.contractorName);
      const matched = FM_DISCIPLINES.find((d) => d.name === editingContractor.discipline);
      if (matched) {
        setDiscipline(matched.name);
        setCustomDiscipline('');
      } else {
        setDiscipline('Other Specialist Plant / Trade');
        setCustomDiscipline(editingContractor.discipline);
      }
      setEndDate(editingContractor.endDate);
      setAnnualSpend(String(editingContractor.annualSpend || 0));
      setNoticePeriodDays(editingContractor.noticePeriodDays ?? 90);
      setNotes(editingContractor.notes || '');
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingContractor]);

  // When discipline changes, recommend standard notice period if not already adjusted
  const handleDisciplineChange = (selectedName: string) => {
    setDiscipline(selectedName);
    const def = FM_DISCIPLINES.find((d) => d.name === selectedName);
    if (def && !editingContractor) {
      setNoticePeriodDays(def.defaultNoticeDays);
    }
  };

  const resetForm = () => {
    setContractorName('');
    setDiscipline(FM_DISCIPLINES[0].name);
    setCustomDiscipline('');
    setEndDate(getRelativeIsoDate(6, 28));
    setAnnualSpend('15000');
    setNoticePeriodDays(90);
    setNotes('');
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!endDate) {
      errs.endDate = 'Contract end date is required';
    }
    const spendNum = parseFloat(annualSpend.replace(/[^0-9.]/g, ''));
    if (isNaN(spendNum) || spendNum < 0) {
      errs.annualSpend = 'Enter a valid annual spend figure (£)';
    }
    if (discipline === 'Other Specialist Plant / Trade' && !customDiscipline.trim()) {
      errs.customDiscipline = 'Please describe the specialist discipline';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalDiscipline =
      discipline === 'Other Specialist Plant / Trade' && customDiscipline.trim()
        ? customDiscipline.trim()
        : discipline;

    const spendNum = Math.round(parseFloat(annualSpend.replace(/[^0-9.]/g, '')) || 0);

    const payload: Omit<ContractorEntry, 'id'> = {
      contractorName: contractorName.trim() || `${finalDiscipline} Contractor`,
      discipline: finalDiscipline,
      endDate,
      annualSpend: spendNum,
      noticePeriodDays,
      notes: notes.trim() || undefined,
    };

    if (editingContractor && onUpdateContractor) {
      onUpdateContractor(editingContractor.id, payload);
    } else {
      onAddContractor(payload);
    }

    if (!editingContractor) {
      resetForm();
    }
  };

  const setPresetDate = (months: number) => {
    setEndDate(getRelativeIsoDate(months, 28));
    if (errors.endDate) setErrors({ ...errors, endDate: '' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-7 shadow-xs">
      <div className="border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-electric" />
            <span className="text-[11px] tracking-widest text-slate-500 uppercase font-light">
              {editingContractor ? 'Edit Contractor Record' : 'Add Current Contractor / Supplier'}
            </span>
          </div>
          {editingContractor && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Editing</span>
            </button>
          )}
        </div>
        <h3 className="text-lg sm:text-xl font-light text-slate-900 mt-1">
          {editingContractor ? 'Update Agreement Terms' : 'Contract Terms & Discipline Entry'}
        </h3>
        <p className="text-xs text-slate-600 mt-1 font-light leading-relaxed">
          Record each outsourced maintenance provider. We use these dates and notice periods to model
          consolidation windows and identify immediate rollover risks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Discipline & Supplier Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Trade / Discipline <span className="text-rose-500">*</span></span>
            </label>
            <select
              value={discipline}
              onChange={(e) => handleDisciplineChange(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-sm border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-brand-electric focus:border-brand-electric transition-colors"
            >
              {FM_DISCIPLINES.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Contractor / Supplier Name</span>
              <span className="text-[10px] text-slate-400 font-light lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={contractorName}
              onChange={(e) => setContractorName(e.target.value)}
              placeholder="e.g. Apex Air Solutions Ltd"
              className="w-full text-xs px-3 py-2.5 rounded-sm border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-brand-electric focus:border-brand-electric transition-colors placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Custom discipline input if "Other Specialist" */}
        {discipline === 'Other Specialist Plant / Trade' && (
          <div>
            <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1">
              Specify Specialist Trade <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={customDiscipline}
              onChange={(e) => setCustomDiscipline(e.target.value)}
              placeholder="e.g. BMS Controls, Automatic Doors, Smoke Dampers"
              className={`w-full text-xs px-3 py-2.5 rounded-sm border ${
                errors.customDiscipline ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              } text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-brand-electric`}
            />
            {errors.customDiscipline && (
              <p className="text-[11px] text-rose-600 mt-1 font-light">{errors.customDiscipline}</p>
            )}
          </div>
        )}

        {/* Row 2: Contract End Date + Presets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Contract Expiry Date <span className="text-rose-500">*</span></span>
            </label>
            {/* Quick date preset helpers */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 font-light mr-1">Quick pick:</span>
              <button
                type="button"
                onClick={() => setPresetDate(3)}
                className="px-1.5 py-0.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +3m
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(6)}
                className="px-1.5 py-0.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +6m
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(12)}
                className="px-1.5 py-0.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +12m
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(24)}
                className="px-1.5 py-0.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +24m
              </button>
            </div>
          </div>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              if (errors.endDate) setErrors({ ...errors, endDate: '' });
            }}
            className={`w-full text-xs px-3 py-2.5 rounded-sm border ${
              errors.endDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
            } text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-electric`}
          />
          {errors.endDate && <p className="text-[11px] text-rose-600 mt-1 font-light">{errors.endDate}</p>}
        </div>

        {/* Row 3: Spend (£) & Notice Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <PoundSterling className="w-3.5 h-3.5 text-slate-400" />
              <span>Approx. Annual Spend (£) <span className="text-rose-500">*</span></span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-normal">£</span>
              <input
                type="number"
                min="0"
                step="500"
                value={annualSpend}
                onChange={(e) => {
                  setAnnualSpend(e.target.value);
                  if (errors.annualSpend) setErrors({ ...errors, annualSpend: '' });
                }}
                placeholder="15000"
                className={`w-full text-xs pl-7 pr-3 py-2.5 rounded-sm border ${
                  errors.annualSpend ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                } text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-brand-electric tabular-nums`}
              />
            </div>
            {errors.annualSpend && (
              <p className="text-[11px] text-rose-600 mt-1 font-light">{errors.annualSpend}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Required Notice Period</span>
            </label>
            <select
              value={noticePeriodDays}
              onChange={(e) => setNoticePeriodDays(Number(e.target.value))}
              className="w-full text-xs px-3 py-2.5 rounded-sm border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-brand-electric transition-colors"
            >
              {NOTICE_PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Notes (Optional) */}
        <div>
          <label className="block text-xs font-normal text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Contract Scope / Site Notes</span>
            <span className="text-[10px] text-slate-400 font-light lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Covers Head Office & Regional Depot; includes out-of-hours callouts"
            className="w-full text-xs px-3 py-2 rounded-sm border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-brand-electric placeholder:text-slate-400 font-light"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-graphite hover:bg-slate-800 text-white text-xs font-normal rounded-sm shadow-xs transition-all cursor-pointer"
          >
            {editingContractor ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Changes to Contractor</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-brand-electric-bright" />
                <span>Add Contractor to Audit</span>
              </>
            )}
          </button>

          {editingContractor && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-normal rounded-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {!editingContractor && (
            <span className="text-[11px] text-slate-500 font-light">
              Notice deadlines and rollover alerts compute automatically.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
