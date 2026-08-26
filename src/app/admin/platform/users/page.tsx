/**
 * MASTER USER MANAGEMENT DIRECTORY — /admin/platform/users
 * ==========================================================
 * Lists all platform users: Internal, Client, Contractor, Engineer.
 * Accessible only to internal EntireFM staff with appropriate permissions.
 */
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSession, PERMISSION } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Platform Users — EntireFM Admin' };
export const dynamic = 'force-dynamic';

export default async function PlatformUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; search?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login?next=/admin/platform/users');
  if (session.orgType !== 'ENTIREFM') redirect('/admin/access-denied');

  const { type, search } = await searchParams;

  // Query user identities with memberships and organisation details
  let url = `user_identities?select=id,email,last_sign_in_at,person:persons(id,first_name,last_name,status,is_field_engineer,memberships:organisation_memberships(id,status,role:roles(code,name),organisation:organisations(id,name,org_type)))&limit=100`;
  if (search) {
    url += `&email=ilike.*${encodeURIComponent(search)}*`;
  }

  const { data: identities } = await dbQuery<any[]>(url);
  const allUsers = identities || [];

  const filtered = type
    ? allUsers.filter((u) =>
        (u.person?.memberships || []).some((m: any) => m.organisation?.org_type === type.toUpperCase())
      )
    : allUsers;

  const filterTabs = [
    { label: 'All Users', value: '' },
    { label: 'Internal', value: 'ENTIREFM' },
    { label: 'Clients', value: 'CLIENT' },
    { label: 'Contractors', value: 'CONTRACTOR' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight">Platform User Management</h1>
          <p className="mt-1 text-[13px] text-brand-mist/60">
            Manage identity, roles, scopes, and application access for all platform users.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/platform/access"
            className="rounded border border-brand-edge-dark bg-brand-carbon px-4 py-2 text-[12.5px] text-brand-mist hover:bg-brand-void hover:text-white transition-colors"
          >
            Permission Bundles →
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/platform/users?type=${tab.value}` : '/admin/platform/users'}
            className={`rounded px-3.5 py-1.5 text-[12.5px] font-normal transition-colors border ${
              (type || '') === tab.value
                ? 'bg-brand-electric text-white border-brand-electric'
                : 'border-brand-edge-dark bg-brand-carbon/60 text-brand-mist/70 hover:bg-brand-void hover:text-white'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* User Table */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-brand-edge-dark bg-brand-void/60 text-brand-mist/60 font-mono text-[11px] uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Org / Type</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Sign In</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-edge-dark/30">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-brand-mist/40">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const person = u.person;
                const primaryMembership = (person?.memberships || [])[0];
                const org = primaryMembership?.organisation;
                const role = primaryMembership?.role;
                const orgTypeColour =
                  org?.org_type === 'ENTIREFM'
                    ? 'text-brand-electric-bright'
                    : org?.org_type === 'CLIENT'
                    ? 'text-emerald-400'
                    : org?.org_type === 'CONTRACTOR'
                    ? 'text-amber-300'
                    : 'text-brand-mist/60';

                return (
                  <tr key={u.id} className="hover:bg-brand-void/30 transition-colors text-brand-mist">
                    <td className="px-6 py-3.5 font-normal text-white">
                      {person ? `${person.first_name || ''} ${person.last_name || ''}`.trim() || '—' : '—'}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[12px]">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <div className="text-[13px]">{org?.name || '—'}</div>
                      <div className={`font-mono text-[10px] ${orgTypeColour}`}>{org?.org_type || '—'}</div>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11.5px]">{role?.code || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className={`rounded border px-2 py-0.5 font-mono text-[10px] ${
                        (person?.status || 'ACTIVE') === 'ACTIVE'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                      }`}>
                        {person?.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11.5px] text-brand-mist/50">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('en-GB') : 'Never'}
                    </td>
                    <td className="px-6 py-3.5">
                      <Link
                        href={`/admin/platform/users/${person?.id || u.id}`}
                        className="text-[12px] text-brand-electric hover:underline"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Total count */}
      <div className="text-right text-[12px] text-brand-mist/40 font-mono">
        {filtered.length} user{filtered.length !== 1 ? 's' : ''} shown
      </div>
    </div>
  );
}
