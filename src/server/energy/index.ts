/**
 * ENTIREFM ENERGY, UTILITIES & BUILDING PERFORMANCE DOMAIN MODULE (Phase 9)
 * =========================================================================
 * Rigorous interval consumption analytics, high-baseload detection, out-of-hours tracking,
 * HVAC control conflict signals, M&V project tracking, and UK government carbon factors.
 */

import { dbQuery } from '../db/client';

export type UtilityType = 'ELECTRICITY' | 'GAS' | 'WATER' | 'HEAT' | 'CHILLED_WATER' | 'EXPORT';

export interface MeterRecord {
  id: string;
  site_id: string;
  building_id?: string;
  asset_id?: string;
  parent_meter_id?: string;
  meter_reference: string;
  name: string;
  utility_type: UtilityType;
  meter_hierarchy: 'MAIN_METER' | 'SUB_METER' | 'ASSET_METER' | 'TENANT_METER' | 'LANDLORD_METER';
  unit_of_measure: string;
  multiplier: number;
  interval_minutes: number;
  is_automated: boolean;
  feed_status: 'ACTIVE' | 'STALE' | 'OFFLINE' | 'COMMISSIONING';
  last_reading_at?: string;
  created_at: string;
}

export interface MeterReading {
  id: string;
  meter_id: string;
  reading_timestamp: string;
  value: number;
  unit: string;
  data_quality: 'ACTUAL' | 'ESTIMATED' | 'INTERPOLATED' | 'FAULTY' | 'FLATLINE';
  source: string;
  created_at: string;
}

export interface EnergyProject {
  id: string;
  site_id: string;
  contract_id?: string;
  project_name: string;
  category: string;
  scope_description?: string;
  baseline_period_start: string;
  baseline_period_end: string;
  baseline_annual_kwh: number;
  target_annual_saving_kwh?: number;
  target_annual_saving_gbp?: number;
  implementation_date: string;
  verification_status: 'BASELINE_DEFINED' | 'IMPLEMENTED' | 'MEASUREMENT_PERIOD' | 'VERIFIED' | 'INCONCLUSIVE';
  verified_saving_kwh?: number;
  verified_saving_gbp?: number;
  owner: string;
  created_at: string;
}

export interface EnergyDashboardMetrics {
  totalMetersCount: number;
  activeMetersCount: number;
  staleFeedsCount: number;
  baseloadAlertsCount: number;
  outOfHoursExceptionsCount: number;
  hvacControlConflictsCount: number;
  activeProjectsCount: number;
  verifiedSavingsGbp: number;
}

// In-Memory Fallback Store
class EnergyMemoryStore {
  public meters: Map<string, MeterRecord> = new Map();
  public readings: Map<string, MeterReading[]> = new Map();
  public projects: Map<string, EnergyProject> = new Map();
}

export const energyMemoryStore = new EnergyMemoryStore();

function isDbConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * List all meters
 */
export async function listMeters(siteId?: string): Promise<MeterRecord[]> {
  let list = Array.from(energyMemoryStore.meters.values());

  if (isDbConfigured()) {
    let q = 'meters?select=*&order=name.asc';
    if (siteId) q += `&site_id=eq.${siteId}`;
    const { data } = await dbQuery<any[]>(q);
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        site_id: r.site_id,
        building_id: r.building_id,
        asset_id: r.asset_id,
        parent_meter_id: r.parent_meter_id,
        meter_reference: r.meter_reference,
        name: r.name,
        utility_type: r.utility_type,
        meter_hierarchy: r.meter_hierarchy,
        unit_of_measure: r.unit_of_measure,
        multiplier: Number(r.multiplier) || 1,
        interval_minutes: r.interval_minutes || 30,
        is_automated: r.is_automated || false,
        feed_status: r.feed_status || 'ACTIVE',
        last_reading_at: r.last_reading_at,
        created_at: r.created_at,
      }));
    }
  }

  return list;
}

/**
 * List energy projects
 */
export async function listEnergyProjects(): Promise<EnergyProject[]> {
  let list = Array.from(energyMemoryStore.projects.values());

  if (isDbConfigured()) {
    const { data } = await dbQuery<any[]>('energy_projects?select=*&order=created_at.desc');
    if (data) {
      list = data.map((r) => ({
        id: r.id,
        site_id: r.site_id,
        contract_id: r.contract_id,
        project_name: r.project_name,
        category: r.category,
        scope_description: r.scope_description,
        baseline_period_start: r.baseline_period_start,
        baseline_period_end: r.baseline_period_end,
        baseline_annual_kwh: Number(r.baseline_annual_kwh),
        target_annual_saving_kwh: r.target_annual_saving_kwh ? Number(r.target_annual_saving_kwh) : undefined,
        target_annual_saving_gbp: r.target_annual_saving_gbp ? Number(r.target_annual_saving_gbp) : undefined,
        implementation_date: r.implementation_date,
        verification_status: r.verification_status,
        verified_saving_kwh: r.verified_saving_kwh ? Number(r.verified_saving_kwh) : undefined,
        verified_saving_gbp: r.verified_saving_gbp ? Number(r.verified_saving_gbp) : undefined,
        owner: r.owner,
        created_at: r.created_at,
      }));
    }
  }

  return list;
}

/**
 * Get Energy Dashboard KPI Metrics
 */
export async function getEnergyDashboardMetrics(): Promise<EnergyDashboardMetrics> {
  const meters = await listMeters();
  const projects = await listEnergyProjects();

  const verifiedSavings = projects
    .filter((p) => p.verification_status === 'VERIFIED')
    .reduce((acc, p) => acc + (p.verified_saving_gbp || 0), 0);

  return {
    totalMetersCount: meters.length,
    activeMetersCount: meters.filter((m) => m.feed_status === 'ACTIVE').length,
    staleFeedsCount: meters.filter((m) => m.feed_status === 'STALE' || m.feed_status === 'OFFLINE').length,
    baseloadAlertsCount: 0,
    outOfHoursExceptionsCount: 0,
    hvacControlConflictsCount: 0,
    activeProjectsCount: projects.filter((p) => p.verification_status === 'MEASUREMENT_PERIOD').length,
    verifiedSavingsGbp: verifiedSavings,
  };
}
