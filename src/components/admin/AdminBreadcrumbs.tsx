'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface RouteMeta {
  domain: string;
  module: string;
  moduleHref: string;
}

const ROUTE_MAP: Record<string, { domain: string; module: string }> = {
  // Command Centre
  '/admin': { domain: 'Command Centre', module: 'Control Centre' },
  '/admin/operations/queues': { domain: 'Command Centre', module: 'Operational Queues' },
  '/admin/operations/today': { domain: 'Command Centre', module: "Today's Exceptions" },
  '/admin/operations/helpdesk': { domain: 'Command Centre', module: 'AI Helpdesk Desk' },
  '/admin/command': { domain: 'Command Centre', module: 'CEO Command' },

  // Work & Help Desk
  '/admin/operations/service-requests': { domain: 'Work & Help Desk', module: 'Service Requests' },
  '/admin/operations/work-orders': { domain: 'Work & Help Desk', module: 'Work Orders' },
  '/admin/operations/dispatch': { domain: 'Work & Help Desk', module: 'Dispatch Grid' },
  '/admin/operations/sla-control': { domain: 'Work & Help Desk', module: 'SLA Control' },
  '/admin/operations/completion-review': { domain: 'Work & Help Desk', module: 'Completion Review' },
  '/admin/operations/map': { domain: 'Work & Help Desk', module: 'Operations Map' },

  // Estate & Clients
  '/admin/estate/clients': { domain: 'Estate & Clients', module: 'Clients Hub' },
  '/admin/estate/sites': { domain: 'Estate & Clients', module: 'Managed Sites (Site 360)' },
  '/admin/estate/spaces': { domain: 'Estate & Clients', module: 'Buildings & Spaces' },
  '/admin/estate/assets': { domain: 'Estate & Clients', module: 'Asset Registry' },
  '/admin/estate/contracts': { domain: 'Estate & Clients', module: 'Contracts & SLAs' },
  '/admin/estate/team': { domain: 'Estate & Clients', module: 'EntireFM Team' },
  '/admin/estate/imports': { domain: 'Estate & Clients', module: 'Data Import Centre' },

  // Planned Maintenance
  '/admin/planned-maintenance/plans': { domain: 'Planned Maintenance', module: 'Maintenance Plans' },
  '/admin/planned-maintenance/schedule': { domain: 'Planned Maintenance', module: 'PPM Schedule & Due' },
  '/admin/planned-maintenance/ppm-autopilot': { domain: 'Planned Maintenance', module: 'PPM Autopilot' },
  '/admin/planned-maintenance/requirements': { domain: 'Planned Maintenance', module: 'Statutory Requirements' },
  '/admin/planned-maintenance/exceptions': { domain: 'Planned Maintenance', module: 'PPM Exceptions' },

  // Commercial
  '/admin/commercial': { domain: 'Commercial', module: 'Commercial Hub' },
  '/admin/commercial/quotes': { domain: 'Commercial', module: 'Quotes & Proposals' },
  '/admin/commercial/sales-pipeline': { domain: 'Commercial', module: 'Sales Pipeline' },
  '/admin/commercial/tenders': { domain: 'Commercial', module: 'Tenders & Bids' },
  '/admin/commercial/rate-cards': { domain: 'Commercial', module: 'Rate Cards & Margins' },
  '/admin/commercial/calculator': { domain: 'Commercial', module: 'Commercial Calculator' },
  '/admin/commercial/procurement': { domain: 'Commercial', module: 'Procurement & POs' },
  '/admin/commercial/margins': { domain: 'Commercial', module: 'Margin Analysis' },

  // Supply Chain & Engineers
  '/admin/suppliers/directory': { domain: 'Supply Chain & Engineers', module: 'Supply Chain Directory' },
  '/admin/suppliers/applications': { domain: 'Supply Chain & Engineers', module: 'Contractor Applications' },
  '/admin/suppliers/workforce': { domain: 'Supply Chain & Engineers', module: 'Engineer Workforce' },
  '/admin/suppliers/rates': { domain: 'Supply Chain & Engineers', module: 'Rate Agreements' },
  '/admin/suppliers/scorecards': { domain: 'Supply Chain & Engineers', module: 'Performance Scorecards' },
  '/admin/suppliers/tiering': { domain: 'Supply Chain & Engineers', module: 'Subcontractor Tiering' },

  // Compliance & Assurance
  '/admin/compliance/dashboard': { domain: 'Compliance & Assurance', module: 'Compliance Matrix' },
  '/admin/compliance/documents': { domain: 'Compliance & Assurance', module: 'Certificates & Docs' },
  '/admin/compliance/audits': { domain: 'Compliance & Assurance', module: 'Audits & Inspections' },
  '/admin/compliance/h-and-s': { domain: 'Compliance & Assurance', module: 'RAMS & H&S' },
  '/admin/compliance/insurance': { domain: 'Compliance & Assurance', module: 'Insurance Registers' },
  '/admin/compliance/remedial': { domain: 'Compliance & Assurance', module: 'Remedial Actions' },
  '/admin/compliance/contractor': { domain: 'Compliance & Assurance', module: 'Contractor Compliance' },

  // Finance & Invoicing
  '/admin/finance/billing': { domain: 'Finance & Invoicing', module: 'Unbilled Work Records' },
  '/admin/finance/client-invoices': { domain: 'Finance & Invoicing', module: 'Client Invoices' },
  '/admin/finance/contractor-pay': { domain: 'Finance & Invoicing', module: 'Contractor Pay Applications' },
  '/admin/finance/credit-control': { domain: 'Finance & Invoicing', module: 'Credit Control' },
  '/admin/finance/xero': { domain: 'Finance & Invoicing', module: 'Xero Sync & Status' },

  // Intelligence & Reporting
  '/admin/intelligence/kpis': { domain: 'Intelligence & Reporting', module: 'Executive KPI Dashboard' },
  '/admin/intelligence/sla-analytics': { domain: 'Intelligence & Reporting', module: 'SLA Analytics' },
  '/admin/intelligence/reports': { domain: 'Intelligence & Reporting', module: 'Scheduled Reports' },
  '/admin/intelligence/profitability': { domain: 'Intelligence & Reporting', module: 'Contract Profitability' },
  '/admin/intelligence/site-performance': { domain: 'Intelligence & Reporting', module: 'Site Performance' },
  '/admin/intelligence/audit-log': { domain: 'Intelligence & Reporting', module: 'Audit Log' },

  // System & Administration
  '/admin/system/users': { domain: 'System & Administration', module: 'Users & Permissions' },
  '/admin/system/settings': { domain: 'System & Administration', module: 'System Settings' },
  '/admin/system/integrations': { domain: 'System & Administration', module: 'Integrations & Webhooks' },
  '/admin/system/automations': { domain: 'System & Administration', module: 'Automation Rules' },
  '/admin/system/backups': { domain: 'System & Administration', module: 'Backups & Archival' },
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Find exact or closest parent route
  let matchedMeta: RouteMeta | null = null;
  let remainingPath = '';

  // Sort keys by length descending to match longest path first
  const sortedKeys = Object.keys(ROUTE_MAP).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (pathname === key) {
      matchedMeta = {
        domain: ROUTE_MAP[key].domain,
        module: ROUTE_MAP[key].module,
        moduleHref: key,
      };
      break;
    } else if (pathname.startsWith(key + '/')) {
      matchedMeta = {
        domain: ROUTE_MAP[key].domain,
        module: ROUTE_MAP[key].module,
        moduleHref: key,
      };
      remainingPath = pathname.slice(key.length + 1);
      break;
    }
  }

  // If on base /admin, no need for breadcrumbs
  if (pathname === '/admin') {
    return null;
  }

  // If no match found in CAFM routes, fallback gracefully
  if (!matchedMeta) {
    const segments = pathname.replace('/admin', '').split('/').filter(Boolean);
    if (segments.length === 0) return null;
    return (
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[11.5px] text-[#6D6D68]">
        <Link href="/admin" className="hover:text-[#111111] transition-colors">
          Admin
        </Link>
        {segments.map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3 w-3 text-[#9A9A95]" />
            <span className={idx === segments.length - 1 ? 'font-medium text-[#111111]' : ''}>
              {seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')}
            </span>
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Check query parameters for sub-filter context
  const statusParam = searchParams?.get('status');
  const subFilterLabel = statusParam
    ? statusParam === 'OPEN'
      ? 'Open Work Orders'
      : statusParam === 'IN_PROGRESS'
      ? 'In Progress'
      : statusParam === 'COMPLETED'
      ? 'Completed'
      : statusParam
    : null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[11.5px] text-[#6D6D68]">
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-[#111111] transition-colors"
        title="Command Centre"
      >
        <Home className="h-3 w-3 text-[#9A9A95]" />
        <span>{matchedMeta.domain}</span>
      </Link>

      <ChevronRight className="h-3 w-3 text-[#9A9A95]" />

      {remainingPath || subFilterLabel ? (
        <Link
          href={matchedMeta.moduleHref}
          className="hover:text-[#111111] transition-colors"
        >
          {matchedMeta.module}
        </Link>
      ) : (
        <span className="font-medium text-[#111111]">{matchedMeta.module}</span>
      )}

      {subFilterLabel && (
        <>
          <ChevronRight className="h-3 w-3 text-[#9A9A95]" />
          <span className="font-medium text-[#EA580C] bg-[#EA580C]/10 px-1.5 py-0.5 rounded-[4px] text-[11px]">
            {subFilterLabel}
          </span>
        </>
      )}

      {remainingPath && (
        <>
          <ChevronRight className="h-3 w-3 text-[#9A9A95]" />
          <span className="font-mono font-medium text-[#111111] bg-[#FAFAF8] border border-[#E8E8E5] px-1.5 py-0.5 rounded-[4px] text-[11px]">
            {remainingPath}
          </span>
        </>
      )}
    </nav>
  );
}
