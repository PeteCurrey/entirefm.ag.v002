'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { DataImportEntityType } from '@/server/data-import/types';

interface ColumnMappingTableProps {
  headers: string[];
  sampleRows: Record<string, string>[];
  mapping: Record<string, string>;
  onMappingChange: (sourceCol: string, targetField: string) => void;
  entityType: DataImportEntityType;
}

const FIELD_DEFINITIONS: Record<
  DataImportEntityType,
  Array<{ field: string; label: string; required?: boolean; description: string }>
> = {
  CLIENT: [
    { field: 'external_id', label: 'External Customer ID', description: 'Unique identifier from source (e.g. SimPRO CustomerID)' },
    { field: 'name', label: 'Client / Account Name', required: true, description: 'Display name for the client account' },
    { field: 'company_name', label: 'Legal Company Name', description: 'Registered company name' },
    { field: 'account_number', label: 'Account Number', description: 'Finance / ERP account reference' },
    { field: 'email', label: 'Primary Contact Email', description: 'Main billing / operational contact email' },
    { field: 'phone', label: 'Contact Telephone', description: 'Primary contact phone number' },
    { field: 'address_line1', label: 'Billing Address Line 1', description: 'Street address' },
    { field: 'city', label: 'City / Town', description: 'Locality or postal town' },
    { field: 'county', label: 'County / State', description: 'Administrative region' },
    { field: 'postcode', label: 'Postcode', description: 'Postal code' },
    { field: 'country', label: 'Country Code', description: 'ISO country code (default GB)' },
    { field: 'payment_terms_days', label: 'Payment Terms (Days)', description: 'Credit terms in days (default 30)' },
    { field: 'credit_limit_gbp', label: 'Credit Limit (£)', description: 'Approved credit limit' },
  ],
  SITE: [
    { field: 'external_id', label: 'External Site ID', description: 'Unique identifier from source (e.g. SimPRO SiteID)' },
    { field: 'parent_client_external_id', label: 'Parent Client Customer ID', required: true, description: 'Source ID of the parent client account' },
    { field: 'parent_client_name', label: 'Parent Client Name', description: 'Name of parent client (fallback lookup)' },
    { field: 'name', label: 'Site Name', required: true, description: 'Facility or building name' },
    { field: 'site_code', label: 'Site Code / Reference', description: 'Internal short code for the site' },
    { field: 'site_type', label: 'Site Classification', description: 'Property type (e.g. COMMERCIAL_OFFICE, INDUSTRIAL)' },
    { field: 'address_line1', label: 'Address Line 1', required: true, description: 'Primary street address' },
    { field: 'address_line2', label: 'Address Line 2', description: 'Secondary address or building name' },
    { field: 'city', label: 'City / Town', required: true, description: 'Postal town' },
    { field: 'county', label: 'County / State', description: 'County or region' },
    { field: 'postcode', label: 'Postcode', required: true, description: 'UK / Irish postal code' },
    { field: 'country', label: 'Country', description: 'Country code (default GB)' },
  ],
  CONTRACTOR: [
    { field: 'external_id', label: 'External Supplier ID', description: 'Unique supplier ID from SimPRO / source' },
    { field: 'name', label: 'Contractor Company Name', required: true, description: 'Trading or legal name of contractor' },
    { field: 'primary_trade', label: 'Primary Trade / Discipline', description: 'Main trade category (HVAC, Electrical, Fire, etc.)' },
    { field: 'email', label: 'Dispatch / Contact Email', description: 'Work assignment contact email' },
    { field: 'phone', label: 'Contact Telephone', description: 'Primary phone number' },
    { field: 'address_line1', label: 'Address Line 1', description: 'Registered business address' },
    { field: 'city', label: 'City / Town', description: 'Business postal town' },
    { field: 'postcode', label: 'Postcode', description: 'Registered business postcode' },
    { field: 'company_number', label: 'Company Reg Number (CRN)', description: 'Companies House registration' },
    { field: 'vat_number', label: 'VAT Registration Number', description: 'HMRC VAT number' },
  ],
  ASSET: [],
  PPM_SCHEDULE: [],
  WORK_ORDER: [],
  GENERIC: [],
};

export function ColumnMappingTable({
  headers,
  sampleRows,
  mapping,
  onMappingChange,
  entityType,
}: ColumnMappingTableProps) {
  const availableFields = FIELD_DEFINITIONS[entityType] || [];

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 flex items-center justify-between">
        <h3 className="font-mono text-[11px] font-normal uppercase tracking-wider text-[#101010]">
          CSV COLUMN TO ENTIRECAFM FIELD MAPPING
        </h3>
        <span className="text-[11.5px] text-[#686866]">
          {headers.length} columns detected
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-[#E4E4E1] bg-[#F9F9F8] font-mono text-[10.5px] uppercase text-[#686866]">
            <tr>
              <th className="px-5 py-3">Source Column (CSV)</th>
              <th className="px-5 py-3">Sample Value</th>
              <th className="px-3 py-3 w-8 text-center"></th>
              <th className="px-5 py-3">EntireCAFM Target Field</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E1]">
            {headers.map((col) => {
              const currentTarget = mapping[col] || '';
              const sampleVal = sampleRows[0]?.[col] || sampleRows[1]?.[col] || '—';
              const targetDef = availableFields.find((f) => f.field === currentTarget);

              return (
                <tr key={col} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[12px] font-normal text-[#101010]">
                    {col}
                  </td>
                  <td className="px-5 py-3.5 text-[#686866] max-w-[220px] truncate">
                    <span className="rounded-[4px] bg-[#F0F0EE] px-2 py-0.5 font-mono text-[11.5px] text-[#444]">
                      {sampleVal}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-center text-[#9B9B97]">
                    <ArrowRight className="h-4 w-4 inline" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <select
                        value={currentTarget}
                        onChange={(e) => onMappingChange(col, e.target.value)}
                        className={`rounded-[8px] border px-3 py-1.5 text-[12.5px] font-normal focus:outline-none transition-all ${
                          currentTarget
                            ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D]'
                            : 'border-[#E4E4E1] bg-[#FFFFFF] text-[#686866]'
                        }`}
                      >
                        <option value="">— Do Not Import (Skip) —</option>
                        {availableFields.map((f) => (
                          <option key={f.field} value={f.field}>
                            {f.label} {f.required ? '(Required)' : ''}
                          </option>
                        ))}
                      </select>
                      {targetDef?.required && (
                        <span className="rounded-[4px] bg-[#FEF2F2] border border-[#FECACA] px-1.5 py-0.5 font-mono text-[9px] font-normal text-[#DC2626]">
                          REQ
                        </span>
                      )}
                    </div>
                    {targetDef && (
                      <p className="text-[11px] text-[#9B9B97] mt-1">{targetDef.description}</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
