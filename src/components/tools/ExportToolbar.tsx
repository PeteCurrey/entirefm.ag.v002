'use client';

import React from 'react';
import {
  Download,
  FileSpreadsheet,
  Calendar,
  Copy,
  Check,
  FileText,
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
  csvLabel = 'Export CSV Spreadsheet',
  icsLabel = 'Export Calendar (.ics)',
  markdownLabel = 'Download Markdown',
  copyLabel = 'Copy Specification',
  extraActions,
}: ExportToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-5 bg-white border border-slate-200 text-slate-900 rounded-sm shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-brand-electric" />
        <span className="font-mono text-xs uppercase tracking-wider text-slate-600 font-light">
          Export Document &amp; Data
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onDownloadPdf && (
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-graphite hover:bg-slate-800 text-white font-normal text-xs rounded-sm shadow-sm transition-all duration-200 hover:shadow"
            title="Generate high-resolution printable EntireFM PDF"
          >
            <Download className="w-3.5 h-3.5 text-brand-electric-bright" />
            <span>{pdfLabel}</span>
          </button>
        )}

        {onDownloadCsv && (
          <button
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-normal text-xs rounded-sm border border-slate-200 transition-colors"
            title="Export CSV spreadsheet matrix"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>{csvLabel}</span>
          </button>
        )}

        {onDownloadIcs && (
          <button
            type="button"
            onClick={onDownloadIcs}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-normal text-xs rounded-sm border border-slate-200 transition-colors"
            title="Export RFC 5545 iCalendar (.ics)"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-electric" />
            <span>{icsLabel}</span>
          </button>
        )}

        {onDownloadMarkdown && (
          <button
            type="button"
            onClick={onDownloadMarkdown}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-normal text-xs rounded-sm border border-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{markdownLabel}</span>
          </button>
        )}

        {onCopyContent && (
          <button
            type="button"
            onClick={onCopyContent}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-normal text-xs rounded-sm border border-slate-200 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-light">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
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
