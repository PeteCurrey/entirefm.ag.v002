'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Site } from '@/server/estate';
import {
  resolveSiteCoordinates,
  UK_MAP_DEFAULT_CENTER,
  UK_MAP_DEFAULT_ZOOM,
} from '@/lib/geo/uk-coordinates';
import {
  MapPin,
  Navigation,
  Layers,
  ArrowUpRight,
  X,
  Maximize2,
  Minimize2,
  Building2,
  Search,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface EstateDirectoryGoogleMapProps {
  sites: Site[];
  apiKey: string;
  selectedSiteId?: string | null;
  onSelectSite?: (site: Site) => void;
}

interface SiteMarkerData extends Site {
  resolvedLat: number;
  resolvedLng: number;
}

function buildMapStyle(): google.maps.MapTypeStyle[] {
  return [
    { elementType: 'geometry', stylers: [{ color: '#f5f5f3' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6d6d68' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#e8e8e5' }] },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#111111' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#111111' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e8e8e5' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#d4d4d0' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9b9b97' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4d4d0' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c0c0bc' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#dce8f0' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9b9b97' }] },
  ];
}

export function EstateDirectoryGoogleMap({
  sites,
  apiKey,
  selectedSiteId,
  onSelectSite,
}: EstateDirectoryGoogleMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [mapMode, setMapMode] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');

  // Unique cities list for filtering
  const cities = Array.from(new Set(sites.map((s) => s.city).filter(Boolean))) as string[];
  cities.sort((a, b) => a.localeCompare(b));

  // Resolve coordinates for each site
  const resolvedSites: SiteMarkerData[] = sites.map((s, i) => {
    const coords = resolveSiteCoordinates(s, i);
    return { ...s, resolvedLat: coords.lat, resolvedLng: coords.lng };
  });

  // Filter sites based on city & query
  const displayedSites = resolvedSites.filter((site) => {
    const matchesCity = selectedCity === 'ALL' || site.city?.toLowerCase() === selectedCity.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      site.name.toLowerCase().includes(q) ||
      site.city?.toLowerCase().includes(q) ||
      site.site_code?.toLowerCase().includes(q) ||
      site.postcode?.toLowerCase().includes(q);
    return matchesCity && matchesQuery;
  });

  // ── Script Loader ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const existing = document.getElementById('estate-gmaps-script');
    if (existing) {
      existing.addEventListener('load', () => setMapLoaded(true));
      existing.addEventListener('error', () => setMapError('Failed to load Google Maps SDK.'));
      return;
    }

    const script = document.createElement('script');
    script.id = 'estate-gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setMapError('Could not load Google Maps. Please check your API key.');
    document.head.appendChild(script);
  }, [apiKey]);

  // ── Map Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapDivRef.current || mapRef.current) return;
    try {
      mapRef.current = new window.google.maps.Map(mapDivRef.current, {
        center: UK_MAP_DEFAULT_CENTER,
        zoom: UK_MAP_DEFAULT_ZOOM,
        mapTypeId: mapMode,
        styles: buildMapStyle(),
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: 'cooperative',
        restriction: {
          latLngBounds: { north: 61.2, south: 49.5, east: 3.0, west: -11.0 },
          strictBounds: false,
        },
      });
    } catch {
      setMapError('Map initialisation failed.');
    }
  }, [mapLoaded, mapMode]);

  // ── Render Markers for All Sites ─────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    const currentActiveIds = new Set(displayedSites.map((s) => s.id));

    // Remove markers that are no longer in displayedSites
    markersRef.current.forEach((marker, id) => {
      if (!currentActiveIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    displayedSites.forEach((site) => {
      const isSelected = site.id === (selectedSiteId || activeSite?.id);
      const position = { lat: site.resolvedLat, lng: site.resolvedLng };

      if (markersRef.current.has(site.id)) {
        const marker = markersRef.current.get(site.id)!;
        marker.setPosition(position);
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 9.5 : 6,
          fillColor: isSelected ? '#EA580C' : '#111111',
          fillOpacity: 0.9,
          strokeColor: isSelected ? '#FFFFFF' : '#FFFFFF',
          strokeWeight: 2,
        });
        marker.setZIndex(isSelected ? 200 : 10);
      } else {
        const marker = new window.google.maps.Marker({
          map,
          position,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: isSelected ? 9.5 : 6,
            fillColor: isSelected ? '#EA580C' : '#111111',
            fillOpacity: 0.9,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
          title: `${site.name} (${site.site_code})`,
          zIndex: isSelected ? 200 : 10,
          optimized: false,
        });

        marker.addListener('click', () => {
          setActiveSite(site);
          onSelectSite?.(site);
          map.panTo(position);
          if ((map.getZoom() ?? 0) < 11) map.setZoom(11);
        });

        marker.addListener('mouseover', () => {
          if (site.id !== (selectedSiteId || activeSite?.id)) {
            marker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#EA580C',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            });
          }
        });

        marker.addListener('mouseout', () => {
          if (site.id !== (selectedSiteId || activeSite?.id)) {
            marker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#111111',
              fillOpacity: 0.9,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            });
          }
        });

        markersRef.current.set(site.id, marker);
      }
    });
  }, [displayedSites, selectedSiteId, activeSite?.id, mapLoaded, onSelectSite]);

  // ── Auto Fit Bounds ──────────────────────────────────────────────────────────
  const fitAll = useCallback(() => {
    if (!mapRef.current || !mapLoaded || displayedSites.length === 0) return;
    const map = mapRef.current;
    if (displayedSites.length === 1) {
      map.setCenter({ lat: displayedSites[0].resolvedLat, lng: displayedSites[0].resolvedLng });
      map.setZoom(12);
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      displayedSites.forEach((s) => bounds.extend({ lat: s.resolvedLat, lng: s.resolvedLng }));
      map.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
    }
  }, [displayedSites, mapLoaded]);

  useEffect(() => {
    fitAll();
  }, [selectedCity, mapLoaded]);

  // Map type switch
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setMapTypeId(mapMode);
    mapRef.current.setOptions({ styles: mapMode === 'roadmap' ? buildMapStyle() : [] });
  }, [mapMode]);

  // Handle Fullscreen Esc key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  // Trigger map resize on fullscreen toggle
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const t = setTimeout(() => {
      if (mapRef.current) {
        window.google.maps.event.trigger(mapRef.current, 'resize');
        fitAll();
      }
    }, 120);
    return () => clearTimeout(t);
  }, [isFullscreen, mapLoaded, fitAll]);

  if (mapError) {
    return (
      <div className="rounded-[10px] border border-[#E8E8E5] bg-[#FAFAF8] p-12 text-center">
        <MapPin className="h-8 w-8 text-[#9B9B97] mx-auto mb-2" />
        <p className="text-[13px] text-[#6D6D68]">{mapError}</p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[10px] border border-[#E8E8E5] bg-white overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none flex flex-col h-screen w-screen'
          : 'relative shadow-xs'
      }`}
    >
      {/* Map Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8E8E5] bg-[#FAFAF8] px-4 py-3 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#111111] text-white">
            <MapPin className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-medium text-[#111111]">
                UK Estate Geographic Distribution
              </h3>
              <span className="rounded-full bg-[#111111] px-2 py-0.5 text-[10px] font-medium text-white">
                {displayedSites.length} of {sites.length} pins
              </span>
            </div>
            <p className="text-[11px] text-[#6D6D68]">
              Interactive geospatial directory covering all managed facilities across Great Britain
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-7 px-2 rounded-[4px] border border-[#E8E8E5] bg-white text-[11px] text-[#111111] focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">All UK Regions ({cities.length} cities)</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city} ({sites.filter((s) => s.city === city).length})
              </option>
            ))}
          </select>

          {/* Quick Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-2 h-3 w-3 text-[#9B9B97] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pins…"
              className="h-7 pl-6 pr-2.5 rounded-[4px] border border-[#E8E8E5] bg-white text-[11px] text-[#111111] placeholder-[#9B9B97] focus:outline-none focus:border-[#EA580C] w-32 sm:w-40"
            />
          </div>

          {/* Map / Satellite toggle */}
          <div className="flex items-center rounded-[4px] border border-[#E8E8E5] bg-white p-0.5">
            <button
              onClick={() => setMapMode('roadmap')}
              className={`rounded-[3px] px-2 py-1 text-[10.5px] transition-colors ${
                mapMode === 'roadmap' ? 'bg-[#111111] text-white' : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapMode('hybrid')}
              className={`rounded-[3px] px-2 py-1 text-[10.5px] transition-colors ${
                mapMode === 'hybrid' ? 'bg-[#111111] text-white' : 'text-[#6D6D68] hover:text-[#111111]'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Fit Bounds */}
          <button
            onClick={fitAll}
            className="flex items-center gap-1 rounded-[4px] border border-[#E8E8E5] bg-white hover:bg-[#F5F5F3] px-2 py-1 text-[11px] text-[#6D6D68] hover:text-[#111111] transition-colors"
            title="Fit all sites in view"
          >
            <Navigation className="h-3 w-3" />
            <span>Fit All</span>
          </button>

          {/* Full Screen */}
          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className={`flex items-center gap-1 rounded-[4px] border px-2 py-1 text-[11px] transition-colors ${
              isFullscreen
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white text-[#6D6D68] border-[#E8E8E5] hover:text-[#111111]'
            }`}
            title={isFullscreen ? 'Exit full screen (Esc)' : 'Expand map to full screen'}
          >
            {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            <span>{isFullscreen ? 'Exit' : 'Full Screen'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas & Interactive Popover */}
      <div className={`relative ${isFullscreen ? 'flex-1 h-full' : 'h-[440px] md:h-[480px]'} w-full`}>
        <div ref={mapDivRef} className="absolute inset-0 bg-[#F5F5F3]" />

        {/* Loading overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAF8] gap-3 z-10">
            <div className="h-6 w-6 rounded-full border-2 border-[#E8E8E5] border-t-[#EA580C] animate-spin" />
            <span className="text-[12px] text-[#6D6D68]">Loading UK Estate Map ({sites.length} pins)…</span>
          </div>
        )}

        {/* Clicked Site Pop-up Card */}
        {activeSite && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white rounded-[8px] border border-[#E8E8E5] shadow-xl p-4 z-20 animate-in slide-in-from-bottom-2 duration-150 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="rounded-[3px] bg-[#111111] px-1.5 py-0.5 text-[9.5px] font-normal uppercase text-white tracking-wider">
                    {activeSite.site_code}
                  </span>
                  <span className="text-[10px] text-[#6D6D68] uppercase">
                    {activeSite.site_type?.replace(/_/g, ' ') || 'COMMERCIAL FACILITY'}
                  </span>
                </div>
                <h4 className="text-[13.5px] font-medium text-[#111111] leading-snug line-clamp-2">
                  {activeSite.name}
                </h4>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-[#6D6D68]">
                  <MapPin className="h-3 w-3 text-[#9B9B97] flex-shrink-0" />
                  <span className="truncate">
                    {activeSite.address_line1 ? `${activeSite.address_line1}, ` : ''}
                    {activeSite.city}, {activeSite.postcode}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveSite(null)}
                className="p-1 rounded-[4px] text-[#9B9B97] hover:text-[#111111] hover:bg-[#F0F0EE] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-[#E8E8E5] text-[11px]">
              <span className="inline-flex items-center gap-1 text-[#16A34A] font-medium">
                <CheckCircle2 className="h-3 w-3" />
                Active Managed Property
              </span>
              <Link
                href={`/admin/estate/sites/${activeSite.id}`}
                className="inline-flex items-center gap-1 rounded-[4px] bg-[#EA580C] hover:bg-[#C2410C] text-white px-2.5 py-1 text-[11px] font-normal transition-colors"
              >
                <span>Launch Site 360</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Strip */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#E8E8E5] bg-[#FAFAF8] text-[11px] text-[#6D6D68]">
        <div className="flex items-center gap-3">
          <span>
            Pin indicator: <strong className="font-medium text-[#111111]">● Black circle</strong> = Registered facility pin
          </span>
          <span className="hidden sm:inline text-[#D0D0CD]">·</span>
          <span className="hidden sm:inline">
            <strong className="font-medium text-[#EA580C]">● Orange circle</strong> = Selected facility
          </span>
        </div>
        <div>
          Click any pin on the map to inspect property details and launch Site 360.
        </div>
      </div>
    </div>
  );
}
