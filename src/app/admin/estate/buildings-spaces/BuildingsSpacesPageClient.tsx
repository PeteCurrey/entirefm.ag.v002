'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  Layers,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Building, Space } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/admin/ui/Button';

interface Props {
  initialBuildings: Building[];
  initialSpaces: Space[];
}

export function BuildingsSpacesPageClient({ initialBuildings, initialSpaces }: Props) {
  const [buildings] = useState<Building[]>(initialBuildings);
  const [spaces] = useState<Space[]>(initialSpaces);
  const [buildingSearch, setBuildingSearch] = useState('');
  const [spaceSearch, setSpaceSearch] = useState('');

  const filteredBuildings = useMemo(() => {
    return buildings.filter(
      (b) =>
        buildingSearch.trim() === '' ||
        b.name.toLowerCase().includes(buildingSearch.toLowerCase()) ||
        b.building_code.toLowerCase().includes(buildingSearch.toLowerCase())
    );
  }, [buildings, buildingSearch]);

  const filteredSpaces = useMemo(() => {
    return spaces.filter(
      (s) =>
        spaceSearch.trim() === '' ||
        s.name.toLowerCase().includes(spaceSearch.toLowerCase()) ||
        s.space_code.toLowerCase().includes(spaceSearch.toLowerCase()) ||
        s.space_type.toLowerCase().includes(spaceSearch.toLowerCase())
    );
  }, [spaces, spaceSearch]);

  return (
    <div className="space-y-8 font-sans">
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Buildings & Internal Spaces"
        description="Physical facilities structure, floor zones, plant rooms, risers, and rentable workspace suites."
        action={
          <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />}>
            New Building / Space
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Buildings Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-normal uppercase text-[#686866]">
              Buildings Directory ({filteredBuildings.length})
            </h2>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9B9B97]" />
            <input
              type="text"
              value={buildingSearch}
              onChange={(e) => setBuildingSearch(e.target.value)}
              placeholder="Search buildings..."
              className="w-full rounded-[6px] border border-[#E4E4E1] bg-[#FAFAF8] pl-9 pr-3 py-1.5 text-[12px] text-[#101010] placeholder-[#9B9B97] focus:border-[#EA580C] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-xs">
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#E4E4E1] bg-[#FAFAF8] text-[10.5px] font-normal uppercase tracking-wider text-[#686866]">
                  <th className="px-4 py-2.5">Building Name / Code</th>
                  <th className="px-4 py-2.5">GIA (sqm)</th>
                  <th className="px-4 py-2.5">Floors</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E1]">
                {filteredBuildings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-[#9B9B97] font-light">
                      No buildings recorded
                    </td>
                  </tr>
                ) : (
                  filteredBuildings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#101010]">{b.name}</div>
                        <div className="font-normal text-[10.5px] text-[#686866]">{b.building_code}</div>
                      </td>
                      <td className="px-4 py-3 font-normal text-[#686866]">
                        {b.gross_internal_area_sqm ? `${b.gross_internal_area_sqm.toLocaleString()} sqm` : '—'}
                      </td>
                      <td className="px-4 py-3 font-normal text-[#686866]">{b.total_floors || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-normal px-2 py-0.5 rounded border border-emerald-200">
                          {b.status || 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Spaces Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[12px] font-normal uppercase text-[#686866]">
              Spaces &amp; Functional Zones ({filteredSpaces.length})
            </h2>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9B9B97]" />
            <input
              type="text"
              value={spaceSearch}
              onChange={(e) => setSpaceSearch(e.target.value)}
              placeholder="Search spaces by name or type..."
              className="w-full rounded-[6px] border border-[#E4E4E1] bg-[#FAFAF8] pl-9 pr-3 py-1.5 text-[12px] text-[#101010] placeholder-[#9B9B97] focus:border-[#EA580C] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto rounded-[8px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-xs">
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#E4E4E1] bg-[#FAFAF8] text-[10.5px] font-normal uppercase tracking-wider text-[#686866]">
                  <th className="px-4 py-2.5">Space Name / Code</th>
                  <th className="px-4 py-2.5">Space Type</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E1]">
                {filteredSpaces.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-[#9B9B97] font-light">
                      No spaces recorded
                    </td>
                  </tr>
                ) : (
                  filteredSpaces.map((s) => (
                    <tr key={s.id} className="hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#101010]">{s.name}</div>
                        <div className="font-normal text-[10.5px] text-[#686866]">{s.space_code}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-normal text-[10.5px] text-[#686866] bg-[#FAFAF8] px-2 py-0.5 rounded border border-[#E4E4E1]">
                          {s.space_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-normal px-2 py-0.5 rounded border border-emerald-200">
                          {s.status || 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
