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
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#1D4ED8] text-white">
            <Users className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              FIELD PRESENCE
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              {hasData
                ? `${summary!.onSite} on site · ${summary!.travelling} travelling`
                : 'Live engineer presence status'}
            </p>
          </div>
        </div>
        <Link href="/admin/operations/dispatch" className="text-[11.5px] font-medium text-[#686866] hover:text-[#101010] transition-colors">
          Dispatch →
        </Link>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
          <Users className="h-7 w-7 text-[#D0D0CD]" />
          <p className="font-medium text-[#686866] text-[13px]">No field activity data</p>
          <p className="text-[12px] text-[#9B9B97]">
            Engineer check-ins and dispatch events will appear here.
          </p>
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {/* Summary Strip */}
          <div className="grid grid-cols-4 gap-2 font-mono text-center">
            {[
              { label: 'On Site', value: summary!.onSite, color: 'text-[#15803D]' },
              { label: 'Travelling', value: summary!.travelling, color: 'text-[#1D4ED8]' },
              { label: 'Available', value: summary!.available, color: 'text-[#686866]' },
              { label: 'Late', value: summary!.runningLate, color: summary!.runningLate > 0 ? 'text-[#D97706]' : 'text-[#9B9B97]' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-[8px] border border-[#E4E4E1] bg-[#F5F5F3] p-2.5">
                <div className={`text-[18px] font-light tabular-nums ${color}`}>{value}</div>
                <div className="text-[9.5px] uppercase text-[#9B9B97] mt-0.5">{label}</div>
              </div>
            ))}
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
                        <span className="text-[13px] font-medium text-[#101010] truncate">{eng.name}</span>
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
