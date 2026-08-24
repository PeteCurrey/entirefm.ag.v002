/**
 * Production Guard Utility
 * ========================
 * Ensures test fixture seeds and demo generators cannot execute in production.
 */

export function assertNotProduction(context: string): void {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.APP_ENV === 'production';

  if (isProduction) {
    throw new Error(
      `[PRODUCTION GUARD BLOCKED] '${context}' must not run in production.`
    );
  }
}

export function isProductionEnvironment(): boolean {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.APP_ENV === 'production'
  );
}
