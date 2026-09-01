'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  PoundSterling,
  Calendar,
  Briefcase,
  CheckCircle2,
  Award,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JobApplicationModal } from '@/components/careers/JobApplicationModal';
import { Vacancy } from '@/server/careers/types';

interface JobDetailPageClientProps {
  vacancy: Vacancy;
}

export function JobDetailPageClient({ vacancy }: JobDetailPageClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Careers', url: '/careers' },
    { name: vacancy.title, url: `/careers/${vacancy.slug}` },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vacancy.title} | Careers at EntireFM`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-brand-void text-white min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* MAIN CONTENT (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Header Block */}
            <div className="space-y-4 pb-8 border-b border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-normal uppercase tracking-wider px-2.5 py-1 rounded-xs bg-white/10 text-brand-electric-bright">
                  {vacancy.department}
                </span>
                <span className="text-[11px] font-light uppercase tracking-wider px-2.5 py-1 rounded-xs bg-white/[0.04] text-brand-mist/70 border border-white/[0.08]">
                  {vacancy.workingArrangement}
                </span>
                <span className="text-[11px] font-normal text-brand-mist/40 ml-auto">
                  Ref: {vacancy.reference}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
                {vacancy.title}
              </h1>

              {/* Meta row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-sm font-light text-brand-mist/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-pink shrink-0" />
                  <span>{vacancy.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-electric-bright shrink-0" />
                  <span>{vacancy.contractType}</span>
                </div>
                {vacancy.salaryVisible && vacancy.salaryGuide && (
                  <div className="flex items-center gap-2 text-brand-pink-light">
                    <PoundSterling className="w-4 h-4 text-brand-pink shrink-0" />
                    <span>{vacancy.salaryGuide}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white tracking-tight">
                Role Overview
              </h2>
              <p className="text-base font-light text-brand-mist/85 leading-relaxed">
                {vacancy.overview || vacancy.summary}
              </p>
            </div>

            {/* Responsibilities */}
            {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-light text-white tracking-tight">
                  Key Responsibilities
                </h2>
                <ul className="space-y-2.5">
                  {vacancy.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-light text-brand-mist/80 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-pink mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements & Experience */}
            {vacancy.requirements && vacancy.requirements.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-light text-white tracking-tight">
                  What We Look For
                </h2>
                <ul className="space-y-2.5">
                  {vacancy.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-light text-brand-mist/80 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-electric mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications & Accreditations */}
            {vacancy.qualificationsRequired && vacancy.qualificationsRequired.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-light text-white tracking-tight">
                  Required Qualifications &amp; Accreditations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vacancy.qualificationsRequired.map((qual, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-sm bg-brand-carbon border border-brand-edge-dark flex items-center gap-3 text-xs font-light text-brand-mist/90"
                    >
                      <Award className="w-4 h-4 text-brand-pink shrink-0" />
                      <span>{qual}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Package & Benefits */}
            {vacancy.benefits && vacancy.benefits.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-light text-white tracking-tight">
                  Package &amp; Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vacancy.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-sm bg-brand-carbon border border-brand-edge-dark flex items-center gap-3 text-xs font-light text-brand-mist/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Apply CTA on mobile */}
            <div className="pt-6 border-t border-white/[0.08] lg:hidden space-y-4">
              <button
                onClick={() => setModalOpen(true)}
                className="btn-hero-pink w-full py-4 text-xs tracking-wider uppercase font-normal flex items-center justify-center gap-2"
              >
                <span>Apply for this Role</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SIDEBAR (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Apply Card */}
              <div className="rounded-sm border border-brand-edge-dark bg-brand-carbon p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="space-y-2">
                  <span className="text-[10px] font-normal uppercase tracking-wider text-brand-pink block">
                    DIRECT APPLICATION
                  </span>
                  <h3 className="text-xl font-light text-white tracking-tight">
                    Ready to apply?
                  </h3>
                  <p className="text-xs font-light text-brand-mist/70 leading-relaxed">
                    Submit your details and CV directly to our operations and technical recruitment team.
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-hero-pink w-full py-3.5 text-xs tracking-wider uppercase font-normal flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-4 border-t border-white/[0.06] space-y-3 text-xs font-light text-brand-mist/60">
                  <div className="flex items-center justify-between">
                    <span>Closing Date</span>
                    <span className="text-white font-normal">{vacancy.closingDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Working Model</span>
                    <span className="text-white">{vacancy.workingArrangement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Department</span>
                    <span className="text-white">{vacancy.department}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleShare}
                    className="w-full py-2.5 rounded-sm border border-white/10 text-xs font-light text-brand-mist hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Link Copied!' : 'Share Vacancy'}</span>
                  </button>
                </div>
              </div>

              {/* Back to All Roles */}
              <div className="text-center">
                <Link
                  href="/careers#opportunities"
                  className="inline-flex items-center gap-2 text-xs font-light text-brand-mist/60 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>View All Open Vacancies</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <JobApplicationModal
        vacancy={modalOpen ? vacancy : null}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
