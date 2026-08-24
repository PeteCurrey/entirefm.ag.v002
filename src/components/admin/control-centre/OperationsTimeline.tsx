'use client';

import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, AlertCircle, Wrench, ShieldCheck, Truck, Users } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface TimelineEvent {
  id: string;
  time: string;
  type: 'ENGINEER_ARRIVAL' | 'PPM' | 'INSPECTION' | 'PERMIT' | 'SLA_DEADLINE' | 'CONTRACTOR_VISIT';
  title: string;
  location: string;
  attendee?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'AT_RISK';
}

interface OperationsTimelineProps {
  events: TimelineEvent[];
}

const typeIcon: Record<TimelineEvent['type'], React.ElementType> = {
  ENGINEER_ARRIVAL: Users,
  PPM: Wrench,
  INSPECTION: ShieldCheck,
  PERMIT: Clock,
  SLA_DEADLINE: AlertCircle,
  CONTRACTOR_VISIT: Truck,
};

const statusBadge: Record<TimelineEvent['status'], { label: string; variant: string }> = {
  SCHEDULED: { label: 'Scheduled', variant: 'gray' },
  IN_PROGRESS: { label: 'In Progress', variant: 'blue' },
  COMPLETED: { label: 'Completed', variant: 'green' },
  AT_RISK: { label: 'At Risk', variant: 'red' },
};

export function OperationsTimeline({ events }: OperationsTimelineProps) {
  const [timeframe, setTimeframe] = useState<'TODAY' | 'TOMORROW' | 'WEEK'>('TODAY');

  return (
    <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FFFFFF] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#111111] text-white">
            <Calendar className="h-3 w-3" />
          </div>
          <h2 className="text-[12px] font-semibold text-[#111111] uppercase tracking-wide">
            Operations Timeline
          </h2>
        </div>
        <div className="flex items-center rounded-[4px] border border-[#E8E8E5] bg-[#FFFFFF] p-0.5">
          {(['TODAY', 'TOMORROW', 'WEEK'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-[3px] px-2 py-0.5 text-[11px] font-medium transition-all ${
                timeframe === tf ? 'bg-[#111111] text-white' : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              {tf.charAt(0) + tf.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center gap-1.5">
          <Calendar className="h-5 w-5 text-[#9A9A95]" />
          <p className="font-medium text-[#111111] text-[12.5px]">No scheduled activity for {timeframe.toLowerCase()}</p>
          <p className="text-[11.5px] text-[#6D6D68]">
            PPM occurrences and contractor visits will display automatically.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E8E8E5]">
          {events.map((event) => {
            const Icon = typeIcon[event.type];
            const badge = statusBadge[event.status];
            return (
              <div key={event.id} className="flex items-start gap-4 px-4 py-3 hover:bg-[#FAFAF8] transition-colors">
                <div className="font-mono text-[12px] text-[#6D6D68] w-10 shrink-0 pt-0.5">{event.time}</div>
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] ${
                  event.status === 'AT_RISK' ? 'bg-red-50 text-red-600' :
                  event.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' :
                  event.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-[#FAFAF8] text-[#6D6D68]'
                }`}>
                  {event.status === 'COMPLETED' ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium text-[#111111] leading-snug">{event.title}</p>
                    <Badge variant={badge.variant as any} size="xs">{badge.label}</Badge>
                  </div>
                  <p className="text-[11.5px] text-[#6D6D68] mt-0.5">{event.location}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
