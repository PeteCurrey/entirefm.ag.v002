'use client';
import React from 'react';
import type { UserSession } from '@/server/identity';
import { ArrowRight, FileCheck, ShieldAlert, Sparkles, Receipt } from 'lucide-react';

interface Props {
  session: UserSession;
  needsDecisionCount: number;
}

const DECISION_LINKS = [
  { label: 'Finance & Invoices', description: 'Supplier invoices, bank verifications, payment approvals', href: '/admin/command/approvals', permission: 'finance:invoice_approve', icon: Receipt },
  { label: 'Compliance Exceptions', description: 'Open statutory, safety, and operational exceptions', href: '/admin/command/alerts-exceptions', permission: 'compliance:exception_manage', icon: ShieldAlert },
  { label: 'AI Escalations & Human Gate', description: 'Agent escalations requiring operational decision', href: '/admin/operations/escalations', permission: 'ai:control', icon: Sparkles },
  { label: 'Commercial Quotes', description: 'Submitted quotes awaiting client or director sign-off', href: '/admin/commercial/quotes', permission: 'quote:approve', icon: FileCheck },
];

export function NeedsDecisionQueue({ session, needsDecisionCount }: Props) {
  const perms = session.permissions || [];
  const accessible = DECISION_LINKS.filter(l => perms.includes(l.permission as any) || ['SUPER_ADMIN', 'CEO', 'DIRECTOR'].includes(session.role));

  if (accessible.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-[#E8E8E5] bg-[#FFFFFF] p-6 text-center">
        <div className="text-[11px] font-normal text-[#9A9A95] uppercase">No decision queues assigned</div>
        <div className="text-[12px] text-[#6D6D68] mt-1">You have no pending approval authority roles.</div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#6D6D68] uppercase tracking-wider">
          Decision Gateways
        </span>
        {needsDecisionCount > 0 && (
          <span className="font-normal text-[10.5px] text-[#EA580C] bg-[#FFF7ED] border border-[#FED7AA] px-1.5 py-0.2 rounded-[4px]">
            {needsDecisionCount} pending action
          </span>
        )}
      </div>

      <div className="rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] divide-y divide-[#E8E8E5] shadow-xs">
        {accessible.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.href}
              href={link.href}
              className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAFAF8] transition-colors group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-7 h-7 rounded-[6px] bg-[#FAFAF8] border border-[#E8E8E5] flex items-center justify-center shrink-0 mt-0.5 text-[#6D6D68] group-hover:text-[#EA580C] group-hover:border-[#FED7AA] group-hover:bg-[#FFF7ED] transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-normal text-[#111111] group-hover:text-[#EA580C] transition-colors">
                    {link.label}
                  </div>
                  <div className="text-[11.5px] text-[#6D6D68] truncate mt-0.5">
                    {link.description}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11.5px] font-normal text-[#6D6D68] group-hover:text-[#EA580C] shrink-0 transition-colors">
                <span>Review</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

