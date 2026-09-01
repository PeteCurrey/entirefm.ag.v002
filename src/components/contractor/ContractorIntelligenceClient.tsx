'use client';

import { useState, useEffect } from 'react';
import type {
  ContractorIntelligenceFeed,
  PersonalisedItem,
  CompanyWatchRecord,
  CredentialWatchSummary,
  ContractorActionRecord,
} from '@/server/intelligence/intelligence-engine';
import { IntelligenceActionModal } from './IntelligenceActionModal';

interface ContractorIntelligenceClientProps {
  initialFeed: ContractorIntelligenceFeed;
  initialCompanyWatch: CompanyWatchRecord;
  initialCredentialWatch: CredentialWatchSummary;
}

type TabKey =
  | 'FOR_YOU'
  | 'COMPLIANCE'
  | 'COMPANY_WATCH'
  | 'CREDENTIAL_WATCH'
  | 'TRADE_UPDATES'
  | 'SAFETY_ALERTS'
  | 'STANDARDS'
  | 'CPD'
  | 'REVIEWED';

export function ContractorIntelligenceClient({
  initialFeed,
  initialCompanyWatch,
  initialCredentialWatch,
}: ContractorIntelligenceClientProps) {
  const [feed, setFeed] = useState<ContractorIntelligenceFeed>(initialFeed);
  const [companyWatch, setCompanyWatch] = useState<CompanyWatchRecord>(initialCompanyWatch);
  const [credentialWatch, setCredentialWatch] = useState<CredentialWatchSummary>(initialCredentialWatch);
  const [activeTab, setActiveTab] = useState<TabKey>('FOR_YOU');
  const [selectedItemForAction, setSelectedItemForAction] = useState<PersonalisedItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const tabs: { id: TabKey; label: string; count?: number; badgeColor?: string }[] = [
    { id: 'FOR_YOU', label: 'For You', count: feed.forYou.length, badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'COMPLIANCE', label: 'Compliance Watch', count: feed.complianceWatch.length, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'COMPANY_WATCH', label: 'Company Watch', count: companyWatch.companyStatus !== 'ACTIVE' && companyWatch.companyStatus !== 'UNVERIFIED' ? 1 : 0, badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'CREDENTIAL_WATCH', label: 'Credential Watch', count: credentialWatch.expiringWithin90DaysCount || undefined, badgeColor: 'bg-orange-100 text-orange-800' },
    { id: 'TRADE_UPDATES', label: 'Trade Updates', count: feed.tradeUpdates.length },
    { id: 'SAFETY_ALERTS', label: 'Safety Alerts', count: feed.safetyAlerts.length, badgeColor: 'bg-red-100 text-red-800' },
    { id: 'STANDARDS', label: 'Standards & Technical', count: feed.technicalStandards.length },
    { id: 'CPD', label: 'CPD & Guidance', count: feed.cpdEvents.length },
    { id: 'REVIEWED', label: 'History / Reviewed', count: feed.reviewed.length },
  ];

  function handleActionRecorded(action: ContractorActionRecord) {
    // Update local feed item state
    setFeed((prev) => {
      const updateList = (list: PersonalisedItem[]) =>
        list.map((p) => (p.item.id === action.intelligenceItemId ? { ...p, actionStatus: action, isActioned: true } : p));
      return {
        ...prev,
        forYou: updateList(prev.forYou),
        complianceWatch: updateList(prev.complianceWatch),
        tradeUpdates: updateList(prev.tradeUpdates),
        safetyAlerts: updateList(prev.safetyAlerts),
        technicalStandards: updateList(prev.technicalStandards),
        cpdEvents: updateList(prev.cpdEvents),
      };
    });
  }

  function handleAcknowledged(itemId: string) {
    setFeed((prev) => {
      const acknowledgedItem = prev.forYou.find((p) => p.item.id === itemId);
      const filterOut = (list: PersonalisedItem[]) => list.filter((p) => p.item.id !== itemId);
      const updatedReviewed = acknowledgedItem
        ? [{ ...acknowledgedItem, isAcknowledged: true }, ...prev.reviewed]
        : prev.reviewed;

      return {
        ...prev,
        forYou: filterOut(prev.forYou),
        complianceWatch: filterOut(prev.complianceWatch),
        tradeUpdates: filterOut(prev.tradeUpdates),
        safetyAlerts: filterOut(prev.safetyAlerts),
        technicalStandards: filterOut(prev.technicalStandards),
        cpdEvents: filterOut(prev.cpdEvents),
        reviewed: updatedReviewed,
        pendingActionCount: Math.max(0, prev.pendingActionCount - 1),
      };
    });
  }

  // Filter items by search query
  function filterItems(items: PersonalisedItem[]) {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (p) =>
        p.item.title.toLowerCase().includes(q) ||
        p.item.entirefmSummary.toLowerCase().includes(q) ||
        p.item.tradeTags.some((t) => t.toLowerCase().includes(q)) ||
        p.matchedCredentials.some((c) => c.toLowerCase().includes(q))
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-800/50">
                CP-09 Intelligence Centre
              </span>
              <span className="text-xs text-slate-400">Personalised to {feed.contractorName}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Contractor Intelligence & Live Compliance Watch</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Authoritative statutory changes, trade body guidance, safety notices, and credential surveillance matched to your trades and operating areas.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center min-w-[100px]">
              <span className="block text-2xl font-bold text-amber-300">{feed.pendingActionCount}</span>
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wide">Pending</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center min-w-[100px]">
              <span className="block text-2xl font-bold text-rose-400">{feed.unacknowledgedCriticalCount}</span>
              <span className="text-[11px] font-medium text-slate-300 uppercase tracking-wide">High Priority</span>
            </div>
          </div>
        </div>

        {/* Trade & Jurisdiction Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <span className="font-medium text-slate-400">Active Profile:</span>
          {feed.tradeProfile.map((t) => (
            <span key={t} className="bg-slate-800/80 text-slate-200 px-2.5 py-0.5 rounded-full border border-slate-700">
              {t.replace(/_/g, ' ')}
            </span>
          ))}
          <span className="text-slate-500">•</span>
          {feed.jurisdictions.map((j) => (
            <span key={j} className="bg-indigo-950/80 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
              {j}
            </span>
          ))}
        </div>
      </div>

      {/* Search & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 gap-1 border-b md:border-none border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search updates, trades, rules…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="min-h-[400px]">
        {/* 1. FOR YOU */}
        {activeTab === 'FOR_YOU' && (
          <div className="space-y-4">
            {filterItems(feed.forYou).length === 0 ? (
              <EmptyState message="No pending intelligence items matching your profile and search criteria." />
            ) : (
              filterItems(feed.forYou).map((item) => (
                <IntelligenceItemCard
                  key={item.item.id}
                  pItem={item}
                  onOpenActionModal={() => setSelectedItemForAction(item)}
                />
              ))
            )}
          </div>
        )}

        {/* 2. COMPLIANCE WATCH */}
        {activeTab === 'COMPLIANCE' && (
          <div className="space-y-4">
            {filterItems(feed.complianceWatch).length === 0 ? (
              <EmptyState message="No pending compliance or regulatory updates." />
            ) : (
              filterItems(feed.complianceWatch).map((item) => (
                <IntelligenceItemCard
                  key={item.item.id}
                  pItem={item}
                  onOpenActionModal={() => setSelectedItemForAction(item)}
                />
              ))
            )}
          </div>
        )}

        {/* 3. COMPANY WATCH */}
        {activeTab === 'COMPANY_WATCH' && (
          <CompanyWatchView companyWatch={companyWatch} />
        )}

        {/* 4. CREDENTIAL WATCH */}
        {activeTab === 'CREDENTIAL_WATCH' && (
          <CredentialWatchView credentialWatch={credentialWatch} />
        )}

        {/* 5. TRADE UPDATES */}
        {activeTab === 'TRADE_UPDATES' && (
          <div className="space-y-4">
            {filterItems(feed.tradeUpdates).length === 0 ? (
              <EmptyState message="No trade body updates matching your trade profile." />
            ) : (
              filterItems(feed.tradeUpdates).map((item) => (
                <IntelligenceItemCard
                  key={item.item.id}
                  pItem={item}
                  onOpenActionModal={() => setSelectedItemForAction(item)}
                />
              ))
            )}
          </div>
        )}

        {/* 6. SAFETY ALERTS */}
        {activeTab === 'SAFETY_ALERTS' && (
          <div className="space-y-4">
            {filterItems(feed.safetyAlerts).length === 0 ? (
              <EmptyState message="No active safety alerts or enforcement notices." />
            ) : (
              filterItems(feed.safetyAlerts).map((item) => (
                <IntelligenceItemCard
                  key={item.item.id}
                  pItem={item}
                  onOpenActionModal={() => setSelectedItemForAction(item)}
                />
              ))
            )}
          </div>
        )}

        {/* 7. STANDARDS */}
        {activeTab === 'STANDARDS' && (
          <div className="space-y-4">
            {filterItems(feed.technicalStandards).length === 0 ? (
              <EmptyState message="No technical standard amendments or updates pending." />
            ) : (
              filterItems(feed.technicalStandards).map((item) => (
                <IntelligenceItemCard
                  key={item.item.id}
                  pItem={item}
                  onOpenActionModal={() => setSelectedItemForAction(item)}
                />
              ))
            )}
          </div>
        )}

        {/* 8. CPD */}
        {activeTab === 'CPD' && (
          <div className="space-y-4">
            {filterItems(feed.cpdEvents).length === 0 ? (
              <EmptyState message="No CPD events or technical briefings currently scheduled." />
            ) : (
              filterItems(feed.cpdEvents).map((item) => (
                <IntelligenceItemCard
                  key={item.item.id}
                  pItem={item}
                  onOpenActionModal={() => setSelectedItemForAction(item)}
                />
              ))
            )}
          </div>
        )}

        {/* 9. REVIEWED */}
        {activeTab === 'REVIEWED' && (
          <div className="space-y-4">
            {feed.reviewed.length === 0 ? (
              <EmptyState message="No acknowledged items in your history yet." />
            ) : (
              feed.reviewed.map((item) => (
                <IntelligenceItemCard
                  key={item.item.id}
                  pItem={item}
                  isReviewedView
                  onOpenActionModal={() => setSelectedItemForAction(item)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Action / Response Modal */}
      {selectedItemForAction && (
        <IntelligenceActionModal
          item={selectedItemForAction.item}
          contractorOrgId={feed.contractorOrgId}
          onClose={() => setSelectedItemForAction(null)}
          onActionRecorded={(action) => {
            handleActionRecorded(action);
            setSelectedItemForAction(null);
          }}
          onAcknowledged={() => {
            handleAcknowledged(selectedItemForAction.item.id);
            setSelectedItemForAction(null);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function IntelligenceItemCard({
  pItem,
  onOpenActionModal,
  isReviewedView = false,
}: {
  pItem: PersonalisedItem;
  onOpenActionModal: () => void;
  isReviewedView?: boolean;
}) {
  const { item, whyYoureSeeing, actionStatus, isAcknowledged } = pItem;

  const severityBadges: Record<string, { label: string; style: string }> = {
    CRITICAL: { label: 'Critical Action', style: 'bg-rose-100 text-rose-800 border-rose-200' },
    ACTION_REQUIRED: { label: 'Action Required', style: 'bg-orange-100 text-orange-800 border-orange-200' },
    ACTION_MAY_BE_REQUIRED: { label: 'Review Recommended', style: 'bg-amber-100 text-amber-800 border-amber-200' },
    TECHNICAL_UPDATE: { label: 'Technical Update', style: 'bg-blue-100 text-blue-800 border-blue-200' },
    ADVISORY: { label: 'Advisory', style: 'bg-slate-100 text-slate-800 border-slate-200' },
    INFORMATION: { label: 'Information', style: 'bg-gray-100 text-gray-700 border-gray-200' },
  };

  const badge = severityBadges[item.severity] || severityBadges.INFORMATION;

  return (
    <div className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow transition-all ${
      isAcknowledged ? 'border-gray-200 opacity-80' : 'border-gray-200'
    }`}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Tag row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.style}`}>
              {badge.label}
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              Tier {item.authorityTier} • {item.sourceName}
            </span>
            {item.jurisdictions.map((j) => (
              <span key={j} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                {j}
              </span>
            ))}
          </div>

          <h3 className="text-base font-bold text-gray-900 leading-snug">{item.title}</h3>

          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.entirefmSummary}</p>

          {item.whatChanged && (
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700">
              <strong className="text-slate-900">What Changed: </strong>
              {item.whatChanged}
            </div>
          )}

          {/* Why You're Seeing This */}
          {whyYoureSeeing.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">Matched:</span>
              {whyYoureSeeing.map((w, idx) => (
                <span key={idx} className="text-[11px] text-indigo-800 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                  {w}
                </span>
              ))}
            </div>
          )}

          {/* Action / status bar */}
          {actionStatus && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-800 flex items-center justify-between">
              <span>
                <strong>Action recorded:</strong> {actionStatus.actionType.replace(/_/g, ' ')}
                {actionStatus.assignedTo ? ` (Assigned to: ${actionStatus.assignedTo})` : ''}
              </span>
              {actionStatus.dueDate && <span className="text-emerald-700 font-medium">Due: {actionStatus.dueDate}</span>}
            </div>
          )}
        </div>

        {/* Right side CTA */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
          <button
            onClick={onOpenActionModal}
            className="w-full md:w-auto px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            {isAcknowledged ? 'Update Response' : 'Review & Respond'}
          </button>
          <a
            href={item.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1"
          >
            Official Source ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function CompanyWatchView({ companyWatch }: { companyWatch: CompanyWatchRecord }) {
  const isHealthy = companyWatch.companyStatus === 'ACTIVE' && !companyWatch.accounts.overdue && !companyWatch.confirmationStatement.overdue;

  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-xl border ${isHealthy ? 'bg-emerald-50/50 border-emerald-200' : 'bg-amber-50/50 border-amber-200'}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <h2 className="text-lg font-bold text-gray-900">{companyWatch.companyName}</h2>
              <span className="text-xs text-gray-500 font-normal">({companyWatch.companyNumber})</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Live corporate status monitored via Companies House UK Public Data API.
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            companyWatch.companyStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {companyWatch.companyStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] text-gray-500 uppercase font-semibold block">Accounts Filing</span>
            <span className="text-sm font-bold text-gray-900 block mt-1">
              {companyWatch.accounts.nextDueDate ? `Due: ${companyWatch.accounts.nextDueDate}` : 'Up to date'}
            </span>
            <span className={`text-[11px] ${companyWatch.accounts.overdue ? 'text-rose-600 font-bold' : 'text-emerald-600'}`}>
              {companyWatch.accounts.overdue ? '⚠️ Overdue' : '✓ Good Standing'}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] text-gray-500 uppercase font-semibold block">Confirmation Statement</span>
            <span className="text-sm font-bold text-gray-900 block mt-1">
              {companyWatch.confirmationStatement.nextDueDate ? `Due: ${companyWatch.confirmationStatement.nextDueDate}` : 'Up to date'}
            </span>
            <span className={`text-[11px] ${companyWatch.confirmationStatement.overdue ? 'text-rose-600 font-bold' : 'text-emerald-600'}`}>
              {companyWatch.confirmationStatement.overdue ? '⚠️ Overdue' : '✓ Good Standing'}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] text-gray-500 uppercase font-semibold block">Corporate Health</span>
            <span className="text-sm font-bold text-gray-900 block mt-1">
              {companyWatch.apiAvailable ? (companyWatch.degraded ? 'Degraded API' : 'Live Connected') : 'Not Configured'}
            </span>
            <span className="text-[11px] text-gray-500">
              Checked: {new Date(companyWatch.lastCheckedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CredentialWatchView({ credentialWatch }: { credentialWatch: CredentialWatchSummary }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-1">Company Credentials & Closed Register Surveillance</h2>
        <p className="text-xs text-gray-500 mb-4">
          All statutory trade accreditations, Gas Safe, REFCOM, NICEIC, and SIA registrations tracked for validity.
        </p>

        {credentialWatch.organisationCredentials.length === 0 ? (
          <EmptyState message="No organisation credentials registered yet." />
        ) : (
          <div className="divide-y divide-gray-100">
            {credentialWatch.organisationCredentials.map((cred, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{cred.credentialType}</span>
                    {cred.isClosedRegister && (
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                        Closed Register
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {cred.issuingBody} {cred.registrationNumber ? `• Reg: ${cred.registrationNumber}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-xs font-semibold block ${
                      cred.status === 'EXPIRED' ? 'text-rose-600' :
                      cred.status === 'EXPIRING' ? 'text-orange-600' : 'text-emerald-600'
                    }`}>
                      {cred.status}
                    </span>
                    {cred.expiryDate && (
                      <span className="text-[11px] text-gray-400">Expires: {cred.expiryDate}</span>
                    )}
                  </div>

                  {cred.officialRegisterUrl && (
                    <a
                      href={cred.officialRegisterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 bg-indigo-50/50 px-2.5 py-1 rounded-md"
                    >
                      Verify on Register ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
