import React from 'react';
import type { Metadata } from 'next';
import { LEGAL_POLICIES, getPolicyTocItems } from '@/lib/legal/legal-content-registry';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { LegalCallout } from '@/components/legal/LegalCallout';
import { ComprehensiveComplaintForm } from '@/components/legal/ComprehensiveComplaintForm';
import {
  Wrench,
  Truck,
  CreditCard,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Eye,
  Lock,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Commercial Complaints & Dispute Resolution Centre | EntireFM',
  description: 'Formal complaints intake, service issue resolution, contractor conduct, billing reviews, and statutory escalation procedures for EntireFM clients and partners.',
  alternates: {
    canonical: 'https://www.entirefm.com/legal/complaints',
  },
};

export default function ComplaintsResolutionPage() {
  const policy = LEGAL_POLICIES['complaints'];
  const tocItems = [
    { id: 'intake-form', title: '1. Electronic Complaint Submission Form' },
    { id: 'category-routing', title: '2. Issue Categorisation & Responsible Teams' },
    { id: 'three-stage-procedure', title: '3. Three-Stage Resolution Procedure' },
    { id: 'service-commitments', title: '4. Service Standards & Response Windows' },
    { id: 'independent-escalation', title: '5. External & Statutory Escalation Pathways' },
  ];

  const relatedPolicies = policy.relatedSlugs
    .map((rSlug) => LEGAL_POLICIES[rSlug])
    .filter(Boolean)
    .map((p) => ({
      title: p.title,
      href: `/legal/${p.slug}`,
      description: p.summary,
    }));

  return (
    <LegalLayout
      title="Commercial Complaints & Dispute Resolution Centre"
      eyebrow="Clients & Commercial Terms"
      categorySlug="clients"
      categoryTitle="Clients & Commercial Terms"
      summary="Structured complaints intake, statutory routing, and three-stage dispute resolution procedure for commercial clients, building occupants, and supply chain partners."
      effectiveDate="2026-01-01"
      version="2026.1"
      tocItems={tocItems}
      relatedPolicies={relatedPolicies}
      keyTakeaways={[
        'Unified intake form supporting Service, Contractor, Billing, H&S, Data Privacy, AI, Accessibility, and Whistleblowing.',
        'Generates an official tracking reference with timestamped audit logging.',
        'Strictly routes sensitive Speak Up matters to Independent Directors with restricted access.',
        'Three-stage escalation: Stage 1 Operational Review, Stage 2 Executive Review, Stage 3 Independent Mediation.',
      ]}
    >
      {/* 1. Interactive Complaint Submission Form */}
      <section id="intake-form" className="scroll-mt-28 space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-xl font-light text-slate-900 sm:text-2xl">
            1. Electronic Complaint Submission Form
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete the formal intake form below. Your submission will be assigned a unique case tracking reference and automatically routed to the designated compliance department.
          </p>
        </div>

        <div className="my-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
          <ComprehensiveComplaintForm />
        </div>
      </section>

      {/* 2. Issue Categorisation & Routing */}
      <section id="category-routing" className="scroll-mt-28 space-y-4">
        <h2 className="text-xl font-light text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          2. Issue Categorisation & Responsible Teams
        </h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          To ensure impartial, rapid, and competent handling, every complaint is directed to a specialized internal investigation unit:
        </p>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <div className="flex items-center gap-2 font-light text-slate-900">
              <Wrench className="h-4 w-4 text-blue-600" />
              Service & Maintenance Delivery
            </div>
            <p className="text-slate-600">
              Investigated by: <strong>Operations Helpdesk & Regional Account Management</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <div className="flex items-center gap-2 font-light text-slate-900">
              <Truck className="h-4 w-4 text-amber-600" />
              Contractor Conduct & Workmanship
            </div>
            <p className="text-slate-600">
              Investigated by: <strong>Supply Chain Compliance & Vetting Team</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <div className="flex items-center gap-2 font-light text-slate-900">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              Billing & Commercial Rates
            </div>
            <p className="text-slate-600">
              Investigated by: <strong>Commercial Management & Finance Directorate</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <div className="flex items-center gap-2 font-light text-slate-900">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Health, Safety & Asbestos
            </div>
            <p className="text-slate-600">
              Investigated by: <strong>Head of QHSE & Safety Officers (RIDDOR Assessment)</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <div className="flex items-center gap-2 font-light text-slate-900">
              <ShieldAlert className="h-4 w-4 text-indigo-600" />
              Data Protection & UK GDPR
            </div>
            <p className="text-slate-600">
              Investigated by: <strong>Data Protection Officer (Statutory 30-Day Timeline)</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1">
            <div className="flex items-center gap-2 font-light text-slate-900">
              <Lock className="h-4 w-4 text-slate-900" />
              Whistleblowing / Speak Up
            </div>
            <p className="text-slate-600">
              Investigated by: <strong>Independent Directors (Restricted Access Shield)</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Three-Stage Resolution Procedure */}
      <section id="three-stage-procedure" className="scroll-mt-28 space-y-4">
        <h2 className="text-xl font-light text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          3. Three-Stage Resolution Procedure
        </h2>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="rounded-xl border border-slate-200 p-5 bg-white space-y-2">
            <h3 className="text-base font-light text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 text-xs font-light">1</span>
              Stage 1: Operational Review & Root Cause Analysis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upon receiving your complaint, the designated department head will review all site telemetry, work order notes, attendance timestamps, and supplier records. Where appropriate, an operative callback, remedial visit, or billing credit will be issued promptly with a written explanation.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 bg-white space-y-2">
            <h3 className="text-base font-light text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 text-xs font-light">2</span>
              Stage 2: Director-Level Executive Escalation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you remain dissatisfied with the Stage 1 outcome, you may request an executive escalation. An executive Director who was not involved in the original operational delivery will conduct a comprehensive contract and governance review and issue a formal written Final Decision.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 bg-white space-y-2">
            <h3 className="text-base font-light text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-800 text-xs font-light">3</span>
              Stage 3: Independent Mediation & Alternative Dispute Resolution
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an amicable agreement cannot be reached following Stage 2, parties may mutually agree to explore formal independent alternative dispute resolution or professional mediation prior to initiating formal litigation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Service Standards */}
      <section id="service-commitments" className="scroll-mt-28 space-y-4">
        <h2 className="text-xl font-light text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          4. Service Standards & Response Windows
        </h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          We maintain transparent governance timelines across all received complaints:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li><strong>Written Acknowledgment:</strong> Issued to your registered email within 2 business days (1 business day for Health & Safety hazards).</li>
          <li><strong>Investigation Target:</strong> Standard commercial matters are targeted for substantive resolution within 7 to 10 business days.</li>
          <li><strong>Statutory Data Protection:</strong> Handled strictly within the statutory 1-month window under UK GDPR Article 12(3).</li>
        </ul>
      </section>

      {/* 5. External Escalation */}
      <section id="independent-escalation" className="scroll-mt-28 space-y-4">
        <h2 className="text-xl font-light text-slate-900 sm:text-2xl border-b border-slate-100 pb-2">
          5. External & Statutory Escalation Pathways
        </h2>

        <LegalCallout type="statutory" title="Supervisory & Regulatory Authorities">
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            <li><strong>Data Protection & Privacy:</strong> Information Commissioner’s Office (ICO) — ico.org.uk | 0303 123 1113</li>
            <li><strong>Workplace Health & Safety:</strong> Health and Safety Executive (HSE) — hse.gov.uk | 0300 003 1747</li>
            <li><strong>Whistleblowing / Protected Disclosures:</strong> Protect (Whistleblowing Charity) — protect-advice.org.uk | 020 3117 2520</li>
            <li><strong>Commercial Contract Dispute:</strong> Independent Alternative Dispute Resolution (ADR) or Mediation</li>
          </ul>
        </LegalCallout>
      </section>

    </LegalLayout>
  );
}
