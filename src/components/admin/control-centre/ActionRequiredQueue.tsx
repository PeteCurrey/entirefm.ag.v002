'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertCircle, Clock, ShieldAlert, DollarSign, Wrench, ArrowRight, CheckCircle2, Users } from 'lucide-react';
import Link from 'next/link';

export interface ActionRequiredItem {
  id: string;
  type: 'CRITICAL' | 'OVERDUE' | 'SLA_RISK' | 'APPROVAL' | 'NEW_LEAD';
  title: string;
  location: string;
  urgencyDetail: string;
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
  targetHref?: string;
  entityType?: 'work_order' | 'compliance' | 'quote' | 'engineer' | 'lead';
  amountGbp?: number;
}

interface ActionRequiredQueueProps {
  items: ActionRequiredItem[];
  onItemAction?: (item: ActionRequiredItem) => void;
  onItemInspect?: (item: ActionRequiredItem) => void;
}

const typeConfig: Record<ActionRequiredItem['type'], { icon: React.ElementType; label: string; badgeVariant: string }> = {
  CRITICAL: { icon: AlertCircle, label: 'P1 Critical', badgeVariant: 'red' },
  OVERDUE: { icon: ShieldAlert, label: 'Overdue', badgeVariant: 'red' },
  SLA_RISK: { icon: Clock, label: 'SLA Risk', badgeVariant: 'yellow' },
  APPROVAL: { icon: DollarSign, label: 'Approval', badgeVariant: 'blue' },
  NEW_LEAD: { icon: Users, label: 'New Lead', badgeVariant: 'purple' },
};

export function ActionRequiredQueue({
  items,
  onItemAction,
  onItemInspect,
}: ActionRequiredQueueProps) {
  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#DC2626] text-white">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              ACTION REQUIRED
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              {items.length > 0 ? `${items.length} item${items.length !== 1 ? 's' : ''} need attention` : 'All clear'}
            </p>
          </div>
        </div>
        <Link href="/admin/growth/leads" className="text-[11.5px] font-medium text-[#686866] hover:text-[#101010] transition-colors">
          Inbound Leads →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
          <CheckCircle2 className="h-7 w-7 text-[#15803D]" />
          <p className="font-medium text-[#686866] text-[13px]">No immediate actions required</p>
          <p className="text-[12px] text-[#9B9B97]">All work orders and enquiries are currently acknowledged.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E4E4E1] max-h-[380px] overflow-y-auto">
          {items.map((item) => {
            const config = typeConfig[item.type] || typeConfig.CRITICAL;
            const Icon = config.icon;
            return (
              <div key={item.id} className="px-5 py-4 flex items-start gap-3 hover:bg-[#FAFAF9] transition-colors">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
                  item.type === 'CRITICAL' || item.type === 'OVERDUE' ? 'bg-red-50' :
                  item.type === 'SLA_RISK' ? 'bg-amber-50' :
                  item.type === 'NEW_LEAD' ? 'bg-pink-50' : 'bg-blue-50'
                }`}>
                  <Icon className={`h-3.5 w-3.5 ${
                    item.type === 'CRITICAL' || item.type === 'OVERDUE' ? 'text-red-600' :
                    item.type === 'SLA_RISK' ? 'text-amber-600' :
                    item.type === 'NEW_LEAD' ? 'text-[#FF3E9D]' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium text-[#101010] leading-snug">{item.title}</p>
                    <Badge variant={config.badgeVariant as any} size="xs">{config.label}</Badge>
                  </div>
                  <p className="text-[11.5px] text-[#686866] mt-0.5">{item.location}</p>
                  <p className="text-[11.5px] text-[#B45309] mt-0.5">{item.urgencyDetail}</p>
                  <div className="flex gap-2 mt-2">
                    {item.targetHref ? (
                      <Link href={item.targetHref} className="inline-flex items-center gap-1 rounded-[6px] bg-[#101010] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#333] transition-colors">
                        {item.primaryActionLabel} <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <Button size="xs" onClick={() => onItemAction?.(item)}>{item.primaryActionLabel}</Button>
                    )}
                    {item.entityType === 'work_order' && (
                      <button onClick={() => onItemInspect?.(item)} className="inline-flex items-center gap-1 rounded-[6px] border border-[#E4E4E1] px-2.5 py-1 text-[11px] font-medium text-[#686866] hover:border-[#101010] hover:text-[#101010] transition-colors">
                        <Wrench className="h-3 w-3" /> Inspect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
