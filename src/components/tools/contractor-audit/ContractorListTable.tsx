'use client';

import React from 'react';
import {
  Edit2,
  Trash2,
  Copy,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ContractorEntry,
  ContractorNoticeStatus,
  calculateContractorStatus,
} from '@/types/contractor-audit';

interface ContractorListTableProps {
  contractors: ContractorEntry[];
  onEditContractor: (contractor: ContractorEntry) => void;
  onDeleteContractor: (id: string) => void;
  onDuplicateContractor: (contractor: ContractorEntry) => void;
  onClearAll: () => void;
  onLoadSample: () => void;
}

export function ContractorListTable({
  contractors,
  onEditContractor,
  onDeleteContractor,
  onDuplicateContractor,
  onClearAll,
  onLoadSample,
}: ContractorListTableProps) {
  const calculatedRows = contractors.map((c) => calculateContractorStatus(c));

  const formatUkDate = (isoStr: string | null) => {
    if (!isoStr) return '—';
    try {
      const [y, m, d] = isoStr.split('-');
      return `${d}/${m}/${y}`;
    } catch {
      return isoStr;
    }
  };

  const getStatusBadge = (status: ContractorNoticeStatus, daysUntilNotice: number | null) => {
    switch (status) {
      case 'notice_passed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>Notice Expired ({Math.abs(daysUntilNotice || 0)}d ago)</span>
          </span>
        );
      case 'notice_imminent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Notice Due ({daysUntilNotice}d left)</span>
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Active Window ({daysUntilNotice}d)</span>
          </span>
        );
      case 'rolling':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Rolling / Unspecified</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
      {/* Table Header / Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium text-slate-900">
              Audited Suppliers &amp; Agreements
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
              {contractors.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Click edit or duplicate to test different procurement scenarios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {contractors.length === 0 ? (
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-electric hover:bg-blue-600 text-white text-xs font-normal rounded-sm transition-colors cursor-pointer"
            >
              <span>Load 6-Contractor Sample Estate</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onLoadSample}
                className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-sm hover:bg-slate-200/60 transition-colors"
                title="Reset to pre-configured 6-contractor commercial sample"
              >
                Reset Sample
              </button>
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-800 px-2.5 py-1.5 rounded-sm hover:bg-rose-50 transition-colors"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Empty State */}
      {contractors.length === 0 ? (
        <div className="p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-electric flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-medium text-slate-900">No Contractors Added Yet</h4>
          <p className="text-xs text-slate-500 font-light max-w-md mx-auto">
            Add your current maintenance agreements using the form, or load our representative sample
            estate to see immediate notice period deadlines and fragmentation metrics.
          </p>
          <button
            type="button"
            onClick={onLoadSample}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-graphite hover:bg-slate-800 text-white text-xs font-normal rounded-sm transition-colors cursor-pointer mt-2"
          >
            <span>Load Sample 6-Contractor Estate</span>
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-light uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="py-3 px-4">Discipline &amp; Contractor</th>
                  <th scope="col" className="py-3 px-4">Annual Spend</th>
                  <th scope="col" className="py-3 px-4">Contract Expiry</th>
                  <th scope="col" className="py-3 px-4">Notice Period</th>
                  <th scope="col" className="py-3 px-4">Notice Deadline</th>
                  <th scope="col" className="py-3 px-4">Commercial Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculatedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      row.status === 'notice_passed' ? 'bg-rose-50/25' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{row.contractorName}</div>
                      <div className="text-[11px] text-slate-500 font-light">{row.discipline}</div>
                      {row.notes && (
                        <div className="text-[10px] text-slate-400 font-light italic mt-0.5 line-clamp-1">
                          {row.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-normal text-slate-900 tabular-nums">
                      £{row.annualSpend.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <div className="font-normal text-slate-900">{formatUkDate(row.endDate)}</div>
                      <div className="text-[10px] text-slate-400 font-light">
                        {row.daysUntilEnd > 0 ? `${row.daysUntilEnd}d remaining` : 'Expired'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-light">
                      {row.noticePeriodDays > 0 ? `${row.noticePeriodDays} days` : 'Rolling'}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <div className="font-normal text-slate-800">
                        {formatUkDate(row.noticeTriggerDate)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-light">
                        {row.daysUntilNotice !== null
                          ? row.daysUntilNotice < 0
                            ? 'Deadline passed'
                            : `${row.daysUntilNotice}d left`
                          : 'No trigger date'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(row.status, row.daysUntilNotice)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEditContractor(row)}
                          className="p-1.5 text-slate-400 hover:text-brand-electric hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
                          title="Edit Contractor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDuplicateContractor(row)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
                          title="Duplicate Record"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteContractor(row.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
                          title="Delete Contractor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="block md:hidden divide-y divide-slate-100">
            {calculatedRows.map((row) => (
              <div
                key={row.id}
                className={`p-4 space-y-2.5 ${
                  row.status === 'notice_passed' ? 'bg-rose-50/25' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-medium text-slate-900">{row.contractorName}</h4>
                    <span className="text-[11px] text-slate-500 font-light">{row.discipline}</span>
                  </div>
                  <div className="text-xs font-normal text-slate-900 tabular-nums">
                    £{row.annualSpend.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 font-light pt-1">
                  <div>
                    <span className="text-slate-400">End Date: </span>
                    <span className="font-normal text-slate-800">{formatUkDate(row.endDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Notice Trigger: </span>
                    <span className="font-normal text-slate-800">{formatUkDate(row.noticeTriggerDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>{getStatusBadge(row.status, row.daysUntilNotice)}</div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditContractor(row)}
                      className="p-1.5 text-slate-500 hover:text-brand-electric rounded-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateContractor(row)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteContractor(row.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
