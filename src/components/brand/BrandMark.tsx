import React from 'react';
import { buildMarkEdges, buildMarkPlates, MARK_BOUNDS } from '@/lib/brand/mark-geometry';

/**
 * THE MARK, AS VECTOR
 * ===================
 * Inline SVG rather than the supplied raster, for one concrete reason: the
 * header is now transparent over photography, and every supplied logo file
 * carries a baked dark background with visible noise around it. At 36px on a
 * graphite bar nobody could tell. Over a London skyline it is a grubby dark
 * rectangle sitting where the logo should be.
 *
 * Drawing it from `mark-geometry` fixes that and buys three other things: it
 * stays crisp at any size, it is one small component instead of a 1MB image,
 * and — the reason it exists at all — the individual plates are addressable,
 * so they can be flown in one at a time.
 *
 * TWO STATES
 * ----------
 *   wire    outlines only. What the header shows before the fragments land.
 *   solid   the assembled mark, shaded.
 *
 * Both layers are always rendered and cross-faded, so the transition costs
 * nothing at the moment it happens and the geometry cannot drift between the
 * two states — they are generated from the same loop.
 */

const PAD = 0.14;
const VIEW_BOX = [
  MARK_BOUNDS.minX - PAD,
  -MARK_BOUNDS.maxY - PAD,
  MARK_BOUNDS.maxX - MARK_BOUNDS.minX + PAD * 2,
  MARK_BOUNDS.maxY - MARK_BOUNDS.minY + PAD * 2,
].join(' ');

const EDGES = buildMarkEdges();
const PLATES = buildMarkPlates();

/** SVG's y axis points down; the model's points up. */
export const toSvgPoints = (points: Array<[number, number]>) =>
  points.map(([x, y]) => `${x.toFixed(4)},${(-y).toFixed(4)}`).join(' ');

interface BrandMarkProps {
  state?: 'wire' | 'solid';
  className?: string;
  /** Milliseconds for the wire → solid cross-fade. */
  transitionMs?: number;
}

export function BrandMark({ state = 'solid', className = '', transitionMs = 520 }: BrandMarkProps) {
  const solid = state === 'solid';

  return (
    <svg
      viewBox={VIEW_BOX}
      className={className}
      role="img"
      aria-label="EntireFM"
      // The strokes are sub-pixel at header size; without this the wireframe
      // shimmers as the page scrolls.
      shapeRendering="geometricPrecision"
    >
      {/* Wireframe — the resting state before the plates arrive. Drawn in
          `currentColor` so a caller can tint it to whatever it is sitting on. */}
      <Wire
        stroke="currentColor"
        width={0.03}
        opacity={solid ? 0 : 1}
        transitionMs={transitionMs}
      />

      <g
        style={{
          opacity: solid ? 1 : 0,
          transition: `opacity ${transitionMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
        }}
      >
        {PLATES.map((plate) => (
          <polygon key={plate.index} points={toSvgPoints(plate.points)} fill={plate.fill} />
        ))}

        {/* Bright edges over the plates. The artwork's crystalline read comes
            from lit silver seams between the faces, and without these the
            assembled mark flattens into a coloured silhouette at small sizes —
            which is exactly the size it is usually seen at. */}
        <Wire stroke="rgba(255,255,255,0.62)" width={0.014} opacity={1} transitionMs={0} />
      </g>
    </svg>
  );
}

/** The mark's edges. Shared by the wireframe state and the lit seams. */
function Wire({
  stroke,
  width,
  opacity,
  transitionMs,
}: {
  stroke: string;
  width: number;
  opacity: number;
  transitionMs: number;
}) {
  return (
    <g
      style={{
        opacity,
        transition: transitionMs
          ? `opacity ${transitionMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
          : undefined,
      }}
    >
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={a[0].toFixed(4)}
          y1={(-a[1]).toFixed(4)}
          x2={b[0].toFixed(4)}
          y2={(-b[1]).toFixed(4)}
          stroke={stroke}
          strokeWidth={width}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}
