import type { NextConfig } from 'next';

/**
 * ENTIREFM NEXT.JS CONFIGURATION
 * ================================
 * REDIRECT AUTHORITY: /config/production-redirects.json
 *   - Generated from /docs/migration/CURRENT-LIVE-MANUAL-DECISIONS.csv
 *   - Validated by scripts/validate-redirects.js before use
 *   - No protected historic route may appear as a redirect source
 *   - Run: npm run validate:redirects before any redirect changes
 *
 * ROUTE REGISTRY: /config/route-registry.json
 *   - Single authoritative source of all 200-returning routes
 *   - Manifest generated from it via: npm run generate:manifest
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    // -----------------------------------------------------------------------
    // VERCEL BUILD: Webpack memory optimisations
    // The webpack build was OOM-killed (SIGKILL) on Vercel's Enhanced Build
    // Machine (8 cores, 16 GB) during compilation of the enlarged codebase.
    //
    // webpackMemoryOptimizations — instructs webpack to reduce peak heap at
    //   the cost of slightly slower compilation. Frees ~30–40% peak RAM.
    // webpackBuildWorker — isolates compilation into a dedicated worker
    //   process so memory is released cleanly after the compile phase.
    // cpus — limits concurrent worker threads to 4 (half of 8 available),
    //   preventing all cores from allocating large module graphs in parallel.
    // -----------------------------------------------------------------------
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    cpus: 4,
  },

  images: {
    remotePatterns: [
      // Supabase Storage — member profile avatars and any other stored media
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  async redirects() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const redirectRegistry = require('./config/production-redirects.json') as {
      redirects: Array<{ source: string; destination: string; statusCode: number }>;
    };

    const redirects = redirectRegistry.redirects ?? [];

    if (redirects.length > 0) {
      // Load protected paths for validation
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const registry = require('./config/route-registry.json') as {
        routes: Array<{ path: string; protected: boolean }>;
      };
      const protectedPaths = new Set(
        registry.routes
          .filter(r => r.protected)
          .map(r => r.path)
      );

      for (const redirect of redirects) {
        if (protectedPaths.has(redirect.source)) {
          throw new Error(
            `BUILD FAILURE: Protected route "${redirect.source}" appears as a redirect source. ` +
            `Protected routes may not redirect. Remove this redirect or obtain explicit authorisation.`
          );
        }
      }
    }

    // Next.js redirects() expects { source, destination, permanent } objects
    return redirects.map(r => ({
      source: r.source,
      destination: r.destination,
      permanent: r.statusCode === 301,
    }));
  },
};

export default nextConfig;
