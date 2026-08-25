import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
} from 'lucide-react';

export const metadata: Metadata = { title: 'Lead Journey Inspection | EntireFM Admin' };

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lead = await getLeadById(resolvedParams.id);

  if (!lead) {
    return (
      <main className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center space-y-4">
          <h2 className="text-lg font-bold text-white">Lead Record Not Found</h2>
          <p className="text-xs text-zinc-400">
            No inbound record matches enquiry ID &ldquo;{resolvedParams.id}&rdquo;.
          </p>
          <Link
            href="/admin/growth/leads"
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-semibold border border-zinc-700 inline-block"
          >
            ← Back to Leads
          </Link>
        </div>
      </main>
    );
  }

  const journey = lead.journey_trail || [];

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-pink-400 font-bold">
            LEAD ATTRIBUTION &amp; JOURNEY TRAIL
          </span>
          <h1 className="text-2xl font-bold text-white mt-0.5">{lead.name}</h1>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono">
            <span>Ref: {lead.enquiry_id}</span>
            <span>·</span>
            <span>{new Date(lead.received_at).toLocaleString('en-GB')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/growth/leads"
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 border border-zinc-700 rounded-lg"
          >
            ← Back to Leads
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Actions & Contact & Requirement Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status & Action Bar */}
          <LeadStatusActionBar
            leadId={lead.enquiry_id || lead.id}
            currentStatus={lead.qualification_status || 'NEW'}
          />

          {/* Drone Inspection Brief Card (if lead was created via Drone Inspection Planner) */}
          {lead.drone_brief && (
            <div className="bg-zinc-900 border-2 border-pink-500/50 rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/30">
                  DRONE INSPECTION BRIEF
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  lead.drone_brief.leadPriority === 'HIGH'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : lead.drone_brief.leadPriority === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                }`}>
                  PRIORITY: {lead.drone_brief.leadPriority || 'HIGH'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono">Reference Identifier</span>
                  <span className="text-white font-mono font-bold">{lead.drone_brief.referenceNumber || 'N/A'}</span>
                </div>

                <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                  <span className="text-pink-400 block font-semibold">
                    {lead.drone_brief.recommendation?.primaryService || 'Commercial Drone Survey'}
                  </span>
                  {lead.drone_brief.recommendation?.inspectionPack && (
                    <div className="text-zinc-300 text-[11px]">
                      <strong>Package:</strong> {lead.drone_brief.recommendation.inspectionPack}
                    </div>
                  )}
                  <div className="text-zinc-400 text-[11px]">
                    <strong>Scope Category:</strong> {lead.drone_brief.recommendation?.scopeCategory || 'Standard'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">SCALE &amp; HEIGHT</span>
                    <span className="text-white">{lead.drone_brief.site?.siteScale || 'Single Building'} ({lead.drone_brief.inspection?.heightBand || 'Standard'})</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">URGENCY</span>
                    <span className="text-white font-medium">{lead.drone_brief.inspection?.urgency || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">REMEDIAL WORKS</span>
                    <span className="text-white">{lead.drone_brief.inspection?.remediationInterest || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">FREQUENCY</span>
                    <span className="text-white">{lead.drone_brief.inspection?.frequency || 'One-Off'}</span>
                  </div>
                </div>

                {lead.drone_brief.inspection?.assetsToInspect && (
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-mono">Assets to Inspect</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {lead.drone_brief.inspection.assetsToInspect.map((asset: string, aIdx: number) => (
                        <span key={aIdx} className="bg-zinc-800 text-zinc-200 text-[10px] px-1.5 py-0.5 rounded">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Prospect Details
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">FULL NAME</span>
                <span className="text-white font-medium">{lead.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">COMPANY</span>
                <span className="text-white font-medium">{lead.company || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">EMAIL ADDRESS</span>
                <span className="text-white font-mono">{lead.email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">TELEPHONE</span>
                <span className="text-white font-mono">{lead.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Service Requirement
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">PRIMARY SERVICE</span>
                <span className="text-pink-400 font-semibold">{lead.service || 'General Facilities Management'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">SITE LOCATION</span>
                <span className="text-white font-medium">{lead.location || 'United Kingdom'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">PROSPECT MESSAGE</span>
                <p className="text-zinc-300 bg-zinc-950 p-3 rounded border border-zinc-800 leading-relaxed mt-1 whitespace-pre-wrap">
                  {lead.message}
                </p>
              </div>
            </div>
          </div>

          {/* Marketing Attribution Envelope */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Acquisition Attribution
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Marketing Channel:</span>
                <span className="font-mono text-white font-bold">{lead.marketing_channel || 'ORGANIC_SEARCH'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">First Touch:</span>
                <span className="font-mono text-pink-400">{lead.first_touch_url || lead.landing_page || '/'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-500">Conversion Page:</span>
                <span className="font-mono text-blue-400">{lead.conversion_page || '/contact-us'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">UTM Campaign:</span>
                <span className="font-mono text-zinc-300">{lead.utm_campaign || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Touch User Journey Trail */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                Multi-Touch User Journey Trail
              </h3>
              <span className="text-xs text-zinc-500 font-mono">
                {journey.length > 0 ? `${journey.length} Steps` : 'Direct Path'}
              </span>
            </div>

            {journey.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                Single-page conversion: User landed on {lead.landing_page || '/contact-us'} and completed submission.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                {journey.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[29px] top-1 h-3.5 w-3.5 rounded-full bg-zinc-900 border-2 border-pink-500" />
                    <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          Step {idx + 1}: {step.path}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {step.pageType || 'page'}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {step.path.includes('/tools/') ? (
                          <span className="text-emerald-400 font-semibold">Interactive Tool Interacted</span>
                        ) : step.path.includes('/resources/') ? (
                          <span className="text-purple-400 font-semibold">Knowledge Resource Read</span>
                        ) : step.path.includes('/post/') ? (
                          <span className="text-blue-400 font-semibold">Blog Article Engaged</span>
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
      </div>
    </main>
  );
}
