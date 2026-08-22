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

  // ── Hard FM Services ───────────────────────────────────────────────────────

  '/mechanical-electrical': [
    { path: '/hvac-contractor', label: 'HVAC & Ventilation Contractor', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/hard-services', label: 'Hard Facilities Management', context: 'related-service' },
    { path: '/mechanical-electrical/emergency-light-testing', label: 'Emergency Light Testing', context: 'related-service' },
    { path: '/mechanical-electrical/access-control', label: 'Access Control Systems', context: 'related-service' },
    { path: '/plumbing-gas', label: 'Plumbing & Gas Services', context: 'related-service' },
  ],

  '/hvac-contractor': [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/hard-services', label: 'Hard Facilities Management', context: 'related-service' },
    { path: '/fire-emergency-systems', label: 'Fire & Emergency Systems', context: 'related-service' },
  ],

  '/ppm': [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services', context: 'related-service' },
    { path: '/hvac-contractor', label: 'HVAC & Ventilation Contractor', context: 'related-service' },
    { path: '/hard-services', label: 'Hard Facilities Management', context: 'related-service' },
    { path: '/building-maintenance', label: 'Building Maintenance', context: 'related-service' },
  ],

  '/hard-services': [
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical', context: 'related-service' },
    { path: '/hvac-contractor', label: 'HVAC Contractor', context: 'related-service' },
    { path: '/ppm', label: 'Planned Preventative Maintenance', context: 'related-service' },
    { path: '/fire-emergency-systems', label: 'Fire & Emergency Systems', context: 'related-service' },
    { path: '/plumbing-gas', label: 'Plumbing & Gas', context: 'related-service' },
    { path: '/soft-services', label: 'Soft FM Services', context: 'related-service' },
  ],

  '/soft-services': [
    { path: '/hard-services', label: 'Hard FM Services', context: 'related-service' },
    { path: '/cleaning-services', label: 'Commercial Cleaning Services', context: 'related-service' },
    { path: '/industrial-cleaning', label: 'Industrial Cleaning', context: 'related-service' },
    { path: '/security-services', label: 'Security Services', context: 'related-service' },
    { path: '/concierge-services', label: 'Concierge Services', context: 'related-service' },
  ],

  // ── London ─────────────────────────────────────────────────────────────────

  '/fm-london': [
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/london-facilities-management', label: 'London Facilities Management Company', context: 'related-location' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/industrial-cleaning-london', label: 'Industrial Cleaning London', context: 'related-service' },
    { path: '/contract-cleaning-london', label: 'Contract Cleaning London', context: 'related-service' },
    { path: '/london-facilities-management-areas', label: 'London Coverage Areas', context: 'related-location' },
  ],

  '/facilities-management-london': [
    { path: '/fm-london', label: 'FM London (24/7 Response)', context: 'related-location' },
    { path: '/london-facilities-management', label: 'London FM Company (Corporate)', context: 'related-location' },
    { path: '/commercial-cleaning-london', label: 'Commercial Cleaning London', context: 'related-service' },
    { path: '/mechanical-electrical', label: 'Mechanical & Electrical Services', context: 'related-service' },
  ],

  '/london-facilities-management': [
    { path: '/fm-london', label: 'FM London (24/7 Response)', context: 'related-location' },
    { path: '/facilities-management-london', label: 'Facilities Management London', context: 'related-location' },
    { path: '/office-cleaning-london', label: 'Office Cleaning London', context: 'related-service' },
    { path: '/hard-services', label: 'Hard FM Services', context: 'related-service' },
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
