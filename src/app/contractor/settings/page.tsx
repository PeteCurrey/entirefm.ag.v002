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
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 sm:p-7 space-y-1.5 shadow-xs">
        <span className="text-[10px] uppercase tracking-wider text-[#EA580C] font-bold">
          ORGANISATION SETTINGS &bull; {session.orgName}
        </span>
        <h1 className="text-2xl font-semibold text-[#111111] tracking-tight">
          Settings &amp; Company Branding
        </h1>
        <p className="text-xs text-[#6D6D68] font-normal max-w-xl leading-relaxed">
          Configure your company branding for white-labelled documents, manage notification triggers, and set security preferences.
        </p>
      </div>

      {/* ─── COMPANY BRANDING EDITOR ──────────────────────────────────────── */}
      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E5]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#EA580C]" />
            Company White-Label Branding
          </h3>
          <span className="text-[10px] uppercase font-bold text-[#EA580C] tracking-wider bg-[#FFF7ED] border border-[#FFEDD5] px-2.5 py-1 rounded-[4px]">
            Business Toolkit
          </span>
        </div>

        <p className="text-xs text-[#6D6D68]">
          All business documents, RAMS, service sheets, and quotations you create will be branded with these details.
          When creating documents for your own customers, <strong className="text-[#111111]">EntireFM branding is entirely suppressed</strong> — only your company identity appears.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-4 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5] space-y-3">
            <h4 className="font-semibold text-[#111111] text-[11px] uppercase tracking-wider">Current Brand Profile</h4>
            <div className="space-y-2 text-[#6D6D68]">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                <span><strong className="text-[#111111]">Company:</strong> {brandProfile?.company_name || session.orgName}</span>
              </div>
              {brandProfile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>{brandProfile.phone}</span>
                </div>
              )}
              {brandProfile?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>{brandProfile.email}</span>
                </div>
              )}
              {brandProfile?.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>{brandProfile.website}</span>
                </div>
              )}
              {brandProfile?.vat_number && (
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>VAT: {brandProfile.vat_number}</span>
                </div>
              )}
              {brandProfile?.company_number && (
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                  <span>Co. Reg: {brandProfile.company_number}</span>
                </div>
              )}
            </div>

            {/* Colour swatches */}
            {brandProfile?.brand_color_primary && (
              <div className="flex items-center gap-3 pt-2 border-t border-[#E8E8E5]">
                <div
                  className="w-7 h-7 rounded-[4px] border border-[#E8E8E5]"
                  style={{ backgroundColor: brandProfile.brand_color_primary }}
                  title="Primary brand colour"
                />
                {brandProfile.brand_color_secondary && (
                  <div
                    className="w-7 h-7 rounded-[4px] border border-[#E8E8E5]"
                    style={{ backgroundColor: brandProfile.brand_color_secondary }}
                    title="Accent brand colour"
                  />
                )}
                <span className="text-[11px] text-[#9A9A95]">Brand colours configured</span>
              </div>
            )}
          </div>

          {/* Branding update form via /api/contractor/branding */}
          <form
            action="/api/contractor/branding"
            method="POST"
            className="p-4 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5] space-y-3"
          >
            <h4 className="font-semibold text-[#111111] text-[11px] uppercase tracking-wider">Update Branding</h4>
            <input type="hidden" name="contractor_org_id" value={session.orgId} />

            <div className="space-y-2">
              <div>
                <label className="text-[#6D6D68] block mb-1">Company Name</label>
                <input
                  name="company_name"
                  type="text"
                  defaultValue={brandProfile?.company_name || session.orgName}
                  placeholder="Your Trading Name"
                  className="w-full rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] px-3 py-1.5 text-[#111111] text-xs focus:border-[#EA580C] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#6D6D68] block mb-1">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    defaultValue={brandProfile?.phone || ''}
                    placeholder="0161 000 0000"
                    className="w-full rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] px-3 py-1.5 text-[#111111] text-xs focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#6D6D68] block mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={brandProfile?.email || ''}
                    placeholder="info@yourco.com"
                    className="w-full rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] px-3 py-1.5 text-[#111111] text-xs focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#6D6D68] block mb-1">VAT Number</label>
                <input
                  name="vat_number"
                  type="text"
                  defaultValue={brandProfile?.vat_number || ''}
                  placeholder="GB123456789"
                  className="w-full rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] px-3 py-1.5 text-[#111111] text-xs focus:border-[#EA580C] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#6D6D68] block mb-1">Companies House Number</label>
                <input
                  name="company_number"
                  type="text"
                  defaultValue={brandProfile?.company_number || ''}
                  placeholder="12345678"
                  className="w-full rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] px-3 py-1.5 text-[#111111] text-xs focus:border-[#EA580C] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#6D6D68] block mb-1">Primary Colour</label>
                  <input
                    name="brand_color_primary"
                    type="color"
                    defaultValue={brandProfile?.brand_color_primary || '#ea580c'}
                    className="w-full h-8 rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] px-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[#6D6D68] block mb-1">Accent Colour</label>
                  <input
                    name="brand_color_secondary"
                    type="color"
                    defaultValue={brandProfile?.brand_color_secondary || '#0ea5e9'}
                    className="w-full h-8 rounded-[6px] bg-[#FFFFFF] border border-[#E8E8E5] px-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-[6px] bg-[#EA580C] text-white text-xs font-medium hover:bg-[#C2410C] transition-all shadow-xs"
            >
              Save Company Branding
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Preferences */}
        <div className="lg:col-span-2 rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E8E8E5] pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#EA580C]" />
            Operational Notification Triggers
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5]">
              <div>
                <span className="text-[#111111] font-medium block">New Work Order Assignment Offers</span>
                <span className="text-[#6D6D68] text-[11px]">Instant email and SMS notification when a job is offered</span>
              </div>
              <span className="text-[10.5px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-[4px] border border-[#BBF7D0]">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5]">
              <div>
                <span className="text-[#111111] font-medium block">Compliance Document Expiry Alerts (30d / 7d)</span>
                <span className="text-[#6D6D68] text-[11px]">Proactive reminders before insurance or trade cards expire</span>
              </div>
              <span className="text-[10.5px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-[4px] border border-[#BBF7D0]">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5]">
              <div>
                <span className="text-[#111111] font-medium block">Direct Helpdesk &amp; Dispatch Messages</span>
                <span className="text-[#6D6D68] text-[11px]">Real-time operational alerts from EntireFM controllers</span>
              </div>
              <span className="text-[10.5px] font-semibold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-[4px] border border-[#BBF7D0]">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5]">
              <div>
                <span className="text-[#111111] font-medium block">Business Document Completion Reminders</span>
                <span className="text-[#6D6D68] text-[11px]">Remind when drafts are not signed off within 48 hours</span>
              </div>
              <span className="text-[10.5px] font-semibold text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded-[4px] border border-[#FDE68A]">OPTIONAL</span>
            </div>
          </div>
        </div>

        {/* Security & Access Box */}
        <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] p-6 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] border-b border-[#E8E8E5] pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#EA580C]" />
            Security &amp; Session
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#6D6D68] block">Current User</span>
              <span className="text-[#111111] font-medium mt-0.5 block">{session.name}</span>
            </div>

            <div>
              <span className="text-[#6D6D68] block">Session Security</span>
              <span className="text-[#15803D] font-medium mt-0.5 block">HMAC Encrypted Session</span>
            </div>

            <div>
              <span className="text-[#6D6D68] block">Organisation</span>
              <span className="text-[#111111] font-medium mt-0.5 block">{session.orgName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
