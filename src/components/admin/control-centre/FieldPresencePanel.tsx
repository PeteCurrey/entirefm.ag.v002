'use client';

import React from 'react';
import { Users, Truck, AlertTriangle, MapPin, ChevronRight } from 'lucide-react';
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

export interface PresenceSummary {
  onSite: number;
  travelling: number;
  available: number;
  runningLate: number;
}

interface FieldPresencePanelProps {
  summary: PresenceSummary | null;
  exceptions: EngineerPresenceItem[];
  onEngineerClick?: (engineer: EngineerPresenceItem) => void;
}

const statusConfig: Record<EngineerPresenceItem['status'], { label: string; variant: string }> = {
  ON_SITE: { label: 'On Site', variant: 'green' },
  TRAVELLING: { label: 'Travelling', variant: 'blue' },
  AVAILABLE: { label: 'Available', variant: 'gray' },
  RUNNING_LATE: { label: 'Running Late', variant: 'yellow' },
};

export function FieldPresencePanel({ summary, exceptions, onEngineerClick }: FieldPresencePanelProps) {
  const hasData = summary !== null;

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <Users className="h-3 w-3" />
          </div>
          <div>
            <h2 className="text-[12px] font-normal text-[#111111] uppercase tracking-wide">
              Field Presence
            </h2>
            <p className="text-[11px] text-[#6D6D68]">
              {hasData
                ? `${summary!.onSite} on site · ${summary!.travelling} travelling`
                : 'Mobile engineering deployment'}
            </p>
          </div>
        </div>
        <Link href="/admin/operations/dispatch" className="text-[11.5px] font-normal text-[#6D6D68] hover:text-[#111111] transition-colors">
          Dispatch Matrix →
        </Link>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-2">
          <Truck className="h-6 w-6 text-[#9A9A95]" />
          <p className="font-normal text-[#111111] text-[13px]">No active engineer telemetry</p>
          <p className="text-[12px] text-[#6D6D68]">
            Engineer GPS arrivals and travel statuses appear automatically.
          </p>
          <Link
            href="/admin/supply-chain/engineers"
            className="mt-2 inline-flex items-center gap-1.5 rounded-[4px] bg-[#111111] px-3 py-1.5 text-[11.5px] font-normal text-white hover:bg-[#252525] transition-colors"
          >
            Manage Engineers
          </Link>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-4 gap-2 text-center text-[12px]">
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-2">
              <div className="text-[10px] uppercase font-normal text-[#6D6D68]">On Site</div>
              <div className="text-base font-light text-[#15803D] mt-0.5">{summary!.onSite}</div>
            </div>
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-2">
              <div className="text-[10px] uppercase font-normal text-[#6D6D68]">Travelling</div>
              <div className="text-base font-light text-[#1D4ED8] mt-0.5">{summary!.travelling}</div>
            </div>
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-2">
              <div className="text-[10px] uppercase font-normal text-[#6D6D68]">Available</div>
              <div className="text-base font-light text-[#111111] mt-0.5">{summary!.available}</div>
            </div>
            <div className="rounded-[6px] border border-[#E8E8E5] bg-[#FAFAF8] p-2">
              <div className="text-[10px] uppercase font-normal text-[#6D6D68]">Delayed</div>
              <div className="text-base font-light text-[#DC2626] mt-0.5">{summary!.runningLate}</div>
            </div>
          </div>

          {/* Exception Items */}
          {exceptions.length > 0 && (
            <div className="space-y-2">
              {exceptions.map((eng) => {
                const sc = statusConfig[eng.status];
                return (
                  <button
                    key={eng.id}
                    onClick={() => onEngineerClick?.(eng)}
                    className="w-full flex items-center gap-3 rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-left hover:border-[#D0D0CD] transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E4E4E1] text-[#686866]">
                      {eng.status === 'RUNNING_LATE' ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <MapPin className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-normal text-[#101010] truncate">{eng.name}</span>
                        <Badge variant={sc.variant as any} size="xs">{sc.label}</Badge>
                      </div>
                      <div className="text-[11px] text-[#686866] truncate">{eng.currentSite}</div>
                      <div className="text-[11px] text-[#9B9B97]">{eng.etaOrCheckedIn}</div>
                    </div>
                    <Truck className="h-4 w-4 text-[#9B9B97] shrink-0" />
                    <ChevronRight className="h-4 w-4 text-[#9B9B97] shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
