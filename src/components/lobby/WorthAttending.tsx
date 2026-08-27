import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, ArrowUpRight, Award, Clock } from 'lucide-react';
import type { WorthAttendingItem } from '@/data/lobby/types';

interface WorthAttendingProps {
  data: WorthAttendingItem;
}

export function WorthAttending({ data }: WorthAttendingProps) {
  return (
    <div className="border border-brand-edge bg-white rounded-sm p-6 sm:p-8 lg:p-10 shadow-subtle hover:border-brand-electric/40 transition-all duration-300">
      <div className="grid lg:grid-cols-[1.3fr_1fr] items-center gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-brand-electric/10 text-brand-electric text-[11px] font-medium tracking-wide uppercase">
              <Calendar className="w-3.5 h-3.5" />
              WORTH ATTENDING · Curated Event
            </span>
            <span className="text-xs text-brand-silver font-light">· {data.eventType}</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extralight text-brand-graphite leading-tight tracking-tight">
            {data.title}
          </h3>

          <p className="text-xs sm:text-sm font-light text-brand-slate leading-relaxed">
            <strong className="font-normal text-brand-graphite">Why it’s worth an FM’s time: </strong>
            {data.editorialReason}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-brand-silver font-light">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-electric" />
              <span>{data.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-electric" />
              <span>{data.location}</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="rounded-sm bg-brand-surface border border-brand-edge p-6 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-silver block">
              Organised by:
            </span>
            <p className="text-sm font-normal text-brand-graphite">{data.organizer}</p>
            <p className="text-xs font-light text-brand-silver">
              Curated by the EntireFM Editorial Directorate. Zero sponsored placement.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={data.registrationUrl}
              className="btn-primary w-full justify-center text-xs sm:text-sm py-2.5"
            >
              <span>Register Attendance</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
