'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Plus,
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Mail,
  Phone,
  ArrowUpRight,
  AlertCircle,
  Check,
  UserCheck,
} from 'lucide-react';
import { ClientAccount } from '@/server/estate';
import { EligibleAccountManager } from '@/server/estate/account-managers';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/admin/ui/Button';

interface Props {
  initialClients: ClientAccount[];
  initialAccountManagers?: EligibleAccountManager[];
}

export function ClientsPageClient({ initialClients, initialAccountManagers = [] }: Props) {
  const [clients, setClients] = useState<ClientAccount[]>(initialClients);
  const [accountManagers, setAccountManagers] = useState<EligibleAccountManager[]>(initialAccountManagers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedClient, setSelectedClient] = useState<ClientAccount | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states for adding a client
  const [newName, setNewName] = useState('');
  const [newOrgCode, setNewOrgCode] = useState('');
  const [newTier, setNewTier] = useState<'ENTERPRISE' | 'CORPORATE' | 'REGIONAL' | 'SME'>('CORPORATE');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAccountManagerId, setNewAccountManagerId] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Drawer reassign state
  const [isReassigning, setIsReassigning] = useState(false);
  const [reassignManagerId, setReassignManagerId] = useState('');
  const [isSavingReassign, setIsSavingReassign] = useState(false);
  const [reassignError, setReassignError] = useState<string | null>(null);

  // Filtered clients list
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.account_number && c.account_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.organisation?.code && c.organisation.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.organisation?.email && c.organisation.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.account_manager &&
          `${c.account_manager.first_name} ${c.account_manager.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesTier = selectedTier === 'ALL' || c.account_tier === selectedTier;
      const matchesStatus = selectedStatus === 'ALL' || c.account_status === selectedStatus;

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [clients, searchQuery, selectedTier, selectedStatus]);

  // Metrics
  const metrics = useMemo(() => {
    const total = clients.length;
    const active = clients.filter((c) => c.account_status === 'ACTIVE').length;
    const enterprise = clients.filter((c) => c.account_tier === 'ENTERPRISE').length;
    const onboarding = clients.filter((c) => c.account_status === 'ONBOARDING').length;
    return { total, active, enterprise, onboarding };
  }, [clients]);

  const resetCreateForm = () => {
    setNewName('');
    setNewOrgCode('');
    setNewEmail('');
    setNewPhone('');
    setNewTier('CORPORATE');
    setNewAccountManagerId('');
    setCreateError(null);
  };

  const handleOpenCreateModal = () => {
    resetCreateForm();
    setIsCreateModalOpen(true);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setCreateError('Legal Client / Organisation Name is required.');
      return;
    }

    setIsSubmitting(true);
    setCreateError(null);

    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          account_tier: newTier,
          account_status: 'ACTIVE',
          organisation_code: newOrgCode.trim() || undefined,
          email: newEmail.trim() || undefined,
          phone: newPhone.trim() || undefined,
          account_manager_id: newAccountManagerId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create client account.');
      }

      const createdClient: ClientAccount = data.client;
      setClients((prev) => [createdClient, ...prev]);
      setActionSuccess(`Client account "${createdClient.name}" created successfully.`);
      setIsCreateModalOpen(false);
      resetCreateForm();
    } catch (err: any) {
      setCreateError(err.message || 'Error creating client');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Account Manager Reassignment in Drawer
  const handleSaveReassignment = async () => {
    if (!selectedClient) return;

    setIsSavingReassign(true);
    setReassignError(null);

    try {
      const res = await fetch(`/api/admin/clients/${selectedClient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_manager_id: reassignManagerId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reassign account manager.');
      }

      const updated = data.client as ClientAccount;
      setSelectedClient(updated);
      setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setIsReassigning(false);
      setActionSuccess(`Account manager updated for ${updated.name}.`);
    } catch (err: any) {
      setReassignError(err.message || 'Error reassigning manager.');
    } finally {
      setIsSavingReassign(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Client Accounts"
        description="Comprehensive client organisations, commercial agreements, contracts, and managed property portfolios across the UK."
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/estate/team">
              <Button variant="secondary" size="sm" icon={<Users className="h-3.5 w-3.5" />}>
                Manage EntireFM Team
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={handleOpenCreateModal}
            >
              New Client Account
            </Button>
          </div>
        }
      />

      {/* Success Notification */}
      {actionSuccess && (
        <div className="rounded-[8px] bg-emerald-50 border border-emerald-200 p-3.5 flex items-center justify-between text-emerald-800 text-[12.5px]">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-[#686866]">
              Total Client Accounts
            </span>
            <Users className="h-4 w-4 text-[#686866]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-light text-[#101010]">{metrics.total}</span>
            <span className="text-[11px] text-[#686866]">Organisations</span>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-[#686866]">
              Active FM Contracts
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-light text-[#101010]">{metrics.active}</span>
            <span className="text-[11px] text-emerald-700 font-medium">In Service</span>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-[#686866]">
              Enterprise Tier
            </span>
            <Building2 className="h-4 w-4 text-[#EA580C]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-light text-[#101010]">{metrics.enterprise}</span>
            <span className="text-[11px] text-[#686866]">National Estates</span>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-[#686866]">
              Onboarding / Inflight
            </span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-light text-[#101010]">{metrics.onboarding}</span>
            <span className="text-[11px] text-amber-700 font-medium">Mobilising</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-[10px] border border-[#E4E4E1]">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B9B97]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client accounts, codes, contacts, or managers..."
            className="w-full rounded-[6px] border border-[#E4E4E1] bg-[#FAFAF8] pl-9 pr-3 py-1.5 text-[12.5px] text-[#101010] placeholder-[#9B9B97] focus:border-[#EA580C] focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>

        {/* Tier & Status Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FAFAF8] p-1 rounded-[6px] border border-[#E4E4E1] text-[11.5px]">
            <span className="text-[#9B9B97] px-1 text-[11px] uppercase font-medium">Tier:</span>
            {['ALL', 'ENTERPRISE', 'CORPORATE', 'REGIONAL', 'SME'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-2 py-0.5 rounded-[4px] font-medium transition-all ${
                  selectedTier === tier
                    ? 'bg-[#FFFFFF] text-[#101010] shadow-xs border border-[#E4E4E1]'
                    : 'text-[#686866] hover:text-[#101010]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#FAFAF8] p-1 rounded-[6px] border border-[#E4E4E1] text-[11.5px]">
            <span className="text-[#9B9B97] px-1 text-[11px] uppercase font-medium">Status:</span>
            {['ALL', 'ACTIVE', 'ONBOARDING', 'PROSPECT'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2 py-0.5 rounded-[4px] font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-[#FFFFFF] text-[#101010] shadow-xs border border-[#E4E4E1]'
                    : 'text-[#686866] hover:text-[#101010]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Client Table */}
      {filteredClients.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#E4E4E1] bg-[#FFFFFF] p-12 text-center space-y-3">
          <Building2 className="h-10 w-10 text-[#9B9B97] mx-auto" />
          <h3 className="text-base font-light text-[#101010]">No client accounts found</h3>
          <p className="text-xs text-[#686866] max-w-sm mx-auto">
            No client records match your current search criteria. Clear filters or create a new client account.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedTier('ALL');
              setSelectedStatus('ALL');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-xs">
          <table className="w-full min-w-[55rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E4E4E1] bg-[#FAFAF8] text-[11px] font-normal uppercase tracking-wider text-[#686866]">
                <th className="px-4 py-3">Client Account / Entity</th>
                <th className="px-4 py-3">Account Ref</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Account Status</th>
                <th className="px-4 py-3">Account Manager</th>
                <th className="px-4 py-3">Primary Contact</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E1]">
              {filteredClients.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => {
                    setSelectedClient(c);
                    setIsReassigning(false);
                    setReassignManagerId(c.account_manager_id || '');
                  }}
                  className="group hover:bg-[#FAFAF8] transition-colors cursor-pointer"
                >
                  {/* Name & Org */}
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-[#101010] group-hover:text-[#EA580C] transition-colors">
                      {c.name}
                    </div>
                    <div className="font-normal text-[11px] text-[#686866]">
                      Org Code: {c.organisation?.code || '—'}
                    </div>
                  </td>

                  {/* Account Ref */}
                  <td className="px-4 py-3.5">
                    <span className="text-[11.5px] font-medium text-[#101010] bg-[#FAFAF8] px-2 py-0.5 rounded border border-[#E4E4E1]">
                      {c.account_number || c.id.substring(0, 8)}
                    </span>
                  </td>

                  {/* Tier */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                        c.account_tier === 'ENTERPRISE'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : c.account_tier === 'CORPORATE'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : c.account_tier === 'REGIONAL'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.account_tier}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[10.5px] px-2 py-0.5 rounded font-medium inline-flex items-center gap-1 ${
                        c.account_status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.account_status === 'ONBOARDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : c.account_status === 'AT_RISK'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          c.account_status === 'ACTIVE'
                            ? 'bg-emerald-600'
                            : c.account_status === 'ONBOARDING'
                            ? 'bg-amber-600'
                            : c.account_status === 'AT_RISK'
                            ? 'bg-rose-600'
                            : 'bg-slate-500'
                        }`}
                      />
                      {c.account_status}
                    </span>
                  </td>

                  {/* Account Manager */}
                  <td className="px-4 py-3.5">
                    <div className="text-[12.5px] text-[#101010] font-medium">
                      {c.account_manager
                        ? `${c.account_manager.first_name} ${c.account_manager.last_name}`
                        : <span className="text-[#9B9B97] font-normal italic">Unassigned</span>}
                    </div>
                    {c.account_manager?.email && (
                      <div className="font-normal text-[10.5px] text-[#686866]">
                        {c.account_manager.email}
                      </div>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5">
                    <div className="font-normal text-[11px] text-[#101010]">
                      {c.organisation?.email || '—'}
                    </div>
                    {c.organisation?.phone && (
                      <div className="font-normal text-[10.5px] text-[#686866]">
                        {c.organisation.phone}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(c);
                        setIsReassigning(false);
                        setReassignManagerId(c.account_manager_id || '');
                      }}
                      className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#EA580C] hover:underline"
                    >
                      <span>View Account</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Client 360 Slideover Drawer ── */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="relative w-full max-w-xl bg-[#FFFFFF] shadow-2xl h-full flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E4E4E1] flex items-start justify-between">
              <div>
                <span className="text-[10.5px] uppercase font-medium text-[#EA580C]">
                  Client Account Profile
                </span>
                <h2 className="text-xl font-light text-[#101010] mt-1">{selectedClient.name}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-normal text-[11px] bg-[#FAFAF8] px-2 py-0.5 rounded border border-[#E4E4E1]">
                    {selectedClient.account_number || selectedClient.id.substring(0, 8)}
                  </span>
                  <span className="text-[11px] text-[#686866]">
                    Tier: <strong>{selectedClient.account_tier}</strong>
                  </span>
                  <span className="text-[11px] text-[#686866]">
                    Status: <strong>{selectedClient.account_status}</strong>
                  </span>
                </div>
                <div className="mt-3">
                  <Link href={`/admin/estate/clients/${selectedClient.id}`}>
                    <Button variant="primary" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                      Open Operational Hub
                    </Button>
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-[#9B9B97] hover:text-[#101010] p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Org Details */}
              <div className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider text-[#686866] font-medium border-b border-[#E4E4E1] pb-1">
                  Organisation Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#9B9B97] block text-[11px]">Organisation Code</span>
                    <span className="font-medium text-[#101010]">
                      {selectedClient.organisation?.code || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9B9B97] block text-[11px]">Established / Registered</span>
                    <span className="font-normal text-[#101010]">
                      {new Date(selectedClient.created_at).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9B9B97] block text-[11px]">Primary Email</span>
                    <span className="font-normal text-[#101010] flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3 text-[#9B9B97]" />
                      {selectedClient.organisation?.email || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9B9B97] block text-[11px]">Primary Phone</span>
                    <span className="font-normal text-[#101010] flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3 text-[#9B9B97]" />
                      {selectedClient.organisation?.phone || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Management with Interactive Reassignment */}
              <div className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider text-[#686866] font-medium border-b border-[#E4E4E1] pb-1">
                  EntireFM Account Team
                </h3>
                <div className="p-3 bg-[#FAFAF8] rounded-[8px] border border-[#E4E4E1] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#9B9B97] block">Dedicated Account Manager</span>
                      <span className="font-medium text-[#101010] text-[13px]">
                        {selectedClient.account_manager
                          ? `${selectedClient.account_manager.first_name} ${selectedClient.account_manager.last_name}`
                          : 'Unassigned'}
                      </span>
                      {selectedClient.account_manager?.email && (
                        <span className="font-normal text-[11px] text-[#686866] block">
                          {selectedClient.account_manager.email}
                        </span>
                      )}
                    </div>
                    {!isReassigning && (
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => {
                          setReassignManagerId(selectedClient.account_manager_id || '');
                          setIsReassigning(true);
                        }}
                      >
                        Reassign
                      </Button>
                    )}
                  </div>

                  {/* Inline Reassignment Form */}
                  {isReassigning && (
                    <div className="pt-3 border-t border-[#E4E4E1] space-y-2">
                      <label className="block text-[11px] font-medium text-[#101010]">
                        Select New Account Manager
                      </label>
                      <select
                        value={reassignManagerId}
                        onChange={(e) => setReassignManagerId(e.target.value)}
                        className="w-full p-1.5 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12px] focus:border-[#EA580C] focus:outline-none"
                      >
                        <option value="">-- Remove Account Manager (Unassigned) --</option>
                        {accountManagers.map((mgr) => (
                          <option key={mgr.id} value={mgr.id}>
                            {mgr.first_name} {mgr.last_name} ({mgr.role_name || mgr.job_title || 'Account Manager'})
                          </option>
                        ))}
                      </select>

                      {reassignError && (
                        <p className="text-[11px] text-rose-600">{reassignError}</p>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="secondary"
                          size="xs"
                          disabled={isSavingReassign}
                          onClick={() => setIsReassigning(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="xs"
                          disabled={isSavingReassign}
                          onClick={handleSaveReassignment}
                        >
                          {isSavingReassign ? 'Saving...' : 'Save Assignment'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connected Estate Hub Links */}
              <div className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider text-[#686866] font-medium border-b border-[#E4E4E1] pb-1">
                  Connected CAFM Workspaces
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/admin/estate/sites?clientAccountId=${selectedClient.id}`}
                    className="p-3 rounded-[8px] border border-[#E4E4E1] hover:border-[#EA580C] transition-all bg-[#FFFFFF] flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-[#101010] block group-hover:text-[#EA580C]">
                        Managed Sites
                      </span>
                      <span className="text-[11px] text-[#686866]">Physical facilities</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#9B9B97] group-hover:text-[#EA580C]" />
                  </Link>

                  <Link
                    href={`/admin/estate/contracts?clientAccountId=${selectedClient.id}`}
                    className="p-3 rounded-[8px] border border-[#E4E4E1] hover:border-[#EA580C] transition-all bg-[#FFFFFF] flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-[#101010] block group-hover:text-[#EA580C]">
                        Active Contracts
                      </span>
                      <span className="text-[11px] text-[#686866]">Commercial SLAs</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#9B9B97] group-hover:text-[#EA580C]" />
                  </Link>

                  <Link
                    href={`/admin/estate/portfolios?clientAccountId=${selectedClient.id}`}
                    className="p-3 rounded-[8px] border border-[#E4E4E1] hover:border-[#EA580C] transition-all bg-[#FFFFFF] flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-[#101010] block group-hover:text-[#EA580C]">
                        Portfolios
                      </span>
                      <span className="text-[11px] text-[#686866]">Regional groupings</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#9B9B97] group-hover:text-[#EA580C]" />
                  </Link>

                  <Link
                    href="/admin/finance/client-invoices"
                    className="p-3 rounded-[8px] border border-[#E4E4E1] hover:border-[#EA580C] transition-all bg-[#FFFFFF] flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-medium text-[#101010] block group-hover:text-[#EA580C]">
                        Billing &amp; Ledger
                      </span>
                      <span className="text-[11px] text-[#686866]">Invoices &amp; statements</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#9B9B97] group-hover:text-[#EA580C]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E4E4E1] bg-[#FAFAF8] flex items-center justify-between">
              <span className="font-normal text-[11px] text-[#9B9B97]">ID: {selectedClient.id}</span>
              <Button variant="secondary" size="sm" onClick={() => setSelectedClient(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create New Client Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E4E4E1] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-light text-[#101010]">Register Client Account</h3>
                <p className="text-xs text-[#686866]">
                  Add a client corporate entity to the EntireFM estate hierarchy.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#9B9B97] hover:text-[#101010]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {createError && (
              <div className="rounded-[6px] bg-rose-50 border border-rose-200 p-2.5 flex items-center gap-2 text-rose-800 text-[11.5px]">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#101010] font-medium mb-1">
                  Legal Client / Organisation Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. British Land Real Estate PLC"
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Organisation Code</label>
                  <input
                    type="text"
                    value={newOrgCode}
                    onChange={(e) => setNewOrgCode(e.target.value)}
                    placeholder="e.g. BL-PROP"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] font-normal focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#101010] font-medium mb-1">Account Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="ENTERPRISE">Enterprise (National)</option>
                    <option value="CORPORATE">Corporate (Multi-Site)</option>
                    <option value="REGIONAL">Regional (Single/Cluster)</option>
                    <option value="SME">SME / Boutique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="facilities@client.co.uk"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#101010] font-medium mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+44 20 7946 0900"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#101010] font-medium">
                    Assign Account Manager
                  </label>
                  <Link
                    href="/admin/estate/team"
                    target="_blank"
                    className="text-[10.5px] text-[#EA580C] hover:underline flex items-center gap-0.5"
                  >
                    <span>Add personnel</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                {accountManagers.length === 0 ? (
                  <div className="p-2.5 rounded-[6px] border border-amber-200 bg-amber-50 text-[11.5px] text-amber-800">
                    No active account managers found in database. You can still create the client and assign an account manager later, or{' '}
                    <Link href="/admin/estate/team" className="font-semibold underline">
                      add a team member now
                    </Link>.
                  </div>
                ) : (
                  <select
                    value={newAccountManagerId}
                    onChange={(e) => setNewAccountManagerId(e.target.value)}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="">-- Select Dedicated Account Manager (Optional) --</option>
                    {accountManagers.map((mgr) => (
                      <option key={mgr.id} value={mgr.id}>
                        {mgr.first_name} {mgr.last_name} ({mgr.role_name || mgr.job_title || 'Account Manager'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Client...' : 'Create Client Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
