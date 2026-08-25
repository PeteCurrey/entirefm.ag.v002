import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { TIER1_CITIES } from '@/content/locations/tier1-cities';

interface GeoCrossLinksProps {
  currentCity: string;
}

const CITY_NEARBY_MAP: Record<string, Array<{ name: string; href: string; label: string }>> = {
  london: [
    { name: 'Watford & North London', href: '/locations', label: 'M25 North Corridor' },
    { name: 'Slough & Heathrow M4', href: '/locations', label: 'Thames Valley West' },
    { name: 'Croydon & South London', href: '/locations', label: 'Surrey & South London' },
    { name: 'Stratford & East London', href: '/locations', label: 'Thames Gateway' },
    { name: 'Birmingham Facilities Management', href: '/facilities-management-birmingham', label: 'Midlands Main Hub' },
    { name: 'Manchester Facilities Management', href: '/facilities-management-manchester', label: 'North West Hub' },
  ],
  manchester: [
    { name: 'Liverpool Facilities Management', href: '/locations', label: 'Merseyside Corridor' },
    { name: 'Leeds Facilities Management', href: '/facilities-management-leeds', label: 'M62 Trans-Pennine Hub' },
    { name: 'Sheffield Facilities Management', href: '/facilities-management-sheffield', label: 'South Yorkshire Link' },
    { name: 'Salford & MediaCityUK', href: '/locations', label: 'Greater Manchester Core' },
    { name: 'Trafford Park & Industrial', href: '/locations', label: 'Logistics Corridor' },
    { name: 'Birmingham Facilities Management', href: '/facilities-management-birmingham', label: 'West Midlands' },
  ],
  birmingham: [
    { name: 'London Facilities Management', href: '/facilities-management-london', label: 'Greater London' },
    { name: 'Nottingham Facilities Management', href: '/locations', label: 'East Midlands' },
    { name: 'Derby Facilities Management', href: '/locations', label: 'Derbyshire Hub' },
    { name: 'Coventry & Warwickshire', href: '/locations', label: 'Midlands Belt' },
    { name: 'Wolverhampton & Black Country', href: '/locations', label: 'West Midlands' },
    { name: 'Manchester Facilities Management', href: '/facilities-management-manchester', label: 'North West' },
  ],
  sheffield: [
    { name: 'Rotherham & Dearne Valley', href: '/locations', label: 'South Yorkshire Industrial' },
    { name: 'Chesterfield Facilities Management', href: '/facilities-management-chesterfield', label: 'North Derbyshire' },
    { name: 'Doncaster Logistics Corridor', href: '/locations', label: 'M18 / Rail-Freight Hub' },
    { name: 'Leeds Facilities Management', href: '/facilities-management-leeds', label: 'West Yorkshire' },
    { name: 'Lincoln Facilities Management', href: '/facilities-management-lincoln', label: 'Lincolnshire Operations' },
    { name: 'Manchester Facilities Management', href: '/facilities-management-manchester', label: 'North West' },
  ],
  leeds: [
    { name: 'Sheffield Facilities Management', href: '/facilities-management-sheffield', label: 'South Yorkshire' },
    { name: 'Manchester Facilities Management', href: '/facilities-management-manchester', label: 'North West' },
    { name: 'Bradford & West Yorkshire', href: '/locations', label: 'Aire Valley' },
    { name: 'York & North Yorkshire', href: '/locations', label: 'Yorkshire Hub' },
    { name: 'Lincoln Facilities Management', href: '/facilities-management-lincoln', label: 'East Coast Operations' },
    { name: 'London Facilities Management', href: '/facilities-management-london', label: 'National Desk' },
  ],
};

export function GeoCrossLinks({ currentCity }: GeoCrossLinksProps) {
  const slug = (currentCity || '').toLowerCase().replace(/\s+/g, '-');
  const nearby = CITY_NEARBY_MAP[slug] || [
    { name: 'London Facilities Management', href: '/facilities-management-london', label: 'Greater London & South' },
    { name: 'Manchester Facilities Management', href: '/facilities-management-manchester', label: 'North West Operations' },
    { name: 'Birmingham Facilities Management', href: '/facilities-management-birmingham', label: 'Midlands Operations' },
    { name: 'Leeds Facilities Management', href: '/facilities-management-leeds', label: 'Yorkshire Operations' },
    { name: 'Sheffield Facilities Management', href: '/facilities-management-sheffield', label: 'South Yorkshire' },
    { name: 'Lincoln Facilities Management', href: '/facilities-management-lincoln', label: 'East Midlands' },
  ];

  return (
    <section className="py-16 bg-brand-surface border-b border-brand-edge">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8" data-reveal>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-brand-pink" />
            <span className="text-xs font-normal uppercase tracking-wider text-brand-graphite">
              Regional Operations Network &amp; Connected Corridors
            </span>
          </div>
          <Link href="/locations" className="text-xs font-normal text-brand-pink hover:underline">
            View complete UK coverage map &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" data-reveal>
          {nearby.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group rounded-sm border border-brand-edge bg-white p-4 transition-all duration-300 hover:border-brand-electric/40 hover:shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-silver block mb-1">
                  {link.label}
                </span>
                <span className="text-xs font-normal text-brand-graphite group-hover:text-brand-pink transition-colors line-clamp-2">
                  {link.name}
                </span>
              </div>
              <ArrowRight className="h-3 w-3 text-brand-silver group-hover:text-brand-pink group-hover:translate-x-0.5 transition-all mt-3 self-end" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
