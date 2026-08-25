import React from 'react';
import { AuditEvent } from '@/server/audit';

interface ActivityTimelineProps {
  events: AuditEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#E4E4E1] bg-[#FFFFFF] p-6 text-center text-[12px] text-[#686866]">
        No recorded activity events yet.
      </div>
    );
  }

  return (
    <div className="relative pl-5 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-[1px] before:bg-[#E4E4E1]">
      <div className="space-y-4">
        {events.map((evt) => (
          <div key={evt.id} className="relative">
            {/* Timeline Micro-Dot */}
            <div
              className={`absolute -left-5 top-1.5 h-2 w-2 rounded-full border-2 border-[#FFFFFF] ${
                evt.is_ai ? 'bg-[#7C3AED]' : 'bg-[#FF6B24]'
              }`}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[13px] text-[#101010]">{evt.event_type}</span>
                {evt.is_ai && (
                  <span className="rounded-[4px] bg-[#F5F3FF] border border-[#DDD6FE] px-1 py-0.2 font-mono text-[9px] text-[#7C3AED] font-light">
                    AI AGENT
                  </span>
                )}
                <span className="font-mono text-[10.5px] text-[#9B9B97] tabular-nums">
                  {new Date(evt.created_at).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {evt.reason && (
                <div className="mt-0.5 text-[12px] text-[#686866]">{evt.reason}</div>
              )}

              <div className="mt-1 font-mono text-[10px] text-[#9B9B97]">
                Actor: {evt.actor_type} · Obj: {evt.object_type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
