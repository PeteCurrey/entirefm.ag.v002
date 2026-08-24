'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { AlertCircle, Clock, Calendar, Wrench, ShieldAlert, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

interface SiteLiveOperationsInspectorProps {
  siteId: string;
}

export function SiteLiveOperationsInspector({ siteId }: SiteLiveOperationsInspectorProps) {
  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 flex items-center justify-between">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
          LIVE OPERATIONS & ACTIVE RISKS
        </h3>
        <span className="h-2 w-2 rounded-full bg-[#FF6B24] animate-pulse" />
      </div>

      <div className="p-5 space-y-5">
        {/* SECTION 1: OPEN NOW */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-[#686866] font-semibold">
            <span>OPEN NOW · ACTIVE TICKETS</span>
            <span>2 ACTIVE</span>
          </div>

          <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] p-3 text-[12.5px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#B91C1C] font-semibold">WO-84920 · P1 CRITICAL</span>
              <Badge variant="red" size="xs" pulse>DISPATCHED</Badge>
            </div>
            <div className="font-medium text-[#101010]">
              Boiler Plant Primary Pump Trip
            </div>
            <div className="text-[11.5px] text-[#686866]">
              Engineer Marcus Vance on site · Target ETA 34m
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12.5px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#686866]">SR-10294 · REACTIVE</span>
              <Badge variant="blue" size="xs">IN PROGRESS</Badge>
            </div>
            <div className="font-medium text-[#101010]">
              HVAC Temperature Fluctuation (Floor 2)
            </div>
            <div className="text-[11.5px] text-[#686866]">
              BMS Thermostat calibration underway
            </div>
          </div>
        </div>

        {/* SECTION 2: NEXT SCHEDULED */}
        <div className="space-y-2.5 pt-2 border-t border-[#E4E4E1]">
          <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-[#686866] font-semibold">
            <span>NEXT SCHEDULED EVENTS</span>
            <span>UPCOMING</span>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12.5px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#101010]">Quarterly AHU Maintenance</span>
              <span className="font-mono text-[10px] text-[#15803D]">Tomorrow 09:00</span>
            </div>
            <div className="text-[11.5px] text-[#686866]">
              Apex Cooling Systems · Routine filter swap
            </div>
          </div>

          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12.5px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#101010]">Statutory Fire Alarm Audit</span>
              <span className="font-mono text-[10px] text-[#686866]">In 4 days</span>
            </div>
            <div className="text-[11.5px] text-[#686866]">
              FireSafe UK Accredited Inspection
            </div>
          </div>
        </div>

        {/* SECTION 3: RISK RADAR */}
        <div className="space-y-2 pt-2 border-t border-[#E4E4E1]">
          <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-[#9B9B97] font-semibold">
            <span>SITE RISK RADAR</span>
            <span className="text-[#15803D]">LOW RISK</span>
          </div>
          <div className="text-[12px] text-[#686866] bg-[#F5F5F3] p-3 rounded-[8px] space-y-1">
            <div className="flex items-center gap-1.5 text-[#101010] font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#15803D]" />
              <span>Zero Statutory Expiries</span>
            </div>
            <p className="text-[11.5px] text-[#686866]">
              All Legionella, Fire, and Electrical safety certificates current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
