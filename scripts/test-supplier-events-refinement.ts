import fs from 'fs';
import path from 'path';

function runAudit() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  ENTIREFM SUPPLIER EVENTS PAGE AUDIT & VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  let errors = 0;
  const filePath = path.join(process.cwd(), 'src/components/suppliers/events/PastEventsArchiveSection.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check 1: Defensive copy removed
  const defensivePhrases = [
    'does not invent supplier engagement from scratch',
    'from scratch',
    'invent supplier engagement',
    'we haven’t invented',
    'we have not invented'
  ];

  for (const phrase of defensivePhrases) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      console.error(`❌ Found defensive phrase: "${phrase}"`);
      errors++;
    } else {
      console.log(`✅ Clean: Defensive phrase "${phrase}" is absent`);
    }
  }

  // Check 2: Replacement copy verified
  const expectedReplacement = 'The EntireFM Partner Network formalises and builds on years of supplier breakfasts';
  if (content.includes(expectedReplacement)) {
    console.log(`✅ Verified: Confident replacement copy is present`);
  } else {
    console.error(`❌ Missing expected replacement copy: "${expectedReplacement}"`);
    errors++;
  }

  // Check 3: 2025 and 2026 events present
  const required2026Titles = [
    'Supplier Breakfast Morning — Relationship, Standards & Service Delivery',
    'Manufacturer Open Day — Commercial Electrical & Technical Solutions',
    'Partner Training Day — Supplier Development & Technical Knowledge',
    'Industry Collaboration Session — Innovation, Technology & FM Operations'
  ];

  for (const title of required2026Titles) {
    if (content.includes(title)) {
      console.log(`✅ 2026 Event Present: "${title}"`);
    } else {
      console.error(`❌ Missing 2026 Event: "${title}"`);
      errors++;
    }
  }

  const required2025Titles = [
    'London Supplier & Industry Evening',
    'Manufacturer Partner Day — Electrical Systems & Product Development',
    'Supplier Breakfast — Regional Performance, Service Standards & Growth',
    'Technical Training Workshop — Equipment, Compliance & Safe Delivery'
  ];

  for (const title of required2025Titles) {
    if (content.includes(title)) {
      console.log(`✅ 2025 Event Present: "${title}"`);
    } else {
      console.error(`❌ Missing 2025 Event: "${title}"`);
      errors++;
    }
  }

  // Check 4: Year filter includes all required years
  const requiredYears = ["'all'", "'2026'", "'2025'", "'2024'", "'2023'", "'2022'", "'2021'"];
  for (const yr of requiredYears) {
    if (content.includes(yr)) {
      console.log(`✅ Year Filter contains: ${yr}`);
    } else {
      console.error(`❌ Year Filter missing: ${yr}`);
      errors++;
    }
  }

  // Check 5: No font-mono in PastEventsArchiveSection
  if (content.includes('font-mono')) {
    console.error(`❌ Found stray font-mono in PastEventsArchiveSection.tsx`);
    errors++;
  } else {
    console.log(`✅ Typography: No font-mono in PastEventsArchiveSection.tsx (aligned to Work Sans)`);
  }

  console.log('\n───────────────────────────────────────────────────────────────');
  if (errors === 0) {
    console.log('  🎉 ALL SUPPLIER EVENTS AUDIT CHECKS PASSED (0 ERRORS)');
    console.log('───────────────────────────────────────────────────────────────\n');
    process.exit(0);
  } else {
    console.error(`  ⚠️ AUDIT FAILED WITH ${errors} ERROR(S)`);
    console.log('───────────────────────────────────────────────────────────────\n');
    process.exit(1);
  }
}

runAudit();
