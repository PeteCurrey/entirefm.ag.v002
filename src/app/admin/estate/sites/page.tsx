import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { listSites, Site } from '@/server/estate';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/admin/EmptyState';
import { Badge } from '@/components/admin/ui/Badge';
import { Button } from '@/components/admin/ui/Button';
import { Building2, MapPin, ArrowUpRight, Plus, Wrench, ShieldCheck, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SitesPage() {
  const sites = await listSites();

  const displaySites = sites.length > 0 ? sites : [
    {
      id: 'site-lon-1',
      organisation_id: 'org-1',
      site_code: 'EFM-LON-01',
      name: 'Victoria House Commercial Complex',
      site_type: 'COMMERCIAL_OFFICE',
      address_line1: '37 Camden High Street',
      city: 'London',
      postcode: 'NW1 7JE',
      country: 'GB',
      status: 'ACTIVE' as const,
      security_clearance_required: false,
      created_at: new Date().toISOString(),
      heroImageUrl: '/images/0c21ecde-cc89-4509-951a-5d9d65a7a8be.png',
    },
    {
      id: 'site-man-2',
      organisation_id: 'org-1',
      site_code: 'EFM-MAN-04',
      name: 'Manchester Hub & Tech Central',
      site_type: 'TECH_PARK',
      address_line1: '14 Oxford Road',
      city: 'Manchester',
      postcode: 'M1 5QA',
      country: 'GB',
      status: 'ACTIVE' as const,
      security_clearance_required: true,
      created_at: new Date().toISOString(),
      heroImageUrl: '/images/EntireFM 02.png',
    },
    {
      id: 'site-bhx-3',
      organisation_id: 'org-1',
      site_code: 'EFM-BHX-02',
      name: 'Birmingham Logistics & Distribution Centre',
      site_type: 'INDUSTRIAL_LOGISTICS',
      address_line1: 'Gravelly Industrial Park',
      city: 'Birmingham',
      postcode: 'B24 8HZ',
      country: 'GB',
      status: 'ACTIVE' as const,
      security_clearance_required: false,
      created_at: new Date().toISOString(),
      heroImageUrl: '/images/12ecc6b7-2a40-4046-86d8-ca2f3f51dec6.png',
    },
    {
      id: 'site-lds-4',
      organisation_id: 'org-1',
      site_code: 'EFM-LDS-08',
      name: 'Leeds Sovereign Square Estate',
      site_type: 'HEADQUARTERS',
      address_line1: '1 Sovereign Square',
      city: 'Leeds',
      postcode: 'LS1 4DA',
      country: 'GB',
      status: 'ACTIVE' as const,
      security_clearance_required: false,
      created_at: new Date().toISOString(),
      heroImageUrl: '/images/28ca5f7b-4fa5-40c4-9ff7-6ccb008fdb08.png',
    },
  ];

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
          >
            Add New Facility
          </Button>
        }
      />

      {/* Grid of Site 360 Facility Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {displaySites.map((s, idx) => (
          <Link
            key={s.id}
            href={`/admin/estate/sites/${s.id}`}
            className="group rounded-[14px] border border-[#E4E4E1] bg-[#FFFFFF] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#FF6B24] hover:shadow-[0_8px_20px_rgba(255,107,36,0.08)] transition-all duration-200"
          >
            {/* Site Hero Photo */}
            <div className="relative h-44 w-full bg-[#F0F0EE] overflow-hidden">
              <Image
                src={(s as any).heroImageUrl || (idx % 2 === 0 ? '/images/EntireFM 01.png' : '/images/EntireFM 02.png')}
                alt={s.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="rounded-[5px] bg-[#101010]/80 backdrop-blur-md px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-white font-medium">
                  {s.site_code}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-[11px] text-white/80">
                  <MapPin className="h-3 w-3 text-white/70" />
                  <span className="truncate">{s.city}, {s.postcode}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-medium text-[14px] text-[#101010] line-clamp-1 group-hover:text-[#FF6B24] transition-colors">
                  {s.name}
                </h3>
                <div className="font-mono text-[10.5px] text-[#686866] uppercase mt-0.5">
                  {s.site_type.replace(/_/g, ' ')}
                </div>
              </div>

              {/* Action trigger footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E1] font-mono text-[11px]">
                <Badge variant="green" size="xs">ACTIVE</Badge>
                <span className="inline-flex items-center gap-1 text-[#FF6B24] font-semibold text-[11px] group-hover:underline">
                  Launch Site 360
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
