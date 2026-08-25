'use client';

import React from 'react';
import { WorkOrder } from '@/server/work';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Wrench, Clock, MapPin, User, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface WorkOrderOperationalWorkspaceProps {
  workOrder?: WorkOrder | null;
}

export function WorkOrderOperationalWorkspace({ workOrder }: WorkOrderOperationalWorkspaceProps) {
  if (!workOrder) {
    return (
      <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
        <Wrench className="h-8 w-8 text-[#9B9B97] mx-auto" />
        <h3 className="text-[16px] font-light text-[#101010]">No Work Order Selected</h3>
        <p className="text-[13px] text-[#686866] max-w-md mx-auto">
          Select a live ticket from the operations queue or spatial markers to inspect its operational case workspace.
        </p>
        <Link
          href="/admin/operations/work-orders"
          className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#FF6B24] px-4 py-2 text-[12.5px] font-normal text-white shadow-sm hover:bg-[#E9540F] transition-all"
        >
          View All Work Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header Case Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-6 py-4 gap-3">
        <div className="flex items-center gap-3">
          <Badge
            variant={workOrder.priority === 'P1_CRITICAL' ? 'red' : 'blue'}
            size="sm"
            pulse={workOrder.priority === 'P1_CRITICAL'}
          >
            {workOrder.priority?.replace(/_/g, ' ') || 'TICKET'}
          </Badge>
          <span className="font-mono text-[13px] font-normal text-[#101010]">
            {workOrder.work_order_number}
          </span>
          <span className="text-[12px] text-[#686866]">
            Status: <strong>{workOrder.status}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/operations/work-orders?id=${workOrder.id}`}
            className="rounded-[6px] bg-[#FF6B24] px-3.5 py-1.5 text-[12px] font-normal text-white shadow-sm hover:bg-[#E9540F] transition-colors"
          >
            Open Full Ticket
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Issue & Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-light tracking-tight text-[#101010]">{workOrder.title}</h2>
          <p className="text-[13px] text-[#686866] leading-relaxed">
            {workOrder.description || 'No detailed issue description recorded.'}
          </p>
        </div>

        {/* 4-Box Telemetry Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[12px]">
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">SLA Target Date</div>
            <div className="text-[13px] font-normal text-[#101010] mt-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#FF6B24]" />
              <span>{workOrder.target_completion_at || 'Standard SLA'}</span>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">Assigned Entity</div>
            <div className="text-[13px] font-normal text-[#101010] mt-1 truncate">
              {workOrder.lead_engineer_id
                ? 'Assigned Engineer'
                : workOrder.provider_organisation_id
                ? 'Assigned Contractor'
                : 'Unassigned'}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">Asset Association</div>
            <div className="text-[13px] font-normal text-[#FF6B24] mt-1 truncate">
              {workOrder.asset_id ? 'Asset Linked' : 'Building Fabric'}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">Work Category</div>
            <div className="text-[13px] font-normal text-[#101010] mt-1">
              {workOrder.work_type || 'REACTIVE'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
