import React from 'react';
import { listBuildings, listSpaces } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';

export const dynamic = 'force-dynamic';

export default async function BuildingsSpacesPage() {
  const [buildings, spaces] = await Promise.all([listBuildings(), listSpaces()]);

  const buildingCols: Column<any>[] = [
    {
      header: 'Building Name / Code',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="font-mono text-[11px] text-brand-mist/50">{row.building_code}</div>
        </div>
      ),
    },
    {
      header: 'GIA (sqm)',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/70">
          {row.gross_internal_area_sqm ? `${row.gross_internal_area_sqm} sqm` : '—'}
        </div>
      ),
    },
    {
      header: 'Floors',
      accessor: (row) => (
        <div className="font-mono text-[11px] text-brand-mist/70">
          {row.total_floors || '—'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        category="Estate Hierarchy"
        title="Buildings & Spaces"
        description="Physical facilities structure, floor zones, plant rooms, and rentable spaces."
        action={
          <button className="rounded bg-brand-electric px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-brand-indigo">
            + New Building / Space
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-mono text-[12px] font-semibold uppercase text-brand-mist/70">
            Buildings Directory ({buildings.length})
          </h2>
          <DataTable
            columns={buildingCols}
            data={buildings}
            searchPlaceholder="Filter buildings..."
            searchFilter={(item, q) =>
              item.name.toLowerCase().includes(q) || item.building_code.toLowerCase().includes(q)
            }
          />
        </div>

        <div>
          <h2 className="mb-3 font-mono text-[12px] font-semibold uppercase text-brand-mist/70">
            Spaces & Zones ({spaces.length})
          </h2>
          <DataTable
            columns={[
              {
                header: 'Space Name / Code',
                accessor: (row) => (
                  <div>
                    <div className="font-semibold text-white">{row.name}</div>
                    <div className="font-mono text-[11px] text-brand-mist/50">{row.space_code}</div>
                  </div>
                ),
              },
              {
                header: 'Type',
                accessor: (row) => (
                  <span className="font-mono text-[11px] text-brand-mist/70">{row.space_type}</span>
                ),
              },
            ]}
            data={spaces}
            searchPlaceholder="Filter spaces..."
            searchFilter={(item, q) =>
              item.name.toLowerCase().includes(q) || item.space_code.toLowerCase().includes(q)
            }
          />
        </div>
      </div>
    </div>
  );
}
