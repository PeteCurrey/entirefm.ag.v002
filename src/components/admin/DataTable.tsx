'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
}

export interface FilterTab {
  id: string;
  label: string;
  count?: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  onRowClick?: (item: T) => void;
  selectedId?: string | number | null;
  pageSize?: number;
  emptyState?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  filterTabs?: FilterTab[];
  activeFilterTab?: string;
  onFilterTabChange?: (tabId: string) => void;
}

export function StatusDot({
  status,
  label,
  className = '',
}: {
  status: 'new' | 'active' | 'warning' | 'danger' | 'neutral' | 'completed' | 'critical';
  label?: React.ReactNode;
  className?: string;
}) {
  const dotColor = {
    new: 'bg-[#EA580C]',
    active: 'bg-[#16A34A]',
    completed: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]',
    critical: 'bg-[#DC2626]',
    neutral: 'bg-[#9A9A95]',
  }[status] || 'bg-[#9A9A95]';

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColor}`} />
      {label && <span className="truncate">{label}</span>}
    </span>
  );
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchFilter,
  onRowClick,
  selectedId,
  pageSize = 25,
  emptyState,
  toolbarActions,
  filterTabs,
  activeFilterTab,
  onFilterTabChange,
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
      {/* Filter Tabs & Toolbar */}
      {(filterTabs || searchFilter || toolbarActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {filterTabs && filterTabs.length > 0 ? (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {filterTabs.map((tab) => {
                const isActive = activeFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onFilterTabChange && onFilterTabChange(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-normal rounded-[6px] transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#FFFFFF] text-[#111111] font-medium border border-[#E8E8E5] shadow-xs'
                        : 'text-[#6D6D68] hover:text-[#111111] hover:bg-[#FAFAF8]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`rounded-[4px] px-1.5 py-0.2 font-mono text-[9.5px] ${
                          isActive
                            ? 'bg-[#EA580C]/10 text-[#EA580C]'
                            : 'bg-[#F0F0EE] text-[#6D6D68]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3 sm:ml-auto">
            {searchFilter && (
              <div className="relative w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9A9A95]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-[6px] border border-[#E8E8E5] bg-[#FFFFFF] pl-9 pr-3 py-1 text-[12px] text-[#111111] placeholder-[#9A9A95] focus:border-[#EA580C] focus:outline-none"
                />
              </div>
            )}
            {toolbarActions}
            <div className="text-[11.5px] text-[#9A9A95] font-mono whitespace-nowrap">
              {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}
            </div>
          </div>
        </div>
      )}

      {/* Table Surface */}
      {paginatedData.length > 0 ? (
        <div className="overflow-x-auto rounded-[8px] border border-[#E8E8E5] bg-[#FFFFFF] shadow-xs">
          <table className="w-full min-w-[50rem] border-collapse text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#FAFAF8] text-[11px] font-normal text-[#6D6D68] uppercase tracking-wider">
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-4 py-3 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {paginatedData.map((row, rowIdx) => {
                const isSelected = selectedId !== undefined && selectedId !== null && (row.id === selectedId || (row as any).enquiry_id === selectedId);
                return (
                  <tr
                    key={row.id || (row as any).enquiry_id || rowIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`text-[#111111] transition-colors relative ${
                      isSelected
                        ? 'bg-[#FFF7ED]/50 font-medium'
                        : onRowClick
                        ? 'cursor-pointer hover:bg-[#FAFAF8]'
                        : 'hover:bg-[#FAFAF8]'
                    }`}
                  >
                    {columns.map((col, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-4 py-3.5 ${
                          cIdx === 0 && isSelected ? 'border-l-[3px] border-[#EA580C]' : ''
                        } ${col.className || ''}`}
                      >
                        {typeof col.accessor === 'function'
                          ? col.accessor(row)
                          : col.accessor
                          ? (row[col.accessor] as React.ReactNode)
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })}
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
