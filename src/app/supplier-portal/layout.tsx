import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Wrench,
  MapPin,
  ShieldCheck,
  FileText,
  CreditCard,
  Receipt,
  Users,
  Calendar,
  BookOpen,
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
  const navSections = [
    {
      heading: 'OVERVIEW',
      items: [
        { href: '/supplier-portal', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/supplier-portal/relationship', label: 'Relationship', icon: Building2 },
      ],
    },
    {
      heading: 'SCOPE & CAPABILITY',
      items: [
        { href: '/supplier-portal/services', label: 'Services Scope', icon: Wrench },
        { href: '/supplier-portal/coverage', label: 'Coverage & Bases', icon: MapPin },
        { href: '/supplier-portal/approvals', label: 'Approvals & Rules', icon: ShieldCheck },
      ],
    },
    {
      heading: 'ASSURANCE & VAULT',
      items: [
        { href: '/supplier-portal/compliance', label: 'Compliance Radar', icon: Clock },
        { href: '/supplier-portal/documents', label: 'Document Vault', icon: FileText },
      ],
    },
    {
      heading: 'PARTNER NETWORK',
      items: [
        { href: '/supplier-portal/membership', label: 'Membership', icon: CreditCard },
        { href: '/supplier-portal/billing', label: 'Invoices & Billing', icon: Receipt },
        { href: '/supplier-portal/events', label: 'Events & Forums', icon: Calendar },
      ],
    },
    {
      heading: 'MANAGEMENT & HELP',
      items: [
        { href: '/supplier-portal/company', label: 'Partner Profile', icon: Building2 },
        { href: '/supplier-portal/users', label: 'Team & Users', icon: Users },
        { href: '/supplier-portal/resources', label: 'Standards & Guides', icon: BookOpen },
        { href: '/supplier-portal/support', label: 'Support Desk', icon: HelpCircle },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F9] text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/supplier-portal" className="font-bold text-lg tracking-tight">
              Entire<span className="text-brand-pink">FM</span>{' '}
              <span className="text-xs font-mono font-light text-slate-400 block">Partner Portal</span>
            </Link>
          </div>

          <nav className="p-4 space-y-4 text-xs">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 px-3 font-bold block">
                  {sec.heading}
                </span>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="text-slate-300 font-bold block">Midlands HVAC Pro</span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">● Approved Supplier</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
