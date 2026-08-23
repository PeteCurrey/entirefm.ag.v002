'use client';

import React, { useEffect, useRef, useState } from 'react';
import { buildMarkFacets, spectrumAt } from '@/lib/brand/mark-geometry';

/**
 * THE MARK, IN WEBGL
 * ==================
 * Renders the EntireFM mark as real 3D geometry and animates it assembling
 * from scattered fragments — each facet flies in from a displaced, rotated
 * position and settles into place, then the whole form drifts very slowly.
 *
 * Written against raw WebGL2 rather than a 3D library. The geometry is 96
 * triangles and the shading is flat; pulling in a full scene graph for that
 * would add far more to the bundle than the effect is worth on a page whose
 * job is to load fast.
 *
 * DEGRADATION
 * -----------
 * Three ways this backs off, in order:
 *   · `prefers-reduced-motion` — renders the assembled mark immediately and
 *     never animates or drifts.
 *   · No WebGL2 context — `onFallback` fires and the parent shows the
 *     supplied logo image instead.
 *   · Tab hidden — the loop stops, so a background tab costs nothing.
 *
 * The canvas is decorative; the accessible name for the mark lives on the
 * parent's fallback image.
 */

interface MarkCanvasProps {
  className?: string;
  /** Seconds to wait before the assembly begins. */
  delay?: number;
  /** Called if WebGL2 is unavailable, so the parent can show a static mark. */
  onFallback?: () => void;
  /** Called once the assembly has finished. */
  onAssembled?: () => void;
  /** Skip the assembly and render the settled mark. */
  assembled?: boolean;
}

const VERT = `#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aCentroid;
in vec3 aNormal;
in vec3 aScatter;
in float aT;
in float aSeed;
in vec3 aBary;

uniform float uProgress;   // 0 = fully scattered, 1 = assembled
uniform float uTime;
uniform vec2  uRotate;     // ambient + pointer rotation, radians
uniform float uAspect;

out vec3 vNormal;
out float vT;
out float vFacet;
out vec3 vBary;
out vec3 vViewPos;

// Rodrigues rotation of v about a unit axis.
vec3 rotateAxis(vec3 v, vec3 axis, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
}

mat3 rotY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

mat3 rotX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}

void main() {
  // Each facet starts moving at a slightly different time, so the form
  // gathers rather than snapping together in one frame.
  float p = clamp((uProgress - aSeed * 0.5) / 0.5, 0.0, 1.0);
  p = 1.0 - pow(1.0 - p, 3.0); // ease-out cubic

  vec3 local = aPosition - aCentroid;
  vec3 axis = normalize(aScatter + vec3(0.31, 0.57, 0.19));

  // Scattered start: pushed out along its own direction and tumbled.
  // NB: 'centroid' is a reserved interpolation qualifier in GLSL ES 3.00 and
  // cannot be used as a variable name.
  vec3 origin = aCentroid + aScatter * (1.0 - p) * 2.6;
  vec3 pos = origin + rotateAxis(local, axis, (1.0 - p) * 4.2);

  mat3 model = rotY(uRotate.x) * rotX(uRotate.y);
  pos = model * pos;
  vec3 nrm = model * rotateAxis(aNormal, axis, (1.0 - p) * 4.2);

  // Gentle perspective. The mark sits a little way back from the camera.
  float z = pos.z + 5.2;
  vec2 projected = pos.xy * (3.4 / z);
  projected.x /= uAspect;

  gl_Position = vec4(projected, (z - 3.0) / 12.0, 1.0);

  vNormal = nrm;
  vT = aT;
  vFacet = p;
  vBary = aBary;
  vViewPos = pos;
}
`;

const FRAG = `#version 300 es
precision highp float;

in vec3 vNormal;
in float vT;
in float vFacet;
in vec3 vBary;
in vec3 vViewPos;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;

out vec4 outColor;

vec3 spectrum(float t) {
  if (t < 0.38) return mix(uColorA, uColorB, t / 0.38);
  if (t < 0.70) return mix(uColorB, uColorC, (t - 0.38) / 0.32);
  return mix(uColorC, uColorD, (t - 0.70) / 0.30);
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));

  // Two lights: a cool key from the upper left, a violet rim from behind.
  vec3 key = normalize(vec3(-0.45, 0.75, 0.9));
  vec3 rim = normalize(vec3(0.6, -0.3, -0.8));

  float kd = max(dot(n, key), 0.0);
  float rd = pow(max(dot(n, rim), 0.0), 2.0);

  vec3 base = spectrum(clamp(vT, 0.0, 1.0));

  vec3 color = base * (0.50 + 0.85 * kd) + vec3(0.42, 0.30, 0.85) * rd * 0.6;

  // Specular glint along the steeper facets.
  float spec = pow(max(dot(reflect(-key, n), viewDir), 0.0), 24.0);
  color += vec3(0.85, 0.90, 1.0) * spec * 0.6;

  // Fresnel lift at grazing angles — the glassy edge of the original artwork.
  float fresnel = pow(1.0 - abs(dot(n, viewDir)), 3.0);
  color += mix(base, vec3(0.75, 0.85, 1.0), 0.5) * fresnel * 0.85;

  // Facet edges. Without these the coplanar triangles merge into a flat slab
  // and the crystalline read is lost entirely. Derivative-based width keeps
  // the line one pixel wide at any distance or resolution.
  vec3 d = fwidth(vBary);
  vec3 edges = smoothstep(vec3(0.0), d * 1.6, vBary);
  float edge = 1.0 - min(min(edges.x, edges.y), edges.z);
  color += mix(base, vec3(1.0), 0.65) * edge * 0.85;

  outColor = vec4(color, vFacet);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed');
  }
  return shader;
}

export function MarkCanvas({
  className = '',
  delay = 0,
  onFallback,
  onAssembled,
  assembled = false,
}: MarkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      setFailed(true);
      onFallback?.();
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Geometry ────────────────────────────────────────────────────────────
    const facets = buildMarkFacets();
    const count = facets.length * 3;
    const positions = new Float32Array(count * 3);
    const centroids = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const scatters = new Float32Array(count * 3);
    const ts = new Float32Array(count);
    const seeds = new Float32Array(count);
    const barys = new Float32Array(count * 3);

    // Deterministic pseudo-random, so the scatter is identical every load.
    const rand = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    facets.forEach((facet, f) => {
      const verts = [facet.a, facet.b, facet.c];
      const cx = (facet.a[0] + facet.b[0] + facet.c[0]) / 3;
      const cy = (facet.a[1] + facet.b[1] + facet.c[1]) / 3;
      const cz = (facet.a[2] + facet.b[2] + facet.c[2]) / 3;

      // Face normal from the triangle's own winding — flat shading throughout.
      const u = [facet.b[0] - facet.a[0], facet.b[1] - facet.a[1], facet.b[2] - facet.a[2]];
      const v = [facet.c[0] - facet.a[0], facet.c[1] - facet.a[1], facet.c[2] - facet.a[2]];
      let nx = u[1] * v[2] - u[2] * v[1];
      let ny = u[2] * v[0] - u[0] * v[2];
      let nz = u[0] * v[1] - u[1] * v[0];
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;

      // Fragments come from outside the form, biased away from its centre so
      // they converge inward rather than crossing through each other.
      const theta = rand(f) * Math.PI * 2;
      const phi = (rand(f + 91) - 0.5) * Math.PI;
      const sx = Math.cos(theta) * Math.cos(phi) * 0.8 + cx * 0.4;
      const sy = Math.sin(phi) * 0.8 + cy * 0.4;
      const sz = Math.sin(theta) * Math.cos(phi) * 0.7;

      for (let i = 0; i < 3; i++) {
        const k = f * 3 + i;
        positions.set(verts[i], k * 3);
        centroids.set([cx, cy, cz], k * 3);
        normals.set([nx, ny, nz], k * 3);
        scatters.set([sx, sy, sz], k * 3);
        ts[k] = facet.t;
        seeds[k] = rand(f + 17);
        // (1,0,0) / (0,1,0) / (0,0,1) — lets the fragment shader find edges.
        barys.set([i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0], k * 3);
      }
    });

    // ── Program ─────────────────────────────────────────────────────────────
    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'link failed');
      }
    } catch (err) {
      // Surfacing this matters: a silent fallback hides a shader bug behind a
      // static image that looks almost right.
      console.error('[MarkCanvas] shader/program failure:', err);
      setFailed(true);
      onFallback?.();
      return;
    }

    gl.useProgram(program);

    const bind = (name: string, data: Float32Array, size: number) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, name);
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      }
    };

    bind('aPosition', positions, 3);
    bind('aCentroid', centroids, 3);
    bind('aNormal', normals, 3);
    bind('aScatter', scatters, 3);
    bind('aT', ts, 1);
    bind('aSeed', seeds, 1);
    bind('aBary', barys, 3);

    const uProgress = gl.getUniformLocation(program, 'uProgress');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uRotate = gl.getUniformLocation(program, 'uRotate');
    const uAspect = gl.getUniformLocation(program, 'uAspect');

    const rgb = (t: number) => spectrumAt(t).map((c) => c / 255) as [number, number, number];
    gl.uniform3fv(gl.getUniformLocation(program, 'uColorA'), rgb(0));
    gl.uniform3fv(gl.getUniformLocation(program, 'uColorB'), rgb(0.38));
    gl.uniform3fv(gl.getUniformLocation(program, 'uColorC'), rgb(0.7));
    gl.uniform3fv(gl.getUniformLocation(program, 'uColorD'), rgb(1));

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // ── Sizing ──────────────────────────────────────────────────────────────
    let aspect = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = w / h;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // ── Pointer parallax ────────────────────────────────────────────────────
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener('pointermove', onPointerMove, { passive: true });

    // ── Loop ────────────────────────────────────────────────────────────────
    let raf = 0;
    let start = 0;
    let announced = false;
    let rotX = 0;
    let rotY = 0;

    const ASSEMBLY_SECONDS = 2.4;

    const frame = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;

      const progress =
        reduced || assembled
          ? 1
          : Math.min(1, Math.max(0, (elapsed - delay) / ASSEMBLY_SECONDS));

      if (!announced && progress >= 1) {
        announced = true;
        onAssembled?.();
      }

      // Ambient drift plus a little pointer lean, eased so it never snaps.
      const ambientY = reduced ? 0.34 : 0.34 + Math.sin(elapsed * 0.18) * 0.16;
      const ambientX = reduced ? -0.16 : -0.16 + Math.cos(elapsed * 0.13) * 0.07;
      const targetY = ambientY + pointer.x * 0.2;
      const targetX = ambientX + pointer.y * 0.14;
      rotY += (targetY - rotY) * 0.045;
      rotX += (targetX - rotX) * 0.045;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uProgress, progress);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uRotate, rotY, rotX);
      gl.uniform1f(uAspect, aspect);
      gl.drawArrays(gl.TRIANGLES, 0, count);

      // Once settled under reduced motion there is nothing left to animate.
      if (reduced && progress >= 1) return;
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
    };
    // The animation is configured once; changing these mid-flight would restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
