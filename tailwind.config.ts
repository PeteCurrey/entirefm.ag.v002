import type { Config } from 'tailwindcss';

/**
 * ENTIREFM DESIGN SYSTEM
 * ======================
 * Palette and typography are taken from the official brand guidelines in
 * /Branding (EntireFM Branding 001–005). Nothing here is invented.
 *
 * Official palette:
 *   Electric Blue #2563EB · Indigo #4F46E5 · Violet #7C3AED · Purple #A855F7
 *   Graphite #0B1220 · Slate #1E293B · Silver #475569 · Mist #CBD5E1
 *
 * Official typeface: Plus Jakarta Sans ("Clean. Contemporary. Confident.")
 *
 * The previous system used a gold accent (#C59B27) and a serif display face.
 * Neither appears anywhere in the brand guidelines — the brand is a cool
 * blue-to-purple spectrum on near-black, and a single geometric sans.
 *
 * ONE ACCENT SPECTRUM, USED SPARINGLY
 * -----------------------------------
 * The four accent hues are one continuous spectrum, not four separate
 * colours to distribute around a page. Electric blue carries interaction;
 * violet and purple appear in gradients and illuminated edges. Anything
 * that is not deliberately drawing the eye stays graphite, slate or mist.
 */

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/templates/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // ── Official brand colours ──────────────────────────────────────
          electric: '#2563EB',
          indigo: '#4F46E5',
          violet: '#7C3AED',
          purple: '#A855F7',
          graphite: '#0B1220',
          slate: '#1E293B',
          silver: '#475569',
          mist: '#CBD5E1',

          // ── Derived tones, interpolated from the official values ────────
          // Deeper than graphite, for the page ground behind elevated panels.
          void: '#060A14',
          // One step up from graphite, for cards sitting on the dark ground.
          carbon: '#111A2E',
          // Hairline borders on dark surfaces.
          'edge-dark': '#1F2A44',
          // Hairline borders on light surfaces.
          edge: '#E3E8F0',
          // Light-mode surfaces.
          surface: '#F6F8FC',
          'surface-muted': '#EDF1F7',
          // Brighter electric for small text on dark grounds, where #2563EB
          // alone does not carry enough contrast.
          'electric-bright': '#5B8DEF',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Display scale for hero and section headings.
        'display-xl': ['clamp(2.75rem, 6vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '700' }],
        'display-lg': ['clamp(2.25rem, 4.5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-sm': ['clamp(1.375rem, 2.2vw, 1.875rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        // Uppercase eyebrow / label.
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.18em', fontWeight: '600' }],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '3px',
        md: '6px',
        lg: '10px',
        xl: '16px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(11 18 32 / 0.06)',
        card: '0 2px 8px -2px rgb(11 18 32 / 0.10), 0 1px 2px rgb(11 18 32 / 0.06)',
        elevated: '0 12px 32px -8px rgb(11 18 32 / 0.16), 0 4px 8px -4px rgb(11 18 32 / 0.08)',
        // Illuminated edge, echoing the lit facets of the brand mark.
        glow: '0 0 0 1px rgb(37 99 235 / 0.35), 0 8px 32px -8px rgb(79 70 229 / 0.45)',
        'glow-lg': '0 0 0 1px rgb(124 58 237 / 0.40), 0 20px 60px -12px rgb(124 58 237 / 0.50)',
      },
      backgroundImage: {
        // The brand's signature gradient, in its canonical direction.
        'brand-spectrum': 'linear-gradient(100deg, #2563EB 0%, #4F46E5 38%, #7C3AED 70%, #A855F7 100%)',
        'brand-spectrum-soft': 'linear-gradient(100deg, rgb(37 99 235 / 0.14) 0%, rgb(124 58 237 / 0.14) 60%, rgb(168 85 247 / 0.14) 100%)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      transitionDuration: {
        // Tailwind's default scale jumps 300 → 500; 400 is the pace most of
        // the reveal and hover transitions here are tuned to.
        '400': '400ms',
      },
      transitionTimingFunction: {
        // Restrained, slightly weighted easing. Nothing bounces.
        brand: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        // Scroll reveal — a short rise, not a slide.
        rise: {
          from: { opacity: '0', transform: 'translate3d(0, 14px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        // Ambient drift behind the hero. Very slow, barely perceptible.
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -2%, 0) scale(1.06)' },
        },
        // A single pass of light along a hairline, used on hover.
        sweep: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        rise: 'rise 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        drift: 'drift 26s cubic-bezier(0.45, 0, 0.55, 1) infinite',
        sweep: 'sweep 1.1s cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
