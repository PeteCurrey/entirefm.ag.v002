'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface TabItem {
  name: string;
  href: string;
  category?: 'STRATEGY' | 'ASSURANCE' | 'PERFORMANCE' | 'COMMERCIAL';
}

export const SUPPLIER_TABS: TabItem[] = [
  { name: 'Overview', href: '/admin/suppliers', category: 'STRATEGY' },
  { name: 'Performance Hub', href: '/admin/suppliers/performance', category: 'PERFORMANCE' },
  { name: 'Scorecards', href: '/admin/suppliers/performance/scorecards', category: 'PERFORMANCE' },
  { name: 'SLA & Attendance', href: '/admin/suppliers/performance/sla', category: 'PERFORMANCE' },
  { name: 'Quality & FTF', href: '/admin/suppliers/performance/quality', category: 'PERFORMANCE' },
  { name: 'Evidence Gating', href: '/admin/suppliers/performance/evidence', category: 'PERFORMANCE' },
  { name: 'Commercial Accuracy', href: '/admin/suppliers/performance/commercial', category: 'PERFORMANCE' },
  { name: 'Improvement Plans', href: '/admin/suppliers/performance/improvement', category: 'PERFORMANCE' },
  { name: 'QBR Reviews', href: '/admin/suppliers/performance/reviews', category: 'PERFORMANCE' },
  { name: 'Onboarding Pipeline', href: '/admin/suppliers/onboarding', category: 'ASSURANCE' },
  { name: 'Assurance Reviews', href: '/admin/suppliers/reviews', category: 'ASSURANCE' },
  { name: 'Compliance Control', href: '/admin/suppliers/compliance', category: 'ASSURANCE' },
  { name: 'Document Vault', href: '/admin/suppliers/documents', category: 'ASSURANCE' },
  { name: 'Expiry Radar', href: '/admin/suppliers/expiries', category: 'ASSURANCE' },
  { name: 'Remediation Actions', href: '/admin/suppliers/remediation', category: 'ASSURANCE' },
  { name: 'Scoped Approvals', href: '/admin/suppliers/approvals', category: 'ASSURANCE' },
  { name: 'Agreements & Conduct', href: '/admin/suppliers/agreements', category: 'ASSURANCE' },
  { name: 'Landscape Matrix', href: '/admin/suppliers/landscape', category: 'STRATEGY' },
  { name: 'Directory', href: '/admin/suppliers/directory', category: 'STRATEGY' },
  { name: 'Target Partners', href: '/admin/suppliers/targets', category: 'STRATEGY' },
  { name: 'Coverage Matrix', href: '/admin/suppliers/coverage', category: 'STRATEGY' },
  { name: 'Capabilities', href: '/admin/suppliers/capabilities', category: 'STRATEGY' },
  { name: 'Manufacturers & OEMs', href: '/admin/suppliers/oems', category: 'STRATEGY' },
  { name: 'Technology Partners', href: '/admin/suppliers/technology', category: 'STRATEGY' },
  { name: 'Supply Chain Gaps', href: '/admin/suppliers/gaps', category: 'STRATEGY' },
  { name: 'Applications', href: '/admin/suppliers/applications', category: 'STRATEGY' },
  { name: 'Recruitment', href: '/admin/suppliers/recruitment', category: 'STRATEGY' },
  { name: 'Commercial Hub', href: '/admin/suppliers/commercial', category: 'COMMERCIAL' },
  { name: 'Memberships', href: '/admin/suppliers/commercial/memberships', category: 'COMMERCIAL' },
  { name: 'Invoices', href: '/admin/suppliers/commercial/invoices', category: 'COMMERCIAL' },
  { name: 'Payments', href: '/admin/suppliers/commercial/payments', category: 'COMMERCIAL' },
  { name: 'Renewals', href: '/admin/suppliers/commercial/renewals', category: 'COMMERCIAL' },
  { name: 'Events', href: '/admin/suppliers/commercial/events', category: 'COMMERCIAL' },
  { name: 'Audit Ledger', href: '/admin/suppliers/audit', category: 'ASSURANCE' },
  { name: 'Assurance Settings', href: '/admin/suppliers/settings/assurance', category: 'ASSURANCE' },
  { name: 'Performance Settings', href: '/admin/suppliers/performance/settings', category: 'PERFORMANCE' },
];

export function SupplierHeaderNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-slate-200 mb-6">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 px-1">
        {SUPPLIER_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const isCommercial = tab.category === 'COMMERCIAL';
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-1.5 rounded text-xs font-normal transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white font-light shadow-sm'
                  : isCommercial
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
