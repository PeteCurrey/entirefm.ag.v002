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
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9A9A95]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] pl-9 pr-3 py-1.5 text-[12.5px] text-[#111111] placeholder-[#9A9A95] focus:border-[#EA580C] focus:outline-none"
              />
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            {toolbarActions}
            <div className="text-[11.5px] text-[#6D6D68]">
              {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
            </div>
          </div>
        </div>
      )}

      {/* Table Surface */}
      {paginatedData.length > 0 ? (
        <div className="overflow-x-auto rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF]">
          <table className="w-full min-w-[50rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] text-[11px] font-normal text-[#6D6D68] uppercase tracking-wide">
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-4 py-3 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {paginatedData.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`text-[#111111] transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-[#FAFAF8]'
                      : 'hover:bg-[#FAFAF8]'
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`px-4 py-3 ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                        ? (row[col.accessor] as React.ReactNode)
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
              className="inline-flex items-center gap-1 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-normal text-[#101010] hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] px-2.5 py-1 text-[11px] font-normal text-[#101010] hover:bg-[#F5F5F3] disabled:opacity-40 disabled:pointer-events-none transition-colors"
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
