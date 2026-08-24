import React from 'react';
import type { Metadata } from 'next';
import { getCurrentSession, requireAdminSession } from '@/server/identity';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { CommandPalette } from '@/components/admin/CommandPalette';

export const metadata: Metadata = {
  title: { absolute: 'EntireFM Operations Cockpit' },
  robots: { index: false, follow: false, nocache: true },
};

// Admin views must be dynamic to reflect live operational changes
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login?redirect=/admin');
  }

  try {
    requireAdminSession(session);
  } catch {
    redirect('/login?error=forbidden_admin');
  }

  return (
    <div className="min-h-screen bg-brand-void text-brand-mist selection:bg-brand-electric selection:text-white">
      {/* Fixed Sidebar */}
      <AdminSidebar session={session} />

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        <AdminHeader session={session} />
        <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
