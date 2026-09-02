'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Share2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ClientAssessment, ClientAssessmentQuestion, GradeSubmissionResult } from '@/server/academy/types';
import { CertificationBadge } from './CertificationBadge';

interface AssessmentRunnerProps {
  pathSlug: string;
  pathTitle: string;
  targetRole: string;
  passMarkPercent: number;
  onCertificationPassed?: (result: GradeSubmissionResult) => void;
}

export function AssessmentRunner({
  pathSlug,
  pathTitle,
  targetRole,
  passMarkPercent,
  onCertificationPassed,
}: AssessmentRunnerProps) {
  const [assessment, setAssessment] = useState<ClientAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<GradeSubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cooldown countdown
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch sanitized assessment questions
  useEffect(() => {
    let isMounted = true;
    async function loadAssessment() {
      setLoading(true);
      try {
        const res = await fetch(`/api/academy/assessments/${pathSlug}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to load assessment.');
        }
        const data: ClientAssessment = await res.json();
        if (isMounted) {
          setAssessment(data);
          setFetchError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setFetchError(err.message || 'Unable to load assessment questions.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAssessment();
    return () => {
      isMounted = false;
    };
  }, [pathSlug]);

  // Cooldown countdown timer
  useEffect(() => {
    if (!submissionResult?.nextAllowedAttemptAt) return;

    const interval = setInterval(() => {
      const remainingMs = new Date(submissionResult.nextAllowedAttemptAt!).getTime() - Date.now();
      if (remainingMs <= 0) {
        setCooldownRemaining(null);
        clearInterval(interval);
      } else {
        setCooldownRemaining(Math.ceil(remainingMs / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [submissionResult?.nextAllowedAttemptAt]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment) return;

    // Check all questions answered
    const unanswered = assessment.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setSubmitError(`Please answer all questions before submitting (${unanswered.length} remaining).`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/academy/assessments/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathSlug,
          answers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to grade assessment.');
      }

      setSubmissionResult(data);
      if (data.status === 'passed' && onCertificationPassed) {
        onCertificationPassed(data);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForRetake = () => {
    setAnswers({});
    setSubmissionResult(null);
    setSubmitError(null);
  };

  const copyShareLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
        <RefreshCw className="w-8 h-8 text-neutral-400 animate-spin mx-auto mb-4" />
        <p className="text-sm font-light text-neutral-600">Loading assessment questions...</p>
      </div>
    );
  }

  if (fetchError || !assessment) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-sm font-medium text-red-800 mb-1">Assessment Unavailable</p>
        <p className="text-xs text-red-600 font-light">{fetchError || 'Assessment questions could not be loaded.'}</p>
      </div>
    );
  }

  // RESULT VIEW
  if (submissionResult) {
    const isPass = submissionResult.status === 'passed';
    const publicCertUrl = typeof window !== 'undefined' && submissionResult.publicCertId
      ? `${window.location.origin}/academy/verify/${submissionResult.publicCertId}`
      : `/academy/verify/${submissionResult.publicCertId || ''}`;

    const linkedInShareUrl = submissionResult.publicCertId
      ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicCertUrl)}`
      : '';

    if (isPass) {
      return (
        <div className="rounded-2xl border border-emerald-500/30 bg-white p-8 sm:p-12 shadow-lg space-y-8 animate-in fade-in duration-500">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Assessment Passed · Verified Credential Awarded</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-900">
              Congratulations!
            </h2>
            <p className="text-sm font-light text-neutral-600 leading-relaxed">
              You achieved a score of <strong className="font-semibold text-neutral-900">{submissionResult.score}%</strong> (pass mark: {passMarkPercent}%). Your credential is permanently recorded and publicly verifiable.
            </p>
          </div>

          {/* Badge Display */}
          <div className="flex justify-center py-4">
            <CertificationBadge
              targetRole={targetRole}
              pathTitle={pathTitle}
              issueDate={submissionResult.badgeIssuedAt}
              publicCertId={submissionResult.publicCertId}
              size="lg"
            />
          </div>

          {/* Share & Verification Actions */}
          <div className="max-w-lg mx-auto space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {linkedInShareUrl && (
                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-medium shadow-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on LinkedIn</span>
                </a>
              )}

              {submissionResult.publicCertId && (
                <Link
                  href={`/academy/verify/${submissionResult.publicCertId}`}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Public Certificate</span>
                </Link>
              )}
            </div>

            {/* Copy Public Link */}
            {submissionResult.publicCertId && (
              <button
                type="button"
                onClick={() => copyShareLink(publicCertUrl)}
                className="w-full inline-flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors py-1"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Link copied to clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy verification link ({submissionResult.publicCertId})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      );
    }

    // FAILED VIEW
    const minutesLeft = cooldownRemaining ? Math.floor(cooldownRemaining / 60) : 0;
    const secondsLeft = cooldownRemaining ? cooldownRemaining % 60 : 0;

    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 sm:p-10 shadow-sm space-y-8 animate-in fade-in duration-300">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Assessment Result: Below Pass Mark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
            Score: {submissionResult.score}%
          </h2>
          <p className="text-sm font-light text-neutral-600 leading-relaxed">
            The pass mark for this certification is <strong className="font-medium text-neutral-900">{passMarkPercent}%</strong>. Because this credential signifies verified technical competence, badges are never granted automatically.
          </p>
        </div>

        {/* Feedback / Topics to revisit */}
        {submissionResult.feedback.topicsToReview && submissionResult.feedback.topicsToReview.length > 0 && (
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-5 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-700">
              Areas to Revisit in Curriculum:
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-light">
              {submissionResult.feedback.topicsToReview.map((topic, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-1.5 shrink-0" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Retake section */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500 font-light flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            {cooldownRemaining !== null ? (
              <span>
                Retake cooldown active: Available in{' '}
                <strong className="font-mono font-medium text-neutral-900">
                  {minutesLeft}m {secondsLeft}s
                </strong>
              </span>
            ) : (
              <span>Retake cooldown expired. You can retake the assessment now.</span>
            )}
          </div>

          <button
            type="button"
            disabled={cooldownRemaining !== null}
            onClick={handleResetForRetake}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              cooldownRemaining !== null
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  // QUESTIONS FORM
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = assessment.questions.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header bar with progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-light text-neutral-900 tracking-tight">
            Certification Assessment
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Answer all {totalQuestions} questions. Passing score: {passMarkPercent}%.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-neutral-600">
            {answeredCount} of {totalQuestions} answered
          </span>
          <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-pink transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {submitError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-8">
        {assessment.questions.map((q, idx) => {
          const isSelected = !!answers[q.id];
          return (
            <div
              key={q.id}
              className={`p-6 sm:p-8 rounded-xl border transition-all space-y-4 ${
                isSelected
                  ? 'border-neutral-300 bg-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 text-neutral-800 text-xs font-mono font-medium shrink-0">
                  {idx + 1}
                </span>
                <h3 className="text-sm sm:text-base font-normal text-neutral-900 leading-snug">
                  {q.prompt}
                </h3>
              </div>

              <div className="space-y-2.5 pl-9">
                {q.options.map((opt) => {
                  const checked = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer text-xs sm:text-sm font-light transition-colors ${
                        checked
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt.id}
                        checked={checked}
                        onChange={() => handleSelectOption(q.id, opt.id)}
                        className="sr-only"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                          checked
                            ? 'border-white bg-white'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {checked && <span className="w-2 h-2 rounded-full bg-neutral-900" />}
                      </span>
                      <span className="leading-relaxed">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Action */}
      <div className="pt-6 border-t border-neutral-200 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-500 font-light">
          Submissions are graded server-side against the official answer key.
        </p>

        <button
          type="submit"
          disabled={submitting || answeredCount < totalQuestions}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-medium transition-colors ${
            submitting || answeredCount < totalQuestions
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
          }`}
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Grading Submission...</span>
            </>
          ) : (
            <>
              <span>Submit Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
