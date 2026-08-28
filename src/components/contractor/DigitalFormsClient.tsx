'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Upload,
  User,
  Wrench,
  AlertOctagon,
  X,
} from 'lucide-react';
import {
  CANONICAL_FORM_TEMPLATES,
  FormTemplateDefinition,
  SubmittedFormRecord,
} from '@/server/contractor/digital-forms-engine';

interface Props {
  initialForms: SubmittedFormRecord[];
  contractorOrgId: string;
}

export function DigitalFormsClient({ initialForms, contractorOrgId }: Props) {
  const [forms, setForms] = useState<SubmittedFormRecord[]>(initialForms);
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'SUBMISSIONS'>('TEMPLATES');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateForFill, setSelectedTemplateForFill] = useState<FormTemplateDefinition | null>(null);

  // Form filling state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [workOrderNumber, setWorkOrderNumber] = useState('WO-2026-9812');
  const [signerName, setSignerName] = useState('');
  const [signerRole, setSignerRole] = useState('Site Facilities Manager');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredSubmissions = forms.filter((f) => {
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

  const handleOpenFillModal = (tmpl: FormTemplateDefinition) => {
    setSelectedTemplateForFill(tmpl);
    setFormData({});
    setErrorMsg(null);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateForFill) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contractor/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateForFill.id,
          workOrderNumber: workOrderNumber.trim() || undefined,
          contractorOrgId,
          formData,
          signatureData: selectedTemplateForFill.requiresSignature
            ? {
                signerName: signerName.trim() || 'Site Representative',
                signerRole: signerRole.trim() || 'Client Contact',
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to submit form');

      // Refresh list
      const getRes = await fetch(`/api/contractor/forms?orgId=${encodeURIComponent(contractorOrgId)}`);
      const getData = await getRes.json();
      if (getData.forms) setForms(getData.forms);

      setSelectedTemplateForFill(null);
      setActiveTab('SUBMISSIONS');
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">FORM TEMPLATES</span>
          <p className="text-2xl font-light text-white mt-1">{CANONICAL_FORM_TEMPLATES.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Statutory FM templates</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">SUBMITTED RECORDS</span>
          <p className="text-2xl font-light text-emerald-400 mt-1">{forms.length}</p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Completed field records</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">DEFECTS &amp; REMEDIALS</span>
          <p className="text-2xl font-light text-amber-400 mt-1">
            {forms.filter((f) => f.category === 'DEFECT_REPORT').length}
          </p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Reported on site</span>
        </div>

        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon/60 p-4">
          <span className="text-[10px] font-mono text-brand-mist/50 uppercase">SAFETY INCIDENTS</span>
          <p className="text-2xl font-light text-rose-400 mt-1">
            {forms.filter((f) => f.category === 'INCIDENT_ACCIDENT').length}
          </p>
          <span className="text-[10.5px] text-brand-mist/40 mt-0.5 block">Near misses / incidents</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'TEMPLATES'
                ? 'bg-brand-electric text-white font-medium'
                : 'text-brand-mist hover:text-white hover:bg-brand-carbon'
            }`}
          >
            Digital Form Library ({CANONICAL_FORM_TEMPLATES.length})
          </button>
          <button
            onClick={() => setActiveTab('SUBMISSIONS')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'SUBMISSIONS'
                ? 'bg-brand-electric text-white font-medium'
                : 'text-brand-mist hover:text-white hover:bg-brand-carbon'
            }`}
          >
            Submitted Field Records ({forms.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Form Templates Grid */}
      {activeTab === 'TEMPLATES' ? (
        <div className="space-y-6">
          {/* Rev 4.0 Controlled Field Reports Banner */}
          <div className="rounded-xl border border-indigo-900/50 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-indigo-900/30 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                  ENTIREFM CAFM &bull; REVISION 4.0
                </span>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  Controlled Operational Field Reports (A4 PDF System)
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                MAR 2026 SPEC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* ENT-RJR-01 */}
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-2.5 flex flex-col justify-between hover:border-indigo-500 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">ENT-RJR-01</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Rev 4.0</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">Reactive Job Report</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Arrival/departure, fault diagnosis, labour hours, parts used, defects, and customer sign-off.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch('/api/field/reports', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        templateCode: 'ENT-RJR-01',
                        siteId: 'site-preview-fixture',
                        organisationId: contractorOrgId,
                      }),
                    });
                    const data = await res.json();
                    if (data.instance?.id) {
                      window.location.href = `/engineer/reports/${data.instance.id}`;
                    }
                  }}
                  className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors text-center"
                >
                  Start Reactive Report &rarr;
                </button>
              </div>

              {/* ENT-PPM-01 */}
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-2.5 flex flex-col justify-between hover:border-indigo-500 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">ENT-PPM-01</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Rev 4.0</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">Weekly Fire Alarm Test</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    BS 5839-1 rotational call point inspection, control panel state, sounders, and defect logging.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch('/api/field/reports', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        templateCode: 'ENT-PPM-01',
                        siteId: 'site-preview-fixture',
                        organisationId: contractorOrgId,
                      }),
                    });
                    const data = await res.json();
                    if (data.instance?.id) {
                      window.location.href = `/engineer/reports/${data.instance.id}`;
                    }
                  }}
                  className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors text-center"
                >
                  Start Fire Alarm Test &rarr;
                </button>
              </div>

              {/* ENT-FLS-EL */}
              <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-2.5 flex flex-col justify-between hover:border-indigo-500 transition-colors">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">ENT-FLS-EL</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Rev 4.0</span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">Emergency Lighting Survey</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    BS 5266 asset-building schedule, rapid luminaire walk mode, syncs directly to CAFM asset register.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch('/api/field/reports', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        templateCode: 'ENT-FLS-EL',
                        siteId: 'site-preview-fixture',
                        organisationId: contractorOrgId,
                      }),
                    });
                    const data = await res.json();
                    if (data.instance?.id) {
                      window.location.href = `/engineer/reports/${data.instance.id}`;
                    }
                  }}
                  className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors text-center"
                >
                  Start Luminaire Survey &rarr;
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CANONICAL_FORM_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-5 space-y-3 flex flex-col justify-between hover:border-brand-electric/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-electric-bright font-bold">
                    {tmpl.code} &bull; v{tmpl.version}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand-void text-brand-mist border border-brand-edge-dark text-[10px] font-mono">
                    {tmpl.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">{tmpl.title}</h3>
                <p className="text-xs text-brand-mist/70 font-light leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="pt-3 border-t border-brand-edge-dark/40 flex items-center justify-between">
                <span className="text-[10.5px] font-mono text-brand-mist/50">
                  {tmpl.fields.length} fields {tmpl.requiresSignature && '&bull; Sign-off'}
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenFillModal(tmpl)}
                  className="px-3 py-1.5 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-colors"
                >
                  Fill Form &rarr;
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      ) : (

        /* Tab 2: Submitted Forms Table */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm flex-1">
              <Search className="w-4 h-4 text-brand-mist/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search submitted records by ID, title, operative..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-carbon border border-brand-edge-dark text-white text-xs placeholder:text-brand-mist/40 focus:border-brand-electric focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-brand-void/90 border-b border-brand-edge-dark text-brand-mist/60 uppercase text-[10px]">
                    <th className="py-3 px-4">Record Ref</th>
                    <th className="py-3 px-4">Form Template</th>
                    <th className="py-3 px-4">Operative &amp; Work Order</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-edge-dark/30">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-brand-mist/50 font-sans text-xs">
                        No submitted digital form records found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((f) => (
                      <tr key={f.id} className="hover:bg-brand-edge-dark/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          {f.id}
                          {f.riddorReviewRequired && (
                            <span className="ml-2 px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9.5px]">
                              RIDDOR FLAG
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-white">
                          <span className="font-medium block">{f.templateTitle}</span>
                          <span className="text-[10px] text-brand-mist/50 block">{f.category}</span>
                        </td>
                        <td className="py-3 px-4 text-brand-mist">
                          <span className="text-white block">{f.operativeName}</span>
                          <span className="text-[10.5px] text-brand-mist/50 block">{f.workOrderNumber || 'General Form'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                            {f.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-brand-mist/60">
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
      )}

      {/* Dynamic Form Fill Modal */}
      {selectedTemplateForFill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-edge-dark bg-brand-void/50">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
                  {selectedTemplateForFill.code} &bull; v{selectedTemplateForFill.version}
                </span>
                <h2 className="text-base font-light text-white">{selectedTemplateForFill.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTemplateForFill(null)}
                className="text-brand-mist/60 hover:text-white p-1 rounded-lg hover:bg-brand-edge-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="text-brand-mist/70 block mb-1 font-sans">Work Order Reference</label>
                <input
                  type="text"
                  value={workOrderNumber}
                  onChange={(e) => setWorkOrderNumber(e.target.value)}
                  placeholder="e.g. WO-2026-9812"
                  className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-mono text-xs focus:border-brand-electric focus:outline-none"
                />
              </div>

              {selectedTemplateForFill.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="text-brand-mist/70 block font-sans">
                    {field.label} {field.required && '*'}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-xs font-mono focus:border-brand-electric focus:outline-none"
                    >
                      <option value="">-- Select option --</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={field.id}
                        checked={!!formData[field.name]}
                        onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                        className="rounded border-brand-edge-dark bg-brand-void text-brand-electric focus:ring-0"
                      />
                      <label htmlFor={field.id} className="text-white font-sans text-xs cursor-pointer">
                        Confirmed / Yes
                      </label>
                    </div>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white font-sans text-xs focus:border-brand-electric focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {selectedTemplateForFill.requiresSignature && (
                <div className="p-4 rounded-xl border border-brand-edge-dark bg-brand-void space-y-3 pt-3">
                  <span className="text-[11px] font-bold text-white uppercase block">
                    Site Representative Sign-Off
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-brand-mist/70 block mb-1">Representative Name *</label>
                      <input
                        type="text"
                        required
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="e.g. Robert Vance"
                        className="w-full p-2 rounded bg-brand-carbon border border-brand-edge-dark text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-brand-mist/70 block mb-1">Representative Role</label>
                      <input
                        type="text"
                        value={signerRole}
                        onChange={(e) => setSignerRole(e.target.value)}
                        placeholder="Building Manager"
                        className="w-full p-2 rounded bg-brand-carbon border border-brand-edge-dark text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-brand-edge-dark">
                <button
                  type="button"
                  onClick={() => setSelectedTemplateForFill(null)}
                  className="px-4 py-2 rounded-lg border border-brand-edge-dark text-brand-mist hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-brand-electric hover:bg-brand-electric/85 text-white font-bold disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Digital Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
