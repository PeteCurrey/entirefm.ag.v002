/**
 * FAVICON GENERATION
 * ==================
 * Emits `src/app/icon.svg` from the same geometry the header uses, so the tab
 * icon and the logo on the page cannot drift apart. Next's file convention
 * picks it up and emits the link tag automatically.
 *
 * The site had no favicon at all — every page load ended in a 404 for
 * /favicon.ico — and the supplied raster logos could not have supplied one:
 * they carry a baked dark background with visible noise, which at 16px is a
 * grey smudge.
 *
 * WHY IT HAS A GROUND
 * -------------------
 * The mark is a thin ribbon. Transparent, at 16px, against a light browser
 * chrome, it disappears. A graphite rounded square gives it the contrast it
 * needs and matches the header it came from, so the tab reads as the site.
 *
 * Run: npm run brand:favicon
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildMarkPlates, buildMarkEdges, MARK_BOUNDS } from '../src/lib/brand/mark-geometry';

const SIZE = 64;
/** The mark occupies this fraction of the tile's width. */
const FILL = 0.78;
const RADIUS = 12;
const GROUND = '#0b1220';

const markWidth = MARK_BOUNDS.maxX - MARK_BOUNDS.minX;
const scale = (SIZE * FILL) / markWidth;
const centre = SIZE / 2;

/** Model space → tile space. SVG's y axis points down; the model's points up. */
const project = (points: Array<[number, number]>) =>
  points
    .map(([x, y]) => `${(centre + x * scale).toFixed(2)},${(centre - y * scale).toFixed(2)}`)
    .join(' ');

const plates = buildMarkPlates()
  .map((p) => `    <polygon points="${project(p.points)}" fill="${p.fill}"/>`)
  .join('\n');

const edges = buildMarkEdges()
  .map(
    ([a, b]) =>
      `    <line x1="${(centre + a[0] * scale).toFixed(2)}" y1="${(centre - a[1] * scale).toFixed(2)}"` +
      ` x2="${(centre + b[0] * scale).toFixed(2)}" y2="${(centre - b[1] * scale).toFixed(2)}"/>`
  )
  .join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-label="EntireFM">
  <rect width="${SIZE}" height="${SIZE}" rx="${RADIUS}" fill="${GROUND}"/>
${plates}
  <g stroke="rgba(255,255,255,0.6)" stroke-width="0.5" stroke-linecap="round">
${edges}
  </g>
</svg>
`;

const out = join(__dirname, '..', 'src', 'app', 'icon.svg');
writeFileSync(out, svg);
console.log(`Favicon written: ${out}  (${svg.length} bytes)`);
