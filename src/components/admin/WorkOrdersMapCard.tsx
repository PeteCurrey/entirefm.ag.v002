'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Layers,
  AlertTriangle,
  Clock,
  Building2,
} from 'lucide-react';
import type { WorkOrder } from '@/server/work';
import type { Site } from '@/server/estate';

interface WorkOrdersMapCardProps {
  workOrders: WorkOrder[];
  sites: Site[];
  statusFilter?: string;
  onFilterChange?: (status: string) => void;
}

// UK Postcode Outward Area Centroid Dictionary for robust fallback resolution
const UK_POSTCODE_AREA_COORDS: Record<string, [number, number]> = {
  AB: [57.1497, -2.0943],
  AL: [51.7527, -0.3394],
  B: [52.4862, -1.8904],
  BA: [51.3811, -2.3590],
  BB: [53.7488, -2.4818],
  BD: [53.7960, -1.7594],
  BH: [50.7192, -1.8808],
  BL: [53.5769, -2.4282],
  BN: [50.8225, -0.1372],
  BR: [51.4039, 0.0198],
  BS: [51.4545, -2.5879],
  BT: [54.5973, -5.9301],
  CA: [54.8925, -2.9329],
  CB: [52.2053, 0.1218],
  CF: [51.4816, -3.1791],
  CH: [53.1905, -2.8916],
  CM: [51.7356, 0.4685],
  CO: [51.8959, 0.9036],
  CR: [51.3762, -0.0982],
  CT: [51.2802, 1.0789],
  CV: [52.4068, -1.5197],
  CW: [53.0987, -2.4404],
  DA: [51.4463, 0.2198],
  DD: [56.4620, -2.9707],
  DE: [52.9225, -1.4746],
  DG: [55.0709, -3.6051],
  DH: [54.7761, -1.5733],
  DL: [54.5233, -1.5504],
  DN: [53.5228, -1.1312],
  DT: [50.7112, -2.4412],
  DY: [52.5123, -2.0811],
  E: [51.5273, -0.0556],
  EC: [51.5173, -0.0933],
  EH: [55.9533, -3.1883],
  EN: [51.6538, -0.0799],
  EX: [50.7184, -3.5339],
  FK: [56.0019, -3.7839],
  FY: [53.8175, -3.0357],
  G: [55.8642, -4.2518],
  GL: [51.8642, -2.2380],
  GU: [51.2362, -0.5704],
  HA: [51.5806, -0.3420],
  HD: [53.6458, -1.7850],
  HG: [53.9921, -1.5418],
  HP: [51.7525, -0.4727],
  HR: [52.0564, -2.7160],
  HS: [58.2094, -6.3849],
  HU: [53.7457, -0.3367],
  HX: [53.7226, -1.8604],
  IG: [51.5590, 0.0741],
  IP: [52.0567, 1.1482],
  IV: [57.4778, -4.2247],
  KA: [55.6111, -4.4958],
  KT: [51.4085, -0.3064],
  KW: [58.9809, -2.9605],
  KY: [56.1107, -3.1660],
  L: [53.4084, -2.9916],
  LA: [54.0470, -2.8010],
  LD: [52.2415, -3.3792],
  LE: [52.6369, -1.1398],
  LL: [53.3244, -3.8276],
  LN: [53.2307, -0.5406],
  LS: [53.8008, -1.5491],
  LU: [51.8787, -0.4200],
  M: [53.4808, -2.2426],
  ME: [51.3799, 0.5237],
  MK: [52.0406, -0.7594],
  ML: [55.7925, -3.9855],
  N: [51.5580, -0.1060],
  NE: [54.9783, -1.6178],
  NG: [52.9548, -1.1581],
  NN: [52.2405, -0.9027],
  NP: [51.5842, -2.9977],
  NR: [52.6309, 1.2974],
  NW: [51.5430, -0.2010],
  OL: [53.5409, -2.1114],
  OX: [51.7520, -1.2577],
  PA: [55.8456, -4.4239],
  PE: [52.5695, -0.2405],
  PH: [56.3950, -3.4308],
  PL: [50.3755, -4.1427],
  PO: [50.8198, -1.0880],
  PR: [53.7632, -2.7031],
  RG: [51.4543, -0.9781],
  RH: [51.2407, -0.1743],
  RM: [51.5756, 0.1837],
  S: [53.3811, -1.4701],
  SA: [51.6214, -3.9436],
  SE: [51.4816, -0.0652],
  SG: [51.9038, -0.2023],
  SK: [53.4106, -2.1575],
  SL: [51.5105, -0.5950],
  SM: [51.3614, -0.1945],
  SN: [51.5558, -1.7797],
  SO: [50.9097, -1.4044],
  SP: [51.0688, -1.7945],
  SR: [54.9069, -1.3838],
  SS: [51.5459, 0.7077],
  ST: [53.0027, -2.1794],
  SW: [51.4650, -0.1700],
  SY: [52.7073, -2.7553],
  TA: [51.0154, -3.1042],
  TD: [55.6186, -2.7845],
  TF: [52.6784, -2.4453],
  TN: [51.1894, 0.2632],
  TQ: [50.4619, -3.5253],
  TR: [50.2632, -5.0510],
  TS: [54.5742, -1.2350],
  TW: [51.4447, -0.3361],
  UB: [51.5424, -0.4475],
  W: [51.5150, -0.1900],
  WA: [53.3900, -2.5970],
  WC: [51.5200, -0.1200],
  WD: [51.6565, -0.3903],
  WF: [53.6830, -1.4990],
  WN: [53.5451, -2.6325],
  WR: [52.1936, -2.2216],
  WS: [52.5862, -1.9829],
  WV: [52.5869, -2.1288],
  YO: [53.9590, -1.0815],
  ZE: [60.1550, -1.1450],
};

const UK_CITY_COORDS: Record<string, [number, number]> = {
  london: [51.5074, -0.1278],
  manchester: [53.4808, -2.2426],
  birmingham: [52.4862, -1.8904],
  sheffield: [53.3811, -1.4701],
  leeds: [53.8008, -1.5491],
  liverpool: [53.4084, -2.9916],
  bristol: [51.4545, -2.5879],
  newcastle: [54.9783, -1.6178],
  nottingham: [52.9548, -1.1581],
  edinburgh: [55.9533, -3.1883],
  glasgow: [55.8642, -4.2518],
  cardiff: [51.4816, -3.1791],
  belfast: [54.5973, -5.9301],
};

function resolveCoordinates(
  site: Site | undefined,
  woSite: { postcode?: string; city?: string; latitude?: number; longitude?: number } | undefined
): [number, number] | null {
  // 1. Direct site coordinates
  if (site?.latitude != null && site?.longitude != null && !isNaN(site.latitude) && !isNaN(site.longitude)) {
    return [site.latitude, site.longitude];
  }
  if (woSite?.latitude != null && woSite?.longitude != null && !isNaN(woSite.latitude) && !isNaN(woSite.longitude)) {
    return [woSite.latitude, woSite.longitude];
  }

  // 2. Postcode outward centroid
  const pc = (site?.postcode || woSite?.postcode || '').trim().toUpperCase().replace(/\s+/g, '');
  if (pc.length >= 2) {
    const areaPrefix = pc.match(/^[A-Z]{1,2}/)?.[0];
    if (areaPrefix && UK_POSTCODE_AREA_COORDS[areaPrefix]) {
      return UK_POSTCODE_AREA_COORDS[areaPrefix];
    }
  }

  // 3. City centroid
  const city = (site?.city || woSite?.city || '').trim().toLowerCase();
  if (city && UK_CITY_COORDS[city]) {
    return UK_CITY_COORDS[city];
  }

  return null;
}

interface PlottedLocation {
  id: string;
  coords: [number, number];
  siteName: string;
  siteCode?: string;
  city?: string;
  postcode?: string;
  workOrders: WorkOrder[];
  highestPriority: string;
}

const PRIORITY_ORDER: Record<string, number> = {
  P1_CRITICAL: 1,
  P2_HIGH: 2,
  P3_MEDIUM: 3,
  P4_LOW: 4,
  P5_ROUTINE: 5,
  P5_SCHEDULED: 5,
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; pinBg: string; border: string }> = {
  P1_CRITICAL: { bg: 'bg-rose-500', text: 'text-white', pinBg: '#E11D48', border: '#BE123C' },
  P2_HIGH: { bg: 'bg-amber-500', text: 'text-white', pinBg: '#D97706', border: '#B45309' },
  P3_MEDIUM: { bg: 'bg-blue-500', text: 'text-white', pinBg: '#2563EB', border: '#1D4ED8' },
  P4_LOW: { bg: 'bg-slate-500', text: 'text-white', pinBg: '#64748B', border: '#475569' },
  P5_ROUTINE: { bg: 'bg-zinc-400', text: 'text-white', pinBg: '#71717A', border: '#52525B' },
  P5_SCHEDULED: { bg: 'bg-zinc-400', text: 'text-white', pinBg: '#71717A', border: '#52525B' },
};

export function WorkOrdersMapCard({
  workOrders,
  sites,
  statusFilter = 'OPEN',
}: WorkOrdersMapCardProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mapLibraryLoaded, setMapLibraryLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PlottedLocation | null>(null);
  const [filterMode, setFilterMode] = useState<'OPEN_ONLY' | 'CURRENT_FILTER'>(
    statusFilter === 'OPEN' ? 'OPEN_ONLY' : 'CURRENT_FILTER'
  );

  // Filter orders to pin:
  // When filterMode is OPEN_ONLY: strictly show work orders where status === 'OPEN'
  // When filterMode is CURRENT_FILTER: if statusFilter is 'ALL', show active jobs (OPEN, ISSUED, IN_PROGRESS); otherwise match statusFilter
  const targetWorkOrders = useMemo(() => {
    if (filterMode === 'OPEN_ONLY') {
      return workOrders.filter((wo) => wo.status === 'OPEN');
    }
    if (statusFilter === 'ALL') {
      return workOrders.filter((wo) => ['OPEN', 'ISSUED', 'IN_PROGRESS'].includes(wo.status));
    }
    return workOrders.filter((wo) => wo.status === statusFilter);
  }, [workOrders, filterMode, statusFilter]);

  // Group work orders by geographical coordinate
  const plottedLocations = useMemo(() => {
    const sitesMap = new Map<string, Site>();
    sites.forEach((s) => sitesMap.set(s.id, s));

    const locationMap = new Map<string, PlottedLocation>();

    targetWorkOrders.forEach((wo) => {
      const site = sitesMap.get(wo.site_id);
      const coords = resolveCoordinates(site, wo.site as any);
      if (!coords) return;

      const key = `${coords[0].toFixed(4)},${coords[1].toFixed(4)}`;
      const existing = locationMap.get(key);

      if (existing) {
        existing.workOrders.push(wo);
        const currentRank = PRIORITY_ORDER[existing.highestPriority] || 99;
        const newRank = PRIORITY_ORDER[wo.priority] || 99;
        if (newRank < currentRank) {
          existing.highestPriority = wo.priority;
        }
      } else {
        locationMap.set(key, {
          id: key,
          coords,
          siteName: site?.name || wo.site?.name || 'Assigned Site',
          siteCode: site?.site_code || wo.site?.site_code,
          city: site?.city,
          postcode: site?.postcode || wo.site?.postcode,
          workOrders: [wo],
          highestPriority: wo.priority || 'P3_MEDIUM',
        });
      }
    });

    return Array.from(locationMap.values());
  }, [targetWorkOrders, sites]);

  // Priority count breakdown for badge metrics
  const priorityCounts = useMemo(() => {
    const counts: Record<string, number> = { P1: 0, P2: 0, P3: 0, other: 0 };
    targetWorkOrders.forEach((wo) => {
      if (wo.priority === 'P1_CRITICAL') counts.P1++;
      else if (wo.priority === 'P2_HIGH') counts.P2++;
      else if (wo.priority === 'P3_MEDIUM') counts.P3++;
      else counts.other++;
    });
    return counts;
  }, [targetWorkOrders]);

  // Load Leaflet dynamically in client
  useEffect(() => {
    let isCancelled = false;

    async function loadLeaflet() {
      if (typeof window === 'undefined') return;

      try {
        // 1. Inject Leaflet CSS if missing
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }

        // 2. Inject Leaflet JS if missing
        if (!(window as any).L) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.getElementById('leaflet-js');
            if (existingScript) {
              if ((window as any).L) {
                resolve();
              } else {
                existingScript.addEventListener('load', () => resolve());
                existingScript.addEventListener('error', reject);
              }
              return;
            }

            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.crossOrigin = '';
            script.onload = () => resolve();
            script.onerror = (e) => reject(new Error('Failed to load Leaflet script'));
            document.head.appendChild(script);
          });
        }

        if (!isCancelled) {
          setMapLibraryLoaded(true);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('[WorkOrdersMapCard] Leaflet CDN load warning:', err?.message);
          setMapError(err?.message || 'Failed to initialize tile library');
        }
      }
    }

    loadLeaflet();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Initialize and update map instance
  useEffect(() => {
    if (!mapLibraryLoaded || !mapContainerRef.current || isCollapsed) return;

    const L = (window as any).L;
    if (!L) return;

    // Create map if not created yet
    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [54.5, -2.5],
          zoom: 6,
          minZoom: 4,
          maxZoom: 18,
          scrollWheelZoom: false, // Prevent page scrolling trap
          attributionControl: false,
          zoomControl: true,
        });

        // CartoDB Voyager Tile Layer with OpenStreetMap fallback
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        // Attribution in small corner
        L.control
          .attribution({
            position: 'bottomright',
            prefix: false,
          })
          .addAttribution('&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OSM')
          .addTo(map);

        markersGroupRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      } catch (err: any) {
        console.warn('[WorkOrdersMapCard] Leaflet map init error:', err);
        setMapError(err?.message);
        return;
      }
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Render markers for all plotted locations
    const latLngBounds: any[] = [];

    plottedLocations.forEach((loc) => {
      const { coords, workOrders: locOrders, siteName, city, postcode, highestPriority } = loc;
      latLngBounds.push(coords);

      const colorCfg = PRIORITY_COLORS[highestPriority] || PRIORITY_COLORS.P3_MEDIUM;
      const count = locOrders.length;
      const isCritical = highestPriority === 'P1_CRITICAL';

      // Custom SVG Pin HTML
      const pinHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
          ${
            isCritical
              ? `<span class="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-rose-500/30 animate-ping pointer-events-none"></span>`
              : ''
          }
          <div style="
            background-color: ${colorCfg.pinBg};
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            width: ${count > 1 ? '30px' : '26px'};
            height: ${count > 1 ? '30px' : '26px'};
            border-radius: 50% 50% 50% 4px;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 120ms ease;
          ">
            <div style="
              transform: rotate(45deg);
              color: #ffffff;
              font-size: ${count > 9 ? '10px' : '11px'};
              font-weight: 700;
              line-height: 1;
              text-align: center;
            ">
              ${count > 1 ? count : '!'}
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-wo-pin',
        html: pinHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -32],
      });

      // Build popup content
      const ordersHtml = locOrders
        .map((wo) => {
          const pCfg = PRIORITY_COLORS[wo.priority] || PRIORITY_COLORS.P3_MEDIUM;
          const dueStr = wo.sla_resolution_due_at
            ? new Date(wo.sla_resolution_due_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : null;

          return `
            <div style="padding: 8px 0; border-top: 1px solid #E4E4E1;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <span style="font-weight: 600; font-size: 11px; color: #101010;">${wo.work_order_number}</span>
                <span style="
                  font-size: 9px;
                  font-weight: 700;
                  padding: 1px 6px;
                  border-radius: 4px;
                  background-color: ${pCfg.pinBg};
                  color: #ffffff;
                ">${wo.priority}</span>
              </div>
              <div style="font-size: 11.5px; font-weight: 500; color: #101010; margin-top: 2px; line-height: 1.3;">
                ${wo.title}
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px; font-size: 10px; color: #686866;">
                <span>${wo.work_type ? wo.work_type.replace(/_/g, ' ') : 'REACTIVE'}</span>
                ${dueStr ? `<span>Due: ${dueStr}</span>` : ''}
              </div>
              <div style="margin-top: 6px; text-align: right;">
                <a href="/admin/operations/work-orders/${encodeURIComponent(wo.id)}"
                  style="font-size: 11px; font-weight: 600; color: #EA580C; text-decoration: none;"
                  target="_self"
                >
                  View Order &rarr;
                </a>
              </div>
            </div>
          `;
        })
        .join('');

      const popupContent = `
        <div style="font-family: inherit; min-width: 240px; max-width: 300px; padding: 2px;">
          <div style="padding-bottom: 6px;">
            <div style="font-weight: 700; font-size: 12.5px; color: #101010; line-height: 1.2;">${siteName}</div>
            <div style="font-size: 10.5px; color: #686866; margin-top: 2px;">
              ${[city, postcode].filter(Boolean).join(' &middot; ')}
            </div>
          </div>
          <div style="max-height: 240px; overflow-y: auto;">
            ${ordersHtml}
          </div>
        </div>
      `;

      const marker = L.marker(coords, { icon: customIcon }).addTo(markersGroup);
      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'cafm-leaflet-popup',
        maxWidth: 320,
      });

      marker.on('click', () => {
        setSelectedLocation(loc);
      });
    });

    // Auto fit bounds to markers if present
    if (latLngBounds.length > 0) {
      if (latLngBounds.length === 1) {
        map.setView(latLngBounds[0], 12);
      } else {
        const bounds = L.latLngBounds(latLngBounds);
        map.fitBounds(bounds, {
          padding: [45, 45],
          maxZoom: 13,
        });
      }
    } else {
      map.setView([54.5, -2.5], 6);
    }
  }, [mapLibraryLoaded, plottedLocations, isCollapsed]);

  // Handler to refocus map
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (plottedLocations.length > 0) {
      const L = (window as any).L;
      if (L) {
        const bounds = L.latLngBounds(plottedLocations.map((l) => l.coords));
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 });
      }
    } else {
      map.setView([54.5, -2.5], 6);
    }
  };

  return (
    <div className="rounded-[10px] border border-[#E4E4E1] bg-[#FFFFFF] shadow-xs overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-[#E4E4E1] bg-[#FAFAF8] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-[6px] bg-[#EA580C]/10 text-[#EA580C] border border-[#EA580C]/20">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#101010]">
                Open Work Orders Geospatial Radar
              </h3>
              <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-[11px] text-[#686866] mt-0.5">
              Geospatial distribution of reactive and scheduled callouts across managed client estates.
            </p>
          </div>
        </div>

        {/* Status Metrics & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Plotted Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white border border-[#E4E4E1] text-[11px]">
            <span className="font-semibold text-[#101010]">{plottedLocations.length}</span>
            <span className="text-[#686866]">Sites</span>
            <span className="text-[#E4E4E1]">|</span>
            <span className="font-semibold text-[#EA580C]">{targetWorkOrders.length}</span>
            <span className="text-[#686866]">Orders Pinned</span>
          </div>

          {/* Priority Breakdown Pills */}
          {priorityCounts.P1 > 0 && (
            <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              {priorityCounts.P1} P1 Critical
            </span>
          )}
          {priorityCounts.P2 > 0 && (
            <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
              {priorityCounts.P2} P2 High
            </span>
          )}

          {/* Toggle Filter Mode */}
          <div className="flex items-center rounded-[6px] border border-[#E4E4E1] bg-white p-0.5 text-[10.5px]">
            <button
              type="button"
              onClick={() => setFilterMode('OPEN_ONLY')}
              className={`px-2 py-0.5 rounded-[4px] font-medium transition-colors ${
                filterMode === 'OPEN_ONLY'
                  ? 'bg-[#101010] text-white'
                  : 'text-[#686866] hover:text-[#101010]'
              }`}
              title="Only show work orders with status OPEN"
            >
              Open Only
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('CURRENT_FILTER')}
              className={`px-2 py-0.5 rounded-[4px] font-medium transition-colors ${
                filterMode === 'CURRENT_FILTER'
                  ? 'bg-[#101010] text-white'
                  : 'text-[#686866] hover:text-[#101010]'
              }`}
              title="Match table filter status"
            >
              All Active
            </button>
          </div>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-1 rounded-[6px] border border-[#E4E4E1] bg-white text-[#686866] hover:text-[#101010] hover:bg-[#FAFAF8] transition-colors"
            title="Fit all pins"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Expand Height Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-[6px] border border-[#E4E4E1] bg-white text-[#686866] hover:text-[#101010] hover:bg-[#FAFAF8] transition-colors"
            title={isExpanded ? 'Compact height' : 'Expand height'}
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Collapse Panel Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-[6px] border border-[#E4E4E1] bg-white text-[#686866] hover:text-[#101010] hover:bg-[#FAFAF8] transition-colors"
            title={isCollapsed ? 'Show map' : 'Hide map'}
          >
            {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Canvas Body */}
      {!isCollapsed && (
        <div className="relative w-full">
          {/* Loading or Error State */}
          {!mapLibraryLoaded && !mapError && (
            <div
              className={`flex flex-col items-center justify-center bg-[#FAFAF8] text-center ${
                isExpanded ? 'h-[520px]' : 'h-[360px]'
              }`}
            >
              <div className="h-9 w-9 rounded-full border border-[#EA580C]/40 bg-[#EA580C]/10 p-2 text-[#EA580C] animate-spin">
                <RefreshCw className="h-full w-full" />
              </div>
              <p className="text-xs text-[#101010] font-medium mt-3">Initialising Cartographic Canvas…</p>
              <p className="text-[11px] text-[#686866] mt-0.5">Plotting open work orders across UK estates</p>
            </div>
          )}

          {/* Fallback Empty State when no orders are geocoded */}
          {mapLibraryLoaded && plottedLocations.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs p-6 text-center">
              <div className="h-10 w-10 rounded-full border border-[#E4E4E1] bg-[#FAFAF8] flex items-center justify-center text-[#9B9B97]">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-semibold text-[#101010] mt-2">No Open Work Orders Geocoded</h4>
              <p className="text-[11.5px] text-[#686866] max-w-sm mt-1">
                {targetWorkOrders.length === 0
                  ? 'There are currently no work orders matching this filter.'
                  : 'Open work orders exist, but their associated sites do not have recorded UK postcodes or coordinates yet.'}
              </p>
              <Link
                href="/admin/estate/sites"
                className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-[6px] text-xs font-medium text-[#EA580C] bg-[#EA580C]/10 hover:bg-[#EA580C]/20 transition-colors"
              >
                <Building2 className="h-3 w-3" />
                Manage Estate Sites &rarr;
              </Link>
            </div>
          )}

          {/* Leaflet Map Div */}
          <div
            ref={mapContainerRef}
            className={`w-full bg-[#FAFAF8] ${isExpanded ? 'h-[520px]' : 'h-[360px]'}`}
            style={{ zIndex: 1 }}
          />

          {/* Selected Site Drawer Overlay */}
          {selectedLocation && (
            <div className="absolute top-3 right-3 z-20 max-w-sm w-full bg-white rounded-[8px] border border-[#E4E4E1] shadow-lg p-3.5 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-start justify-between pb-2 border-b border-[#E4E4E1]">
                <div>
                  <h4 className="text-xs font-semibold text-[#101010]">{selectedLocation.siteName}</h4>
                  <p className="text-[10.5px] text-[#686866]">
                    {[selectedLocation.city, selectedLocation.postcode].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLocation(null)}
                  className="text-[#9B9B97] hover:text-[#101010] text-xs font-bold px-1"
                >
                  &times;
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-[220px] overflow-y-auto">
                {selectedLocation.workOrders.map((wo) => {
                  const pCfg = PRIORITY_COLORS[wo.priority] || PRIORITY_COLORS.P3_MEDIUM;
                  return (
                    <div key={wo.id} className="p-2 rounded border border-[#E4E4E1] bg-[#FAFAF8] text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#101010] text-[11px]">
                          {wo.work_order_number}
                        </span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[9.5px] font-bold text-white"
                          style={{ backgroundColor: pCfg.pinBg }}
                        >
                          {wo.priority}
                        </span>
                      </div>
                      <div className="font-medium text-[#101010] text-[11.5px] mt-1">{wo.title}</div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E4E4E1] text-[10.5px]">
                        <span className="text-[#686866] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {wo.sla_resolution_due_at
                            ? new Date(wo.sla_resolution_due_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'No SLA'}
                        </span>
                        <Link
                          href={`/admin/operations/work-orders/${encodeURIComponent(wo.id)}`}
                          className="text-[#EA580C] font-semibold hover:underline inline-flex items-center gap-0.5"
                        >
                          View Order <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
