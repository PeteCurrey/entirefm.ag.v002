'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  AlertOctagon,
  Wrench,
  DollarSign,
} from 'lucide-react';
import { SubmittedFormRecord } from '@/server/contractor/digital-forms-engine';

interface Props {
  initialForms: SubmittedFormRecord[];
}

export function AdminFormsReviewClient({ initialForms }: Props) {
  const [forms, setForms] = useState<SubmittedFormRecord[]>(initialForms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = forms.filter((f) => {
    if (selectedCategory !== 'ALL' && f.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        f.id.toLowerCase().includes(q) ||
        f.templateTitle.toLowerCase().includes(q) ||
        (f.workOrderNumber && f.workOrderNumber.toLowerCase().includes(q)) ||
        f.operativeName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalCount = forms.length;
  const variationsCount = forms.filter((f) => f.category === 'VARIATION_REQUEST').length;
  const defectsCount = forms.filter((f) => f.category === 'DEFECT_REPORT').length;
  const incidentsCount = forms.filter((f) => f.category === 'INCIDENT_ACCIDENT').length;

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">TOTAL SUBMISSIONS</span>
          <div className="text-2xl font-light text-slate-900">{totalCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Live Field Records</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">VARIATION REQUESTS</span>
          <div className="text-2xl font-light text-cyan-600">{variationsCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Pending Authorisation</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">DEFECT NOTIFICATIONS</span>
          <div className="text-2xl font-light text-amber-600">{defectsCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Asset Remedials</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-1">
          <span className="text-[10px] font-normal uppercase text-slate-400">SAFETY &amp; RIDDOR</span>
          <div className="text-2xl font-light text-rose-600">{incidentsCount}</div>
          <span className="text-[10.5px] font-normal text-slate-500">Safety Escalations</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search forms by record ID, operative, work order..."
            className="w-full pl-9 pr-3 py-1.5 rounded border border-slate-200 text-xs font-normal focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-normal">
          <span className="text-slate-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1.5 rounded border border-slate-200 bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="SERVICE_REPORT">Service Reports</option>
            <option value="VARIATION_REQUEST">Variation Requests</option>
            <option value="DEFECT_REPORT">Defect Reports</option>
            <option value="INCIDENT_ACCIDENT">Incidents / Near Misses</option>
            <option value="PLANT_INSPECTION">Plant &amp; Tool Inspections</option>
            <option value="TOOLBOX_TALK">Toolbox Talks</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-normal border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px]">
                <th className="py-3 px-4">Form Ref</th>
                <th className="py-3 px-4">Template Title</th>
                <th className="py-3 px-4">Operative &amp; Work Order</th>
                <th className="py-3 px-4">Status &amp; Flags</th>
                <th className="py-3 px-4 text-right">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No submitted field form records found.
                  </td>
                </tr>
              ) : (
                filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {f.id}
                      {f.riddorReviewRequired && (
                        <span className="ml-2 px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[9.5px]">
                          RIDDOR REVIEW
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      <span className="font-semibold block">{f.templateTitle}</span>
                      <span className="text-[10.5px] text-slate-500 block">{f.category}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium block">{f.operativeName}</span>
                      <span className="text-[10.5px] text-slate-500 block">{f.workOrderNumber || 'General Form'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px]">
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {new Date(f.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
