import type { NextConfig } from 'next';

/**
 * ENTIREFM NEXT.JS CONFIGURATION
 * ================================
 * Redirect validation: no protected route may appear as a redirect source.
 * Any violation causes a BUILD FAILURE.
 *
 * See: /config/route-registry.json — single authoritative source of truth
 * See: /config/redirects.json — approved redirects only (currently empty)
 */

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async redirects() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const redirectRegistry = require('./config/redirects.json');

    // No redirects currently approved — this array must remain empty
    // until a redirect is explicitly authorised against a non-protected route.
    if (redirectRegistry.redirects.length > 0) {
      // Load protected paths for validation
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const registry = require('./config/route-registry.json');
      const protectedPaths = new Set(
        registry.routes
          .filter((r: { protected: boolean }) => r.protected)
          .map((r: { path: string }) => r.path)
      );

      for (const redirect of redirectRegistry.redirects) {
        if (protectedPaths.has(redirect.source)) {
          throw new Error(
            `BUILD FAILURE: Protected route "${redirect.source}" appears as a redirect source. ` +
            `Protected routes may not redirect. Remove this redirect or obtain explicit authorisation.`
          );
        }
      }
    }

    return redirectRegistry.redirects;
  },
};

export default nextConfig;
