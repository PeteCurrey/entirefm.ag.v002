/**
 * ENTIREFM REACTIVE AUTO-DISPATCH ORCHESTRATOR (Phase 0M)
 * ========================================================
 * Governs the complete end-to-end dispatch lifecycle:
 * Intake -> Triage -> Eligibility -> Ranking -> Policy -> Dispatch -> Accept/Decline Loop.
 *
 * Rules:
 *   - AI never invents financial authority or overrides hard eligibility
 *   - Auto-PO created only when commercial policy permits
 *   - Contractor decline triggers automatic fallback to next ranked eligible candidate
 *   - Maximum 3 decline attempts before mandatory human escalation (no infinite loops)
 *   - Client communications derived strictly from canonical platform state
 */

import { dbQuery } from '../../db/client';
import { evaluateContractorEligibility } from './eligibility';
import { rankEligibleContractors, RawCandidateInput } from './ranking';
import {
  AutomationLevel,
  AutoPOPolicy,
  DeclineRecord,
  DispatchExecutionResult,
  EligibleContractorCandidate,
} from './types';
import { TradeCategory, UrgencyLevel } from '../helpdesk/types';
import { geocodePostcode, haversineDistanceMiles } from '../../geo/geocoding';
import {
  emitClientCommunicationEvent,
  emitContractorCommunicationEvent,
} from '../../communications';
import { evaluateAsbestosWorkOrderRisk, AsbestosJobAssessment } from '../../asbestos';

export interface DispatchOrchestratorParams {
  work_order_id: string;
  work_order_number: string;
  title: string;
  trade: TradeCategory;
  priority: UrgencyLevel;
  site_id?: string;
  site_name?: string;
  site_city?: string;
  site_postcode?: string;
  site_latitude?: number;
  site_longitude?: number;
  client_id?: string;
  client_name?: string;
  automation_level?: AutomationLevel;
  auto_po_policy?: AutoPOPolicy;
  not_to_exceed_limit_gbp?: number;
  decline_history?: DeclineRecord[];
  candidate_suppliers_override?: any[];
  will_disturb_building_fabric?: boolean;
  asbestos_assessment?: AsbestosJobAssessment;
}


export async function orchestrateReactiveDispatch(
  params: DispatchOrchestratorParams
): Promise<DispatchExecutionResult> {
  const automationLevel = params.automation_level || 'AUTO_DISPATCH_AND_PO';
  const autoPoPolicy = params.auto_po_policy || 'AUTO_RAISE';
  const declineHistory = params.decline_history || [];

  // 0. Mutual Exclusion Guard: Check for Active Marketplace Opportunity (System A)
  try {
    const targetSourceIds: string[] = [];
    if (params.work_order_number) targetSourceIds.push(params.work_order_number);
    if (params.work_order_id && params.work_order_id !== params.work_order_number) {
      targetSourceIds.push(params.work_order_id);
    }

    if (targetSourceIds.length > 0) {
      const { data: matchedReqs } = await dbQuery<any[]>(
        `work_allocation_requirements?source_id=in.(${targetSourceIds.map((id) => encodeURIComponent(id)).join(',')})&select=id,source_id,source_type`
      );

      if (matchedReqs && matchedReqs.length > 0) {
        const reqIds = matchedReqs.map((r) => r.id);
        const { data: matchedOpps } = await dbQuery<any[]>(
          `supplier_opportunities?requirement_id=in.(${reqIds.map((id) => encodeURIComponent(id)).join(',')})&select=id,title,status,opportunity_type,requirement_id`
        );

        const NON_TERMINAL_STATUSES = new Set(['ISSUED', 'RESPONSES_RECEIVED', 'AWAITING_AWARD']);
        const activeOpp = matchedOpps?.find((opp) => NON_TERMINAL_STATUSES.has(opp.status));

        if (activeOpp) {
          return {
            status: 'BLOCKED_ACTIVE_MARKETPLACE_OFFER',
            work_order_id: params.work_order_id,
            work_order_number: params.work_order_number,
            ranked_candidates: [],
            decline_history: declineHistory,
            exception_reason: `Work Order ${params.work_order_number} has an active contractor marketplace opportunity '${activeOpp.title}' (ID: ${activeOpp.id}, status: ${activeOpp.status}). Auto-dispatch suspended to prevent double-assignment.`,
            client_update_message: `Work Order ${params.work_order_number} is currently active on the Contractor Marketplace (Opportunity: ${activeOpp.title}). Automatic assignment paused pending marketplace award or manual withdrawal.`,
          };
        }
      }
    }
  } catch (guardErr) {
    console.warn('[DispatchOrchestrator:MarketplaceGuardWarn]', guardErr);
  }

  // 0.5 Asbestos Safety Gate (CAR 2012 / Reg 4 Duty to Manage)
  // Strict Fail-Closed: Intrusive work without statutory survey / dutyholder documentation
  // or human QHSE sign-off halts dispatch BEFORE contractor selection.
  try {
    let assessment = params.asbestos_assessment;
    let willDisturb = params.will_disturb_building_fabric;

    if (!assessment) {
      const isIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.work_order_id);
      const woFilter = isIdUuid
        ? `id=eq.${encodeURIComponent(params.work_order_id)}`
        : `work_order_number=eq.${encodeURIComponent(params.work_order_id)}`;
      const { data: woData } = await dbQuery<any[]>(`work_orders?${woFilter}&select=*&limit=1`);
      const wo = woData?.[0];


      if (willDisturb == null) {
        const text = `${params.title || ''} ${wo?.description || ''}`.toLowerCase();
        const INTRUSIVE_KEYWORDS = [
          'drill', 'drilling', 'penetrat', 'breakthrough', 'wall removal',
          'demolition', 'destructive', 'refurbish', 'chasing', 'cut into',
          'ceiling void', 'riser access', 'structural'
        ];
        willDisturb = INTRUSIVE_KEYWORDS.some((kw) => text.includes(kw));
      }

      let constructionYear: number | undefined = undefined;
      if (wo?.building_id) {
        const { data: bldData } = await dbQuery<any[]>(
          `buildings?id=eq.${encodeURIComponent(wo.building_id)}&select=id,construction_year&limit=1`
        );
        if (bldData?.[0]?.construction_year) {
          constructionYear = Number(bldData[0].construction_year);
        }
      }

      const scopeStatus = willDisturb
        ? 'SURVEY_REQUIRED'
        : 'DUTY_NOT_APPLICABLE';

      assessment = {
        workOrderId: params.work_order_id,
        siteId: params.site_id || wo?.site_id || '',
        siteAddress: params.site_name || '',
        buildingConstructionYear: constructionYear,
        jobWorkArea: params.title,
        workType: willDisturb ? 'INTRUSIVE_DRILLING' : 'SERVICING_NO_FABRIC_DISTURBANCE',
        willDisturbBuildingFabric: Boolean(willDisturb),
        scopeStatus,
        acmLocationsIdentified: [],
        presumedAcms: [],
        documents: [],
      };
    }

    const asbestosEval = evaluateAsbestosWorkOrderRisk(assessment);

    // AI/system may NEVER grant safety clearance - only authorized human QHSE clearance allows bypass
    const hasHumanClearance = Boolean(assessment.humanQhseClearedBy && assessment.humanQhseClearedAt);

    if (asbestosEval.isBlockedForIntrusiveWork && !hasHumanClearance) {
      const holdMsg = `BLOCKED_SAFETY_HOLD: Intrusive work requires statutory asbestos clearance/survey before dispatch. Status: ${assessment.scopeStatus}. Flags: ${asbestosEval.riskFlags.join('; ')}`;
      try {
        await dbQuery(`work_orders?id=eq.${encodeURIComponent(params.work_order_id)}`, {
          method: 'PATCH',
          body: {
            status: 'ON_HOLD',
            hold_reason: holdMsg,
          },
        });
      } catch (patchErr) {
        console.warn('[DispatchOrchestrator:AsbestosHoldPatchWarn]', patchErr);
      }

      return {
        status: 'BLOCKED_SAFETY_HOLD',
        work_order_id: params.work_order_id,
        work_order_number: params.work_order_number,
        ranked_candidates: [],
        decline_history: declineHistory,
        exception_reason: holdMsg,
        client_update_message: `Work Order ${params.work_order_number} is held on safety hold. Intrusive fabric disturbance cannot proceed without required statutory asbestos documentation or survey.`,
      };
    }
  } catch (asbestosErr) {
    console.error('[DispatchOrchestrator:AsbestosFailClosed]', asbestosErr);
    return {
      status: 'BLOCKED_SAFETY_HOLD',
      work_order_id: params.work_order_id,
      work_order_number: params.work_order_number,
      ranked_candidates: [],
      decline_history: declineHistory,
      exception_reason: `Asbestos safety verification failed with error: ${asbestosErr instanceof Error ? asbestosErr.message : String(asbestosErr)} (fail-closed)`,
      client_update_message: `Work Order ${params.work_order_number} held on safety hold: safety records could not be verified.`,
    };
  }

  // 1. Resolve Work Order Site Coordinates

  let siteLat: number | null = params.site_latitude ?? null;
  let siteLng: number | null = params.site_longitude ?? null;
  let sitePostcode = params.site_postcode || '';
  let siteCity = params.site_city || '';

  if (params.site_id && (siteLat == null || siteLng == null)) {
    try {
      const { data: siteData } = await dbQuery<any[]>(
        `sites?id=eq.${encodeURIComponent(params.site_id)}&select=id,name,city,postcode,latitude,longitude&limit=1`
      );
      const siteRow = siteData?.[0];
      if (siteRow) {
        if (!siteCity && siteRow.city) siteCity = siteRow.city;
        if (!sitePostcode && siteRow.postcode) sitePostcode = siteRow.postcode;
        if (siteRow.latitude != null && siteRow.longitude != null) {
          siteLat = Number(siteRow.latitude);
          siteLng = Number(siteRow.longitude);
        }
      }
    } catch {
      // Non-blocking
    }
  }

  if ((siteLat == null || siteLng == null) && sitePostcode) {
    try {
      const coords = await geocodePostcode(sitePostcode, 'GB');
      if (coords) {
        siteLat = coords.latitude;
        siteLng = coords.longitude;
      }
    } catch {
      // Non-blocking
    }
  }

  // 2. Fetch Candidate Contractors & Ancillary Records from DB (or use override in testing)
  let rawSuppliers: any[] = [];
  const provProfilesByOrgId = new Map<string, any>();
  const locationsByOrgId = new Map<string, any[]>();
  const coverageByOrgId = new Map<string, any[]>();
  const holdsByOrgId = new Map<string, any[]>();
  const insurancesByOrgId = new Map<string, any[]>();
  const docsByOrgId = new Map<string, any[]>();
  let assuranceLookupFailed = false;

  if (params.candidate_suppliers_override && params.candidate_suppliers_override.length > 0) {
    rawSuppliers = params.candidate_suppliers_override;
  } else {
    try {
      const [
        { data: dbSuppliers, error: errSupp },
        { data: dbProviderProfiles },
        { data: dbLocations },
        { data: dbCoverageAreas },
        { data: dbHolds, error: errHolds },
        { data: dbInsurances, error: errIns },
        { data: dbDocs, error: errDocs },
      ] = await Promise.all([
        dbQuery<any[]>('organisations?org_type=in.(CONTRACTOR,SUPPLIER)&status=eq.ACTIVE&select=*&order=name.asc'),
        dbQuery<any[]>('provider_organisations?select=*'),
        dbQuery<any[]>('provider_locations?select=*'),
        dbQuery<any[]>('coverage_areas?is_active=eq.true&select=*'),
        dbQuery<any[]>('supplier_compliance_holds?is_active=eq.true&select=*'),
        dbQuery<any[]>('supplier_insurance_records?select=*'),
        dbQuery<any[]>('supplier_document_records?select=*'),
      ]);

      if (errSupp) {
        assuranceLookupFailed = true;
      }
      if (errHolds || errIns || errDocs) {
        assuranceLookupFailed = true;
      }

      rawSuppliers = dbSuppliers || [];

      if (dbProviderProfiles) {
        for (const p of dbProviderProfiles) provProfilesByOrgId.set(p.organisation_id, p);
      }
      if (dbLocations) {
        for (const l of dbLocations) {
          const arr = locationsByOrgId.get(l.provider_org_id) || [];
          arr.push(l);
          locationsByOrgId.set(l.provider_org_id, arr);
        }
      }
      if (dbCoverageAreas) {
        for (const ca of dbCoverageAreas) {
          const arr = coverageByOrgId.get(ca.provider_org_id) || [];
          arr.push(ca);
          coverageByOrgId.set(ca.provider_org_id, arr);
        }
      }
      if (dbHolds) {
        for (const h of dbHolds) {
          const ownerId = h.organisation_id || h.supplier_org_id;
          if (ownerId) {
            const arr = holdsByOrgId.get(ownerId) || [];
            arr.push(h);
            holdsByOrgId.set(ownerId, arr);
          }
        }
      }
      if (dbInsurances) {
        for (const ins of dbInsurances) {
          const ownerId = ins.organisation_id || ins.supplier_org_id;
          if (ownerId) {
            const arr = insurancesByOrgId.get(ownerId) || [];
            arr.push(ins);
            insurancesByOrgId.set(ownerId, arr);
          }
        }
      }
      if (dbDocs) {
        for (const doc of dbDocs) {
          const ownerId = doc.organisation_id || doc.supplier_org_id;
          if (ownerId) {
            const arr = docsByOrgId.get(ownerId) || [];
            arr.push(doc);
            docsByOrgId.set(ownerId, arr);
          }
        }
      }
    } catch (fetchErr) {
      console.warn('[DispatchOrchestrator:SupplierAssuranceFetchError]', fetchErr);
      assuranceLookupFailed = true;
    }
  }

  // 3. Evaluate Hard Eligibility Gates with Multi-Depot Nearest Proximity
  const rawCandidates: RawCandidateInput[] = [];
  for (const s of rawSuppliers) {
    const provProfile = provProfilesByOrgId.get(s.id);
    const linkedLocs = locationsByOrgId.get(s.id) || s.provider_locations || [];
    const linkedCov = coverageByOrgId.get(s.id) || s.coverage_areas || [];
    const linkedHolds = holdsByOrgId.get(s.id) || s.compliance_holds || [];
    const linkedInsurances = insurancesByOrgId.get(s.id) || s.insurance_records || [];
    const linkedDocs = docsByOrgId.get(s.id) || s.accreditation_documents || [];

    // Trades (fail-closed: never default to [params.trade])
    let suppTrades = s.trades;
    if (!suppTrades || suppTrades.length === 0) {
      if (provProfile?.primary_trade) {
        suppTrades = [provProfile.primary_trade];
      } else if (Array.isArray(s.settings?.trades)) {
        suppTrades = s.settings.trades;
      } else if (Array.isArray(s.subcontractor_trades)) {
        suppTrades = s.subcontractor_trades;
      } else {
        suppTrades = [];
      }
    }

    // Covered cities (fail-closed: never default to [params.site_city])
    let coveredCities = s.covered_cities || s.settings?.covered_cities;
    if (!coveredCities || coveredCities.length === 0) {
      const cities = new Set<string>();
      for (const loc of linkedLocs) {
        if (loc.city) cities.add(loc.city);
      }
      for (const cov of linkedCov) {
        if (cov.boundary_value) cities.add(cov.boundary_value);
      }
      coveredCities = Array.from(cities);
    }

    const isNational = Boolean(s.is_national ?? provProfile?.is_national ?? s.settings?.is_national ?? false);
    const emergencyCapable = Boolean(
      s.emergency_24_7_capable ??
      provProfile?.emergency_24_7_capable ??
      s.settings?.emergency_24_7 ??
      linkedLocs.some((l: any) => l.emergency_available) ??
      false
    );
    const coverageRadius = s.coverage_radius_miles ?? provProfile?.coverage_radius_miles ?? 25;

    // Multi-depot nearest distance calculation
    let minDistanceMiles: number | null = s.distance_miles ?? null;

    if (minDistanceMiles == null && siteLat != null && siteLng != null) {
      const candidateLocs: Array<{ latitude?: number | null; longitude?: number | null; postcode?: string | null }> = [...linkedLocs];
      if (candidateLocs.length === 0 && (s.latitude != null || s.postcode != null)) {
        candidateLocs.push({ latitude: s.latitude, longitude: s.longitude, postcode: s.postcode });
      }

      for (const loc of candidateLocs) {
        let locLat = loc.latitude != null ? Number(loc.latitude) : null;
        let locLng = loc.longitude != null ? Number(loc.longitude) : null;

        if ((locLat == null || locLng == null) && loc.postcode) {
          try {
            const coords = await geocodePostcode(loc.postcode, 'GB');
            if (coords) {
              locLat = coords.latitude;
              locLng = coords.longitude;
            }
          } catch {
            // Non-blocking
          }
        }

        if (locLat != null && locLng != null && !isNaN(locLat) && !isNaN(locLng)) {
          const d = haversineDistanceMiles(locLat, locLng, siteLat, siteLng);
          if (minDistanceMiles == null || d < minDistanceMiles) {
            minDistanceMiles = d;
          }
        }
      }
    }

    const eligibilityGate = evaluateContractorEligibility({
      supplier: {
        id: s.id,
        name: s.name,
        code: s.code || 'SUP-00',
        status: s.status || 'ACTIVE',
        org_type: s.org_type || 'CONTRACTOR',
        trades: suppTrades,
        covered_cities: coveredCities,
        is_national: isNational,
        is_suspended: Boolean(s.is_suspended),
        emergency_24_7_capable: emergencyCapable,
        distance_miles: minDistanceMiles,
        coverage_radius_miles: coverageRadius,
        blacklisted_client_ids: s.blacklisted_client_ids,
        blacklisted_site_ids: s.blacklisted_site_ids,
        compliance_holds: linkedHolds,
        insurance_records: linkedInsurances,
        accreditation_documents: linkedDocs,
        provider_profile: provProfile,
        settings_insurance: s.settings?.insurance,
        assurance_lookup_failed: assuranceLookupFailed || s.assurance_lookup_failed,
      },
      requirement: {
        trade: params.trade,
        site_id: params.site_id,
        site_city: siteCity,
        site_postcode: sitePostcode,
        client_id: params.client_id,
        priority: params.priority,
      },
    });


    // Authoritative performance data (fail-closed: do NOT fabricate 96% / 94%)
    const slaAdherence =
      s.sla_adherence_pct != null
        ? Number(s.sla_adherence_pct)
        : provProfile?.sla_adherence_rate != null
        ? Number(provProfile.sla_adherence_rate)
        : s.settings?.sla_adherence_pct != null
        ? Number(s.settings.sla_adherence_pct)
        : undefined;

    const acceptanceRate =
      s.acceptance_pct != null
        ? Number(s.acceptance_pct)
        : s.settings?.acceptance_pct != null
        ? Number(s.settings.acceptance_pct)
        : undefined;

    // Authoritative commercial rates (fail-closed: do NOT fabricate £85 / £55)
    const calloutRate =
      s.agreed_callout_rate_gbp != null
        ? Number(s.agreed_callout_rate_gbp)
        : provProfile?.callout_rate_gbp != null
        ? Number(provProfile.callout_rate_gbp)
        : s.settings?.agreed_callout_rate_gbp != null
        ? Number(s.settings.agreed_callout_rate_gbp)
        : s.settings?.rates?.callout != null
        ? Number(s.settings.rates.callout)
        : undefined;

    const hourlyRate =
      s.agreed_hourly_rate_gbp != null
        ? Number(s.agreed_hourly_rate_gbp)
        : provProfile?.hourly_rate_gbp != null
        ? Number(provProfile.hourly_rate_gbp)
        : s.settings?.agreed_hourly_rate_gbp != null
        ? Number(s.settings.agreed_hourly_rate_gbp)
        : s.settings?.rates?.hourly != null
        ? Number(s.settings.rates.hourly)
        : undefined;

    rawCandidates.push({
      supplier_id: s.id,
      supplier_name: s.name,
      supplier_code: s.code || 'SUP',
      contact_email: s.email || undefined,
      contact_phone: s.phone || '',
      trades: suppTrades,
      distance_miles: minDistanceMiles ?? undefined,
      sla_adherence_pct: slaAdherence,
      acceptance_pct: acceptanceRate,
      current_open_jobs: s.current_open_jobs ?? 0,
      agreed_callout_rate_gbp: calloutRate,
      agreed_hourly_rate_gbp: hourlyRate,
      eligibility_gate: eligibilityGate,
    });
  }

  // 3. Rank Eligible Contractors
  const rankedAll = rankEligibleContractors(rawCandidates, {
    trade: params.trade,
    priority: params.priority,
    site_city: params.site_city,
  });

  // Filter out suppliers who already declined this job
  const declinedIds = new Set(declineHistory.map((d) => d.supplier_id));
  const availableRanked = rankedAll.filter((c) => !declinedIds.has(c.supplier_id));

  // 4. Handle Exception: No Eligible Provider
  if (availableRanked.length === 0) {
    return {
      status: 'NO_ELIGIBLE_PROVIDER',
      work_order_id: params.work_order_id,
      work_order_number: params.work_order_number,
      ranked_candidates: rankedAll,
      decline_history: declineHistory,
      exception_reason:
        declinedIds.size > 0
          ? 'All eligible contractors have declined this work order'
          : 'No approved contractor matches required trade, geographic coverage, or compliance criteria',
      client_update_message: `Work Order ${params.work_order_number} has been logged and is undergoing manual specialist scheduling with EntireFM Helpdesk.`,
    };
  }

  // Select top ranked candidate
  const selected = availableRanked[0];

  // 5. Check Automation Level & Auto-PO Execution
  if (automationLevel === 'MANUAL' || automationLevel === 'ASSIST') {
    return {
      status: 'AWAITING_APPROVAL',
      work_order_id: params.work_order_id,
      work_order_number: params.work_order_number,
      assigned_supplier_id: selected.supplier_id,
      assigned_supplier_name: selected.supplier_name,
      ranked_candidates: availableRanked,
      decline_history: declineHistory,
      client_update_message: `Work Order ${params.work_order_number} logged. Triage complete, awaiting operator dispatch confirmation.`,
    };
  }

  // 6. Fail-Closed Auto-PO Validation & Autonomous Dispatch
  let poId: string | undefined;
  let poNumber: string | undefined;
  let poGross: number | undefined;

  // If Auto-PO policy permits
  if (automationLevel === 'AUTO_DISPATCH_AND_PO' && autoPoPolicy === 'AUTO_RAISE') {
    const hasValidCallout =
      selected.agreed_callout_rate_gbp != null &&
      !isNaN(selected.agreed_callout_rate_gbp) &&
      selected.agreed_callout_rate_gbp > 0;
    const hasValidHourly =
      selected.agreed_hourly_rate_gbp != null &&
      !isNaN(selected.agreed_hourly_rate_gbp) &&
      selected.agreed_hourly_rate_gbp > 0;

    if (!hasValidCallout || !hasValidHourly) {
      // Fail closed: do NOT create PO, do NOT create false financial state.
      const unverifiedReason = `Contractor '${selected.supplier_name}' (${selected.supplier_code}) lacks verified commercial rates (callout: ${
        selected.agreed_callout_rate_gbp != null ? `£${selected.agreed_callout_rate_gbp}` : 'MISSING'
      }, hourly: ${
        selected.agreed_hourly_rate_gbp != null ? `£${selected.agreed_hourly_rate_gbp}` : 'MISSING'
      }). Autonomous PO creation halted for human commercial review.`;

      // 1. Record blocking exception in commercial_exceptions ledger
      try {
        await dbQuery('commercial_exceptions', {
          method: 'POST',
          body: {
            object_type: 'WORK_ORDER',
            object_id: params.work_order_id,
            exception_code: 'COMMERCIAL_RATE_UNVERIFIED',
            severity: 'BLOCKING',
            detail: unverifiedReason,
            is_resolved: false,
          },
        });
      } catch {}

      // 2. Put work order into explicit human-review ON_HOLD state
      try {
        await dbQuery(`work_orders?id=eq.${encodeURIComponent(params.work_order_id)}`, {
          method: 'PATCH',
          body: {
            status: 'ON_HOLD',
            hold_reason: `COMMERCIAL_RATE_UNVERIFIED: ${unverifiedReason}`,
            provider_organisation_id: selected.supplier_id,
            updated_at: new Date().toISOString(),
          },
        });
      } catch {}

      return {
        status: 'COMMERCIAL_RATE_UNVERIFIED',
        work_order_id: params.work_order_id,
        work_order_number: params.work_order_number,
        assigned_supplier_id: selected.supplier_id,
        assigned_supplier_name: selected.supplier_name,
        ranked_candidates: availableRanked,
        decline_history: declineHistory,
        exception_reason: unverifiedReason,
        client_update_message: `Work Order ${params.work_order_number} has been logged and is undergoing commercial rate review before dispatch.`,
      };
    }

    // Both rates are strictly verified positive numbers sourced from authoritative data
    poId = crypto.randomUUID();
    poNumber = `PO-AUTO-${Date.now().toString().slice(-6)}`;
    const callout = selected.agreed_callout_rate_gbp!;
    const hourly = selected.agreed_hourly_rate_gbp!;
    const estNet = callout + hourly * 2; // 2 hours estimated standard initial attendance
    poGross = Math.round(estNet * 1.2 * 100) / 100;

    try {
      await dbQuery('purchase_orders', {
        method: 'POST',
        body: {
          id: poId,
          po_number: poNumber,
          work_order_id: params.work_order_id,
          supplier_org_id: selected.supplier_id,
          status: 'ISSUED',
          total_amount_gbp: poGross,
          issued_at: new Date().toISOString(),
        },
      });
    } catch {
      // Non-blocking in test environment
    }
  }

  // Update Work Order in database
  try {
    await dbQuery(`work_orders?id=eq.${encodeURIComponent(params.work_order_id)}`, {
      method: 'PATCH',
      body: {
        provider_organisation_id: selected.supplier_id,
        status: 'ISSUED',
        updated_at: new Date().toISOString(),
      },
    });
  } catch {}

  // 7. Trigger Transactional Email Notifications
  let clientRecipientEmail: string | undefined;
  if (params.client_id) {
    try {
      const { data: clientOrg } = await dbQuery<any[]>(
        `organisations?id=eq.${encodeURIComponent(params.client_id)}&select=email&limit=1`
      );
      if (clientOrg?.[0]?.email) clientRecipientEmail = clientOrg[0].email;
    } catch {}
  }
  if (!clientRecipientEmail && params.work_order_id) {
    try {
      const { data: woData } = await dbQuery<any[]>(
        `work_orders?id=eq.${encodeURIComponent(params.work_order_id)}&select=client_contact_email,organisation_id&limit=1`
      );
      const woRow = woData?.[0];
      if (woRow?.client_contact_email) {
        clientRecipientEmail = woRow.client_contact_email;
      } else if (woRow?.organisation_id) {
        const { data: cOrg } = await dbQuery<any[]>(
          `organisations?id=eq.${encodeURIComponent(woRow.organisation_id)}&select=email&limit=1`
        );
        if (cOrg?.[0]?.email) clientRecipientEmail = cOrg[0].email;
      }
    } catch {}
  }

  const isReassignment = declineHistory.length > 0;

  try {
    await emitClientCommunicationEvent({
      work_order_id: params.work_order_id,
      work_order_number: params.work_order_number,
      eventType: 'CONTRACTOR_ASSIGNED',
      data: {
        site_name: params.site_name,
        trade: params.trade,
        contractor_name: selected.supplier_name,
        recipient_email: clientRecipientEmail,
      },
      idempotencyKey: isReassignment
        ? `${params.work_order_id}:CLIENT:CONTRACTOR_ASSIGNED:${selected.supplier_id}`
        : `${params.work_order_id}:CLIENT:CONTRACTOR_ASSIGNED`,
    });
  } catch (clientCommsErr: any) {
    console.warn('[DispatchComms:ClientEventWarn]', clientCommsErr?.message);
  }

  try {
    await emitContractorCommunicationEvent({
      work_order_id: params.work_order_id,
      work_order_number: params.work_order_number,
      eventType: 'NEW_ASSIGNMENT',
      data: {
        site_name: params.site_name,
        trade: params.trade,
        priority: params.priority,
        po_number: poNumber,
        nte_amount_gbp: poGross,
        recipient_email: selected.contact_email || undefined,
      },
      idempotencyKey: isReassignment
        ? `${params.work_order_id}:CONTRACTOR:NEW_ASSIGNMENT:${selected.supplier_id}`
        : `${params.work_order_id}:CONTRACTOR:NEW_ASSIGNMENT`,
    });
  } catch (contractorCommsErr: any) {
    console.warn('[DispatchComms:ContractorEventWarn]', contractorCommsErr?.message);
  }

  const clientMsg = `Work order ${params.work_order_number} for ${params.site_name || 'your site'} has been assigned to approved partner ${selected.supplier_name}. Priority: ${params.priority}. Target response active.`;
  const contractorMsg = `New Work Order ${params.work_order_number}: ${params.title} at ${params.site_name || 'Site'}. Priority: ${params.priority}. Please accept attendance.`;

  return {
    status: declineHistory.length > 0 ? 'DECLINED_REASSIGNED' : 'DISPATCHED',
    work_order_id: params.work_order_id,
    work_order_number: params.work_order_number,
    assigned_supplier_id: selected.supplier_id,
    assigned_supplier_name: selected.supplier_name,
    purchase_order_id: poId,
    po_number: poNumber,
    po_gross_value_gbp: poGross,
    ranked_candidates: availableRanked,
    decline_history: declineHistory,
    client_update_message: clientMsg,
    contractor_notification_message: contractorMsg,
  };
}

// ─── CONTRACTOR DECLINE HANDLER ───────────────────────────────────────────────

export async function handleContractorDecline(params: {
  work_order_id: string;
  work_order_number: string;
  title: string;
  trade: TradeCategory;
  priority: UrgencyLevel;
  site_id?: string;
  site_name?: string;
  site_city?: string;
  declining_supplier_id: string;
  declining_supplier_name: string;
  decline_reason: string;
  existing_decline_history?: DeclineRecord[];
  candidate_suppliers_override?: any[];
}): Promise<DispatchExecutionResult> {
  const newDecline: DeclineRecord = {
    supplier_id: params.declining_supplier_id,
    supplier_name: params.declining_supplier_name,
    decline_reason: params.decline_reason,
    declined_at: new Date().toISOString(),
  };

  const updatedHistory = [...(params.existing_decline_history || []), newDecline];

  // Stop after 3 declines to prevent infinite loops -> Escalate to human review
  if (updatedHistory.length >= 3) {
    return {
      status: 'ESCALATED',
      work_order_id: params.work_order_id,
      work_order_number: params.work_order_number,
      ranked_candidates: [],
      decline_history: updatedHistory,
      exception_reason: 'Maximum autonomous re-assignment threshold (3 declines) reached. Mandatory Helpdesk Coordinator intervention required.',
      client_update_message: `Work Order ${params.work_order_number} is being actively managed by our duty operations team.`,
    };
  }

  // Re-run dispatch with updated decline history
  return orchestrateReactiveDispatch({
    work_order_id: params.work_order_id,
    work_order_number: params.work_order_number,
    title: params.title,
    trade: params.trade,
    priority: params.priority,
    site_id: params.site_id,
    site_name: params.site_name,
    site_city: params.site_city,
    decline_history: updatedHistory,
    candidate_suppliers_override: params.candidate_suppliers_override,
  });
}
