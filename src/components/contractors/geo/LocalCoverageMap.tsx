import React from "react";
import { MapPin, CheckCircle2, ShieldCheck, Compass } from "lucide-react";

interface LocalCoverageMapProps {
  locationName: string;
  region: string;
  surroundingAreas: string[];
  keyCorridors: string[];
}

export function LocalCoverageMap({
  locationName,
  region,
  surroundingAreas,
  keyCorridors,
}: LocalCoverageMapProps) {
  return (
    <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
      <div className="container-wide space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow eyebrow-light">GEOGRAPHIC REACH</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            Commercial Coverage Across {locationName} &amp; Surrounding Corridors
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            EntireFM operates across core commercial corridors, business parks, and logistics zones in {locationName} and the wider {region} area.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Coverage Board */}
          <div className="lg:col-span-7 bg-slate-900 rounded-sm p-6 sm:p-8 text-white space-y-6 shadow-card border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Compass className="w-4 h-4 text-[#EA580C]" />
                <span>REGIONAL NETWORK FOOTPRINT // {locationName.toUpperCase()}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE DISPATCH ACTIVE
              </span>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Primary Commercial Corridors &amp; Districts:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {keyCorridors.map((c, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-sm text-xs font-light text-slate-200 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11.5px] text-slate-400 font-light leading-relaxed">
              Approved contractors maintain their specific postcode service radii inside their Contractor Portal profile to ensure accurate, local work order routing.
            </div>
          </div>

          {/* Surrounding Towns & Districts */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-sm p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                SUB-REGIONAL POSTCODE COVERAGE
              </span>
              <h3 className="text-base font-semibold text-slate-900">
                Surrounding Areas &amp; Towns
              </h3>
            </div>

            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Contractors based in {locationName} or neighbouring towns within the regional catchment are eligible to apply:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {surroundingAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="bg-[#FAFAF8] border border-slate-200 px-3 py-1.5 rounded-sm text-xs text-slate-700 font-medium"
                >
                  {area}
                </span>
              ))}
            </div>

            <div className="p-3 bg-[#FAF9FB] border border-slate-200 rounded-sm text-[11px] text-slate-500 font-light">
              <strong>Radius Management:</strong> You control your operational travel radius (e.g. 15, 30, or 45 miles) directly within your profile settings.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
