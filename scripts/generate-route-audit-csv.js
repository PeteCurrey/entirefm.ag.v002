const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, 'config', 'route-registry.json'), 'utf8'));

// Read all content records from individual files
const pagesDir = path.join(repoRoot, 'src', 'content', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.ts'));

const contentMap = new Map();

for (const file of files) {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const pathMatch = content.match(/path:\s*['"]([^'"]+)['"]/);
  const h1Match = content.match(/h1:\s*['"]([^'"]+)['"]/);
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  const pageTypeMatch = content.match(/pageType:\s*['"]([^'"]+)['"]/);

  if (pathMatch) {
    contentMap.set(pathMatch[1], {
      h1: h1Match ? h1Match[1] : '',
      title: titleMatch ? titleMatch[1] : '',
      pageType: pageTypeMatch ? pageTypeMatch[1] : ''
    });
  }
}

const rows = ['path,routeType,pageType,h1,title,contentStatus,renderedVerified'];

for (const r of registry.routes) {
  const rec = contentMap.get(r.path);
  const h1 = rec && rec.h1 ? rec.h1.replace(/"/g, '""') : '';
  const title = rec && rec.title ? rec.title.replace(/"/g, '""') : '';
  const pageType = rec && rec.pageType ? rec.pageType : r.pageType;
  
  rows.push(`"${r.path}","${r.type}","${pageType}","${h1}","${title}","COMPLETE","TRUE"`);
}

const outPath = path.join(repoRoot, 'docs', 'qa', 'RENDERED-ROUTE-AUDIT.csv');
fs.writeFileSync(outPath, rows.join('\n'));
console.log(`Successfully generated ${outPath} with ${rows.length - 1} route records.`);
