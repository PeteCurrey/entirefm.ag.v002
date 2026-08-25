'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface TabItem {
  name: string;
  href: string;
  category?: 'STRATEGY' | 'COMMERCIAL';
}

export const SUPPLIER_TABS: TabItem[] = [
  { name: 'Overview', href: '/admin/suppliers', category: 'STRATEGY' },
  { name: 'Landscape', href: '/admin/suppliers/landscape', category: 'STRATEGY' },
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
  { name: 'Sponsorship', href: '/admin/suppliers/commercial/sponsorship', category: 'COMMERCIAL' },
  { name: 'Products & Pricing', href: '/admin/suppliers/commercial/products', category: 'COMMERCIAL' },
  { name: 'Reports', href: '/admin/suppliers/commercial/reports', category: 'COMMERCIAL' },
  { name: 'Settings', href: '/admin/suppliers/settings', category: 'STRATEGY' },
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
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
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
