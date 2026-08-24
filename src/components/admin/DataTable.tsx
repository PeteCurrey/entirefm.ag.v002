'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  toolbarActions?: React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchFilter,
  onRowClick,
  pageSize = 25,
  emptyState,
  toolbarActions,
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
    <div className="space-y-3">
      {/* Table Toolbar */}
      {(searchFilter || toolbarActions) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {searchFilter && (
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9B9B97]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] pl-9 pr-3 py-1.5 text-[12.5px] text-[#101010] placeholder-[#9B9B97] focus:border-[#FF6B24] focus:outline-none focus:ring-1 focus:ring-[#FF6B24]"
              />
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            {toolbarActions}
            <div className="font-mono text-[11px] text-[#686866]">
              {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
            </div>
          </div>
        </div>
      )}

      {/* Table Surface */}
      {paginatedData.length > 0 ? (
        <div className="overflow-x-auto rounded-[12px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <table className="w-full min-w-[50rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E4E4E1] bg-[#F0F0EE] font-mono text-[10.5px] uppercase tracking-wider text-[#686866]">
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-4 py-3 font-semibold ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E1]">
              {paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`text-[#101010] transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-[#F5F5F3]'
                      : 'hover:bg-[#FAFAFA]'
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-4 py-3 ${col.className || ''}`}>
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
          <div className="rounded-[12px] border border-dashed border-[#E4E4E1] bg-[#FFFFFF] p-8 text-center text-[12.5px] text-[#686866]">
            No matching records found.
          </div>
        )
      )}

      {/* Table Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[11px] text-[#686866]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-medium text-[#101010] hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-medium text-[#101010] hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
