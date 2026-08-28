import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
  LogOut,
} from 'lucide-react';
import { getCurrentSession } from '@/server/identity';
import {
  getSupplierOrganisationById,
  getPortalStatusDisplay,
  validateSupplierAuthUser,
} from '@/server/suppliers/supplier-auth-store';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthenticatedSupplierPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Mandatory Server-Side Session Resolution (Fail-Closed)
  const session = await getCurrentSession();
  if (!session || session.orgType !== 'SUPPLIER') {
    redirect('/supplier-portal/sign-in');
  }

  // Live Supabase Auth Validation
  const authState = await validateSupplierAuthUser(session.personId || session.authUserId || '');
  if (!authState.valid || !authState.authUser) {
    redirect('/supplier-portal/sign-in');
  }

  // 2. Organisation Context Resolution (Fail-Closed, Canonical Authority First)
  const effectiveOrgId =
    authState.supplierUser?.organisation_id ||
    (session.orgId && session.orgId !== session.personId ? session.orgId : null);

  if (!effectiveOrgId) {
    redirect('/supplier-portal/org-setup');
  }

  const org = await getSupplierOrganisationById(effectiveOrgId);
  if (!org) {
    redirect('/supplier-portal/org-setup');
  }

  const orgDisplay = getPortalStatusDisplay(org);
  const isApproved = orgDisplay.isApproved;

  // 3. LIFECYCLE ROUTING GATE
  // APPROVED suppliers → operational contractor portal (/contractor)
  // REJECTED suppliers → stay here to see their decision (handled by page content)
  if (isApproved) {
    // Approved suppliers have graduated from the application portal.
    // The /contractor portal is their operational home.
    redirect('/contractor');
  }

  // 4. Lifecycle-Aware Navigation Sections
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
      {/* Authenticated Supplier Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/supplier-portal" className="font-bold text-lg tracking-tight">
              Entire<span className="text-brand-pink">FM</span>{' '}
              <span className="text-xs font-light text-slate-400 block">
                {isApproved ? 'Partner Portal' : 'Supplier Application'}
              </span>
            </Link>
          </div>

          <nav className="p-4 space-y-4 text-xs">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[9.5px] font-light uppercase tracking-wider text-slate-400 px-3 font-bold block">
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

        {/* Organisation Status Footer & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="text-[11px] font-light text-slate-400">
            <span className="text-slate-300 font-bold block truncate">{orgDisplay.orgName}</span>
            <span className={`text-[10px] block mt-0.5 ${statusColor}`}>{orgDisplay.statusLabel}</span>
          </div>

          <form action="/api/auth/logout?redirect=/supplier-portal/sign-in" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-[11px] text-slate-400 hover:text-rose-300 transition-colors pt-2 border-t border-slate-800/80 w-full"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Authenticated Workspace Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
