import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { Shield, Bell, Users, Lock, Key, Mail, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings & Team Governance | EntireFM Contractor Platform',
  description: 'Team roles, notification triggers, and security preferences.',
};

export const dynamic = 'force-dynamic';

export default async function ContractorSettingsPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login?redirect=/contractor/settings');

  const isViewAs = !!session.viewAsContext?.isViewAs;
  if (session.orgType !== 'CONTRACTOR' && !isViewAs && session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_contractor');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-electric-bright font-bold">
          ORGANISATION SETTINGS &bull; {session.orgName}
        </span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
          Settings &amp; Security Controls
        </h1>
        <p className="text-xs text-brand-mist/70 font-light max-w-xl">
          Manage team access roles, automated dispatch notifications, and security protocols.
        </p>
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
              <span className="text-[10.5px] font-mono text-emerald-400">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <div>
                <span className="text-white font-normal block">Compliance Document Expiry Alerts (30d / 7d)</span>
                <span className="text-brand-mist/50 text-[11px]">Proactive reminders before insurance or trade cards expire</span>
              </div>
              <span className="text-[10.5px] font-mono text-emerald-400">ENABLED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-brand-void border border-brand-edge-dark">
              <div>
                <span className="text-white font-normal block">Direct Helpdesk &amp; Dispatch Messages</span>
                <span className="text-brand-mist/50 text-[11px]">Real-time operational alerts from EntireFM controllers</span>
              </div>
              <span className="text-[10.5px] font-mono text-emerald-400">ENABLED</span>
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
              <span className="text-brand-electric-bright font-mono mt-0.5 block">{session.role}</span>
            </div>

            <div>
              <span className="text-brand-mist/50 block">Authentication Method</span>
              <span className="text-white font-mono mt-0.5 block">HMAC Encrypted Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
