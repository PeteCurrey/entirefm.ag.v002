'use client';

import React, { useState } from 'react';
import {
  Users,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  FileText,
  X,
} from 'lucide-react';
import { TalentInterestArea } from '@/server/careers/types';

const INTEREST_AREAS: TalentInterestArea[] = [
  'Engineering',
  'Facilities Management',
  'Operations',
  'Helpdesk',
  'Contract Management',
  'Projects',
  'Commercial',
  'Business Development',
  'Finance',
  'Procurement',
  'Technology / Digital',
  'Marketing',
];

export function TalentNetworkSection() {
  const [selectedInterests, setSelectedInterests] = useState<TalentInterestArea[]>(['Engineering']);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleInterest = (area: TalentInterestArea) => {
    setSelectedInterests((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
  };

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

    if (selectedInterests.length === 0) {
      setErrorMessage('Please select at least one area of interest.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Append selected interests
    formData.delete('interestAreas');
    selectedInterests.forEach((interest) => {
      formData.append('interestAreas', interest);
    });

    if (selectedFile) {
      formData.set('cv', selectedFile);
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/careers/talent-pool', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit talent registration.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="talent-network" className="bg-brand-graphite text-white py-20 lg:py-28 border-b border-brand-edge-dark relative">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-brand-pink-light" />
              <span className="text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
                ENTIREFM FUTURE TALENT NETWORK // SPECULATIVE APPLICATIONS
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              Don&rsquo;t see the right role today?
            </h2>

            <p className="text-base sm:text-lg text-brand-mist/80 font-light leading-relaxed max-w-2xl mx-auto">
              Register your interest with our recruitment desk. When new contracts mobilise or matching positions open, we reach out to our Talent Network first.
            </p>
          </div>

          {/* Form Container */}
          <div className="rounded-sm border border-brand-edge-dark bg-brand-carbon p-8 sm:p-10 lg:p-12 shadow-2xl">
            {isSuccess ? (
              /* Success State */
              <div className="py-12 text-center space-y-5 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-white">
                    Thank you for joining our Talent Network
                  </h3>
                  <p className="text-sm font-light text-brand-mist/75 leading-relaxed">
                    Your profile and preferences have been registered securely. Our operations and recruitment team review matching profiles whenever new vacancies or contract mobilisations occur.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setSelectedFile(null);
                    }}
                    className="btn-ghost-light text-xs py-2.5 px-5"
                  >
                    Submit Another Profile
                  </button>
                </div>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-light flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Areas of Interest */}
                <div className="space-y-3">
                  <label className="text-xs font-normal uppercase tracking-wider text-brand-mist/80 block">
                    1. Select Your Areas of Interest <span className="text-brand-pink">*</span>
                  </label>
                  <p className="text-xs font-light text-brand-mist/50">
                    Select all disciplines that align with your background and career goals:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {INTEREST_AREAS.map((area) => {
                      const isSelected = selectedInterests.includes(area);
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleInterest(area)}
                          className={`px-3 py-1.5 rounded-sm text-xs font-light transition-all duration-200 ${
                            isSelected
                              ? 'bg-brand-pink text-white font-normal shadow-sm border border-brand-pink'
                              : 'bg-white/[0.04] text-brand-mist/80 hover:bg-white/[0.08] hover:text-white border border-white/10'
                          }`}
                        >
                          {area} {isSelected ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Personal Details Grid */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <label className="text-xs font-normal uppercase tracking-wider text-brand-mist/80 block">
                    2. Personal &amp; Contact Details
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="talent-firstName" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        First Name <span className="text-brand-pink">*</span>
                      </label>
                      <input
                        id="talent-firstName"
                        name="firstName"
                        type="text"
                        required
                        placeholder="e.g. David"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-lastName" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Last Name <span className="text-brand-pink">*</span>
                      </label>
                      <input
                        id="talent-lastName"
                        name="lastName"
                        type="text"
                        required
                        placeholder="e.g. Miller"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-email" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Email Address <span className="text-brand-pink">*</span>
                      </label>
                      <input
                        id="talent-email"
                        name="email"
                        type="email"
                        required
                        placeholder="e.g. david.miller@example.co.uk"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-phone" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Telephone Number <span className="text-brand-pink">*</span>
                      </label>
                      <input
                        id="talent-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="e.g. 07700 900000"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-location" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Preferred Location / Region <span className="text-brand-pink">*</span>
                      </label>
                      <input
                        id="talent-location"
                        name="preferredLocation"
                        type="text"
                        required
                        placeholder="e.g. Manchester &amp; North West, or London"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-linkedin" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        LinkedIn Profile (Optional)
                      </label>
                      <input
                        id="talent-linkedin"
                        name="linkedInUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Professional Experience & Availability */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <label className="text-xs font-normal uppercase tracking-wider text-brand-mist/80 block">
                    3. Current Experience &amp; Expectations
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="talent-role" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Current Role / Title
                      </label>
                      <input
                        id="talent-role"
                        name="currentRole"
                        type="text"
                        placeholder="e.g. Commercial Electrician / Facilities Coordinator"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-employer" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Current Employer (Optional)
                      </label>
                      <input
                        id="talent-employer"
                        name="currentEmployer"
                        type="text"
                        placeholder="Current company"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-salary" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Salary Expectations (Guide)
                      </label>
                      <input
                        id="talent-salary"
                        name="salaryExpectation"
                        type="text"
                        placeholder="e.g. £40,000 – £45,000"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="talent-avail" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                        Availability / Notice Period
                      </label>
                      <select
                        id="talent-avail"
                        name="availability"
                        defaultValue="1 Month Notice"
                        className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white focus:outline-none focus:border-brand-electric transition-colors"
                      >
                        <option value="Immediate">Immediate</option>
                        <option value="2 Weeks Notice">2 Weeks Notice</option>
                        <option value="1 Month Notice">1 Month Notice</option>
                        <option value="2 Months Notice">2 Months Notice</option>
                        <option value="3 Months Notice">3 Months Notice</option>
                        <option value="Passive / Exploring">Passive / Exploring</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label htmlFor="talent-intro" className="block text-[11px] font-light text-brand-mist/60 mb-1">
                      Brief Summary / What You Are Looking For
                    </label>
                    <textarea
                      id="talent-intro"
                      name="introduction"
                      rows={3}
                      placeholder="Outline your core qualifications (e.g. 18th Edition, F-Gas, IWFM, NEBOSH) and the type of work or contracts you prefer..."
                      className="w-full px-3.5 py-2.5 rounded-sm bg-brand-void border border-brand-edge-dark text-sm font-light text-white placeholder:text-brand-mist/30 focus:outline-none focus:border-brand-electric transition-colors"
                    />
                  </div>
                </div>

                {/* 4. CV Upload */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <label className="text-xs font-normal uppercase tracking-wider text-brand-mist/80 block">
                    4. Upload Your CV / Resume (Optional but Recommended)
                  </label>
                  <div className="border border-dashed border-white/20 rounded-sm p-6 text-center bg-brand-void/50 hover:bg-brand-void transition-colors relative">
                    <input
                      id="cv-upload-talent"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3 text-sm text-brand-electric-bright">
                        <FileText className="w-5 h-5" />
                        <span className="font-normal">{selectedFile.name}</span>
                        <span className="text-xs text-brand-mist/50">
                          ({(selectedFile.size / 1024).toFixed(0)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFile(null);
                          }}
                          className="p-1 text-brand-mist/50 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5 pointer-events-none">
                        <UploadCloud className="w-6 h-6 text-brand-mist/50 mx-auto" />
                        <p className="text-xs font-light text-brand-mist/80">
                          <span className="text-brand-electric-bright font-normal">Click to upload</span> or drag and drop your CV
                        </p>
                        <p className="text-[11px] font-light text-brand-mist/40">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. GDPR Recruitment Consent */}
                <div className="pt-4 border-t border-white/[0.06] space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer text-xs font-light text-brand-mist/80">
                    <input
                      type="checkbox"
                      name="gdprConsent"
                      required
                      className="mt-0.5 rounded border-brand-edge-dark bg-brand-void text-brand-pink focus:ring-brand-pink"
                    />
                    <span>
                      I consent to EntireFM retaining my profile and CV securely in the EntireFM Talent Pool for up to 24 months to be considered for future vacancies and operational opportunities in accordance with the{' '}
                      <a href="/legal/privacy" target="_blank" className="text-brand-electric-bright underline">
                        Privacy Notice
                      </a>
                      . I understand I can request deletion at any time.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-hero-pink w-full py-4 text-xs tracking-wider uppercase font-normal flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Registering Profile...</span>
                    ) : (
                      <>
                        <span>Join EntireFM Talent Network</span>
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
    </section>
  );
}
