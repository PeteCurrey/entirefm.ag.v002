/**
 * LEGACY CLIENT PORTAL STUB — /client
 * ====================================
 * This layout is retained for Next.js build compatibility only.
 * The canonical client application is /clients — middleware.ts issues a 308 redirect.
 * This server-side redirect is a belt-and-suspenders fallback.
 */
import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: { absolute: 'Client Portal — EntireFM' },
  robots: { index: false, follow: false, nocache: true },
};

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  redirect('/clients');
}
