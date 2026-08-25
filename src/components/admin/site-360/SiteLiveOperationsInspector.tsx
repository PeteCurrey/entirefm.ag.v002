'use client';

import React from 'react';
import { WorkOrder } from '@/server/work';
import { ComplianceObligation } from '@/server/compliance';
import { Badge } from '../ui/Badge';
import { AlertCircle, Clock, Calendar, Wrench, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SiteLiveOperationsInspectorProps {
  siteId: string;
  workOrders?: WorkOrder[];
  complianceObligations?: ComplianceObligation[];
  onSelectWorkOrder?: (wo: WorkOrder) => void;
}

export function SiteLiveOperationsInspector({
  siteId,
  workOrders = [],
  complianceObligations = [],
  onSelectWorkOrder,
}: SiteLiveOperationsInspectorProps) {
  const activeJobs = workOrders.filter(
    (w) => w.status !== 'COMPLETED' && w.status !== 'CLOSED' && w.status !== 'CANCELLED'
  );

  const overdueCompliance = complianceObligations.filter((c) => c.status === 'OVERDUE');
  const dueSoonCompliance = complianceObligations.filter((c) => c.status === 'DUE_SOON');

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 flex items-center justify-between">
        <h3 className="font-mono text-[11px] font-normal uppercase tracking-wider text-[#101010]">
          LIVE OPERATIONS & ACTIVE RISKS
        </h3>
        <span
          className={`h-2 w-2 rounded-full ${
            activeJobs.length > 0 ? 'bg-[#FF6B24] animate-pulse' : 'bg-[#16A34A]'
          }`}
        />
      </div>

      <div className="p-5 space-y-5">
        {/* SECTION 1: OPEN JOBS */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-[#686866] font-light">
            <span>ACTIVE WORK ORDERS</span>
            <span>{activeJobs.length} ACTIVE</span>
          </div>

          {activeJobs.length === 0 ? (
            <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12px] text-[#686866] text-center">
              No active work orders for this site.
            </div>
          ) : (
            activeJobs.slice(0, 3).map((wo) => (
              <div
                key={wo.id}
                onClick={() => onSelectWorkOrder && onSelectWorkOrder(wo)}
                className={`rounded-[10px] border p-3 text-[12.5px] space-y-1.5 cursor-pointer transition-colors ${
                  wo.priority === 'P1_CRITICAL'
                    ? 'border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2]'
                    : 'border-[#E4E4E1] bg-[#F9F9F8] hover:bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] font-normal ${
                      wo.priority === 'P1_CRITICAL' ? 'text-[#B91C1C]' : 'text-[#686866]'
                    }`}
                  >
                    {wo.work_order_number} · {wo.priority?.replace(/_/g, ' ')}
                  </span>
                  <Badge variant={wo.priority === 'P1_CRITICAL' ? 'red' : 'blue'} size="xs">
                    {wo.status}
                  </Badge>
                </div>
                <div className="font-normal text-[#101010] truncate">{wo.title}</div>
                <div className="text-[11.5px] text-[#686866] truncate">
                  {wo.site_id ? 'On site' : 'Unassigned location'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* SECTION 2: COMPLIANCE RISKS */}
        <div className="space-y-2 pt-2 border-t border-[#E4E4E1]">
          <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-[#9B9B97] font-light">
            <span>SITE COMPLIANCE STATUS</span>
            <span
              className={
                overdueCompliance.length > 0
                  ? 'text-[#B91C1C]'
                  : dueSoonCompliance.length > 0
                  ? 'text-[#B45309]'
                  : 'text-[#15803D]'
              }
            >
              {overdueCompliance.length > 0
                ? `${overdueCompliance.length} OVERDUE`
                : dueSoonCompliance.length > 0
                ? `${dueSoonCompliance.length} DUE SOON`
                : '100% ASSURED'}
            </span>
          </div>

          {overdueCompliance.length > 0 ? (
            <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-[12px] text-[#B91C1C] space-y-1">
              <div className="font-light">Statutory Expiries Require Action</div>
              {overdueCompliance.map((c) => (
                <div key={c.id} className="text-[11.5px]">
                  • {c.rule_version?.rule?.title || 'Statutory Obligation'}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[12px] text-[#686866] bg-[#F5F5F3] p-3 rounded-[8px] space-y-1">
              <div className="flex items-center gap-1.5 text-[#101010] font-normal">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />
                <span>Zero Statutory Expirations</span>
              </div>
              <p className="text-[11.5px] text-[#686866]">
                {complianceObligations.length > 0
                  ? `${complianceObligations.length} obligations tracked and current.`
                  : 'No compliance duties registered for this facility.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
