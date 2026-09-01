import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { getContractorBrandProfile } from '@/server/contractor/branding-service';
import { Shield, Bell, Lock, Palette, CheckCircle2, Building, Globe, Mail, Phone, Hash } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings & Branding | EntireFM Contractor Business Toolkit',
  description: 'Company branding, notification preferences, team access roles, and security settings.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ContractorSettingsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/settings');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  const brandProfile = await getContractorBrandProfile(session.orgId, session);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
          ORGANISATION SETTINGS &bull; {session.orgName}
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Settings &amp; Company Branding
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-xl">
          Configure your company branding for white-labelled documents, manage notification triggers, and set security preferences.
        </p>
      </div>

      {/* ─── COMPANY BRANDING EDITOR ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-electric/20 bg-brand-carbon/40 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-electric" />
            Company White-Label Branding
          </h3>
          <span className="text-[10px] uppercase font-bold text-brand-electric-bright tracking-wider bg-brand-electric/10 border border-brand-electric/30 px-2.5 py-1 rounded-lg">
            Business Toolkit
          </span>
        </div>

        <p className="text-xs text-brand-mist/60">
          All business documents, RAMS, service sheets, and quotations you create will be branded with these details.
          When creating documents for your own customers, <strong className="text-white">EntireFM branding is entirely suppressed</strong> — only your company identity appears.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-brand-void/60 border border-brand-edge-dark space-y-3">
            <h4 className="font-semibold text-white text-[11px] uppercase tracking-wider">Current Brand Profile</h4>
            <div className="space-y-2 text-brand-mist/80">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-brand-electric/70 shrink-0" />
                <span><strong className="text-white">Company:</strong> {brandProfile?.company_name || session.orgName}</span>
              </div>
              {brandProfile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-electric/70 shrink-0" />
                  <span>{brandProfile.phone}</span>
                </div>
              )}
              {brandProfile?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-electric/70 shrink-0" />
                  <span>{brandProfile.email}</span>
                </div>
              )}
              {brandProfile?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-brand-electric/70 shrink-0" />
                  <span>{brandProfile.website}</span>
                </div>
              )}
              {brandProfile?.vat_number && (
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-brand-electric/70 shrink-0" />
                  <span>VAT: {brandProfile.vat_number}</span>
                </div>
              )}
              {brandProfile?.company_number && (
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-brand-electric/70 shrink-0" />
                  <span>Co. Reg: {brandProfile.company_number}</span>
                </div>
              )}
            </div>

            {/* Colour swatches */}
            {brandProfile?.brand_color_primary && (
              <div className="flex items-center gap-3 pt-1">
                <div
                  className="w-8 h-8 rounded-lg border border-white/10"
                  style={{ backgroundColor: brandProfile.brand_color_primary }}
                  title="Primary brand colour"
                />
                {brandProfile.brand_color_secondary && (
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10"
                    style={{ backgroundColor: brandProfile.brand_color_secondary }}
                    title="Accent brand colour"
                  />
                )}
                <span className="text-brand-mist/40">Brand colours configured</span>
              </div>
            )}
          </div>

          {/* Branding update form via /api/contractor/branding */}
          <form
            action="/api/contractor/branding"
            method="POST"
            className="p-4 rounded-xl bg-brand-void/60 border border-brand-edge-dark space-y-3"
          >
            <h4 className="font-semibold text-white text-[11px] uppercase tracking-wider">Update Branding</h4>
            <input type="hidden" name="contractor_org_id" value={session.orgId} />

            <div className="space-y-2">
              <div>
                <label className="text-brand-mist/60 block mb-1">Company Name</label>
                <input
                  name="company_name"
                  type="text"
                  defaultValue={brandProfile?.company_name || session.orgName}
                  placeholder="Your Trading Name"
                  className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-2 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-brand-mist/60 block mb-1">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    defaultValue={brandProfile?.phone || ''}
                    placeholder="0161 000 0000"
                    className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/60 block mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={brandProfile?.email || ''}
                    placeholder="info@yourco.com"
                    className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">VAT Number</label>
                <input
                  name="vat_number"
                  type="text"
                  defaultValue={brandProfile?.vat_number || ''}
                  placeholder="GB123456789"
                  className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-brand-mist/60 block mb-1">Companies House Number</label>
                <input
                  name="company_number"
                  type="text"
                  defaultValue={brandProfile?.company_number || ''}
                  placeholder="12345678"
                  className="w-full rounded-lg bg-brand-void border border-brand-edge-dark px-3 py-2 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-brand-mist/60 block mb-1">Primary Colour</label>
                  <input
                    name="brand_color_primary"
                    type="color"
                    defaultValue={brandProfile?.brand_color_primary || '#1d4ed8'}
                    className="w-full h-9 rounded-lg bg-brand-void border border-brand-edge-dark px-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-brand-mist/60 block mb-1">Accent Colour</label>
                  <input
                    name="brand_color_secondary"
                    type="color"
                    defaultValue={brandProfile?.brand_color_secondary || '#0ea5e9'}
                    className="w-full h-9 rounded-lg bg-brand-void border border-brand-edge-dark px-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-brand-electric text-white text-xs font-semibold hover:bg-brand-electric/85 transition-all shadow-md shadow-brand-electric/20"
            >
              Save Company Branding
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Preferences */}
        <div className="lg:col-span-2 rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-electric" />
            Operational Notification Triggers
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <div>
                <span className="text-white font-normal block">New Work Order Assignment Offers</span>
                <span className="text-brand-mist/50 text-[11px]">Instant email and SMS notification when a job is offered</span>
              </div>
              <span className="text-[10.5px] font-normal text-emerald-400">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <div>
                <span className="text-white font-normal block">Compliance Document Expiry Alerts (30d / 7d)</span>
                <span className="text-brand-mist/50 text-[11px]">Proactive reminders before insurance or trade cards expire</span>
              </div>
              <span className="text-[10.5px] font-normal text-emerald-400">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <div>
                <span className="text-white font-normal block">Direct Helpdesk &amp; Dispatch Messages</span>
                <span className="text-brand-mist/50 text-[11px]">Real-time operational alerts from EntireFM controllers</span>
              </div>
              <span className="text-[10.5px] font-normal text-emerald-400">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <div>
                <span className="text-white font-normal block">Business Document Completion Reminders</span>
                <span className="text-brand-mist/50 text-[11px]">Remind when drafts are not signed off within 48 hours</span>
              </div>
              <span className="text-[10.5px] font-normal text-amber-400">OPTIONAL</span>
            </div>
          </div>
        </div>

        {/* Security & Access Box */}
        <div className="rounded-xl border border-brand-edge-dark bg-brand-carbon p-6 space-y-4">
          <h3 className="text-sm font-medium text-white border-b border-brand-edge-dark/60 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-electric" />
            Security &amp; Session
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-brand-mist/50 block">Current User</span>
              <span className="text-white font-normal mt-0.5 block">{session.name}</span>
            </div>

            <div>
              <span className="text-brand-mist/50 block">Assigned Role</span>
              <span className="text-brand-electric-bright font-normal mt-0.5 block">{session.role}</span>
            </div>

            <div>
              <span className="text-brand-mist/50 block">Authentication Method</span>
              <span className="text-white font-normal mt-0.5 block">HMAC Encrypted Session</span>
            </div>

            <div>
              <span className="text-brand-mist/50 block">Organisation</span>
              <span className="text-white font-normal mt-0.5 block">{session.orgName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
