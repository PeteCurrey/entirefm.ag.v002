/**
 * PLATFORM ACCESS & DEPARTMENT PERMISSION BUNDLES — /admin/platform/access
 * =========================================================================
 * Shows all role definitions, their permission sets, and the application portal they route to.
 */
import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, getRolePermissions, INTERNAL_ROLES, CLIENT_ROLES, CONTRACTOR_ROLES, ENGINEER_ROLES } from '@/server/identity';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Platform Access — EntireFM Admin' };
export const dynamic = 'force-dynamic';

const ALL_ROLE_GROUPS = [
  {
    label: 'Internal — EntireFM Operations',
    colour: 'text-brand-electric-bright',
    badge: 'border-brand-electric/20 bg-brand-electric/5',
    portal: '/admin',
    roles: INTERNAL_ROLES,
  },
  {
    label: 'Client Organisation',
    colour: 'text-emerald-400',
    badge: 'border-emerald-500/20 bg-emerald-500/5',
    portal: '/clients',
    roles: CLIENT_ROLES,
  },
  {
    label: 'Contractor Organisation',
    colour: 'text-amber-300',
    badge: 'border-amber-500/20 bg-amber-500/5',
    portal: '/contractor',
    roles: CONTRACTOR_ROLES,
  },
  {
    label: 'Field Engineer',
    colour: 'text-cyan-400',
    badge: 'border-cyan-500/20 bg-cyan-500/5',
    portal: '/engineer',
    roles: ENGINEER_ROLES,
  },
];

export default async function PlatformAccessPage() {
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'ENTIREFM') {
    redirect('/login?error=forbidden_admin');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight">Permission Bundles & Access Architecture</h1>
          <p className="mt-1 text-[13px] text-brand-mist/60">
            All defined roles, their application portals, and the permission sets they carry.
          </p>
        </div>
        <Link href="/admin/platform/users" className="rounded border border-brand-edge-dark bg-brand-carbon px-4 py-2 text-[12.5px] text-brand-mist hover:bg-brand-void hover:text-white transition-colors">
          ← User Directory
        </Link>
      </div>

      {ALL_ROLE_GROUPS.map((group) => (
        <div key={group.label} className={`rounded-lg border ${group.badge} p-6`}>
          <div className="flex items-center gap-3 mb-5">
            <h2 className={`text-[15px] font-semibold ${group.colour}`}>{group.label}</h2>
            <span className="font-mono text-[11px] text-brand-mist/50">→ {group.portal}</span>
          </div>

          <div className="space-y-4">
            {group.roles.map((role) => {
              const perms = getRolePermissions(role);
              return (
                <div key={role} className="rounded border border-brand-edge-dark/60 bg-brand-void/60 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-mono text-[13px] font-semibold ${group.colour}`}>{role}</span>
                    <span className="rounded border border-brand-edge-dark bg-brand-carbon/60 px-2 py-0.5 font-mono text-[10px] text-brand-mist/50">
                      {perms.length} permissions
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {perms.map((p) => (
                      <span key={p} className="rounded bg-brand-carbon/80 border border-brand-edge-dark/40 px-1.5 py-0.5 font-mono text-[10px] text-brand-mist/50">
                        {p}
                      </span>
                    ))}
                    {perms.length === 0 && (
                      <span className="text-[12px] text-brand-mist/30">No permissions defined</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
