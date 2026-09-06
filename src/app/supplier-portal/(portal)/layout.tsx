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
  getSupplierOrganisationByOwnerId,
  getPortalStatusDisplay,
  validateSupplierAuthUser,
  setSupplierUserOrganisation,
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
  let effectiveOrgId =
    authState.supplierUser?.organisation_id ||
    (session.orgId && session.orgId !== session.personId ? session.orgId : null);

  let org = effectiveOrgId ? await getSupplierOrganisationById(effectiveOrgId) : null;
  if (!org && authState.authUser?.id) {
    org = await getSupplierOrganisationByOwnerId(authState.authUser.id);
    if (org) {
      effectiveOrgId = org.id;
      if (authState.supplierUser && !authState.supplierUser.organisation_id) {
        await setSupplierUserOrganisation(authState.authUser.id, org.id);
      }
    }
  }

  if (!effectiveOrgId || !org) {
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

  const statusBadge = {
    green: 'bg-cafm-nominal-surface text-cafm-nominal-text border-cafm-nominal-border',
    amber: 'bg-cafm-warning-surface text-cafm-warning-text border-cafm-warning-border',
    slate: 'bg-cafm-surface-muted text-cafm-text-secondary border-cafm-border',
  }[orgDisplay.statusColour] || 'bg-cafm-surface-muted text-cafm-text-secondary border-cafm-border';

  return (
    <div className="min-h-screen bg-cafm-surface-canvas text-cafm-text-primary flex flex-col md:flex-row font-cafm selection:bg-cafm-orange/20 selection:text-cafm-text-primary">
      {/* Authenticated Supplier Sidebar in CAFM Clean SaaS Style */}
      <aside className="w-full md:w-64 bg-cafm-surface-card text-cafm-text-primary flex flex-col justify-between shrink-0 border-r border-cafm-border shadow-xs">
        <div>
          <div className="p-5 border-b border-cafm-border flex items-center justify-between">
            <Link href="/supplier-portal" className="font-light text-lg tracking-tight text-cafm-text-primary">
              Entire<span className="font-medium text-cafm-orange">FM</span>{' '}
              <span className="text-[10.5px] uppercase tracking-wider text-cafm-text-secondary block mt-0.5 font-normal">
                {isApproved ? 'Partner Network Portal' : 'Supplier Assurance Hub'}
              </span>
            </Link>
          </div>

          <nav className="p-3 space-y-4 text-xs">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[9.5px] font-normal uppercase tracking-wider text-cafm-text-muted px-3 block">
                  {sec.heading}
                </span>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-cafm-text-secondary hover:text-cafm-text-primary hover:bg-cafm-surface-muted transition-all font-normal group"
                    >
                      <Icon className="h-3.5 w-3.5 text-cafm-text-muted group-hover:text-cafm-text-primary shrink-0 transition-colors" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Organisation Status Footer & Logout */}
        <div className="p-4 border-t border-cafm-border bg-cafm-surface-muted/40 space-y-3">
          <div className="text-[11.5px] text-cafm-text-secondary">
            <span className="text-cafm-text-primary font-medium block truncate">{orgDisplay.orgName}</span>
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-[4px] border mt-1 font-medium uppercase tracking-wider ${statusBadge}`}>
              {orgDisplay.statusLabel}
            </span>
          </div>

          <form action="/api/auth/logout?redirect=/supplier-portal/sign-in" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-[11.5px] text-cafm-text-secondary hover:text-cafm-critical-text transition-colors pt-2.5 border-t border-cafm-border w-full"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Authenticated Workspace Area */}
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1760px] mx-auto">
        {children}
      </main>
    </div>
  );
}
