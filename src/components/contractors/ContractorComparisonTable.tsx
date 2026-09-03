import React from 'react';
import { Check, X } from 'lucide-react';

export interface ComparisonRow {
  attribute: string;
  colA: string | boolean;
  colB: string | boolean;
  highlight?: boolean;
}

export interface ContractorComparisonTableProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  colAName: string;
  colBName: string;
  rows: ComparisonRow[];
}

export function ContractorComparisonTable({
  eyebrow = 'COMPARATIVE ANALYSIS',
  title,
  subtitle,
  colAName,
  colBName,
  rows,
}: ContractorComparisonTableProps) {
  const renderCell = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm">
          <Check className="w-3.5 h-3.5" /> Included
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-light bg-slate-100 px-2 py-0.5 rounded-sm">
          <X className="w-3.5 h-3.5" /> Excluded
        </span>
      );
    }
    return <span className="text-xs sm:text-sm text-slate-700 font-light">{val}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        {eyebrow && <span className="eyebrow eyebrow-light">{eyebrow}</span>}
        <h3 className="text-xl sm:text-2xl font-extralight text-slate-900 tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-xs font-mono uppercase tracking-wider">
              <th className="p-3.5 sm:p-4 font-semibold border-b border-slate-800 w-1/3">
                Criterion / Characteristic
              </th>
              <th className="p-3.5 sm:p-4 font-semibold border-b border-slate-800 w-1/3 text-orange-400">
                {colAName}
              </th>
              <th className="p-3.5 sm:p-4 font-semibold border-b border-slate-800 w-1/3 text-blue-400">
                {colBName}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-slate-50/80 transition-colors ${
                  row.highlight ? 'bg-orange-50/40' : idx % 2 === 1 ? 'bg-[#FAFAF8]' : 'bg-white'
                }`}
              >
                <td className="p-3.5 sm:p-4 font-semibold text-slate-900">
                  {row.attribute}
                </td>
                <td className="p-3.5 sm:p-4">
                  {renderCell(row.colA)}
                </td>
                <td className="p-3.5 sm:p-4">
                  {renderCell(row.colB)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
