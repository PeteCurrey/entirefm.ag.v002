import React from "react";
import Link from "next/link";
import { FileText, ArrowRight, Download, Shield } from "lucide-react";

interface TradeDocItem {
  title: string;
  href: string;
  desc: string;
  type: "GUIDE" | "TEMPLATE" | "COMPLIANCE" | "SAFETY";
}

interface TradeDocsGridProps {
  tradeName: string;
  docs: TradeDocItem[];
}

export function TradeDocsGrid({ tradeName, docs }: TradeDocsGridProps) {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="container-wide space-y-12">
        <div className="max-w-3xl space-y-3">
          <span className="eyebrow eyebrow-light">DOCUMENTATION &amp; TEMPLATES</span>
          <h2 className="text-2xl sm:text-3xl font-extralight text-slate-900 tracking-tight">
            Safety &amp; Compliance Resources for {tradeName} Contractors
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            Free operational frameworks, RAMS templates, and statutory guides to support your site operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {docs.map((doc, idx) => (
            <Link
              key={idx}
              href={doc.href}
              className="bg-[#FAFAF8] border border-slate-200 rounded-sm p-5 space-y-3 shadow-xs hover:-translate-y-1 hover:border-[#EA580C]/50 hover:bg-white transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#EA580C]">
                  {doc.type}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {doc.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-[11.5px] font-medium text-[#EA580C]">
                <span>View Resource</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
