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

  async headers() {
    return [
      {
        source: '/assets/gaussian-splats/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/octet-stream' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
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

    // Next.js redirects() accepts { source, destination, statusCode } or { source, destination, permanent }
    return redirects.map(r => {
      if (r.statusCode) {
        return {
          source: r.source,
          destination: r.destination,
          statusCode: r.statusCode,
        };
      }
      return {
        source: r.source,
        destination: r.destination,
        permanent: true,
      };
    });
  },
};

export default nextConfig;
