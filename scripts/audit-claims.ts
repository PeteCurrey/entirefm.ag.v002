import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(__dirname, '../src');

const SUSPICIOUS_PATTERNS = [
  { name: 'Generic AI Cliché', pattern: /in today's (?:fast-paced|rapidly evolving|digital|dynamic)/i },
  { name: 'AI Filler', pattern: /delve into/i },
  { name: 'AI Filler', pattern: /unlock(?:ing)? (?:the )?(?:true )?power/i },
  { name: 'AI Filler', pattern: /testament to (?:our|their)/i },
  { name: 'AI Filler', pattern: /game-?chang/i },
  { name: 'AI Filler', pattern: /revolutioniz/i },
  { name: 'AI SaaS Hype', pattern: /supercharge/i },
  { name: 'AI SaaS Hype', pattern: /all-in-one platform/i },
  { name: 'AI SaaS Hype', pattern: /next-gen(?:eration)? AI/i },
  { name: 'AI SaaS Hype', pattern: /magic(?:ally)?/i },
  { name: 'AI SaaS Hype', pattern: /effortlessly/i },
  { name: 'AI SaaS Hype', pattern: /seamlessly/i },
  { name: 'AI SaaS Hype', pattern: /cutting-edge/i },
  { name: 'AI SaaS Hype', pattern: /skyrocket/i },
  { name: 'Unsubstantiated Guarantee', pattern: /guaranteed \d+%/i },
  { name: 'Unverified Exclusivity', pattern: /only (?:company|provider) in the UK/i },
  { name: 'Fake Social Proof Metric', pattern: /trusted by \d+[\+,]\d+/i },
  { name: 'Fake Social Proof Metric', pattern: /99\.9\d*% uptime/i },
  { name: 'Fake Review Pattern', pattern: /5\/5 stars from \d+/i },
];

function scanFiles(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanFiles(full, fileList);
      }
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      fileList.push(full);
    }
  }
  return fileList;
}

const allFiles = scanFiles(SRC_DIR);
interface Finding {
  file: string;
  line: number;
  patternName: string;
  snippet: string;
}

const findings: Finding[] = [];

for (const file of allFiles) {
  // Skip the factcheck definition itself and audit scripts
  if (file.includes('factcheck.ts') || file.includes('audit-')) continue;

  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((lineText, idx) => {
    for (const pat of SUSPICIOUS_PATTERNS) {
      if (pat.pattern.test(lineText)) {
        findings.push({
          file: path.relative(SRC_DIR, file),
          line: idx + 1,
          patternName: pat.name,
          snippet: lineText.trim().substring(0, 140)
        });
      }
    }
  });
}

console.log(`\n=== CONTENT AUDIT: SUSPICIOUS / AI SAAS / FALSE CLAIM PATTERNS (${findings.length}) ===\n`);
for (const f of findings) {
  console.log(`[${f.patternName}] ${f.file}:${f.line}`);
  console.log(`   "${f.snippet}"\n`);
}
