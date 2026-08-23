/**
 * ENTIREFM MARK — PROCEDURAL GEOMETRY
 * ===================================
 * The supplied logo files are raster images (the .svg files are just embedded
 * PNGs), so there is no vector geometry to animate. This rebuilds the mark as
 * real geometry so its individual facets can be addressed — flown in for the
 * intro assembly, lit per-face in WebGL, or emitted as SVG polygons.
 *
 * CONSTRUCTION
 * ------------
 * The mark is a single continuous ribbon that crosses itself — a figure-8,
 * not two separate rings. Reading the wireframe closely: the band leaves the
 * lower-right of the left lobe, travels up-right into the top-left of the
 * right lobe, wraps that lobe, then returns from its lower-left up to the
 * top-right of the left lobe. Those two crossing runs are what form the X at
 * the centre, and they are why the lobes cannot simply be drawn as closed
 * hexagons.
 *
 * The centreline is therefore one closed 12-vertex loop:
 *
 *      L5 → L0 → L1 → L2 → L3 → L4      five edges around the left lobe
 *      L4 ⇢ R1                          crossing run, up and to the right
 *      R1 → R0 → R5 → R4 → R3 → R2      five edges around the right lobe
 *      R2 ⇢ L5                          crossing run, up and to the left
 *
 * where each lobe's vertices are a pointy-top hexagon, index 0 at 12 o'clock
 * and running anticlockwise.
 *
 * The ribbon is then built by walking that loop twice — once at the outer
 * radius and once at the inner — and triangulating between the two, giving
 * two facets per segment. Extruding in z gives the crystalline thickness.
 *
 * A horizontal squash is applied at the end: the supplied artwork is an
 * isometric projection, so the mark is noticeably narrower than a true
 * regular hexagon would be.
 *
 */

export interface Facet {
  /** Triangle corners in model space. */
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
  /** 0–1 position across the whole mark, left to right. Drives the gradient. */
  t: number;
  /** Which lobe this facet belongs to. */
  lobe: 'left' | 'right';
  /** Stable index, used to stagger the assembly animation. */
  index: number;
}

const OUTER_RADIUS = 1;
const INNER_RADIUS = 0.61;
/** Horizontal distance of each lobe centre from the origin. */
const LOBE_OFFSET = 1.16;
/** Half-thickness of the extruded ribbon. */
const DEPTH = 0.1;
/** Isometric horizontal squash — the artwork is a projection, not a plan view. */
const SQUASH = 0.81;

/** Pointy-top hexagon: index 0 at 12 o'clock, running anticlockwise. */
function hexagon(radius: number, cx: number): Array<[number, number]> {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 2 + (i * Math.PI) / 3;
    return [cx + radius * Math.cos(angle), radius * Math.sin(angle)] as [number, number];
  });
}

/**
 * The closed centreline loop at a given radius, in the order described above.
 * Both the outer and inner boundaries follow this same connectivity, which is
 * what keeps the ribbon consistent through the crossing.
 */
function ribbonLoop(radius: number): Array<[number, number]> {
  const L = hexagon(radius, -LOBE_OFFSET);
  const R = hexagon(radius, LOBE_OFFSET);
  //     ── left lobe ──          cross      ── right lobe ──         cross
  return [L[5], L[0], L[1], L[2], L[3], L[4], R[1], R[0], R[5], R[4], R[3], R[2]];
}

const squash = (p: [number, number]): [number, number] => [p[0] * SQUASH, p[1]];

export function buildMarkFacets(): Facet[] {
  const outer = ribbonLoop(OUTER_RADIUS).map(squash);
  const inner = ribbonLoop(INNER_RADIUS).map(squash);
  const span = 2 * (LOBE_OFFSET + OUTER_RADIUS) * SQUASH;

  const facets: Facet[] = [];
  let index = 0;

  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length;
    const O1 = outer[i];
    const O2 = outer[j];
    const I1 = inner[i];
    const I2 = inner[j];

    const quads: Array<[[number, number], [number, number], [number, number]]> = [
      [O1, O2, I1],
      [O2, I2, I1],
    ];

    for (const [p, q, r] of quads) {
      const centroidX = (p[0] + q[0] + r[0]) / 3;
      const t = Math.min(1, Math.max(0, (centroidX + span / 2) / span));
      const lobe: 'left' | 'right' = centroidX < 0 ? 'left' : 'right';

      // Front and back faces.
      for (const z of [DEPTH, -DEPTH]) {
        facets.push({
          a: [p[0], p[1], z],
          b: [q[0], q[1], z],
          c: [r[0], r[1], z],
          t,
          lobe,
          index: index++,
        });
      }
    }

    // Outer and inner rims, giving the ribbon a visible edge when rotated.
    for (const [e1, e2] of [
      [O1, O2],
      [I2, I1],
    ] as Array<[[number, number], [number, number]]>) {
      const centroidX = (e1[0] + e2[0]) / 2;
      const t = Math.min(1, Math.max(0, (centroidX + span / 2) / span));
      const lobe: 'left' | 'right' = centroidX < 0 ? 'left' : 'right';
      facets.push({
        a: [e1[0], e1[1], DEPTH],
        b: [e2[0], e2[1], DEPTH],
        c: [e2[0], e2[1], -DEPTH],
        t, lobe, index: index++,
      });
      facets.push({
        a: [e1[0], e1[1], DEPTH],
        b: [e2[0], e2[1], -DEPTH],
        c: [e1[0], e1[1], -DEPTH],
        t, lobe, index: index++,
      });
    }
  }

  return facets;
}

/** Edges of the wireframe state — outer loop, inner loop, and the rungs between. */
export function buildMarkEdges(): Array<[[number, number], [number, number]]> {
  const outer = ribbonLoop(OUTER_RADIUS).map(squash);
  const inner = ribbonLoop(INNER_RADIUS).map(squash);
  const edges: Array<[[number, number], [number, number]]> = [];

  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length;
    edges.push([outer[i], outer[j]]);
    edges.push([inner[i], inner[j]]);
    edges.push([outer[i], inner[i]]);
    edges.push([outer[j], inner[i]]); // facet diagonal
  }

  return edges;
}

/** Bounds of the mark in model space, for fitting it to a viewBox. */
export const MARK_BOUNDS = {
  minX: -(LOBE_OFFSET + OUTER_RADIUS) * SQUASH,
  maxX: (LOBE_OFFSET + OUTER_RADIUS) * SQUASH,
  minY: -OUTER_RADIUS,
  maxY: OUTER_RADIUS,
};

/** The brand spectrum, sampled at `t` (0 = electric blue, 1 = purple). */
export function spectrumAt(t: number): [number, number, number] {
  const stops: Array<{ at: number; rgb: [number, number, number] }> = [
    { at: 0, rgb: [0x25, 0x63, 0xeb] },
    { at: 0.38, rgb: [0x4f, 0x46, 0xe5] },
    { at: 0.7, rgb: [0x7c, 0x3a, 0xed] },
    { at: 1, rgb: [0xa8, 0x55, 0xf7] },
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    const lo = stops[i];
    const hi = stops[i + 1];
    if (t > hi.at) continue;
    const k = (t - lo.at) / (hi.at - lo.at);
    return [
      lo.rgb[0] + (hi.rgb[0] - lo.rgb[0]) * k,
      lo.rgb[1] + (hi.rgb[1] - lo.rgb[1]) * k,
      lo.rgb[2] + (hi.rgb[2] - lo.rgb[2]) * k,
    ];
  }
  return stops[stops.length - 1].rgb;
}
