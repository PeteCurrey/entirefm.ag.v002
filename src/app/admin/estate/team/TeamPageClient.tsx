'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  XCircle,
  Edit2,
  X,
  UserCheck,
  UserX,
  AlertCircle,
  Check,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/admin/ui/Button';

export interface InternalTeamMember {
  membership_id: string;
  membership_status: string;
  joined_at: string;
  person_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  job_title: string | null;
  person_status: string;
  created_at?: string;
  role_id: string | null;
  role_code: string | null;
  role_name: string | null;
  organisation_id?: string | null;
  organisation_name?: string | null;
}

interface Props {
  initialMembers: InternalTeamMember[];
}

const AVAILABLE_ROLES = [
  { code: 'ACCOUNT_MANAGER', name: 'Account Manager', desc: 'Client relationship management, portfolio oversight, and commercial approvals' },
  { code: 'ADMINISTRATOR', name: 'Administrator', desc: 'Platform configuration, system administration, and operational control' },
  { code: 'OPERATIONS_MANAGER', name: 'Operations Manager', desc: 'Control of dispatch, work orders, contractor SLAs, and escalations' },
  { code: 'OPERATIONS_USER', name: 'Operations', desc: 'Day-to-day work order handling, dispatch assistance, and scheduling' },
  { code: 'ENGINEER', name: 'Internal Engineer', desc: 'Field execution, technical assessments, and mobile job completion' },
  { code: 'FINANCE', name: 'Finance', desc: 'Invoicing, PO approvals, billing readiness, and margin analysis' },
  { code: 'DIRECTOR', name: 'Director', desc: 'Senior executive oversight across all estates and contracts' },
  { code: 'CEO', name: 'CEO', desc: 'Full executive command over all operational, financial, and compliance domains' },
  { code: 'HELPDESK_MANAGER', name: 'Helpdesk Manager', desc: 'Helpdesk oversight, triage management, and service request flow' },
];

export function TeamPageClient({ initialMembers }: Props) {
  const [members, setMembers] = useState<InternalTeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<InternalTeamMember | null>(null);

  // Form states
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formRoleCode, setFormRoleCode] = useState('ACCOUNT_MANAGER');

  // Action status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [togglingMemberId, setTogglingMemberId] = useState<string | null>(null);

  const resetForm = () => {
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormPhone('');
    setFormJobTitle('');
    setFormRoleCode('ACCOUNT_MANAGER');
    setErrorMessage(null);
    setEditingMember(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (m: InternalTeamMember) => {
    setEditingMember(m);
    setFormFirstName(m.first_name || '');
    setFormLastName(m.last_name || '');
    setFormEmail(m.email || '');
    setFormPhone(m.phone || '');
    setFormJobTitle(m.job_title || '');
    setFormRoleCode(m.role_code || 'ACCOUNT_MANAGER');
    setErrorMessage(null);
    setIsAddModalOpen(true);
  };

  // Submit Handler (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (editingMember) {
        // Edit existing member
        const res = await fetch(`/api/admin/team/${editingMember.person_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formFirstName.trim(),
            last_name: formLastName.trim(),
            phone: formPhone.trim() || null,
            job_title: formJobTitle.trim() || null,
            role_code: formRoleCode,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update team member.');
        }

        setMembers((prev) =>
          prev.map((m) => (m.person_id === editingMember.person_id ? { ...m, ...data.member } : m))
        );
        setSuccessMessage(`Successfully updated ${formFirstName} ${formLastName}.`);
        setIsAddModalOpen(false);
        resetForm();
      } else {
        // Create new member
        const res = await fetch('/api/admin/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: formFirstName.trim(),
            last_name: formLastName.trim(),
            email: formEmail.trim().toLowerCase(),
            phone: formPhone.trim() || null,
            job_title: formJobTitle.trim() || null,
            role_code: formRoleCode,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create team member.');
        }

        setMembers((prev) => [data.member, ...prev]);
        setSuccessMessage(`Successfully added ${formFirstName} ${formLastName} to EntireFM team.`);
        setIsAddModalOpen(false);
        resetForm();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = async (m: InternalTeamMember) => {
    const newStatus = m.person_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const actionLabel = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';

    if (!confirm(`Are you sure you want to ${actionLabel} ${m.first_name} ${m.last_name}?`)) {
      return;
    }

    setTogglingMemberId(m.person_id);
    try {
      const res = await fetch(`/api/admin/team/${m.person_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || `Failed to ${actionLabel} team member.`);
      }

      setMembers((prev) =>
        prev.map((item) =>
          item.person_id === m.person_id
            ? { ...item, person_status: newStatus, membership_status: newStatus }
            : item
        )
      );
      setSuccessMessage(`${m.first_name} ${m.last_name} is now ${newStatus === 'ACTIVE' ? 'Active' : 'Inactive'}.`);
    } catch (err: any) {
      alert(err.message || 'Status update failed.');
    } finally {
      setTogglingMemberId(null);
    }
  };

  // Filtering
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
      const email = (m.email || '').toLowerCase();
      const jobTitle = (m.job_title || '').toLowerCase();
      const roleName = (m.role_name || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        q === '' ||
        fullName.includes(q) ||
        email.includes(q) ||
        jobTitle.includes(q) ||
        roleName.includes(q);

      const matchesRole = roleFilter === 'ALL' || m.role_code === roleFilter;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && m.person_status === 'ACTIVE') ||
        (statusFilter === 'INACTIVE' && m.person_status !== 'ACTIVE');

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.person_status === 'ACTIVE').length;
    const accountManagers = members.filter(
      (m) => m.role_code === 'ACCOUNT_MANAGER' && m.person_status === 'ACTIVE'
    ).length;
    const operations = members.filter(
      (m) => (m.role_code === 'OPERATIONS_MANAGER' || m.role_code === 'OPERATIONS_USER') && m.person_status === 'ACTIVE'
    ).length;
    return { total, active, accountManagers, operations };
  }, [members]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <AdminPageHeader
        category="Internal Operations"
        title="EntireFM Team"
        description="Authorised EntireFM personnel, operational capabilities, account managers, and system roles."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={openAddModal}
          >
            Add Team Member
          </Button>
        }
      />

      {/* Success Notification */}
      {successMessage && (
        <div className="rounded-[8px] bg-emerald-50 border border-emerald-200 p-3.5 flex items-center justify-between text-emerald-800 text-[12.5px]">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-[#686866]">
              Total Personnel
            </span>
            <Users className="h-4 w-4 text-[#686866]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-light text-[#101010]">{metrics.total}</span>
            <span className="text-[11px] text-[#686866]">Internal Team</span>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-[#686866]">
              Active Personnel
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
              Account Managers
            </span>
            <Briefcase className="h-4 w-4 text-[#EA580C]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-light text-[#101010]">{metrics.accountManagers}</span>
            <span className="text-[11px] text-[#686866]">Client Assigned</span>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-medium uppercase tracking-wider text-[#686866]">
              Operations &amp; Dispatch
            </span>
            <ShieldCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-light text-[#101010]">{metrics.operations}</span>
            <span className="text-[11px] text-blue-700 font-medium">Active Leads</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFFFF] p-3 rounded-[10px] border border-[#E4E4E1]">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B9B97]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, role, or title..."
            className="w-full rounded-[6px] border border-[#E4E4E1] bg-[#FAFAF8] pl-9 pr-3 py-1.5 text-[12.5px] text-[#101010] placeholder-[#9B9B97] focus:border-[#EA580C] focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-[#FAFAF8] p-1 rounded-[6px] border border-[#E4E4E1] text-[11.5px]">
            <span className="text-[#9B9B97] px-1 text-[11px] uppercase font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-0 text-[11.5px] text-[#101010] font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              {AVAILABLE_ROLES.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#FAFAF8] p-1 rounded-[6px] border border-[#E4E4E1] text-[11.5px]">
            <span className="text-[#9B9B97] px-1 text-[11px] uppercase font-medium">Status:</span>
            {['ALL', 'ACTIVE', 'INACTIVE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-0.5 rounded-[4px] font-medium transition-all ${
                  statusFilter === status
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

      {/* Main Table */}
      {filteredMembers.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#E4E4E1] bg-[#FFFFFF] p-12 text-center space-y-3">
          <Users className="h-10 w-10 text-[#9B9B97] mx-auto" />
          <h3 className="text-base font-light text-[#101010]">No team members found</h3>
          <p className="text-xs text-[#686866] max-w-sm mx-auto">
            No personnel match your search filters. Clear filters or add a new team member.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('ALL');
              setStatusFilter('ALL');
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
                <th className="px-4 py-3">Team Member</th>
                <th className="px-4 py-3">Operational Role</th>
                <th className="px-4 py-3">Job Title</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E1]">
              {filteredMembers.map((m) => {
                const isActive = m.person_status === 'ACTIVE';
                const isToggling = togglingMemberId === m.person_id;

                return (
                  <tr key={m.person_id} className="hover:bg-[#FAFAF8] transition-colors">
                    {/* Name & Initials */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#FAFAF8] border border-[#E4E4E1] flex items-center justify-center font-medium text-[11.5px] text-[#101010]">
                          {m.first_name?.[0]}
                          {m.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-[#101010]">
                            {m.first_name} {m.last_name}
                          </div>
                          <div className="font-normal text-[11px] text-[#686866] flex items-center gap-1">
                            <Mail className="h-3 w-3 text-[#9B9B97]" />
                            {m.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Operational Role Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                          m.role_code === 'ACCOUNT_MANAGER'
                            ? 'bg-orange-50 text-orange-800 border border-orange-200'
                            : m.role_code === 'ADMINISTRATOR' || m.role_code === 'CEO' || m.role_code === 'SUPER_ADMIN'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : m.role_code === 'OPERATIONS_MANAGER' || m.role_code === 'OPERATIONS_USER'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : m.role_code === 'FINANCE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {m.role_name || m.role_code || 'Team Member'}
                      </span>
                    </td>

                    {/* Job Title */}
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[#101010]">
                        {m.job_title || '—'}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5">
                      {m.phone ? (
                        <div className="flex items-center gap-1 text-[11.5px] text-[#101010]">
                          <Phone className="h-3 w-3 text-[#9B9B97]" />
                          {m.phone}
                        </div>
                      ) : (
                        <span className="text-[11.5px] text-[#9B9B97]">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-[10.5px] px-2 py-0.5 rounded font-medium inline-flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        />
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="xs"
                          icon={<Edit2 className="h-3 w-3" />}
                          onClick={() => openEditModal(m)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          size="xs"
                          disabled={isToggling}
                          icon={
                            isActive ? (
                              <UserX className="h-3 w-3 text-rose-600" />
                            ) : (
                              <UserCheck className="h-3 w-3 text-emerald-600" />
                            )
                          }
                          onClick={() => handleToggleStatus(m)}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add / Edit Team Member Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E4E4E1] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-light text-[#101010]">
                  {editingMember ? 'Edit Team Member' : 'Add Internal Team Member'}
                </h3>
                <p className="text-xs text-[#686866]">
                  {editingMember
                    ? 'Update profile details and operational role.'
                    : 'Add a new EntireFM team member and assign their system capabilities.'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9B9B97] hover:text-[#101010]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="rounded-[6px] bg-rose-50 border border-rose-200 p-2.5 flex items-center gap-2 text-rose-800 text-[11.5px]">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#101010] font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    placeholder="e.g. Sterling"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingMember}
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="name@entirefm.com"
                  className={`w-full p-2 rounded-[6px] border border-[#E4E4E1] text-[12.5px] focus:border-[#EA580C] focus:outline-none ${
                    editingMember ? 'bg-[#FAFAF8] text-[#686866] cursor-not-allowed' : 'bg-[#FFFFFF]'
                  }`}
                />
                {editingMember && (
                  <p className="text-[10.5px] text-[#9B9B97] mt-0.5">
                    Email cannot be changed after creation to preserve audit history.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formJobTitle}
                    onChange={(e) => setFormJobTitle(e.target.value)}
                    placeholder="e.g. Senior Account Director"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#101010] font-medium mb-1">
                    Contact Telephone
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+44 1onal..."
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">
                  Operational Role &amp; Capabilities *
                </label>
                <select
                  value={formRoleCode}
                  onChange={(e) => setFormRoleCode(e.target.value)}
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} — {r.desc}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#686866] mt-1">
                  Assigning <strong>Account Manager</strong> allows this person to be selected when onboarding or managing Client Accounts.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingMember
                      ? 'Saving...'
                      : 'Creating...'
                    : editingMember
                    ? 'Save Changes'
                    : 'Add Team Member'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
