'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Vacancy, DepartmentCode, WorkingArrangement, ContractType, VacancyStatus, CandidateMatchResult } from '@/server/careers/types';

interface VacancyEditorProps {
  initialVacancy?: Vacancy;
  isNew?: boolean;
}

const DEPARTMENTS: DepartmentCode[] = [
  'Engineering',
  'Operations',
  'Projects',
  'Technology',
  'Commercial',
  'Finance',
  'Specialist Services',
  'Corporate',
];

const WORKING_ARRANGEMENTS: WorkingArrangement[] = [
  'Field Mobile',
  'On-Site',
  'Hybrid',
  'Remote',
  'Operations Centre',
];

const CONTRACT_TYPES: ContractType[] = [
  'Full-time / Permanent',
  'Full-time / Shift-based',
  'Part-time',
  'Fixed-Term Contract',
  'Subcontract / Specialist',
];

export function VacancyEditorClient({ initialVacancy, isNew = false }: VacancyEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Vacancy>>(
    initialVacancy || {
      title: '',
      reference: `EFM-${Date.now().toString().slice(-4)}`,
      department: 'Engineering',
      location: '',
      workingArrangement: 'Field Mobile',
      contractType: 'Full-time / Permanent',
      salaryGuide: '',
      salaryMin: 40000,
      salaryMax: 48000,
      salaryVisible: true,
      hiringManager: '',
      postedDate: new Date().toISOString().split('T')[0],
      closingDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'DRAFT',
      featured: false,
      summary: '',
      overview: '',
      responsibilities: ['Execute statutory planned preventative maintenance and reactive repairs.', 'Complete mobile work orders via EntireCAFM.'],
      requirements: ['Proven hands-on commercial facilities maintenance experience.', 'Full clean UK driving licence.'],
      qualificationsRequired: ['City & Guilds Level 3 in relevant discipline', '18th Edition BS 7671 (or relevant trade accreditation)'],
      benefits: ['Fully liveried van & fuel card', 'Company pension scheme', 'Continuous funded CPD accreditations'],
    }
  );

  const [matches, setMatches] = useState<CandidateMatchResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch advisory matches if editing existing vacancy
  useEffect(() => {
    if (!isNew && initialVacancy?.id) {
      fetch(`/api/careers/vacancies?id=${initialVacancy.id}&action=matches`)
        .then((res) => res.json())
        .then((data) => {
          if (data.matches) setMatches(data.matches);
        })
        .catch((err) => console.error('Failed to load candidate matches:', err));
    }
  }, [isNew, initialVacancy]);

  const handleChange = (field: keyof Vacancy, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayItemChange = (field: 'responsibilities' | 'requirements' | 'qualificationsRequired' | 'benefits', index: number, value: string) => {
    setFormData((prev) => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: 'responsibilities' | 'requirements' | 'qualificationsRequired' | 'benefits') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ''],
    }));
  };

  const removeArrayItem = (field: 'responsibilities' | 'requirements' | 'qualificationsRequired' | 'benefits', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: VacancyStatus) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const payload = {
        ...formData,
        ...(overrideStatus ? { status: overrideStatus } : {}),
      };

      const res = await fetch('/api/careers/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? payload : { id: initialVacancy?.id, data: payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save vacancy.');
      }

      setSaveSuccess(true);
      if (isNew && data.vacancy?.id) {
        router.push(`/admin/careers/vacancies/${data.vacancy.id}/edit`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving vacancy.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E5] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/careers/vacancies"
            className="p-2 rounded border border-[#E8E8E5] bg-white text-[#6D6D68] hover:text-[#111111]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-medium tracking-wider uppercase text-[#6D6D68]">
                {isNew ? 'CREATE NEW VACANCY' : `EDIT: ${initialVacancy?.reference}`}
              </span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-[#111111]">
              {formData.title || (isNew ? 'Untitled Vacancy' : initialVacancy?.title)}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-normal mr-2">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          {!isNew && formData.slug && (
            <Link
              href={`/careers/${formData.slug}`}
              target="_blank"
              className="px-3 py-2 text-xs rounded border border-[#E8E8E5] bg-white text-[#111111] hover:bg-[#F9F9F8] flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Link>
          )}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'DRAFT')}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs rounded border border-[#E8E8E5] bg-white text-[#6D6D68] hover:text-[#111111] hover:bg-[#F9F9F8]"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'ACTIVE')}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-normal text-white bg-[#111111] hover:bg-[#222222] rounded flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Vacancy</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-normal flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Core Info Card */}
          <div className="p-6 rounded border border-[#E8E8E5] bg-white space-y-4 shadow-xs">
            <h2 className="text-sm font-medium text-[#111111]">Job Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Commercial M&E Mobile Engineer"
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Reference Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.reference || ''}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111] font-normal"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.department || 'Engineering'}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Location / Region <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. London & M25 Corridor / Manchester"
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Working Arrangement
                </label>
                <select
                  value={formData.workingArrangement || 'Field Mobile'}
                  onChange={(e) => handleChange('workingArrangement', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {WORKING_ARRANGEMENTS.map((wa) => (
                    <option key={wa} value={wa}>
                      {wa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Contract Type
                </label>
                <select
                  value={formData.contractType || 'Full-time / Permanent'}
                  onChange={(e) => handleChange('contractType', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  {CONTRACT_TYPES.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Hiring Manager / Team Lead
                </label>
                <input
                  type="text"
                  value={formData.hiringManager || ''}
                  onChange={(e) => handleChange('hiringManager', e.target.value)}
                  placeholder="e.g. Head of Engineering"
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                  Salary Guide Display
                </label>
                <input
                  type="text"
                  value={formData.salaryGuide || ''}
                  onChange={(e) => handleChange('salaryGuide', e.target.value)}
                  placeholder="e.g. £42,000 – £48,000 + Van, Fuel Card & Standby"
                  className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="p-6 rounded border border-[#E8E8E5] bg-white space-y-4 shadow-xs">
            <h2 className="text-sm font-medium text-[#111111]">Job Summary &amp; Overview</h2>

            <div>
              <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                Short Summary (Card Preview) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.summary || ''}
                onChange={(e) => handleChange('summary', e.target.value)}
                placeholder="2-3 sentence overview displayed on job listing cards..."
                className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">
                Detailed Role Overview (Job Page)
              </label>
              <textarea
                rows={4}
                value={formData.overview || ''}
                onChange={(e) => handleChange('overview', e.target.value)}
                placeholder="In-depth description of the team, the portfolio, and daily operations..."
                className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {/* Dynamic Array Builders */}
          <div className="p-6 rounded border border-[#E8E8E5] bg-white space-y-6 shadow-xs">
            <h2 className="text-sm font-medium text-[#111111]">Responsibilities &amp; Requirements</h2>

            {/* Responsibilities */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-[#6D6D68]">Key Responsibilities</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('responsibilities')}
                  className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {formData.responsibilities?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayItemChange('responsibilities', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('responsibilities', idx)}
                    className="p-1.5 text-[#8C8C85] hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="space-y-2 pt-4 border-t border-[#E8E8E5]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-[#6D6D68]">Requirements &amp; Experience</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {formData.requirements?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayItemChange('requirements', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', idx)}
                    className="p-1.5 text-[#8C8C85] hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Qualifications */}
            <div className="space-y-2 pt-4 border-t border-[#E8E8E5]">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-[#6D6D68]">Qualifications &amp; Accreditations</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('qualificationsRequired')}
                  className="text-xs text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>
              {formData.qualificationsRequired?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayItemChange('qualificationsRequired', idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('qualificationsRequired', idx)}
                    className="p-1.5 text-[#8C8C85] hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings & Advisory Matching (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Dates */}
          <div className="p-6 rounded border border-[#E8E8E5] bg-white space-y-4 shadow-xs">
            <h2 className="text-sm font-medium text-[#111111]">Publishing &amp; Status</h2>

            <div>
              <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Status</label>
              <select
                value={formData.status || 'DRAFT'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111] focus:outline-none focus:border-[#111111]"
              >
                <option value="DRAFT">DRAFT (Hidden from Public)</option>
                <option value="ACTIVE">ACTIVE (Published Live)</option>
                <option value="CLOSED">CLOSED (No More Applications)</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                id="feat-role"
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="rounded border-[#E8E8E5] text-[#111111] focus:ring-[#111111]"
              />
              <label htmlFor="feat-role" className="text-xs text-[#111111] font-normal cursor-pointer">
                Feature on Public Careers Home
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Posted Date</label>
              <input
                type="date"
                value={formData.postedDate || ''}
                onChange={(e) => handleChange('postedDate', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6D6D68] mb-1">Closing Date</label>
              <input
                type="date"
                value={formData.closingDate || ''}
                onChange={(e) => handleChange('closingDate', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E8E8E5] rounded text-[#111111]"
              />
            </div>
          </div>

          {/* Advisory Candidate Matching Panel */}
          {!isNew && (
            <div className="p-6 rounded border border-[#E8E8E5] bg-white space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EA580C]" />
                  <h2 className="text-sm font-medium text-[#111111]">Talent Pool Matches</h2>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F4F4F2] text-[#555550]">
                  Advisory Only
                </span>
              </div>
              <p className="text-xs text-[#6D6D68] leading-relaxed">
                Deterministic matching based on location, department interests, and certified skills.
              </p>

              {matches.length === 0 ? (
                <div className="p-4 rounded bg-[#F9F9F8] text-center text-xs text-[#6D6D68]">
                  No strong candidates currently in talent pool matching this criteria.
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-[#E8E8E5]">
                  {matches.map((m) => (
                    <div key={m.candidate.id} className="pt-3 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/admin/careers/talent-pool?id=${m.candidate.id}`}
                          className="text-xs font-medium text-[#111111] hover:text-[#2563EB]"
                        >
                          {m.candidate.firstName} {m.candidate.lastName}
                        </Link>
                        <span className="text-xs font-medium text-[#059669]">
                          {m.score}% Match
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6D6D68]">
                        {m.candidate.preferredLocation} · {m.candidate.availability || 'Available'}
                      </div>
                      <div className="space-y-0.5 pt-1">
                        {m.matchReasons.map((r, i) => (
                          <div key={i} className="text-[10.5px] text-[#8C8C85] flex items-center gap-1">
                            <span>•</span> {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
