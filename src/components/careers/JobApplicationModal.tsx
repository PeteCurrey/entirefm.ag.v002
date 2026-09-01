'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  FileText,
  Briefcase,
  MapPin,
  Lock,
} from 'lucide-react';
import { Vacancy } from '@/server/careers/types';

interface JobApplicationModalProps {
  vacancy: Vacancy | null;
  onClose: () => void;
}

export function JobApplicationModal({ vacancy, onClose }: JobApplicationModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const open = vacancy !== null;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
      setSelectedFile(null);
      setErrorMessage(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!vacancy || !open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be under 10MB.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('vacancyId', vacancy.id);

    if (selectedFile) {
      formData.set('cv', selectedFile);
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Apply for ${vacancy.title}`}
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 pb-10 px-4 bg-brand-void/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-brand-carbon border border-brand-edge-dark rounded-sm shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-brand-graphite border-b border-brand-edge-dark flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-xs bg-white/10 text-brand-electric-bright">
                {vacancy.department}
              </span>
              <span className="text-[10px] font-normal text-brand-mist/50">
                Ref: {vacancy.reference}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white pt-1">
              Apply for {vacancy.title}
            </h2>
            <div className="flex items-center gap-4 text-xs font-light text-brand-mist/60 pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {vacancy.location}
              </span>
              <span>•</span>
              <span>{vacancy.contractType}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm border border-white/10 text-brand-mist/60 hover:text-white hover:border-white/30 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-light text-white">Application Received</h3>
                <p className="text-sm font-light text-brand-mist/80 leading-relaxed">
                  Thank you for applying for the <strong className="font-normal text-white">{vacancy.title}</strong> role. Our hiring team has received your submission and will review your profile against our operational criteria.
                </p>
              </div>
              <div className="pt-4">
                <button onClick={onClose} className="btn-hero-pink text-xs py-2.5 px-6">
                  Close &amp; Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-light flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="app-firstName" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    First Name <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    id="app-firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="Your first name"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="app-lastName" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    Last Name <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    id="app-lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Your last name"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="app-email" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    Email Address <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    id="app-email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.co.uk"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="app-phone" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    Telephone Number <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    id="app-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="07700 900000"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="app-location" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    Your Current Location <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    id="app-location"
                    name="location"
                    type="text"
                    required
                    placeholder="e.g. Manchester, London, Sheffield"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="app-linkedin" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    id="app-linkedin"
                    name="linkedInUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="app-currentRole" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    Current Role (Optional)
                  </label>
                  <input
                    id="app-currentRole"
                    name="currentRole"
                    type="text"
                    placeholder="e.g. M&E Technician"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="app-currentEmployer" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                    Current Employer (Optional)
                  </label>
                  <input
                    id="app-currentEmployer"
                    name="currentEmployer"
                    type="text"
                    placeholder="Current company"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                  />
                </div>
              </div>

              {/* Supporting Note */}
              <div>
                <label htmlFor="app-statement" className="block text-[11px] font-light text-brand-mist/70 mb-1">
                  Cover Note / Supporting Statement
                </label>
                <textarea
                  id="app-statement"
                  name="supportingStatement"
                  rows={3}
                  placeholder="Outline your relevant qualifications (e.g. C&G 2391, 18th Edition, F-Gas) and why you want to join EntireFM..."
                  className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                />
              </div>

              {/* CV Upload */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-light text-brand-mist/70">
                  Upload Your CV / Resume (PDF, DOC, DOCX up to 10MB)
                </label>
                <div className="border border-dashed border-white/20 rounded-sm p-4 text-center bg-brand-void/50 hover:bg-brand-void transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-brand-electric-bright">
                      <FileText className="w-4 h-4" />
                      <span className="font-normal">{selectedFile.name}</span>
                      <span className="text-xs text-brand-mist/50">
                        ({(selectedFile.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 pointer-events-none">
                      <UploadCloud className="w-5 h-5 text-brand-mist/50 mx-auto" />
                      <p className="text-xs font-light text-brand-mist/80">
                        <span className="text-brand-electric-bright font-normal">Click to upload</span> or drag and drop
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* GDPR Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-light text-brand-mist/80">
                  <input
                    type="checkbox"
                    name="gdprConsent"
                    required
                    className="mt-0.5 rounded border-brand-edge-dark bg-brand-void text-brand-pink focus:ring-brand-pink"
                  />
                  <span>
                    I confirm my application details are accurate and consent to EntireFM processing my personal data for recruitment purposes under the{' '}
                    <a href="/legal/privacy" target="_blank" className="text-brand-electric-bright underline">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-sm border border-white/10 text-xs font-light text-brand-mist hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-hero-pink text-xs py-2.5 px-6 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
