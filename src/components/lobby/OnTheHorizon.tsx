import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Clock, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { getOnTheHorizonItems } from '@/server/events/horizon-store';

import type { LobbyWeatherData } from '@/lib/lobby/weather';
import { WeatherWidget } from './WeatherWidget';

interface OnTheHorizonProps {
  weather?: LobbyWeatherData | null;
}

export function OnTheHorizon({ weather }: OnTheHorizonProps) {
  const items = getOnTheHorizonItems();

  return (
    <section className="bg-[#FAF9F7] py-16 sm:py-20 border-b border-neutral-200/80">
      <div className="container-wide space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <span className="text-[11px] font-normal uppercase tracking-[0.2em] text-neutral-400 block mb-1">
              INDUSTRY TIMELINE &amp; SITE OPERATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extralight text-neutral-900">
              On The Horizon &amp; Site Weather
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/lobby/events" className="text-brand-electric hover:underline">
              Events Calendar &rarr;
            </Link>
            <Link href="/lobby/awards" className="text-neutral-700 hover:text-neutral-900">
              Awards Deadlines &rarr;
            </Link>
          </div>
        </div>

        {/* Responsive Grid with Weather Widget */}
        <div className="grid lg:grid-cols-[1.75fr_1fr] gap-8 items-start">
          {/* Key Dates Cards */}
          <div className="grid sm:grid-cols-2 gap-5">
            {items.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="bg-white border border-neutral-200/80 rounded-sm p-5 flex flex-col justify-between space-y-3 hover:border-neutral-400 transition-colors group block"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-sm bg-neutral-900 text-white text-xs font-medium">
                      {item.dateBadge}
                    </span>
                    {item.statusBadge && (
                      <span className="text-[10px] font-medium text-brand-electric uppercase tracking-wider">
                        {item.statusBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-medium text-neutral-900 leading-snug group-hover:text-brand-electric transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-500 font-normal line-clamp-1">
                    {item.organizerOrAuthority}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-normal text-neutral-400">
                  <span className="uppercase tracking-wider">{item.category}</span>
                  <span className="text-neutral-900 group-hover:text-brand-electric flex items-center gap-1">
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Operational Weather Widget */}
          <div>
            <WeatherWidget weather={weather ?? null} />
          </div>
        </div>

      </div>
    </section>
  );
}
