import React from 'react';
import type { RouteRecord } from '@/lib/routes/route-schema';
import { loadContentRecord } from '@/content';
import { TemplateHome } from './TemplateHome';
import { TemplateCoreService } from './TemplateCoreService';
import { TemplateSpecialistService } from './TemplateSpecialistService';
import { TemplateSector } from './TemplateSector';
import { TemplatePrimaryLocation } from './TemplatePrimaryLocation';
import { TemplateSecondaryLocation } from './TemplateSecondaryLocation';
import { TemplateThirdLocation } from './TemplateThirdLocation';
import { TemplateLocalService } from './TemplateLocalService';
import { TemplateHub } from './TemplateHub';
import { TemplateCaseStudy } from './TemplateCaseStudy';
import { TemplateArticle } from './TemplateArticle';
import { TemplateAbout } from './TemplateAbout';
import { TemplateContact } from './TemplateContact';
import { TemplateHtmlSitemap } from './TemplateHtmlSitemap';

// Hub Data Providers
const servicesHubItems = [
  { title: 'Mechanical & Electrical (M&E)', path: '/mechanical-electrical', category: 'Hard FM', description: 'Comprehensive building M&E engineering, electrical distribution, power systems, and statutory testing.' },
  { title: 'HVAC & Air Conditioning', path: '/hvac-contractor', category: 'Hard FM', description: 'Heating, ventilation, air conditioning installation, maintenance, F-Gas compliance, and TM44 audits.' },
  { title: 'Planned Preventative Maintenance (PPM)', path: '/ppm', category: 'Hard FM', description: 'SFG20 maintenance scheduling protecting building assets and preventing costly downtime.' },
  { title: 'Hard Facilities Management', path: '/hard-services', category: 'Hard FM', description: 'Complete fabric and structural maintenance, plumbing, gas, and life-safety systems.' },
  { title: 'Commercial Plumbing & Gas', path: '/plumbing-gas', category: 'Hard FM', description: 'Commercial boiler maintenance, gas safety inspections, and water hygiene management.' },
  { title: 'Fire & Emergency Systems', path: '/fire-emergency-systems', category: 'Hard FM', description: 'Fire alarms, suppression systems, emergency lighting, and life-safety compliance.' },
  { title: 'Industrial Cleaning', path: '/industrial-cleaning', category: 'Specialist Cleaning', description: 'Heavy-duty industrial cleaning, factory shutdowns, high-level access, and floor degreasing.' },
  { title: 'Commercial Contract Cleaning', path: '/cleaning-services', category: 'Soft FM', description: 'Daily commercial office cleaning, hygiene services, and washroom replenishment.' },
  { title: 'Specialist Mobile Crane Hire', path: '/mobile-crane-hire', category: 'Specialist Services', description: 'Truck-mounted mobile cranes and specialist hoists for high-level rooftop plant lifting.' },
];

const sectorsHubItems = [
  { title: 'Industrial & Manufacturing', path: '/industrial-facilities-management', category: 'Manufacturing', description: 'Heavy engineering plant rooms, production lines, 24/7 uptime requirements, and safety protocols.' },
  { title: 'Commercial & Corporate Offices', path: '/commercial-facilities-management', category: 'Corporate', description: 'Prime office towers, multi-tenanted commercial estates, executive HVAC, and concierge.' },
  { title: 'Logistics & Warehousing', path: '/logistics-facilities-management', category: 'Logistics', description: 'High-bay distribution centres, dock levellers, fast-turnaround PPM, and floor care.' },
  { title: 'Retail Parks & Shopping Arenas', path: '/retail-facilities-management', category: 'Retail', description: 'High-footfall customer environments, emergency lighting, reactive maintenance, and cleaning.' },
  { title: 'Education & Campuses', path: '/education-facilities-management', category: 'Education', description: 'Multi-building university campuses, term-time maintenance, statutory compliance, and DBS staff.' },
  { title: 'Healthcare & Clinical', path: '/healthcare-facilities-management', category: 'Healthcare', description: 'Stringent clinical hygiene, backup power generator testing, and hospital-grade compliance.' },
];

const locationsHubItems = [
  { title: 'FM London (24/7 Response)', path: '/fm-london', category: 'London Hub', description: 'Rapid-response emergency engineering desk covering Greater London Zones 1–6 and M25.' },
  { title: 'Facilities Management London', path: '/facilities-management-london', category: 'London Hub', description: 'Planned preventative maintenance (SFG20), compliance management, and total FM contracts.' },
  { title: 'London Facilities Management', path: '/london-facilities-management', category: 'London Hub', description: 'Corporate headquarters, commercial managing agents, and prime property portfolio governance.' },
  { title: 'Manchester Facilities Management', path: '/facilities-management-manchester', category: 'North West Hub', description: 'Serving commercial, logistics, and corporate estates across Greater Manchester.' },
  { title: 'Birmingham Facilities Management', path: '/facilities-management-birmingham', category: 'Midlands Hub', description: 'Regional engineering fleet covering Birmingham, West Midlands, and central corridors.' },
  { title: 'Sheffield Facilities Management', path: '/facilities-management-sheffield', category: 'Yorkshire Hub', description: 'Direct engineering base supporting South Yorkshire manufacturing and commercial property.' },
  { title: 'Leeds Facilities Management', path: '/facilities-management-leeds', category: 'Yorkshire Hub', description: 'Total facilities management across Leeds financial district and M62 commercial belt.' },
  { title: 'Lincoln Facilities Management', path: '/facilities-management-lincoln', category: 'East Midlands Hub', description: 'Regional operational centre providing M&E, commercial cleaning, and property maintenance.' },
];

export function resolvePageTemplate(route: RouteRecord): React.ReactElement {
  const path = route.path;
  const content = loadContentRecord(path);

  // Exact Specific Route Resolvers
  if (path === '/') return <TemplateHome />;
  if (path === '/mechanical-electrical') return <TemplateCoreService />;
  if (path === '/industrial-cleaning') return <TemplateSpecialistService />;
  if (path === '/industrial-facilities-management') return <TemplateSector />;
  if (path === '/fm-london') return <TemplatePrimaryLocation />;
  if (path === '/facilities-management-london') return <TemplateSecondaryLocation />;
  if (path === '/london-facilities-management') return <TemplateThirdLocation />;
  if (path === '/industrial-cleaning-london') return <TemplateLocalService />;
  if (path === '/html-sitemap' || path === '/sitemap') return <TemplateHtmlSitemap />;

  // Hub Pages
  if (path === '/services') {
    return (
      <TemplateHub
        hubType="services"
        title="Facilities Management & Engineering Services"
        subtitle="Explore EntireFM’s integrated capabilities across Hard FM, M&E engineering, statutory compliance, specialist cleaning, and asset management."
        items={servicesHubItems}
      />
    );
  }

  if (path === '/sectors') {
    return (
      <TemplateHub
        hubType="sectors"
        title="Industry Sectors & Specialist Environments"
        subtitle="Specialized facilities management frameworks tailored to the operational demands and regulatory compliance of your industry."
        items={sectorsHubItems}
      />
    );
  }

  if (path === '/locations') {
    return (
      <TemplateHub
        hubType="locations"
        title="Regional Operations & City FM Hubs"
        subtitle="Direct mobile engineering fleets operating from regional depots across all primary commercial centres in the United Kingdom."
        items={locationsHubItems}
      />
    );
  }

  // Company & Contact Routes
  if (path === '/about-entire-facilities-management' || path === '/facilities-management-team' || path === '/best-facilities-management-company') {
    return <TemplateAbout />;
  }

  if (path === '/contact-us' || path === '/fm-support-n-contact' || path === '/fm-supply-form' || path === '/helpdesk-registration' || path === '/client-login' || path === '/client-login/account-registration') {
    return <TemplateContact />;
  }

  if (path === '/case-studies' || path === '/portfolio') {
    return <TemplateCaseStudy />;
  }

  if (path.startsWith('/post/') || path === '/what-is-facilities-management' || path === '/blog' || path === '/facilities-management-blog' || path === '/copy-of-what-is-facilities-manageme' || path === '/fm-support-n-contact/facilities-management-glossary') {
    return <TemplateArticle />;
  }

  // Fallback by Route Type for all remaining registered routes
  if (route.routeType === 'geographic-service') {
    return <TemplateLocalService />;
  }

  if (route.routeType === 'location') {
    return <TemplatePrimaryLocation />;
  }

  if (route.routeType === 'sector') {
    return <TemplateSector />;
  }

  if (route.routeType === 'service') {
    if (path.includes('cleaning') || path.includes('washing')) {
      return <TemplateSpecialistService />;
    }
    return <TemplateCoreService />;
  }

  // Default fallback to Homepage archetype
  return <TemplateHome />;
}
