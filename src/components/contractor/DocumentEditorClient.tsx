'use client';

/**
 * CLIENT COMPONENT: DocumentEditorClient
 * =====================================
 * Dynamic form renderer and editor for any BusinessTemplateDefinition.
 * Allows drafting, completing, signature capture, photo attachments, and immediate printing with contractor branding.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CheckCircle,
  Printer,
  AlertCircle,
  UserCheck,
  Building,
  Calendar,
  Layers,
  Camera,
  FileText,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { BusinessTemplateDefinition } from '@/server/contractor/template-library';
import { ContractorDocumentRecord } from '@/server/contractor/document-engine';

interface DocumentEditorClientProps {
  template: BusinessTemplateDefinition;
  existingDocument: ContractorDocumentRecord | null;
  contractorOrgId: string;
  onClose: () => void;
  onSaved: (doc: ContractorDocumentRecord) => void;
}

export function DocumentEditorClient({
  template,
  existingDocument,
  contractorOrgId,
  onClose,
  onSaved,
}: DocumentEditorClientProps) {
  const [title, setTitle] = useState(existingDocument?.title || template.title);
  const [clientName, setClientName] = useState(existingDocument?.client_name || '');
  const [siteName, setSiteName] = useState(existingDocument?.site_name || '');
  const [operativeName, setOperativeName] = useState(existingDocument?.operative_name || '');
  const [isEntireFmJob, setIsEntireFmJob] = useState(existingDocument?.is_entirefm_job || false);
  const [formData, setFormData] = useState<Record<string, any>>(existingDocument?.form_data || {});
  const [signatures, setSignatures] = useState<any[]>(existingDocument?.signatures || []);
  const [photos, setPhotos] = useState<any[]>(existingDocument?.photos || []);
  const [clientOptions, setClientOptions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Signature inputs
  const [signerName, setSignerName] = useState('');
  const [signerRole, setSignerRole] = useState<'OPERATIVE' | 'CUSTOMER' | 'SUPERVISOR'>('OPERATIVE');

  // Photo input
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  // Fetch contractor clients to populate dropdown
  useEffect(() => {
    fetch(`/api/contractor/clients?org_id=${encodeURIComponent(contractorOrgId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.clients) {
          setClientOptions(data.clients.map((c: any) => c.client_name));
        }
      })
      .catch((err) => console.warn('[FETCH_CLIENTS_ERR]', err));
  }, [contractorOrgId]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleAddSignature = () => {
    if (!signerName.trim()) return;
    const newSig = {
      name: signerName.trim(),
      role: signerRole,
      signed_at: new Date().toISOString(),
      signature_data: `SIG-${signerName.replace(/\s+/g, '_')}-${Date.now()}`,
    };
    setSignatures([...signatures, newSig]);
    setSignerName('');
  };

  const handleRemoveSignature = (index: number) => {
    setSignatures(signatures.filter((_, i) => i !== index));
  };

  const handleAddPhoto = () => {
    if (!photoUrl.trim()) return;
    const newPhoto = {
      url: photoUrl.trim(),
      caption: photoCaption.trim() || 'Worksite Photo',
      timestamp: new Date().toISOString(),
    };
    setPhotos([...photos, newPhoto]);
    setPhotoUrl('');
    setPhotoCaption('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = async (status: 'DRAFT' | 'COMPLETED' = 'DRAFT') => {
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        id: existingDocument?.id,
        contractor_org_id: contractorOrgId,
        template_id: template.id,
        category: template.category,
        title,
        client_name: clientName,
        site_name: siteName,
        operative_name: operativeName,
        is_entirefm_job: isEntireFmJob,
        status,
        form_data: formData,
        signatures,
        photos,
      };

      const res = await fetch('/api/contractor/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save document');
      }

      onSaved(data.document);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving document');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-void/85 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
      <div className="max-w-3xl w-full bg-brand-carbon border border-brand-edge-dark rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Editor Header */}
        <div className="p-6 border-b border-brand-edge-dark flex items-start justify-between bg-brand-void/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-brand-electric-bright tracking-wider">
                {template.categoryLabel}
              </span>
              {existingDocument?.version && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-void border border-brand-edge-dark text-brand-mist/60 font-mono">
                  v{existingDocument.version}
                </span>
              )}
            </div>
            <h2 className="text-xl font-light text-white">{template.title}</h2>
            <p className="text-xs text-brand-mist/60">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-mist/50 hover:text-white hover:bg-brand-void"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {errorMsg && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Core Metadata */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-void/50 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Document Header &amp; Customer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-brand-mist/60 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-brand-mist/60 block mb-1">Branding Scope</label>
                <select
                  value={isEntireFmJob ? 'ENTIREFM' : 'WHITE_LABEL'}
                  onChange={(e) => setIsEntireFmJob(e.target.value === 'ENTIREFM')}
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                >
                  <option value="WHITE_LABEL">Contractor White-Label (Own Business)</option>
                  <option value="ENTIREFM">EntireFM Partner Network Job</option>
                </select>
              </div>

              <div>
                <label className="text-brand-mist/60 block mb-1">Customer / Client Name</label>
                {clientOptions.length > 0 ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      list="contractor-clients-list"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Select or type customer name..."
                      className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                    />
                    <datalist id="contractor-clients-list">
                      {clientOptions.map((opt) => (
                        <option key={opt} value={opt} />
                      ))}
                    </datalist>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Apex Corporate Ltd"
                    className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                  />
                )}
              </div>

              <div>
                <label className="text-brand-mist/60 block mb-1">Site Location / Address</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g. Unit 4, Gateway Logistics Park"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-brand-mist/60 block mb-1">Lead Operative / Engineer</label>
                <input
                  type="text"
                  value={operativeName}
                  onChange={(e) => setOperativeName(e.target.value)}
                  placeholder="e.g. Dave Miller (Lead Tech)"
                  className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Template Sections & Fields */}
          {template.sections.map((section) => (
            <div key={section.id} className="rounded-xl border border-brand-edge-dark bg-brand-void/30 p-4 space-y-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-brand-edge-dark/50 pb-2">
                {section.title}
              </h3>
              {section.description && <p className="text-[11px] text-brand-mist/60">{section.description}</p>}

              <div className="space-y-3 text-xs">
                {section.fields.map((field) => {
                  const val = formData[field.id] !== undefined ? formData[field.id] : '';

                  if (field.type === 'textarea') {
                    return (
                      <div key={field.id}>
                        <label className="text-brand-mist/70 block mb-1 font-medium">
                          {field.label} {field.required && <span className="text-rose-400">*</span>}
                        </label>
                        <textarea
                          rows={3}
                          value={val}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white placeholder-brand-mist/30"
                        />
                      </div>
                    );
                  }

                  if (field.type === 'select') {
                    return (
                      <div key={field.id}>
                        <label className="text-brand-mist/70 block mb-1 font-medium">
                          {field.label} {field.required && <span className="text-rose-400">*</span>}
                        </label>
                        <select
                          value={val}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white"
                        >
                          <option value="">Select option...</option>
                          {(field.options || []).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (field.type === 'checkbox') {
                    return (
                      <label key={field.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-brand-void/40 border border-brand-edge-dark">
                        <input
                          type="checkbox"
                          checked={!!val}
                          onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                          className="rounded border-brand-edge-dark bg-brand-void text-brand-electric focus:ring-0"
                        />
                        <span className="text-white text-xs">{field.label}</span>
                      </label>
                    );
                  }

                  return (
                    <div key={field.id}>
                      <label className="text-brand-mist/70 block mb-1 font-medium">
                        {field.label} {field.required && <span className="text-rose-400">*</span>}
                      </label>
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                        value={val}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl bg-brand-void border border-brand-edge-dark px-3 py-2 text-white placeholder-brand-mist/30"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ─── DIGITAL SIGNATURES ─────────────────────────────────────── */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-void/40 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-electric" /> Authorisation &amp; Signatures ({signatures.length})
            </h3>

            {signatures.length > 0 && (
              <div className="space-y-2">
                {signatures.map((sig, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-brand-void border border-brand-edge-dark flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-medium block">{sig.name}</span>
                      <span className="text-[10px] text-brand-mist/50">
                        {sig.role} &bull; {new Date(sig.signed_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSignature(idx)}
                      className="text-brand-mist/40 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Signer Full Name"
                className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-1.5 text-white"
              />
              <select
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value as any)}
                className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-1.5 text-white"
              >
                <option value="OPERATIVE">Operative / Engineer</option>
                <option value="CUSTOMER">Customer Sign-Off</option>
                <option value="SUPERVISOR">Site Supervisor</option>
              </select>
              <button
                type="button"
                onClick={handleAddSignature}
                className="px-3 py-1.5 rounded-lg bg-brand-electric/10 border border-brand-electric/30 text-brand-electric-bright hover:bg-brand-electric hover:text-white transition-all text-xs font-medium flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Signature
              </button>
            </div>
          </div>

          {/* ─── PHOTO & EVIDENCE ATTACHMENTS ───────────────────────────── */}
          <div className="rounded-xl border border-brand-edge-dark bg-brand-void/40 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-brand-electric" /> Worksite Evidence &amp; Photo Attachments ({photos.length})
            </h3>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-brand-void border border-brand-edge-dark space-y-1 text-xs relative">
                    <p className="font-medium text-white truncate">{p.caption}</p>
                    <p className="text-[9.5px] text-brand-mist/50 truncate font-mono">{p.url}</p>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 text-brand-mist/40 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Caption (e.g. Distribution Board Complete)"
                className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-1.5 text-white"
              />
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Photo URL or Storage Link"
                className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-1.5 text-white font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-3 py-1.5 rounded-lg bg-brand-electric/10 border border-brand-electric/30 text-brand-electric-bright hover:bg-brand-electric hover:text-white transition-all text-xs font-medium flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Attach Photo
              </button>
            </div>
          </div>
        </div>

        {/* Editor Footer Actions */}
        <div className="p-4 border-t border-brand-edge-dark bg-brand-void/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-brand-edge-dark text-xs text-brand-mist hover:text-white"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave('DRAFT')}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-brand-edge-dark bg-brand-carbon text-xs text-brand-mist hover:text-white transition-all disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('COMPLETED')}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all flex items-center gap-1.5 shadow-md shadow-brand-electric/20 disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Complete &amp; Sign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
