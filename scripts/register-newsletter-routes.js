const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '../config/route-registry.json');
const manifestPath = path.join(__dirname, '../config/production-url-manifest.json');

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const newRoutes = [
  {
    path: '/fm-briefing',
    routeType: 'resource',
    protected: true,
    indexable: true,
    canonical: 'https://www.entirefm.com/fm-briefing',
    sitemapGroup: 'resources',
    historicSources: [],
  },
  {
    path: '/fm-briefing/unsubscribe',
    routeType: 'resource',
    protected: true,
    indexable: false, // Preference/unsubscribe pages are noindex
    canonical: 'https://www.entirefm.com/fm-briefing/unsubscribe',
    sitemapGroup: 'resources',
    historicSources: [],
  },
];

for (const route of newRoutes) {
  if (!registry.routes.some((r) => r.path === route.path)) {
    registry.routes.push(route);
  }
  if (!manifest.routes.some((r) => r.path === route.path)) {
    manifest.routes.push({
      path: route.path,
      statusCode: 200,
      destination: route.path,
      isRedirect: false,
      canonical: route.canonical,
      indexable: route.indexable,
    });
  }
}

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`Registered ${newRoutes.length} newsletter routes. Total routes in registry: ${registry.routes.length}`);
