'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Rotate3d, 
  ZoomIn, 
  Layers, 
  Sparkles, 
  Crosshair, 
  Activity, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Eye,
  CheckCircle2,
  Maximize2
} from 'lucide-react';

interface Marker3D {
  id: string;
  name: string;
  category: string;
  // 3D coordinates relative to building origin [-100 to 100]
  x: number;
  y: number;
  z: number;
  priority: 'P1' | 'P2' | 'P3' | 'Compliant';
  condition: string;
  lastInspection: string;
  recommendedAction: string;
  workOrderRef?: string;
  trade: string;
}

const MARKERS_3D: Marker3D[] = [
  {
    id: 'm-roof',
    name: 'ROOF WATERPROOFING ZONE B',
    category: 'ROOF MEMBRANE',
    x: -25,
    y: 35,
    z: -15,
    priority: 'P1',
    condition: 'Delamination Seam Breach Detected',
    lastInspection: 'Commercial Drone Flight · Today',
    recommendedAction: 'Targeted hot-air weld patch & perimeter mastic seal via rope access.',
    workOrderRef: 'WO-2026-9142',
    trade: 'EntireFM Specialist Roofing',
  },
  {
    id: 'm-plant',
    name: 'ROOFTOP HVAC CHILLER PLINTH',
    category: 'PLANT DECK',
    x: 35,
    y: 42,
    z: 20,
    priority: 'P2',
    condition: 'Aged Code 4 Lead Flashing Crease Stress',
    lastInspection: '48MP Telephoto Survey · Today',
    recommendedAction: 'Dress new lead flashing and renew polyurethane counter-seal.',
    workOrderRef: 'WO-2026-9155',
    trade: 'EntireFM Mechanical & Hard Services',
  },
  {
    id: 'm-facade',
    name: 'SOUTH CURTAIN WALL FAÇADE',
    category: 'FACADE & GLAZING',
    x: -45,
    y: -10,
    z: 40,
    priority: 'P1',
    condition: 'Vertical Expansion Joint Seal Separation (Floor 5)',
    lastInspection: 'Drone High-Resolution Elevation Scan',
    recommendedAction: 'IRATA 2-man rope access cut-out and Dowsil 791 silicone renewal.',
    workOrderRef: 'WO-2026-9160',
    trade: 'EntireFM IRATA Rope Access',
  },
  {
    id: 'm-solar',
    name: 'ROOFTOP SOLAR PV ARRAY STRING 14',
    category: 'SOLAR PV',
    x: 10,
    y: 38,
    z: -35,
    priority: 'P2',
    condition: 'Bypass Diode Hotspot Anomaly (+24.6°C Delta-T)',
    lastInspection: 'Radiometric Thermal Flight',
    recommendedAction: 'Test string Voc and replace defective 450W PV module.',
    workOrderRef: 'WO-2026-9172',
    trade: 'EntireFM Approved Electrical (NICEIC)',
  },
  {
    id: 'm-drainage',
    name: 'CENTRAL VALLEY GUTTER & DRAINAGE',
    category: 'DRAINAGE',
    x: 0,
    y: 30,
    z: 5,
    priority: 'P2',
    condition: 'Silt & Moss Surcharge Obstructing Outlets',
    lastInspection: 'Orthomosaic Drainage Review',
    recommendedAction: 'Commercial high-reach gutter vacuum clearance and downpipe flush.',
    workOrderRef: 'WO-2026-9148',
    trade: 'EntireFM Specialist Cleaning & Drainage',
  },
  {
    id: 'm-asset',
    name: 'MAIN BUILDING STRUCTURE BASELINE',
    category: 'ASSET REGISTER',
    x: 0,
    y: -40,
    z: 0,
    priority: 'Compliant',
    condition: 'Structural Concrete Baseline Verified Stable',
    lastInspection: 'Photogrammetric 3D Reality Mesh',
    recommendedAction: 'Maintain scheduled annual aerial baseline cadence.',
    workOrderRef: 'AST-BLD-01',
    trade: 'EntireFM Facilities Management',
  },
];

export function Drone3DDigitalTwin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker3D>(MARKERS_3D[0]);
  const [viewMode, setViewMode] = useState<'splat' | 'wireframe' | 'solid'>('splat');
  const [isRotating, setIsRotating] = useState(true);

  // Rotation & camera state
  const rotX = useRef<number>(20);
  const rotY = useRef<number>(-35);
  const zoom = useRef<number>(1.1);
  const isDragging = useRef<boolean>(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Projected 2D positions of 3D markers for DOM hitboxes
  const [projectedMarkers, setProjectedMarkers] = useState<{ id: string; x: number; y: number; visible: boolean }[]>([]);

  // 3D Projection Math
  const project3D = useCallback((x3d: number, y3d: number, z3d: number, width: number, height: number) => {
    const radX = (rotX.current * Math.PI) / 180;
    const radY = (rotY.current * Math.PI) / 180;

    // Rotate around Y axis
    const x1 = x3d * Math.cos(radY) + z3d * Math.sin(radY);
    const z1 = -x3d * Math.sin(radY) + z3d * Math.cos(radY);
    const y1 = y3d;

    // Rotate around X axis
    const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);
    const x2 = x1;

    // Camera perspective distance
    const cameraDist = 320;
    const perspective = cameraDist / (cameraDist + z2);

    const screenX = width / 2 + x2 * zoom.current * perspective * 2.2;
    const screenY = height / 2 - y2 * zoom.current * perspective * 2.2;

    return {
      x: screenX,
      y: screenY,
      z: z2,
      scale: perspective * zoom.current,
      visible: z2 > -280,
    };
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (isRotating && !isDragging.current) {
        rotY.current = (rotY.current + 0.25) % 360;
      }

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Generate or render point cloud / reality mesh geometry
      // 1. Grid base floor
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.15)';
      ctx.lineWidth = 1;

      for (let i = -100; i <= 100; i += 25) {
        const p1 = project3D(i, -60, -100, width, height);
        const p2 = project3D(i, -60, 100, width, height);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project3D(-100, -60, i, width, height);
        const p4 = project3D(100, -60, i, width, height);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // 2. Building Architectural Geometry (Building Volume & Plant Deck)
      const buildingVertices = [
        // Main block lower
        { x: -60, y: -55, z: -40 },
        { x: 60, y: -55, z: -40 },
        { x: 60, y: 30, z: -40 },
        { x: -60, y: 30, z: -40 },
        { x: -60, y: -55, z: 40 },
        { x: 60, y: -55, z: 40 },
        { x: 60, y: 30, z: 40 },
        { x: -60, y: 30, z: 40 },
        // Rooftop plant enclosure
        { x: 15, y: 30, z: 0 },
        { x: 50, y: 30, z: 0 },
        { x: 50, y: 48, z: 0 },
        { x: 15, y: 48, z: 0 },
        { x: 15, y: 30, z: 30 },
        { x: 50, y: 30, z: 30 },
        { x: 50, y: 48, z: 30 },
        { x: 15, y: 48, z: 30 },
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // front main
        [4, 5], [5, 6], [6, 7], [7, 4], // back main
        [0, 4], [1, 5], [2, 6], [3, 7], // connectors
        // plant deck
        [8, 9], [9, 10], [10, 11], [11, 8],
        [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
      ];

      if (viewMode === 'wireframe' || viewMode === 'solid') {
        ctx.strokeStyle = viewMode === 'wireframe' ? 'rgba(0, 210, 255, 0.45)' : 'rgba(237, 56, 153, 0.5)';
        ctx.lineWidth = 1.2;

        edges.forEach(([start, end]) => {
          const p1 = project3D(buildingVertices[start].x, buildingVertices[start].y, buildingVertices[start].z, width, height);
          const p2 = project3D(buildingVertices[end].x, buildingVertices[end].y, buildingVertices[end].z, width, height);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });
      }

      // 3. Dense Point Cloud / Gaussian Splat Simulation Points
      if (viewMode === 'splat') {
        const pointDensity = 320;
        for (let i = 0; i < pointDensity; i++) {
          const angle = (i / pointDensity) * Math.PI * 4;
          const radius = 20 + (i % 55);
          const px = Math.cos(angle) * radius * (i % 2 === 0 ? 1 : 0.8);
          const py = -50 + (i % 95);
          const pz = Math.sin(angle) * radius * 0.9;

          const proj = project3D(px, py, pz, width, height);
          if (proj.visible) {
            const hue = (i * 7) % 360;
            ctx.fillStyle = i % 3 === 0 ? '#ED3899' : i % 5 === 0 ? '#00d2ff' : '#4F46E5';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, Math.max(1, 1.6 * proj.scale), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Update Projected 2D coordinates for UI overlay pins
      const projected = MARKERS_3D.map((m) => {
        const proj = project3D(m.x, m.y, m.z, width, height);
        return {
          id: m.id,
          x: proj.x,
          y: proj.y,
          visible: proj.visible,
        };
      });
      setProjectedMarkers(projected);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [project3D, isRotating, viewMode]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    rotY.current = (rotY.current + deltaX * 0.6) % 360;
    rotX.current = Math.max(-60, Math.min(75, rotX.current - deltaY * 0.4));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    zoom.current = Math.max(0.6, Math.min(2.4, zoom.current - e.deltaY * 0.0015));
  };

  const resetView = () => {
    rotX.current = 20;
    rotY.current = -35;
    zoom.current = 1.1;
  };

  return (
    <section 
      id="digital-twin-3d"
      aria-label="Immersive 3D Digital Twin and Reality Capture"
      className="py-24 bg-brand-void text-white relative overflow-hidden border-b border-brand-edge-dark"
    >
      <div className="container-custom relative z-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/15">
              <Box className="h-3.5 w-3.5 text-brand-pink" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white font-light">
                REALITY CAPTURE &amp; SPATIAL ASSET TWIN
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
              YOUR BUILDING. <br />
              <span className="text-hero-pink font-light">
                AS A LIVING DIGITAL ASSET.
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Drone capture can become a navigable spatial record of your entire estate — connected directly to real-time inspection findings, asset condition registers, and live EntireCAFM maintenance histories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/services/drone-services/digital-twin-3d-capture"
              className="inline-flex items-center gap-2 rounded-sm border border-brand-pink bg-brand-pink/10 px-5 py-2.5 text-xs font-mono text-white hover:bg-brand-pink hover:text-white transition-colors"
            >
              <span>Explore Digital Twin Service</span>
              <ArrowRight className="h-3.5 w-3.5 text-brand-pink" />
            </Link>
          </div>
        </div>

        {/* The 3D Digital Twin Viewer Canvas Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 3D Canvas Viewport */}
          <div className="lg:col-span-8 rounded-sm bg-brand-carbon border border-brand-edge-dark overflow-hidden relative min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] flex items-center justify-center shadow-elevated select-none">
            {/* Background 3D Radar Grid Ambience */}
            <div 
              aria-hidden="true" 
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle, #00d2ff 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
              }}
            />

            {/* Interactive HTML5 3D WebGL / Point Cloud Canvas */}
            <canvas
              ref={canvasRef}
              width={900}
              height={640}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              className="w-full h-full cursor-grab active:cursor-grabbing block"
            />

            {/* Floating 3D FM Spatial Pins on Top of Canvas */}
            {projectedMarkers.map((p) => {
              const markerData = MARKERS_3D.find(m => m.id === p.id);
              if (!markerData || !p.visible) return null;

              const isSelected = selectedMarker.id === p.id;
              const isP1 = markerData.priority === 'P1';

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedMarker(markerData)}
                  style={{ top: `${p.y}px`, left: `${p.x}px` }}
                  aria-label={`Inspect 3D spatial asset: ${markerData.name}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-200 group/pin ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {(isSelected || isP1) && (
                      <span className="absolute -inset-2 rounded-full bg-brand-pink/50 animate-ping pointer-events-none" />
                    )}
                    <div 
                      className={`px-2 py-1 rounded-sm text-[9.5px] font-mono font-bold flex items-center gap-1 border shadow-elevated backdrop-blur-md transition-colors ${
                        isSelected
                          ? 'bg-white text-brand-void border-white ring-2 ring-brand-pink'
                          : isP1
                          ? 'bg-rose-950/90 text-rose-300 border-rose-500'
                          : 'bg-brand-void/90 text-brand-mist border-brand-edge-dark hover:border-brand-pink'
                      }`}
                    >
                      <Crosshair className="h-2.5 w-2.5 text-brand-pink" />
                      <span>{markerData.category}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Viewport Top Left HUD */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10.5px] text-slate-300">
              <Rotate3d className="h-3.5 w-3.5 text-brand-electric-bright animate-spin" />
              <span>3D SPATIAL MODEL · DRAG TO ORBIT / SCROLL TO ZOOM</span>
            </div>

            {/* Viewport Top Right Mode Controls */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10px]">
              {(['splat', 'wireframe', 'solid'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-2 py-1 rounded-sm uppercase tracking-wider transition-colors ${
                    viewMode === mode ? 'bg-brand-pink text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Viewport Bottom Controls */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-sm bg-brand-void/90 border border-white/10 backdrop-blur-md font-mono text-[10.5px] text-slate-300">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsRotating(!isRotating)}
                  className="hover:text-brand-pink transition-colors flex items-center gap-1"
                >
                  <Activity className="h-3 w-3 text-brand-pink" />
                  <span>{isRotating ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetView}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Camera</span>
                </button>
              </div>

              <span className="text-slate-400 text-[10px]">
                6 Georeferenced FM Intelligence Pins Active
              </span>
            </div>
          </div>

          {/* Right Selected 3D Marker Intelligence Card */}
          <div className="lg:col-span-4 rounded-sm bg-brand-carbon border border-brand-edge-dark p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-elevated">
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-edge-dark pb-3">
                <span className="font-mono text-xs text-brand-pink font-semibold uppercase tracking-wider">
                  SPATIAL TWIN PIN
                </span>
                <span className={`px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold border ${
                  selectedMarker.priority === 'P1'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : selectedMarker.priority === 'P2'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {selectedMarker.priority}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h3 className="text-lg font-light text-white tracking-tight">
                  {selectedMarker.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono block">
                  Category: {selectedMarker.category}
                </span>
              </div>

              {/* Readouts */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-sm bg-brand-void/70 border border-brand-edge-dark space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Condition Diagnostic</span>
                  <div className="text-white font-medium">{selectedMarker.condition}</div>
                  <div className="text-slate-400 text-[10.5px]">Last Survey: {selectedMarker.lastInspection}</div>
                </div>

                <div className="p-3 rounded-sm bg-brand-pink/10 border border-brand-pink/25 space-y-1">
                  <span className="text-[10px] text-brand-pink uppercase tracking-widest block font-bold">Recommended Remedial Action</span>
                  <div className="text-slate-200 font-sans text-xs font-light">{selectedMarker.recommendedAction}</div>
                </div>

                <div className="p-3 rounded-sm bg-brand-void/70 border border-brand-edge-dark flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">CAFM Work Order:</span>
                  <span className="text-brand-electric-bright font-bold">{selectedMarker.workOrderRef}</span>
                </div>

                <div className="p-3 rounded-sm bg-brand-void/70 border border-brand-edge-dark flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Assigned Trade:</span>
                  <span className="text-slate-200">{selectedMarker.trade}</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-brand-edge-dark space-y-2">
              <Link
                href="/services/drone-services/digital-twin-3d-capture"
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink to-brand-magenta py-3 px-4 text-xs font-medium text-white shadow-elevated hover:shadow-glow-pink transition-all group"
              >
                <span>View Full Digital Twin Specification</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
