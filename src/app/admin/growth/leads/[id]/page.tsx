import { Metadata } from 'next';
import Link from 'next/link';
import { getLeadById } from '@/server/growth/store';
import { LeadStatusActionBar } from '@/components/admin/growth/LeadStatusActionBar';
import {
  Users,
  MapPin,
  Briefcase,
  Compass,
  ArrowRight,
  Globe,
  Tag,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lead Commercial Journey & Attribution — EntireCAFM',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lead = await getLeadById(resolvedParams.id);

  if (!lead) {
    return (
      <div className="space-y-6">
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-12 text-center space-y-4">
          <h2 className="text-lg font-light text-[#111111]">Lead Record Not Found</h2>
          <p className="text-[12.5px] text-[#6D6D68]">
            No inbound record matches enquiry ID &ldquo;{resolvedParams.id}&rdquo;.
          </p>
          <Link
            href="/admin/growth/leads"
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] px-3.5 py-2 text-[12px] font-normal text-[#111111] hover:bg-[#FAFAF8] transition-all"
          >
            ← Back to Leads Directory
          </Link>
        </div>
      </div>
    );
  }

  const journey = lead.journey_trail || [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E5] pb-5">
        <div>
          <div className="font-mono text-[10.5px] font-normal uppercase tracking-wider text-[#EA580C]">
            COMMERCIAL JOURNEY &amp; ATTRIBUTION INTELLIGENCE
          </div>
          <h1 className="text-2xl font-extralight text-[#111111] tracking-tight mt-0.5">
            {lead.name}
          </h1>
          <div className="flex items-center gap-3 text-[12px] text-[#6D6D68] mt-1 font-mono">
            <span>Ref: {lead.enquiry_id}</span>
            <span>·</span>
            <span>{new Date(lead.received_at).toLocaleString('en-GB')}</span>
            {lead.company && (
              <>
                <span>·</span>
                <span className="text-[#111111] font-sans font-normal">{lead.company}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/growth/leads"
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-normal text-[#6D6D68] hover:border-[#D4D4D0] hover:text-[#111111] transition-all"
          >
            ← Back to Leads
          </Link>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prospect Details, Requirement & Journey Trail */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prospect Profile */}
          <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
            <h3 className="text-[11px] font-normal text-[#6D6D68] uppercase tracking-wider border-b border-[#E8E8E5] pb-2.5">
              Prospect Profile &amp; Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12.5px]">
              <div>
                <span className="text-[#9A9A95] block text-[10.5px] uppercase font-mono">Full Name</span>
                <span className="text-[#111111] font-normal">{lead.name}</span>
              </div>
              <div>
                <span className="text-[#9A9A95] block text-[10.5px] uppercase font-mono">Company / Organisation</span>
                <span className="text-[#111111] font-normal">{lead.company || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[#9A9A95] block text-[10.5px] uppercase font-mono">Direct Email</span>
                <span className="text-[#111111] font-mono">{lead.email}</span>
              </div>
              <div>
                <span className="text-[#9A9A95] block text-[10.5px] uppercase font-mono">Telephone Contact</span>
                <span className="text-[#111111] font-mono">{lead.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Service Requirement Brief */}
          <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs space-y-4">
            <h3 className="text-[11px] font-normal text-[#6D6D68] uppercase tracking-wider border-b border-[#E8E8E5] pb-2.5">
              Service Requirement &amp; Scope
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12.5px]">
              <div>
                <span className="text-[#9A9A95] block text-[10.5px] uppercase font-mono">Primary Service</span>
                <span className="text-[#111111] font-normal">{lead.service || 'Planned PPM & Hard Facilities Management'}</span>
              </div>
              <div>
                <span className="text-[#9A9A95] block text-[10.5px] uppercase font-mono">Estate Site / Location</span>
                <span className="text-[#111111] font-normal">{lead.location || 'United Kingdom'}</span>
              </div>
            </div>

            {lead.message && (
              <div className="pt-2">
                <span className="text-[#9A9A95] block text-[10.5px] uppercase font-mono mb-1">Prospect Submission Notes</span>
                <p className="text-[#111111] bg-[#FAFAF8] p-4 rounded-[6px] border border-[#E8E8E5] text-[12.5px] leading-relaxed whitespace-pre-wrap">
                  {lead.message}
                </p>
              </div>
            )}
          </div>

          {/* Chronological Journey Trail */}
          <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E8E5] pb-2.5">
              <h3 className="text-[11px] font-normal text-[#6D6D68] uppercase tracking-wider">
                Multi-Touch Attribution Journey Trail
              </h3>
              <span className="font-mono text-[11px] text-[#9A9A95]">
                {journey.length > 0 ? `${journey.length} Touchpoints` : 'Direct Submission'}
              </span>
            </div>

            {journey.length === 0 ? (
              <div className="p-6 text-center text-[#6D6D68] text-[12.5px] bg-[#FAFAF8] rounded-[6px] border border-[#E8E8E5]">
                Direct Path: Prospect landed on <code className="font-mono text-[#111111]">{lead.landing_page || '/contact-us'}</code> and completed enquiry.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#E8E8E5]">
                {journey.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-[#EA580C] border-2 border-[#FFFFFF] shadow-xs" />
                    <div className="bg-[#FAFAF8] border border-[#E8E8E5] p-3.5 rounded-[6px] text-[12.5px] space-y-1 hover:border-[#D4D4D0] transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-normal text-[#111111]">
                          Step {idx + 1}: <code className="font-mono text-[11.5px] text-[#6D6D68]">{step.path}</code>
                        </span>
                        <span className="text-[10px] font-mono text-[#9A9A95] uppercase">
                          {step.pageType || 'page'}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#6D6D68]">
                        {step.path.includes('/tools/') ? (
                          <span className="text-[#15803D]">Interactive Tool Interacted</span>
                        ) : step.path.includes('/resources/') ? (
                          <span className="text-[#1D4ED8]">Knowledge Resource Read</span>
                        ) : step.path.includes('/post/') ? (
                          <span className="text-[#6D6D68]">Blog Article Engaged</span>
                        ) : (
                          <span>Commercial Site Page</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Qualification Context Rail & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Action Bar */}
          <LeadStatusActionBar
            leadId={lead.enquiry_id || lead.id}
            currentStatus={lead.qualification_status || 'NEW'}
          />

          {/* Qualification Intelligence Rail */}
          <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-5 space-y-4 shadow-xs">
            <h3 className="text-[11px] font-normal text-[#6D6D68] uppercase tracking-wider border-b border-[#E8E8E5] pb-2">
              Commercial Qualification Fit
            </h3>
            <div className="space-y-3 text-[12px]">
              <div className="flex justify-between py-1 border-b border-[#E8E8E5]">
                <span className="text-[#6D6D68]">Account Potential:</span>
                <span className="text-[#111111] font-medium">Commercial Estate / Multi-Site</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E5]">
                <span className="text-[#6D6D68]">Service Fit:</span>
                <span className="text-[#15803D] font-medium">High Match (Hard FM)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E5]">
                <span className="text-[#6D6D68]">Channel Source:</span>
                <span className="font-mono text-[#111111]">{lead.marketing_channel || 'ORGANIC_SEARCH'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E8E5]">
                <span className="text-[#6D6D68]">First Touch:</span>
                <span className="font-mono text-[#111111] truncate max-w-[140px]">{lead.first_touch_url || lead.landing_page || '/'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6D6D68]">Conversion Form:</span>
                <span className="font-mono text-[#111111] truncate max-w-[140px]">{lead.conversion_page || '/contact-us'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

