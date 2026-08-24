/**
 * CSV EXPORTER UTILITY
 * ====================
 * Generates formatted CSV strings and handles client-side direct downloads.
 */

export interface CsvColumn<T> {
  header: string;
  accessor: (item: T) => string | number | boolean | null | undefined;
}

export function generateCsv<T>(data: T[], columns: CsvColumn<T>[]): string {
  const headers = columns.map((col) => escapeCsvField(col.header)).join(',');
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const val = col.accessor(item);
        if (val === null || val === undefined) return '""';
        return escapeCsvField(String(val));
      })
      .join(',')
  );

  return [headers, ...rows].join('\r\n');
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return `"${field}"`;
}

export function downloadCsvFile(csvContent: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
