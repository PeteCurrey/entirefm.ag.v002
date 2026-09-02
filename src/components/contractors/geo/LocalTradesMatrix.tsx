import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

interface DisciplineItem {
  name: string;
  tradeSlug: string;
  recruitmentStatus: "HIGH_DEMAND" | "ACTIVE_RECRUITMENT" | "ESTABLISHED";
  scopeDesc: string;
}

interface LocalTradesMatrixProps {
  locationName: string;
  locationSlug: string;
  disciplines: DisciplineItem[];
}

export function LocalTradesMatrix({
  locationName,
  locationSlug,
  disciplines,
}: LocalTradesMatrixProps) {
  const getBadge = (status: DisciplineItem["recruitmentStatus"]) => {
    switch (status) {
      case "HIGH_DEMAND":
        return <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">HIGH DEMAND</span>;
      case "ACTIVE_RECRUITMENT":
        return <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm">ACTIVE RECRUITMENT</span>;
      default:
        return <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">ESTABLISHED</span>;
    }
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="container-wide space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow eyebrow-light">TRADE OPPORTUNITIES</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            Trades We Are Onboarding in {locationName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            EntireFM is actively seeking professional contractors across key maintenance disciplines in {locationName} to support commercial facilities management contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.map((d, idx) => (
            <div
              key={idx}
              className="bg-[#FAFAF8] border border-slate-200 rounded-sm p-6 space-y-4 shadow-xs hover:-translate-y-0.5 hover:border-[#EA580C]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  {getBadge(d.recruitmentStatus)}
                  <span className="text-[10px] font-mono text-slate-400 uppercase">COMMERCIAL FM</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  {d.name} in {locationName}
                </h3>

                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {d.scopeDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <Link
                  href={`/contractors/${d.tradeSlug}`}
                  className="font-medium text-[#EA580C] hover:underline inline-flex items-center gap-1"
                >
                  <span>Trade Standards</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  href="/suppliers/apply"
                  className="font-medium text-slate-900 hover:text-[#EA580C]"
                >
                  Apply &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
