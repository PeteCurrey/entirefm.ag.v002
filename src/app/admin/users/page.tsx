import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { redirect } from 'next/navigation';
import { AdminUsersDirectoryTable } from './AdminUsersDirectoryTable';

export const metadata: Metadata = { title: 'User Directory — EntireFM Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ lobby?: string; operational?: string; search?: string }>;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login?next=/admin/users');
  if (session.orgType !== 'ENTIREFM') redirect('/admin/access-denied');

  const { lobby, operational, search } = await searchParams;

  let query = 'admin_user_identity_directory?select=*&order=lobby_joined_at.desc.nullslast,auth_created_at.desc';

  if (search) {
    query += `&or=(email.ilike.*${encodeURIComponent(search)}*,display_name.ilike.*${encodeURIComponent(search)}*,organisation_name.ilike.*${encodeURIComponent(search)}*)`;
  }

  if (lobby === 'member') {
    query += '&is_lobby_member=eq.true';
  } else if (lobby === 'non_member') {
    query += '&is_lobby_member=eq.false';
  } else if (lobby === 'pending') {
    query += '&lobby_member_status=eq.pending_verification';
  }

  if (operational) {
    query += `&operational_identity_type=eq.${encodeURIComponent(operational.toUpperCase())}`;
  }

  const { data: usersData } = await dbQuery<any[]>(query);
  const users = usersData || [];

  // Fetch all stats
  const { data: allRows } = await dbQuery<any[]>('admin_user_identity_directory?select=is_lobby_member,lobby_member_status,operational_identity_type');
  const all = allRows || [];

  const stats = {
    total: all.length,
    lobbyActive: all.filter((u) => u.is_lobby_member && u.lobby_member_status === 'active').length,
    contractors: all.filter((u) => u.operational_identity_type === 'CONTRACTOR').length,
    clients: all.filter((u) => u.operational_identity_type === 'CLIENT').length,
    engineers: all.filter((u) => u.operational_identity_type === 'ENGINEER').length,
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Masthead */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase font-medium tracking-[0.25em] text-brand-electric mb-1">
            CANONICAL IDENTITY PLATFORM
          </div>
          <h1 className="text-3xl font-extralight text-white tracking-tight">
            User Identity & Access Directory
          </h1>
          <p className="mt-1.5 text-sm font-light text-brand-mist/70 max-w-2xl">
            Authoritative directory for all individuals across EntireFM. Canonical identity backed by Supabase Auth with strict dual-axis Lobby and Operational role separation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-normal uppercase text-brand-mist/50 tracking-wider block">Canonical Auth Source</span>
            <span className="text-xs font-normal text-emerald-400">Supabase Auth (1:1 Human Identity)</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-lg border border-white/10 bg-brand-carbon/60 p-4">
          <span className="text-[10px] uppercase font-medium tracking-wider text-brand-mist/50 block mb-1">Total Users</span>
          <span className="text-2xl font-light text-white">{stats.total}</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-brand-carbon/60 p-4">
          <span className="text-[10px] uppercase font-medium tracking-wider text-emerald-400/80 block mb-1">Active Lobby Members</span>
          <span className="text-2xl font-light text-emerald-300">{stats.lobbyActive}</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-brand-carbon/60 p-4">
          <span className="text-[10px] uppercase font-medium tracking-wider text-blue-400/80 block mb-1">Contractors</span>
          <span className="text-2xl font-light text-blue-300">{stats.contractors}</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-brand-carbon/60 p-4">
          <span className="text-[10px] uppercase font-medium tracking-wider text-indigo-400/80 block mb-1">Clients</span>
          <span className="text-2xl font-light text-indigo-300">{stats.clients}</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-brand-carbon/60 p-4">
          <span className="text-[10px] uppercase font-medium tracking-wider text-purple-400/80 block mb-1">Engineers</span>
          <span className="text-2xl font-light text-purple-300">{stats.engineers}</span>
        </div>
      </div>

      {/* Interactive Table Component */}
      <AdminUsersDirectoryTable
        users={users}
        initialLobbyFilter={lobby || ''}
        initialOpFilter={operational || ''}
        initialSearch={search || ''}
      />
    </div>
  );
}
