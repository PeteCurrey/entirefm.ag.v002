/**
 * ENTIREFM SUPPLY CHAIN DETERMINISTIC GAP ENGINE
 * ===============================================
 * Analyzes active verified supplier coverage against defined Coverage Targets
 * to detect coverage deficits, single-supplier concentration risks, and 24/7 voids.
 * STRICTLY DETERMINISTIC: Zero artificial AI hallucinations or made-up scores.
 */

import {
  SupplierOrganisationRecord,
  CoverageTarget,
  SupplyChainGapAlert,
} from './types';

export const DEFAULT_COVERAGE_TARGETS: CoverageTarget[] = [
  { id: 'tgt-lon-hvac', service_slug: 'hvac', service_name: 'HVAC & Chillers', region_or_city: 'London', min_approved_suppliers: 5, min_preferred_suppliers: 2, min_emergency_24_7_suppliers: 2 },
  { id: 'tgt-lon-elec', service_slug: 'electrical', service_name: 'Electrical Systems', region_or_city: 'London', min_approved_suppliers: 6, min_preferred_suppliers: 2, min_emergency_24_7_suppliers: 3 },
  { id: 'tgt-lon-fire', service_slug: 'fire-life-safety', service_name: 'Fire & Life Safety', region_or_city: 'London', min_approved_suppliers: 4, min_preferred_suppliers: 2, min_emergency_24_7_suppliers: 2 },
  { id: 'tgt-lon-drain', service_slug: 'drainage', service_name: 'Commercial Drainage', region_or_city: 'London', min_approved_suppliers: 4, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 2 },
  { id: 'tgt-lon-rope', service_slug: 'rope-access', service_name: 'Specialist Rope Access', region_or_city: 'London', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 1 },

  { id: 'tgt-mcr-hvac', service_slug: 'hvac', service_name: 'HVAC & Chillers', region_or_city: 'Manchester', min_approved_suppliers: 4, min_preferred_suppliers: 2, min_emergency_24_7_suppliers: 2 },
  { id: 'tgt-mcr-elec', service_slug: 'electrical', service_name: 'Electrical Systems', region_or_city: 'Manchester', min_approved_suppliers: 4, min_preferred_suppliers: 2, min_emergency_24_7_suppliers: 2 },
  { id: 'tgt-mcr-fire', service_slug: 'fire-life-safety', service_name: 'Fire & Life Safety', region_or_city: 'Manchester', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 1 },
  { id: 'tgt-mcr-drain', service_slug: 'drainage', service_name: 'Commercial Drainage', region_or_city: 'Manchester', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 2 },

  { id: 'tgt-bhm-hvac', service_slug: 'hvac', service_name: 'HVAC & Chillers', region_or_city: 'Birmingham', min_approved_suppliers: 4, min_preferred_suppliers: 2, min_emergency_24_7_suppliers: 2 },
  { id: 'tgt-bhm-elec', service_slug: 'electrical', service_name: 'Electrical Systems', region_or_city: 'Birmingham', min_approved_suppliers: 4, min_preferred_suppliers: 2, min_emergency_24_7_suppliers: 2 },
  { id: 'tgt-bhm-drain', service_slug: 'drainage', service_name: 'Commercial Drainage', region_or_city: 'Birmingham', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 2 },

  { id: 'tgt-lds-hvac', service_slug: 'hvac', service_name: 'HVAC & Chillers', region_or_city: 'Leeds', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 1 },
  { id: 'tgt-lds-drain', service_slug: 'drainage', service_name: 'Commercial Drainage', region_or_city: 'Leeds', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 1 },
  { id: 'tgt-lds-elec', service_slug: 'electrical', service_name: 'Electrical Systems', region_or_city: 'Leeds', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 1 },

  { id: 'tgt-shf-hvac', service_slug: 'hvac', service_name: 'HVAC & Chillers', region_or_city: 'Sheffield', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 1 },
  { id: 'tgt-shf-elec', service_slug: 'electrical', service_name: 'Electrical Systems', region_or_city: 'Sheffield', min_approved_suppliers: 3, min_preferred_suppliers: 1, min_emergency_24_7_suppliers: 1 },
];

/**
 * Calculates supply chain gap alerts comparing suppliers against targets
 */
export function computeSupplyChainGaps(
  suppliers: SupplierOrganisationRecord[],
  targets: CoverageTarget[] = DEFAULT_COVERAGE_TARGETS
): SupplyChainGapAlert[] {
  const alerts: SupplyChainGapAlert[] = [];
  const now = new Date().toISOString();

  for (const target of targets) {
    // Filter matching suppliers who are APPROVED or PREFERRED or STRATEGIC
    const matchingSuppliers = suppliers.filter((s) => {
      const isApprovedTier =
        s.relationship_level === 'APPROVED_SUPPLIER' ||
        s.relationship_level === 'PREFERRED_SUPPLIER' ||
        s.relationship_level === 'STRATEGIC_PARTNER';

      if (!isApprovedTier) return false;

      // Check service match
      const hasService = s.services.some(
        (srv) =>
          srv.service_slug === target.service_slug ||
          srv.service_name.toLowerCase().includes(target.service_name.toLowerCase())
      );
      if (!hasService) return false;

      // Check geographic match (City, Region, or National coverage)
      const hasCoverage =
        s.is_national ||
        s.coverage.some(
          (c) =>
            c.is_active &&
            (c.boundary_value.toLowerCase() === target.region_or_city.toLowerCase() ||
              c.boundary_value.toLowerCase().includes(target.region_or_city.toLowerCase()) ||
              (c.coverage_type === 'REGION' && target.region_or_city === 'London' && c.boundary_value === 'London'))
        );

      return hasCoverage;
    });

    const approvedCount = matchingSuppliers.length;
    const preferredCount = matchingSuppliers.filter(
      (s) => s.relationship_level === 'PREFERRED_SUPPLIER' || s.relationship_level === 'STRATEGIC_PARTNER'
    ).length;
    const emergencyCount = matchingSuppliers.filter(
      (s) => s.emergency_24_7 || s.coverage.some((c) => c.emergency_24_7 && c.is_active)
    ).length;

    // Check 1: Absolute Zero Approved Suppliers
    if (approvedCount === 0) {
      alerts.push({
        id: `gap-${target.service_slug}-${target.region_or_city.toLowerCase().replace(/\s+/g, '-')}-zero`,
        gap_type: 'NO_APPROVED_SUPPLIER',
        service_name: target.service_name,
        service_slug: target.service_slug,
        location: target.region_or_city,
        severity: 'CRITICAL',
        description: `Zero approved suppliers recorded for ${target.service_name} in ${target.region_or_city}. Immediate recruitment target required.`,
        approved_count: 0,
        preferred_count: 0,
        emergency_count: 0,
        target_approved: target.min_approved_suppliers,
        identified_at: now,
      });
      continue;
    }

    // Check 2: Single-Supplier Dependency (High Operational Vulnerability)
    if (approvedCount === 1 && target.min_approved_suppliers > 1) {
      alerts.push({
        id: `gap-${target.service_slug}-${target.region_or_city.toLowerCase().replace(/\s+/g, '-')}-single`,
        gap_type: 'SINGLE_SUPPLIER_DEPENDENCY',
        service_name: target.service_name,
        service_slug: target.service_slug,
        location: target.region_or_city,
        severity: 'HIGH',
        description: `Single-supplier dependency: 100% of ${target.service_name} capability in ${target.region_or_city} relies on a single provider.`,
        approved_count: 1,
        preferred_count: preferredCount,
        emergency_count: emergencyCount,
        target_approved: target.min_approved_suppliers,
        identified_at: now,
      });
    }

    // Check 3: 24/7 Emergency Coverage Void
    if (emergencyCount < target.min_emergency_24_7_suppliers) {
      alerts.push({
        id: `gap-${target.service_slug}-${target.region_or_city.toLowerCase().replace(/\s+/g, '-')}-emergency`,
        gap_type: 'NO_24_7_COVERAGE',
        service_name: target.service_name,
        service_slug: target.service_slug,
        location: target.region_or_city,
        severity: emergencyCount === 0 ? 'HIGH' : 'MEDIUM',
        description: `Insufficient 24/7 emergency response for ${target.service_name} in ${target.region_or_city} (${emergencyCount}/${target.min_emergency_24_7_suppliers} required).`,
        approved_count: approvedCount,
        preferred_count: preferredCount,
        emergency_count: emergencyCount,
        target_approved: target.min_approved_suppliers,
        identified_at: now,
      });
    }

    // Check 4: No Preferred Strategic Partner
    if (preferredCount < target.min_preferred_suppliers && approvedCount >= target.min_approved_suppliers) {
      alerts.push({
        id: `gap-${target.service_slug}-${target.region_or_city.toLowerCase().replace(/\s+/g, '-')}-pref`,
        gap_type: 'NO_PREFERRED_PARTNER',
        service_name: target.service_name,
        service_slug: target.service_slug,
        location: target.region_or_city,
        severity: 'LOW',
        description: `Coverage target met (${approvedCount} approved), but no Preferred/Strategic Partner established for ${target.service_name} in ${target.region_or_city}.`,
        approved_count: approvedCount,
        preferred_count: preferredCount,
        emergency_count: emergencyCount,
        target_approved: target.min_approved_suppliers,
        identified_at: now,
      });
    }

    // Check 5: General Coverage Deficit
    if (approvedCount > 1 && approvedCount < target.min_approved_suppliers) {
      alerts.push({
        id: `gap-${target.service_slug}-${target.region_or_city.toLowerCase().replace(/\s+/g, '-')}-deficit`,
        gap_type: 'COVERAGE_DEFICIT',
        service_name: target.service_name,
        service_slug: target.service_slug,
        location: target.region_or_city,
        severity: 'MEDIUM',
        description: `Capacity deficit for ${target.service_name} in ${target.region_or_city}: ${approvedCount}/${target.min_approved_suppliers} approved partners.`,
        approved_count: approvedCount,
        preferred_count: preferredCount,
        emergency_count: emergencyCount,
        target_approved: target.min_approved_suppliers,
        identified_at: now,
      });
    }
  }

  return alerts;
}
