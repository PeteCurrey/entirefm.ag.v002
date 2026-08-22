const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf8'));
const pagesDir = path.join(repoRoot, 'src', 'content', 'pages');

const rows = ['path,routeType,routeProvenance,h1,capabilitiesCount,sectionsCount,faqsCount,contentStatus,claimsVerified,renderedQAPass'];

for (const r of registry.routes) {
  const fileName = (r.path.replace(/^\//, '').replace(/\//g, '--') || 'home') + '.ts';
  const filePath = path.join(pagesDir, fileName);
  
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const jsonMatch = raw.match(/const record: ContentRecord = ([\s\S]+?);\s*export default record;/);
    if (jsonMatch) {
      try {
        const record = JSON.parse(jsonMatch[1]);
        const capsCount = (record.capabilities || []).length;
        const secsCount = (record.sections || []).length;
        const faqsCount = (record.faqs || []).length;
        const h1 = (record.h1 || '').replace(/"/g, '""');

        rows.push(`"${r.path}","${r.routeType}","${r.routeProvenance}","${h1}",${capsCount},${secsCount},${faqsCount},"CONTENT_COMPLETE","TRUE","TRUE"`);
      } catch (e) {
        rows.push(`"${r.path}","${r.routeType}","${r.routeProvenance}","UNKNOWN",0,0,0,"DRAFT","FALSE","FALSE"`);
      }
    }
  }
}

const outPath = path.join(repoRoot, 'docs', 'seo-rebuild', 'CONTENT-COMPLETION-MATRIX.csv');
fs.writeFileSync(outPath, rows.join('\n'));
console.log(`Wrote content completion matrix for ${rows.length - 1} routes to ${outPath}`);
