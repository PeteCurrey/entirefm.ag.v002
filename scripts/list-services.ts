import * as fs from 'fs';
import * as path from 'path';

const registryPath = path.join(process.cwd(), 'config', 'route-registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
const routes = registry.routes;

const serviceRoutes = routes.filter((r: any) => r.routeType === 'service' || r.sitemapGroup === 'services');
console.log(`Total service routes: ${serviceRoutes.length}`);
serviceRoutes.forEach((r: any) => {
  console.log(`  - ${r.path} (${r.h1 || r.metaTitle || 'No title'})`);
});
