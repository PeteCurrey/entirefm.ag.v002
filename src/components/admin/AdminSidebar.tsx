'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserSession } from '@/server/identity';

interface NavItem {
  name: string;
  href: string;
  badge?: string;
}

interface NavGroup {
  title: string;
  permission?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'COMMAND',
    items: [
      { name: 'Command Centre', href: '/admin' },
      { name: 'CEO Command', href: '/admin/command/ceo' },
      { name: 'Alerts & Exceptions', href: '/admin/command/alerts' },
      { name: 'Approvals', href: '/admin/command/approvals' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Control Centre', href: '/admin/operations' },
      { name: "Today's Exceptions", href: '/admin/operations/today' },
      { name: 'Live Contracts', href: '/admin/operations/contracts' },
      { name: 'Live Helpdesk', href: '/admin/operations/helpdesk' },
      { name: 'Service Requests', href: '/admin/operations/service-requests' },
      { name: 'Work Orders', href: '/admin/operations/work-orders' },
      { name: 'Dispatch', href: '/admin/operations/dispatch' },
      { name: 'SLA Control', href: '/admin/operations/sla' },
      { name: 'Escalations', href: '/admin/operations/escalations' },
    ],
  },
  {
    title: 'ESTATE',
    items: [
      { name: 'Clients', href: '/admin/estate/clients' },
      { name: 'Contracts', href: '/admin/estate/contracts' },
      { name: 'Portfolios', href: '/admin/estate/portfolios' },
      { name: 'Sites', href: '/admin/estate/sites' },
      { name: 'Buildings & Spaces', href: '/admin/estate/spaces' },
      { name: 'Assets', href: '/admin/estate/assets' },
      { name: 'Asset Review Desk', href: '/admin/estate/assets/review' },
      { name: 'Data Quality', href: '/admin/estate/assets/data-quality' },
      { name: 'Mobilisations', href: '/admin/estate/mobilisations' },
      { name: 'Imports', href: '/admin/estate/imports' },
    ],
  },
  {
    title: 'PLANNED MAINTENANCE',
    items: [
      { name: 'PPM Autopilot', href: '/admin/planned-maintenance/ppm-autopilot' },
      { name: 'Maintenance Plans', href: '/admin/planned-maintenance/plans' },
      { name: 'Requirements & Sources', href: '/admin/planned-maintenance/requirements' },
      { name: 'PPM Schedule', href: '/admin/planned-maintenance/schedule' },
      { name: 'Exceptions Desk', href: '/admin/planned-maintenance/exceptions' },
    ],
  },
  {
    title: 'ENERGY & PERFORMANCE',
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
    title: 'COMPLIANCE',
    items: [
      { name: 'Compliance Command', href: '/admin/compliance/command' },
      { name: 'Obligations', href: '/admin/compliance/obligations' },
      { name: 'Evidence', href: '/admin/compliance/evidence' },
      { name: 'Certificates', href: '/admin/compliance/certificates' },
      { name: 'Expiries', href: '/admin/compliance/expiries' },
      { name: 'Audits', href: '/admin/compliance/audits' },
      { name: 'Rules & Sources', href: '/admin/compliance/rules' },
    ],
  },
  {
    title: 'SUPPLY CHAIN',
    items: [
      { name: 'Contractors', href: '/admin/supply-chain/contractors' },
      { name: 'Applications', href: '/admin/supply-chain/applications' },
      { name: 'Engineers', href: '/admin/supply-chain/engineers' },
      { name: 'Coverage Map', href: '/admin/supply-chain/coverage' },
      { name: 'Trades & Competencies', href: '/admin/supply-chain/trades' },
      { name: 'Accreditations', href: '/admin/supply-chain/accreditations' },
      { name: 'Rate Cards', href: '/admin/supply-chain/rates' },
      { name: 'Performance', href: '/admin/supply-chain/performance' },
      { name: 'Risk', href: '/admin/supply-chain/risk' },
    ],
  },
  {
    title: 'COMMERCIAL & SALES',
    items: [
      { name: 'Commercial Overview', href: '/admin/commercial' },
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
    items: [
      { name: 'Operations', href: '/admin/reporting/operations' },
      { name: 'Clients', href: '/admin/reporting/clients' },
      { name: 'SLA', href: '/admin/reporting/sla' },
      { name: 'PPM', href: '/admin/reporting/ppm' },
      { name: 'Compliance', href: '/admin/reporting/compliance' },
      { name: 'Supply Chain', href: '/admin/reporting/supply-chain' },
      { name: 'Finance', href: '/admin/reporting/finance' },
      { name: 'Executive', href: '/admin/reporting/executive' },
    ],
  },
  {
    title: 'MARKETING & NEWSLETTER',
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
    items: [
      { name: 'Growth Overview', href: '/admin/growth' },
      { name: 'Inbound Leads', href: '/admin/growth/leads' },
      { name: 'Attribution Models', href: '/admin/growth/attribution' },
      { name: 'SEO Conversion', href: '/admin/growth/seo-conversion' },
      { name: 'Service Performance', href: '/admin/growth/services' },
      { name: 'Location Performance', href: '/admin/growth/locations' },
      { name: 'Sector Performance', href: '/admin/growth/sectors' },
      { name: 'Sector Content & Authority', href: '/admin/content/sectors' },
      { name: 'Tools & Resources', href: '/admin/growth/tools' },
      { name: 'Conversion Funnels', href: '/admin/growth/funnels' },
      { name: 'Content CRO & Journeys', href: '/admin/content/conversion' },
      { name: 'Commercial Insights', href: '/admin/growth/insights' },
      { name: 'Diagnostics & QA', href: '/admin/growth/diagnostics' },
    ],
  },
  {
    title: 'BLOG & INSIGHTS',
    items: [
      { name: 'Editorial Dashboard', href: '/admin/blog' },
      { name: 'Content Intelligence', href: '/admin/blog/intelligence' },
      { name: 'Weekly Briefing', href: '/admin/blog/intelligence/weekly' },
      { name: 'All Posts', href: '/admin/blog/posts' },
      { name: 'New Post', href: '/admin/blog/new' },
      { name: 'Editorial Calendar', href: '/admin/blog/calendar' },
      { name: 'Digital PR & Promotion', href: '/admin/content/pr' },
      { name: 'AI Draft Queue', href: '/admin/blog/ai-queue' },
      { name: 'Topic Opportunities', href: '/admin/blog/topics' },
      { name: 'Categories', href: '/admin/blog/categories' },
      { name: 'Authors', href: '/admin/blog/authors' },
      { name: 'Media Library', href: '/admin/blog/media' },
      { name: 'Distribution', href: '/admin/blog/distribution' },
      { name: 'SEO Health', href: '/admin/blog/seo' },
      { name: 'AI Search & Citations', href: '/admin/seo/ai-search' },
      { name: 'Trust & Proof Register', href: '/admin/content/trust' },
      { name: 'External Sources', href: '/admin/blog/sources' },
      { name: 'Automation Settings', href: '/admin/blog/automation' },
      { name: 'Automation Jobs', href: '/admin/blog/automation/jobs' },
    ],
  },
  {
    title: 'PLATFORM',
    permission: 'platform:admin',
    items: [
      { name: 'Users', href: '/admin/platform/users' },
      { name: 'Access & Permissions', href: '/admin/platform/access' },
      { name: 'Organisations', href: '/admin/platform/organisations' },
      { name: 'Integrations', href: '/admin/platform/integrations' },
      { name: 'API & Webhooks', href: '/admin/platform/webhooks' },
      { name: 'Import / Export', href: '/admin/platform/migration' },
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
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-brand-edge-dark bg-brand-carbon text-brand-mist selection:bg-brand-electric selection:text-white">
      {/* Brand Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-brand-edge-dark px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="text-[15px] font-light tracking-tight text-white">
            Entire<span className="font-semibold text-brand-electric">FM</span>
          </span>
          <span className="rounded border border-brand-edge-dark bg-brand-void/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-brand-mist/60">
            Ops Cockpit
          </span>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-brand-edge-dark">
        <div className="space-y-6">
          {NAV_GROUPS.filter((group) => {
            // If the group has a required permission, hide it when the session lacks it
            if (!group.permission) return true;
            const perms = session.permissions as string[];
            return perms.includes(group.permission) || session.role === 'SUPER_ADMIN' || session.role === 'CEO';
          }).map((group) => {
            const isCollapsed = collapsedGroups[group.title];

            return (
              <div key={group.title} className="space-y-1">
                {/* Group Heading */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="flex w-full items-center justify-between px-2 py-1 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-mist/40 transition-colors hover:text-brand-mist/70"
                >
                  <span>{group.title}</span>
                  <span className="text-[9px]">{isCollapsed ? '+' : '−'}</span>
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pt-0.5">
                    {group.items.map((item) => {
                      const isActive =
                        item.href === '/admin'
                          ? pathname === '/admin'
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center justify-between rounded px-2.5 py-1.5 text-[12.5px] transition-colors ${
                            isActive
                              ? 'bg-brand-electric text-white font-medium shadow-sm'
                              : 'text-brand-mist/70 hover:bg-brand-void/60 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span className="rounded bg-brand-void px-1.5 py-0.5 font-mono text-[9px] text-brand-mist/60">
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

      {/* User Session Bar */}
      <div className="border-t border-brand-edge-dark bg-brand-void/90 p-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-medium text-white">{session.name}</div>
            <div className="truncate font-mono text-[10px] text-brand-mist/50">
              {session.role} · {session.orgName}
            </div>
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              title="Sign Out"
              className="rounded p-1.5 text-brand-mist/50 transition-colors hover:bg-brand-carbon hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
