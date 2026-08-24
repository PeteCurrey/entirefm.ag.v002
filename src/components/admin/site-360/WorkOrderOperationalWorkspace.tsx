'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Wrench, Clock, MapPin, User, FileText, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, History, Send } from 'lucide-react';

export interface WorkOrderCaseData {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  siteName: string;
  locationDetails: string;
  assetName: string;
  assetReference: string;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
  slaDueAt: string;
  assignedEngineer: string;
  status: string;
  costsGbp: number;
}

interface WorkOrderOperationalWorkspaceProps {
  workOrder?: WorkOrderCaseData;
}

export function WorkOrderOperationalWorkspace({ workOrder }: WorkOrderOperationalWorkspaceProps) {
  const data: WorkOrderCaseData = workOrder || {
    id: 'wo-1',
    workOrderNumber: 'WO-84920',
    title: 'Boiler Plant Primary Circulation Pump Trip',
    description: 'High limit temperature sensor tripped primary flow pump on Boiler Loop B. Water temperature drop detected in North Wing radiant circuits.',
    siteName: 'Victoria House · London',
    locationDetails: 'Basement Level -1 · Central Plant Deck 02',
    assetName: 'Primary Condensing Gas Boiler BLR-01',
    assetReference: 'EQ-BLR-001',
    priority: 'P1_CRITICAL',
    slaDueAt: 'Today 13:45 (34 min remaining)',
    assignedEngineer: 'Marcus Vance (EntireFM Senior Tech)',
    status: 'IN_PROGRESS',
    costsGbp: 340.0,
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header Case Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-6 py-4 gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="red" size="sm" pulse>P1 CRITICAL CASE</Badge>
          <span className="font-mono text-[13px] font-semibold text-[#101010]">
            {data.workOrderNumber}
          </span>
          <span className="text-[12px] text-[#686866]">{data.siteName}</span>
        </div>

        {/* Sticky Action Controls */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">Escalate</Button>
          <Button size="sm" variant="secondary">Add Evidence Photo</Button>
          <Button size="sm" variant="primary">Complete & Sign Off</Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Issue & Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-light tracking-tight text-[#101010]">{data.title}</h2>
          <p className="text-[13px] text-[#686866] leading-relaxed">{data.description}</p>
        </div>

        {/* 4-Box Telemetry Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[12px]">
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">SLA Countdown</div>
            <div className="text-[13px] font-semibold text-[#DC2626] mt-1 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{data.slaDueAt}</span>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">Assigned Engineer</div>
            <div className="text-[13px] font-medium text-[#101010] mt-1 truncate">
              {data.assignedEngineer}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">Target Asset</div>
            <div className="text-[13px] font-medium text-[#FF6B24] mt-1 truncate">
              {data.assetReference}
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3">
            <div className="text-[10px] text-[#9B9B97] uppercase">Commercial WIP</div>
            <div className="text-[13px] font-medium text-[#101010] mt-1">
              £{data.costsGbp.toFixed(2)} GBP
            </div>
          </div>
        </div>

        {/* Work Tasks / Checklist */}
        <div className="space-y-3 pt-2 border-t border-[#E4E4E1]">
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#686866]">
            OPERATIONAL TASK BREAKDOWN
          </h3>
          <div className="space-y-2 text-[12.5px]">
            <div className="flex items-center gap-2.5 p-2 rounded-[8px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Step 1: Isolate electrical feed & verify zero voltage on control terminal</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-[8px] bg-[#FFF7ED] border border-[#FED7AA] text-[#C2410C]">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Step 2: Inspect pump impeller for mechanical binding & test winding resistance</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-[8px] bg-[#F9F9F8] border border-[#E4E4E1] text-[#686866]">
              <CheckCircle2 className="h-4 w-4 shrink-0 opacity-40" />
              <span>Step 3: Re-engage circuit breaker & verify 45°C flow delta in BMS telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
