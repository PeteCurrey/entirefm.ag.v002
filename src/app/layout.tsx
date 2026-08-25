import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { defaultMetadata } from '@/lib/metadata/generate-metadata';
import { RevealProvider } from '@/components/motion/RevealProvider';
import { CookieConsentBanner } from '@/components/legal/CookieConsentBanner';
import { ScrollToTop } from '@/components/navigation/ScrollToTop';
import './globals.css';

/**
 * TYPEFACE
 * ========
 * Inter, matching what entirefm.com actually ships — the business asked for
 * the live site's type, and this is it: Inter at weight 200 for display, 300
 * for body, with tight negative tracking on the large sizes.
 *
 * WORTH KNOWING
 * -------------
 * The brand guidelines in /Branding name Plus Jakarta Sans, so this is a
 * deliberate departure from that document rather than an oversight. The two
 * are close cousins — both geometric humanist sans — and at the weights used
 * here the difference is small. It is recorded because a future reader
 * comparing the site against the guidelines will otherwise think it is a bug.
 *
 * The full weight range is loaded because the design uses it: 200 for display
 * through 700 where a heading needs to carry real emphasis.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={inter.variable}>
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

