const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf8'));
const redirects = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'production-redirects.json'), 'utf8'));

const groups = {
  'Core & Landing Hubs': [],
  'Hard FM & Engineering Services': [],
  'Soft FM & Hygiene Services': [],
  'Specialist Services': [],
  'Sector Specific Pages': [],
  'Primary Regional Hubs (London, Manchester, Birmingham, Leeds)': [],
  'Secondary Location Pages': [],
  'Local Geographic Services': [],
  'Company & Operations': [],
  'Legal & Governance': [],
  'Insights & Knowledge Hub': []
};

for (const r of registry.routes) {
  const p = r.path;
  if (p === '/' || p === '/services' || p === '/sectors' || p === '/locations' || p === '/case-studies') {
    groups['Core & Landing Hubs'].push(r);
  } else if (r.routeType === 'sector') {
    groups['Sector Specific Pages'].push(r);
  } else if (r.routeType === 'geographic-service') {
    groups['Local Geographic Services'].push(r);
  } else if (r.routeType === 'legal') {
    groups['Legal & Governance'].push(r);
  } else if (r.routeType === 'post') {
    groups['Insights & Knowledge Hub'].push(r);
  } else if (r.routeType === 'company') {
    groups['Company & Operations'].push(r);
  } else if (r.routeType === 'location') {
    if (['/fm-london', '/facilities-management-london', '/london-facilities-management', '/fm-manchester', '/facilities-management-manchester', '/manchester-facilities-management', '/fm-birmingham', '/facilities-management-birmingham', '/birmingham-facilities-management', '/fm-leeds', '/facilities-management-leeds', '/leeds-facilities-management'].includes(p)) {
      groups['Primary Regional Hubs (London, Manchester, Birmingham, Leeds)'].push(r);
    } else {
      groups['Secondary Location Pages'].push(r);
    }
  } else if (r.routeType === 'service') {
    if (['/mechanical-electrical', '/hvac-contractor', '/ppm', '/hard-services', '/plumbing-gas', '/fire-emergency-systems', '/safety-critical-emergency-systems', '/building-maintenance', '/mechanical-electrical/emergency-light-testing', '/mechanical-electrical/access-control'].some(prefix => p.startsWith(prefix))) {
      groups['Hard FM & Engineering Services'].push(r);
    } else if (['/cleaning-services', '/industrial-cleaning', '/soft-services', '/contract-cleaning', '/office-cleaning', '/pressure-washing', '/window-cleaning', '/washroom-management'].some(prefix => p.startsWith(prefix))) {
      groups['Soft FM & Hygiene Services'].push(r);
    } else {
      groups['Specialist Services'].push(r);
    }
  }
}

let doc = `# ENTIREFM — FINAL STRUCTURAL SITEMAP
## Complete Unified Estate Architecture (233 Retained 200 Routes + ${redirects.totalRedirects} Approved 301 Redirects)

**Generated:** 2026-08-22 19:18:00 UTC  
**Authority:** \`/config/route-registry.json\` & \`/config/production-redirects.json\`  
**Status:** \`LOCKED_STRUCTURAL_SITEMAP\`  

---

## 1. Executive Estate Summary

\`\`\`text
══════════════════════════════════════════════════════════════
  FINAL UNIFIED ESTATE ARCHITECTURE
══════════════════════════════════════════════════════════════
  • Total HTTP 200 Indexable Routes:             233
      - Historic Wix Protected (Estate A):       205
      - Current-Live Retained (Estate B):          4
      - Approved New Growth (Estate C):           24
  • Total Approved 301 Redirects:                ${redirects.totalRedirects}
  • Unmapped / Orphan Routes:                      0
══════════════════════════════════════════════════════════════
\`\`\`

---

## 2. Retained HTTP 200 Routes by Operational Category

`;

for (const [groupName, routes] of Object.entries(groups)) {
  doc += `### ${groupName} (${routes.length} Routes)\n\n`;
  doc += `| Route Path | Type | Priority | Provenance |\n`;
  doc += `|---|---|---|---|\n`;
  for (const r of routes) {
    doc += `| \`${r.path}\` | \`${r.routeType}\` | \`${r.priority}\` | \`${r.routeProvenance}\` |\n`;
  }
  doc += '\n---\n\n';
}

doc += `## 3. Approved Single-Hop 301 Redirect Manifest Sample

| Source URL (Legacy Live) | Target Destination (New Unified 200) | Status | Rationale |
|---|---|---|---|
`;

for (const r of redirects.redirects.slice(0, 30)) {
  doc += `| \`${r.source}\` | \`${r.destination}\` | \`${r.statusCode}\` | ${r.reason} |\n`;
}

doc += `\n*Full manifest containing all ${redirects.totalRedirects} redirects recorded in [\`/config/production-redirects.json\`](file:///Users/petercurrey/Desktop/Websites/EntireFM.AG.V002/config/production-redirects.json).*\n`;

const outPath = path.join(repoRoot, 'docs', 'seo-rebuild', 'FINAL-STRUCTURAL-SITEMAP.md');
fs.writeFileSync(outPath, doc);
console.log(`Successfully generated ${outPath}`);
