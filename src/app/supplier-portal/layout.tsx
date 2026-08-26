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
  Clock,
  ClipboardList,
} from 'lucide-react';
import { getCurrentSession } from '@/server/identity';
import {
  getSupplierOrganisationById,
  getPortalStatusDisplay,
} from '@/server/suppliers/supplier-auth-store';

export default async function SupplierPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  const isSupplier = (session?.orgType as string) === 'SUPPLIER';

  // Resolve organisation and lifecycle status
  let orgDisplay = {
    orgName: 'New Supplier Application',
    statusLabel: 'Draft',
    statusColour: 'slate' as 'slate' | 'green' | 'amber',
    isApproved: false,
  };
  if (isSupplier && session?.orgId && session.orgId !== session.personId) {
    const org = await getSupplierOrganisationById(session.orgId);
    orgDisplay = getPortalStatusDisplay(org);
  }

  const isApproved = orgDisplay.isApproved;

  // Application-phase navigation (pre-approval)
  const applicationNav = [
    {
      heading: 'APPLICATION',
      items: [
        { href: '/supplier-portal/onboarding', label: 'Supplier Application', icon: LayoutDashboard },
        { href: '/supplier-portal/documents', label: 'Document Vault', icon: FileText },
        { href: '/supplier-portal/actions', label: 'Actions & Requests', icon: ClipboardList },
      ],
    },
    {
      heading: 'ACCOUNT',
      items: [
        { href: '/supplier-portal/company', label: 'Company Profile', icon: Building2 },
        { href: '/supplier-portal/billing', label: 'Billing', icon: Receipt },
        { href: '/supplier-portal', label: 'Application Status', icon: ShieldCheck },
      ],
    },
    {
      heading: 'HELP',
      items: [
        { href: '/supplier-portal/resources', label: 'Standards & Guides', icon: BookOpen },
        { href: '/supplier-portal/support', label: 'Support Desk', icon: HelpCircle },
      ],
    },
  ];

  // Full approved partner navigation
  const approvedNav = [
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

  const navSections = isApproved ? approvedNav : applicationNav;

  const statusColor = {
    green: 'text-emerald-400',
    amber: 'text-amber-400',
    slate: 'text-slate-400',
  }[orgDisplay.statusColour];

  return (
    <div className="min-h-screen bg-[#F7F6F9] text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/supplier-portal" className="font-bold text-lg tracking-tight">
              Entire<span className="text-brand-pink">FM</span>{' '}
              <span className="text-xs font-mono font-light text-slate-400 block">
                {isApproved ? 'Partner Portal' : 'Supplier Application'}
              </span>
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

        {/* Org status footer — lifecycle-aware, no mock data */}
        <div className="p-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="text-slate-300 font-bold block truncate">{orgDisplay.orgName}</span>
          <span className={`text-[10px] block mt-0.5 ${statusColor}`}>{orgDisplay.statusLabel}</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
