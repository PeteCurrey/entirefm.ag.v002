import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { TeamPageClient, InternalTeamMember } from './TeamPageClient';

export const metadata: Metadata = {
  title: 'EntireFM Team | Admin Operations',
  description: 'Manage EntireFM internal personnel, operational capabilities, account managers, and system roles.',
};

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/admin/login?next=/admin/estate/team');
  if (session.orgType !== 'ENTIREFM') redirect('/admin/access-denied');

  const { data, error } = await dbQuery<any[]>(
    `organisation_memberships?select=id,status,joined_at,person:persons(id,first_name,last_name,email,phone,job_title,status,created_at),role:roles(id,code,name),organisation:organisations(id,name,org_type)&organisation.org_type=eq.ENTIREFM&order=person.last_name.asc`
  );

  if (error) {
    console.error('[TEAM_PAGE_FETCH_ERROR]', error);
  }

  const members: InternalTeamMember[] = (data || [])
    .filter((m: any) => m.organisation?.org_type === 'ENTIREFM' && m.person)
    .map((m: any) => ({
      membership_id: m.id,
      membership_status: m.status,
      joined_at: m.joined_at,
      person_id: m.person.id,
      first_name: m.person.first_name,
      last_name: m.person.last_name,
      email: m.person.email,
      phone: m.person.phone || null,
      job_title: m.person.job_title || null,
      person_status: m.person.status,
      created_at: m.person.created_at,
      role_id: m.role?.id || null,
      role_code: m.role?.code || null,
      role_name: m.role?.name || null,
      organisation_id: m.organisation?.id || null,
      organisation_name: m.organisation?.name || null,
    }));

  return <TeamPageClient initialMembers={members} />;
}
