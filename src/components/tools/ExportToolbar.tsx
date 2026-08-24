'use client';

import React from 'react';
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Copy,
  Check,
  Printer,
  Sparkles,
} from 'lucide-react';

export interface ExportToolbarProps {
  toolName: string;
  onDownloadPdf?: () => void;
  onDownloadCsv?: () => void;
  onDownloadIcs?: () => void;
  onDownloadMarkdown?: () => void;
  onCopyContent?: () => void;
  isCopied?: boolean;
  pdfLabel?: string;
  csvLabel?: string;
  icsLabel?: string;
  markdownLabel?: string;
  copyLabel?: string;
  extraActions?: React.ReactNode;
}

export function ExportToolbar({
  toolName,
  onDownloadPdf,
  onDownloadCsv,
  onDownloadIcs,
  onDownloadMarkdown,
  onCopyContent,
  isCopied = false,
  pdfLabel = 'Download PDF Report',
  csvLabel = 'Export CSV Matrix',
  icsLabel = 'Export Calendar (.ics)',
  markdownLabel = 'Download Markdown',
  copyLabel = 'Copy Specification',
  extraActions,
}: ExportToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-xl">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#FF3E9D] animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-semibold">
          Export Document &amp; Data Options
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onDownloadPdf && (
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FF3E9D] to-[#D91B7D] hover:opacity-95 text-white font-medium text-xs shadow-md transition-all active:scale-95"
            title="Generate high-resolution printable EntireFM report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{pdfLabel}</span>
          </button>
        )}

        {onDownloadCsv && (
          <button
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-all active:scale-95"
            title="Download full machine-readable table"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{csvLabel}</span>
          </button>
        )}

        {onDownloadIcs && (
          <button
            type="button"
            onClick={onDownloadIcs}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-all active:scale-95"
            title="Export statutory inspection timetable with 7-day reminder alarms"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{icsLabel}</span>
          </button>
        )}

        {onDownloadMarkdown && (
          <button
            type="button"
            onClick={onDownloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>{markdownLabel}</span>
          </button>
        )}

        {onCopyContent && (
          <button
            type="button"
            onClick={onCopyContent}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-all active:scale-95"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>{copyLabel}</span>
              </>
            )}
          </button>
        )}

        {extraActions}
      </div>
    </div>
  );
}
