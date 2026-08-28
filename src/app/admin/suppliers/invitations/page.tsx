'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Copy,
  Check,
  Ban,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { CONTRACTOR_MEMBERSHIP_TIERS } from '@/config/supplier-data';

interface InvitationCodeItem {
  id: string;
  code: string;
  tierEligibility: 'TIER_1' | 'TIER_2' | 'ANY';
  feeTreatment: string;
  maxRedemptions: number;
  redemptionsCount: number;
  boundEmail?: string | null;
  boundOrgId?: string | null;
  expiresAt: string;
  internalReason?: string | null;
  createdByAdminId: string;
  isRevoked: boolean;
  createdAt: string;
  status: 'ACTIVE' | 'REDEEMED' | 'REVOKED' | 'EXPIRED';
  redemptions?: Array<{
    id: string;
    supplierOrgId: string;
    redeemedByAuthUserId: string;
    redeemedAt: string;
    membershipTier: string;
    standardAmountGbp: number;
    waivedAmountGbp: number;
    finalAmountGbp: number;
  }>;
}

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<InvitationCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'REDEEMED' | 'REVOKED' | 'EXPIRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invitation Form State
  const [newTierEligibility, setNewTierEligibility] = useState<'ANY' | 'TIER_1' | 'TIER_2'>('ANY');
  const [newMaxRedemptions, setNewMaxRedemptions] = useState<number>(1);
  const [newExpiryDays, setNewExpiryDays] = useState<number>(30);
  const [newBoundEmail, setNewBoundEmail] = useState('');
  const [newInternalReason, setNewInternalReason] = useState('');
  const [createdCodeResult, setCreatedCodeResult] = useState<string | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/suppliers/invitations');
      const data = await res.json();
      if (data.success && Array.isArray(data.codes)) {
        setInvitations(data.codes);
      } else {
        setError(data.error || 'Failed to load invitation codes');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this invitation code? It will immediately become unusable.')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/suppliers/invitations/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRevoked: true }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInvitations();
      } else {
        alert(data.error || 'Failed to revoke code');
      }
    } catch (err: any) {
      alert(err.message || 'Error revoking code');
    }
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('/api/admin/suppliers/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierEligibility: newTierEligibility,
          maxRedemptions: newMaxRedemptions,
          expiryDays: newExpiryDays,
          boundEmail: newBoundEmail.trim() || undefined,
          internalReason: newInternalReason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.invitation) {
        setCreatedCodeResult(data.invitation.code);
        fetchInvitations();
      } else {
        alert(data.error || 'Failed to generate invitation code');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating invitation code');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    if (activeTab !== 'ALL' && inv.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const codeMatch = inv.code.toLowerCase().includes(q);
      const emailMatch = inv.boundEmail?.toLowerCase().includes(q);
      const reasonMatch = inv.internalReason?.toLowerCase().includes(q);
      return codeMatch || emailMatch || reasonMatch;
    }
    return true;
  });

  const counts = {
    ALL: invitations.length,
    ACTIVE: invitations.filter((i) => i.status === 'ACTIVE').length,
    REDEEMED: invitations.filter((i) => i.status === 'REDEEMED').length,
    REVOKED: invitations.filter((i) => i.status === 'REVOKED').length,
    EXPIRED: invitations.filter((i) => i.status === 'EXPIRED').length,
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            <Ticket className="h-4 w-4 text-brand-pink" />
            <span>COMMERCIAL GOVERNANCE &bull; SUPPLIER NETWORK</span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-slate-900 mt-1">
            EntireFM Invitation Codes
          </h1>
          <p className="text-xs text-slate-500 font-light mt-1">
            Issue and govern non-transferable invitation codes that waive contractor membership fees to £0.00 for invited supply chain partners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInvitations}
            className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
            title="Refresh List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setCreatedCodeResult(null);
              setShowCreateModal(true);
            }}
            className="btn-primary text-xs py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Issue Invitation Code
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total Issued', count: counts.ALL, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Active & Valid', count: counts.ACTIVE, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Redeemed', count: counts.REDEEMED, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Revoked', count: counts.REVOKED, color: 'text-rose-700', bg: 'bg-rose-50' },
          { label: 'Expired', count: counts.EXPIRED, color: 'text-amber-700', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 border border-slate-200 rounded-sm ${stat.bg}`}>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block">
              {stat.label}
            </span>
            <span className={`text-2xl font-light tracking-tight mt-1 block ${stat.color}`}>
              {stat.count}
            </span>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 border-b border-slate-200 sm:border-0 pb-2 sm:pb-0">
          {(['ALL', 'ACTIVE', 'REDEEMED', 'REVOKED', 'EXPIRED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs rounded-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, email, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 border border-slate-200 rounded text-xs w-full bg-white"
          />
        </div>
      </div>

      {/* Codes Table */}
      <div className="border border-slate-200 rounded-sm bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto text-slate-400 mb-2" />
            Loading invitation codes ledger...
          </div>
        ) : filteredInvitations.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No invitation codes found matching current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900 text-white text-[10.5px] uppercase tracking-wider font-light">
                <tr>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">Tier Eligibility</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Assigned Contact / Org</th>
                  <th className="p-3.5">Redemptions</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5">Internal Reason</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvitations.map((inv) => {
                  const isCopied = copiedCodeId === inv.id;
                  const isExpired = new Date() > new Date(inv.expiresAt);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm tracking-wide bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {inv.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(inv.code, inv.id)}
                            className="p-1 text-slate-400 hover:text-slate-900 rounded"
                            title="Copy Code"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-medium text-slate-800">
                          {inv.tierEligibility === 'ANY'
                            ? 'All Tiers (£295 / £695)'
                            : inv.tierEligibility === 'TIER_1'
                            ? 'Tier 1 (£295 Member)'
                            : 'Tier 2 (£695 Partner)'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {inv.isRevoked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-100 text-rose-800">
                            <Ban className="h-3 w-3" /> REVOKED
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="h-3 w-3" /> EXPIRED
                          </span>
                        ) : inv.redemptionsCount >= inv.maxRedemptions ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-100 text-blue-800">
                            <CheckCircle2 className="h-3 w-3" /> REDEEMED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                            <Check className="h-3 w-3" /> ACTIVE
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-slate-600">
                        {inv.boundEmail ? (
                          <span className="font-mono text-[11px] text-slate-700">{inv.boundEmail}</span>
                        ) : (
                          <span className="text-slate-400 font-light">Unrestricted (Single-Use)</span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-slate-700">
                        {inv.redemptionsCount} / {inv.maxRedemptions}
                      </td>

                      <td className="p-3.5 text-slate-600">
                        {new Date(inv.expiresAt).toLocaleDateString('en-GB')}
                      </td>

                      <td className="p-3.5 text-slate-500 text-[11px] max-w-xs truncate" title={inv.internalReason || ''}>
                        {inv.internalReason || '—'}
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        {!inv.isRevoked && inv.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevoke(inv.id)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] font-bold hover:underline"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-lg w-full shadow-2xl overflow-hidden space-y-0">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-pink font-bold">
                  COMMERCIAL AUTHORISATION
                </span>
                <h2 className="text-lg font-bold mt-0.5">Issue EntireFM Invitation Code</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {createdCodeResult ? (
              <div className="p-6 space-y-5 text-center">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Invitation Code Created</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide this code to the contractor to waive their membership fee during onboarding:
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono text-xl font-bold text-slate-900 tracking-wider flex items-center justify-center gap-3">
                  <span>{createdCodeResult}</span>
                  <button
                    onClick={() => handleCopyCode(createdCodeResult, 'modal')}
                    className="text-xs bg-slate-900 text-white px-3 py-1 rounded font-sans font-medium hover:bg-slate-800 flex items-center gap-1"
                  >
                    {copiedCodeId === 'modal' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCodeId === 'modal' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreatedCodeResult(null);
                    }}
                    className="btn-primary text-xs py-2 px-5 font-bold"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateInvitation} className="p-6 space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tier Eligibility *</label>
                  <select
                    value={newTierEligibility}
                    onChange={(e) => setNewTierEligibility(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs bg-white"
                  >
                    <option value="ANY">Any Membership Tier (£295 or £695)</option>
                    <option value="TIER_1">Tier 1 Only — Contractor Network Member (£295/yr)</option>
                    <option value="TIER_2">Tier 2 Only — Contractor Network Partner (£695/yr)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Max Redemptions *</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={newMaxRedemptions}
                      onChange={(e) => setNewMaxRedemptions(parseInt(e.target.value) || 1)}
                      className="w-full p-2.5 border border-slate-200 rounded text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Validity Period (Days) *</label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={newExpiryDays}
                      onChange={(e) => setNewExpiryDays(parseInt(e.target.value) || 30)}
                      className="w-full p-2.5 border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Restricted Contact Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. director@contractor.example.co.uk"
                    value={newBoundEmail}
                    onChange={(e) => setNewBoundEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                  <span className="text-[10.5px] text-slate-400">
                    If set, only an application with this primary email address may redeem the code.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Internal Commercial Reason *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Strategic HVAC partner invitation by Operations Director"
                    value={newInternalReason}
                    onChange={(e) => setNewInternalReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded text-xs"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="btn-primary text-xs py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isCreating ? 'Generating...' : 'Generate Code'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
