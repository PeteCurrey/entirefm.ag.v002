import React from 'react';
import type { Metadata } from 'next';
import { LEGAL_POLICIES } from '@/lib/legal/legal-content-registry';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalCallout } from '@/components/legal/LegalCallout';
import { DataRightsRequestForm } from '@/components/legal/DataRightsRequestForm';
import {
  ShieldCheck,
  FileText,
  UserCheck,
  Clock,
  Lock,
  Search,
  Trash2,
  Edit,
  Sliders,
  Share2,
  Ban,
  Cpu,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Subject Rights Centre (UK GDPR) | EntireFM',
  description: 'Exercise your statutory data protection rights under UK GDPR and the Data Protection Act 2018: Subject Access Requests (SAR), rectification, erasure, and objection.',
  alternates: {
    canonical: 'https://www.entirefm.com/legal/data-rights',
  },
};

export default function DataSubjectRightsPage() {
  const policy = LEGAL_POLICIES['privacy'];
  const tocItems = [
    { id: 'rights-form', title: '1. Electronic Rights Submission Portal' },
    { id: 'statutory-rights', title: '2. Your Rights Under UK GDPR' },
    { id: 'timeframes', title: '3. Statutory Timelines & Verification' },
    { id: 'direct-marketing', title: '4. Direct Marketing & B2B Objection' },
    { id: 'supervisory-authority', title: '5. Supervisory Authority & ICO Escalation' },
  ];

  const rawRelated = [
    LEGAL_POLICIES['privacy'],
    LEGAL_POLICIES['data-protection'],
    LEGAL_POLICIES['cookies'],
    LEGAL_POLICIES['ai'],
    LEGAL_POLICIES['subprocessors'],
  ].filter(Boolean);

  const relatedPolicies = rawRelated.map((p) => ({
    title: p.title,
    href: `/legal/${p.slug}`,
    description: p.summary,
  }));

  return (
    <LegalLayout
      title="Data Subject Rights Centre"
      categorySlug="data-privacy"
      categoryTitle="Data Protection & Privacy"
      summary="Exercise your statutory data protection rights under UK GDPR Articles 15 to 22, including Subject Access Requests (SAR), rectification, erasure, and objection."
      effectiveDate="2026-03-01"
      version="2026.1"
      keyTakeaways={[
        'Exercise statutory rights under UK GDPR Articles 15 to 22 free of charge.',
        'Statutory response deadline of one calendar month from receipt and ID verification.',
        'Immediate right to object to direct B2B prospecting outreach and profiling.',
        'Right to request human intervention for any automated triage or allocation logic.',
      ]}
      tocItems={tocItems}
      relatedPolicies={relatedPolicies}
    >
      {/* 1. Portal Form */}
      <section id="rights-form" className="scroll-mt-28 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          1. Electronic Rights Submission Portal
        </h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          Please submit your statutory request using the form below. Your request will be assigned a unique tracking reference (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">SAR-YYYY-XXXXX</code>) and routed directly to our Data Protection Officer.
        </p>

        <DataRightsRequestForm />
      </section>

      {/* 2. Statutory Rights Breakdown */}
      <section id="statutory-rights" className="scroll-mt-28 space-y-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          2. Your Rights Under UK GDPR & Data Protection Act 2018
        </h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          Under UK data protection law, you have specific enforceable rights regarding how EntireFM collects, stores, and processes your personal data:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Search className="h-4 w-4 text-teal-600" />
              Right of Access (Article 15)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Obtain confirmation as to whether your personal data is being processed and receive a copy of your personal data alongside details on purposes, recipients, and retention periods.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Edit className="h-4 w-4 text-teal-600" />
              Right to Rectification (Article 16)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Require EntireFM to correct inaccurate personal data without undue delay or complete incomplete records across CAFM, contractor, and client portals.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Trash2 className="h-4 w-4 text-teal-600" />
              Right to Erasure / Forgotten (Article 17)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Request deletion of personal data where it is no longer necessary for original facilities management purposes and no statutory retention duty (e.g. 6-year financial/statutory safety records) applies.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Sliders className="h-4 w-4 text-teal-600" />
              Right to Restrict Processing (Article 18)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Request the suspension of active processing while data accuracy or lawful basis objections are formally investigated by our compliance team.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Share2 className="h-4 w-4 text-teal-600" />
              Right to Data Portability (Article 20)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive your provided personal data in a structured, commonly used, machine-readable JSON/CSV format for transmission to another service provider where technically feasible.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Ban className="h-4 w-4 text-teal-600" />
              Right to Object (Article 21)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Absolute right to object to direct B2B marketing outreach, email prospecting, and profiling. Processing for marketing ceases immediately upon receipt of your objection.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Cpu className="h-4 w-4 text-teal-600" />
              Automated Decision-Making & AI Profiling Rights (Article 22)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              EntireFM does not conduct fully automated decision-making that produces legal or similarly significant effects. All AI-assisted triage, contractor recommendation, and predictive maintenance schedules remain subject to human operational review. Data subjects retain the right to obtain human intervention and contest any algorithmic recommendation.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Timeframes & Verification */}
      <section id="timeframes" className="scroll-mt-28 space-y-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          3. Statutory Timelines & Identity Verification
        </h2>
        
        <LegalCallout type="statutory" title="Statutory 1-Month Timeframe">
          <p className="text-xs text-slate-700 leading-relaxed">
            In accordance with UK GDPR Article 12(3), EntireFM provides information on action taken on your request without undue delay and at the latest within <strong>one calendar month</strong> of receipt. Where requests are complex or numerous, this period may be extended by up to two further months with formal written notice explaining reasons within the initial month.
          </p>
        </LegalCallout>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-teal-600" />
            Security & Identity Verification
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To safeguard personal data against unlawful disclosure, EntireFM may request reasonable evidence to confirm your identity (such as proof of address or government-issued photo identification) before releasing records. The statutory 1-month clock begins once satisfactory identity verification has been received.
          </p>
        </div>
      </section>

      {/* 4. Direct Marketing Objection */}
      <section id="direct-marketing" className="scroll-mt-28 space-y-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          4. Direct Marketing & B2B Prospecting Objection
        </h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          EntireFM conducts targeted B2B business outreach in accordance with UK GDPR legitimate interests and Privacy and Electronic Communications Regulations (PECR). If you do not wish to receive communications regarding our facilities management services:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Select <strong>Right to Object (Article 21)</strong> in the portal form above;</li>
          <li>Click the unsubscribe link present in every marketing email; or</li>
          <li>Email <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">opt-out@entirefm.com</code> with your domain/email.</li>
        </ul>
        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
          Your email address will be placed on our permanent suppression list within 24 business hours to ensure no future prospecting contacts are initiated.
        </p>
      </section>

      {/* 5. Supervisory Authority */}
      <section id="supervisory-authority" className="scroll-mt-28 space-y-4 pt-6">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          5. Supervisory Authority & ICO Escalation
        </h2>

        <LegalCallout type="statutory" title="Information Commissioner’s Office (ICO)">
          <p className="text-xs text-slate-700 leading-relaxed">
            If you are not satisfied with how EntireFM has responded to your data subject rights request or believe our data processing fails to comply with data protection legislation, you have the right to lodge a complaint directly with the UK supervisory authority:
          </p>
          <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-slate-700">
            <li><strong>Authority:</strong> Information Commissioner’s Office (ICO)</li>
            <li><strong>Website:</strong> <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-teal-700">ico.org.uk/make-a-complaint</a></li>
            <li><strong>Helpline:</strong> 0303 123 1113</li>
            <li><strong>Address:</strong> Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
          </ul>
        </LegalCallout>
      </section>
    </LegalLayout>
  );
}
