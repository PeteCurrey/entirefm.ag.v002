import React from 'react';
import { Cloud, Wind, Droplets, AlertTriangle, CheckCircle2, Compass, ShieldAlert } from 'lucide-react';
import type { LobbyWeatherData } from '@/lib/lobby/weather';

interface WeatherWidgetProps {
  weather: LobbyWeatherData | null;
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather) {
    return (
      <div className="p-5 bg-white border border-neutral-200/80 rounded-sm">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-semibold uppercase tracking-wider text-[10px]">OPERATIONAL SITE WEATHER</span>
          <span className="font-mono text-[10px]">OFFLINE</span>
        </div>
        <p className="mt-3 text-xs text-neutral-500 font-light italic">
          Weather telemetry temporarily unavailable. Check local meteorological forecasts for site work planning.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200/80 rounded-sm p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
            <Compass className="w-3 h-3 text-brand-electric" />
            <span>FM SITE OPERATIONS · WEATHER MONITOR</span>
          </div>
          <h4 className="text-sm font-medium text-neutral-900 mt-0.5">{weather.locationName}</h4>
          <span className="text-[11px] text-neutral-500 font-light">{weather.region}</span>
        </div>

        <div className="text-right">
          <span className="text-2xl font-light text-neutral-900">{weather.temperature}°C</span>
          <div className="text-[11px] text-neutral-500">{weather.condition}</div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-1 text-center bg-neutral-50/70 border border-neutral-100 rounded-xs p-2.5">
        <div className="space-y-0.5">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Feels Like</span>
          <span className="text-xs font-medium text-neutral-800">{weather.apparentTemperature}°C</span>
        </div>
        <div className="space-y-0.5 border-x border-neutral-200/60">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Wind / Gusts</span>
          <span className="text-xs font-medium text-neutral-800">
            {weather.windSpeedMph} / {weather.windGustsMph} <span className="text-[10px] text-neutral-500">mph</span>
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Humidity</span>
          <span className="text-xs font-medium text-neutral-800">{weather.humidity}%</span>
        </div>
      </div>

      {/* FM Safety Advisory (Rooftop / Working at Height) */}
      <div
        className={`p-3 rounded-xs border text-xs flex items-start gap-2.5 ${
          weather.isSafeForRoofAccess
            ? 'bg-emerald-50/60 border-emerald-200/70 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        {weather.isSafeForRoofAccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5 leading-snug">
          <span className="font-semibold text-[11px] uppercase tracking-wider block">
            {weather.isSafeForRoofAccess ? 'Site Safety Clearance' : 'Working at Height Caution'}
          </span>
          <p className="text-[11px] font-light opacity-90">{weather.roofAccessAdvisory}</p>
        </div>
      </div>

      {/* 4-Day Outlook */}
      {weather.outlook.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block">
            4-Day Site Planning Outlook
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
            {weather.outlook.map((day) => (
              <div key={day.date} className="p-2 bg-neutral-50/50 rounded-xs space-y-1">
                <span className="text-[11px] font-medium text-neutral-700 block">{day.dayName}</span>
                <span className="text-xs font-semibold text-neutral-900 block">{day.maxTemp}°</span>
                <span className="text-[10px] text-neutral-400 block line-clamp-1">{day.condition}</span>
                {day.precipitationProbability > 30 && (
                  <span className="text-[9px] text-sky-600 font-medium block">
                    {day.precipitationProbability}% rain
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
