'use client';
import React from 'react';
import type { EnterpriseMetricDefinition } from '@/server/ceo-command/types';
import type { UserSession } from '@/server/identity';

interface Props {
  metrics: EnterpriseMetricDefinition[];
  session: UserSession;
}

const DOMAIN_LINKS: Record<string, string> = {
  FINANCE: '/admin/finance',
  COMPLIANCE: '/admin/compliance',
  OPERATIONS: '/admin/operations',
  PPM: '/admin/planned-maintenance',
  SUPPLY_CHAIN: '/admin/supply-chain',
  CLIENTS: '/admin/estate/clients',
  AI_AUTOMATION: '/admin/platform/ai',
  PLATFORM_HEALTH: '/admin',
};

const DOMAIN_LABELS: Record<string, string> = {
  FINANCE: 'Finance',
  COMPLIANCE: 'Compliance',
  OPERATIONS: 'Operations',
  PPM: 'Planned Maintenance',
  SUPPLY_CHAIN: 'Supply Chain',
  CLIENTS: 'Clients',
  AI_AUTOMATION: 'AI & Automation',
  PLATFORM_HEALTH: 'Platform Health',
};

export function DomainSummaryGrid({ metrics, session }: Props) {
  const domains = [...new Set(metrics.map(m => m.domain))];
  const perms = new Set(session.permissions || []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {domains.map(domain => {
        const domainMetrics = metrics.filter(m => m.domain === domain);
        const accessible = domainMetrics.filter(m => perms.has(m.required_permission as any) || session.role === 'SUPER_ADMIN' || session.role === 'CEO' || session.role === 'ADMINISTRATOR');
        const href = DOMAIN_LINKS[domain] || '/admin';
        return (
          <a key={domain} href={href}
            className="block rounded-lg border border-brand-edge-dark/50 bg-brand-carbon/30 hover:bg-brand-carbon/50 hover:border-brand-edge-dark transition-colors p-4 group">
            <div className="text-[9px] font-medium text-brand-mist/35 uppercase tracking-widest mb-2">
              {DOMAIN_LABELS[domain] || domain}
            </div>
            <div className="text-[13px] font-light text-white group-hover:text-brand-orange transition-colors">
              {accessible.length} metric{accessible.length === 1 ? '' : 's'}
            </div>
            <div className="text-[10px] text-brand-mist/40 mt-1">
              {accessible.length < domainMetrics.length
                ? `${domainMetrics.length - accessible.length} restricted`
                : 'Full access'}
            </div>
          </a>
        );
      })}
    </div>
  );
}
