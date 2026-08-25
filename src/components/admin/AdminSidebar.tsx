'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  badge?: string;
}

interface NavGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'CONTROL',
    icon: Activity,
    items: [
      { name: 'Operations Control Centre', href: '/admin' },
      { name: 'CEO Command', href: '/admin/command' },
      { name: 'Alerts & Exceptions', href: '/admin/command/alerts-exceptions' },
      { name: 'Approvals Gate', href: '/admin/command/approvals' },
      { name: 'Query History', href: '/admin/command/history' },
    ],
  },
  {
    title: 'OPERATIONS',
    icon: Wrench,
    items: [
      { name: 'Control Centre', href: '/admin/operations' },
      { name: "Today's Exceptions", href: '/admin/operations/today' },
      { name: 'Live Contracts', href: '/admin/operations/contracts' },
      { name: 'Live Helpdesk', href: '/admin/operations/helpdesk' },
      { name: 'Service Requests', href: '/admin/operations/service-requests' },
      { name: 'Work Orders', href: '/admin/operations/work-orders' },
      { name: 'Dispatch Grid', href: '/admin/operations/dispatch' },
      { name: 'SLA Control', href: '/admin/operations/sla' },
      { name: 'Escalations Desk', href: '/admin/operations/escalations' },
    ],
  },
  {
    title: 'ESTATE',
    icon: Building2,
    items: [
      { name: 'Clients', href: '/admin/estate/clients' },
      { name: 'Contracts', href: '/admin/estate/contracts' },
      { name: 'Portfolios', href: '/admin/estate/portfolios' },
      { name: 'Managed Sites (Site 360)', href: '/admin/estate/sites' },
      { name: 'Buildings & Spaces', href: '/admin/estate/spaces' },
      { name: 'Asset Registry', href: '/admin/estate/assets' },
      { name: 'Asset Review Desk', href: '/admin/estate/assets/review' },
      { name: 'Data Quality', href: '/admin/estate/assets/data-quality' },
      { name: 'Mobilisations', href: '/admin/estate/mobilisations' },
      { name: 'Imports', href: '/admin/estate/imports' },
    ],
  },
  {
    title: 'PLANNED MAINTENANCE',
    icon: Calendar,
    items: [
      { name: 'PPM Autopilot', href: '/admin/planned-maintenance/ppm-autopilot' },
      { name: 'Maintenance Plans', href: '/admin/planned-maintenance/plans' },
      { name: 'Requirements & Sources', href: '/admin/planned-maintenance/requirements' },
      { name: 'PPM Schedule', href: '/admin/planned-maintenance/schedule' },
      { name: 'Exceptions Desk', href: '/admin/planned-maintenance/exceptions' },
    ],
  },
  {
    title: 'ENERGY & CARBON',
    icon: Zap,
    items: [
      { name: 'Energy Overview', href: '/admin/energy' },
      { name: 'Portfolio Performance', href: '/admin/energy/portfolio' },
      { name: 'Meters & Feeds', href: '/admin/energy/meters' },
      { name: 'Baseload & Out-of-Hours', href: '/admin/energy/baseload' },
      { name: 'HVAC Intelligence', href: '/admin/energy/hvac' },
      { name: 'Anomalies', href: '/admin/energy/anomalies' },
      { name: 'M&V Projects', href: '/admin/energy/projects' },
      { name: 'Carbon & Factors', href: '/admin/energy/carbon' },
    ],
  },
  {
    title: 'ASSURANCE & COMPLIANCE',
    icon: ShieldCheck,
    items: [
      { name: 'Compliance Command', href: '/admin/compliance/command' },
      { name: 'Obligations', href: '/admin/compliance/obligations' },
      { name: 'Evidence Vault', href: '/admin/compliance/evidence' },
      { name: 'Certificates', href: '/admin/compliance/certificates' },
      { name: 'Expiries', href: '/admin/compliance/expiries' },
      { name: 'Audits', href: '/admin/compliance/audits' },
      { name: 'Rules & Sources', href: '/admin/compliance/rules' },
    ],
  },
  {
    title: 'SUPPLIERS & PARTNERS',
    icon: Truck,
    items: [
      { name: 'Control Centre', href: '/admin/suppliers' },
      { name: 'Partnership Landscape', href: '/admin/suppliers/landscape' },
      { name: 'Supplier Directory', href: '/admin/suppliers/directory' },
      { name: 'Target Partners', href: '/admin/suppliers/targets' },
      { name: 'Coverage Matrix', href: '/admin/suppliers/coverage' },
      { name: 'Capabilities', href: '/admin/suppliers/capabilities' },
      { name: 'Manufacturers & OEMs', href: '/admin/suppliers/oems' },
      { name: 'Technology Partners', href: '/admin/suppliers/technology' },
      { name: 'Supply Chain Gaps', href: '/admin/suppliers/gaps' },
      { name: 'Applications', href: '/admin/suppliers/applications' },
      { name: 'Recruitment Queue', href: '/admin/suppliers/recruitment' },
      { name: 'Commercial Hub', href: '/admin/suppliers/commercial' },
      { name: 'Memberships', href: '/admin/suppliers/commercial/memberships' },
      { name: 'Invoices & Billing', href: '/admin/suppliers/commercial/invoices' },
      { name: 'Partner Events', href: '/admin/suppliers/commercial/events' },
      { name: 'Settings & Targets', href: '/admin/suppliers/settings' },
    ],
  },
  {
    title: 'COMMERCIAL & SALES',
    icon: DollarSign,
    items: [
      { name: 'Commercial Hub', href: '/admin/commercial' },
      { name: 'Talk-to-Quote', href: '/admin/commercial/talk-to-quote', badge: 'AI' },
      { name: 'Quotes & Proposals', href: '/admin/commercial/quotes' },
      { name: 'WIP & Margins', href: '/admin/commercial/wip' },
      { name: 'Rate Cards', href: '/admin/commercial/rate-cards' },
      { name: 'Commercial Policies', href: '/admin/commercial/policies' },
      { name: 'Exceptions Desk', href: '/admin/commercial/exceptions' },
      { name: 'Variation Orders', href: '/admin/commercial/variations' },
      { name: 'Pipeline Board', href: '/admin/commercial/pipeline' },
      { name: 'Site Surveys', href: '/admin/commercial/site-surveys' },
    ],
  },
  {
    title: 'FINANCE & INVOICING',
    icon: Receipt,
    items: [
      { name: 'Finance Command', href: '/admin/finance' },
      { name: 'Supplier Invoices', href: '/admin/finance/supplier-invoices' },
      { name: 'Billing Ready', href: '/admin/finance/billing-ready' },
      { name: 'Client Invoices', href: '/admin/finance/client-invoices' },
      { name: 'Credit Notes', href: '/admin/finance/credit-notes' },
      { name: 'Exceptions & Alerts', href: '/admin/finance/exceptions' },
      { name: 'Accounting Sync', href: '/admin/finance/accounting' },
    ],
  },
  {
    title: 'COMMUNICATIONS',
    icon: Mail,
    items: [
      { name: 'Unified Inbox', href: '/admin/communications/inbox' },
      { name: 'Calls', href: '/admin/communications/calls' },
      { name: 'Email', href: '/admin/communications/email' },
      { name: 'SMS', href: '/admin/communications/sms' },
      { name: 'Chat', href: '/admin/communications/chat' },
      { name: 'Notifications', href: '/admin/communications/notifications' },
      { name: 'Templates', href: '/admin/communications/templates' },
    ],
  },
  {
    title: 'AI & AUTOMATION',
    icon: Bot,
    items: [
      { name: 'AI Control Centre', href: '/admin/ai/control' },
      { name: 'Agent Registry', href: '/admin/ai/agents' },
      { name: 'Agent Activity', href: '/admin/ai/activity' },
      { name: 'Automation Rules', href: '/admin/ai/rules' },
      { name: 'Workflow Runs', href: '/admin/ai/workflows' },
      { name: 'Exceptions', href: '/admin/ai/exceptions' },
      { name: 'Human Overrides', href: '/admin/ai/overrides' },
      { name: 'AI Costs', href: '/admin/ai/costs' },
    ],
  },
  {
    title: 'REPORTING',
    icon: BarChart3,
    items: [
      { name: 'Operations Reports', href: '/admin/reporting/operations' },
      { name: 'Clients', href: '/admin/reporting/clients' },
      { name: 'SLA Analysis', href: '/admin/reporting/sla' },
      { name: 'PPM Performance', href: '/admin/reporting/ppm' },
      { name: 'Compliance Pack', href: '/admin/reporting/compliance' },
      { name: 'Supply Chain', href: '/admin/reporting/supply-chain' },
      { name: 'Finance Ledger', href: '/admin/reporting/finance' },
      { name: 'Executive Summary', href: '/admin/reporting/executive' },
    ],
  },
  {
    title: 'MARKETING & NEWSLETTER',
    icon: Send,
    items: [
      { name: 'Newsletter Dashboard', href: '/admin/newsletter' },
      { name: 'Campaigns', href: '/admin/newsletter/campaigns' },
      { name: 'New Campaign', href: '/admin/newsletter/new' },
      { name: 'Subscribers', href: '/admin/newsletter/subscribers' },
      { name: 'Audience & Growth', href: '/admin/newsletter/audience' },
      { name: 'Automation & Briefing', href: '/admin/newsletter/automation' },
      { name: 'Automation Jobs', href: '/admin/newsletter/automation/jobs' },
      { name: 'Analytics', href: '/admin/newsletter/analytics' },
      { name: 'Suppression List', href: '/admin/newsletter/suppression' },
    ],
  },
  {
    title: 'GROWTH & ATTRIBUTION',
    icon: TrendingUp,
    items: [
      { name: 'Growth Overview', href: '/admin/growth' },
      { name: 'Inbound Leads', href: '/admin/growth/leads' },
      { name: 'Attribution Models', href: '/admin/growth/attribution' },
      { name: 'SEO Conversion', href: '/admin/growth/seo-conversion' },
      { name: 'Service Performance', href: '/admin/growth/services' },
      { name: 'Location Performance', href: '/admin/growth/locations' },
      { name: 'Sector Performance', href: '/admin/growth/sectors' },
      { name: 'Sector Content', href: '/admin/content/sectors' },
      { name: 'Tools & Resources', href: '/admin/growth/tools' },
      { name: 'Conversion Funnels', href: '/admin/growth/funnels' },
      { name: 'Content CRO', href: '/admin/content/conversion' },
      { name: 'Commercial Insights', href: '/admin/growth/insights' },
      { name: 'Diagnostics & QA', href: '/admin/growth/diagnostics' },
    ],
  },
  {
    title: 'EDITORIAL & INSIGHTS',
    icon: BookOpen,
    items: [
      { name: 'Editorial Dashboard', href: '/admin/blog' },
      { name: 'Content Intelligence', href: '/admin/blog/intelligence' },
      { name: 'Weekly Briefing', href: '/admin/blog/intelligence/weekly' },
      { name: 'All Posts', href: '/admin/blog/posts' },
      { name: 'New Post', href: '/admin/blog/new' },
      { name: 'Editorial Calendar', href: '/admin/blog/calendar' },
      { name: 'Digital PR', href: '/admin/content/pr' },
      { name: 'AI Draft Queue', href: '/admin/blog/ai-queue' },
      { name: 'Topic Opportunities', href: '/admin/blog/topics' },
      { name: 'Categories', href: '/admin/blog/categories' },
      { name: 'Authors', href: '/admin/blog/authors' },
      { name: 'Media Library', href: '/admin/blog/media' },
      { name: 'Distribution', href: '/admin/blog/distribution' },
      { name: 'SEO Health', href: '/admin/blog/seo' },
      { name: 'AI Citations', href: '/admin/seo/ai-search' },
      { name: 'Geo Search', href: '/admin/seo/locations' },
      { name: 'SEO Priority Queue', href: '/admin/seo/priorities' },
      { name: 'Search Opportunities', href: '/admin/seo/opportunities' },
      { name: 'Trust Register', href: '/admin/content/trust' },
      { name: 'External Sources', href: '/admin/blog/sources' },
      { name: 'Automation Settings', href: '/admin/blog/automation' },
      { name: 'Automation Jobs', href: '/admin/blog/automation/jobs' },
    ],
  },
  {
    title: 'PLATFORM & SYSTEM',
    icon: Settings,
    permission: 'platform:admin',
    items: [
      { name: 'Users', href: '/admin/platform/users' },
      { name: 'Access & Permissions', href: '/admin/platform/access' },
      { name: 'Organisations', href: '/admin/platform/organisations' },
      { name: 'Integrations', href: '/admin/platform/integrations' },
      { name: 'API & Webhooks', href: '/admin/platform/webhooks' },
      { name: 'Data Imports', href: '/admin/platform/imports' },
      { name: 'Migration Tools', href: '/admin/platform/migration' },
      { name: 'Taxonomies', href: '/admin/platform/taxonomies' },
      { name: 'System Settings', href: '/admin/platform/settings' },
      { name: 'Audit Log', href: '/admin/platform/audit' },
      { name: 'Feature Flags', href: '/admin/platform/flags' },
      { name: 'Platform Health', href: '/admin/platform/health' },
    ],
  },
];

export function AdminSidebar({ session }: { session: UserSession }) {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-[#E8E8E5] bg-[#FFFFFF]">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-[#E8E8E5] px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <CafmBrandMark size="sm" />
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#111111] tracking-tight leading-none">
              EntireCAFM
            </span>
            <span className="text-[10px] text-[#6D6D68] leading-tight mt-0.5">
              Control Desk
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 cafm-scroll">
        <div className="space-y-3.5">
          {NAV_GROUPS.filter((group) => {
            if (!group.permission) return true;
            const perms = session.permissions as string[];
            return (
              perms?.includes(group.permission) ||
              session.role === 'SUPER_ADMIN' ||
              session.role === 'CEO'
            );
          }).map((group) => {
            const isCollapsed = collapsedGroups[group.title];
            const GroupIcon = group.icon;

            return (
              <div key={group.title} className="space-y-0.5">
                {/* Group Heading */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between px-2 py-1 text-left text-[11px] font-medium text-[#6D6D68] hover:text-[#111111] transition-colors rounded-[6px]"
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
                      const isActive =
                        item.href === '/admin'
                          ? pathname === '/admin'
                          : pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between rounded-[6px] px-2.5 py-1.5 text-[12.5px] transition-all duration-120 relative ${
                            isActive
                              ? 'bg-[#FAFAF8] text-[#111111] font-semibold border-l-[3px] border-[#EA580C] pl-2'
                              : 'text-[#6D6D68] hover:bg-[#FAFAF8] hover:text-[#111111]'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={`rounded-[4px] px-1.5 py-0.2 font-mono text-[9px] font-medium ${
                                isActive
                                  ? 'bg-[#EA580C]/10 text-[#EA580C]'
                                  : 'bg-[#F0F0EE] text-[#6D6D68]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
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
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#111111] text-white text-[11.5px] font-semibold">
              {session.name ? session.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[12px] font-medium text-[#111111] leading-tight">
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
