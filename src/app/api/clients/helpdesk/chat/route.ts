/**
 * ENTIREFM CONVERSATIONAL CLIENT HELPDESK API (Phase 0M Addendum)
 * ================================================================
 * Natural language conversational triage endpoint for the Client Portal.
 * Progressively extracts structured estate and fault parameters without interrogation.
 *
 * Rules:
 *   - Client is already known from session; never asks "What company are you from?"
 *   - Only presents sites the logged-in client is authorised to access
 *   - Matches assets naturally based on location ("found 2 air conditioners in that area")
 *   - Computes canonical SLA deterministically (never LLM-invented)
 *   - Protects against prompt injection by wrapping user messages in UNTRUSTED_EVIDENCE
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/server/identity';
import { dbQuery } from '@/server/db/client';
import { executeModelRequest, wrapUntrustedEvidence } from '@/server/ai/models/router';
import { CANONICAL_SLA_HOURS, deterministicKeywordTriage } from '@/server/ai/helpdesk/intake';
import { TradeCategory, UrgencyLevel } from '@/server/ai/helpdesk/types';

export interface ConversationalHelpdeskState {
  client_id: string;
  client_name: string;
  site_id?: string;
  site_name?: string;
  building_id?: string;
  floor_or_location?: string;
  asset_id?: string;
  asset_name?: string;
  asset_candidates?: Array<{ id: string; name: string; reference: string }>;
  issue_summary?: string;
  issue_description?: string;
  trade?: TradeCategory;
  sub_trade?: string;
  suggested_priority?: UrgencyLevel;
  canonical_sla_hours?: number;
  access_notes?: string;
  is_emergency?: boolean;
  missing_fields: string[];
  is_ready_to_submit: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isViewAs = !!session.viewAsContext?.isViewAs;
    if (session.orgType !== 'CLIENT' && !isViewAs && session.orgType !== 'ENTIREFM') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { message, history = [], current_state } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // 1. Fetch Authorised Sites for this Client
    const siteScopes = session.scopes.filter((s) => s.type === 'SITE').map((s) => s.id);
    const siteFilter = siteScopes.length > 0 ? `&id=in.(${siteScopes.map(encodeURIComponent).join(',')})` : '';
    const { data: clientSites } = await dbQuery<any[]>(
      `sites?organisation_id=eq.${encodeURIComponent(session.orgId)}${siteFilter}&select=id,name,site_code,city&order=name.asc`
    );

    const availableSites = clientSites || [];

    // Initialize or merge state
    const state: ConversationalHelpdeskState = {
      client_id: session.orgId,
      client_name: session.orgName,
      missing_fields: [],
      is_ready_to_submit: false,
      ...current_state,
    };

    // If client only has ONE site, automatically resolve it
    if (!state.site_id && availableSites.length === 1) {
      state.site_id = availableSites[0].id;
      state.site_name = availableSites[0].name;
    }

    // 2. Wrap user input safely
    const wrappedInput = wrapUntrustedEvidence('CLIENT_CHAT', message);

    // 3. Fallback / Deterministic extractor
    const fallbackTriage = deterministicKeywordTriage(message, 'CLIENT_PORTAL');

    // 4. AI Structured Extraction
    const systemPrompt = `You are the EntireFM Client Helpdesk Assistant.
You are helping an authorised client report a facilities or maintenance issue in a natural, polite, and efficient conversation.
Client Name: "${session.orgName}" (already known).
Authorised Sites: ${JSON.stringify(availableSites.map((s) => ({ id: s.id, name: s.name, city: s.city })))}

Your task:
1. Parse the user's latest message and conversation history.
2. Extract or update any fault details: site, specific location on site (floor/room/area), asset, fault summary, trade, urgency.
3. If the site is unknown and multiple sites exist, identify if the user mentioned a city or site name.
4. If a life-safety issue or major hazard is detected (fire, gas, severe flooding, lift entrapment), mark is_emergency = true.
5. Provide a short, calm, friendly response message to the client (1-2 sentences). Ask ONLY ONE relevant missing question if essential, or confirm the details if ready.
6. Return strictly valid JSON:
{
  "response_message": "Friendly natural text to client",
  "extracted_site_id": "site uuid if identified or null",
  "extracted_location": "room / floor string or null",
  "extracted_issue_summary": "1-line issue title or null",
  "extracted_description": "detailed description or null",
  "extracted_trade": "HVAC | PLUMBING | ELECTRICAL | FIRE_LIFE_SAFETY | BUILDING_FABRIC | CLEANING | SECURITY | DRAINAGE | PEST_CONTROL | GROUNDS | OTHER",
  "extracted_priority": "P1_CRITICAL | P2_HIGH | P3_MEDIUM | P4_LOW | P5_ROUTINE",
  "extracted_access_notes": "access info or null",
  "is_emergency": true / false,
  "is_ready_to_submit": true / false
}`;

    const modelRes = await executeModelRequest<any>(
      {
        systemPrompt,
        prompt: `Conversation History:\n${history.map((h: any) => `${h.role}: ${h.text}`).join('\n')}\n\nLatest Client Message:\n${wrappedInput}`,
        temperature: 0.2,
        agentCode: 'CLIENT_CONVERSATIONAL_HELPDESK',
        deterministicFallbackOutput: {
          response_message: availableSites.length > 1 && !state.site_id
            ? `Thank you. Which of your sites is this at? (${availableSites.map((s) => s.name).join(', ')})`
            : `I've noted this ${fallbackTriage.trade.toLowerCase()} issue. Could you tell me where in the building this is located?`,
          extracted_site_id: state.site_id || (availableSites.length === 1 ? availableSites[0].id : null),
          extracted_location: null,
          extracted_issue_summary: fallbackTriage.issue_summary,
          extracted_description: message,
          extracted_trade: fallbackTriage.trade,
          extracted_priority: fallbackTriage.suggested_priority,
          extracted_access_notes: null,
          is_emergency: fallbackTriage.suggested_priority === 'P1_CRITICAL',
          is_ready_to_submit: false,
        },
      },
      'FAST_TRIAGE'
    );

    const extracted = modelRes.structuredOutput || {};

    // 5. Update State
    if (extracted.extracted_site_id) {
      const match = availableSites.find((s) => s.id === extracted.extracted_site_id);
      if (match) {
        state.site_id = match.id;
        state.site_name = match.name;
      }
    } else if (!state.site_id && message) {
      // Direct text matching against sites
      const lower = message.toLowerCase();
      const match = availableSites.find(
        (s) => lower.includes(s.name.toLowerCase()) || lower.includes((s.city || '').toLowerCase())
      );
      if (match) {
        state.site_id = match.id;
        state.site_name = match.name;
      }
    }

    if (extracted.extracted_location) state.floor_or_location = extracted.extracted_location;
    if (extracted.extracted_issue_summary) state.issue_summary = extracted.extracted_issue_summary;
    if (extracted.extracted_description) state.issue_description = extracted.extracted_description;
    if (extracted.extracted_trade) state.trade = extracted.extracted_trade;
    if (extracted.extracted_priority) state.suggested_priority = extracted.extracted_priority;
    if (extracted.extracted_access_notes) state.access_notes = extracted.extracted_access_notes;
    if (extracted.is_emergency !== undefined) state.is_emergency = extracted.is_emergency;

    // 6. Check for Assets if site is known and trade/location mentioned
    if (state.site_id && state.trade && !state.asset_id) {
      const { data: siteAssets } = await dbQuery<any[]>(
        `assets?site_id=eq.${encodeURIComponent(state.site_id)}&select=id,name,asset_reference,asset_type&limit=5`
      );
      if (siteAssets && siteAssets.length > 0) {
        state.asset_candidates = siteAssets.map((a) => ({
          id: a.id,
          name: a.name,
          reference: a.asset_reference || a.name,
        }));
      }
    }

    // 7. Calculate Deterministic SLA
    const priority = state.suggested_priority || fallbackTriage.suggested_priority;
    state.suggested_priority = priority;
    state.canonical_sla_hours = CANONICAL_SLA_HOURS[priority] || 24;

    // 8. Evaluate Readiness
    state.missing_fields = [];
    if (!state.site_id) state.missing_fields.push('site');
    if (!state.issue_summary && !state.issue_description) state.missing_fields.push('description');

    state.is_ready_to_submit = state.missing_fields.length === 0;

    let replyMessage = extracted.response_message || 'Thank you, I have recorded those details.';
    if (state.is_ready_to_submit && !history.some((h: any) => h.is_summary_prompt)) {
      replyMessage = `I have everything needed to raise this request. Please review the summary below and click 'Report Issue' to submit.`;
    }

    return NextResponse.json({
      reply: replyMessage,
      state,
      available_sites: availableSites.map((s) => ({ id: s.id, name: s.name, city: s.city })),
      is_emergency: state.is_emergency,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
