import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileCheck2,
  Building2,
  FileText,
  CreditCard,
  Receipt,
  Users,
  HelpCircle,
  Briefcase,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function SupplierPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/supplier-portal', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/supplier-portal/onboarding', label: 'Onboarding Wizard', icon: FileCheck2 },
    { href: '/supplier-portal/company', label: 'Partner Profile', icon: Building2 },
    { href: '/supplier-portal/documents', label: 'Document Vault', icon: FileText },
    { href: '/supplier-portal/opportunities', label: 'Opportunities', icon: Sparkles },
    { href: '/supplier-portal/jobs', label: 'Work Orders', icon: Briefcase },
    { href: '/supplier-portal/availability', label: 'Availability', icon: Clock },
    { href: '/supplier-portal/membership', label: 'Membership', icon: CreditCard },
    { href: '/supplier-portal/billing', label: 'Invoices & Billing', icon: Receipt },
    { href: '/supplier-portal/users', label: 'Team & Users', icon: Users },
    { href: '/supplier-portal/support', label: 'Support Desk', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F9] text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/supplier-portal" className="font-bold text-lg tracking-tight">
              Entire<span className="text-brand-pink">FM</span>{' '}
              <span className="text-xs font-mono font-light text-slate-400 block">Supplier Portal</span>
            </Link>
          </div>

          <nav className="p-4 space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
          <span>Org: Midlands HVAC Pro</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">● Portal Active</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
