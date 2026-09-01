import { Metadata } from 'next';
import Link from 'next/link';
import { listEditions, getLobbyDailySettings } from '@/server/lobby-daily/store';
import { listSubscribers } from '@/server/newsletter/store';
import { getDomainAuthStatus } from '@/server/newsletter/provider';
import type { EditionStatus } from '@/server/lobby-daily/types';
import {
  Mail,
  Users,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Settings,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = { title: 'The Lobby Daily Dashboard | EntireFM Admin' };

export default async function LobbyDailyAdminPage() {
  const { editions } = await listEditions({ limit: 30 });
  const settings = await getLobbyDailySettings();
  const { subscribers } = await listSubscribers({ limit: 1000 });
  const domainAuth = getDomainAuthStatus();

  // Count daily subscribers (having DAILY_LOBBY in interests or preferences)
  const dailySubscribers = subscribers.filter(
    (s) => s.status === 'ACTIVE' && (s.interests?.includes('DAILY_LOBBY') || s.interests?.includes('ALL'))
  ).length;

  const totalActiveSubscribers = subscribers.filter((s) => s.status === 'ACTIVE').length;

  const draftEditions = editions.filter((e) => e.status === 'DRAFT' || e.status === 'AWAITING_APPROVAL');
  const scheduledEditions = editions.filter((e) => e.status === 'SCHEDULED');
  const sentEditions = editions.filter((e) => e.status === 'SENT');

  const statusColor: Record<EditionStatus, string> = {
    DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    AWAITING_APPROVAL: 'bg-amber-950/60 text-amber-300 border-amber-800',
    SCHEDULED: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
    SENDING: 'bg-blue-950/60 text-blue-300 border-blue-800',
    SENT: 'bg-zinc-900 text-zinc-400 border-zinc-800',
    PAUSED: 'bg-rose-950/60 text-rose-300 border-rose-800',
    FAILED: 'bg-rose-950/60 text-rose-300 border-rose-800',
    CANCELLED: 'bg-zinc-950 text-zinc-600 border-zinc-900',
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-medium">
              THE LOBBY DAILY
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-normal bg-zinc-800 text-zinc-300 border border-zinc-700">
              06:45 UK Weekday Edition
            </span>
          </div>
          <h1 className="text-2xl font-light text-white mt-1">Daily Briefing Control Plane</h1>
          <p className="text-sm text-zinc-400">
            Automated intelligence ingestion, QA validation, human editorial sign-off, and multi-tenant delivery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/lobby/newsletters/analytics"
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-2 rounded-lg border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <BarChart3 className="h-3.5 w-3.5 text-zinc-400" /> Analytics
          </Link>
          <Link
            href="/admin/lobby/newsletters/settings"
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-2 rounded-lg border border-zinc-800 flex items-center gap-1.5 transition-colors"
          >
            <Settings className="h-3.5 w-3.5 text-zinc-400" /> Settings
          </Link>
          <a
            href="/lobby/daily"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" /> Public Archive
          </a>
        </div>
      </div>

      {/* Kill switch / Auth Warning */}
      {settings.emergencyKillSwitch && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-4 flex items-start gap-3 text-rose-200">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-rose-300 uppercase tracking-wide">
              EMERGENCY KILL-SWITCH ACTIVE
            </h4>
            <p className="text-rose-200/80">
              All automated daily drafting and dispatch operations are currently halted. Disable kill-switch in settings to resume.
            </p>
          </div>
        </div>
      )}

      {!domainAuth.canSend && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-medium text-amber-300">EMAIL DELIVERY: SANDBOX / MOCK MODE</h4>
            <p className="text-amber-200/80 leading-relaxed">
              {domainAuth.statusMessage}. Test emails and dispatch runs will be captured in the database and logged.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Daily Subscribers</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-light text-white">{dailySubscribers}</div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {totalActiveSubscribers} total across all lists
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pending Approvals</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-light text-white">
            {scheduledEditions.length + draftEditions.length}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {scheduledEditions.length} scheduled • {draftEditions.length} drafts
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Sent Editions</span>
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-light text-white">{sentEditions.length}</div>
          <div className="mt-1 text-[11px] text-zinc-500">Weekday publishing history</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Approval Gate</span>
            <ShieldCheck className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-lg font-light text-white">
            {settings.manualApprovalRequired ? 'MANUAL REQUIRED' : 'AUTO-SEND'}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Dispatch at {settings.sendTimeLondon} UK
          </div>
        </div>
      </div>

      {/* Editions List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-white">Daily Editions</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review, edit, validate, and approve weekday morning briefings.
            </p>
          </div>
        </div>

        {editions.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-3">
            <Mail className="h-8 w-8 mx-auto text-zinc-600 stroke-[1.5]" />
            <p className="text-sm">No editions generated yet.</p>
            <p className="text-xs text-zinc-600 max-w-md mx-auto">
              Editions are automatically drafted every weekday at 05:00 UK time, or triggered via the cron API.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {editions.map((edition) => (
              <div
                key={edition.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-normal px-2 py-0.5 rounded border uppercase ${
                        statusColor[edition.status] || 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {edition.status}
                    </span>
                    <span className="text-xs font-normal text-zinc-500">#{edition.editionNumber}</span>
                    <span className="text-xs text-zinc-400">• {edition.masthead?.ukDateFormatted || edition.editionDate}</span>
                    {edition.validationPassed ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-normal">
                        <CheckCircle2 className="h-3 w-3" /> QA Passed
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 flex items-center gap-1 font-normal">
                        <AlertTriangle className="h-3 w-3" /> QA Issues
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-zinc-200 truncate">{edition.subjectLine}</h3>
                  <p className="text-xs text-zinc-400 truncate">{edition.preheader}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {edition.status === 'SENT' && (
                    <div className="text-right text-xs font-normal text-zinc-400 hidden md:block">
                      <div>{edition.totalDelivered} delivered</div>
                      <div className="text-[10px] text-zinc-500">{edition.totalOpened} opened</div>
                    </div>
                  )}

                  <Link
                    href={`/admin/lobby/newsletters/${edition.id}`}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-1 transition-colors"
                  >
                    Open Editor <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
