/**
 * ENTIREFM RAMS AI SAFETY ASSISTANT (CP-05)
 * =========================================
 * Controlled, auditable AI assistant for suggesting hazards, drafting method
 * statements, and checking safety omissions.
 *
 * GOVERNANCE RULES:
 *   1. AI suggestions NEVER automatically approve hazards or methods.
 *   2. AI DOES NOT invent qualifications, site permits, chemicals, or client rules.
 *   3. If AI service is unavailable, deterministic rule-based safety rules return seamlessly.
 *   4. Contractor must review and explicitly accept any generated suggestion.
 */

import { CANONICAL_HAZARDS, CANONICAL_FM_ACTIVITIES, CanonicalHazardItem } from './rams-framework';
import { RamsRecord } from './rams-service';

export interface AiHazardSuggestion {
  id: string;
  hazard: string;
  reason: string;
  suggestedControls: string[];
  suggestedLikelihood: 1 | 2 | 3 | 4 | 5;
  suggestedSeverity: 1 | 2 | 3 | 4 | 5;
}

export interface AiQualityFeedback {
  category: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  title: string;
  detail: string;
  suggestedFix?: string;
}

/**
 * Proposes missing or overlooked hazards based on work scope, trade, plant, and environment.
 */
export async function suggestAdditionalHazards(params: {
  workCategory: string;
  workScopeDescription: string;
  buildingType: string;
  occupancyState: string;
  selectedPlant: string[];
  currentHazardIds: string[];
}): Promise<AiHazardSuggestion[]> {
  const suggestions: AiHazardSuggestion[] = [];
  const currentSet = new Set(params.currentHazardIds);

  const scopeLower = params.workScopeDescription.toLowerCase();

  // Rule 1: Working at height check
  if (
    (scopeLower.includes('ceiling') ||
      scopeLower.includes('roof') ||
      scopeLower.includes('high') ||
      params.selectedPlant.some((p) => p.toLowerCase().includes('ladder') || p.toLowerCase().includes('podium') || p.toLowerCase().includes('mewp'))) &&
    !currentSet.has('HAZ_HEIGHT_FALL_FROM_EQUIPMENT')
  ) {
    suggestions.push({
      id: 'HAZ_HEIGHT_FALL_FROM_EQUIPMENT',
      hazard: 'Fall from height from access equipment / ladders / podiums',
      reason: 'Your work scope indicates work in elevated positions or uses access plant.',
      suggestedControls: [
        'Select enclosed podium with 360-degree guardrail.',
        'Perform daily pre-use visual inspection.',
        'Maintain 3 points of contact on ascending steps.',
      ],
      suggestedLikelihood: 3,
      suggestedSeverity: 4,
    });
  }

  // Rule 2: Occupied environment check
  if (params.occupancyState.toLowerCase().includes('occupied') && !currentSet.has('HAZ_OCCUPIED_PUBLIC_INTERFACE')) {
    suggestions.push({
      id: 'HAZ_OCCUPIED_PUBLIC_INTERFACE',
      hazard: 'Slips, trips, or collisions with building occupants / Trailing cables / Tools',
      reason: 'The facility is marked as occupied during maintenance hours.',
      suggestedControls: [
        'Erect physical barriers around work zone.',
        'Elevate power cables with hooks or hi-vis ramps.',
        'Position warning signage at corridor entrances.',
      ],
      suggestedLikelihood: 3,
      suggestedSeverity: 2,
    });
  }

  // Rule 3: Electrical isolation check
  if (
    (params.workCategory === 'ELECTRICAL' || scopeLower.includes('lighting') || scopeLower.includes('panel') || scopeLower.includes('breaker') || scopeLower.includes('motor')) &&
    !currentSet.has('HAZ_ELEC_LIVE_CONDUCTORS')
  ) {
    suggestions.push({
      id: 'HAZ_ELEC_LIVE_CONDUCTORS',
      hazard: 'Contact with live electrical conductors / Electric shock / Electrocution',
      reason: 'Scope involves invasive electrical maintenance or equipment replacement.',
      suggestedControls: [
        'Apply unique padlock to circuit breaker lock-off device (LOTO).',
        'Attach danger warning tag with engineer details.',
        'Prove dead with GS38 tester and proving unit before touching conductors.',
      ],
      suggestedLikelihood: 3,
      suggestedSeverity: 5,
    });
  }

  // Rule 4: Hot works check
  if (
    (scopeLower.includes('braz') || scopeLower.includes('weld') || scopeLower.includes('torch') || scopeLower.includes('grind')) &&
    !currentSet.has('HAZ_HOT_WORKS_FIRE')
  ) {
    suggestions.push({
      id: 'HAZ_HOT_WORKS_FIRE',
      hazard: 'Ignition of combustible materials from blowtorch, brazing, or sparks',
      reason: 'Thermal tools or brazing operations detected in scope description.',
      suggestedControls: [
        'Obtain and activate an authorized Site Hot Works Permit.',
        'Clear all combustibles within 10-metre radius.',
        'Position 2x fire extinguishers adjacent to work area.',
        'Maintain continuous 60-minute post-work fire watch with thermal imaging check.',
      ],
      suggestedLikelihood: 3,
      suggestedSeverity: 5,
    });
  }

  return suggestions;
}

/**
 * Reviews RAMS quality and flags safety omissions.
 */
export function reviewRamsQuality(rams: RamsRecord): AiQualityFeedback[] {
  const feedbacks: AiQualityFeedback[] = [];

  const scopeLower = rams.workScopeDescription.toLowerCase();
  const hasElec = rams.hazards.some((h) => h.category === 'ELECTRICAL');
  const hasHeight = rams.hazards.some((h) => h.category === 'WORKING_AT_HEIGHT');
  const hasHot = rams.hazards.some((h) => h.category === 'HOT_WORKS');

  // Check 1: Electrical isolation in method statement
  if (hasElec) {
    const hasIsolationStep = rams.methodSteps.some(
      (s) => s.title.toLowerCase().includes('isolat') || s.description.toLowerCase().includes('prove dead') || s.description.toLowerCase().includes('lock')
    );
    if (!hasIsolationStep) {
      feedbacks.push({
        category: 'CRITICAL',
        title: 'Missing Safe Electrical Isolation Step',
        detail: 'Electrical shock hazards are identified, but the method statement does not detail the LOTO procedure or proving dead with a GS38 tester.',
        suggestedFix: 'Add a dedicated method step: "Safe Electrical Isolation (LOTO) and Proving Dead with GS38 Voltage Tester".',
      });
    }
  }

  // Check 2: Working at height without access equipment
  if (hasHeight && rams.selectedPlant.length === 0) {
    feedbacks.push({
      category: 'WARNING',
      title: 'Working at Height Without Plant Equipment',
      detail: 'Falls from height hazards are assessed, but no access equipment (podium steps, scaffold tower, MEWP) is recorded in Section 7.',
      suggestedFix: 'Select suitable access equipment such as "Enclosed Podium Steps" in Section 7.',
    });
  }

  // Check 3: Occupied building segregation
  if (rams.occupancyState.toLowerCase().includes('occupied') && !rams.methodSteps.some((s) => s.description.toLowerCase().includes('barrier') || s.description.toLowerCase().includes('segregat'))) {
    feedbacks.push({
      category: 'SUGGESTION',
      title: 'Occupied Building Pedestrian Segregation',
      detail: 'The building is marked as occupied. Consider adding a method step for erecting safety barriers and warning signage.',
    });
  }

  // Check 4: Hot works permit check
  if (hasHot && !rams.requiredPermits.some((p) => p.toLowerCase().includes('hot work'))) {
    feedbacks.push({
      category: 'CRITICAL',
      title: 'Hot Works Permit Required',
      detail: 'Hot works hazards identified, but no Site Hot Works Permit is specified in Section 7.',
      suggestedFix: 'Add "Site Hot Works Permit" to mandatory permits.',
    });
  }

  return feedbacks;
}
