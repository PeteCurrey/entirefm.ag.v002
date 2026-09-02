'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Calendar,
  Building2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PublicVerifiedCertification } from '@/server/academy/types';
import { CertificationBadge } from '@/components/academy/CertificationBadge';

interface TemplateBadgeVerificationProps {
  cert: PublicVerifiedCertification | null;
  publicCertId: string;
}

export function TemplateBadgeVerification({
  cert,
  publicCertId,
}: TemplateBadgeVerificationProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formattedIssueDate = cert?.badgeIssuedAt
    ? new Date(cert.badgeIssuedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const linkedInShareUrl = cert
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    : '';

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-neutral-900 flex flex-col font-sans selection:bg-brand-pink selection:text-white">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full space-y-12">
        {/* Navigation back to Academy */}
        <div className="flex items-center justify-between text-xs font-light text-neutral-500 border-b border-neutral-200 pb-4">
          <Link
            href="/lobby/learn/academy"
            className="hover:text-neutral-900 transition-colors inline-flex items-center gap-1.5"
          >
            <span>← EntireFM Academy Registry</span>
          </Link>
          <span className="font-mono text-[11px] text-neutral-400">
            OFFICIAL VERIFICATION ENGINE
          </span>
        </div>

        {/* CASE A: INVALID / NOT FOUND CREDENTIAL */}
        {!cert || !cert.isValid ? (
          <div className="rounded-2xl border border-red-300 bg-white p-10 sm:p-14 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-semibold">
                VERIFICATION FAILURE · RECORD NOT FOUND
              </span>
              <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                Invalid or Unverified Credential
              </h1>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                The credential identifier <strong className="font-mono text-neutral-900">{publicCertId}</strong> does not match any awarded EntireFM Academy certification record.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 max-w-lg mx-auto leading-relaxed">
              If you believe this record should exist, please verify the certificate URL or contact the member directly. Genuine credentials are only issued upon successful completion of rigorous, server-graded evaluations.
            </div>

            <div className="pt-4">
              <Link
                href="/lobby/learn/academy"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                <span>Browse Accredited Learning Paths</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* CASE B: GENUINE, VERIFIED CREDENTIAL */
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Verification Header Banner */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Official EntireFM Verified Credential</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-medium text-neutral-900">
                    Status: Valid &amp; Authentic
                  </h2>
                </div>
              </div>

              <div className="text-right text-xs font-mono text-neutral-500 shrink-0">
                <span>Record ID: </span>
                <span className="font-semibold text-neutral-800">{cert.publicCertId}</span>
              </div>
            </div>

            {/* Main Credential Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Visual Badge */}
              <div className="md:col-span-5 flex justify-center">
                <CertificationBadge
                  targetRole={cert.targetRole}
                  pathTitle={cert.pathTitle}
                  issueDate={cert.badgeIssuedAt}
                  publicCertId={cert.publicCertId}
                  size="lg"
                  className="w-full"
                />
              </div>

              {/* Right Column: Verified Metadata */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-2 border-b border-neutral-100 pb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    AWARDED TO
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-light text-neutral-900 tracking-tight">
                    {cert.recipientName}
                  </h1>
                  {cert.recipientCompany && (
                    <p className="text-xs text-neutral-500 font-light flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{cert.recipientCompany}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-4 text-xs font-light text-neutral-600">
                  <div>
                    <span className="font-medium text-neutral-900 block text-xs uppercase tracking-wider mb-1">
                      Certified Credential:
                    </span>
                    <p className="text-sm text-neutral-800 font-normal">
                      {cert.pathTitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-mono">
                        Target Role
                      </span>
                      <span className="font-medium text-neutral-900 text-xs">
                        {cert.targetRole}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-mono">
                        Issue Date
                      </span>
                      <span className="font-medium text-neutral-900 text-xs">
                        {formattedIssueDate}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-mono">
                      Issuing Authority
                    </span>
                    <span className="font-medium text-neutral-900 text-xs">
                      EntireFM Academy · UK Commercial Property Standards
                    </span>
                  </div>
                </div>

                {/* Social Share & Copy Strip */}
                <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center gap-3">
                  {linkedInShareUrl && (
                    <a
                      href={linkedInShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-medium shadow-xs transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share on LinkedIn</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/academy/${cert.pathSlug}`}
                    className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors ml-auto font-light"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Verification Security Disclaimers */}
            <div className="rounded-xl bg-neutral-100/80 border border-neutral-200 p-6 text-xs text-neutral-500 space-y-2 leading-relaxed">
              <h4 className="font-semibold text-neutral-800 uppercase tracking-wider text-[11px]">
                Cryptographic Identity &amp; Anti-Tamper Guarantee
              </h4>
              <p className="font-light">
                This verification page displays authentic credential data retrieved directly from the EntireFM database. To protect member privacy and integrity, scores, attempt frequencies, and internal member IDs are permanently omitted.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
