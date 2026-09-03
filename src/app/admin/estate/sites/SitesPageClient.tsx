'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Building2, MapPin, ArrowUpRight, Plus, X } from 'lucide-react';
import type { Site, ClientAccount } from '@/server/estate';

interface Props {
  initialSites: Site[];
  clientAccounts?: ClientAccount[];
}

export function SitesPageClient({ initialSites, clientAccounts = [] }: Props) {
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    site_code: '',
    site_type: 'COMMERCIAL_OFFICE',
    address_line1: '',
    address_line2: '',
    city: '',
    county: '',
    postcode: '',
    country: 'GB',
    client_account_id: '',
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          site_code: form.site_code.trim() || undefined,
          site_type: form.site_type,
          address_line1: form.address_line1.trim(),
          address_line2: form.address_line2.trim() || undefined,
          city: form.city.trim(),
          county: form.county.trim() || undefined,
          postcode: form.postcode.trim(),
          country: form.country || 'GB',
          client_account_id: form.client_account_id.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create site.');
      }

      setSites([data.site, ...sites]);
      setIsModalOpen(false);
      setForm({
        name: '',
        site_code: '',
        site_type: 'COMMERCIAL_OFFICE',
        address_line1: '',
        address_line2: '',
        city: '',
        county: '',
        postcode: '',
        country: 'GB',
        client_account_id: '',
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        category="Estate & Facility Management"
        title="Managed Sites & Portfolios"
        description="Comprehensive physical property registry featuring Site 360 interactive building workspaces and live sensor telemetry."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add New Facility
          </Button>
        }
      />

      {sites.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-10 w-10 text-[#9B9B97]" />}
          title="No sites registered"
          description="Your estate hierarchy has no registered physical sites or facilities yet. Import your estate via Migration Tools or add your first property."
          actionText="Add Facility"
          onActionClick={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {sites.map((s, idx) => (
            <Link
              key={s.id}
              href={`/admin/estate/sites/${s.id}`}
              className="group rounded-[14px] border border-[#E4E4E1] bg-[#FFFFFF] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#FF6B24] hover:shadow-[0_8px_20px_rgba(255,107,36,0.08)] transition-all duration-200"
            >
              <div className="relative h-44 w-full bg-[#F0F0EE] overflow-hidden">
                <Image
                  src={idx % 2 === 0 ? '/images/EntireFM 01.png' : '/images/EntireFM 02.png'}
                  alt={s.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="rounded-[5px] bg-[#101010]/80 backdrop-blur-md px-2 py-0.5 text-[9.5px] uppercase tracking-wider text-white font-normal">
                    {s.site_code}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-white/80">
                    <MapPin className="h-3 w-3 text-white/70" />
                    <span className="truncate">{s.city}{s.postcode ? `, ${s.postcode}` : ''}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-light text-[14px] text-[#101010] line-clamp-1 group-hover:text-[#FF6B24] transition-colors">
                    {s.name}
                  </h3>
                  <div className="font-normal text-[10.5px] text-[#686866] uppercase mt-0.5">
                    {s.site_type?.replace(/_/g, ' ') || 'FACILITY'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E1] font-normal text-[11px]">
                  <Badge variant={s.status === 'ACTIVE' ? 'green' : 'neutral'} size="xs">
                    {s.status}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[#FF6B24] font-light text-[11px] group-hover:underline">
                    Launch Site 360
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Site Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E4E4E1] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E1]">
              <div>
                <h3 className="text-base font-light text-[#101010]">Register New Facility</h3>
                <p className="text-xs text-[#686866]">Add a physical site or property to the estate hierarchy.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#9B9B97] hover:text-[#101010]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="rounded-[6px] border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#101010] font-medium mb-1">Site / Facility Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Cannon Street Trading Estate"
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Site Code</label>
                  <input
                    type="text"
                    value={form.site_code}
                    onChange={(e) => set('site_code', e.target.value.toUpperCase())}
                    placeholder="e.g. CAN-01"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] font-normal focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Site Type</label>
                  <select
                    value={form.site_type}
                    onChange={(e) => set('site_type', e.target.value)}
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  >
                    <option value="COMMERCIAL_OFFICE">Commercial Office</option>
                    <option value="RETAIL_UNIT">Retail Unit</option>
                    <option value="INDUSTRIAL_WAREHOUSE">Industrial / Warehouse</option>
                    <option value="MIXED_USE">Mixed Use</option>
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="HEALTHCARE">Healthcare</option>
                    <option value="EDUCATION">Education</option>
                    <option value="HOSPITALITY">Hospitality</option>
                    <option value="DATA_CENTRE">Data Centre</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Client Account</label>
                <select
                  value={form.client_account_id}
                  onChange={(e) => set('client_account_id', e.target.value)}
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                >
                  <option value="">-- No Client Account (Internal / Unassigned) --</option>
                  {clientAccounts.map((ca) => (
                    <option key={ca.id} value={ca.id}>
                      {ca.name} ({ca.account_number || ca.id.slice(0, 8)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={form.address_line1}
                  onChange={(e) => set('address_line1', e.target.value)}
                  placeholder="e.g. 12 Cannon Street"
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#101010] font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  value={form.address_line2}
                  onChange={(e) => set('address_line2', e.target.value)}
                  placeholder="Building, floor, unit (optional)"
                  className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#101010] font-medium mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    placeholder="e.g. London"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#101010] font-medium mb-1">Postcode *</label>
                  <input
                    type="text"
                    required
                    value={form.postcode}
                    onChange={(e) => set('postcode', e.target.value.toUpperCase())}
                    placeholder="e.g. EC4N 6AP"
                    className="w-full p-2 rounded-[6px] border border-[#E4E4E1] bg-[#FFFFFF] text-[12.5px] font-normal focus:border-[#EA580C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E4E4E1]">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {isSubmitting ? 'Registering…' : 'Register Site'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
