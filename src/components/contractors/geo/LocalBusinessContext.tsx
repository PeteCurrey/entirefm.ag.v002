import React from "react";
import { Building2, Layers, ShieldCheck } from "lucide-react";

interface LocalBusinessContextProps {
  locationName: string;
  overview: string;
  propertySectors: Array<{ title: string; desc: string }>;
}

export function LocalBusinessContext({
  locationName,
  overview,
  propertySectors,
}: LocalBusinessContextProps) {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="container-custom max-w-4xl space-y-10">
        <div className="space-y-3">
          <span className="eyebrow eyebrow-light">REGIONAL CONTEXT</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            Commercial Property &amp; Facilities Landscape in {locationName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Understanding the local commercial property mix ensures our contractor network delivers the precise technical capabilities required.
          </p>
        </div>

        <div className="prose-brand text-xs sm:text-sm font-light text-slate-700 leading-relaxed bg-[#FAF9FB] p-6 rounded-sm border border-slate-200">
          <p>{overview}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {propertySectors.map((sector, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-sm p-5 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                <Building2 className="w-4 h-4 text-[#EA580C]" />
                <span>{sector.title}</span>
              </div>
              <p className="text-[11.5px] text-slate-600 font-light leading-relaxed">
                {sector.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
