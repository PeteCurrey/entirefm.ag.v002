/**
 * 404 NOT FOUND PAGE
 * ===================
 * Genuine 404 for any path not in the route registry.
 * Do NOT make this page attempt to serve content for unknown paths.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  // absolute — the brand suffix is already present; the root layout
  // template would otherwise append a second one.
  title: { absolute: '404 — Page Not Found | Entire FM' },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main>
      <h1>Page Not Found</h1>
      <p>
        The page you requested does not exist.
      </p>
      <p>
        <a href="/">Return to homepage</a>
      </p>
    </main>
  );
}
