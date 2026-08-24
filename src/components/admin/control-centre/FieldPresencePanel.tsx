'use client';

import React from 'react';
import { Users, Truck, Clock, AlertTriangle, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import Link from 'next/link';

export interface EngineerPresenceItem {
  id: string;
  name: string;
  role: string;
  status: 'ON_SITE' | 'TRAVELLING' | 'AVAILABLE' | 'RUNNING_LATE';
  currentSite: string;
  etaOrCheckedIn: string;
  trade: string;
}

interface FieldPresencePanelProps {
  onEngineerClick?: (engineer: EngineerPresenceItem) => void;
}

export function FieldPresencePanel({ onEngineerClick }: FieldPresencePanelProps) {
  const summary = {
    onSite: 12,
    travelling: 8,
    available: 5,
    runningLate: 2,
  };

  const exceptions: EngineerPresenceItem[] = [
    {
      id: 'eng-1',
      name: 'Marcus Vance',
      role: 'Internal Senior HVAC Tech',
      status: 'ON_SITE',
      currentSite: 'Victoria House · London',
      etaOrCheckedIn: 'Checked in 08:32',
      trade: 'HVAC & Refrigeration',
    },
    {
      id: 'eng-2',
      name: 'David Reynolds',
      role: 'Internal Electrical Tech',
      status: 'RUNNING_LATE',
      currentSite: 'Manchester Office Hub',
      etaOrCheckedIn: 'ETA delayed +25m (M6 Congestion)',
      trade: 'NICEIC Commercial Electrical',
    },
    {
      id: 'eng-3',
      name: 'Liam Chen',
      role: 'Contractor Specialist',
      status: 'TRAVELLING',
      currentSite: 'Birmingham Distribution Centre',
      etaOrCheckedIn: 'ETA 11:20 (14m remaining)',
      trade: 'Fire & Life Safety',
    },
    {
      id: 'eng-4',
      name: 'Sarah Jenkins',
      role: 'Internal Mobile Engineer',
      status: 'AVAILABLE',
      currentSite: 'Leeds / Yorkshire Region',
      etaOrCheckedIn: 'Standing by for reactive dispatch',
      trade: 'Plumbing & Mechanical',
    },
  ];

  const getStatusBadge = (status: EngineerPresenceItem['status']) => {
    switch (status) {
      case 'ON_SITE':
        return <Badge variant="green" size="xs">ON SITE</Badge>;
      case 'TRAVELLING':
        return <Badge variant="blue" size="xs">EN ROUTE</Badge>;
      case 'RUNNING_LATE':
        return <Badge variant="amber" size="xs" pulse>LATE (+25m)</Badge>;
      case 'AVAILABLE':
        return <Badge variant="neutral" size="xs">STANDBY</Badge>;
    }
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#101010] text-white">
            <Users className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              FIELD RESOURCE PRESENCE
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              Real-time engineering workforce deployment & exceptions
            </p>
          </div>
        </div>

        <Link
          href="/admin/supply-chain/engineers"
          className="text-[11.5px] font-medium text-[#686866] hover:text-[#101010] transition-colors"
        >
          Supply Chain Map →
        </Link>
      </div>

      {/* Metric telemetry strip */}
      <div className="grid grid-cols-4 border-b border-[#E4E4E1] divide-x divide-[#E4E4E1] bg-[#F5F5F3] text-center font-mono py-2.5 px-2 text-[11.5px]">
        <div>
          <div className="text-[9.5px] uppercase text-[#686866]">On Site</div>
          <div className="font-semibold text-lg text-[#15803D] tabular-nums">{summary.onSite}</div>
        </div>
        <div>
          <div className="text-[9.5px] uppercase text-[#686866]">Travelling</div>
          <div className="font-semibold text-lg text-[#1D4ED8] tabular-nums">{summary.travelling}</div>
        </div>
        <div>
          <div className="text-[9.5px] uppercase text-[#686866]">Available</div>
          <div className="font-semibold text-lg text-[#101010] tabular-nums">{summary.available}</div>
        </div>
        <div>
          <div className="text-[9.5px] uppercase text-[#686866]">Running Late</div>
          <div className="font-semibold text-lg text-[#B45309] tabular-nums">{summary.runningLate}</div>
        </div>
      </div>

      {/* Exception list */}
      <div className="divide-y divide-[#E4E4E1]">
        {exceptions.map((eng) => (
          <div
            key={eng.id}
            onClick={() => onEngineerClick && onEngineerClick(eng)}
            className="flex items-center justify-between p-3.5 hover:bg-[#F5F5F3] transition-colors cursor-pointer"
          >
            <div className="min-w-0 flex-1 pr-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[13px] text-[#101010] truncate">
                  {eng.name}
                </span>
                <span className="font-mono text-[10px] text-[#686866] bg-[#F0F0EE] px-1.5 py-0.2 rounded-[4px]">
                  {eng.trade}
                </span>
              </div>
              <div className="mt-0.5 text-[11.5px] text-[#686866] flex items-center gap-1.5 truncate">
                <MapPin className="h-3 w-3 text-[#9B9B97] shrink-0" />
                <span className="truncate">{eng.currentSite}</span>
                <span className="text-[#9B9B97]">·</span>
                <span className={`font-mono text-[11px] ${eng.status === 'RUNNING_LATE' ? 'text-[#B45309] font-medium' : 'text-[#9B9B97]'}`}>
                  {eng.etaOrCheckedIn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {getStatusBadge(eng.status)}
              <ChevronRight className="h-3.5 w-3.5 text-[#9B9B97]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
