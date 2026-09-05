/**
 * PRE-LIVE READ-ONLY AUDIT: CONTRACTOR MATCHING READINESS & BLAST RADIUS
 * ======================================================================
 * Audits existing contractor organisations in the database to assess the
 * blast radius of flipping fail-closed matching gates.
 *
 * Checks:
 *   - Trade capability on file (primary_trade / trades)
 *   - Operating depot existence (provider_locations rows)
 *   - Geocode status (latitude / longitude presence on depots)
 *   - Geographic coverage scope (is_national / coverage_areas / coverage_radius_miles)
 *   - Emergency 24/7 capability flag
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/audit-contractor-matching-readiness.ts
 */

import { dbQuery, isDbConfigured } from '../src/server/db/client';

interface AuditItem {
  id: string;
  name: string;
  code: string;
  has_trade: boolean;
  trades_summary: string;
  has_depot: boolean;
  has_coordinates: boolean;
  depot_postcode: string;
  is_national: boolean;
  coverage_radius_miles: number;
  coverage_areas_count: number;
  emergency_24_7: boolean;
  readiness_status: 'READY' | 'AT_RISK_TRADE' | 'AT_RISK_GEO' | 'CRITICAL_INCOMPLETE';
  risk_reasons: string[];
}

async function runAudit() {
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM — CONTRACTOR MATCHING READINESS & BLAST RADIUS AUDIT');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  if (!isDbConfigured()) {
    console.warn('⚠️  Database credentials not configured in environment. Exiting.');
    return;
  }

  // 1. Fetch live tables in parallel
  const [
    { data: contractors, error: errOrgs },
    { data: provOrgs, error: errProvs },
    { data: locations, error: errLocs },
    { data: coverageAreas, error: errCov },
  ] = await Promise.all([
    dbQuery<any[]>('organisations?org_type=in.(CONTRACTOR,SUPPLIER)&status=eq.ACTIVE&select=*&order=name.asc'),
    dbQuery<any[]>('provider_organisations?select=*'),
    dbQuery<any[]>('provider_locations?select=*'),
    dbQuery<any[]>('coverage_areas?is_active=eq.true&select=*'),
  ]);

  if (errOrgs) {
    console.error('❌ Failed to fetch organisations:', errOrgs);
    return;
  }

  const rawContractors = contractors || [];
  const rawProvs = provOrgs || [];
  const rawLocs = locations || [];
  const rawCoverage = coverageAreas || [];

  console.log(`Auditing ${rawContractors.length} active contractor organisations...\n`);

  // Index ancillary records by org ID
  const provByOrgId = new Map<string, any>();
  for (const p of rawProvs) {
    provByOrgId.set(p.organisation_id, p);
  }

  const locsByOrgId = new Map<string, any[]>();
  for (const l of rawLocs) {
    const list = locsByOrgId.get(l.provider_org_id) || [];
    list.push(l);
    locsByOrgId.set(l.provider_org_id, list);
  }

  const covByOrgId = new Map<string, any[]>();
  for (const c of rawCoverage) {
    const list = covByOrgId.get(c.provider_org_id) || [];
    list.push(c);
    covByOrgId.set(c.provider_org_id, list);
  }

  const auditResults: AuditItem[] = [];

  for (const c of rawContractors) {
    const prov = provByOrgId.get(c.id);
    const orgLocs = locsByOrgId.get(c.id) || [];
    const orgCov = covByOrgId.get(c.id) || [];

    // Trades evaluation
    const trades: string[] = [];
    if (prov?.primary_trade) trades.push(prov.primary_trade);
    if (Array.isArray(c.trades)) trades.push(...c.trades);
    if (Array.isArray(c.settings?.trades)) trades.push(...c.settings.trades);
    if (Array.isArray(c.subcontractor_trades)) trades.push(...c.subcontractor_trades);
    const uniqueTrades = Array.from(new Set(trades.filter(Boolean)));
    const hasTrade = uniqueTrades.length > 0;

    // Depots & Coordinates
    const hasDepot = orgLocs.length > 0;
    const hasCoords = orgLocs.some((l) => l.latitude != null && l.longitude != null);
    const depotPostcode = orgLocs[0]?.postcode || c.address_json?.postcode || 'NONE';

    // Coverage scope
    const isNational = Boolean(c.settings?.is_national || prov?.is_national);
    const coverageRadius = prov?.coverage_radius_miles ?? 25;
    const coverageCount = orgCov.length;

    // Emergency capability
    const emergency247 = Boolean(
      prov?.emergency_24_7_capable ||
      c.settings?.emergency_24_7 ||
      orgLocs.some((l) => l.emergency_available)
    );

    // Blast radius classification
    const riskReasons: string[] = [];
    if (!hasTrade) {
      riskReasons.push('No registered trade discipline');
    }
    if (!hasDepot) {
      riskReasons.push('No provider_locations depot record');
    } else if (!hasCoords) {
      riskReasons.push('Depot has no geocoded latitude/longitude');
    }
    if (!isNational && coverageCount === 0 && !hasDepot) {
      riskReasons.push('No geographic coverage or depot coordinates');
    }

    let status: AuditItem['readiness_status'] = 'READY';
    if (!hasTrade && (!hasDepot || !hasCoords)) {
      status = 'CRITICAL_INCOMPLETE';
    } else if (!hasTrade) {
      status = 'AT_RISK_TRADE';
    } else if (!hasDepot || !hasCoords) {
      status = 'AT_RISK_GEO';
    }

    auditResults.push({
      id: c.id,
      name: c.name,
      code: c.code || 'NO-CODE',
      has_trade: hasTrade,
      trades_summary: uniqueTrades.join(', ') || 'NONE',
      has_depot: hasDepot,
      has_coordinates: hasCoords,
      depot_postcode: depotPostcode,
      is_national: isNational,
      coverage_radius_miles: coverageRadius,
      coverage_areas_count: coverageCount,
      emergency_24_7: emergency247,
      readiness_status: status,
      risk_reasons: riskReasons,
    });
  }

  // Summary aggregation
  const total = auditResults.length;
  const readyCount = auditResults.filter((r) => r.readiness_status === 'READY').length;
  const atRiskTrade = auditResults.filter((r) => r.readiness_status === 'AT_RISK_TRADE').length;
  const atRiskGeo = auditResults.filter((r) => r.readiness_status === 'AT_RISK_GEO').length;
  const critical = auditResults.filter((r) => r.readiness_status === 'CRITICAL_INCOMPLETE').length;

  console.log('───────────────────────────────────────────────────────────────────');
  console.log('  EXECUTIVE SUMMARY: BLAST RADIUS ASSESSMENT');
  console.log('───────────────────────────────────────────────────────────────────');
  console.log(`  Total Active Contractors:          ${total}`);
  console.log(`  ✅ Ready for Matching:             ${readyCount} (${total > 0 ? ((readyCount / total) * 100).toFixed(1) : 0}%)`);
  console.log(`  ⚠️  At Risk (Missing Trade Only):   ${atRiskTrade}`);
  console.log(`  ⚠️  At Risk (Missing Depot/Coords): ${atRiskGeo}`);
  console.log(`  ❌ Critical / Multiple Deficits:   ${critical}`);
  console.log('───────────────────────────────────────────────────────────────────\n');

  if (critical > 0 || atRiskTrade > 0 || atRiskGeo > 0) {
    console.log('🚨 CONTRACTORS REQUIRING DATA REMEDIATION BEFORE FAIL-CLOSED:');
    for (const r of auditResults) {
      if (r.readiness_status !== 'READY') {
        console.log(`  - [${r.code}] ${r.name}`);
        console.log(`    Status: ${r.readiness_status}`);
        console.log(`    Reasons: ${r.risk_reasons.join('; ')}`);
        console.log(`    Depot: ${r.depot_postcode}, Trades: ${r.trades_summary}\n`);
      }
    }
  } else {
    console.log('✨ All active contractors have complete trade and location profiles.\n');
  }
}

runAudit().catch((err) => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
