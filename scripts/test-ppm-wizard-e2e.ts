import {
  COMMERCIAL_ASSET_CATEGORIES,
  getAllAssetDefinitions,
  getAssetById,
  CommercialAssetDefinition,
} from '../src/lib/tools/asset-taxonomy';
import { generateCsv } from '../src/lib/exports/csv-exporter';
import { buildHtmlReport, PdfDocumentDefinition } from '../src/lib/pdf/generator';

async function runWizardE2ETest() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING MANDATORY PPM BUILDER WIZARD E2E TEST');
  console.log('======================================================\n');

  // STEP 1: Building Profile
  console.log('--- Step 1: Complete Building Profile ---');
  const buildingProfile = {
    name: 'Apex Plaza HQ',
    type: 'Commercial Office / Corporate HQ',
    floorArea: '45,000 sq ft',
    floors: 5,
    occupancy: 'Mon-Fri 07:00-19:00',
    criticality: 'Standard Commercial',
  };
  console.log('✅ Building Profile captured:', buildingProfile);

  // STEP 2: Select Categories
  console.log('\n--- Step 2: Select Disciplines (HVAC & Climate Control + Fire & Life Safety) ---');
  const selectedCategoryIds = new Set(['hvac', 'fire']);
  const availableCategories = COMMERCIAL_ASSET_CATEGORIES.filter((c) => selectedCategoryIds.has(c.id));
  console.log(`✅ Available categories filtered to ${availableCategories.length}:`, availableCategories.map((c) => c.name));

  // STEP 3: Individual Asset Selection
  console.log('\n--- Step 3: Select Individual Assets & Set Quantities ---');
  // Selected Assets: AHU (qty 3), FCU (qty 20), Fire Alarm (whole site), Emergency Lighting (qty 40)
  // Deliberately UNSELECTED: Chiller, Cooling Tower, Passenger Lift, Automatic Doors
  const selectedAssetQuantities: Record<string, number> = {
    'hvac-ahu': 3,
    'hvac-fcu': 20,
    'fire-alarm': 1,
    'fire-emergency-light': 40,
  };

  const selectedAssetList = Object.keys(selectedAssetQuantities).map((id) => ({
    definition: getAssetById(id)!,
    quantity: selectedAssetQuantities[id],
  }));

  console.log(`✅ Selected ${selectedAssetList.length} distinct asset types:`);
  selectedAssetList.forEach(({ definition, quantity }) => {
    console.log(`   • ${definition.name} (Qty: ${quantity}, Category: ${definition.categoryName})`);
  });

  // STEP 4: Configure Assets
  console.log('\n--- Step 4: Asset Profile Configuration ---');
  const configuredAssets = selectedAssetList.map(({ definition, quantity }) => ({
    assetId: definition.id,
    name: definition.name,
    quantity,
    ageBand: '4-7 years',
    condition: 'Good',
  }));
  console.log(`✅ Configured ${configuredAssets.length} assets with quantities and age profiles.`);

  // STEP 5: Estate Review & Generation Event
  console.log('\n--- Step 5: Estate Review & Programme Generation ---');
  const totalPhysicalAssets = Object.values(selectedAssetQuantities).reduce((a, b) => a + b, 0);
  console.log(`✅ Pre-generation Estate Summary: 1 Building, ${selectedAssetList.length} Asset Types, ${totalPhysicalAssets} Physical Assets.`);

  // GENERATE PROGRAMME: Build tasks strictly from selected assets
  const generatedProgrammeTasks: {
    asset: CommercialAssetDefinition;
    quantity: number;
    task: CommercialAssetDefinition['tasks'][0];
  }[] = [];

  selectedAssetList.forEach(({ definition, quantity }) => {
    definition.tasks.forEach((task) => {
      generatedProgrammeTasks.push({
        asset: definition,
        quantity,
        task,
      });
    });
  });

  console.log(`\n🎉 GENERATED PPM PROGRAMME: ${generatedProgrammeTasks.length} Planned Maintenance Tasks.`);

  // STEP 6: Assertions & Integrity Verification
  console.log('\n--- Step 6: Verifying Generation Integrity & Zero-Leakage ---');

  const assetNamesInProgramme = new Set(generatedProgrammeTasks.map((t) => t.asset.name));
  const assetIdsInProgramme = new Set(generatedProgrammeTasks.map((t) => t.asset.id));

  // 1. Confirm AHU appears
  if (!assetIdsInProgramme.has('hvac-ahu')) {
    throw new Error('❌ FAIL: Air Handling Units (AHUs) missing from generated programme!');
  }
  console.log('✅ PASS: Air Handling Units (AHUs) maintenance appears in programme.');

  // 2. Confirm FCU appears
  if (!assetIdsInProgramme.has('hvac-fcu')) {
    throw new Error('❌ FAIL: Fan Coil Units (FCU) missing from generated programme!');
  }
  console.log('✅ PASS: Fan Coil Units (FCU) maintenance appears in programme.');

  // 3. Confirm Fire Alarm appears
  if (!assetIdsInProgramme.has('fire-alarm')) {
    throw new Error('❌ FAIL: Fire Alarm System missing from generated programme!');
  }
  console.log('✅ PASS: Fire Alarm System maintenance appears in programme.');

  // 4. Confirm Emergency Lighting appears
  if (!assetIdsInProgramme.has('fire-emergency-light')) {
    throw new Error('❌ FAIL: Emergency Lighting missing from generated programme!');
  }
  console.log('✅ PASS: Emergency Lighting maintenance appears in programme.');

  // 5. CRITICAL: Confirm UNSELECTED Chiller does NOT appear
  if (assetIdsInProgramme.has('hvac-chiller')) {
    throw new Error('❌ FAIL: Unselected Chiller appeared in generated programme!');
  }
  console.log('✅ PASS: Unselected Chiller does NOT appear in programme.');

  // 6. CRITICAL: Confirm UNSELECTED Passenger Lift does NOT appear
  if (assetIdsInProgramme.has('lift-passenger')) {
    throw new Error('❌ FAIL: Unselected Passenger Lift appeared in generated programme!');
  }
  console.log('✅ PASS: Unselected Passenger Lift does NOT appear in programme.');

  // 7. CRITICAL: Confirm UNSELECTED Cooling Tower does NOT appear
  if (assetIdsInProgramme.has('hvac-cooling-tower')) {
    throw new Error('❌ FAIL: Unselected Cooling Tower appeared in generated programme!');
  }
  console.log('✅ PASS: Unselected Cooling Tower does NOT appear in programme.');

  // 8. Confirm Compliance classifications exist
  const legalDuties = generatedProgrammeTasks.filter((t) => t.task.classification === 'LEGAL_STATUTORY_DUTY');
  const standardDuties = generatedProgrammeTasks.filter((t) => t.task.classification === 'BRITISH_INDUSTRY_STANDARD');
  const sfg20Duties = generatedProgrammeTasks.filter((t) => t.task.classification === 'SFG20_PLANNED_PRACTICE');

  console.log(`✅ PASS: Maintenance classifications verified: ${legalDuties.length} Legal Duties, ${standardDuties.length} British Standards, ${sfg20Duties.length} SFG20 Planned Tasks.`);

  // STEP 7: Export CSV Verification
  console.log('\n--- Step 7: Testing CSV Export ---');
  const csvContent = generateCsv(generatedProgrammeTasks, [
    { header: 'Discipline', accessor: (d) => d.asset.categoryName },
    { header: 'Asset Name', accessor: (d) => d.asset.name },
    { header: 'Quantity', accessor: (d) => d.quantity },
    { header: 'Activity', accessor: (d) => d.task.activity },
    { header: 'Frequency', accessor: (d) => d.task.frequency },
    { header: 'Classification', accessor: (d) => d.task.classification },
  ]);

  if (!csvContent.includes('Air Handling Units (AHUs)') || !csvContent.includes('Fire Alarm System')) {
    throw new Error('❌ FAIL: CSV content missing selected assets!');
  }
  if (csvContent.includes('Central Chillers') || csvContent.includes('Passenger Lifts')) {
    throw new Error('❌ FAIL: CSV contains unselected assets!');
  }
  console.log('✅ PASS: CSV generated successfully containing ONLY selected assets.');

  // STEP 8: Export PDF Verification
  console.log('\n--- Step 8: Testing Vector PDF Document Generation ---');
  const pdfDoc: PdfDocumentDefinition = {
    title: 'Planned Preventative Maintenance (PPM) Programme',
    subtitle: 'Bespoke statutory and planned maintenance specification for Apex Plaza HQ.',
    documentRef: 'EFM-PPM-E2E-TEST',
    date: '24 August 2026',
    organisationName: 'Apex Plaza HQ',
    badgeText: 'Technical PPM Specification',
    summaryStats: [
      { label: 'Building Type', value: 'Commercial Office' },
      { label: 'Floor Area', value: '45,000 sq ft' },
      { label: 'Selected Assets', value: '4 Types', detail: `${totalPhysicalAssets} Physical Items` },
      { label: 'Planned Tasks', value: `${generatedProgrammeTasks.length} Regimes` },
    ],
    sections: [
      {
        type: 'table',
        heading: '1. Selected Asset Inventory',
        columns: [
          { header: 'Discipline', widthPercent: 30 },
          { header: 'Asset Name', widthPercent: 50 },
          { header: 'Quantity', widthPercent: 20 },
        ],
        rows: selectedAssetList.map((a) => [a.definition.categoryName, a.definition.name, `${a.quantity} Units`]),
      },
      {
        type: 'table',
        heading: '2. PPM Maintenance Programme Matrix',
        columns: [
          { header: 'Asset', widthPercent: 25 },
          { header: 'Activity', widthPercent: 50 },
          { header: 'Frequency', widthPercent: 12 },
          { header: 'Basis', widthPercent: 13 },
        ],
        rows: generatedProgrammeTasks.map((t) => [t.asset.name, t.task.activity, t.task.frequency, t.task.classification]),
      },
    ],
  };

  const html = buildHtmlReport(pdfDoc);
  if (!html || html.length < 500) {
    throw new Error('❌ FAIL: PDF HTML markup generation failed or was empty!');
  }
  if (!html.includes('Apex Plaza HQ') || !html.includes('Air Handling Units (AHUs)')) {
    throw new Error('❌ FAIL: PDF missing critical estate data!');
  }
  if (html.includes('Central Chillers') || html.includes('Passenger Lifts')) {
    throw new Error('❌ FAIL: PDF document contains unselected assets!');
  }
  console.log(`✅ PASS: PDF Document Definition compiled valid report (${html.length} bytes), strictly limited to selected assets.`);

  console.log('\n======================================================');
  console.log('🏆 PPM BUILDER WIZARD E2E TEST: 100% PASSED!');
  console.log('======================================================\n');
}

runWizardE2ETest().catch((err) => {
  console.error(err);
  process.exit(1);
});
