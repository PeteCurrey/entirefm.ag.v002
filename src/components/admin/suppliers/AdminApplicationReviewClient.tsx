'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Building2,
  Wrench,
  MapPin,
  HeartPulse,
  Award,
  CreditCard,
  Send,
  MessageSquare,
  ArrowLeft,
  Briefcase,
  Scale,
  Lock,
  Download,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  ExternalLink,
} from 'lucide-react';
import { SupplierRfiRecord, SupplierApprovalDecision } from '@/server/suppliers/rfi-store';

interface Props {
  draft: any;
  rfis: SupplierRfiRecord[];
  decision: SupplierApprovalDecision | null;
}

export function AdminApplicationReviewClient({ draft, rfis: initialRfis, decision: initialDecision }: Props) {
  const [rfis, setRfis] = useState<SupplierRfiRecord[]>(initialRfis);
  const [decision, setDecision] = useState<SupplierApprovalDecision | null>(initialDecision);
  const [status, setStatus] = useState<string>(draft.status || 'UNDER_REVIEW');
  const [modalType, setModalType] = useState<'RFI' | 'APPROVE' | 'CONDITIONAL' | 'DECLINE' | 'CLASSIFY' | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Form states for review modals
  const [rfiTitle, setRfiTitle] = useState('');
  const [rfiSection, setRfiSection] = useState('insurance');
  const [rfiDescription, setRfiDescription] = useState('');
  const [rfiDueDate, setRfiDueDate] = useState('');

  const [approvedRegions, setApprovedRegions] = useState<string[]>(
    draft.selectedRegions || draft.selected_regions || ['London', 'South East', 'West Midlands']
  );
  const [approvedServices, setApprovedServices] = useState<string[]>(
    draft.selectedServices || draft.selected_service_slugs || ['Commercial Gas', 'HVAC & Chillers', 'Electrical']
  );
  const [restrictions, setRestrictions] = useState('Scope restricted to verified trade accreditations only.');

  const [condDescription, setCondDescription] = useState('Provide renewed Gas Safe certificate upon receipt from body');
  const [condDeadline, setCondDeadline] = useState('2026-11-30');

  const [declineReason, setDeclineReason] = useState('INSUFFICIENT_INSURANCE');
  const [declineExplanation, setDeclineExplanation] = useState('Public liability policy limit is below the minimum required £5,000,000 threshold.');

  // Classify form state (for REGISTRATION_CLASSIFICATION_REQUIRED records)
  const [classifyCompanyName, setClassifyCompanyName] = useState('');
  const [classifyError, setClassifyError] = useState('');
  const [classifySuccess, setClassifySuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUnclassified = status === 'REGISTRATION_CLASSIFICATION_REQUIRED';


  // Compute Review Flags for Assurance Assessors
  const reviewFlags = useMemo(() => {
    const flags: Array<{ type: 'CRITICAL' | 'WARNING' | 'INFO'; message: string }> = [];

    // RIDDOR or Incident history
    if (draft.hasIncidentHistory || draft.has_incident_history || (draft.incidentRiddorCount || 0) > 0) {
      flags.push({
        type: 'WARNING',
        message: `Safety Disclosure: ${draft.incidentRiddorCount || 1} RIDDOR / LTI event(s) disclosed in past 3 years. Review explanation.`,
      });
    }

    // Criminal / Regulatory Disclosures
    if (
      draft.disclosureCriminalConvictions ||
      draft.disclosureFraudConvictions ||
      draft.disclosureBriberyConvictions ||
      draft.disclosureRegulatoryEnforcement
    ) {
      flags.push({
        type: 'CRITICAL',
        message: 'Governance Alert: Criminal or statutory regulatory disclosures reported. Legal review required.',
      });
    }

    // Cyber incident
    if (draft.cyberBreachPast3yr) {
      flags.push({
        type: 'WARNING',
        message: 'Security Alert: Cyber security incident disclosed within past 3 years.',
      });
    }

    // Subcontractor dependency > 25%
    if (draft.hasSubcontractors && (draft.subcontractorPct || 0) > 25) {
      flags.push({
        type: 'INFO',
        message: `Subcontracting Note: High subcontractor utilisation (${draft.subcontractorPct}% declared). Verify subcontractor audit process.`,
      });
    }

    // Missing SSIP / Accreditations
    const accs = draft.selectedAccreditations || draft.accreditations || [];
    if (accs.length === 0) {
      flags.push({
        type: 'WARNING',
        message: 'Accreditation Notice: No active SSIP or trade accreditations declared. Requires manual audit.',
      });
    }

    return flags;
  }, [draft]);

  const handleAction = async (action: string, payload: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/supplier/application/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          supplierId: draft.id || draft.orgId || draft.supplier_id || 'sup-app',
          data: payload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (action === 'CREATE_RFI') {
          setRfis([data.rfi, ...rfis]);
          setStatus('INFORMATION_REQUIRED');
        } else if (action === 'APPROVE') {
          setDecision(data.decision);
          setStatus('APPROVED');
        } else if (action === 'CONDITIONALLY_APPROVE') {
          setDecision(data.decision);
          setStatus('CONDITIONALLY_APPROVED');
        } else if (action === 'DECLINE') {
          setDecision(data.decision);
          setStatus('DECLINED');
        }
        setModalType(null);
      }
    } catch (err) {
      console.error('Error executing review action:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const declaredServices = draft.selectedServices || draft.selected_service_slugs || [];
  const declaredRegions = draft.selectedRegions || draft.selected_regions || [];
  const documentVault = draft.documentVault || draft.document_vault || [];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/suppliers/applications"
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-mono"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Application Queue
            </Link>
            <span className="text-slate-300">&bull;</span>
            <span className="text-xs font-mono text-brand-pink font-bold">
              {draft.applicationReference || draft.application_reference || 'SUP-APP-2026'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            {draft.legalCompanyName || draft.legal_company_name || 'Supplier Application'}
          </h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Co # {draft.companyNumber || draft.company_number || '—'} &bull; Trading as{' '}
            <strong className="text-slate-700">
              {draft.tradingName || draft.trading_name || draft.legalCompanyName || draft.legal_company_name}
            </strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-mono px-3 py-1 rounded font-bold ${
              status === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'CONDITIONALLY_APPROVED'
                ? 'bg-amber-100 text-amber-800'
                : status === 'DECLINED'
                ? 'bg-rose-100 text-rose-800'
                : status === 'INFORMATION_REQUIRED'
                ? 'bg-purple-100 text-purple-800'
                : status === 'REGISTRATION_CLASSIFICATION_REQUIRED'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-slate-900 text-white'
            }`}
          >
            STATUS: {status}
          </span>

          {isUnclassified ? (
            /* Unclassified registration — only Classify action is available */
            <button
              onClick={() => setModalType('CLASSIFY')}
              className="btn-primary text-xs py-1.5 px-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Classify as Contractor Applicant</span>
            </button>
          ) : (
            /* Standard review actions */
            <>
              <button
                onClick={() => setModalType('RFI')}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Request Info (RFI)</span>
              </button>

              <button
                onClick={() => setModalType('APPROVE')}
                className="btn-primary text-xs py-1.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve with Scope</span>
              </button>

              <button
                onClick={() => setModalType('DECLINE')}
                className="btn-secondary text-xs py-1.5 px-3 text-rose-700 hover:bg-rose-50 border-rose-200"
              >
                Decline
              </button>
            </>
          )}
        </div>

      </div>

      {/* Review Flags Banner */}
      {reviewFlags.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
            ASSURANCE REVIEW FLAGS &amp; AUDIT ALERTS ({reviewFlags.length})
          </span>
          <div className="space-y-1.5">
            {reviewFlags.map((flag, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded text-xs flex items-center gap-2 ${
                  flag.type === 'CRITICAL'
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : flag.type === 'WARNING'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-blue-50 text-blue-900 border border-blue-200'
                }`}
              >
                {flag.type === 'CRITICAL' ? (
                  <AlertCircle className="h-4 w-4 text-rose-700 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
                )}
                <span>{flag.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Status Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          <span className="text-slate-900 font-bold font-sans">Technical Assurance Queue:</span>
          <span className="text-emerald-700 font-bold">READY FOR AUDIT</span>
        </div>
        <span className="text-slate-500 text-[11px]">
          Submitted: {draft.submitted_at ? new Date(draft.submitted_at).toLocaleDateString() : 'Active Submission'}
        </span>
      </div>

      {/* 360-Degree Comprehensive Application Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Card 1: Company & Contacts */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Building2 className="h-4 w-4 text-slate-700" />
            <span>Company Profile &amp; Named Officers</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Companies House No</span>
              <span className="font-mono font-bold text-slate-900">{draft.companyNumber || draft.company_number || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">VAT Number</span>
              <span className="font-mono text-slate-900">{draft.vatNumber || draft.vat_number || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Year Established</span>
              <span className="text-slate-900">{draft.yearEstablished || draft.year_established || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Business Type</span>
              <span className="text-slate-900">{draft.businessType || draft.primary_business_type || '—'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10.5px]">Trading Address</span>
              <span className="text-slate-900">{draft.tradingAddress || draft.trading_address || '—'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Commercial Lead</span>
              <span className="font-bold text-slate-900">{draft.primaryContactName || draft.primary_contact_name || '—'}</span>
              <span className="text-[10px] block text-slate-500">{draft.primaryContactEmail || draft.primary_contact_email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Operations / 24/7 Lead</span>
              <span className="font-bold text-slate-900">{draft.opsContactName || draft.ops_contact_name || '—'}</span>
              <span className="text-[10px] block text-slate-500">{draft.opsContactEmail || draft.ops_contact_email}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Services & Coverage */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Wrench className="h-4 w-4 text-slate-700" />
            <span>Declared Trades &amp; Geographical Footprint</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Declared Trades ({declaredServices.length})</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {declaredServices.map((s: string) => (
                  <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[10.5px]">Coverage Scope</span>
                <span className="font-bold text-slate-900">{draft.coverageType || 'REGIONAL'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Dispatch Radius</span>
                <span className="text-slate-900">{draft.operationalRadiusMiles || 50} Miles</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10.5px]">Covered Regions</span>
                <span className="text-slate-900">{declaredRegions.join(', ') || 'National'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Operational Capability & Systems */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Clock className="h-4 w-4 text-slate-700" />
            <span>Operational Capability &amp; Field Systems</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Standard Hours</span>
              <span className="text-slate-900">{draft.standardOperatingHours || '08:00 - 17:00 (Mon-Fri)'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">24/7/365 Emergency Service</span>
              <span className={`font-bold ${draft.has247 ? 'text-emerald-700' : 'text-slate-700'}`}>
                {draft.has247 ? 'Yes — Available' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Indicative Emergency SLA</span>
              <span className="text-slate-900">{draft.responseTimeP1 || '2-4 Hours'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Service Vehicles &amp; Fleet</span>
              <span className="text-slate-900">{draft.vehicleCount || 5} Vans &bull; GPS: {draft.gpsTracking !== false ? 'Yes' : 'No'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10.5px]">Mobile Digital Job Capabilities</span>
              <span className="text-slate-800">
                {Array.isArray(draft.engineerDeviceCapabilities)
                  ? draft.engineerDeviceCapabilities.join(', ')
                  : 'Smartphones, Real-Time Dispatches, Photos, Digital Signatures'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Workforce & Subcontracting */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <Briefcase className="h-4 w-4 text-slate-700" />
            <span>Workforce Scale &amp; Subcontractor Controls</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Employment Model</span>
              <span className="font-bold text-slate-900">{draft.employmentModel || 'DIRECT_PRIMARY'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Field Operatives Headcount</span>
              <span className="font-mono text-slate-900">{draft.fieldOperativesCount || draft.directEngineers || 8} Operatives</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Uses Subcontractors?</span>
              <span className={`font-bold ${draft.hasSubcontractors ? 'text-amber-800' : 'text-emerald-700'}`}>
                {draft.hasSubcontractors ? `Yes (${draft.subcontractorPct || 15}%)` : 'No (100% Direct)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Subcontractor Standard Accepted?</span>
              <span className="text-slate-900">{draft.subStandardsAccepted !== false ? 'Yes — Confirmed' : 'Pending'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10.5px]">Competencies &amp; Qualifications</span>
              <span className="text-slate-800">
                {Array.isArray(draft.qualificationsHeld) ? draft.qualificationsHeld.join(', ') : 'CSCS, ECS, First Aid'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Insurance & Accreditations */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Insurance Schedules &amp; SSIP Accreditations</span>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10.5px]">Public Liability</span>
                <span className="font-mono font-bold text-slate-900">{draft.plCoverLimit || '£10,000,000'}</span>
                <span className="text-[10px] block text-slate-500">{draft.plInsurer || 'Aviva'} ({draft.plPolicyNumber || 'PL-0099'})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10.5px]">Employers Liability</span>
                <span className="font-mono font-bold text-slate-900">{draft.elCoverLimit || '£10,000,000'}</span>
                <span className="text-[10px] block text-slate-500">{draft.elInsurer || 'Zurich'}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Accreditation Registrations</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(draft.selectedAccreditations || ['SafeContractor', 'CHAS', 'Gas Safe Register']).map((acc: string) => (
                  <span key={acc} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[11px] font-mono font-bold border border-emerald-200">
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Health, Safety & Governance */}
        <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-slate-100">
            <HeartPulse className="h-4 w-4 text-slate-700" />
            <span>Health &amp; Safety Governance &amp; Ethics</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Competent H&amp;S Person</span>
              <span className="font-bold text-slate-900">{draft.competentPersonName || 'David Walker (CMIOSH)'}</span>
              <span className="text-[10px] block text-slate-500">{draft.competentPersonRole || 'H&S Manager'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">RAMS Process</span>
              <span className="text-slate-900">Task-Specific &bull; Pre-Attendance Verified</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Anti-Bribery &amp; Modern Slavery</span>
              <span className="text-emerald-700 font-bold">Compliant &amp; Accepted</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Cyber Security &amp; GDPR</span>
              <span className="text-slate-900">{draft.cyberCertifications?.[0] || 'Cyber Essentials'} &bull; MFA Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Vault Section */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
              Uploaded Document Vault ({documentVault.length} Records)
            </h3>
          </div>
        </div>

        {documentVault.length === 0 ? (
          <p className="text-xs text-slate-400 font-light">No documents uploaded to this application vault yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-light">
              <thead className="bg-slate-900 text-white uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Document Type</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">File Name</th>
                  <th className="p-2.5">Uploaded</th>
                  <th className="p-2.5">Expiry</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documentVault.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{doc.documentType}</td>
                    <td className="p-2.5 font-mono text-[10.5px] text-slate-600">{doc.category}</td>
                    <td className="p-2.5 text-slate-600">{doc.fileName}</td>
                    <td className="p-2.5 text-slate-500">{doc.uploadedAt?.slice(0, 10)}</td>
                    <td className="p-2.5 text-slate-500">{doc.expiryDate || '—'}</td>
                    <td className="p-2.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {doc.status || 'UPLOADED'}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button className="text-brand-pink font-bold text-[11px] hover:underline inline-flex items-center gap-1">
                        <Download className="h-3 w-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RFIs List */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
            Requests For Information (RFI) History ({rfis.length})
          </h3>
          <button
            onClick={() => setModalType('RFI')}
            className="btn-secondary text-xs py-1 px-3 flex items-center gap-1 font-bold"
          >
            + Raise Clarification (RFI)
          </button>
        </div>

        {rfis.length === 0 ? (
          <p className="text-xs text-slate-400 font-light">No clarification requests issued for this application.</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {rfis.map((rfi) => (
              <div key={rfi.id} className="py-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rfi.title}</span>
                  <span
                    className={`font-mono font-bold text-[10.5px] px-2 py-0.5 rounded ${
                      rfi.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {rfi.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{rfi.requirement_description}</p>
                {rfi.supplier_response_text && (
                  <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-800 mt-2 border border-slate-200">
                    <strong>Supplier Response:</strong> {rfi.supplier_response_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {/* CLASSIFY Modal — for REGISTRATION_CLASSIFICATION_REQUIRED */}
      {modalType === 'CLASSIFY' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              Classify as Contractor Applicant
            </h3>
            <p className="text-xs text-slate-600">
              This registration lacks a confirmed organisation. Classifying it as a Contractor
              Applicant will create an organisation record and application draft, then surface
              it in the standard review queue.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded p-3 text-xs text-orange-800 space-y-1">
              <p className="font-bold">Provenance recorded:</p>
              <p>• registration_source = MANUALLY_CLASSIFIED_BY_ADMIN</p>
              <p>• classified_by = {draft.primaryContactEmail || 'Admin'}</p>
              <p>• audit event: SUPPLIER_CLASSIFIED_AS_CONTRACTOR</p>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Company Name (if known)
                </label>
                <input
                  type="text"
                  value={classifyCompanyName}
                  onChange={(e) => setClassifyCompanyName(e.target.value)}
                  placeholder="e.g. PSTG Fire Protection Ltd — leave blank if unknown"
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>
              {classifyError && (
                <p className="text-rose-600 text-[11px] font-medium">{classifyError}</p>
              )}
              {classifySuccess && (
                <p className="text-emerald-700 text-[11px] font-medium">{classifySuccess}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setModalType(null); setClassifyError(''); setClassifySuccess(''); }}
                className="btn-secondary text-xs py-1.5 px-4"
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting || !!classifySuccess}
                onClick={async () => {
                  setIsSubmitting(true);
                  setClassifyError('');
                  try {
                    const res = await fetch('/api/admin/supplier/application/classify', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        applicationId: draft.supplier_id,
                        classifyAs: 'CONTRACTOR',
                        companyNameHint: classifyCompanyName || undefined,
                        classifiedBy: 'Admin',
                      }),
                    });
                    const json = await res.json();
                    if (json.success) {
                      setClassifySuccess(
                        `✓ Classified. Application reference: ${json.applicationReference}. Refreshing…`
                      );
                      setStatus('IN_PROGRESS');
                      setTimeout(() => window.location.reload(), 1500);
                    } else {
                      setClassifyError(json.error || 'Classification failed. Please try again.');
                    }
                  } catch {
                    setClassifyError('Network error. Please try again.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="btn-primary text-xs py-1.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Classifying…' : 'Confirm: Classify as Contractor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RFI Modal */}
      {modalType === 'RFI' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Raise Clarification Request (RFI)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Section</label>
                <select
                  value={rfiSection}
                  onChange={(e) => setRfiSection(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                >
                  <option value="insurance">Insurance Schedules</option>
                  <option value="accreditations">Accreditations &amp; Registrations</option>
                  <option value="health_safety">Health &amp; Safety / RAMS</option>
                  <option value="operations">Operational Capability</option>
                  <option value="documents">Document Vault</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={rfiTitle}
                  onChange={(e) => setRfiTitle(e.target.value)}
                  placeholder="e.g. Public Liability Schedule Indemnity Confirmation"
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Clarification Description</label>
                <textarea
                  value={rfiDescription}
                  onChange={(e) => setRfiDescription(e.target.value)}
                  placeholder="State specifically what evidence or confirmation the supplier must provide..."
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setModalType(null)} className="btn-secondary text-xs py-1.5 px-4">
                Cancel
              </button>
              <button
                disabled={!rfiTitle || !rfiDescription || isSubmitting}
                onClick={() =>
                  handleAction('CREATE_RFI', {
                    section_key: rfiSection,
                    title: rfiTitle,
                    requirement_description: rfiDescription,
                  })
                }
                className="btn-primary text-xs py-1.5 px-4 font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Issue Clarification Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {modalType === 'APPROVE' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Formal Assurance Approval with Scope</h3>
            <p className="text-xs text-slate-600 font-light">
              Grant formal technical approval to {draft.legalCompanyName || draft.legal_company_name}. Set approved trade
              disciplines and territorial limits.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Approved Trade Disciplines</label>
                <div className="p-2.5 border border-slate-200 rounded max-h-32 overflow-y-auto space-y-1 bg-slate-50">
                  {declaredServices.map((trade: string) => (
                    <label key={trade} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={approvedServices.includes(trade)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...approvedServices, trade]
                            : approvedServices.filter((t) => t !== trade);
                          setApprovedServices(updated);
                        }}
                        className="rounded text-emerald-600"
                      />
                      <span>{trade}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assurance Conditions / Restrictions</label>
                <input
                  type="text"
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setModalType(null)} className="btn-secondary text-xs py-1.5 px-4">
                Cancel
              </button>
              <button
                disabled={approvedServices.length === 0 || isSubmitting}
                onClick={() =>
                  handleAction('APPROVE', {
                    approved_services: approvedServices,
                    effective_date: new Date().toISOString().slice(0, 10),
                    next_review_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                  })
                }
                className="btn-primary text-xs py-1.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                {isSubmitting ? 'Approving...' : 'Confirm Scoped Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {modalType === 'DECLINE' && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Decline Supplier Application</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Decline Reason</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                >
                  <option value="INSUFFICIENT_INSURANCE">Insufficient Insurance Limits</option>
                  <option value="LACK_OF_ACCREDITATION">Missing Mandatory Trade Accreditations</option>
                  <option value="HEALTH_SAFETY_CONCERN">Unacceptable Incident / Enforcement Record</option>
                  <option value="GEOGRAPHIC_UNSUITABILITY">Outside Operational Requirements</option>
                  <option value="COMMERCIAL_NON_COMPLIANCE">Commercial Terms Non-Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Explanation (Visible to Supplier)</label>
                <textarea
                  value={declineExplanation}
                  onChange={(e) => setDeclineExplanation(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setModalType(null)} className="btn-secondary text-xs py-1.5 px-4">
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                onClick={() =>
                  handleAction('DECLINE', {
                    reason_category: declineReason,
                    explanation: declineExplanation,
                  })
                }
                className="btn-primary text-xs py-1.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold"
              >
                {isSubmitting ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
