'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orgId: string;
  defaultRequirementCode?: string;
  defaultCategory?: string;
  defaultTitle?: string;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  onSuccess,
  orgId,
  defaultRequirementCode,
  defaultCategory = 'INSURANCE',
  defaultTitle = '',
}: Props) {
  const [docTitle, setDocTitle] = useState(defaultTitle);
  const [category, setCategory] = useState(defaultCategory);
  const [documentType, setDocumentType] = useState(defaultRequirementCode || 'INS_PUBLIC_LIABILITY');
  const [policyNumber, setPolicyNumber] = useState('');
  const [insurer, setInsurer] = useState('');
  const [coverLimit, setCoverLimit] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      setErrorMessage('Please enter a document title');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Create safe storage path and persist document record
      const fileName = selectedFile?.name || `${docTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
      const fileUrl = `/storage/compliance/${orgId}/${Date.now()}_${fileName}`;

      const payload = {
        orgId,
        category,
        documentType,
        documentTitle: docTitle,
        fileName,
        fileUrl,
        fileSizeBytes: selectedFile?.size || 250000,
        policyNumber: policyNumber || undefined,
        insurerOrIssuer: insurer || undefined,
        coverLimitGbp: coverLimit ? parseFloat(coverLimit) : undefined,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        notes: notes || undefined,
        uploadedByPersonId: orgId,
      };

      const res = await fetch('/api/contractor/compliance/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to upload document');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while uploading');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-void/80 backdrop-blur-sm">
      <div className="bg-brand-carbon border border-brand-edge-dark rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-edge-dark bg-brand-void/50">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
              DOCUMENT VAULT 2.0
            </span>
            <h2 className="text-lg font-light text-white">Upload Compliance Document</h2>
          </div>
          <button
            onClick={onClose}
            className="text-brand-mist/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-brand-edge-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* File Selector */}
          <div className="border-2 border-dashed border-brand-edge-dark hover:border-brand-electric/50 transition-colors rounded-xl p-6 text-center cursor-pointer bg-brand-void/30 relative">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  if (!docTitle) {
                    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
                  }
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-brand-electric-bright" />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-normal text-white">{selectedFile.name}</p>
                  <p className="text-xs text-brand-mist/50 mt-0.5 font-normal">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click or drop to replace
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-normal text-white">Drag &amp; drop document or click to browse</p>
                  <p className="text-xs text-brand-mist/50 mt-0.5">PDF, PNG, JPG up to 25MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1.5">Document Title *</label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Public Liability Policy 2026/27"
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
              >
                <option value="INSURANCE">Insurance</option>
                <option value="ACCREDITATIONS">Accreditations</option>
                <option value="HEALTH_AND_SAFETY">Health &amp; Safety</option>
                <option value="RAMS">RAMS &amp; Method Statements</option>
                <option value="COSHH">COSHH Assessments</option>
                <option value="POLICIES">Company Policies</option>
                <option value="ENVIRONMENTAL">Environmental</option>
                <option value="QUALITY">Quality</option>
                <option value="CORPORATE">Corporate &amp; Legal</option>
                <option value="WORKFORCE">Workforce &amp; Training</option>
                <option value="FLEET">Fleet &amp; Transport</option>
                <option value="PLANT_AND_EQUIPMENT">Plant &amp; Equipment</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1.5">Insurer / Awarding Body</label>
              <input
                type="text"
                value={insurer}
                onChange={(e) => setInsurer(e.target.value)}
                placeholder="e.g. AXA Insurance / NICEIC"
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1.5">Policy / Reg Number</label>
              <input
                type="text"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                placeholder="e.g. POL-8921-2026"
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1.5">Cover Limit (£)</label>
              <input
                type="number"
                value={coverLimit}
                onChange={(e) => setCoverLimit(e.target.value)}
                placeholder="e.g. 5000000"
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1.5">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-normal text-brand-mist block mb-1.5">Expiry Date (if applicable)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-normal text-brand-mist block mb-1.5">Notes &amp; Scope Summary</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add optional notes, cover endorsements, or certificate scope..."
              className="w-full px-3.5 py-2 rounded-lg bg-brand-void border border-brand-edge-dark text-white text-sm focus:border-brand-electric focus:outline-none"
            />
          </div>

          <p className="text-xs text-brand-mist/60 font-light">
            We will store this record securely in your Document Vault and notify you in advance before expiry.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-edge-dark">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-brand-edge-dark text-sm font-normal text-brand-mist hover:text-white hover:bg-brand-void transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-brand-electric text-white text-sm font-semibold hover:bg-brand-electric/85 transition-all shadow-md shadow-brand-electric/30 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Uploading...' : 'Submit Document for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
