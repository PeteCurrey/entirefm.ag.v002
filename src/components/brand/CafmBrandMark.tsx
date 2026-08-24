import React from 'react';
import { buildMarkEdges, MARK_BOUNDS } from '@/lib/brand/mark-geometry';

const toSvgPoints = (points: Array<[number, number]>) =>
  points.map(([x, y]) => `${x.toFixed(4)},${(-y).toFixed(4)}`).join(' ');

/**
 * ENTIREFM CAFM INFINITY BRAND MARK
 * =================================
 * Procedural vector infinity mark calibrated with the EntireFM CAFM orange palette:
 * Pure Operational Orange #FF6B24, Coral #FB923C, Amber #F59E0B, Terracotta #C2410C,
 * Copper Obsidian #451A03, and Specular Peach Highlights #FFEDD5.
 */

const PAD = 0.16;
const VIEW_BOX = [
  MARK_BOUNDS.minX - PAD,
  -MARK_BOUNDS.maxY - PAD,
  MARK_BOUNDS.maxX - MARK_BOUNDS.minX + PAD * 2,
  MARK_BOUNDS.maxY - MARK_BOUNDS.minY + PAD * 2,
].join(' ');

const EDGES = buildMarkEdges();

export const CAFM_ORANGE_FACET_PALETTE = [
  { fill: '#ffedd5', altFill: '#fed7aa', highlight: true },   // 0: left top outer (specular peach highlight)
  { fill: '#fb923c', altFill: '#ea580c' },                    // 1: left top inner (vibrant warm orange)
  { fill: '#f97316', altFill: '#c2410c' },                    // 2: left top-left outer (electric orange)
  { fill: '#c2410c', altFill: '#7c2d12' },                    // 3: left top-left inner (deep copper)
  { fill: '#fdba74', altFill: '#f97316', highlight: true },   // 4: left apex outer (amber flame reflection)
  { fill: '#9a3412', altFill: '#431407' },                    // 5: left apex inner (deep amber obsidian)
  { fill: '#ff6b24', altFill: '#ea580c' },                    // 6: left bottom-left outer (pure EntireFM orange)
  { fill: '#d9480f', altFill: '#8c2b04' },                    // 7: left bottom-left inner (rich orange-red)
  { fill: '#c2410c', altFill: '#6c2206' },                    // 8: left bottom outer (deep terracotta)
  { fill: '#9a3412', altFill: '#431407' },                    // 9: left bottom inner (dark bronze)
  { fill: '#f97316', altFill: '#ea580c' },                    // 10: crossing lower-left to upper-right (bright orange)
  { fill: '#fb923c', altFill: '#f97316' },                    // 11: crossing center-left (luminous amber)
  { fill: '#451a03', altFill: '#240c02' },                    // 12: right top-left outer (deep obsidian amber)
  { fill: '#ea580c', altFill: '#c2410c' },                    // 13: right top-left inner (warm flame)
  { fill: '#f97316', altFill: '#ea580c', highlight: true },   // 14: right top outer (vibrant orange highlight)
  { fill: '#fed7aa', altFill: '#fb923c', highlight: true },   // 15: right top inner (bright peach amber)
  { fill: '#7c2d12', altFill: '#431407' },                    // 16: right apex outer (bronze crystal)
  { fill: '#451a03', altFill: '#1c0801' },                    // 17: right apex inner (dark amber crystal)
  { fill: '#3d1604', altFill: '#1a0701' },                    // 18: right bottom-right outer (dark obsidian)
  { fill: '#542008', altFill: '#260a02' },                    // 19: right bottom-right inner (dark copper crystal)
  { fill: '#ff6b24', altFill: '#d9480f', highlight: true },   // 20: right bottom outer (vivid EntireFM orange)
  { fill: '#c2410c', altFill: '#7c2d12' },                    // 21: right bottom inner (deep terracotta)
  { fill: '#7c2d12', altFill: '#3d1604' },                    // 22: crossing lower-right to upper-left (deep copper)
  { fill: '#ea580c', altFill: '#c2410c' },                    // 23: crossing center-right (flame orange)
];

const OUTER_RADIUS = 1;
const INNER_RADIUS = 0.61;
const LOBE_OFFSET = 1.16;
const SQUASH = 0.81;

function hexagon(radius: number, cx: number): Array<[number, number]> {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = Math.PI / 2 + (i * Math.PI) / 3;
    return [cx + radius * Math.cos(angle), radius * Math.sin(angle)] as [number, number];
  });
}

function ribbonLoop(radius: number): Array<[number, number]> {
  const L = hexagon(radius, -LOBE_OFFSET);
  const R = hexagon(radius, LOBE_OFFSET);
  return [L[5], L[0], L[1], L[2], L[3], L[4], R[1], R[0], R[5], R[4], R[3], R[2]];
}

const squash = (p: [number, number]): [number, number] => [p[0] * SQUASH, p[1]];

function buildCafmPlates() {
  const outer = ribbonLoop(OUTER_RADIUS).map(squash);
  const inner = ribbonLoop(INNER_RADIUS).map(squash);

  const plates: Array<{
    points: Array<[number, number]>;
    fill: string;
    altFill: string;
    highlight?: boolean;
    index: number;
  }> = [];
  let index = 0;

  for (let i = 0; i < outer.length; i++) {
    const j = (i + 1) % outer.length;
    const O1 = outer[i];
    const O2 = outer[j];
    const I1 = inner[i];
    const I2 = inner[j];

    const triangles: Array<Array<[number, number]>> = [
      [O1, O2, I1],
      [O2, I2, I1],
    ];

    for (const points of triangles) {
      const palette = CAFM_ORANGE_FACET_PALETTE[index] || { fill: '#ff6b24', altFill: '#ea580c' };
      plates.push({
        points,
        fill: palette.fill,
        altFill: palette.altFill,
        highlight: palette.highlight,
        index: index++,
      });
    }
  }

  return plates;
}

const CAFM_PLATES = buildCafmPlates();

interface CafmBrandMarkProps {
  className?: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP: Record<string, number> = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
};

export function CafmBrandMark({ className = 'h-7 w-auto', size }: CafmBrandMarkProps) {
  const pixelSize = typeof size === 'number' ? size : size ? SIZE_MAP[size] : undefined;
  return (
    <svg
      viewBox={VIEW_BOX}
      className={`cafm-brand-mark ${className}`}
      role="img"
      aria-label="EntireFM CAFM"
      shapeRendering="geometricPrecision"
      style={pixelSize ? { width: pixelSize, height: pixelSize } : undefined}
    >

      <defs>
        {/* Gradients for each orange crystalline facet */}
        {CAFM_PLATES.map((plate) => (
          <linearGradient
            key={`cafm-grad-${plate.index}`}
            id={`cafm-facet-grad-${plate.index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={plate.fill} />
            <stop offset="100%" stopColor={plate.altFill || plate.fill} />
          </linearGradient>
        ))}

        {/* Operational Orange Neon Drop Glow */}
        <filter id="cafmOrangeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="0.035" floodColor="#ff6b24" floodOpacity="0.8" />
          <feDropShadow dx="0" dy="0" stdDeviation="0.07" floodColor="#ea580c" floodOpacity="0.4" />
        </filter>

        {/* Gentle crystalline shine sweep */}
        <linearGradient id="cafmShineSweep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <clipPath id="cafmRibbonClip">
          {CAFM_PLATES.map((plate) => (
            <polygon key={`cafm-clip-${plate.index}`} points={toSvgPoints(plate.points)} />
          ))}
        </clipPath>
      </defs>

      <g>
        {/* 1. Rich Crystalline Orange Faceted Plates */}
        <g>
          {CAFM_PLATES.map((plate) => (
            <polygon
              key={plate.index}
              points={toSvgPoints(plate.points)}
              fill={`url(#cafm-facet-grad-${plate.index})`}
            />
          ))}
        </g>

        {/* 2. Lit Warm Specular Seams & Internal Ridges */}
        <g>
          {EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={a[0].toFixed(4)}
              y1={(-a[1]).toFixed(4)}
              x2={b[0].toFixed(4)}
              y2={(-b[1]).toFixed(4)}
              stroke="rgba(255, 237, 213, 0.75)"
              strokeWidth={0.015}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* 3. Hot Specular Ridge Highlights */}
        <g stroke="rgba(255, 255, 255, 0.95)" strokeWidth={0.018} strokeLinecap="round">
          {CAFM_PLATES.filter((p) => p.highlight).map((p) => (
            <line
              key={`cafm-hl-${p.index}`}
              x1={p.points[0][0].toFixed(4)}
              y1={(-p.points[0][1]).toFixed(4)}
              x2={p.points[1][0].toFixed(4)}
              y2={(-p.points[1][1]).toFixed(4)}
            />
          ))}
        </g>

        {/* 4. Orange Perimeter Edge Glow */}
        <g
          stroke="#ff6b24"
          strokeWidth={0.024}
          strokeLinecap="round"
          opacity={0.85}
          filter="url(#cafmOrangeGlow)"
        >
          {EDGES.slice(4, 16)
            .filter((_, i) => i % 3 === 0)
            .map(([a, b], i) => (
              <line
                key={`cafm-glow-l-${i}`}
                x1={a[0].toFixed(4)}
                y1={(-a[1]).toFixed(4)}
                x2={b[0].toFixed(4)}
                y2={(-b[1]).toFixed(4)}
              />
            ))}
        </g>
      </g>
    </svg>
  );
}
