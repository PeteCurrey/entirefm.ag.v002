'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Download } from 'lucide-react';
import { DataImportIssue } from '@/server/data-import/types';

interface ValidationIssueListProps {
  issues: DataImportIssue[];
  batchId: string;
}

export function ValidationIssueList({ issues, batchId }: ValidationIssueListProps) {
  const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'WARNING' | 'INFO'>('ALL');

  const errors = issues.filter((i) => i.severity === 'ERROR');
  const warnings = issues.filter((i) => i.severity === 'WARNING');
  const infos = issues.filter((i) => i.severity === 'INFO');

  const filtered = filter === 'ALL' ? issues : issues.filter((i) => i.severity === filter);

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 text-[#686866]" />
          <h3 className="text-[11px] font-normal uppercase tracking-wider text-[#101010]">
            VALIDATION ISSUES
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-[7px] border border-[#E4E4E1] bg-[#FFFFFF] p-0.5">
            {(['ALL', 'ERROR', 'WARNING', 'INFO'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-[5px] px-2.5 py-1 text-[11px] font-normal transition-all ${
                  filter === f ? 'bg-[#101010] text-white' : 'text-[#686866] hover:text-[#101010]'
                }`}
              >
                {f === 'ALL' ? `All (${issues.length})` : f === 'ERROR' ? `Errors (${errors.length})` : f === 'WARNING' ? `Warnings (${warnings.length})` : `Info (${infos.length})`}
              </button>
            ))}
          </div>
          <a
            href={`/api/import/${batchId}/issues.csv`}
            download
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] px-3 py-1.5 text-[12px] font-normal text-[#686866] hover:border-[#D0D0CD] hover:text-[#101010] transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </a>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
          <CheckCircle2 className="h-7 w-7 text-[#15803D]" />
          <p className="font-normal text-[#686866] text-[13px]">No validation issues</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
          <CheckCircle2 className="h-7 w-7 text-[#15803D]" />
          <p className="text-[12.5px] text-[#9B9B97]">No issues in this category.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E4E4E1] max-h-[480px] overflow-y-auto">
          {filtered.map((issue) => {
            const Icon = issue.severity === 'ERROR' ? AlertCircle : issue.severity === 'WARNING' ? AlertTriangle : Info;
            const colorMap = {
              ERROR: 'text-red-600 bg-red-50',
              WARNING: 'text-amber-600 bg-amber-50',
              INFO: 'text-blue-600 bg-blue-50',
            };
            return (
              <div key={issue.id} className="flex items-start gap-3 px-5 py-3.5">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] mt-0.5 ${colorMap[issue.severity]}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-normal text-[#686866]">Row {issue.row_index}</span>
                    {issue.field_name && (
                      <span className="rounded-[4px] bg-[#F0F0EE] px-1.5 py-0.5 font-normal text-[10px] text-[#686866]">
                        {issue.field_name}
                      </span>
                    )}
                    <span className="rounded-[4px] bg-[#F5F5F3] border border-[#E4E4E1] px-1.5 py-0.5 font-normal text-[10px] text-[#9B9B97]">
                      {issue.issue_code}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#101010] mt-0.5">{issue.message}</p>
                  {issue.raw_value && (
                    <p className="font-normal text-[11px] text-[#9B9B97] mt-0.5">Value: "{issue.raw_value}"</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
