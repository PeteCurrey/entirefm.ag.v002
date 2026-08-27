/**
 * INTERNAL LINKING INFRASTRUCTURE
 * =================================
 * Defines explicit, intentional internal links between routes.
 * DO NOT build an automated keyword-matching system.
 * All links must be declared explicitly.
 *
 * Structure: each route lists its related routes.
 * The application renders these as contextual navigation links.
 */

import { ALL_ROUTES, isKnownRoute } from '../routes/route-registry';

export interface InternalLink {
  path: string;
  label: string;
  context: 'related-service' | 'related-location' | 'related-sector' | 'breadcrumb';
}

/** Explicit internal linking map — intentional only */
const INTERNAL_LINK_MAP: Record<string, InternalLink[]> = {

  // ── Core Hubs ──────────────────────────────────────────────────────────────

  '/': [
    { path: '/services', label: 'Facilities Management Services', context: 'related-service' },
    { path: '/facilities-management-london', label: 'Facilities Management London Operations', context: 'related-location' },
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Engineering', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/locations', label: 'UK Service Locations', context: 'related-location' },
  ],

  '/locations': [
    { path: '/facilities-management-london', label: 'Facilities Management London (Flagship)', context: 'related-location' },
    { path: '/facilities-management-manchester', label: 'Facilities Management Manchester', context: 'related-location' },
    { path: '/facilities-management-birmingham', label: 'Facilities Management Birmingham', context: 'related-location' },
    { path: '/facilities-management-leeds', label: 'Facilities Management Leeds', context: 'related-location' },
    { path: '/facilities-management-sheffield', label: 'Facilities Management Sheffield', context: 'related-location' },
  ],

  '/services': [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/hard-services', label: 'Hard Facilities Management', context: 'related-service' },
    { path: '/soft-services', label: 'Soft Facilities Management', context: 'related-service' },
    { path: '/facilities-management-london', label: 'London FM Operations', context: 'related-location' },
  ],

  '/commercial-facilities-management': [
    { path: '/facilities-management-london', label: 'Commercial FM in London', context: 'related-location' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/mechanical-electrical', label: 'M&E Engineering', context: 'related-service' },
    { path: '/hard-services', label: 'Hard FM Services', context: 'related-service' },
  ],

  // ── Hard FM Services ───────────────────────────────────────────────────────

  '/mechanical-electrical': [
    { path: '/hvac-contractor', label: 'HVAC & Ventilation Contractor', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/hard-services', label: 'Hard Facilities Management', context: 'related-service' },
    { path: '/facilities-management-london', label: 'London Facilities Management', context: 'related-location' },
    { path: '/mechanical-electrical/emergency-light-testing', label: 'Emergency Light Testing', context: 'related-service' },
    { path: '/mechanical-electrical/access-control', label: 'Access Control Systems', context: 'related-service' },
    { path: '/plumbing-gas', label: 'Plumbing & Gas Services', context: 'related-service' },
  ],

  '/hvac-contractor': [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/hard-services', label: 'Hard Facilities Management', context: 'related-service' },
    { path: '/facilities-management-london', label: 'Facilities Management London Operations', context: 'related-location' },
    { path: '/fire-emergency-systems', label: 'Fire & Emergency Systems', context: 'related-service' },
  ],

  '/ppm': [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services', context: 'related-service' },
    { path: '/hvac-contractor', label: 'HVAC & Ventilation Contractor', context: 'related-service' },
    { path: '/hard-services', label: 'Hard Facilities Management', context: 'related-service' },
    { path: '/facilities-management-london', label: 'Facilities Management Services across London', context: 'related-location' },
    { path: '/building-maintenance', label: 'Building Maintenance', context: 'related-service' },
  ],

  '/hard-services': [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical', context: 'related-service' },
    { path: '/hvac-contractor', label: 'HVAC Contractor', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/fire-emergency-systems', label: 'Fire & Emergency Systems', context: 'related-service' },
    { path: '/plumbing-gas', label: 'Plumbing & Gas', context: 'related-service' },
    { path: '/soft-services', label: 'Soft FM Services', context: 'related-service' },
  ],

  '/soft-services': [
    { path: '/hard-services', label: 'Hard FM Services', context: 'related-service' },
    { path: '/cleaning-services', label: 'Commercial Cleaning Services', context: 'related-service' },
    { path: '/facilities-management-london', label: 'Commercial FM in London', context: 'related-location' },
    { path: '/industrial-cleaning', label: 'Industrial Cleaning', context: 'related-service' },
    { path: '/security-services', label: 'Security Services', context: 'related-service' },
    { path: '/concierge-services', label: 'Concierge Services', context: 'related-service' },
  ],

  // ── London Primary Cluster & Technical Disciplines ─────────────────────────

  '/facilities-management-london': [
    { path: '/facilities-management-services-london', label: 'Facilities Management Services London', context: 'related-service' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
    { path: '/soft-facilities-management-london', label: 'Soft Facilities Management London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'Mechanical & Electrical Maintenance London', context: 'related-service' },
    { path: '/hvac-london', label: 'Commercial HVAC & Air Conditioning London', context: 'related-service' },
    { path: '/reactive-maintenance-london', label: '24/7 Reactive Maintenance London', context: 'related-service' },
    { path: '/commercial-building-maintenance-london', label: 'Commercial Building Maintenance London', context: 'related-service' },
    { path: '/commercial-electrical-maintenance-london', label: 'Commercial Electrical Maintenance London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/fm-london', label: 'Outsourced FM London (Single-Source Contracts)', context: 'related-location' },
    { path: '/london-facilities-management', label: 'Multi-Site Estate Facilities Management London', context: 'related-location' },
    { path: '/london-facilities-management-areas', label: 'London FM Coverage Areas', context: 'related-location' },
  ],

  '/facilities-management-services-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London (Flagship)', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
    { path: '/soft-facilities-management-london', label: 'Soft Facilities Management London', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'M&E Engineering Maintenance London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
    { path: '/hvac-london', label: 'Commercial HVAC & Air Conditioning London', context: 'related-service' },
    { path: '/reactive-maintenance-london', label: '24/7 Reactive Repairs London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning Services London', context: 'related-service' },
    { path: '/commercial-building-maintenance-london', label: 'Commercial Building Maintenance London', context: 'related-service' },
    { path: '/commercial-electrical-maintenance-london', label: 'Commercial Electrical Maintenance London', context: 'related-service' },
  ],

  '/hard-facilities-management-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London Hub', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'London FM Services Directory', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'Mechanical & Electrical London', context: 'related-service' },
    { path: '/hvac-london', label: 'Commercial HVAC London', context: 'related-service' },
    { path: '/commercial-electrical-maintenance-london', label: 'Commercial Electrical Maintenance London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
    { path: '/reactive-maintenance-london', label: '24/7 Reactive Maintenance London', context: 'related-service' },
    { path: '/bms-maintenance-london', label: 'BMS Maintenance London', context: 'related-service' },
  ],

  '/soft-facilities-management-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London Hub', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'London FM Services Directory', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/office-cleaning-london', label: 'Corporate Office Cleaning London', context: 'related-service' },
    { path: '/contract-cleaning-london', label: 'Contract Cleaning London', context: 'related-service' },
    { path: '/industrial-cleaning-london', label: 'Industrial Cleaning London', context: 'related-service' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
  ],

  '/mechanical-electrical-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London (Flagship)', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard FM London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
    { path: '/hvac-london', label: 'Commercial HVAC London', context: 'related-service' },
    { path: '/commercial-electrical-maintenance-london', label: 'Commercial Electrical Maintenance London', context: 'related-service' },
    { path: '/commercial-plumbing-london', label: 'Commercial Plumbing London', context: 'related-service' },
    { path: '/bms-maintenance-london', label: 'BMS Maintenance London', context: 'related-service' },
  ],

  '/ppm-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'Mechanical & Electrical London', context: 'related-service' },
    { path: '/hvac-london', label: 'Commercial HVAC London', context: 'related-service' },
    { path: '/commercial-eicr-testing-london', label: 'Commercial EICR Testing London', context: 'related-service' },
    { path: '/fire-emergency-systems-london', label: 'Fire & Emergency Systems London', context: 'related-service' },
    { path: '/commercial-water-hygiene-london', label: 'Commercial Water Hygiene London', context: 'related-service' },
  ],

  '/hvac-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'M&E Maintenance London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Maintenance London', context: 'related-service' },
    { path: '/bms-maintenance-london', label: 'BMS Controls & HVAC Optimisation', context: 'related-service' },
    { path: '/reactive-maintenance-london', label: '24/7 HVAC Emergency Repairs', context: 'related-service' },
  ],

  '/commercial-electrical-maintenance-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard FM London', context: 'related-service' },
    { path: '/commercial-eicr-testing-london', label: 'Commercial EICR & Fixed Wire Testing', context: 'related-service' },
    { path: '/fire-emergency-systems-london', label: 'Emergency Lighting & Fire Alarms', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Maintenance London', context: 'related-service' },
    { path: '/reactive-maintenance-london', label: '24/7 Emergency Electrical Repairs', context: 'related-service' },
  ],

  '/commercial-building-maintenance-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
    { path: '/reactive-maintenance-london', label: '24/7 Reactive Maintenance London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
    { path: '/london-facilities-management', label: 'Multi-Site Commercial Estates London', context: 'related-location' },
  ],

  '/reactive-maintenance-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London (Flagship)', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'M&E Maintenance London', context: 'related-service' },
    { path: '/hvac-london', label: 'Commercial HVAC London', context: 'related-service' },
    { path: '/commercial-electrical-maintenance-london', label: 'Emergency Electrical Repairs London', context: 'related-service' },
    { path: '/commercial-plumbing-london', label: 'Emergency Plumbing London', context: 'related-service' },
  ],

  '/commercial-eicr-testing-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/commercial-electrical-maintenance-london', label: 'Commercial Electrical Maintenance London', context: 'related-service' },
    { path: '/hard-facilities-management-london', label: 'Hard FM London', context: 'related-service' },
    { path: '/fire-emergency-systems-london', label: 'Fire & Emergency Systems London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
  ],

  '/fire-emergency-systems-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard Facilities Management London', context: 'related-service' },
    { path: '/commercial-electrical-maintenance-london', label: 'Commercial Electrical Maintenance London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
  ],

  '/commercial-water-hygiene-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard FM London', context: 'related-service' },
    { path: '/commercial-plumbing-london', label: 'Commercial Plumbing London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
  ],

  '/commercial-plumbing-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard FM London', context: 'related-service' },
    { path: '/commercial-water-hygiene-london', label: 'Commercial Water Hygiene & Legionella', context: 'related-service' },
    { path: '/reactive-maintenance-london', label: '24/7 Emergency Plumbing London', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'Mechanical & Electrical London', context: 'related-service' },
  ],

  '/bms-maintenance-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/hard-facilities-management-london', label: 'Hard FM London', context: 'related-service' },
    { path: '/hvac-london', label: 'Commercial HVAC London', context: 'related-service' },
    { path: '/mechanical-electrical-london', label: 'Mechanical & Electrical London', context: 'related-service' },
    { path: '/ppm-london', label: 'Planned Preventative Maintenance London', context: 'related-service' },
  ],

  '/fm-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London (Flagship)', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'Facilities Management Services London', context: 'related-service' },
    { path: '/london-facilities-management', label: 'London Facilities Management for Multi-Site Estates', context: 'related-location' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/industrial-cleaning-london', label: 'Industrial Cleaning London', context: 'related-service' },
    { path: '/contract-cleaning-london', label: 'Contract Cleaning London', context: 'related-service' },
    { path: '/london-facilities-management-areas', label: 'London Coverage Areas', context: 'related-location' },
  ],

  '/london-facilities-management': [
    { path: '/facilities-management-london', label: 'Facilities Management London Operations', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'London FM Services Directory', context: 'related-service' },
    { path: '/fm-london', label: 'Outsourced FM London (Single-Source Contracts)', context: 'related-location' },
    { path: '/office-cleaning-london', label: 'Office Cleaning London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/commercial-building-maintenance-london', label: 'Commercial Building Maintenance London', context: 'related-service' },
    { path: '/hard-facilities-management-london', label: 'Hard FM Services London', context: 'related-service' },
  ],

  '/london-facilities-management-areas': [
    { path: '/facilities-management-london', label: 'Facilities Management London Hub', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'London FM Services', context: 'related-service' },
    { path: '/fm-london', label: 'Outsourced FM London', context: 'related-location' },
    { path: '/london-facilities-management', label: 'London Estate Facilities Management', context: 'related-location' },
  ],

  '/commercial-cleaning-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'London FM Services', context: 'related-service' },
    { path: '/soft-facilities-management-london', label: 'Soft Facilities Management London', context: 'related-service' },
    { path: '/contract-cleaning-london', label: 'Contract Cleaning London', context: 'related-service' },
    { path: '/office-cleaning-london', label: 'Office Cleaning London', context: 'related-service' },
    { path: '/industrial-cleaning-london', label: 'Industrial Cleaning London', context: 'related-service' },
  ],

  '/contract-cleaning-london': [
    { path: '/facilities-management-london', label: 'London Facilities Management', context: 'related-location' },
    { path: '/soft-facilities-management-london', label: 'Soft FM London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/office-cleaning-london', label: 'Office Cleaning London', context: 'related-service' },
  ],

  '/office-cleaning-london': [
    { path: '/facilities-management-london', label: 'Commercial FM in London', context: 'related-location' },
    { path: '/soft-facilities-management-london', label: 'Soft FM London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/contract-cleaning-london', label: 'Contract Cleaning London', context: 'related-service' },
  ],

  '/industrial-cleaning-london': [
    { path: '/facilities-management-london', label: 'Facilities Management Services across London', context: 'related-location' },
    { path: '/soft-facilities-management-london', label: 'Soft FM London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/industrial-cleaning', label: 'National Industrial Cleaning', context: 'related-service' },
  ],

  '/external-cleaning-london': [
    { path: '/facilities-management-london', label: 'London Facilities Management Operations', context: 'related-location' },
    { path: '/soft-facilities-management-london', label: 'Soft FM London', context: 'related-service' },
    { path: '/pressure-washing-london', label: 'Pressure Washing London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
  ],

  '/pressure-washing-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/soft-facilities-management-london', label: 'Soft FM London', context: 'related-service' },
    { path: '/external-cleaning-london', label: 'External Cleaning London', context: 'related-service' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
  ],

  '/locations/london': [
    { path: '/facilities-management-london', label: 'Facilities Management London (Flagship)', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'London FM Services Directory', context: 'related-service' },
    { path: '/fm-london', label: 'Outsourced FM London', context: 'related-location' },
    { path: '/london-facilities-management', label: 'London FM (Multi-Site Estates)', context: 'related-location' },
    { path: '/locations/london/services', label: 'London Regional Services', context: 'related-service' },
  ],

  '/locations/london/services': [
    { path: '/facilities-management-london', label: 'Facilities Management London (Flagship)', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'Facilities Management Services London', context: 'related-service' },
    { path: '/hard-facilities-management-london', label: 'Hard FM Services London', context: 'related-service' },
    { path: '/soft-facilities-management-london', label: 'Soft FM Services London', context: 'related-service' },
  ],

  '/facilities-management-glossary-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/facilities-management-services-london', label: 'London FM Services', context: 'related-service' },
    { path: '/hard-facilities-management-london', label: 'Hard FM London', context: 'related-service' },
  ],

  // ── Manchester ─────────────────────────────────────────────────────────────

  '/facilities-management-manchester': [
    { path: '/fm-manchester', label: 'FM Manchester', context: 'related-location' },
    { path: '/commercial-cleaning-manchester', label: 'Commercial Cleaning Manchester', context: 'related-service' },
    { path: '/industrial-cleaning-manchester', label: 'Industrial Cleaning Manchester', context: 'related-service' },
    { path: '/contract-cleaning-manchester', label: 'Contract Cleaning Manchester', context: 'related-service' },
  ],

  '/fm-manchester': [
    { path: '/facilities-management-manchester', label: 'Facilities Management Manchester', context: 'related-location' },
    { path: '/manchester-office-cleaning', label: 'Office Cleaning Manchester', context: 'related-service' },
  ],

  // ── Birmingham ─────────────────────────────────────────────────────────────

  '/facilities-management-birmingham': [
    { path: '/fm-birmingham', label: 'FM Birmingham', context: 'related-location' },
    { path: '/commercial-cleaning-birmingham', label: 'Commercial Cleaning Birmingham', context: 'related-service' },
    { path: '/industrial-cleaning-birmingham', label: 'Industrial Cleaning Birmingham', context: 'related-service' },
    { path: '/birmingham-facilities-management', label: 'Birmingham Facilities Management', context: 'related-location' },
  ],

  // ── Lincoln ────────────────────────────────────────────────────────────────

  '/facilities-management-lincoln': [
    { path: '/fm-lincoln', label: 'FM Lincoln', context: 'related-location' },
    { path: '/lincoln-facilities-management', label: 'Lincoln Facilities Management', context: 'related-location' },
    { path: '/commercial-cleaning-lincoln', label: 'Commercial Cleaning Lincoln', context: 'related-service' },
    { path: '/industrial-cleaning-lincoln', label: 'Industrial Cleaning Lincoln', context: 'related-service' },
    { path: '/commercial-fm-lincoln', label: 'Commercial FM Lincoln', context: 'related-sector' },
    { path: '/lincoln-facilities-management-areas', label: 'Lincoln Coverage Areas', context: 'related-location' },
  ],

  // ── Industrial Cleaning ────────────────────────────────────────────────────

  '/industrial-cleaning': [
    { path: '/industrial-cleaning-london', label: 'Industrial Cleaning London', context: 'related-location' },
    { path: '/industrial-cleaning-manchester', label: 'Industrial Cleaning Manchester', context: 'related-location' },
    { path: '/industrial-cleaning-birmingham', label: 'Industrial Cleaning Birmingham', context: 'related-location' },
    { path: '/industrial-cleaning-sheffield', label: 'Industrial Cleaning Sheffield', context: 'related-location' },
    { path: '/industrial-cleaning-leeds', label: 'Industrial Cleaning Leeds', context: 'related-location' },
    { path: '/industrial-cleaning-lincoln', label: 'Industrial Cleaning Lincoln', context: 'related-location' },
    { path: '/industrial-cleaning-nottingham', label: 'Industrial Cleaning Nottingham', context: 'related-location' },
    { path: '/cleaning-services', label: 'Commercial Cleaning Services', context: 'related-service' },
    { path: '/industrial-facilities-management', label: 'Industrial Facilities Management', context: 'related-sector' },
  ],

};

/**
 * Get intentional internal links for a given path.
 * Only returns links whose target paths are registered routes.
 */
export function getInternalLinks(path: string): InternalLink[] {
  const links = INTERNAL_LINK_MAP[path] ?? [];
  // Validate that all linked paths are known routes
  return links.filter(link => isKnownRoute(link.path));
}

/**
 * Validate all entries in the internal link map.
 * Returns any links pointing to unknown routes.
 */
export function validateInternalLinks(): Array<{ from: string; to: string }> {
  const broken: Array<{ from: string; to: string }> = [];
  for (const [from, links] of Object.entries(INTERNAL_LINK_MAP)) {
    for (const link of links) {
      if (!isKnownRoute(link.path)) {
        broken.push({ from, to: link.path });
      }
    }
  }
  return broken;
}

/**
 * Convenience: get all routes that link TO a given path.
 */
export function getInboundLinks(targetPath: string): string[] {
  const inbound: string[] = [];
  for (const [fromPath, links] of Object.entries(INTERNAL_LINK_MAP)) {
    if (links.some(l => l.path === targetPath)) {
      inbound.push(fromPath);
    }
  }
  return inbound;
}

/** Total number of explicitly defined internal links */
export const TOTAL_INTERNAL_LINKS = Object.values(INTERNAL_LINK_MAP).reduce(
  (sum, links) => sum + links.length,
  0
);

/** Routes that have no internal links defined yet */
export function getUnlinkedRoutes(): string[] {
  const allPaths = ALL_ROUTES.map(r => r.path);
  return allPaths.filter(p => !INTERNAL_LINK_MAP[p] || INTERNAL_LINK_MAP[p].length === 0);
}
