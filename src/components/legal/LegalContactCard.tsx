import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { LEGAL_CONFIG } from '@/config/legal';

interface LegalContactCardProps {
  title?: string;
  subtitle?: string;
  showComplaintLink?: boolean;
}

export function LegalContactCard({
  title = 'Data Protection & Legal Governance Inquiries',
  subtitle = 'For statutory requests, data protection questions, contract notices, or governance inquiries, please contact our designated compliance team.',
  showComplaintLink = true,
}: LegalContactCardProps) {
  const dpo = LEGAL_CONFIG.dataProtectionOfficer;

  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Official Legal & Privacy Channel
          </div>
          <h3 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{subtitle}</p>
        </div>

        {showComplaintLink && (
          <div className="shrink-0">
            <Link
              href="/legal/data-protection-complaints"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Submit Electronic Complaint
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Email Contact</p>
            <a
              href={`mailto:${dpo.email}`}
              className="mt-0.5 block truncate text-sm font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
            >
              {dpo.email}
            </a>
            <p className="mt-0.5 text-[11px] text-slate-500">Direct response within statutory timelines</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Compliance Helpline</p>
            <a
              href={`tel:${dpo.phone.replace(/\s+/g, '')}`}
              className="mt-0.5 block text-sm font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
            >
              {dpo.phone}
            </a>
            <p className="mt-0.5 text-[11px] text-slate-500">Monday–Friday, 08:30–17:30 UK</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">Supervisory Escalation</p>
            <a
              href={LEGAL_CONFIG.leadSupervisoryAuthority.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
            >
              ICO (Information Commissioner)
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <p className="mt-0.5 text-[11px] text-slate-500">UK Lead Supervisory Authority</p>
          </div>
        </div>
      </div>
    </div>
  );
}
