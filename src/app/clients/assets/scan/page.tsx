/**
 * CANONICAL CLIENT & OPERATIVE QR SCANNER ROUTE — /clients/assets/scan
 * ====================================================================
 * Mobile-first QR scanning interface with camera stream, photo upload fallback,
 * and rapid asset lookup.
 */

import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import { QrScannerClient } from '@/components/assets/QrScannerClient';

export const metadata: Metadata = {
  title: 'Scan Asset QR Tag — EntireFM CAFM',
  description: 'Mobile QR scanner for instant plant verification and physical attendance logging.',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function AssetScanPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?redirect=/clients/assets/scan');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-brand-electric-bright font-bold">
          CAFM MOBILE SCANNER &bull; ASSET ATTENDANCE
        </span>
        <h1 className="text-2xl font-light text-white tracking-tight">Scan Asset QR Tag</h1>
        <p className="text-xs text-brand-mist/70">
          Scan the physical QR tag on the equipment to view live specifications, compliance history, and verify on-site attendance.
        </p>
      </div>

      <QrScannerClient
        sessionUser={{
          id: session.personId || '',
          name: session.name,
          role: session.role,
          orgType: session.orgType,
        }}
      />
    </div>
  );
}
