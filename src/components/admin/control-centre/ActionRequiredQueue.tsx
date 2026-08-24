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
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#DC2626] text-white">
            <AlertCircle className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-semibold text-[#111111] uppercase tracking-wide">
              Action Required
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              {items.length > 0 ? `${items.length} item${items.length !== 1 ? 's' : ''} need attention` : 'All clear'}
            </p>
          </div>
        </div>
        <Link href="/admin/growth/leads" className="text-[11.5px] font-medium text-[#6D6D68] hover:text-[#111111] transition-colors">
          Inbound Leads →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-[#15803D]" />
          <p className="font-medium text-[#111111] text-[13px]">No immediate actions required</p>
          <p className="text-[12px] text-[#6D6D68]">All work orders and enquiries are currently acknowledged.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E8E8E5] max-h-[380px] overflow-y-auto">
          {items.map((item) => {
            const config = typeConfig[item.type] || typeConfig.CRITICAL;
            const Icon = config.icon;
            return (
              <div key={item.id} className="px-4 py-3.5 flex items-start gap-3 hover:bg-[#FAFAF8] transition-colors">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] ${
                  item.type === 'CRITICAL' || item.type === 'OVERDUE' ? 'bg-red-50 text-red-600' :
                  item.type === 'SLA_RISK' ? 'bg-amber-50 text-amber-600' :
                  item.type === 'NEW_LEAD' ? 'bg-orange-50 text-[#EA580C]' : 'bg-blue-50 text-blue-600'
                }`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium text-[#111111] leading-snug">{item.title}</p>
                    <Badge variant={config.badgeVariant as any} size="xs">{config.label}</Badge>
                  </div>
                  <p className="text-[11.5px] text-[#6D6D68] mt-0.5">{item.location}</p>
                  <p className="text-[11.5px] text-[#B45309] mt-0.5">{item.urgencyDetail}</p>
                  <div className="flex gap-2 mt-2">
                    {item.targetHref ? (
                      <Link href={item.targetHref} className="inline-flex items-center gap-1 rounded-[4px] bg-[#111111] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#252525] transition-colors">
                        {item.primaryActionLabel} <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <Button size="xs" onClick={() => onItemAction?.(item)}>{item.primaryActionLabel}</Button>
                    )}
                    {item.entityType === 'work_order' && (
                      <button onClick={() => onItemInspect?.(item)} className="inline-flex items-center gap-1 rounded-[4px] border border-[#E8E8E5] px-2 py-1 text-[11px] font-medium text-[#6D6D68] hover:border-[#111111] hover:text-[#111111] transition-colors">
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
