import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import { defaultMetadata } from '@/lib/metadata/generate-metadata';
import { RevealProvider } from '@/components/motion/RevealProvider';
import { CookieConsentBanner } from '@/components/legal/CookieConsentBanner';
import { ScrollToTop } from '@/components/navigation/ScrollToTop';
import './globals.css';

/**
 * CANONICAL TYPOGRAPHY — WORK SANS
 * ================================
 * Work Sans is the official canonical typeface across the EntireFM digital
 * ecosystem (public website, CAFM, /admin, /clients, /contractor, /engineer).
 *
 * Weight Hierarchy:
 * - 200 (ExtraLight): Hero display headings, major section titles, large KPI figures
 * - 300 (Light): Secondary headings, card headings, page intros, large supporting copy
 * - 400 (Regular): Body copy, CAFM tables, descriptions, form inputs, tooltips
 * - 500 (Medium): Buttons, tabs, active navigation, table headers, status badges
 * - 600 (SemiBold): Selective emphasis, high-priority operational states
 */
const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
  weight: ['200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={workSans.variable}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NRM7HJMM4Q" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NRM7HJMM4Q');
            `,
          }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-brand-graphite focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <RevealProvider>
          {children}
          <CookieConsentBanner />
        </RevealProvider>
      </body>
    </html>
  );
}

