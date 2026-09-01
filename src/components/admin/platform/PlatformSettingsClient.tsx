'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserSession } from '@/server/identity';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  User,
  Settings,
  Shield,
  Bot,
  Bell,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Briefcase,
  Key,
  Clock,
  Sparkles,
  Save,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface PlatformSettingsClientProps {
  session: UserSession;
}

export type SettingsTab = 'profile' | 'system' | 'security' | 'ai' | 'notifications';

export function PlatformSettingsClient({ session }: PlatformSettingsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile State
  const initialNames = session.name ? session.name.split(' ') : [];
  const [firstName, setFirstName] = useState(initialNames[0] || '');
  const [lastName, setLastName] = useState(initialNames.slice(1).join(' ') || '');
  const [email, setEmail] = useState(session.email || '');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState(session.role?.replace(/_/g, ' ') || '');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [timezone, setTimezone] = useState('Europe/London (GMT/BST)');

  // System & CAFM Settings State
  const [companyName, setCompanyName] = useState(session.orgName || 'EntireFM Core Operations');
  const [p1SlaHours, setP1SlaHours] = useState('2');
  const [p2SlaHours, setP2SlaHours] = useState('4');
  const [p3SlaHours, setP3SlaHours] = useState('24');
  const [p4SlaHours, setP4SlaHours] = useState('72');
  const [currency, setCurrency] = useState('GBP (£)');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [telemetryRateSeconds, setTelemetryRateSeconds] = useState('30');

  // AI Governance State
  const [aiAutonomyThreshold, setAiAutonomyThreshold] = useState('500');
  const [aiAutoSchedulePpm, setAiAutoSchedulePpm] = useState(true);
  const [aiConfidenceCutoff, setAiConfidenceCutoff] = useState('95');

  // Notification State
  const [notifySlaBreaches, setNotifySlaBreaches] = useState(true);
  const [notifyP1Critical, setNotifyP1Critical] = useState(true);
  const [notifyQuoteApprovals, setNotifyQuoteApprovals] = useState(true);

  const previewFirstName = firstName.trim() || 'Operations';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          jobTitle,
          orgName: companyName,
          settings: {
            p1SlaHours,
            p2SlaHours,
            p3SlaHours,
            p4SlaHours,
            currency,
            autoDispatch,
            telemetryRateSeconds,
            aiAutonomyThreshold,
            aiAutoSchedulePpm,
            aiConfidenceCutoff,
            notifySlaBreaches,
            notifyP1Critical,
            notifyQuoteApprovals,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update settings');
      }

      setSuccessMessage('Profile and system configuration saved successfully. Your dashboard greeting has been updated.');
      
      // Refresh router so server layouts and pages pick up the new session name
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] pb-5 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 font-normal text-[11px] text-[#686866] hover:text-[#101010] transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to Control Centre</span>
            </Link>
            <span className="text-[#9B9B97]">/</span>
            <span className="text-[11px] text-[#FF6B24] uppercase font-light">
              Platform Configuration
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-light tracking-tight text-[#101010]">
            System Settings & User Profile
          </h1>
          <p className="mt-1 text-[13px] text-[#686866]">
            Configure your personal identity, contact details, operational CAFM parameters, and AI governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            icon={<Save className="h-3.5 w-3.5" />}
            loading={saving}
            onClick={handleSave}
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Live Feedback Banners */}
      {successMessage && (
        <div className="rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] p-4 text-[13px] text-[#15803D] flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-[13px] text-[#B91C1C] flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Greeting Live Preview HUD Card */}
      <div className="rounded-[14px] border border-[#FED7AA] bg-[#FFF7ED] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(255,107,36,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B24] text-white font-light text-[14px] shadow-sm">
            {previewFirstName.charAt(0)}
          </div>
          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-[#C2410C] font-light">
              Live Dashboard Greeting Preview
            </div>
            <div className="text-[16px] font-light text-[#101010]">
              Good morning, <span className="font-light text-[#FF6B24]">{previewFirstName}</span>
            </div>
          </div>
        </div>
        <div className="font-normal text-[11px] text-[#686866] bg-[#FFFFFF] border border-[#FED7AA] px-3 py-1.5 rounded-[8px]">
          Authenticated Role: <strong className="text-[#101010]">{session.role}</strong>
        </div>
      </div>

      {/* Main Settings Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E4E4E1] pb-2 font-normal text-[12px]">
        {[
          { id: 'profile', label: 'Profile & Contact Info', icon: User },
          { id: 'system', label: 'System & CAFM Rules', icon: Settings },
          { id: 'security', label: 'Security & Access', icon: Shield },
          { id: 'ai', label: 'AI Governance & Autonomy', icon: Bot },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`inline-flex items-center gap-2 rounded-[8px] px-3.5 py-2 font-medium transition-all ${
                isActive
                  ? 'bg-[#101010] text-white shadow-sm font-light'
                  : 'text-[#686866] hover:bg-[#FFFFFF] hover:text-[#101010]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile & Contact Info */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card
            title="Personal Identification & Contact Details"
            subtitle="The name and details configured here populate system dispatches, approvals, and the Operations Control Centre greeting."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Peter"
                icon={<User className="h-3.5 w-3.5" />}
                helperText="Appears directly next to 'Good morning' on the dashboard."
                required
              />

              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Currey"
                icon={<User className="h-3.5 w-3.5" />}
                required
              />

              <Input
                label="Primary Work Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@entirefm.com"
                icon={<Mail className="h-3.5 w-3.5" />}
                helperText="Used for authentication, sign-off requests, and audit logs."
                required
              />

              <Input
                label="Direct Telephone / Mobile"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 (0) 161 820 4420"
                icon={<Phone className="h-3.5 w-3.5" />}
                helperText="Provided to on-site engineers during high-priority escalations."
              />

              <Input
                label="Job Title / Department"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Facilities Director"
                icon={<Briefcase className="h-3.5 w-3.5" />}
              />

              <Input
                label="24/7 Emergency Escalation Contact Number"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+44 (0) 7700 900821"
                icon={<Phone className="h-3.5 w-3.5" />}
                helperText="Secondary line for critical out-of-hours P1 incidents."
              />
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E4E1] flex justify-end">
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={<Save className="h-3.5 w-3.5" />}
                loading={saving}
              >
                Save Profile Details
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 2: System & CAFM Operational Settings */}
      {activeTab === 'system' && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card
            title="CAFM Operational Engine & SLA Parameters"
            subtitle="Configure default response windows, auto-dispatch triggers, and tenant naming."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Operating Organisation / Tenant Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="EntireFM Core Operations"
                icon={<Building2 className="h-3.5 w-3.5" />}
              />

              <Input
                label="Operating Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="GBP (£)"
              />

              <Input
                label="P1 Critical Target Resolution SLA (Hours)"
                type="number"
                value={p1SlaHours}
                onChange={(e) => setP1SlaHours(e.target.value)}
                icon={<Clock className="h-3.5 w-3.5" />}
                helperText="Maximum allowed elapsed time before emergency escalation."
              />

              <Input
                label="P2 High Priority Target SLA (Hours)"
                type="number"
                value={p2SlaHours}
                onChange={(e) => setP2SlaHours(e.target.value)}
                icon={<Clock className="h-3.5 w-3.5" />}
              />

              <Input
                label="P3 Medium Priority Target SLA (Hours)"
                type="number"
                value={p3SlaHours}
                onChange={(e) => setP3SlaHours(e.target.value)}
                icon={<Clock className="h-3.5 w-3.5" />}
              />

              <Input
                label="Telemetry Sensor Polling Interval (Seconds)"
                type="number"
                value={telemetryRateSeconds}
                onChange={(e) => setTelemetryRateSeconds(e.target.value)}
                icon={<Clock className="h-3.5 w-3.5" />}
                helperText="Frequency for pulling real-time BMS and meter readings."
              />
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E4E1] flex justify-end">
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={<Save className="h-3.5 w-3.5" />}
                loading={saving}
              >
                Update System Rules
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 3: Security & Access */}
      {activeTab === 'security' && (
        <Card
          title="Security Credentials & Authorization Level"
          subtitle="View active session tokens, authorization claims, and identity governance."
        >
          <div className="space-y-4 text-[13px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-4">
                <div className="font-medium text-[10px] uppercase text-[#686866]">Authority Tier</div>
                <div className="text-xl font-light text-[#101010] mt-1">SUPER_ADMIN</div>
                <div className="text-[11px] text-[#15803D] mt-0.5">Unrestricted System Scope</div>
              </div>

              <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-4">
                <div className="font-medium text-[10px] uppercase text-[#686866]">Session Token Signature</div>
                <div className="text-xl font-light text-[#101010] mt-1">HMAC-SHA256</div>
                <div className="text-[11px] text-[#686866] mt-0.5">Cryptographically Sealed</div>
              </div>

              <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-4">
                <div className="font-medium text-[10px] uppercase text-[#686866]">Session Validity</div>
                <div className="text-xl font-light text-[#101010] mt-1">7 Days</div>
                <div className="text-[11px] text-[#686866] mt-0.5">Auto-refreshed on activity</div>
              </div>
            </div>

            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-4 space-y-2">
              <div className="font-normal text-[#101010]">System Passwords & Bootstrap Access</div>
              <p className="text-[12px] text-[#686866]">
                Your root administrator account (admin@entirefm.com) is provisioned with high-security authority across all 133+ operational modules.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: AI Governance & Autonomy */}
      {activeTab === 'ai' && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card
            title="Entire Intelligence Governance & Autonomy Thresholds"
            subtitle="Control autonomous dispatch decisions and human sign-off thresholds."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Autonomous Commercial Threshold (£ GBP)"
                type="number"
                value={aiAutonomyThreshold}
                onChange={(e) => setAiAutonomyThreshold(e.target.value)}
                helperText="AI can automatically approve quotes below this value without human intervention."
              />

              <Input
                label="Evidence Verification Confidence Threshold (%)"
                type="number"
                value={aiConfidenceCutoff}
                onChange={(e) => setAiConfidenceCutoff(e.target.value)}
                helperText="Minimum computer vision and OCR score required to auto-validate compliance certificates."
              />
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E4E1] flex justify-end">
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={<Save className="h-3.5 w-3.5" />}
                loading={saving}
              >
                Save AI Policies
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 5: Notifications & Alerts */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card
            title="Escalation Channels & Notification Subscriptions"
            subtitle="Configure real-time alerts dispatched to your direct email and phone."
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-[8px] border border-[#E4E4E1] bg-[#F9F9F8] cursor-pointer hover:bg-[#FFFFFF]">
                <input
                  type="checkbox"
                  checked={notifyP1Critical}
                  onChange={(e) => setNotifyP1Critical(e.target.checked)}
                  className="rounded text-[#FF6B24] focus:ring-[#FF6B24]"
                />
                <div>
                  <div className="font-normal text-[13px] text-[#101010]">P1 Critical Incident Emergency Broadcast</div>
                  <div className="text-[11.5px] text-[#686866]">Immediate SMS and high-priority email on all priority 1 call-outs.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-[8px] border border-[#E4E4E1] bg-[#F9F9F8] cursor-pointer hover:bg-[#FFFFFF]">
                <input
                  type="checkbox"
                  checked={notifySlaBreaches}
                  onChange={(e) => setNotifySlaBreaches(e.target.checked)}
                  className="rounded text-[#FF6B24] focus:ring-[#FF6B24]"
                />
                <div>
                  <div className="font-normal text-[13px] text-[#101010]">SLA Breach Imminent Warnings (&lt;60m remaining)</div>
                  <div className="text-[11.5px] text-[#686866]">Alert sent when any active work order approaches contractual resolution threshold.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-[8px] border border-[#E4E4E1] bg-[#F9F9F8] cursor-pointer hover:bg-[#FFFFFF]">
                <input
                  type="checkbox"
                  checked={notifyQuoteApprovals}
                  onChange={(e) => setNotifyQuoteApprovals(e.target.checked)}
                  className="rounded text-[#FF6B24] focus:ring-[#FF6B24]"
                />
                <div>
                  <div className="font-normal text-[13px] text-[#101010]">Major Remedial Quote Approval Required</div>
                  <div className="text-[11.5px] text-[#686866]">Notification when quotes exceeding £1,000 are submitted for director sign-off.</div>
                </div>
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E4E1] flex justify-end">
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={<Save className="h-3.5 w-3.5" />}
                loading={saving}
              >
                Save Notification Preferences
              </Button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
