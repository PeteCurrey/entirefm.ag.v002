/**
 * ROUTE VALIDATION
 * ================
 * Build-time SEO architecture enforcement.
 *
 * Checks performed:
 *  1. No protected route appears as a redirect source
 *  2. No protected route has canonical !== 'self'
 *  3. No protected route is marked noindex (indexable: false)
 *  4. No protected route has statusRequired !== 200
 *  5. No duplicate path exists in route registry
 *  6. Every path begins with /
 *  7. Every protected route has uniquePageRequired: true
 *  8. Every route has a valid sitemapGroup
 *  9. Registry schema validates against Zod schema
 *
 * Run with: pnpm validate:routes
 * Called at: Next.js build time via next.config.ts
 *
 * Any validation error causes BUILD FAILURE — not a warning.
 */

import * as fs from 'fs';
import * as path from 'path';
import { RouteRegistrySchema } from './route-schema';

interface ValidationError {
  rule: string;
  route: string;
  message: string;
}

interface ValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: string[];
  stats: {
    totalRoutes: number;
    protectedRoutes: number;
    indexableRoutes: number;
    routesChecked: number;
  };
}

function loadRegistry(): unknown {
  const registryPath = path.join(process.cwd(), 'config', 'route-registry.json');
  if (!fs.existsSync(registryPath)) {
    throw new Error(`BUILD FAILURE: /config/route-registry.json not found. This file is required.`);
  }
  return JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
}

function loadRedirects(): { redirects: Array<{ source: string }> } {
  const redirectsPath = path.join(process.cwd(), 'config', 'redirects.json');
  if (!fs.existsSync(redirectsPath)) {
    return { redirects: [] };
  }
  return JSON.parse(fs.readFileSync(redirectsPath, 'utf-8'));
}

export function validateRoutes(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // ── Load and parse registry ────────────────────────────────────────────────

  const rawRegistry = loadRegistry();
  const parseResult = RouteRegistrySchema.safeParse(rawRegistry);

  if (!parseResult.success) {
    const zodErrors = parseResult.error.errors.map(e => ({
      rule: 'SCHEMA_VALIDATION',
      route: e.path.join('.'),
      message: e.message,
    }));
    return {
      passed: false,
      errors: zodErrors,
      warnings,
      stats: { totalRoutes: 0, protectedRoutes: 0, indexableRoutes: 0, routesChecked: 0 },
    };
  }

  const registry = parseResult.data;
  const routes = registry.routes;
  const redirects = loadRedirects();

  // Build protected paths set
  const protectedPaths = new Set(routes.filter(r => r.protected).map(r => r.path));
  const seenPaths = new Set<string>();

  for (const route of routes) {
    // ── Rule 1: No duplicate paths ─────────────────────────────────────────
    if (seenPaths.has(route.path)) {
      errors.push({
        rule: 'NO_DUPLICATE_PATHS',
        route: route.path,
        message: `Duplicate path "${route.path}" found in route registry. Each path must be unique.`,
      });
    }
    seenPaths.add(route.path);

    // ── Rule 2: Path must begin with / ─────────────────────────────────────
    if (!route.path.startsWith('/')) {
      errors.push({
        rule: 'VALID_PATH',
        route: route.path,
        message: `Path "${route.path}" does not begin with /. All paths must start with /.`,
      });
    }

    if (!route.protected) continue; // Remaining rules apply to protected routes only

    // ── Rule 3: Protected routes must return 200 ───────────────────────────
    if (route.statusRequired !== 200) {
      errors.push({
        rule: 'STATUS_200_REQUIRED',
        route: route.path,
        message: `Protected route "${route.path}" has statusRequired=${route.statusRequired}. Must be 200.`,
      });
    }

    // ── Rule 4: Protected routes must be indexable ─────────────────────────
    if (!route.indexable) {
      errors.push({
        rule: 'INDEXABLE_REQUIRED',
        route: route.path,
        message: `Protected route "${route.path}" has indexable=false. Protected routes must be indexable.`,
      });
    }

    // ── Rule 5: Protected routes must be self-canonical ────────────────────
    if (route.canonical !== 'self') {
      errors.push({
        rule: 'SELF_CANONICAL_REQUIRED',
        route: route.path,
        message: `Protected route "${route.path}" has canonical="${route.canonical}". Must be "self".`,
      });
    }

    // ── Rule 6: Protected routes require unique page ───────────────────────
    if (!route.uniquePageRequired) {
      errors.push({
        rule: 'UNIQUE_PAGE_REQUIRED',
        route: route.path,
        message: `Protected route "${route.path}" has uniquePageRequired=false. Must be true.`,
      });
    }

    // ── Rule 7: Protected routes must not have SPEC_MISSING content ────────
    if (route.contentStatus === 'SPEC_MISSING') {
      errors.push({
        rule: 'CONTENT_SPEC_REQUIRED',
        route: route.path,
        message: `Protected route "${route.path}" has contentStatus=SPEC_MISSING. A page specification is required. CONTENT_PENDING is acceptable during development.`,
      });
    }
  }

  // ── Rule 8: No protected route may appear as a redirect source ─────────────
  for (const redirect of redirects.redirects) {
    if (protectedPaths.has(redirect.source)) {
      errors.push({
        rule: 'NO_PROTECTED_ROUTE_REDIRECT',
        route: redirect.source,
        message: `BUILD FAILURE: Protected route "${redirect.source}" appears as a redirect source in /config/redirects.json. Protected routes may NEVER redirect. Remove this redirect or obtain explicit authorisation.`,
      });
    }
  }

  const stats = {
    totalRoutes: routes.length,
    protectedRoutes: routes.filter(r => r.protected).length,
    indexableRoutes: routes.filter(r => r.indexable).length,
    routesChecked: routes.length,
  };

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}

// ── CLI runner ─────────────────────────────────────────────────────────────────

if (require.main === module || process.argv[1]?.includes('validate-routes')) {
  console.log('\n══════════════════════════════════════════════════════');
  console.log('  ENTIREFM SEO ARCHITECTURE VALIDATION');
  console.log('══════════════════════════════════════════════════════\n');

  let result: ValidationResult;
  
  try {
    result = validateRoutes();
  } catch (err) {
    console.error('FATAL:', (err as Error).message);
    process.exit(1);
  }

  console.log(`Routes checked:     ${result.stats.routesChecked}`);
  console.log(`Protected routes:   ${result.stats.protectedRoutes}`);
  console.log(`Indexable routes:   ${result.stats.indexableRoutes}`);
  console.log('');

  if (result.warnings.length > 0) {
    console.log('WARNINGS:');
    for (const w of result.warnings) {
      console.log(`  ⚠ ${w}`);
    }
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log(`ERRORS (${result.errors.length}):`);
    for (const e of result.errors) {
      console.log(`\n  ✗ [${e.rule}]`);
      console.log(`    Route:   ${e.route}`);
      console.log(`    Message: ${e.message}`);
    }
    console.log('\n──────────────────────────────────────────────────────');
    console.log('  BUILD FAILURE: SEO architecture validation failed.');
    console.log('  Resolve all errors above before proceeding.');
    console.log('──────────────────────────────────────────────────────\n');
    process.exit(1);
  }

  console.log('══════════════════════════════════════════════════════');
  console.log('  ✓ ALL SEO ARCHITECTURE CHECKS PASSED');
  console.log('══════════════════════════════════════════════════════\n');
  process.exit(0);
}
