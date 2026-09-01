'use client';

import React from 'react';
import { Download } from 'lucide-react';

export function CsvExportButton({
  data,
  filename = 'export.csv',
  label = 'Export CSV',
}: {
  data: any[];
  filename?: string;
  label?: string;
}) {
  const handleExport = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data || data.length === 0}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded text-xs font-normal transition-colors disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5 text-slate-500" />
      {label}
    </button>
  );
}
