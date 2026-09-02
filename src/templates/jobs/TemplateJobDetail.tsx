'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import {
  Briefcase,
  MapPin,
  Building2,
  ShieldCheck,
  Calendar,
  Banknote,
  ArrowLeft,
  Bookmark,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import type { JobListing } from '@/server/jobs/types';

interface Props {
  job: JobListing;
  relatedJobs: JobListing[];
}

export function TemplateJobDetail({ job, relatedJobs }: Props) {
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isApplying, setIsApplying] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveToggle = async () => {
    try {
      const res = await fetch(`/api/lobby/jobs/${job.id}/save`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIsSaved(data.saved);
      }
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/lobby/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverNote }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setApplicationSuccess(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit application.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSalary = (j: JobListing) => {
    if (!j.salaryMin && !j.salaryMax) return 'Competitive salary';
    const sym = j.salaryCurrency === 'GBP' ? '£' : j.salaryCurrency;
    const period =
      j.salaryPeriod === 'per_annum'
        ? '/yr'
        : j.salaryPeriod === 'per_day'
        ? '/day'
        : '/hr';
    if (j.salaryMin && j.salaryMax) {
      return `${sym}${j.salaryMin.toLocaleString()} – ${sym}${j.salaryMax.toLocaleString()}${period}`;
    }
    return `${sym}${(j.salaryMin || j.salaryMax)?.toLocaleString()}${period}`;
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/lobby/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-brand-silver hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Jobs Board
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Job Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-8 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-xs bg-brand-electric/15 text-brand-electric border border-brand-electric/30 font-medium">
                        {job.seniority.toUpperCase()}
                      </span>
                      {job.isEntireFMVerifiedEmployer && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified EntireFM Contractor
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                      {job.title}
                    </h1>
                    <p className="text-base text-brand-silver mt-1 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-slate" />
                      {job.employerName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveToggle}
                      className={`p-2.5 rounded-lg border transition ${
                        isSaved
                          ? 'bg-brand-electric/20 border-brand-electric text-brand-electric'
                          : 'border-white/10 hover:border-white/20 text-brand-silver hover:text-white'
                      }`}
                      title={isSaved ? 'Saved' : 'Save Job'}
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Key Job Meta Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 text-xs">
                  <div>
                    <p className="text-brand-slate uppercase tracking-wider text-[10px]">Location</p>
                    <p className="text-white font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-slate" />
                      {job.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-slate uppercase tracking-wider text-[10px]">Type</p>
                    <p className="text-white font-medium mt-0.5 capitalize">
                      {job.locationType.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-slate uppercase tracking-wider text-[10px]">Salary Package</p>
                    <p className="text-emerald-400 font-medium mt-0.5">
                      {formatSalary(job)}
                    </p>
                  </div>
                  <div>
                    <p className="text-brand-slate uppercase tracking-wider text-[10px]">Posted</p>
                    <p className="text-white font-medium mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-slate" />
                      {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                {/* Verified Employer Explainer */}
                {job.isEntireFMVerifiedEmployer && (
                  <div className="my-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <h4 className="font-semibold text-emerald-300">Verified EntireFM Contractor Employer</h4>
                      <p className="text-emerald-200/80 mt-0.5">
                        This employer is an approved operating business in EntireFM's contractor network with verified insurance, compliance accreditations, and active service contracts.
                      </p>
                    </div>
                  </div>
                )}

                {/* Role Description */}
                <div className="py-6 space-y-6 text-sm text-brand-mist leading-relaxed">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-2">Role Overview</h3>
                    <div className="whitespace-pre-line">{job.description}</div>
                  </div>

                  {job.requirements.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-white mb-2">Key Requirements & Accreditations</h3>
                      <ul className="space-y-1.5 list-disc list-inside text-brand-silver">
                        {job.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.benefits.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-white mb-2">Benefits & Package</h3>
                      <ul className="space-y-1.5 list-disc list-inside text-brand-silver">
                        {job.benefits.map((ben, idx) => (
                          <li key={idx}>{ben}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Discipline tags */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-brand-slate mb-2">Technical Disciplines</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {job.disciplineTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded text-xs bg-brand-charcoal text-brand-mist border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Application Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sticky top-24 backdrop-blur-md">
                <h3 className="text-lg font-semibold text-white mb-1">Apply for this Role</h3>
                <p className="text-xs text-brand-silver mb-5">
                  {job.applicationMethod === 'external_url'
                    ? 'This employer accepts applications via their external careers portal.'
                    : 'Apply with your verified EntireFM Lobby Member profile in 1 click.'}
                </p>

                {job.applicationMethod === 'external_url' && job.externalApplyUrl ? (
                  <a
                    href={job.externalApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-electric hover:bg-brand-electric-hover text-white font-medium text-sm transition shadow-sm"
                  >
                    <span>Apply on Company Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : applicationSuccess ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white text-sm">Application Submitted!</h4>
                    <p className="text-xs text-brand-silver mt-1">
                      Your profile and cover note have been forwarded to {job.employerName}.
                    </p>
                  </div>
                ) : isApplying ? (
                  <form onSubmit={handleApplicationSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-brand-silver mb-1">
                        Short Cover Note / Introduction
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Briefly explain your relevant FM experience, tickets, or availability..."
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        className="w-full bg-brand-void border border-white/10 rounded-lg p-3 text-xs text-white placeholder-brand-slate focus:outline-none focus:border-brand-electric transition"
                      />
                    </div>

                    <div className="rounded-lg border border-white/5 bg-brand-void/60 p-3 text-[11px] text-brand-slate flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-brand-electric shrink-0" />
                      <span>Applying as your authenticated Lobby profile</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsApplying(false)}
                        className="flex-1 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-brand-silver transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2.5 rounded-lg bg-brand-electric hover:bg-brand-electric-hover text-white text-xs font-medium transition disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Send Application'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsApplying(true)}
                    className="w-full py-3 rounded-xl bg-brand-electric hover:bg-brand-electric-hover text-white font-medium text-sm transition shadow-sm"
                  >
                    Apply with Lobby Profile
                  </button>
                )}

                <div className="mt-6 pt-6 border-t border-white/5 space-y-3 text-xs text-brand-slate">
                  <div className="flex justify-between">
                    <span>Applications received</span>
                    <span className="text-white font-medium">{job.applicationCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role reference</span>
                    <span className="text-white font-mono text-[11px]">{job.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
