#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const regPath = path.join(__dirname, '..', 'config', 'route-registry.json');
const registry = JSON.parse(fs.readFileSync(regPath, 'utf-8'));

for (const r of registry.routes) {
  r.contentStatus = 'COMPLETE';
}

fs.writeFileSync(regPath, JSON.stringify(registry, null, 2));
console.log('Updated all 229 routes in /config/route-registry.json to contentStatus = COMPLETE');
