#!/usr/bin/env node
/**
 * CONTACT DETAILS VERIFICATION TEST
 * =================================
 * Enforces zero-tolerance policy against placeholder contact strings in production codebase.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');

const FORBIDDEN_PATTERNS = [
  /\[PHONE\s*TO\s*VERIFY\]/i,
  /\[PHONE\s*NUMBER\s*TO\s*VERIFY\]/i,
  /\[0800\s*NUMBER\s*TO\s*VERIFY\]/i,
  /\[LONDON\s*DIRECT\s*LINE\s*TO\s*VERIFY\]/i,
  /\[REGIONAL\s*DIRECT\s*LINE\s*TO\s*VERIFY\]/i,
  /\[OFFICIAL\s*EMAIL\s*TO\s*VERIFY\]/i,
  /0800\s*000\s*0000/,
  /tel:0800000000/,
];

function scanDirectory(dir) {
  let violations = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        violations = violations.concat(scanDirectory(fullPath));
      }
    } else if (entry.isFile() && /\.(tsx?|jsx?|json|md)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        for (const pattern of FORBIDDEN_PATTERNS) {
          if (pattern.test(line)) {
            violations.push({
              file: path.relative(repoRoot, fullPath),
              line: idx + 1,
              content: line.trim(),
              pattern: pattern.toString(),
            });
          }
        }
      });
    }
  }

  return violations;
}

console.log('══════════════════════════════════════════════════════════════');
console.log('  CONTACT DETAILS VERIFICATION AUDIT');
console.log('══════════════════════════════════════════════════════════════');

const violations = scanDirectory(srcDir);

if (violations.length > 0) {
  console.error(`\n❌ FAILED: Found ${violations.length} placeholder contact string violations in src/:\n`);
  violations.forEach(v => {
    console.error(`  • ${v.file}:${v.line} -> "${v.content}" (matches ${v.pattern})`);
  });
  process.exit(1);
} else {
  console.log('\n✓ PASS: Zero placeholder phone numbers or emails found in src/.');
  console.log('══════════════════════════════════════════════════════════════');
  process.exit(0);
}
