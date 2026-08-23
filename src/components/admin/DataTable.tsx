'use client';

import React, { useState, useMemo } from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  emptyState?: React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchFilter,
  onRowClick,
  pageSize = 25,
  emptyState,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim() || !searchFilter) return data;
    return data.filter((item) => searchFilter(item, search.toLowerCase().trim()));
  }, [data, search, searchFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {searchFilter && (
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-brand-edge-dark bg-brand-void px-3 py-1.5 text-[12.5px] text-white placeholder-brand-mist/40 focus:border-brand-electric focus:outline-none"
            />
          </div>
          <div className="font-mono text-[11px] text-brand-mist/50">
            Showing {filteredData.length} records
          </div>
        </div>
      )}

      {paginatedData.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-brand-edge-dark bg-brand-carbon/40 shadow-sm">
          <table className="w-full min-w-[50rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-brand-edge-dark bg-brand-void/50 font-mono text-[10.5px] uppercase tracking-wider text-brand-mist/50">
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-5 py-3 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-edge-dark/60">
              {paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`text-brand-mist/80 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-brand-void/60 hover:text-white' : 'hover:bg-brand-void/20'
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-5 py-3.5 ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                        ? (row[col.accessor] as unknown as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        emptyState || (
          <div className="rounded-lg border border-dashed border-brand-edge-dark/60 p-8 text-center text-[12.5px] text-brand-mist/50">
            No matching records found.
          </div>
        )
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-[11px] text-brand-mist/40">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded border border-brand-edge-dark bg-brand-void px-2.5 py-1 text-[11px] text-white disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded border border-brand-edge-dark bg-brand-void px-2.5 py-1 text-[11px] text-white disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
