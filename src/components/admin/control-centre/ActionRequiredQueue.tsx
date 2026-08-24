'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert, DollarSign, Wrench, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export interface ActionRequiredItem {
  id: string;
  type: 'CRITICAL' | 'OVERDUE' | 'SLA_RISK' | 'APPROVAL';
  title: string;
  location: string;
  urgencyDetail: string;
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
  targetHref?: string;
  entityType?: 'work_order' | 'compliance' | 'quote' | 'engineer';
  amountGbp?: number;
}

interface ActionRequiredQueueProps {
  items?: ActionRequiredItem[];
  onItemAction?: (item: ActionRequiredItem) => void;
  onItemInspect?: (item: ActionRequiredItem) => void;
}

export function ActionRequiredQueue({
  items,
  onItemAction,
  onItemInspect,
}: ActionRequiredQueueProps) {
  // Default authentic operational items if none provided
  const actionItems: ActionRequiredItem[] = items && items.length > 0 ? items : [
    {
      id: 'act-1',
      type: 'CRITICAL',
      title: 'Boiler Plant Primary Circulation Pump Trip',
      location: 'Victoria House · London (Plant Room Level -1)',
      urgencyDetail: 'Engineer dispatched · ETA 34 min',
      primaryActionLabel: 'Track Dispatch',
      targetHref: '/admin/operations/dispatch',
      entityType: 'work_order',
    },
    {
      id: 'act-2',
      type: 'OVERDUE',
      title: 'Emergency Lighting 3-Hour Discharge Test',
      location: 'Birmingham Distribution Centre · Zone B',
      urgencyDetail: 'Statutory task 2 days overdue',
      primaryActionLabel: 'Issue PPM',
      targetHref: '/admin/planned-maintenance/schedule',
      entityType: 'compliance',
    },
    {
      id: 'act-3',
      type: 'SLA_RISK',
      title: 'Mains Water Riser Ingress on 4th Floor',
      location: 'Manchester Office Hub · Floor 4 East',
      urgencyDetail: '42 min remaining before SLA breach',
      primaryActionLabel: 'Escalate',
      targetHref: '/admin/operations/sla',
      entityType: 'work_order',
    },
    {
      id: 'act-4',
      type: 'APPROVAL',
      title: 'HVAC Compressor Replacement & R410A Re-gas',
      location: 'Leeds Sovereign Square Estate',
      urgencyDetail: '£4,850.00 quote awaiting client approval',
      primaryActionLabel: 'Review Quote',
      targetHref: '/admin/commercial/quotes',
      entityType: 'quote',
      amountGbp: 4850.0,
    },
  ];

  const getTypeBadge = (type: ActionRequiredItem['type']) => {
    switch (type) {
      case 'CRITICAL':
        return <Badge variant="red" size="xs" pulse>CRITICAL</Badge>;
      case 'OVERDUE':
        return <Badge variant="red" size="xs">OVERDUE</Badge>;
      case 'SLA_RISK':
        return <Badge variant="amber" size="xs">SLA RISK</Badge>;
      case 'APPROVAL':
        return <Badge variant="orange" size="xs">APPROVAL GATE</Badge>;
      default:
        return <Badge variant="neutral" size="xs">ACTION</Badge>;
    }
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#B91C1C] text-white">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              ACTION REQUIRED
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              {actionItems.length} operational interventions requiring direct decision
            </p>
          </div>
        </div>

        <Link
          href="/admin/command/alerts"
          className="text-[11.5px] font-medium text-[#686866] hover:text-[#101010] transition-colors"
        >
          View All Alerts →
        </Link>
      </div>

      {/* Intervention Rows */}
      <div className="divide-y divide-[#E4E4E1]">
        {actionItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemInspect && onItemInspect(item)}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-[#F5F5F3] transition-colors gap-3 cursor-pointer"
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="mt-0.5 shrink-0">{getTypeBadge(item.type)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-medium text-[13.5px] text-[#101010] truncate">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-0.5 text-[12px] text-[#686866] flex flex-wrap items-center gap-x-2">
                  <span>{item.location}</span>
                  <span className="text-[#9B9B97]">·</span>
                  <span
                    className={`font-mono text-[11.5px] font-medium ${
                      item.type === 'CRITICAL' || item.type === 'OVERDUE'
                        ? 'text-[#B91C1C]'
                        : item.type === 'SLA_RISK'
                        ? 'text-[#B45309]'
                        : 'text-[#C2410C]'
                    }`}
                  >
                    {item.urgencyDetail}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Trigger */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {item.targetHref ? (
                <Link
                  href={item.targetHref}
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemAction && onItemAction(item);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] hover:border-[#FF6B24] hover:bg-[#FFF7ED] hover:text-[#FF6B24] px-3 py-1.5 text-[12px] font-medium text-[#101010] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <span>{item.primaryActionLabel}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ) : (
                <Button
                  size="xs"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemAction && onItemAction(item);
                  }}
                >
                  {item.primaryActionLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
