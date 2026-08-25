import * as fs from 'fs';
import * as path from 'path';

const sourceDir = path.join(process.cwd(), 'client logos');
const targetDir = path.join(process.cwd(), 'public', 'images', 'clients');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => !f.startsWith('.'));
console.log('Found client logo files:', files);

const mappings: { original: string; slug: string; name: string; category: string; targetFile: string }[] = [
  { original: 'BNP Paribas.png', slug: 'bnp-paribas', name: 'BNP Paribas Real Estate', category: 'Commercial Real Estate & Property Management', targetFile: 'bnp-paribas.png' },
  { original: 'CBRE.png', slug: 'cbre', name: 'CBRE', category: 'Global Real Estate & Facilities Services', targetFile: 'cbre.png' },
  { original: 'Cushman & Wakefield.webp', slug: 'cushman-wakefield', name: 'Cushman & Wakefield', category: 'Commercial Real Estate & Property Management', targetFile: 'cushman-wakefield.webp' },
  { original: 'HSBC.jpg', slug: 'hsbc', name: 'HSBC', category: 'Financial & Corporate Banking Facilities', targetFile: 'hsbc.jpg' },
  { original: 'JLL.png', slug: 'jll', name: 'JLL', category: 'Global Commercial Property Management', targetFile: 'jll.png' },
  { original: 'LSH.png', slug: 'lsh', name: 'Lambert Smith Hampton', category: 'Commercial Property & Managing Agent', targetFile: 'lsh.png' },
  { original: 'Moto.svg', slug: 'moto', name: 'Moto Hospitality', category: 'Motorway Service Areas & Public Realm', targetFile: 'moto.svg' },
  { original: 'NHS.webp', slug: 'nhs', name: 'NHS Estates', category: 'Healthcare & Public Sector Facilities', targetFile: 'nhs.webp' },
  { original: 'Natwest.png', slug: 'natwest', name: 'NatWest Group', category: 'Banking & Regional Commercial Estates', targetFile: 'natwest.png' },
  { original: 'alkota.jpeg', slug: 'alkota', name: 'Alkota Group', category: 'Industrial & Property Holdings', targetFile: 'alkota.jpeg' },
  { original: 'balfour beatty.png', slug: 'balfour-beatty', name: 'Balfour Beatty', category: 'Infrastructure & Construction Estates', targetFile: 'balfour-beatty.png' },
  { original: 'burger king.png', slug: 'burger-king', name: 'Burger King', category: 'National Retail & Foodservice Estates', targetFile: 'burger-king.png' },
  { original: 'costa.png', slug: 'costa', name: 'Costa Coffee', category: 'National Hospitality & Retail Outlets', targetFile: 'costa.png' },
  { original: 'damac.webp', slug: 'damac', name: 'DAMAC Properties', category: 'Luxury Commercial & Residential Real Estate', targetFile: 'damac.webp' },
  { original: 'forged solutions group.jpg', slug: 'forged-solutions', name: 'Forged Solutions Group', category: 'Aerospace & Heavy Manufacturing', targetFile: 'forged-solutions-group.jpg' },
  { original: 'greggs.jpg', slug: 'greggs', name: 'Greggs', category: 'National Food Retail & Distribution', targetFile: 'greggs.jpg' },
  { original: 'knight frank.png', slug: 'knight-frank', name: 'Knight Frank', category: 'Commercial Real Estate & Asset Management', targetFile: 'knight-frank.png' },
  { original: 'royal enfield.jpg', slug: 'royal-enfield', name: 'Royal Enfield', category: 'Automotive & Commercial Facilities', targetFile: 'royal-enfield.jpg' },
  { original: 'starbucks.webp', slug: 'starbucks', name: 'Starbucks', category: 'Commercial Retail & Coffeehouse Estates', targetFile: 'starbucks.webp' },
  { original: 'volker wessels.png', slug: 'volker-wessels', name: 'VolkerWessels', category: 'Civil Engineering & Infrastructure', targetFile: 'volker-wessels.png' },
  { original: 'volkerrail.jpg', slug: 'volkerrail', name: 'VolkerRail', category: 'Rail & Transportation Infrastructure', targetFile: 'volkerrail.jpg' },
];

for (const m of mappings) {
  const srcPath = path.join(sourceDir, m.original);
  const destPath = path.join(targetDir, m.targetFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${m.original} -> public/images/clients/${m.targetFile}`);
  } else {
    console.warn(`File missing: ${m.original}`);
  }
}
