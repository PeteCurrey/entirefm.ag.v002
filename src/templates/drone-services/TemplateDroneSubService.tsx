'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { ServiceConversionSection } from '@/components/services/ServiceConversionSection';
import { FAQAccordion } from '@/components/content/CapabilityList';
import { DroneSampleOutputs } from '@/components/drone-services/DroneSampleOutputs';
import { 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  FileText, 
  Layers, 
  Search, 
  Building2, 
  Database,
  ArrowUpRight
} from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

interface TemplateDroneSubServiceProps {
  route: RouteRecord;
  content: ContentRecord;
}

// Subservice-specific data enrichment map for rich editorial layouts
const SUBSERVICE_ENRICHMENT: Record<string, {
  applications: Array<{ title: string; desc: string; icon?: string }>;
  defectsWeFind: Array<{ defect: string; indicator: string; severity: 'Routine' | 'Urgent' | 'Critical' }>;
  deliverables: Array<{ title: string; format: string; desc: string }>;
  remediationBridge: {
    heading: string;
    desc: string;
    capabilities: string[];
  };
}> = {
  '/services/drone-services/drone-inspections': {
    applications: [
      { title: 'Commercial Office Towers', desc: 'Inaccessible spires, high-level plant decks, and architectural fin structures inspected safely.' },
      { title: 'Industrial Chimneys & Flues', desc: 'High-temperature exhausts, guy wires, and masonry stacks surveyed without scaffolding.' },
      { title: 'Logistics Roofscapes', desc: 'Rapid 100,000+ sq ft roof condition surveys before tenant lease renewals or dilapidations.' },
      { title: 'Structural Towers & Masts', desc: 'Communications infrastructure, floodlight pylons, and high-voltage substation gantries.' },
    ],
    defectsWeFind: [
      { defect: 'Structural Steelwork Corrosion', indicator: 'Paint delamination, surface rust, and compromised bolt torque tags', severity: 'Urgent' },
      { defect: 'High-Level Masonry Spalling', indicator: 'Fractured coping stones, loose mortar, and falling debris hazards', severity: 'Critical' },
      { defect: 'Roof Plant Vibration Fatigue', indicator: 'Cracked anti-vibration mountings and damaged flexible duct joints', severity: 'Routine' },
    ],
    deliverables: [
      { title: 'High-Resolution Visual Log', format: '48MP/8K RAW & JPEG', desc: 'Georeferenced optical stills with full zoom detail for structural review.' },
      { title: 'Annotated Defect Schedule', format: 'Executive PDF Report', desc: 'Classified RAG defect inventory with coordinates, floor levels, and repair timelines.' },
      { title: 'CAFM Remedial Scope', format: 'EntireCAFM Direct Import', desc: 'Structured maintenance actions ready for physical contractor dispatch.' },
    ],
    remediationBridge: {
      heading: 'From Aerial Detection to Physical Repair',
      desc: 'When a drone inspection flags a loose component, failed seal, or structural hazard, EntireFM coordinates the physical repair. We deploy IRATA-certified rope access technicians, BMU cradles, or mechanical engineers to rectify the issue, verifying completion in EntireCAFM.',
      capabilities: ['IRATA Rope Access Repairs', 'High-Level Mastic Resealing', 'Roof Plant Maintenance', 'Structural Steel Remediation'],
    },
  },

  '/services/drone-services/roof-inspections': {
    applications: [
      { title: 'Commercial Flat Roofs', desc: 'Single-ply, bituminous felt, mastic asphalt, and liquid-applied membrane condition surveys.' },
      { title: 'High-Capacity Box Gutters', desc: 'Inspecting internal valleys, parapet gutters, and downpipe sumps for silt, rust, and blockages.' },
      { title: 'Fragile Industrial Roofs', desc: 'Asbestos-cement and profile metal sheet audits conducted without walking fragile roofs.' },
      { title: 'Post-Storm Leak Tracing', desc: 'Rapid emergency surveys locating water ingress pathways following heavy rainfall.' },
    ],
    defectsWeFind: [
      { defect: 'Membrane Lap Seam Failure', indicator: 'Delamination, fish-mouthing, and capillary water draw beneath seams', severity: 'Critical' },
      { defect: 'Valley Gutter Siltation & Vegetation', indicator: 'Standing water surcharge, weed growth, and corrosion around outlets', severity: 'Urgent' },
      { defect: 'Compromised Penetration Flashings', indicator: 'Split lead boots around HVAC conduits and perished rooflight seals', severity: 'Urgent' },
    ],
    deliverables: [
      { title: 'Full Roof Orthomosaic Map', format: 'High-Res GeoTIFF / PDF', desc: 'Complete high-resolution top-down stitched view of the entire roof deck.' },
      { title: 'Drainage & Gutter Register', format: 'Categorised Photo Matrix', desc: 'Itemised condition appraisal of every outlet, downpipe, and valley.' },
      { title: 'Roofing Repair Proposal', format: 'Priced Remedial Schedule', desc: 'Itemised quote from EntireFM roofing specialists with post-work warranty.' },
    ],
    remediationBridge: {
      heading: 'Complete Self-Delivered Roofing Remediation',
      desc: 'EntireFM operates full in-house commercial roofing and drainage capabilities. If our drone discovers blocked box gutters, split lead flashings, or membrane punctures, our mobile roofing teams can be dispatched immediately to clean, patch, and re-waterproof the building.',
      capabilities: ['Commercial Gutter Clearance', 'Single-Ply Membrane Patching', 'Lead Flashing Dressing', 'Downpipe Sump Relining'],
    },
  },

  '/services/drone-services/building-envelope-inspections': {
    applications: [
      { title: 'Multi-Storey Glazed Facades', desc: 'Curtain walling pressure plates, capping strips, and EPDM gasket condition audits.' },
      { title: 'Rain-Screen Cladding Panels', desc: 'Verifying panel alignment, rail fixings, and wind-load deflection across multi-storey towers.' },
      { title: 'Masonry & Precast Concrete', desc: 'Detecting spalling, efflorescence, mortar loss, and thermal movement cracks.' },
      { title: 'High-Rise Balconies & Soffits', desc: 'Inspecting architectural louvres, soffit panels, and underside drainage outlets.' },
    ],
    defectsWeFind: [
      { defect: 'Perished Mastic Expansion Joints', indicator: 'Adhesive failure, embrittlement, and silicone split along vertical joints', severity: 'Critical' },
      { defect: 'Loose Cladding Trims & Louvres', indicator: 'Vibration displacement and missing rivet fixings at high elevation', severity: 'Urgent' },
      { defect: 'Curtain Wall Gasket Shrinkage', indicator: 'Perished rubber seals and moisture leakage around spandrel panels', severity: 'Urgent' },
    ],
    deliverables: [
      { title: 'Zoned Elevation Defect Map', format: 'CAD Elevation Overlay (DXF/PDF)', desc: 'Every defect indexed by elevation (N/S/E/W), bay coordinate, and floor level.' },
      { title: 'High-Definition Facade Stills', format: 'Zoom Inspection Suite', desc: 'Millimetre-scale optical crops documenting panel fixings and joint seals.' },
      { title: 'Access & Remediation Strategy', format: 'Methodology Brief', desc: 'Specifying exact rope access drops or cradle operations for remedial works.' },
    ],
    remediationBridge: {
      heading: 'Integrated Rope Access & BMU Façade Delivery',
      desc: 'Rather than hiring external scaffolders, EntireFM deploys IRATA-qualified rope access technicians and certified BMU operators directly to the defect coordinates identified in the drone survey, performing high-level mastic renewal, panel refixing, and glass replacement.',
      capabilities: ['Abseil Mastic Sealant Renewal', 'Cladding Panel Refastening', 'Glazing Gasket Replacement', 'Spalling Concrete Repair'],
    },
  },

  '/services/drone-services/thermal-imaging': {
    applications: [
      { title: 'Flat Roof Moisture Mapping', desc: 'Detecting saturated insulation cores beneath waterproofing membranes without destructive coring.' },
      { title: 'Building Heat Loss Audits', desc: 'Identifying thermal bridging, insulation voids, and air leaks across curtain walling.' },
      { title: 'Commercial HVAC Thermography', desc: 'Thermal inspection of steam lines, chilled water risers, and condenser banks.' },
      { title: 'Electrical Switchgear & Solar Arrays', desc: 'Identifying high-resistance connections, overloaded phases, and PV diode faults.' },
    ],
    defectsWeFind: [
      { defect: 'Sub-Membrane Moisture Entrapment', indicator: 'Warm thermal footprint retaining heat during evening cooldown transition', severity: 'Critical' },
      { defect: 'Façade Thermal Bridging', indicator: 'Missing cavity insulation slabs causing severe winter heat dissipation', severity: 'Urgent' },
      { defect: 'Overheated Electrical Terminal', indicator: 'Localised phase imbalance and abnormal high-temperature contact points', severity: 'Critical' },
    ],
    deliverables: [
      { title: 'Radiometric Thermal Dataset', format: 'FLIR Radiometric Data (.rjpg)', desc: 'Temperature-calibrated pixel datasets enabling post-flight Delta-T analysis.' },
      { title: 'Thermal Anomaly Defect Report', format: 'Thermographic Survey PDF', desc: 'Side-by-side visual and thermal comparisons with temperature profile curves.' },
      { title: 'Core Verification & Repair Scope', format: 'Priced Engineering Plan', desc: 'Targeted core sample recommendations and localized insulation replacement scopes.' },
    ],
    remediationBridge: {
      heading: 'Bridging Thermal Diagnostics to Energy & Fabric Works',
      desc: 'A thermal survey identifies where your building is losing heat or harboring trapped water. EntireFM’s mechanical, electrical, and fabric maintenance teams take those findings and execute the required remediation—from stripping wet roof cores to balancing HVAC distribution.',
      capabilities: ['Targeted Wet Insulation Replacement', 'Thermal Cavity Insulation Remedials', 'M&E Thermal Balancing', 'Switchgear Resistance Repair'],
    },
  },

  '/services/drone-services/solar-pv-inspections': {
    applications: [
      { title: 'Commercial Rooftop PV Arrays', desc: 'High-speed thermographic scanning of rooftop solar systems across logistics and retail parks.' },
      { title: 'Ground-Mount Solar Farms', desc: 'Utility-scale string and module inspection covering thousands of panels per day.' },
      { title: 'Pre-Acquisition PV Audits', desc: 'Verifying solar asset condition and actual generation yields before property purchase.' },
      { title: 'Annual Warranty & O&M Compliance', desc: 'Fulfilling IEC 62446-3 statutory maintenance requirements for renewable warranties.' },
    ],
    defectsWeFind: [
      { defect: 'Defective Bypass Diode (Sub-String)', indicator: 'One-third or two-thirds of panel overheated due to open-circuit diode', severity: 'Critical' },
      { defect: 'Localised Cell Hotspot', indicator: 'High-temperature semiconductor short circuit presenting severe fire risk', severity: 'Critical' },
      { defect: 'Shattered Glass & Hail Impact', indicator: 'Optical microcracks and delamination reducing string output', severity: 'Urgent' },
    ],
    deliverables: [
      { title: 'IEC 62446-3 Thermographic Audit', format: 'Certified Solar PV Report', desc: 'Itemised panel defect catalogue with string IDs and radiometric delta metrics.' },
      { title: 'Generation Yield Impact Estimate', format: 'kWh Loss Analysis', desc: 'Calculating financial yield recovery achieved by rectifying identified faults.' },
      { title: 'Electrical Remedial Action Plan', format: 'NICEIC Engineering Scope', desc: 'Direct scope for EntireFM commercial electricians to isolate and replace modules.' },
    ],
    remediationBridge: {
      heading: 'Commercial Electrical & PV System Rectification',
      desc: 'Defective solar panels degrade overall string output and present dangerous thermal runaway risks. EntireFM’s commercial electrical engineering division safely isolates arrays, replaces defective bypass diodes and damaged modules, and cleans soiled panels to restore maximum yield.',
      capabilities: ['NICEIC Solar PV Electrical Repairs', 'Bypass Diode & Module Replacement', 'Array De-energisation & Isolation', 'Commercial Solar Panel Cleaning'],
    },
  },

  '/services/drone-services/surveying-mapping': {
    applications: [
      { title: 'Estate Masterplanning & As-Builts', desc: 'Millimetre-accurate topographic baselines for estate extensions and boundary validation.' },
      { title: 'Civil Drainage & Slope Profiling', desc: 'Digital elevation models identifying terrain runoff slopes and flood catchment areas.' },
      { title: 'Construction Site Layouts', desc: 'Pre-construction topographic surveys calibrated with RTK positioning for CAD drafting.' },
      { title: 'Infrastructure Asset Mapping', desc: 'Spatial recording of private access roads, parking bays, lighting columns, and substations.' },
    ],
    defectsWeFind: [
      { defect: 'Boundary Encroachment Anomaly', indicator: 'Discrepancy between Land Registry vector plans and physical fencing', severity: 'Routine' },
      { defect: 'Drainage Slope Ponding Hazard', indicator: 'Adverse ground fall directing stormwater runoff towards building foundations', severity: 'Urgent' },
      { defect: 'Road Surface & Pavement Degradation', indicator: 'Georeferenced pothole mapping and kerb misalignment across estate yards', severity: 'Routine' },
    ],
    deliverables: [
      { title: '2D Georeferenced Orthomosaic', format: 'GeoTIFF / ECW (Sub-cm GSD)', desc: 'High-resolution composite orthophoto aligned with British National Grid (OSGB36).' },
      { title: 'Digital Elevation Model (DEM/DTM)', format: 'Elevation Raster & Contours', desc: 'Topographic ground height models with 0.25m / 0.5m contour layers in DXF/DWG.' },
      { title: 'CAD / GIS Vector Integration', format: 'AutoCAD DXF / Shapefile (SHP)', desc: 'Geospatial layers ready for civil engineering, architectural, and CAFM ingestion.' },
    ],
    remediationBridge: {
      heading: 'From Geospatial Data to Civil & Ground Maintenance',
      desc: 'Surveying data is only as valuable as the estate decisions it enables. EntireFM combines aerial mapping with civil maintenance, estate grounds care, and drainage engineering to rectify surface defects, resolve boundary issues, and maintain civil infrastructure.',
      capabilities: ['Civil Drainage Remediation', 'Commercial Pothole & Road Repair', 'Estate Boundary Maintenance', 'CAFM Spatial Asset Tagging'],
    },
  },

  '/services/drone-services/construction-monitoring': {
    applications: [
      { title: 'Milestone Progress Verification', desc: 'Weekly/monthly aerial records verifying groundworks, steel framing, and cladding milestones.' },
      { title: 'Subcontractor Delivery Proof', desc: 'Timestamped photographic proof documenting work completion before invoice signoff.' },
      { title: 'Investor & Stakeholder Updates', desc: 'High-resolution time-lapse photography and 4K video reels for development board meetings.' },
      { title: 'Dispute & Delay Claim Protection', desc: 'Indisputable visual history protecting main contractors and developers against delay claims.' },
    ],
    defectsWeFind: [
      { defect: 'Milestone Schedule Variance', indicator: 'Lag between planned BIM timeline and actual on-site structural erection', severity: 'Urgent' },
      { defect: 'Site Logistics & Storage Congestion', indicator: 'Material stockpile encroachment blocking emergency fire tender access', severity: 'Urgent' },
      { defect: 'Perimeter Hoarding Compromise', indicator: 'Boundary breaches, fallen wind mesh, and unsecured site access gates', severity: 'Critical' },
    ],
    deliverables: [
      { title: 'Monthly Progress Report Pack', format: 'Executive Summary PDF', desc: 'Side-by-side milestone comparison from identical GPS-locked waypoints.' },
      { title: 'Site Orthomosaic Overlay', format: 'Cloud Web Viewer Link', desc: 'Interactive map comparing current build phase against architectural masterplans.' },
      { title: '4K Milestone Time-Lapse Media', format: 'High-Definition Video Reel', desc: 'Curated video assets tracking chronological progress for marketing and investors.' },
    ],
    remediationBridge: {
      heading: 'Integrated with EntireFM Projects & Facilities Handover',
      desc: 'Our construction monitoring services transition seamlessly into EntireFM Projects and facilities mobilisation. As construction completes, our FM team receives the complete digital visual record to populate the asset register and begin ongoing planned maintenance.',
      capabilities: ['Post-Construction FM Mobilisation', 'Asset Register Population', 'Initial PPM Matrix Creation', 'Snagging Defect Rectification'],
    },
  },

  '/services/drone-services/emergency-insurance-surveys': {
    applications: [
      { title: 'Post-Storm Roof Damage Audits', desc: 'Immediate aerial inspection of dislodged sheets, shattered skylights, and collapsed gutters.' },
      { title: 'Fire & Structural Incident Review', desc: 'Safe visual access into structurally compromised buildings where internal entry is prohibited.' },
      { title: 'High-Level Impact Damage', desc: 'Assessing crane strikes, vehicle impacts, or fallen tree damage on roofs and parapets.' },
      { title: 'Insurance Claim Loss Adjustment', desc: 'Providing indisputable georeferenced photographic evidence packs for loss adjusters.' },
    ],
    defectsWeFind: [
      { defect: 'Active Roof Ingress & Missing Panels', indicator: 'Blown-off cladding sheets and torn waterproof membrane exposing timber deck', severity: 'Critical' },
      { defect: 'Unstable Parapet / Coping Stone', indicator: 'Displaced high-level masonry with imminent fall-from-height risk', severity: 'Critical' },
      { defect: 'Collapsed Rainwater Valley Gutter', indicator: 'Structural sag under debris load threatening internal building deluge', severity: 'Critical' },
    ],
    deliverables: [
      { title: 'Emergency Damage Appraisal', format: 'Rapid Turnaround PDF', desc: 'Same-day visual summary categorising life-safety risks and weatherproofing breaches.' },
      { title: 'Loss Adjuster Evidence Bundle', format: 'Geotagged High-Res Stills', desc: 'Metadata-verified photographs formatted specifically for commercial insurers.' },
      { title: 'Emergency Make-Safe Quotation', format: 'Immediate Fixed Scope', desc: 'Priced proposal for temporary boarding, tarpaulins, and permanent repair works.' },
    ],
    remediationBridge: {
      heading: 'Immediate 24/7 Make-Safe & Permanent Remediation',
      desc: 'Following an incident, EntireFM does not leave you with just damage photographs. Our 24/7 helpdesk dispatches trade teams to execute emergency make-safe works (securing loose cladding, installing temporary weatherproofing, clearing debris), followed by full permanent structural repair.',
      capabilities: ['24/7 Emergency Make-Safe Works', 'Temporary Roof Tarpaulin Securing', 'Loose Cladding & Masonry Removal', 'Permanent Structural Reinstatement'],
    },
  },

  '/services/drone-services/digital-twin-3d-capture': {
    applications: [
      { title: 'Remote Asset Inspection', desc: 'Facilities directors inspecting high-rise roofs, facades, and plant decks from their desktop.' },
      { title: 'BIM Authoring & As-Built Verification', desc: 'Generating dense point clouds for Revit modeling, clash detection, and fit-out design.' },
      { title: 'Space Planning & Refurbishment', desc: 'Accurate 3D dimensions of plant rooms, courtyards, and external service yards.' },
      { title: 'Landlord Dilapidations Baseline', desc: 'Creating an immutable 3D visual baseline at the start and end of commercial leases.' },
    ],
    defectsWeFind: [
      { defect: 'Structural Envelope Distortion', indicator: 'Geometric deviation from original CAD drawings exceeding tolerance limits', severity: 'Urgent' },
      { defect: 'Rooftop Plant Clash Hazard', indicator: 'Insufficient spatial clearance for new condenser banks or crane lifting paths', severity: 'Routine' },
      { defect: 'Parapet Height Compliance Variance', indicator: 'Edge protection dimensions falling below statutory HSE safety thresholds', severity: 'Critical' },
    ],
    deliverables: [
      { title: '3D Photogrammetric Reality Mesh', format: 'OBJ, FBX & Web Viewer', desc: 'High-detail textured 3D model navigable in standard web browsers with measurement tools.' },
      { title: 'Dense Georeferenced Point Cloud', format: 'LAS, LAZ, RCP & E57', desc: 'Millions of spatial points ready for direct import into Autodesk Revit and Navisworks.' },
      { title: 'Virtual Measurement Report', format: 'Area & Volume CAD Sheet', desc: 'Verified deck square meterage, wall heights, and roof slope angles.' },
    ],
    remediationBridge: {
      heading: 'Integrated Spatial Asset Intelligence',
      desc: 'Digital twins link directly into EntireFM’s planned maintenance and project management delivery. By maintaining an accurate 3D model in EntireCAFM, our engineers plan plant replacements, lift operations, and rope access rigging with complete spatial certainty.',
      capabilities: ['BIM-Ready As-Built Drafting', 'Virtual Tender Package Creation', 'Plant Replacement Spatial Planning', 'EntireCAFM 3D Asset Tagging'],
    },
  },

  '/services/drone-services/volumetric-surveys': {
    applications: [
      { title: 'Aggregate & Material Stockpiles', desc: 'Measuring cubic metre volumes of sand, gravel, stone, scrap metal, and biomass.' },
      { title: 'Earthworks Cut / Fill Balances', desc: 'Comparing baseline topography against design levels to quantify net soil movement.' },
      { title: 'Quarry & Mining Extraction Audits', desc: 'Tracking monthly extraction rates, remaining void space, and pit face stability.' },
      { title: 'Financial Year-End Inventory Audits', desc: 'Certified bulk material inventory valuations for corporate accounting and tax compliance.' },
    ],
    defectsWeFind: [
      { defect: 'Stockpile Inventory Discrepancy', indicator: 'Variance between book inventory ledger and actual physical aerial volume', severity: 'Urgent' },
      { defect: 'Stockpile Slope Instability', indicator: 'Excessive repose angle exceeding safe geotechnical stacking limits', severity: 'Critical' },
      { defect: 'Earthworks Cut Surcharge Variance', indicator: 'Over-excavation requiring costly additional structural fill import', severity: 'Urgent' },
    ],
    deliverables: [
      { title: 'Stockpile Volume & Tonnage Audit', format: 'Certified PDF Certificate', desc: 'Exact cubic metres (m³) and computed tonnage based on verified bulk density.' },
      { title: 'Cut / Fill Elevation Differential Map', format: 'Color-Coded Depth Raster', desc: 'Visual heatmap showing exact excavation cut depth and fill build-up zones.' },
      { title: '3D Digital Surface Model (DSM)', format: 'LandXML & DXF Contours', desc: 'Continuous triangular mesh export ready for civil engineering earthwork software.' },
    ],
    remediationBridge: {
      heading: 'Accurate Material Logistics & Civil Management',
      desc: 'Volumetric survey findings integrate with EntireFM civil and industrial facilities management, assisting clients in balancing earthwork movements, managing waste disposal compliance, and maintaining material inventory control.',
      capabilities: ['Civil Earthworks Verification', 'Bulk Material Logistics Planning', 'Waste Duty of Care Compliance', 'Financial Stock Audit Signoff'],
    },
  },

  '/services/drone-services/aerial-photography-video': {
    applications: [
      { title: 'Commercial Property Marketing', desc: 'High-impact 4K/6K aerial visuals showcasing office towers, business parks, and logistics hubs.' },
      { title: 'Completed Project Showcases', desc: 'Documenting major FM refurbishments, M&E plant installations, and solar retrofits.' },
      { title: 'Investor & Annual ESG Reporting', desc: 'Stunning visual assets for corporate annual reports, ESG presentations, and websites.' },
      { title: 'Estate Context & Transport Links', desc: 'Elevated views highlighting proximity to motorways, ports, railways, and urban centres.' },
    ],
    defectsWeFind: [
      { defect: 'Estate Visual Presentation Snags', indicator: 'Overgrown boundary vegetation, stained cladding, or damaged external signage', severity: 'Routine' },
      { defect: 'Car Park Line-Marking Wear', indicator: 'Faded directional markings and degraded pedestrian walkways in retail parks', severity: 'Routine' },
      { defect: 'External Lighting Inoperative Zones', indicator: 'Night-time aerial survey isolating non-illuminated customer parking bays', severity: 'Urgent' },
    ],
    deliverables: [
      { title: 'High-Resolution RAW Stills Suite', format: '48MP/100MP RAW & JPEG', desc: 'Professionally retouched golden-hour and blue-hour photography for web and print.' },
      { title: '4K/6K Stabilised Cinematic Video', format: 'ProRes & MP4 (Color-Graded)', desc: 'Smooth aerial tracking shots with optional motion graphic callouts and corporate titles.' },
      { title: 'Web & Social Media Cutdowns', format: 'Formatted 16:9 & 9:16 Video', desc: 'Short promotional video clips optimized for LinkedIn, websites, and tender bids.' },
    ],
    remediationBridge: {
      heading: 'Connected to EntireFM Estate Care & Upgrades',
      desc: 'While capturing promotional media, our pilots often identify external presentation defects—such as overgrown landscaping, stained cladding, or damaged signage. EntireFM can immediately coordinate grounds maintenance and specialist cleaning to ensure your estate presents at its absolute best.',
      capabilities: ['Commercial External Cladding Cleaning', 'Estate Grounds & Landscaping Care', 'High-Level Signage Maintenance', 'Car Park Relining & Lighting'],
    },
  },
};

export function TemplateDroneSubService({ route, content }: TemplateDroneSubServiceProps) {
  const path = route.path;
  const enrichment = SUBSERVICE_ENRICHMENT[path] || SUBSERVICE_ENRICHMENT['/services/drone-services/drone-inspections'];

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Drone Services', url: '/services/drone-services' },
    { name: content.h1, url: route.path },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC SUB-SERVICE HERO */}
        {/* ========================================================================= */}
        <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center bg-[#0B1220] overflow-hidden pt-28 pb-16">
          <div className="absolute inset-0 z-0">
            <Image
              src={content.heroImage || '/images/editorial/entirefm-sheffield-rooftop-survey-2560w.webp'}
              alt={content.title}
              fill
              priority
              className="object-cover object-center opacity-55 scale-105 transition-transform duration-1000 ease-out"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/75 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0B1220]/90 to-transparent" />
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-3xl space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/90 font-semibold">
                  {content.eyebrow || 'ENTIREFM DRONE SERVICES'}
                </span>
              </div>

              {/* H1 Headline */}
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-[1.1]">
                {content.h1}
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl">
                {content.heroIntro}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/tools/drone-inspection-planner"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-pink via-brand-pink-mid to-brand-magenta px-7 py-3.5 text-sm font-semibold text-white shadow-elevated hover:shadow-pink-500/25 transition-all hover:scale-[1.02]"
                >
                  <span>Plan an Inspection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services/drone-services"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-medium text-white hover:bg-white/20 transition-all"
                >
                  <span>All Drone Services</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  UK CAA Operational Framework
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Site-Specific RAMS
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Direct Trade Remediation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  EntireCAFM Synchronised
                </span>
              </div>
            </div>
          </div>
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. WHAT WE INSPECT / CAPTURE (CAPABILITIES MATRIX) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                  TECHNICAL SCOPE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                What We Inspect &amp; Capture
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {content.heroDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.capabilities?.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[12px] bg-[#FAF9FB] border border-slate-200 space-y-3 hover:border-brand-pink transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] uppercase font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-[4px] inline-block">
                      {cap.tag}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cap.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TYPICAL COMMERCIAL APPLICATIONS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                  COMMERCIAL SCENARIOS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Typical Facilities Management Applications
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Real-world operational use cases where aerial drone surveys deliver maximum safety and commercial efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {enrichment.applications.map((app, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[12px] bg-white border border-slate-200 shadow-sm space-y-3 hover:border-brand-pink transition-colors"
                >
                  <h3 className="text-base font-bold text-slate-900">
                    {app.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {app.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. WHAT WE LOOK FOR (DEFECT TAXONOMY) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                  DIAGNOSTIC CRITERIA
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                What We Look For
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Common structural defects, waterproofing failures, and performance anomalies isolated during survey analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enrichment.defectsWeFind.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[12px] bg-[#FAF9FB] border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-[4px] ${
                      item.severity === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : item.severity === 'Urgent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.severity} Priority
                    </span>
                    <AlertTriangle className="w-4 h-4 text-brand-pink" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.defect}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Visual Indicator:</strong> {item.indicator}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. INTERACTIVE TECHNICAL OUTPUT DEMONSTRATOR */}
        {/* ========================================================================= */}
        <DroneSampleOutputs />

        {/* ========================================================================= */}
        {/* 6. WHAT YOU RECEIVE (TECHNICAL DELIVERABLES) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                  SURVEY OUTPUTS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                What You Receive
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Structured, georeferenced survey deliverables formatted for property managers, structural engineers, and CAFM databases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enrichment.deliverables.map((del, idx) => (
                <div
                  key={idx}
                  className="p-7 rounded-[14px] bg-white border border-slate-200 shadow-sm space-y-3.5 hover:border-brand-pink transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <FileText className="w-6 h-6 text-brand-pink" />
                    <span className="font-mono text-[9.5px] uppercase font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-[4px]">
                      {del.format}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {del.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {del.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. WHAT HAPPENS IF WE FIND A PROBLEM? (THE REMEDIATION BRIDGE) */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#0B1220] text-white relative overflow-hidden border-b border-brand-edge-dark">
          <div className="container-custom relative z-10 space-y-12">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
                <Wrench className="h-3.5 w-3.5 text-brand-pink" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-white font-semibold">
                  END-TO-END REMEDIATION BRIDGE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
                What happens if we <br />
                <span className="font-bold text-hero-pink">find a problem?</span>
              </h2>

              <p className="text-base text-slate-300 leading-relaxed">
                {enrichment.remediationBridge.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {enrichment.remediationBridge.capabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-sm bg-brand-carbon border border-brand-edge-dark flex items-start gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-brand-pink shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-white">{cap}</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-sm bg-brand-graphite border border-brand-edge-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  <strong className="text-white">One Accountable Partner:</strong> We move seamlessly from inspection to investigation, quotation, specialist access, physical repair, and CAFM verification.
                </p>
              </div>

              <Link
                href="/contact-us#enquiry"
                className="btn-hero-pink text-xs px-5 py-2.5 whitespace-nowrap"
              >
                <span>Discuss Remedial Scoping</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. RELATED ENTIREFM SERVICES (INTELLIGENT TWO-WAY CROSS-LINKS) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="container-custom space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                INTEGRATED SERVICES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Related Facilities Management Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.relatedRoutes?.map((relPath) => (
                <Link
                  key={relPath}
                  href={relPath}
                  className="p-4 rounded-[10px] bg-[#FAF9FB] border border-slate-200 hover:border-brand-pink hover:bg-white transition-all group flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-brand-pink transition-colors">
                    {relPath.replace('/services/drone-services/', 'Drone: ').replace('/services/', '').replace(/\//g, ' ').replace(/-/g, ' ').toUpperCase()}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-pink transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. SUB-SERVICE SPECIFIC FAQS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FAF9FB] border-b border-slate-200">
          <div className="container-custom max-w-4xl space-y-10">
            <div className="text-center space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-pink">
                EXPERT QUESTIONS
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>

            <FAQAccordion faqs={content.faqs || []} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. CONVERSION SECTION */}
        {/* ========================================================================= */}
        <ServiceConversionSection
          serviceName={content.h1}
          headline={`Plan a ${content.h1}`}
          subheadline={`Provide your estate or property details below to receive a bespoke ${content.h1.toLowerCase()} survey proposal and flight feasibility review.`}
          badgeText={content.eyebrow || 'COMMERCIAL CONSULTATION'}
          ctaButtonText="Request Survey Scope & Quote"
          directDeskNote="Direct consultation with an aviation surveyor or regional engineering director."
        />
      </main>

      <Footer />
    </div>
  );
}
