import React from 'react';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';

export const metadata: Metadata = {
  title: { absolute: 'EntireFM Operations Cockpit' },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

interface AdminSubRouteProps {
  params: Promise<{ slug: string[] }>;
}

function formatTitle(str: string): string {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default async function AdminSubRoutePage({ params }: AdminSubRouteProps) {
  const { slug } = await params;
  const category = slug[0] ? formatTitle(slug[0]) : 'Operations';
  const title = slug[slug.length - 1] ? formatTitle(slug[slug.length - 1]) : 'Dashboard';
  const path = `/admin/${slug.join('/')}`;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category={category}
        title={title}
        description={`Canonical domain view for EntireFM ${title} · Path: ${path}`}
      />

      <EmptyState
        title={`${title} Module Initialized`}
        description={`The ${title} canonical schema and server domain interfaces are active in the core architecture. Records in this domain will be displayed here as operations progress.`}
        actionText="Back to Command Centre"
        actionHref="/admin"
      />
    </div>
  );
}
