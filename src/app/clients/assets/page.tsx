import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { ClientAssetRegisterClient } from '@/components/assets/ClientAssetRegisterClient';

export const metadata: Metadata = {
  title: 'Asset Register & QR Tags — EntireFM Client Portal',
  description: 'Digital asset register with QR tags, physical attendance tracking, and compliance records.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ClientAssetsPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
  const siteFilter = siteScopes.length > 0 ? `&site_id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';

  const { data: assets } = await dbQuery<any[]>(
    `assets?select=id,asset_reference,name,category,manufacturer,model_number,serial_number,status,condition,criticality,installation_date,warranty_expiry,site:sites(id,name,site_code)${siteFilter}&order=asset_reference.asc&limit=150`
  );

  const list = assets || [];

  return (
    <ClientAssetRegisterClient
      initialAssets={list}
      orgName={session.orgName}
    />
  );
}
