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
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#686866] text-white">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
            OPERATIONS TIMELINE
          </h2>
        </div>
        <div className="flex items-center rounded-[7px] border border-[#E4E4E1] bg-[#FFFFFF] p-0.5">
          {(['TODAY', 'TOMORROW', 'WEEK'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-all ${
                timeframe === tf ? 'bg-[#101010] text-white shadow-sm' : 'text-[#686866] hover:text-[#101010]'
              }`}
            >
              {tf.charAt(0) + tf.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center gap-3">
          <Calendar className="h-7 w-7 text-[#D0D0CD]" />
          <p className="font-medium text-[#686866] text-[13px]">No scheduled activity</p>
          <p className="text-[12px] text-[#9B9B97]">
            PPM schedules, inspections, and engineer visits will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E4E4E1]">
          {events.map((event) => {
            const Icon = typeIcon[event.type];
            const badge = statusBadge[event.status];
            return (
              <div key={event.id} className="flex items-start gap-4 px-5 py-3.5">
                <div className="font-mono text-[12px] text-[#686866] w-10 shrink-0 pt-0.5">{event.time}</div>
                <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] ${
                  event.status === 'AT_RISK' ? 'bg-red-50' :
                  event.status === 'IN_PROGRESS' ? 'bg-blue-50' :
                  event.status === 'COMPLETED' ? 'bg-green-50' : 'bg-[#F0F0EE]'
                }`}>
                  {event.status === 'COMPLETED' ? (
                    <CheckCircle className="h-3.5 w-3.5 text-[#15803D]" />
                  ) : (
                    <Icon className={`h-3.5 w-3.5 ${
                      event.status === 'AT_RISK' ? 'text-red-500' :
                      event.status === 'IN_PROGRESS' ? 'text-blue-500' : 'text-[#686866]'
                    }`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium text-[#101010] leading-snug">{event.title}</p>
                    <Badge variant={badge.variant as any} size="xs">{badge.label}</Badge>
                  </div>
                  <p className="text-[11.5px] text-[#686866] mt-0.5">{event.location}</p>
                  {event.attendee && <p className="text-[11.5px] text-[#9B9B97] mt-0.5">{event.attendee}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
