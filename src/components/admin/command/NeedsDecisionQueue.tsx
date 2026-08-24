'use client';
import React from 'react';
import type { UserSession } from '@/server/identity';

interface Props {
  session: UserSession;
  needsDecisionCount: number;
}

const DECISION_LINKS = [
  { label: 'Finance Approvals', description: 'Supplier invoices, bank alerts, payment approvals', href: '/admin/command/approvals', permission: 'finance:invoice_approve' },
  { label: 'Compliance Exceptions', description: 'Open critical and major compliance exceptions', href: '/admin/command/alerts-exceptions', permission: 'compliance:exception_manage' },
  { label: 'AI Escalations', description: 'Pending AI agent escalations requiring human review', href: '/admin/operations/escalations', permission: 'ai:control' },
  { label: 'Quote Approvals', description: 'Submitted quotes awaiting commercial approval', href: '/admin/commercial/quotes', permission: 'quote:approve' },
];

export function NeedsDecisionQueue({ session, needsDecisionCount }: Props) {
  const perms = session.permissions || [];
  const accessible = DECISION_LINKS.filter(l => perms.includes(l.permission as any));

  if (accessible.length === 0) {
    return (
      <div className="rounded-lg border border-brand-edge-dark/40 bg-brand-void/20 p-4 text-center min-h-[120px] flex flex-col items-center justify-center">
        <div className="text-[11px] font-mono text-brand-mist/30 uppercase">No decision queues accessible</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {needsDecisionCount > 0 && (
        <div className="text-[10px] font-mono text-amber-400/70 mb-1">
          {needsDecisionCount} item{needsDecisionCount === 1 ? '' : 's'} requiring decision
        </div>
      )}
      {accessible.map((link) => (
        <a key={link.href} href={link.href}
          className="block rounded border border-brand-edge-dark/40 bg-brand-void/20 hover:bg-brand-void/40 p-3 transition-colors group">
          <div className="text-[12.5px] font-medium text-white group-hover:text-brand-orange transition-colors">
            {link.label}
          </div>
          <div className="text-[11px] text-brand-mist/50 mt-0.5">{link.description}</div>
        </a>
      ))}
    </div>
  );
}
