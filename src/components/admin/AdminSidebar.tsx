'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { UserSession } from '@/server/identity';
import { CafmBrandMark } from '@/components/brand/CafmBrandMark';
import {
  Activity,
  AlertTriangle,
  CheckSquare,
  Building2,
  Wrench,
  Calendar,
  Zap,
  ShieldCheck,
  Truck,
  DollarSign,
  Receipt,
  Mail,
  Bot,
  BarChart3,
  Send,
  TrendingUp,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Layers,
  MapPin,
  ClipboardList,
  Flame,
  Briefcase,
  Newspaper,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  badge?: string;
  indent?: boolean;
}

interface NavGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  items: NavItem[];
}

// ── CAFM / OPERATIONS NAVIGATION (10 Canonical Domains) ───────────────────────────
const CAFM_GROUPS: NavGroup[] = [
  {
    title: 'COMMAND CENTRE',
    icon: Activity,
    items: [
      { name: 'Control Centre', href: '/admin' },
      { name: 'Operational Queues', href: '/admin/operations/queues', badge: 'Live' },
      { name: "Today's Exceptions", href: '/admin/operations/today' },
      { name: 'AI Helpdesk Desk', href: '/admin/operations/helpdesk', badge: 'AI' },
      { name: 'CEO Command', href: '/admin/command' },
    ],
  },
  {
    title: 'WORK & HELP DESK',
    icon: Wrench,
    items: [
      { name: 'Service Requests', href: '/admin/operations/service-requests' },
      { name: 'Work Orders', href: '/admin/operations/work-orders' },
      { name: '↳ Open Work Orders', href: '/admin/operations/work-orders?status=OPEN', indent: true },
      { name: '↳ In Progress', href: '/admin/operations/work-orders?status=IN_PROGRESS', indent: true },
      { name: '↳ Completed', href: '/admin/operations/work-orders?status=COMPLETED', indent: true },
      { name: 'Dispatch Grid', href: '/admin/operations/dispatch' },
      { name: 'SLA Control', href: '/admin/operations/sla-control' },
      { name: 'Completion Review', href: '/admin/operations/completion-review' },
      { name: 'Operations Map', href: '/admin/operations/map' },
    ],
  },
  {
    title: 'ESTATE & CLIENTS',
    icon: Building2,
    items: [
      { name: 'Clients Hub', href: '/admin/estate/clients' },
      { name: 'Managed Sites (Site 360)', href: '/admin/estate/sites' },
      { name: 'Buildings & Spaces', href: '/admin/estate/spaces' },
      { name: 'Asset Registry', href: '/admin/estate/assets' },
      { name: 'Contracts & SLAs', href: '/admin/estate/contracts' },
      { name: 'EntireFM Team', href: '/admin/estate/team' },
      { name: 'Data Import Centre', href: '/admin/estate/imports' },
    ],
  },
  {
    title: 'PLANNED MAINTENANCE (PPM)',
    icon: Calendar,
    items: [
      { name: 'Maintenance Plans', href: '/admin/planned-maintenance/plans' },
      { name: 'PPM Schedule & Due', href: '/admin/planned-maintenance/schedule' },
      { name: 'PPM Autopilot', href: '/admin/planned-maintenance/ppm-autopilot', badge: 'AI' },
      { name: 'Statutory Requirements', href: '/admin/planned-maintenance/requirements' },
      { name: 'PPM Exceptions', href: '/admin/planned-maintenance/exceptions' },
    ],
  },
  {
    title: 'COMMERCIAL',
    icon: DollarSign,
    items: [
      { name: 'Commercial Hub', href: '/admin/commercial' },
      { name: 'Quotes & Proposals', href: '/admin/commercial/quotes' },
      { name: '↳ Create Quote', href: '/admin/commercial/quotes?create=true', indent: true },
      { name: 'Talk-to-Quote', href: '/admin/commercial/talk-to-quote', badge: 'AI' },
      { name: 'Commercial Pipeline', href: '/admin/commercial/pipeline' },
      { name: 'WIP & Billing Readiness', href: '/admin/commercial/wip' },
      { name: 'Rate Cards', href: '/admin/commercial/rate-cards' },
      { name: 'Commercial Policies', href: '/admin/commercial/policies' },
      { name: 'Commercial Variations', href: '/admin/commercial/variations' },
    ],
  },
  {
    title: 'SUPPLY CHAIN & ENGINEERS',
    icon: Truck,
    items: [
      { name: 'Suppliers & Contractors', href: '/admin/suppliers' },
      { name: 'Supplier Directory', href: '/admin/suppliers/directory' },
      { name: 'Applications & Onboarding', href: '/admin/suppliers/applications' },
      { name: 'Engineers & Operatives', href: '/admin/supply-chain/engineers' },
      { name: 'Coverage & Gaps', href: '/admin/suppliers/coverage' },
    ],
  },
  {
    title: 'COMPLIANCE & ASSURANCE',
    icon: ShieldCheck,
    items: [
      { name: 'Compliance Command', href: '/admin/compliance' },
      { name: 'Obligations & Rules', href: '/admin/compliance/obligations' },
      { name: 'Certificates & Expiries', href: '/admin/compliance/certificates' },
      { name: 'Evidence Vault', href: '/admin/compliance/evidence' },
      { name: 'Compliance Audits', href: '/admin/compliance/audits' },
      { name: 'Compliance Reports', href: '/admin/compliance/reports' },
      { name: 'Rule Applicability', href: '/admin/compliance/applicability' },
    ],
  },
  {
    title: 'FINANCE & INVOICING',
    icon: Receipt,
    items: [
      { name: 'Finance Command', href: '/admin/finance' },
      { name: 'Client Invoices', href: '/admin/finance/client-invoices' },
      { name: '↳ Create Invoice', href: '/admin/finance/client-invoices?create=true', indent: true },
      { name: 'Billing Ready Work', href: '/admin/finance/billing-ready' },
      { name: 'Supplier Invoices', href: '/admin/finance/supplier-invoices' },
      { name: 'Credit Notes', href: '/admin/finance/credit-notes' },
      { name: 'Accounting Sync', href: '/admin/finance/accounting' },
      { name: 'Xero Integration', href: '/admin/integrations/xero' },
    ],
  },
  {
    title: 'INTELLIGENCE & REPORTING',
    icon: BarChart3,
    items: [
      { name: 'Operations Reports', href: '/admin/reporting/operations' },
      { name: 'Asset Telemetry & Intelligence', href: '/admin/estate/assets/telemetry' },
      { name: 'Energy & Sustainability', href: '/admin/energy' },
    ],
  },
  {
    title: 'SYSTEM & ADMINISTRATION',
    icon: Settings,
    items: [
      { name: 'Platform Settings', href: '/admin/platform/settings' },
      { name: 'Users & Permissions', href: '/admin/platform/users' },
      { name: 'Integrations', href: '/admin/platform/integrations' },
      { name: 'Xero Accounting', href: '/admin/integrations/xero' },
      { name: 'Platform Health', href: '/admin/platform/health' },
      { name: 'Audit Log', href: '/admin/platform/audit' },
    ],
  },
];

// ── WEBSITE MANAGEMENT NAVIGATION ───────────────────────────
const WEBSITE_GROUPS: NavGroup[] = [
  {
    title: 'LEADS & CONTENT',
    icon: TrendingUp,
    items: [
      { name: 'Inbound Leads', href: '/admin/growth/leads' },
      { name: 'Website Enquiries', href: '/admin/growth/enquiries' },
      { name: 'Sector Content', href: '/admin/content/sectors' },
      { name: 'Trust & Case Studies', href: '/admin/content/trust' },
      { name: 'Digital PR', href: '/admin/content/pr' },
    ],
  },
  {
    title: 'EDITORIAL & BLOG',
    icon: BookOpen,
    items: [
      { name: 'Editorial Dashboard', href: '/admin/blog' },
      { name: 'All Posts', href: '/admin/blog/posts' },
      { name: 'New Post', href: '/admin/blog/new' },
      { name: 'Content Intelligence', href: '/admin/blog/intelligence' },
      { name: 'Editorial Calendar', href: '/admin/blog/calendar' },
      { name: 'Media Library', href: '/admin/blog/media' },
      { name: 'Categories & Topics', href: '/admin/blog/categories' },
      { name: 'Authors', href: '/admin/blog/authors' },
    ],
  },
  {
    title: 'CAREERS & ATS',
    icon: Briefcase,
    items: [
      { name: 'Careers Dashboard', href: '/admin/careers' },
      { name: 'Job Vacancies', href: '/admin/careers/vacancies' },
      { name: 'Applications & ATS', href: '/admin/careers/applications' },
      { name: 'Talent Pool', href: '/admin/careers/talent-pool' },
    ],
  },
  {
    title: 'SEO & SEARCH INTELLIGENCE',
    icon: Layers,
    items: [
      { name: 'SEO Health', href: '/admin/blog/seo' },
      { name: 'Search Opportunities', href: '/admin/seo/opportunities' },
      { name: 'Geo Search Locations', href: '/admin/seo/locations' },
      { name: 'AI Citations', href: '/admin/seo/ai-search' },
    ],
  },
  {
    title: 'THE LOBBY DAILY',
    icon: Newspaper,
    items: [
      { name: 'Daily Briefings', href: '/admin/lobby/newsletters' },
      { name: 'Pulse Benchmarks', href: '/admin/pulse' },
      { name: 'Analytics & Audience', href: '/admin/lobby/newsletters/analytics' },
      { name: 'Publishing Settings', href: '/admin/lobby/newsletters/settings' },
    ],
  },
  {
    title: 'MARKETING & NEWSLETTER',
    icon: Send,
    items: [
      { name: 'Newsletter Overview', href: '/admin/newsletter' },
      { name: 'Campaigns', href: '/admin/newsletter/campaigns' },
      { name: 'Subscribers', href: '/admin/newsletter/subscribers' },
      { name: 'Audience & Growth', href: '/admin/newsletter/audience' },
    ],
  },
  {
    title: 'ACADEMY & CERTIFICATIONS',
    icon: GraduationCap,
    items: [
      { name: 'Learning Paths & Assessments', href: '/admin/academy' },
    ],
  },
];

export function AdminSidebar({
  session,
  pendingApplicationsCount = 0,
  newLeadsCount = 0,
  newMembersCount = 0,
}: {
  session: UserSession;
  pendingApplicationsCount?: number;
  newLeadsCount?: number;
  newMembersCount?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString();
  const currentFullUrl = queryString ? `${pathname}?${queryString}` : pathname;

  const isWebsiteRoute =
    pathname.startsWith('/admin/growth') ||
    pathname.startsWith('/admin/blog') ||
    pathname.startsWith('/admin/careers') ||
    pathname.startsWith('/admin/seo') ||
    pathname.startsWith('/admin/newsletter') ||
    pathname.startsWith('/admin/lobby') ||
    pathname.startsWith('/admin/content') ||
    pathname.startsWith('/admin/academy');

  const [activeSection, setActiveSection] = useState<'CAFM' | 'WEBSITE'>(
    isWebsiteRoute ? 'WEBSITE' : 'CAFM'
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const currentGroups = activeSection === 'CAFM' ? CAFM_GROUPS : WEBSITE_GROUPS;

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-[#E8E8E5] bg-[#FFFFFF]">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#E8E8E5] px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <CafmBrandMark size="sm" />
          <div className="flex flex-col">
            <span className="text-[13px] font-normal text-[#111111] tracking-tight leading-none">
              EntireCAFM
            </span>
            <span className="text-[10px] text-[#6D6D68] leading-tight mt-0.5">
              Control Desk
            </span>
          </div>
        </Link>
      </div>

      {/* Product Split Segmented Control */}
      <div className="p-3 pb-1 border-b border-[#E8E8E5] bg-[#FAFAF8]">
        <div className="flex rounded-[8px] bg-[#EEEEEC] p-0.5 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setActiveSection('CAFM')}
            className={`flex-1 py-1 px-2 rounded-[6px] text-center transition-all ${
              activeSection === 'CAFM'
                ? 'bg-[#FFFFFF] text-[#111111] shadow-xs'
                : 'text-[#6D6D68] hover:text-[#111111]'
            }`}
          >
            CAFM / Operations
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('WEBSITE')}
            className={`flex-1 py-1 px-2 rounded-[6px] text-center transition-all ${
              activeSection === 'WEBSITE'
                ? 'bg-[#FFFFFF] text-[#111111] shadow-xs'
                : 'text-[#6D6D68] hover:text-[#111111]'
            }`}
          >
            Website &amp; Leads
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 cafm-scroll">
        <div className="space-y-3.5">
          {currentGroups
            .filter((group) => {
              if (!group.permission) return true;
              const perms = session.permissions as string[];
              return (
                perms?.includes(group.permission) ||
                session.role === 'SUPER_ADMIN' ||
                session.role === 'CEO'
              );
            })
            .map((group) => {
              const isCollapsed = collapsedGroups[group.title];
              const GroupIcon = group.icon;

              return (
                <div key={group.title} className="space-y-0.5">
                  {/* Group Heading */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="flex w-full items-center justify-between px-2 py-1 text-left text-[11px] font-normal text-[#6D6D68] hover:text-[#111111] transition-colors rounded-[6px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <GroupIcon className="h-3.5 w-3.5 text-[#9A9A95]" />
                      <span>{group.title}</span>
                    </div>
                    {isCollapsed ? (
                      <ChevronRight className="h-3 w-3 text-[#9A9A95]" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-[#9A9A95]" />
                    )}
                  </button>

                  {/* Items */}
                  {!isCollapsed && (
                    <div className="space-y-0.5 pt-0.5">
                      {group.items.map((item) => {
                        const isActive = (() => {
                          if (item.href === '/admin') {
                            return pathname === '/admin';
                          }
                          if (item.href.includes('?')) {
                            return currentFullUrl === item.href;
                          }
                          if (pathname === item.href) {
                            return !queryString || !queryString.includes('status=');
                          }
                          return pathname.startsWith(item.href + '/');
                        })();

                        const isApplicationsLink = item.href === '/admin/suppliers/applications';
                        const isLeadsLink = item.href === '/admin/growth/leads';
                        const isMembersLink = item.href === '/admin/lobby/members';

                        let liveCount: number | null = null;
                        if (isApplicationsLink && pendingApplicationsCount > 0) {
                          liveCount = pendingApplicationsCount;
                        } else if (isLeadsLink && newLeadsCount > 0) {
                          liveCount = newLeadsCount;
                        } else if (isMembersLink && newMembersCount > 0) {
                          liveCount = newMembersCount;
                        }

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between rounded-[6px] transition-all duration-120 relative ${
                              item.indent
                                ? 'ml-3 pl-2.5 pr-2 py-1.5 text-[12px]'
                                : 'px-2.5 py-1.5 text-[12.5px]'
                            } ${
                              isActive
                                ? item.indent
                                  ? 'bg-[#FAFAF8] text-[#111111] font-medium border-l-[2px] border-[#EA580C]'
                                  : 'bg-[#FAFAF8] text-[#111111] font-normal border-l-[3px] border-[#EA580C] pl-2'
                                : 'text-[#6D6D68] hover:bg-[#FAFAF8] hover:text-[#111111] font-light'
                            }`}
                          >
                            <span className="truncate flex items-center gap-1.5">
                              {item.indent && (
                                <span className="text-[#9A9A95] font-mono text-[10px] select-none">
                                  ↳
                                </span>
                              )}
                              <span>{item.name.replace(/^↳\s*/, '')}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              {liveCount !== null && (
                                <span className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-700">
                                  {liveCount}
                                </span>
                              )}
                              {item.badge && !liveCount && (
                                <span
                                  className={`rounded-[4px] px-1.5 py-0.2 text-[9px] font-normal ${
                                    isActive
                                      ? 'bg-[#EA580C]/10 text-[#EA580C]'
                                      : 'bg-[#F0F0EE] text-[#6D6D68]'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Account Footer */}
      <div className="border-t border-[#E8E8E5] p-3 bg-[#FFFFFF]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#111111] text-white text-[11.5px] font-normal">
              {session.name ? session.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[12px] font-normal text-[#111111] leading-tight">
                {session.name || 'User'}
              </div>
              <div className="text-[10px] text-[#6D6D68] leading-tight">
                {session.role}
              </div>
            </div>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              title="Sign out"
              className="rounded-[6px] p-1.5 text-[#9A9A95] hover:bg-[#FAFAF8] hover:text-[#111111] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
