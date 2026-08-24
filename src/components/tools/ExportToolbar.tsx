'use client';

import React from 'react';
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Copy,
  Check,
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
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 border border-slate-800 bg-[#09101f] text-slate-200 rounded-[4px]">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#FF3E9D]" />
        <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-semibold">
          Export Document &amp; Data
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onDownloadPdf && (
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-[3px] border border-slate-700 transition-colors"
            title="Generate high-resolution printable EntireFM PDF"
          >
            <Download className="w-3.5 h-3.5 text-[#FF3E9D]" />
            <span>{pdfLabel}</span>
          </button>
        )}

        {onDownloadCsv && (
          <button
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-[3px] border border-slate-800 hover:border-slate-700 transition-colors"
            title="Export CSV spreadsheet matrix"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span>{csvLabel}</span>
          </button>
        )}

        {onDownloadIcs && (
          <button
            type="button"
            onClick={onDownloadIcs}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-[3px] border border-slate-800 hover:border-slate-700 transition-colors"
            title="Export RFC 5545 iCalendar (.ics)"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{icsLabel}</span>
          </button>
        )}

        {onDownloadMarkdown && (
          <button
            type="button"
            onClick={onDownloadMarkdown}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-[3px] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{markdownLabel}</span>
          </button>
        )}

        {onCopyContent && (
          <button
            type="button"
            onClick={onCopyContent}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-[3px] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
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
