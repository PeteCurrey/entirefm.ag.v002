import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import type { WorthAttendingItem } from '@/data/lobby/types';

interface WorthAttendingProps {
  data: WorthAttendingItem;
}

export function WorthAttending({ data }: WorthAttendingProps) {
  return (
    <article className="w-full bg-white border border-neutral-200/80 rounded-sm overflow-hidden group">
      <div className="grid lg:grid-cols-[1fr_1.3fr] items-stretch min-h-[380px]">
        {/* City/Venue Photographic Crop */}
        <div className="relative min-h-[220px] lg:min-h-full overflow-hidden bg-neutral-900">
          <Image
            src="/images/editorial/entirefm-manchester-castlefield-night-1280w.webp"
            alt={data.title}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] brightness-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] font-medium uppercase tracking-widest text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
              CURATED EVENT · {data.eventType}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10 text-xs text-white/90 font-light flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-electric shrink-0" />
            <span>{data.location}</span>
          </div>
        </div>

        {/* Editorial Event Details */}
        <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-normal">
              <span className="text-brand-electric font-medium uppercase tracking-wider">{data.date}</span>
              <span>{data.organizer}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extralight text-neutral-900 leading-tight">
              {data.title}
            </h3>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 block">
                Why It’s Worth Your Time
              </span>
              <p className="text-sm font-light text-neutral-600 leading-relaxed">
                {data.editorialReason}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href={data.registrationUrl}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-brand-electric transition-colors group/link"
            >
              <span>View Event Details &amp; Register</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>

            <span className="text-xs text-neutral-400 font-normal">
              CPD Certified
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
