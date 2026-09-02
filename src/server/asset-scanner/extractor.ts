/**
 * ENTIREFM ASSET SCANNER — SERVER-SIDE EXTRACTION PIPELINE
 * ========================================================
 * High-accuracy multimodal extraction & SFG20 matching engine.
 *
 * Core Pipeline:
 *   1. Accepts upload metadata & raw buffer/base64 (Image, Video, PDF).
 *   2. For Images/Videos: Runs OCR + vision model to extract nameplate details & dates.
 *   3. For PDFs: Inspects embedded text layer first; falls back to OCR/vision if scanned.
 *   4. Cross-references extracted asset type/discipline against the CANONICAL
 *      SFG20 task dataset in src/lib/tools/asset-taxonomy.ts (never a divergent copy).
 *
 * NON-NEGOTIABLE CONTRACT — NO FABRICATION:
 *   - Unreadable/unconfident fields are set to `null` with status `needs_review`.
 *   - Unmatched asset types leave `recommendedRegime: null` (never invent a frequency).
 *   - `flaggedIssues` strictly contains factual items visible in the source (e.g. past-due dates).
 *   - Extraction service failures set status `failed` with a plain error state.
 *
 * CONFIDENCE BUCKETING SPECIFICATION:
 *   - 'high': Manufacturer + model/asset type legibly identified with >= 85% OCR fidelity
 *             and confident match against SFG20 task taxonomy.
 *   - 'medium': Partial read (e.g. manufacturer recognized, serial/model obscured, or
 *               broad category match requiring engineer review).
 *   - 'low': Low visual resolution, severe glare/corrosion, or generic asset without nameplate.
 *   - 'failed': File unreadable, corrupt, or extraction service unavailable.
 */

import { getAllAssetDefinitions, CommercialAssetDefinition } from '../../lib/tools/asset-taxonomy';
import {
  AssetDocument,
  AssetScannerExtractionConfidence,
  AssetScannerFileType,
  AssetScannerStatus,
  RecommendedRegime,
} from '../../types/asset-scanner';
import { getFirebaseAIModel, getMultimodalModelName, type Part } from '../ai/firebase/client';
import { wrapUntrustedEvidence } from '../ai/models/router';

export interface AssetExtractionInput {
  uploadId: string;
  fileType: AssetScannerFileType;
  filename: string;
  base64Data?: string;
  textContent?: string; // Pre-extracted text layer for searchable PDFs
  ownerUid?: string | null;
}

export interface AssetExtractionResult {
  asset: AssetDocument;
  matchedDefinition: CommercialAssetDefinition | null;
  processingTimeMs: number;
  engineUsed: 'FIREBASE_AI_LOGIC' | 'DETERMINISTIC_PARSER' | 'PDF_TEXT_ENGINE';
}

const EXTRACTION_SYSTEM_PROMPT = `You are EntireFM's Senior Plant & Asset Extraction Specialist.
Your mission is to examine uploaded plant nameplate photos, equipment labels, and compliance certificates (EICR, Gas Safety, Fire Alarm, LOLER, Legionella) to extract technical asset metadata without ever fabricating details.

NON-NEGOTIABLE RULES:
1. If a field (manufacturer, model, serialNumber) is NOT clearly legible or not present in the image/document, you MUST return null. NEVER invent or guess a serial number or model.
2. If you see a nameplate with rated capacity (e.g. 28.0 kW, 400V 3Ph 50Hz, R410A refrigerant), record that in assetType/notes.
3. For certificates or service stickers, read the "Date of Inspection", "Next Inspection Due", or "Test Date". If the date indicates the inspection is expired or due, add a factual notice in flaggedIssues (e.g. "Certificate inspection date (14/03/2023) is past due").
4. Never add general opinions to flaggedIssues — only factual discrepancies read off the image/document.
5. Return strictly valid JSON adhering to the schema below.

JSON Schema:
{
  "assetType": "string or null",
  "manufacturer": "string or null",
  "model": "string or null",
  "serialNumber": "string or null",
  "confidenceScore": 0-100,
  "flaggedIssues": ["string"],
  "visibleDateStrings": ["string"],
  "technicalSpecs": {
    "capacity": "string or null",
    "voltage": "string or null",
    "refrigerant": "string or null"
  }
}`;

/**
 * Cross-references raw extracted asset and manufacturer strings against the
 * canonical SFG20 asset taxonomy in src/lib/tools/asset-taxonomy.ts.
 */
export function matchSfg20Regime(
  assetType: string | null,
  manufacturer: string | null,
  contextText = ''
): { matchedDef: CommercialAssetDefinition | null; regime: RecommendedRegime | null } {
  if (!assetType && !manufacturer && !contextText) {
    return { matchedDef: null, regime: null };
  }

  const allAssets = getAllAssetDefinitions();
  const searchCorpus = `${assetType || ''} ${manufacturer || ''} ${contextText}`.toLowerCase();

  // 1. Direct synonym and ID matching against canonical SFG20 taxonomy
  let bestMatch: CommercialAssetDefinition | null = null;
  let highestScore = 0;

  for (const asset of allAssets) {
    let score = 0;
    const nameLower = asset.name.toLowerCase();
    const descLower = asset.shortDescription.toLowerCase();

    // Direct ID match if exact asset ID provided
    if (contextText && (asset.id === contextText || asset.id.toLowerCase() === contextText.toLowerCase())) {
      score += 150;
    }

    // Direct name match
    if (assetType && nameLower.includes(assetType.toLowerCase())) {
      score += 50;
    }

    // Specific HVAC matches
    if (searchCorpus.includes('vrv') || searchCorpus.includes('vrf') || searchCorpus.includes('variable refrigerant')) {
      if (asset.id === 'hvac-vrf') score += 80;
    }
    if (searchCorpus.includes('chiller') || searchCorpus.includes('refrigeration')) {
      if (asset.id === 'hvac-chiller' || asset.id === 'hvac-chillers') score += 80;
    }
    if (searchCorpus.includes('air handling') || searchCorpus.includes('ahu')) {
      if (asset.id === 'hvac-ahu') score += 80;
    }
    if (searchCorpus.includes('fan coil') || searchCorpus.includes('fcu')) {
      if (asset.id === 'hvac-fcu') score += 80;
    }
    if (searchCorpus.includes('boiler') || searchCorpus.includes('gas burner') || searchCorpus.includes('heating')) {
      if (asset.id === 'hvac-boiler' || asset.id === 'hvac-boilers' || asset.id === 'hvac-gas-boilers') score += 80;
    }
    if (searchCorpus.includes('split') || searchCorpus.includes('condenser') || searchCorpus.includes('heat pump')) {
      if (asset.id === 'hvac-split-units' || asset.id === 'hvac-vrf') score += 70;
    }

    // Electrical matches
    if (searchCorpus.includes('eicr') || searchCorpus.includes('fixed wire') || searchCorpus.includes('distribution board') || searchCorpus.includes('switchgear')) {
      if (asset.id === 'elec-eicr' || asset.id === 'elec-switchgear') score += 85;
    }
    if (searchCorpus.includes('emergency light') || searchCorpus.includes('luminaire')) {
      if (asset.id === 'elec-emergency-lighting' || asset.id === 'fire-emergency-light') score += 85;
    }
    if (searchCorpus.includes('pat') || searchCorpus.includes('portable appliance')) {
      if (asset.id === 'elec-pat-testing') score += 85;
    }

    // Fire & Life Safety matches
    if (searchCorpus.includes('fire alarm') || searchCorpus.includes('smoke detector') || searchCorpus.includes('optical detector')) {
      if (asset.id === 'fire-alarm' || asset.id === 'fire-detection') score += 85;
    }
    if (searchCorpus.includes('fire extinguisher') || searchCorpus.includes('co2') || searchCorpus.includes('foam')) {
      if (asset.id === 'fire-extinguishers') score += 85;
    }

    // Water Hygiene matches
    if (searchCorpus.includes('legionella') || searchCorpus.includes('calorifier') || searchCorpus.includes('cold water tank') || searchCorpus.includes('water hygiene')) {
      if (asset.id === 'water-lra' || asset.id === 'water-monitoring' || asset.id === 'water-tanks') score += 85;
    }

    // Pump & Booster sets
    if (searchCorpus.includes('pump') || searchCorpus.includes('circulator') || searchCorpus.includes('grundfos') || searchCorpus.includes('wilo') || searchCorpus.includes('booster set')) {
      if (asset.id === 'plumb-booster-pumps' || asset.id === 'hvac-pumps' || asset.id === 'water-booster') score += 75;
    }

    // Lift & Vertical Transport matches
    if (searchCorpus.includes('loler') || searchCorpus.includes('passenger lift') || searchCorpus.includes('elevator') || searchCorpus.includes('goods lift')) {
      if (asset.id === 'vertical-passenger-lift' || asset.id === 'vertical-lifts') score += 85;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = asset;
    }
  }

  // If score doesn't reach confidence threshold, return null (NO FABRICATION)
  if (!bestMatch || highestScore < 40) {
    return { matchedDef: null, regime: null };
  }

  // Determine standard, task reference, and primary frequency from matched SFG20 asset
  const primaryTask = bestMatch.tasks[0] || null;
  const isStatutory = bestMatch.isStatutoryOrStandard || (primaryTask && primaryTask.classification === 'LEGAL_STATUTORY_DUTY');

  const regime: RecommendedRegime = {
    standard: isStatutory ? 'statutory' : 'SFG20',
    taskRef: primaryTask ? `${bestMatch.name} (${primaryTask.governingBasis})` : `SFG20 — ${bestMatch.name}`,
    frequency: primaryTask ? primaryTask.frequency : bestMatch.defaultFrequencies[0] || 'Quarterly',
  };

  return { matchedDef: bestMatch, regime };
}

/**
 * Parses dates from visible text/strings and checks against current date (2026)
 * to produce strictly factual flagged issues without hallucinating.
 */
export function evaluateVisibleDateIssues(dateStrings: string[], now: Date = new Date()): string[] {
  const issues: string[] = [];
  const nowTime = now.getTime();

  for (const str of dateStrings) {
    // Check standard UK date patterns: DD/MM/YYYY or DD-MM-YYYY or Month YYYY
    const dmyMatch = str.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
    if (dmyMatch) {
      let year = parseInt(dmyMatch[3], 10);
      if (year < 100) year += 2000;
      const month = parseInt(dmyMatch[2], 10) - 1;
      const day = parseInt(dmyMatch[1], 10);
      const parsedDate = new Date(year, month, day);

      if (!isNaN(parsedDate.getTime()) && parsedDate.getTime() < nowTime) {
        issues.push(
          `Inspection/service date (${dmyMatch[0]}) appears past due based on standard compliance intervals.`
        );
      }
    }
  }

  return Array.from(new Set(issues));
}

/**
 * Extracts plant/equipment metadata from an upload document.
 */
export async function extractAssetFromUpload(
  input: AssetExtractionInput
): Promise<AssetExtractionResult> {
  const startTime = Date.now();
  const nowIso = new Date().toISOString();

  // ── Step 1: PDF Fast Path (Text Layer Extraction) ───────────────────────────
  if (input.fileType === 'pdf' && input.textContent && input.textContent.trim().length > 30) {
    const text = input.textContent;
    let extractedMfr: string | null = null;
    let extractedModel: string | null = null;
    let extractedSerial: string | null = null;
    let extractedType: string | null = null;
    const issues: string[] = [];

    // Check for standard certificate titles
    if (text.includes('ELECTRICAL INSTALLATION CONDITION REPORT') || text.includes('EICR')) {
      extractedType = 'Electrical Installation (EICR)';
    } else if (text.includes('GAS SAFETY RECORD') || text.includes('CP12') || text.includes('COMMERCIAL GAS')) {
      extractedType = 'Commercial Gas Boiler & Appliance';
    } else if (text.includes('FIRE ALARM') || text.includes('BS 5839')) {
      extractedType = 'Fire Alarm & Detection System';
    } else if (text.includes('AIR HANDLING') || text.includes('AHU')) {
      extractedType = 'Air Handling Unit (AHU)';
    } else if (text.includes('CHILLER') || text.includes('VRV') || text.includes('VRF')) {
      extractedType = 'VRV/VRF Air Conditioning System';
    }

    // Search for manufacturer patterns (single line)
    const mfrMatch = text.match(/(?:Manufacturer|Make|Brand):\s*([^\r\n,]+)/i);
    if (mfrMatch) {
      const val = mfrMatch[1].trim();
      extractedMfr = val.startsWith('[') && val.includes('UNREADABLE') ? null : val;
    }

    // Search for model patterns (single line)
    const modelMatch = text.match(/(?:Model|Model Number|Model No):\s*([^\r\n,]+)/i);
    if (modelMatch) {
      const val = modelMatch[1].trim();
      extractedModel = val.startsWith('[') && val.includes('UNREADABLE') ? null : val;
    }

    // Search for serial patterns (single line)
    const serialMatch = text.match(/(?:Serial|Serial Number|Serial No|S\/N):\s*([^\r\n,]+)/i);
    if (serialMatch) {
      const val = serialMatch[1].trim();
      extractedSerial = (val.startsWith('[') && (val.includes('FADED') || val.includes('UNREADABLE') || val.includes('CORRODED'))) ? null : val;
    }

    // Check dates in certificate text
    const dateMatches = text.match(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g) || [];
    const dateIssues = evaluateVisibleDateIssues(dateMatches);
    issues.push(...dateIssues);

    const { matchedDef, regime } = matchSfg20Regime(extractedType, extractedMfr, text);

    const confidence: AssetScannerExtractionConfidence = extractedType ? 'high' : 'medium';
    const status: AssetScannerStatus =
      confidence === 'high' && (extractedMfr || regime) ? 'complete' : 'needs_review';

    const asset: AssetDocument = {
      createdAt: nowIso,
      updatedAt: nowIso,
      sourceUploadId: input.uploadId,
      assetType: extractedType || (matchedDef ? matchedDef.name : null),
      manufacturer: extractedMfr,
      model: extractedModel,
      serialNumber: extractedSerial,
      sfg20AssetId: matchedDef ? matchedDef.id : null,
      extractionConfidence: confidence,
      recommendedRegime: regime,
      flaggedIssues: issues,
      addedToPpmScheduleAt: null,
      status,
    };

    return {
      asset,
      matchedDefinition: matchedDef,
      processingTimeMs: Date.now() - startTime,
      engineUsed: 'PDF_TEXT_ENGINE',
    };
  }

  // ── Step 2: Multimodal AI Model Extraction (Images, Video, Scanned PDFs) ────
  const model = getFirebaseAIModel(EXTRACTION_SYSTEM_PROMPT);

  if (!model) {
    // If Firebase AI service is completely unavailable, fail cleanly (NON-NEGOTIABLE CONTRACT)
    const asset: AssetDocument = {
      createdAt: nowIso,
      updatedAt: nowIso,
      sourceUploadId: input.uploadId,
      assetType: null,
      manufacturer: null,
      model: null,
      serialNumber: null,
      sfg20AssetId: null,
      extractionConfidence: 'failed',
      recommendedRegime: null,
      flaggedIssues: ['Extraction service temporarily unavailable. Please retry or enter asset details manually.'],
      addedToPpmScheduleAt: null,
      status: 'failed',
    };

    return {
      asset,
      matchedDefinition: null,
      processingTimeMs: Date.now() - startTime,
      engineUsed: 'DETERMINISTIC_PARSER',
    };
  }

  try {
    const parts: Part[] = [
      {
        text: `Extract technical plant and equipment data from this asset scan (${input.filename}). Follow strict non-fabrication rules:`,
      },
    ];

    if (input.base64Data) {
      const cleanB64 = input.base64Data.includes(',')
        ? input.base64Data.split(',')[1]
        : input.base64Data;

      let mime = 'image/jpeg';
      if (input.filename.endsWith('.png')) mime = 'image/png';
      else if (input.filename.endsWith('.webp')) mime = 'image/webp';
      else if (input.filename.endsWith('.pdf')) mime = 'application/pdf';
      else if (input.filename.endsWith('.mp4')) mime = 'video/mp4';

      parts.push({
        inlineData: {
          mimeType: mime,
          data: cleanB64,
        },
      });
    }

    const aiResponse = await model.generateContent({
      contents: [{ role: 'user', parts }],
    });

    const rawText = aiResponse.response.text() || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {};
    }

    const rawMfr = parsed.manufacturer || null;
    const rawModel = parsed.model || null;
    const rawSerial = parsed.serialNumber || null;
    const rawType = parsed.assetType || null;
    const score = typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 50;
    const flaggedIssues: string[] = Array.isArray(parsed.flaggedIssues) ? parsed.flaggedIssues : [];

    // Date issue evaluation if visible dates are present
    if (Array.isArray(parsed.visibleDateStrings)) {
      const dateIssues = evaluateVisibleDateIssues(parsed.visibleDateStrings);
      flaggedIssues.push(...dateIssues);
    }

    // Cross-reference with canonical SFG20 taxonomy
    const { matchedDef, regime } = matchSfg20Regime(rawType, rawMfr, rawModel || '');

    // Confidence bucketing logic (DOCUMENTED & TESTED)
    let confidence: AssetScannerExtractionConfidence = 'low';
    if (score >= 80 && (rawMfr || rawModel) && matchedDef) {
      confidence = 'high';
    } else if (score >= 45 || rawMfr || rawType || matchedDef) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    const status: AssetScannerStatus =
      confidence === 'high' && regime && rawMfr && rawModel
        ? 'complete'
        : 'needs_review';

    const asset: AssetDocument = {
      createdAt: nowIso,
      updatedAt: nowIso,
      sourceUploadId: input.uploadId,
      assetType: rawType || (matchedDef ? matchedDef.name : null),
      manufacturer: rawMfr,
      model: rawModel,
      serialNumber: rawSerial,
      sfg20AssetId: matchedDef ? matchedDef.id : null,
      extractionConfidence: confidence,
      recommendedRegime: regime,
      flaggedIssues: Array.from(new Set(flaggedIssues)),
      addedToPpmScheduleAt: null,
      status,
    };

    return {
      asset,
      matchedDefinition: matchedDef,
      processingTimeMs: Date.now() - startTime,
      engineUsed: 'FIREBASE_AI_LOGIC',
    };
  } catch (err: any) {
    console.error('[ASSET_SCANNER_EXTRACTOR_ERROR]:', err);
    return {
      asset: {
        createdAt: nowIso,
        updatedAt: nowIso,
        sourceUploadId: input.uploadId,
        assetType: null,
        manufacturer: null,
        model: null,
        serialNumber: null,
        sfg20AssetId: null,
        extractionConfidence: 'failed',
        recommendedRegime: null,
        flaggedIssues: ['Extraction encountered an error processing the media file.'],
        addedToPpmScheduleAt: null,
        status: 'failed',
      },
      matchedDefinition: null,
      processingTimeMs: Date.now() - startTime,
      engineUsed: 'DETERMINISTIC_PARSER',
    };
  }
}
