/**
 * CANONICAL SECURE ASSET SCAN LANDING ROUTE — /asset/[id]
 * =======================================================
 * The universal QR destination for physical asset tags across the EntireFM estate.
 * Strict authentication, multi-tenant scoping, and physical attendance verification.
 */

import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { getAssetOperationalContext } from '@/server/assets/asset-service';
import { AssetDetailClient } from '@/components/assets/AssetDetailClient';

export const metadata: Metadata = {
  title: 'Digital Asset Tag — EntireFM CAFM',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function AssetScanLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;
  const session = await getCurrentSession();

  // If not authenticated, redirect to login with return path
  if (!session) {
    redirect(`/login?redirect=/asset/${id}`);
  }

  const assetContext = await getAssetOperationalContext(id, session);

  if (!assetContext) {
    return (
      <div className="min-h-screen bg-brand-void text-brand-mist flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-brand-carbon/90 border border-brand-edge-dark rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h1 className="text-xl font-light text-white">Access Denied or Asset Not Found</h1>
          <p className="text-xs text-brand-mist/70">
            This asset either does not exist or you do not have permission to view assets for this organisation.
          </p>
          <div className="pt-2">
            <a
              href="/clients"
              className="inline-block px-5 py-2 rounded-xl bg-brand-electric text-white text-xs font-medium hover:bg-brand-electric/80 transition-all"
            >
              Return to Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  const workOrderIdParam = typeof sParams.wo === 'string' ? sParams.wo : undefined;

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist selection:bg-brand-electric selection:text-white">
      <header className="border-b border-brand-edge-dark bg-brand-carbon/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-light tracking-tight text-white">
              Entire<span className="font-light text-brand-electric">FM</span>
            </span>
            <span className="rounded border border-brand-edge-dark bg-brand-void/80 px-2 py-0.5 font-medium text-[9.5px] uppercase tracking-widest text-brand-electric-bright">
              QR Asset Tag
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-brand-mist/60 hidden sm:inline">{session.name}</span>
            <span className="rounded bg-brand-void border border-brand-edge-dark px-2 py-0.5 text-[11px] text-brand-mist/70">
              {session.orgName}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <AssetDetailClient
          asset={assetContext}
          sessionUser={{
            id: session.personId || '',
            name: session.name,
            role: session.role,
            orgType: session.orgType,
          }}
          initialWorkOrderId={workOrderIdParam}
        />
      </main>
    </div>
  );
}
