/**
 * MASTER USER DETAIL — /admin/platform/users/[id]
 * =================================================
 * Sections:
 * 1. Identity & Memberships
 * 2. Role & Permissions
 * 3. Scope Assignment (Org / Portfolio / Contract / Site)
 * 4. Effective Access Inspector ("CAN VIEW" vs "CANNOT VIEW")
 * 5. Permission Simulator ("Can this user access X?")
 * 6. Account Controls (Disable / Revoke)
 * 7. Audited VIEW-AS launch
 */
import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, PERMISSION, evaluateEffectiveAccess, getRolePermissions, type RoleCode } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = { title: 'User Detail — EntireFM Admin' };
export const dynamic = 'force-dynamic';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_admin');
  }

  const { id } = await params;

  const { data: personData } = await dbQuery<any[]>(
    `persons?id=eq.${encodeURIComponent(id)}&select=id,first_name,last_name,email,mobile,status,is_field_engineer,provider_organisation_id,memberships:organisation_memberships(id,status,role:roles(code,name),organisation:organisations(id,name,org_type),scopes:membership_scopes(id,scope_type,scope_id))&limit=1`
  );

  const person = personData?.[0];
  if (!person) {
    return (
      <div className="py-16 text-center text-brand-mist/50">
        User not found. <Link href="/admin/platform/users" className="text-brand-electric hover:underline">Back to Users</Link>
      </div>
    );
  }

  const memberships = person.memberships || [];
  const primaryMembership = memberships[0];
  const primaryRole = primaryMembership?.role?.code as RoleCode;
  const permissions = primaryRole ? getRolePermissions(primaryRole) : [];
  const scopes = (primaryMembership?.scopes || []).map((s: any) => ({ type: s.scope_type, id: s.scope_id }));

  // Effective access — subset of key resources
  const keyResources = [
    { label: 'View Work Orders', permission: PERMISSION.VIEW_WORK_ORDERS },
    { label: 'View Finance / Invoices', permission: PERMISSION.VIEW_FINANCE },
    { label: 'Approve Invoices', permission: PERMISSION.APPROVE_INVOICES },
    { label: 'View Supplier Costs', permission: PERMISSION.VIEW_SUPPLIER_COSTS },
    { label: 'Manage PPM Plans', permission: PERMISSION.MANAGE_PPM },
    { label: 'View All Organisations', permission: PERMISSION.VIEW_ALL_ORGANISATIONS },
    { label: 'Manage Users & Roles', permission: PERMISSION.MANAGE_USERS },
    { label: 'Platform Settings', permission: PERMISSION.PLATFORM_SETTINGS },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12.5px] text-brand-mist/50">
        <Link href="/admin/platform/users" className="hover:text-white transition-colors">Platform Users</Link>
        <span>/</span>
        <span className="text-white">{person.first_name} {person.last_name}</span>
      </div>

      {/* Identity Block */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-medium text-white">
              {person.first_name} {person.last_name}
            </h1>
            <div className="mt-1 font-mono text-[12.5px] text-brand-mist/60">{person.email}</div>
            {person.mobile && (
              <div className="mt-0.5 font-mono text-[12px] text-brand-mist/40">{person.mobile}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded border px-2.5 py-1 font-mono text-[11px] ${
              person.status === 'ACTIVE'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              {person.status}
            </span>
          </div>
        </div>

        {/* Memberships */}
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50 mb-3">
            Organisation Memberships
          </div>
          <div className="space-y-2">
            {memberships.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between rounded border border-brand-edge-dark/60 bg-brand-void/60 px-4 py-3">
                <div>
                  <span className="text-[13px] font-medium text-white">{m.organisation?.name || 'Organisation'}</span>
                  <span className="ml-2 font-mono text-[10px] text-brand-mist/50">{m.organisation?.org_type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-brand-electric-bright">{m.role?.code}</span>
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] ${
                    m.status === 'ACTIVE' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-300'
                  }`}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scope Summary */}
        {scopes.length > 0 && (
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-brand-mist/50 mb-3">
              Active Scopes ({scopes.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {scopes.map((s: any, idx: number) => (
                <span key={idx} className="rounded border border-brand-edge-dark bg-brand-void/60 px-2.5 py-1 font-mono text-[11px] text-brand-mist/60">
                  {s.type}: {s.id.split('-')[0]}…
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Effective Access Inspector */}
      <div className="rounded-lg border border-brand-edge-dark bg-brand-carbon/40 p-6">
        <h2 className="text-[15px] font-medium text-white mb-4">Effective Access Inspector</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {keyResources.map((res) => {
            const canAccess = permissions.includes(res.permission as any);
            return (
              <div key={res.permission} className="flex items-center justify-between rounded border border-brand-edge-dark/60 bg-brand-void/60 px-4 py-2.5">
                <span className="text-[13px] text-brand-mist/80">{res.label}</span>
                <span className={`font-mono text-[11px] font-semibold ${canAccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {canAccess ? '✓ CAN VIEW' : '✗ BLOCKED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Controls */}
      <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-6">
        <h2 className="text-[15px] font-medium text-white mb-2">Account Controls</h2>
        <p className="text-[12.5px] text-brand-mist/50 mb-4">
          Disabling or revoking access immediately invalidates all active sessions across all portals, APIs, and AI tools.
        </p>
        <div className="flex items-center gap-3">
          {person.status === 'ACTIVE' ? (
            <form action={`/api/admin/users/${person.id}`} method="post">
              <input type="hidden" name="action" value="suspend" />
              <button type="submit" className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-[12.5px] text-amber-300 hover:bg-amber-500/20 transition-colors">
                Suspend Account
              </button>
            </form>
          ) : (
            <form action={`/api/admin/users/${person.id}`} method="post">
              <input type="hidden" name="action" value="activate" />
              <button type="submit" className="rounded border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-[12.5px] text-emerald-300 hover:bg-emerald-500/20 transition-colors">
                Reactivate Account
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Audited VIEW-AS Launch */}
      {session.permissions.includes(PERMISSION.VIEW_AS_USER as any) || session.role === 'SUPER_ADMIN' ? (
        <div className="rounded-lg border border-brand-electric/20 bg-brand-electric/5 p-6">
          <h2 className="text-[15px] font-medium text-white mb-2">Audited Support View-As</h2>
          <p className="text-[12.5px] text-brand-mist/50 mb-4">
            Launch a read-only audited session as this user. All actions are logged against your operator identity ({session.email}). 
            This does NOT impersonate their token — it records your operator identity on every event.
          </p>
          <form action="/api/admin/view-as" method="post">
            <input type="hidden" name="targetPersonId" value={person.id} />
            <input type="hidden" name="targetOrgId" value={primaryMembership?.organisation?.id || ''} />
            <input type="hidden" name="targetRole" value={primaryRole || 'CLIENT_READ_ONLY'} />
            <input type="hidden" name="targetOrgType" value={primaryMembership?.organisation?.org_type || 'CLIENT'} />
            <button type="submit" className="rounded border border-brand-electric/40 bg-brand-electric/10 px-4 py-2 text-[12.5px] text-brand-electric-bright hover:bg-brand-electric/20 transition-colors">
              Launch View-As Session →
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
