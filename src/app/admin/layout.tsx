import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getCurrentSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CommandPalette } from '@/components/admin/CommandPalette';
import { getSupplierApplicationQueueCounts } from '@/server/suppliers/applications-repo';
import './cafm.css';

export const metadata: Metadata = {
  title: { absolute: 'EntireFM Operations Control Centre' },
  robots: { index: false, follow: false, nocache: true },
};

// Admin views must be dynamic to reflect live operational changes
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  // Standalone public admin subroutes bypass the Operations sidebar/header
  const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/access-denied';
  if (isPublicAdminRoute) {
    return <>{children}</>;
  }

  const session = await getCurrentSession();

  if (!session) {
    const returnUrl = pathname && pathname !== '/admin' ? `/admin/login?next=${encodeURIComponent(pathname)}` : '/admin/login';
    redirect(returnUrl);
  }

  if (session.orgType !== 'ENTIREFM' || session.activeApplication !== 'ADMIN') {
    redirect('/admin/access-denied');
  }

  // Live badge count — pending supplier applications requiring admin action
  const applicationCounts = await getSupplierApplicationQueueCounts().catch(() => null);
  const pendingApplicationsCount =
    (applicationCounts?.underReview ?? 0) +
    (applicationCounts?.informationRequired ?? 0) +
    (applicationCounts?.classificationRequired ?? 0);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] selection:bg-[#EA580C]/20 selection:text-[#111111] cafm-app font-sans">
      {/* Precision Navigation Rail */}
      <AdminSidebar session={session} pendingApplicationsCount={pendingApplicationsCount} />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        <AdminHeader session={session} />
        <main className="flex-1 p-6 lg:p-8 max-w-[1760px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
