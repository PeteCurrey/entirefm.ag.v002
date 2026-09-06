'use client';

import React, { useState } from 'react';
import { Site, Building, ClientAccount } from '@/server/estate';
import {
  Building2,
  User,
  Phone,
  Mail,
  Clock,
  Key,
  ShieldCheck,
  Edit2,
  X,
  AlertCircle,
  Check,
  Link as LinkIcon,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface SiteProfileInspectorProps {
  site: Site;
  buildings?: Building[];
  clientAccounts?: ClientAccount[];
  onSiteUpdated?: (updatedSite: Site) => void;
}

const FACILITY_TYPES = [
  { value: 'COMMERCIAL_OFFICE', label: 'Commercial Office' },
  { value: 'INDUSTRIAL_WAREHOUSE', label: 'Industrial & Logistics Warehouse' },
  { value: 'RESIDENTIAL_ESTATE', label: 'Residential Estate / Block' },
  { value: 'RETAIL_PARK', label: 'Retail & Shopping Centre' },
  { value: 'HEALTHCARE_SURGERY', label: 'Healthcare & Medical Surgery' },
  { value: 'EDUCATION_CAMPUS', label: 'Education & Campus' },
  { value: 'DATA_CENTRE', label: 'Data Centre & Telecommunications' },
  { value: 'HOSPITALITY_HOTEL', label: 'Hospitality & Leisure' },
  { value: 'MIXED_USE', label: 'Mixed Use Development' },
  { value: 'OTHER', label: 'Other Commercial Facility' },
];

export function SiteProfileInspector({
  site,
  buildings = [],
  clientAccounts = [],
  onSiteUpdated,
}: SiteProfileInspectorProps) {
  const totalGia = buildings.reduce((acc, b) => acc + (b.gross_internal_area_sqm || 0), 0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: site.name || '',
    site_code: site.site_code || '',
    site_type: site.site_type || 'COMMERCIAL_OFFICE',
    client_account_id: site.client_account_id || '',
    address_line1: site.address_line1 || '',
    address_line2: site.address_line2 || '',
    city: site.city || '',
    county: site.county || '',
    postcode: site.postcode || '',
    country: site.country || 'United Kingdom',
    access_instructions: site.access_instructions || '',
    security_clearance_required: site.security_clearance_required || false,
    status: site.status || 'ACTIVE',
  });

  const handleOpenModal = () => {
    setForm({
      name: site.name || '',
      site_code: site.site_code || '',
      site_type: site.site_type || 'COMMERCIAL_OFFICE',
      client_account_id: site.client_account_id || '',
      address_line1: site.address_line1 || '',
      address_line2: site.address_line2 || '',
      city: site.city || '',
      county: site.county || '',
      postcode: site.postcode || '',
      country: site.country || 'United Kingdom',
      access_instructions: site.access_instructions || '',
      security_clearance_required: site.security_clearance_required || false,
      status: site.status || 'ACTIVE',
    });
    setError(null);
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/sites/${site.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          site_code: form.site_code.trim(),
          site_type: form.site_type,
          client_account_id: form.client_account_id || null,
          address_line1: form.address_line1.trim(),
          address_line2: form.address_line2.trim() || null,
          city: form.city.trim(),
          county: form.county.trim() || null,
          postcode: form.postcode.trim(),
          country: form.country.trim() || 'United Kingdom',
          access_instructions: form.access_instructions.trim() || null,
          security_clearance_required: form.security_clearance_required,
          status: form.status,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update site profile');
      }

      // If client was linked, attach client_account object for immediate UI reflection
      const updatedSite = data.site as Site;
      if (form.client_account_id) {
        const matchedClient = clientAccounts.find((c) => c.id === form.client_account_id);
        if (matchedClient) {
          updatedSite.client_account = { name: matchedClient.name };
        }
      } else {
        updatedSite.client_account = undefined;
      }

      if (onSiteUpdated) {
        onSiteUpdated(updatedSite);
      }

      setSuccess('Site specification and client linkage updated successfully.');
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error updating site');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[16px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#E4E4E1] bg-[#F0F0EE] px-5 py-3 flex items-center justify-between">
        <h3 className="text-[11px] font-normal uppercase tracking-wider text-[#101010]">
          SITE PROFILE & SPECIFICATION
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant={site.status === 'ACTIVE' ? 'green' : 'neutral'} size="xs">
            {site.status}
          </Badge>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-1 text-[11px] font-medium text-[#EA580C] hover:text-[#C2410C] bg-[#FFFFFF] hover:bg-orange-50 border border-[#E4E4E1] rounded-[6px] px-2.5 py-1 transition-colors"
          >
            <Edit2 className="h-3 w-3" />
            Edit Profile & Link Client
          </button>
        </div>
      </div>

      {success && (
        <div className="m-4 rounded-[8px] bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between text-emerald-800 text-[12px]">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="p-5 space-y-5 text-[12.5px]">
        {/* Specification Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Reference Code</span>
            <span className="font-medium text-[#101010]">{site.site_code}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Facility Type</span>
            <span className="font-medium text-[#101010]">
              {site.site_type ? site.site_type.replace(/_/g, ' ') : 'COMMERCIAL'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Gross Internal Area</span>
            <span className="font-medium text-[#101010]">
              {totalGia > 0 ? `${totalGia.toLocaleString()} m²` : '—'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Client / Organisation</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-[#FF6B24]">
                {site.client_account?.name || site.organisation?.name || 'EntireFM Direct / Unassigned'}
              </span>
              {site.client_account_id && (
                <span className="text-[10px] bg-orange-100 text-[#EA580C] px-1.5 py-0.2 rounded font-normal">
                  Linked
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Full Address</span>
            <span className="font-normal text-[#101010] text-right">
              {[site.address_line1, site.city, site.postcode].filter(Boolean).join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E4E4E1]/60">
            <span className="text-[#686866]">Security Clearance</span>
            <span className="font-normal text-[#101010]">
              {site.security_clearance_required ? 'MANDATORY' : 'STANDARD'}
            </span>
          </div>
        </div>

        {/* Access Instructions */}
        <div className="space-y-2 pt-1">
          <h4 className="text-[10.5px] uppercase tracking-wider text-[#9B9B97] font-light">
            ACCESS & SITE PROTOCOLS
          </h4>
          <div className="rounded-[10px] border border-[#E4E4E1] bg-[#F9F9F8] p-3 text-[12px] text-[#686866] leading-relaxed">
            <p>
              {site.access_instructions ||
                'Standard site check-in required at main reception for all engineering personnel.'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Site & Link Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] rounded-[14px] border border-[#E4E4E1] max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-semibold text-[#101010]">Edit Site Specification & Client Linkage</h3>
                <p className="text-xs text-[#686866]">
                  Update site details, location, and assign or link to a client account in EntireFM CAFM.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#9B9B97] hover:text-[#101010]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Client Linkage Selector */}
              <div className="rounded-[8px] bg-orange-50/60 border border-orange-200 p-3 space-y-1.5">
                <label className="block text-[#101010] font-semibold flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5 text-[#EA580C]" />
                  Linked Client Account
                </label>
                <select
                  value={form.client_account_id}
                  onChange={(e) => setForm({ ...form, client_account_id: e.target.value })}
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] font-medium text-[#101010] focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="">-- EntireFM Direct / Unassigned --</option>
                  {clientAccounts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.account_number || c.account_tier})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#686866]">
                  Linking this site to a client automatically associates work orders, PPM schedules, and billing to their client portal.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Site Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Site Reference Code *</label>
                  <input
                    type="text"
                    required
                    value={form.site_code}
                    onChange={(e) => setForm({ ...form, site_code: e.target.value.toUpperCase() })}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Facility Type</label>
                  <select
                    value={form.site_type}
                    onChange={(e) => setForm({ ...form, site_type: e.target.value })}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    {FACILITY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Operating Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={form.address_line1}
                  onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">County</label>
                  <input
                    type="text"
                    value={form.county}
                    onChange={(e) => setForm({ ...form, county: e.target.value })}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Postcode *</label>
                  <input
                    type="text"
                    required
                    value={form.postcode}
                    onChange={(e) => setForm({ ...form, postcode: e.target.value.toUpperCase() })}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] font-mono focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Access & Site Protocols</label>
                <textarea
                  rows={3}
                  value={form.access_instructions}
                  onChange={(e) => setForm({ ...form, access_instructions: e.target.value })}
                  placeholder="e.g. Check in at reception desk on arrival, keys with security officer..."
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="security_clearance"
                  checked={form.security_clearance_required}
                  onChange={(e) => setForm({ ...form, security_clearance_required: e.target.checked })}
                  className="rounded border-[#E4E4E1] text-[#EA580C] focus:ring-[#EA580C]"
                />
                <label htmlFor="security_clearance" className="text-[12px] text-[#101010]">
                  Mandatory Security Clearance Required for Field Engineers
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Site Specification'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
