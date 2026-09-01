'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface DirectoryUser {
  auth_user_id: string;
  email: string;
  email_verified: boolean;
  display_name: string;
  first_name?: string;
  last_name?: string;
  is_lobby_member: boolean;
  lobby_member_status: string;
  lobby_username?: string;
  lobby_joined_at?: string;
  operational_identity_type: 'CLIENT' | 'ENGINEER' | 'CONTRACTOR' | 'NONE';
  operational_status: string;
  organisation_id?: string;
  organisation_name?: string;
  operational_role_code: string;
  auth_created_at: string;
  last_sign_in_at?: string;
}

interface Props {
  users: DirectoryUser[];
  initialLobbyFilter: string;
  initialOpFilter: string;
  initialSearch: string;
}

export function AdminUsersDirectoryTable({
  users,
  initialLobbyFilter,
  initialOpFilter,
  initialSearch,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [selectedUser, setSelectedUser] = useState<DirectoryUser | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'transition' | 'audit'>('details');
  const [newOpType, setNewOpType] = useState<string>('NONE');
  const [newOrgName, setNewOrgName] = useState<string>('');
  const [newLobbyStatus, setNewLobbyStatus] = useState<string>('active');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);

  // Update URL params
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', search);
  };

  const handleOpenUserModal = async (user: DirectoryUser) => {
    setSelectedUser(user);
    setNewOpType(user.operational_identity_type || 'NONE');
    setNewOrgName(user.organisation_name || '');
    setNewLobbyStatus(user.lobby_member_status === 'none' ? 'active' : user.lobby_member_status);
    setActiveModalTab('details');
    setActionFeedback(null);

    // Fetch audit trail
    try {
      const res = await fetch(`/api/admin/users/${user.auth_user_id}`);
      if (res.ok) {
        const data = await res.json();
        setAuditTrail(data.auditTrail || []);
      }
    } catch (err) {
      console.error('Failed to load audit trail', err);
    }
  };

  const handleSaveOperationalTransition = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setActionFeedback(null);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.auth_user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SET_OPERATIONAL_IDENTITY',
          operationalType: newOpType,
          organisationName: newOrgName,
          previousType: selectedUser.operational_identity_type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update operational identity');

      setActionFeedback({ type: 'success', message: 'Operational identity transitioned successfully.' });
      router.refresh();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Error executing transition.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveLobbyStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setActionFeedback(null);

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.auth_user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SET_LOBBY_STATUS',
          lobbyStatus: newLobbyStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update Lobby status');

      setActionFeedback({ type: 'success', message: 'Lobby status updated successfully.' });
      router.refresh();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Error updating Lobby status.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar: Search + Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-brand-carbon/40 p-4 rounded-xl border border-white/10">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="Search by name, email, organisation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-brand-void/80 border border-white/15 rounded-lg px-3.5 py-2 text-xs text-white placeholder-brand-mist/40 w-full focus:outline-none focus:border-brand-electric"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-light rounded-lg transition"
          >
            Search
          </button>
        </form>

        {/* Filter Groups */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Lobby Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-normal uppercase text-brand-mist/50 tracking-wider">Lobby:</span>
            {[
              { label: 'All', value: '' },
              { label: 'Members', value: 'member' },
              { label: 'Pending', value: 'pending' },
              { label: 'Non-Members', value: 'non_member' },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter('lobby', t.value)}
                className={`px-2.5 py-1 text-xs rounded-md transition ${
                  initialLobbyFilter === t.value
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-brand-void/60 text-brand-mist/70 hover:text-white border border-transparent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Operational Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-normal uppercase text-brand-mist/50 tracking-wider">Operational:</span>
            {[
              { label: 'All', value: '' },
              { label: 'Contractors', value: 'CONTRACTOR' },
              { label: 'Clients', value: 'CLIENT' },
              { label: 'Engineers', value: 'ENGINEER' },
              { label: 'None', value: 'NONE' },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter('operational', t.value)}
                className={`px-2.5 py-1 text-xs rounded-md transition ${
                  initialOpFilter.toUpperCase() === t.value
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-brand-void/60 text-brand-mist/70 hover:text-white border border-transparent'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="rounded-xl border border-white/10 bg-brand-carbon/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-brand-void/80 text-brand-mist/60 font-medium text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Name & Email</th>
                <th className="px-4 py-3.5 text-center">Email Verified</th>
                <th className="px-5 py-3.5">Lobby Membership</th>
                <th className="px-5 py-3.5">Operational Identity</th>
                <th className="px-5 py-3.5">Organisation</th>
                <th className="px-5 py-3.5">Registered / Active</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-light">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-brand-mist/50">
                    No individual identities match the selected filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.auth_user_id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => handleOpenUserModal(user)}
                  >
                    {/* Name & Email */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-void border border-white/10 flex items-center justify-center text-xs font-normal text-white uppercase shrink-0">
                          {user.display_name?.slice(0, 2) || user.email.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-normal text-white text-sm group-hover:text-brand-electric transition">
                            {user.display_name}
                          </div>
                          <div className="font-normal text-[11px] text-brand-mist/60">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email Verified */}
                    <td className="px-4 py-3.5 text-center">
                      {user.email_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Unconfirmed
                        </span>
                      )}
                    </td>

                    {/* Lobby Membership */}
                    <td className="px-5 py-3.5">
                      {user.is_lobby_member ? (
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded border ${
                              user.lobby_member_status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            ● Lobby Member ({user.lobby_member_status})
                          </span>
                          {user.lobby_username && (
                            <Link
                              href={`/lobby/community/members/${user.lobby_username}`}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="block text-[11px] text-brand-mist/50 hover:text-brand-electric transition underline decoration-white/20"
                            >
                              @{user.lobby_username} ↗
                            </Link>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] font-normal text-brand-mist/40">
                          Non-Member
                        </span>
                      )}
                    </td>

                    {/* Operational Identity */}
                    <td className="px-5 py-3.5">
                      {user.operational_identity_type === 'CONTRACTOR' ? (
                        <span className="inline-flex items-center text-[11px] font-normal bg-blue-500/15 text-blue-300 px-2.5 py-0.5 rounded border border-blue-500/30">
                          Contractor ({user.operational_status || 'Active'})
                        </span>
                      ) : user.operational_identity_type === 'CLIENT' ? (
                        <span className="inline-flex items-center text-[11px] font-normal bg-indigo-500/15 text-indigo-300 px-2.5 py-0.5 rounded border border-indigo-500/30">
                          Client ({user.operational_status || 'Active'})
                        </span>
                      ) : user.operational_identity_type === 'ENGINEER' ? (
                        <span className="inline-flex items-center text-[11px] font-normal bg-purple-500/15 text-purple-300 px-2.5 py-0.5 rounded border border-purple-500/30">
                          Field Engineer
                        </span>
                      ) : (
                        <span className="text-[11px] font-normal text-brand-mist/40">
                          None (Lobby Only)
                        </span>
                      )}
                    </td>

                    {/* Organisation */}
                    <td className="px-5 py-3.5">
                      <div className="text-white/80">
                        {user.organisation_name || <span className="text-brand-mist/40">—</span>}
                      </div>
                      {user.organisation_id && (
                        <div className="text-[10px] font-normal text-brand-mist/40">
                          {user.organisation_id}
                        </div>
                      )}
                    </td>

                    {/* Timestamps */}
                    <td className="px-5 py-3.5">
                      <div className="text-brand-mist/80 text-[11px]">
                        Joined {new Date(user.auth_created_at).toLocaleDateString('en-GB')}
                      </div>
                      <div className="text-[10px] font-normal text-brand-mist/40">
                        {user.last_sign_in_at
                          ? `Active ${new Date(user.last_sign_in_at).toLocaleDateString('en-GB')}`
                          : 'Never signed in'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenUserModal(user);
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] transition"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail & Role Transition Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-carbon border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between bg-brand-void/40">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-light text-white">{selectedUser.display_name}</h2>
                  {selectedUser.email_verified && (
                    <span className="text-[10px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs font-normal text-brand-mist/60 mt-0.5">{selectedUser.email}</p>
                <p className="text-[10px] font-normal text-brand-mist/40 mt-1">
                  Canonical Auth UUID: <code className="text-brand-electric">{selectedUser.auth_user_id}</code>
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center border-b border-white/10 px-6 bg-brand-void/20">
              <button
                onClick={() => setActiveModalTab('details')}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition ${
                  activeModalTab === 'details'
                    ? 'border-brand-electric text-white'
                    : 'border-transparent text-brand-mist/60 hover:text-white'
                }`}
              >
                Identity Overview
              </button>
              <button
                onClick={() => setActiveModalTab('transition')}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition ${
                  activeModalTab === 'transition'
                    ? 'border-brand-electric text-white'
                    : 'border-transparent text-brand-mist/60 hover:text-white'
                }`}
              >
                Role & Permissions Transition
              </button>
              <button
                onClick={() => setActiveModalTab('audit')}
                className={`py-3 px-4 text-xs font-medium border-b-2 transition ${
                  activeModalTab === 'audit'
                    ? 'border-brand-electric text-white'
                    : 'border-transparent text-brand-mist/60 hover:text-white'
                }`}
              >
                Audit Trail ({auditTrail.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {actionFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-normal ${
                    actionFeedback.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {actionFeedback.message}
                </div>
              )}

              {/* Tab: Overview */}
              {activeModalTab === 'details' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-void/60 p-3.5 rounded-lg border border-white/5 space-y-1">
                      <span className="text-[10px] font-normal uppercase text-brand-mist/50 block">Lobby Axis</span>
                      <div className="text-sm font-normal text-white">
                        {selectedUser.is_lobby_member ? 'Active Lobby Member' : 'Non-Member'}
                      </div>
                      <div className="text-brand-mist/70 text-[11px]">
                        Status: {selectedUser.lobby_member_status}
                      </div>
                      {selectedUser.lobby_username && (
                        <div className="text-brand-mist/50 text-[11px]">
                          Username: @{selectedUser.lobby_username}
                        </div>
                      )}
                    </div>

                    <div className="bg-brand-void/60 p-3.5 rounded-lg border border-white/5 space-y-1">
                      <span className="text-[10px] font-normal uppercase text-brand-mist/50 block">Operational Axis</span>
                      <div className="text-sm font-normal text-white">
                        {selectedUser.operational_identity_type}
                      </div>
                      <div className="text-brand-mist/70 text-[11px]">
                        Organisation: {selectedUser.organisation_name || 'None'}
                      </div>
                      <div className="text-brand-mist/50 text-[11px]">
                        Role Code: {selectedUser.operational_role_code}
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-void/40 p-4 rounded-lg border border-white/5 space-y-2">
                    <span className="text-[10px] font-normal uppercase text-brand-mist/50 block">Exclusivity Guarantee</span>
                    <p className="text-brand-mist/80 font-light leading-relaxed">
                      This user is backed by a single canonical Supabase Auth user ID. Database constraints strictly prohibit simultaneous Client, Engineer, or Contractor operational identities while preserving optional Lobby membership.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab: Role Transition */}
              {activeModalTab === 'transition' && (
                <div className="space-y-6 text-xs">
                  {/* Operational Role Transition */}
                  <div className="space-y-3 bg-brand-void/60 p-4 rounded-xl border border-white/10">
                    <h3 className="text-sm font-normal text-white">Operational Identity Transition</h3>
                    <p className="text-brand-mist/70 font-light">
                      Enforces exclusivity at database constraint level. Selecting a new operational identity replaces any prior operational role while preserving Lobby profile data.
                    </p>

                    <div className="space-y-2 pt-2">
                      <label className="text-[11px] font-normal uppercase text-brand-mist/60 block">
                        Target Operational Identity:
                      </label>
                      <select
                        value={newOpType}
                        onChange={(e) => setNewOpType(e.target.value)}
                        className="w-full bg-brand-void border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-electric"
                      >
                        <option value="NONE">NONE (No Operational Access — Lobby Only)</option>
                        <option value="CONTRACTOR">CONTRACTOR (Supplier / Service Partner)</option>
                        <option value="CLIENT">CLIENT (Commercial Client / FM Manager)</option>
                        <option value="ENGINEER">ENGINEER (Field Mechanical & Electrical Specialist)</option>
                      </select>
                    </div>

                    {newOpType !== 'NONE' && (
                      <div className="space-y-2 pt-2">
                        <label className="text-[11px] font-normal uppercase text-brand-mist/60 block">
                          Organisation Name:
                        </label>
                        <input
                          type="text"
                          value={newOrgName}
                          onChange={(e) => setNewOrgName(e.target.value)}
                          placeholder="e.g. FireJet Services Ltd"
                          className="w-full bg-brand-void border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-electric"
                        />
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={handleSaveOperationalTransition}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-brand-electric hover:bg-brand-electric/90 text-white font-medium rounded-lg text-xs transition disabled:opacity-50"
                      >
                        {actionLoading ? 'Saving...' : 'Apply Operational Transition →'}
                      </button>
                    </div>
                  </div>

                  {/* Lobby Membership Status */}
                  {selectedUser.is_lobby_member && (
                    <div className="space-y-3 bg-brand-void/60 p-4 rounded-xl border border-white/10">
                      <h3 className="text-sm font-normal text-white">Lobby Membership Status</h3>
                      <div className="space-y-2">
                        <label className="text-[11px] font-normal uppercase text-brand-mist/60 block">
                          Status:
                        </label>
                        <select
                          value={newLobbyStatus}
                          onChange={(e) => setNewLobbyStatus(e.target.value)}
                          className="w-full bg-brand-void border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-electric"
                        >
                          <option value="active">Active</option>
                          <option value="pending_verification">Pending Verification</option>
                          <option value="suspended">Suspended</option>
                          <option value="banned">Banned</option>
                        </select>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={handleSaveLobbyStatus}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-medium rounded-lg text-xs transition disabled:opacity-50"
                        >
                          {actionLoading ? 'Updating...' : 'Update Lobby Status'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Audit Trail */}
              {activeModalTab === 'audit' && (
                <div className="space-y-3">
                  {auditTrail.length === 0 ? (
                    <p className="text-xs text-brand-mist/50">No recorded audit events for this identity.</p>
                  ) : (
                    <div className="space-y-2">
                      {auditTrail.map((ev, idx) => (
                        <div
                          key={ev.id || idx}
                          className="p-3 bg-brand-void/60 rounded-lg border border-white/5 font-normal text-[11px] space-y-1"
                        >
                          <div className="flex items-center justify-between text-brand-electric">
                            <span>{ev.action}</span>
                            <span className="text-brand-mist/40 text-[10px]">
                              {new Date(ev.created_at).toLocaleString('en-GB')}
                            </span>
                          </div>
                          <div className="text-brand-mist/60 text-[10px]">
                            Actor: {ev.actor_id}
                          </div>
                          {ev.details && (
                            <div className="text-brand-mist/80 text-[10px] break-all bg-brand-carbon/60 p-1.5 rounded">
                              {JSON.stringify(ev.details)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
