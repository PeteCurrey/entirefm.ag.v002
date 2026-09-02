'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import {
  Briefcase,
  Building2,
  MapPin,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export function TemplateJobPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('on_site');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryPeriod, setSalaryPeriod] = useState('per_annum');
  const [seniority, setSeniority] = useState('practitioner');
  const [disciplineInput, setDisciplineInput] = useState('Hard FM & M&E, Building Safety');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [applicationMethod, setApplicationMethod] = useState('in_platform');
  const [externalApplyUrl, setExternalApplyUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdJobSlug, setCreatedJobSlug] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const disciplineTags = disciplineInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const requirements = requirementsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const benefits = benefitsInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/lobby/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          employerName,
          location,
          locationType,
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          salaryMax: salaryMax ? Number(salaryMax) : undefined,
          salaryPeriod,
          seniority,
          disciplineTags,
          description,
          requirements,
          benefits,
          applicationMethod,
          externalApplyUrl: externalApplyUrl || undefined,
          contactEmail: contactEmail || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setCreatedJobSlug(data.job?.slug || data.job?.id || '');
      } else {
        setErrorMessage(data.error || 'Failed to publish job.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error submitting job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist flex flex-col font-sans">
      <main className="flex-1 pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/lobby/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-brand-silver hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Jobs Board
          </Link>

          <div className="rounded-2xl border border-white/10 bg-brand-charcoal/40 p-6 sm:p-10 backdrop-blur-md">
            <div className="mb-8 pb-6 border-b border-white/10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-brand-electric/15 text-brand-electric border border-brand-electric/30 mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                Employer Posting
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Post an FM Opportunity
              </h1>
              <p className="mt-2 text-sm text-brand-silver">
                Reach verified UK facilities managers, M&E engineers, and estate leaders across The Lobby.
              </p>
            </div>

            {success ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h2 className="text-xl font-bold text-white">Job Listing Published!</h2>
                <p className="text-sm text-brand-silver max-w-md mx-auto">
                  Your listing is now live on The Lobby Jobs Board. If your company is a verified EntireFM contractor, your badge has been automatically applied.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Link
                    href={`/lobby/jobs/${createdJobSlug}`}
                    className="px-5 py-2.5 rounded-lg bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric-hover transition"
                  >
                    View Live Listing
                  </Link>
                  <Link
                    href="/lobby/jobs"
                    className="px-5 py-2.5 rounded-lg border border-white/10 text-brand-silver text-xs hover:text-white transition"
                  >
                    Return to Directory
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Mechanical & Electrical Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Employer / Organisation Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex MEP Services"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                    <p className="text-[11px] text-brand-slate mt-1">
                      If your name matches an approved EntireFM contractor, your badge is added automatically.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Location / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manchester & North West"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Location Type
                    </label>
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-brand-mist focus:outline-none focus:border-brand-electric transition"
                    >
                      <option value="on_site">On-Site</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="remote">Remote</option>
                      <option value="mobile_field">Mobile / Field</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Seniority Level
                    </label>
                    <select
                      value={seniority}
                      onChange={(e) => setSeniority(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-brand-mist focus:outline-none focus:border-brand-electric transition"
                    >
                      <option value="technician">Technician / Engineer</option>
                      <option value="practitioner">Practitioner</option>
                      <option value="lead">Lead / Senior</option>
                      <option value="manager">Manager</option>
                      <option value="head_of">Head of Department</option>
                      <option value="director">Director</option>
                      <option value="apprentice">Apprentice / Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Minimum Salary (GBP)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45000"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Maximum Salary (GBP)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 55000"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Discipline Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HVAC, Mechanical, SFG20, Building Safety"
                      value={disciplineInput}
                      onChange={(e) => setDisciplineInput(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Role Description *
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Provide full details of day-to-day duties, portfolio scope, plant responsibilities, and team structure..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Key Requirements (one per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g.&#10;NVQ Level 3 in Mechanical Engineering&#10;F-Gas Cat 1 Certification&#10;Valid UK Driving Licence"
                      value={requirementsInput}
                      onChange={(e) => setRequirementsInput(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Benefits & Perks (one per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g.&#10;Company van with fuel card&#10;25 days holiday + bank holidays&#10;8% company pension contribution"
                      value={benefitsInput}
                      onChange={(e) => setBenefitsInput(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-silver mb-1">
                      Application Route
                    </label>
                    <select
                      value={applicationMethod}
                      onChange={(e) => setApplicationMethod(e.target.value)}
                      className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-brand-mist focus:outline-none focus:border-brand-electric transition"
                    >
                      <option value="in_platform">In-Platform 1-Click Profile Application</option>
                      <option value="external_url">External Company Careers URL</option>
                    </select>
                  </div>

                  {applicationMethod === 'external_url' && (
                    <div>
                      <label className="block text-xs font-medium text-brand-silver mb-1">
                        External Careers URL *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://company.com/careers/apply"
                        value={externalApplyUrl}
                        onChange={(e) => setExternalApplyUrl(e.target.value)}
                        className="w-full bg-brand-void border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-electric transition"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-brand-electric hover:bg-brand-electric-hover text-white text-sm font-medium transition shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Publishing...' : 'Publish Job Listing'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
