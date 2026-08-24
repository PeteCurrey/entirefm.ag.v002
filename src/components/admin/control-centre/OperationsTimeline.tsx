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

export function OperationsTimeline() {
  const [timeframe, setTimeframe] = useState<'TODAY' | 'TOMORROW' | 'WEEK'>('TODAY');

  const events: TimelineEvent[] = [
    {
      id: 't-1',
      time: '08:30',
      type: 'ENGINEER_ARRIVAL',
      title: 'Lead HVAC Engineer Check-in & Security Clearance',
      location: 'Victoria House · London',
      attendee: 'Marcus Vance (EntireFM Internal)',
      status: 'COMPLETED',
    },
    {
      id: 't-2',
      time: '10:00',
      type: 'PPM',
      title: 'Quarterly Chiller AHU Filter Replacement & Belt Tensioning',
      location: 'Manchester Tech Hub · Plant Deck 3',
      attendee: 'Apex Cooling Systems Ltd',
      status: 'IN_PROGRESS',
    },
    {
      id: 't-3',
      time: '11:45',
      type: 'SLA_DEADLINE',
      title: 'P1 Reactive Water Ingress Resolution Target',
      location: 'Manchester Office · Floor 4 East',
      status: 'AT_RISK',
    },
    {
      id: 't-4',
      time: '14:00',
      type: 'INSPECTION',
      title: 'Statutory Dry Riser 6-Monthly Visual & Pressure Test',
      location: 'Leeds Sovereign Square',
      attendee: 'FireSafe UK Compliance Auditor',
      status: 'SCHEDULED',
    },
    {
      id: 't-5',
      time: '16:30',
      type: 'PERMIT',
      title: 'Permit-to-Work: Roof Access & Edge Protection Inspection',
      location: 'Sheffield Logistics Park',
      attendee: 'Rooftop Safety Specialist',
      status: 'SCHEDULED',
    },
  ];

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'ENGINEER_ARRIVAL':
        return <Users className="h-3.5 w-3.5 text-[#FF6B24]" />;
      case 'PPM':
        return <Wrench className="h-3.5 w-3.5 text-[#2563EB]" />;
      case 'INSPECTION':
        return <ShieldCheck className="h-3.5 w-3.5 text-[#15803D]" />;
      case 'PERMIT':
        return <AlertCircle className="h-3.5 w-3.5 text-[#D97706]" />;
      case 'SLA_DEADLINE':
        return <Clock className="h-3.5 w-3.5 text-[#DC2626]" />;
      case 'CONTRACTOR_VISIT':
        return <Truck className="h-3.5 w-3.5 text-[#7C3AED]" />;
    }
  };

  const getStatusBadge = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="green" size="xs">COMPLETED</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="blue" size="xs" pulse>IN PROGRESS</Badge>;
      case 'AT_RISK':
        return <Badge variant="red" size="xs" pulse>SLA IMMINENT</Badge>;
      case 'SCHEDULED':
        return <Badge variant="neutral" size="xs">SCHEDULED</Badge>;
    }
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#101010] text-white">
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#101010]">
              TODAY&apos;S OPERATIONS TIMELINE
            </h2>
            <p className="text-[11.5px] text-[#686866]">
              Hourly dispatch sequence and scheduled permit events
            </p>
          </div>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center rounded-[7px] border border-[#E4E4E1] bg-[#FFFFFF] p-0.5">
          {(['TODAY', 'TOMORROW', 'WEEK'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-all ${
                timeframe === t
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'text-[#686866] hover:text-[#101010]'
              }`}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="p-5 space-y-4">
        {events.map((evt) => (
          <div key={evt.id} className="flex items-start gap-4">
            {/* Time badge */}
            <div className="w-14 shrink-0 font-mono text-[12px] font-semibold text-[#101010] pt-0.5 tabular-nums">
              {evt.time}
            </div>

            {/* Event connector & marker */}
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border border-[#E4E4E1] bg-[#F5F5F3]">
              {getTypeIcon(evt.type)}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1 rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 hover:bg-[#FFFFFF] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="font-medium text-[13px] text-[#101010] truncate">
                  {evt.title}
                </div>
                <div>{getStatusBadge(evt.status)}</div>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[11.5px] text-[#686866]">
                <span>{evt.location}</span>
                {evt.attendee && (
                  <>
                    <span className="text-[#9B9B97]">·</span>
                    <span className="font-mono text-[#101010]">{evt.attendee}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
