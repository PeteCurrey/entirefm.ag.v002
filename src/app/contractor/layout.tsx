import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/server/identity';
import Link from 'next/link';
import { LayoutDashboard, Briefcase, Calendar, Users, ShieldCheck, Receipt, MessageSquare, LogOut } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contractor Operations | EntireFM',
  description: 'EntireFM Contractor Operating Portal',
  robots: { index: false, follow: false, nocache: true },
};

export default async function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const navItems = [
    { href: '/contractor', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/contractor/work', label: 'Work & Offers', icon: <Briefcase className="w-4 h-4" /> },
    { href: '/contractor/schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { href: '/contractor/engineers', label: 'Engineers', icon: <Users className="w-4 h-4" /> },
    { href: '/contractor/compliance', label: 'Compliance', icon: <ShieldCheck className="w-4 h-4" /> },
    { href: '/contractor/commercial', label: 'Commercial & POs', icon: <Receipt className="w-4 h-4" /> },
    { href: '/contractor/messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-void text-white flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-brand-carbon border-r border-brand-edge-dark flex flex-col shrink-0">
        <div className="p-4 border-b border-brand-edge-dark flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-brand-electric font-black text-sm tracking-widest">ENTIREFM</span>
              <span className="bg-brand-edge-dark text-xs px-2 py-0.5 rounded text-brand-mist">PARTNER</span>
            </div>
            <p className="text-xs text-brand-mist truncate mt-1">
              {session.name || 'Service Provider'}
            </p>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-mist hover:text-white hover:bg-brand-edge-dark/50 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-edge-dark">
          <Link
            href="/api/auth/sign-out"
            className="flex items-center gap-2 text-xs text-brand-mist hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
