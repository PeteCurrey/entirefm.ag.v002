import React from 'react';
import { AuditEvent } from '@/server/audit';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  actorName?: string;
  type?: string;
  isAi?: boolean;
}

interface ActivityTimelineProps {
  events: AuditEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-brand-edge-dark/60 p-6 text-center text-[12px] text-brand-mist/50">
        No recorded activity events yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 before:absolute before:bottom-0 before:left-2 before:top-2 before:w-[1px] before:bg-brand-edge-dark">
      <div className="space-y-6">
        {events.map((evt) => (
          <div key={evt.id} className="relative">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full border border-brand-void ${
                evt.is_ai ? 'bg-purple-400' : 'bg-brand-electric'
              }`}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{evt.event_type}</span>
                {evt.is_ai && (
                  <span className="rounded bg-purple-500/20 px-1 py-0.2 font-mono text-[9px] text-purple-300">
                    AI AGENT
                  </span>
                )}
                <span className="font-mono text-[10.5px] text-brand-mist/40">
                  {new Date(evt.created_at).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {evt.reason && (
                <div className="mt-0.5 text-[12px] text-brand-mist/70">{evt.reason}</div>
              )}

              <div className="mt-1 font-mono text-[10px] text-brand-mist/40">
                Actor: {evt.actor_type} · Obj: {evt.object_type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
