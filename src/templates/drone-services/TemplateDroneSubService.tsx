'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TrustBar } from '@/components/trust/TrustBar';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { DroneServiceFaq } from '@/components/drone-services/DroneServiceFaq';
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
  ArrowUpRight,
  Plane
} from 'lucide-react';
import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';
import {
  ProofDroneInspections,
  ProofRoofInspections,
  ProofFacadeEnvelope,
  ProofThermalImaging,
  ProofSolarPv,
  ProofSurveyingMapping,
  ProofConstructionTimeline,
  ProofDigitalTwin3D,
  ProofVolumetricSurveys,
  ProofAerialPhotography,
  ProofEmergencyInsurance
} from '@/components/drone-services/subservices/SubServiceVisualProofs';

interface TemplateDroneSubServiceProps {
  route: RouteRecord;
  content: ContentRecord;
}

// Media & Hero Configuration per Sub-Service
interface ServiceMediaConfig {
  videoSrc?: string;
  heroPoster: string;
  heroBadge: string;
  ctaTitle: string;
  ctaButtonText: string;
  proofComponent: React.ComponentType;
  related: Array<{ title: string; href: string; category: string }>;
  remediation: {
    heading: string;
    description: string;
    tradeCapabilities: string[];
  };
  deliverables: Array<{ title: string; format: string; desc: string }>;
  applications: Array<{ title: string; desc: string }>;
  heroPosition?: string;
}

const SERVICE_CONFIGS: Record<string, ServiceMediaConfig> = {
  '/services/drone-services/drone-inspections': {
    videoSrc: '/video/drone/hero.mp4',
    heroPoster: '/images/drone/hero_poster.jpg',
    heroBadge: 'COMMERCIAL AERIAL INSPECTION',
    ctaTitle: 'Plan a Commercial Drone Building Inspection',
    ctaButtonText: 'Request Inspection Scope',
    proofComponent: ProofDroneInspections,
    related: [
      { title: 'Roof & Gutter Inspections', href: '/services/drone-services/roof-inspections', category: 'Waterproofing & Drainage' },
      { title: 'Façade & Building Envelope', href: '/services/drone-services/building-envelope-inspections', category: 'Vertical Fabric' },
      { title: 'Radiometric Thermal Surveys', href: '/services/drone-services/thermal-imaging', category: 'Energy & Moisture' },
    ],
    remediation: {
      heading: 'From Aerial Detection to Physical Engineering Repair',
      description: 'When an aerial survey identifies high-level fabric defects, loose cladding components, or waterproofing failures, EntireFM directly coordinates physical remediation. We deploy our own IRATA-certified rope access technicians, BMU cradle specialists, or mechanical fabric engineers to carry out repairs and certify completion within EntireCAFM.',
      tradeCapabilities: ['IRATA Rope Access Repairs', 'High-Level Mastic Resealing', 'Rooftop Plant Mechanical Maintenance', 'Structural Steel Remediation'],
    },
    deliverables: [
      { title: 'High-Resolution Visual Log', format: '48MP/8K RAW & JPEG', desc: 'Georeferenced optical stills with full zoom detail for structural review.' },
      { title: 'Annotated Defect Schedule', format: 'Surveyor Condition Report', desc: 'Classified defect inventory with coordinates, floor levels, and repair priorities.' },
      { title: 'CAFM Remedial Scope', format: 'EntireCAFM Direct Import', desc: 'Structured maintenance actions ready for physical contractor dispatch.' },
    ],
    applications: [
      { title: 'Commercial Office Towers', desc: 'Inaccessible spires, high-level plant decks, and architectural fin structures inspected safely.' },
      { title: 'Industrial Chimneys & Flues', desc: 'High-temperature exhausts, guy wires, and masonry stacks surveyed without scaffolding.' },
      { title: 'Logistics Roofscapes', desc: 'Rapid 100,000+ sq ft roof condition surveys before tenant lease renewals or dilapidations.' },
      { title: 'Structural Towers & Masts', desc: 'Communications infrastructure, floodlight pylons, and high-voltage substation gantries.' },
    ],
  },

  '/services/drone-services/roof-inspections': {
    videoSrc: '/video/drone/inspection.mp4',
    heroPoster: '/images/drone/inspection_poster.png',
    heroBadge: 'ROOF & GUTTER SURVEYS',
    ctaTitle: 'Plan a Commercial Roof Condition Survey',
    ctaButtonText: 'Request Roof Survey Quote',
    proofComponent: ProofRoofInspections,
    related: [
      { title: 'Radiometric Thermal Surveys', href: '/services/drone-services/thermal-imaging', category: 'Moisture Detection' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'General Envelope' },
      { title: 'Façade & Building Envelope', href: '/services/drone-services/building-envelope-inspections', category: 'Vertical Fabric' },
    ],
    remediation: {
      heading: 'Self-Delivered Commercial Roofing Remediation',
      description: 'EntireFM operates full in-house commercial roofing and drainage repair divisions. If our drone discovers blocked box gutters, split lead flashings, or membrane tears, our mobile roofing teams can be dispatched immediately to clean, patch, and re-waterproof the building.',
      tradeCapabilities: ['Commercial Gutter Vacuum Clearance', 'Single-Ply Membrane Heat-Welding', 'Lead Flashing Dressing Renewal', 'Downpipe Sump Relining'],
    },
    deliverables: [
      { title: 'Full Roof Orthomosaic Map', format: 'High-Res GeoTIFF / PDF', desc: 'Complete high-resolution top-down stitched view of the entire roof deck.' },
      { title: 'Drainage & Gutter Register', format: 'Categorised Photo Matrix', desc: 'Itemised condition appraisal of every outlet, downpipe, and valley.' },
      { title: 'Roofing Repair Proposal', format: 'Priced Remedial Schedule', desc: 'Itemised quote from EntireFM roofing specialists with post-work warranty.' },
    ],
    applications: [
      { title: 'Commercial Flat Roofs', desc: 'Single-ply, bituminous felt, mastic asphalt, and liquid-applied membrane condition surveys.' },
      { title: 'High-Capacity Box Gutters', desc: 'Inspecting internal valleys, parapet gutters, and downpipe sumps for silt, rust, and blockages.' },
      { title: 'Fragile Industrial Roofs', desc: 'Asbestos-cement and profile metal sheet audits conducted without walking fragile roofs.' },
      { title: 'Post-Storm Leak Tracing', desc: 'Rapid emergency surveys locating water ingress pathways following heavy rainfall.' },
    ],
  },

  '/services/drone-services/building-envelope-inspections': {
    heroPoster: '/images/editorial/building-safety-facade-inspection.jpg',
    heroBadge: 'VERTICAL FABRIC & FAÇADE',
    ctaTitle: 'Schedule a Multi-Storey Façade Inspection',
    ctaButtonText: 'Discuss Façade Scope',
    proofComponent: ProofFacadeEnvelope,
    related: [
      { title: 'Roof & Gutter Inspections', href: '/services/drone-services/roof-inspections', category: 'Waterproofing & Drainage' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'Asset Inspection' },
      { title: 'EntireFM 3D & Digital Twin Capture', href: '/services/drone-services/digital-twin-3d-capture', category: '3D Reality Mesh' },
    ],
    remediation: {
      heading: 'Integrated Rope Access & BMU Façade Delivery',
      description: 'Rather than hiring costly external scaffolding, EntireFM deploys IRATA-qualified rope access technicians and certified BMU cradle operators directly to the defect coordinates identified in the drone survey, performing high-level mastic renewal, panel refixing, and glass replacement.',
      tradeCapabilities: ['Abseil Mastic Sealant Renewal', 'Cladding Panel Refastening', 'Glazing Gasket Replacement', 'Spalling Concrete Repair'],
    },
    deliverables: [
      { title: 'Zoned Elevation Defect Map', format: 'CAD Elevation Overlay', desc: 'Every defect indexed by elevation (N/S/E/W), bay coordinate, and floor level.' },
      { title: 'High-Definition Facade Stills', format: 'Zoom Inspection Suite', desc: 'Millimetre-scale optical crops documenting panel fixings and joint seals.' },
      { title: 'Access & Remediation Strategy', format: 'Methodology Brief', desc: 'Specifying exact rope access drops or cradle operations for remedial works.' },
    ],
    applications: [
      { title: 'Multi-Storey Glazed Facades', desc: 'Curtain walling pressure plates, capping strips, and EPDM gasket condition audits.' },
      { title: 'Rain-Screen Cladding Panels', desc: 'Verifying panel alignment, rail fixings, and wind-load deflection across multi-storey towers.' },
      { title: 'Masonry & Precast Concrete', desc: 'Detecting spalling, efflorescence, mortar loss, and thermal movement cracks.' },
      { title: 'High-Rise Balconies & Soffits', desc: 'Inspecting architectural louvres, soffit panels, and underside drainage outlets.' },
    ],
  },

  '/services/drone-services/thermal-imaging': {
    videoSrc: '/video/drone/thermal.mp4',
    heroPoster: '/images/drone/thermal_poster.jpg',
    heroBadge: 'RADIOMETRIC INFRARED THERMOGRAPHY',
    ctaTitle: 'Commission a Radiometric Thermal Survey',
    ctaButtonText: 'Book Thermal Survey',
    proofComponent: ProofThermalImaging,
    related: [
      { title: 'Solar PV Farm & Rooftop Surveys', href: '/services/drone-services/solar-pv-inspections', category: 'Renewable Thermography' },
      { title: 'Roof & Gutter Inspections', href: '/services/drone-services/roof-inspections', category: 'Waterproofing & Drainage' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'Asset Inspection' },
    ],
    remediation: {
      heading: 'Bridging Thermal Diagnostics to Energy & Fabric Works',
      description: 'A thermal survey identifies where your building is losing heat or harbouring trapped moisture. EntireFM’s mechanical, electrical, and fabric maintenance teams take those findings and execute the required remediation—from stripping wet roof insulation cores to balancing HVAC distribution.',
      tradeCapabilities: ['Targeted Wet Insulation Replacement', 'Thermal Cavity Insulation Remedials', 'M&E Thermal Balancing', 'Switchgear Resistance Repair'],
    },
    deliverables: [
      { title: 'Radiometric Thermal Dataset', format: 'Radiometric Image Data', desc: 'Temperature-calibrated pixel datasets enabling post-flight thermal profile analysis.' },
      { title: 'Thermal Anomaly Defect Report', format: 'Thermographic Survey PDF', desc: 'Side-by-side visual and thermal comparisons highlighting insulation voids and heat loss.' },
      { title: 'Core Verification & Repair Scope', format: 'Priced Engineering Plan', desc: 'Targeted core sample recommendations and localized insulation replacement scopes.' },
    ],
    applications: [
      { title: 'Flat Roof Moisture Mapping', desc: 'Detecting saturated insulation cores beneath waterproofing membranes without destructive coring.' },
      { title: 'Building Heat Loss Audits', desc: 'Identifying thermal bridging, insulation voids, and air leaks across curtain walling.' },
      { title: 'Commercial HVAC Thermography', desc: 'Thermal inspection of steam lines, chilled water risers, and condenser banks.' },
      { title: 'Electrical Switchgear & Solar Arrays', desc: 'Identifying high-resistance connections, overloaded phases, and PV diode faults.' },
    ],
  },

  '/services/drone-services/solar-pv-inspections': {
    heroPoster: '/images/drone/nav/thermal.png',
    heroBadge: 'SOLAR PV & RENEWABLE AUDIT',
    ctaTitle: 'Commission a Commercial Solar PV Thermographic Survey',
    ctaButtonText: 'Request PV Audit Quote',
    proofComponent: ProofSolarPv,
    related: [
      { title: 'Radiometric Thermal Surveys', href: '/services/drone-services/thermal-imaging', category: 'Energy & Moisture' },
      { title: 'Roof & Gutter Inspections', href: '/services/drone-services/roof-inspections', category: 'Waterproofing & Drainage' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'Asset Inspection' },
    ],
    remediation: {
      heading: 'Commercial Electrical & PV System Rectification',
      description: 'Defective solar panels degrade overall string generation and present dangerous thermal runaway risks. EntireFM’s commercial electrical engineering division safely isolates arrays, replaces defective bypass diodes and damaged modules, and cleans soiled panels to restore maximum output.',
      tradeCapabilities: ['NICEIC Solar PV Electrical Repairs', 'Bypass Diode & Module Replacement', 'Array De-energisation & Isolation', 'Commercial Solar Panel Cleaning'],
    },
    deliverables: [
      { title: 'IEC 62446-3 Thermographic Audit', format: 'Certified Solar PV Report', desc: 'Itemised panel defect catalogue with string IDs and thermographic metrics.' },
      { title: 'Generation Yield Impact Estimate', format: 'Yield Loss Analysis', desc: 'Calculating financial yield recovery achieved by rectifying identified faults.' },
      { title: 'Electrical Remedial Action Plan', format: 'NICEIC Engineering Scope', desc: 'Direct scope for EntireFM commercial electricians to isolate and replace modules.' },
    ],
    applications: [
      { title: 'Commercial Rooftop PV Arrays', desc: 'High-speed thermographic scanning of rooftop solar systems across logistics and retail parks.' },
      { title: 'Ground-Mount Solar Farms', desc: 'Utility-scale string and module inspection covering thousands of panels per day.' },
      { title: 'Pre-Acquisition PV Audits', desc: 'Verifying solar asset condition and actual generation yields before property purchase.' },
      { title: 'Annual Warranty Compliance', desc: 'Fulfilling IEC 62446-3 statutory maintenance requirements for renewable warranties.' },
    ],
  },

  '/services/drone-services/surveying-mapping': {
    videoSrc: '/video/drone/surveying.mp4',
    heroPoster: '/images/drone/surveying_poster.png',
    heroBadge: 'GEOSPATIAL ORTHOMOSAICS & GIS',
    ctaTitle: 'Commission a Survey-Grade Drone Mapping Flight',
    ctaButtonText: 'Request Topographic Quote',
    proofComponent: ProofSurveyingMapping,
    related: [
      { title: 'Volumetric & Earthworks Surveys', href: '/services/drone-services/volumetric-surveys', category: 'Civil Measurement' },
      { title: 'Construction Progress Monitoring', href: '/services/drone-services/construction-monitoring', category: 'Development Tracking' },
      { title: 'EntireFM 3D & Digital Twin Capture', href: '/services/drone-services/digital-twin-3d-capture', category: '3D Reality Mesh' },
    ],
    remediation: {
      heading: 'From Geospatial Data to Civil & Ground Maintenance',
      description: 'Surveying data is only as valuable as the estate decisions it enables. EntireFM combines aerial mapping with civil maintenance, estate grounds care, and drainage engineering to rectify surface defects, resolve boundary issues, and maintain civil infrastructure.',
      tradeCapabilities: ['Civil Drainage Remediation', 'Commercial Pothole & Road Repair', 'Estate Boundary Maintenance', 'CAFM Spatial Asset Tagging'],
    },
    deliverables: [
      { title: '2D Georeferenced Orthomosaic', format: 'GeoTIFF / ECW', desc: 'High-resolution composite orthophoto aligned with British National Grid (OSGB36).' },
      { title: 'Digital Elevation Model (DEM/DTM)', format: 'Elevation Raster & Contours', desc: 'Topographic ground height models with contour layers in DXF/DWG formats.' },
      { title: 'CAD / GIS Vector Integration', format: 'AutoCAD DXF / Shapefile', desc: 'Geospatial layers ready for civil engineering, architectural, and CAFM ingestion.' },
    ],
    applications: [
      { title: 'Estate Masterplanning & As-Builts', desc: 'Millimetre-accurate topographic baselines for estate extensions and boundary validation.' },
      { title: 'Civil Drainage & Slope Profiling', desc: 'Digital elevation models identifying terrain runoff slopes and flood catchment areas.' },
      { title: 'Construction Site Layouts', desc: 'Pre-construction topographic surveys calibrated with RTK positioning for CAD drafting.' },
      { title: 'Infrastructure Asset Mapping', desc: 'Spatial recording of private access roads, parking bays, lighting columns, and substations.' },
    ],
  },

  '/services/drone-services/construction-monitoring': {
    videoSrc: '/video/drone/construction.mp4',
    heroPoster: '/images/drone/construction_poster.png',
    heroBadge: 'CONSTRUCTION PROGRESS MONITORING',
    ctaTitle: 'Commission Repeat Waypoint Construction Monitoring',
    ctaButtonText: 'Set Up Site Monitoring',
    proofComponent: ProofConstructionTimeline,
    related: [
      { title: 'Surveying & Geospatial Mapping', href: '/services/drone-services/surveying-mapping', category: 'Topography & GIS' },
      { title: 'Volumetric & Earthworks Surveys', href: '/services/drone-services/volumetric-surveys', category: 'Civil & Earthworks' },
      { title: 'High-Level Photography & 6K Film', href: '/services/drone-services/aerial-photography-video', category: 'Investor Marketing' },
    ],
    remediation: {
      heading: 'Integrated with EntireFM Projects & Facilities Handover',
      description: 'Our construction monitoring services transition seamlessly into EntireFM Projects and facilities mobilisation. As construction completes, our FM team receives the complete digital visual record to populate the asset register and begin ongoing planned maintenance.',
      tradeCapabilities: ['Post-Construction FM Mobilisation', 'Asset Register Population', 'Initial PPM Matrix Creation', 'Snagging Defect Rectification'],
    },
    deliverables: [
      { title: 'Monthly Progress Report Pack', format: 'Executive Summary PDF', desc: 'Side-by-side milestone comparison from identical GPS-locked waypoints.' },
      { title: 'Site Orthomosaic Overlay', format: 'Cloud Web Viewer Link', desc: 'Interactive map comparing current build phase against architectural masterplans.' },
      { title: '4K Milestone Time-Lapse Media', format: 'High-Definition Video Reel', desc: 'Curated video assets tracking chronological progress for marketing and investors.' },
    ],
    applications: [
      { title: 'Milestone Progress Verification', desc: 'Weekly/monthly aerial records verifying groundworks, steel framing, and cladding milestones.' },
      { title: 'Subcontractor Delivery Proof', desc: 'Timestamped photographic proof documenting work completion before invoice signoff.' },
      { title: 'Investor & Stakeholder Updates', desc: 'High-resolution time-lapse photography and 4K video reels for development board meetings.' },
      { title: 'Dispute & Delay Claim Protection', desc: 'Indisputable visual history protecting main contractors and developers against delay claims.' },
    ],
  },

  '/services/drone-services/digital-twin-3d-capture': {
    heroPoster: '/images/drone/gaussian-splat/casa-hotel.jpg',
    heroBadge: 'ENTIREFM 3D DIGITAL TWIN & BIM',
    ctaTitle: 'Build a Navigable 3D Digital Twin of Your Building',
    ctaButtonText: 'Discuss 3D Capture Project',
    proofComponent: ProofDigitalTwin3D,
    related: [
      { title: 'Façade & Building Envelope', href: '/services/drone-services/building-envelope-inspections', category: 'Vertical Fabric' },
      { title: 'Surveying & Geospatial Mapping', href: '/services/drone-services/surveying-mapping', category: 'Topography & GIS' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'General Envelope' },
    ],
    remediation: {
      heading: 'Integrated Spatial Asset Intelligence',
      description: 'Digital twins link directly into EntireFM’s planned maintenance and project management delivery. By maintaining an accurate 3D model in EntireCAFM, our engineers plan plant replacements, lift operations, and rope access rigging with complete spatial certainty.',
      tradeCapabilities: ['BIM-Ready As-Built Drafting', 'Virtual Tender Package Creation', 'Plant Replacement Spatial Planning', 'EntireCAFM 3D Asset Tagging'],
    },
    deliverables: [
      { title: 'EntireFM 3D Spatial Reality Model', format: 'Interactive Web 3D', desc: 'High-detail navigable 3D model accessible in standard web browsers with full orbital controls.' },
      { title: 'Dense Georeferenced Point Cloud', format: 'LAS, LAZ & RCP', desc: 'Millions of spatial points ready for direct import into Autodesk Revit and Navisworks.' },
      { title: 'Virtual Measurement Report', format: 'Area & Volume CAD Sheet', desc: 'Verified deck square meterage, wall heights, and roof slope angles.' },
    ],
    applications: [
      { title: 'Remote Asset Inspection', desc: 'Facilities directors inspecting high-rise roofs, facades, and plant decks from their desktop.' },
      { title: 'BIM Authoring & As-Built Verification', desc: 'Generating dense point clouds for Revit modeling, clash detection, and fit-out design.' },
      { title: 'Space Planning & Refurbishment', desc: 'Accurate 3D dimensions of plant rooms, courtyards, and external service yards.' },
      { title: 'Landlord Dilapidations Baseline', desc: 'Creating an immutable 3D visual baseline at the start and end of commercial leases.' },
    ],
  },

  '/services/drone-services/volumetric-surveys': {
    heroPoster: '/images/drone/nav/surveying.png',
    heroBadge: 'VOLUMETRIC & EARTHWORKS PRECISION',
    ctaTitle: 'Commission a 3D Stockpile or Cut/Fill Volumetric Survey',
    ctaButtonText: 'Request Volumetric Survey',
    proofComponent: ProofVolumetricSurveys,
    related: [
      { title: 'Surveying & Geospatial Mapping', href: '/services/drone-services/surveying-mapping', category: 'Topography & GIS' },
      { title: 'Construction Progress Monitoring', href: '/services/drone-services/construction-monitoring', category: 'Development Tracking' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'Asset Inspection' },
    ],
    remediation: {
      heading: 'Accurate Material Logistics & Civil Management',
      description: 'Volumetric survey findings integrate with EntireFM civil and industrial facilities management, assisting clients in balancing earthwork movements, managing waste disposal compliance, and maintaining material inventory control.',
      tradeCapabilities: ['Civil Earthworks Verification', 'Bulk Material Logistics Planning', 'Waste Duty of Care Compliance', 'Financial Stock Audit Signoff'],
    },
    deliverables: [
      { title: 'Stockpile Volume & Tonnage Audit', format: 'Certified PDF Certificate', desc: 'Exact cubic metres (m³) and computed tonnage based on verified bulk density.' },
      { title: 'Cut / Fill Elevation Differential Map', format: 'Color-Coded Depth Raster', desc: 'Visual heatmap showing exact excavation cut depth and fill build-up zones.' },
      { title: '3D Digital Surface Model (DSM)', format: 'LandXML & DXF Contours', desc: 'Continuous triangular mesh export ready for civil engineering earthwork software.' },
    ],
    applications: [
      { title: 'Aggregate & Material Stockpiles', desc: 'Measuring cubic metre volumes of sand, gravel, stone, scrap metal, and biomass.' },
      { title: 'Earthworks Cut / Fill Balances', desc: 'Comparing baseline topography against design levels to quantify net soil movement.' },
      { title: 'Quarry & Mining Extraction Audits', desc: 'Tracking monthly extraction rates, remaining void space, and pit face stability.' },
      { title: 'Financial Year-End Inventory Audits', desc: 'Certified bulk material inventory valuations for corporate accounting and tax compliance.' },
    ],
  },

  '/services/drone-services/aerial-photography-video': {
    videoSrc: '/video/drone/photography.mp4',
    heroPoster: '/images/drone/photography_poster.png',
    heroBadge: '6K ARCHITECTURAL CINEMATOGRAPHY',
    ctaTitle: 'Commission High-Level 6K Aerial Cinematography & Stills',
    ctaButtonText: 'Book Aerial Production',
    proofComponent: ProofAerialPhotography,
    related: [
      { title: 'EntireFM 3D & Digital Twin Capture', href: '/services/drone-services/digital-twin-3d-capture', category: '3D Reality Mesh' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'General Envelope' },
      { title: 'Construction Progress Monitoring', href: '/services/drone-services/construction-monitoring', category: 'Milestone Tracking' },
    ],
    remediation: {
      heading: 'Connected to EntireFM Estate Presentation & Care',
      description: 'While capturing promotional media, our pilots often identify external presentation snags—such as overgrown landscaping, stained cladding, or damaged signage. EntireFM can immediately coordinate grounds maintenance and specialist cleaning to ensure your estate presents at its absolute best.',
      tradeCapabilities: ['Commercial External Cladding Cleaning', 'Estate Grounds & Landscaping Care', 'High-Level Signage Maintenance', 'Car Park Relining & Lighting'],
    },
    deliverables: [
      { title: 'High-Resolution RAW Stills Suite', format: '48MP/100MP RAW & JPEG', desc: 'Professionally retouched golden-hour and blue-hour photography for web and print.' },
      { title: '4K/6K Stabilised Cinematic Video', format: 'ProRes & MP4 Masters', desc: 'Smooth aerial tracking shots with optional motion graphic callouts and corporate titles.' },
      { title: 'Web & Social Media Cutdowns', format: 'Formatted Video Suite', desc: 'Short promotional video clips optimized for LinkedIn, websites, and tender bids.' },
    ],
    applications: [
      { title: 'Commercial Property Marketing', desc: 'High-impact 4K/6K aerial visuals showcasing office towers, business parks, and logistics hubs.' },
      { title: 'Completed Project Showcases', desc: 'Documenting major FM refurbishments, M&E plant installations, and solar retrofits.' },
      { title: 'Investor & Annual ESG Reporting', desc: 'Stunning visual assets for corporate annual reports, ESG presentations, and websites.' },
      { title: 'Estate Context & Transport Links', desc: 'Elevated views highlighting proximity to motorways, ports, railways, and urban centres.' },
    ],
  },

  '/services/drone-services/emergency-insurance-surveys': {
    heroPoster: '/images/editorial/entirefm-external-distribution-dusk-2000w.webp',
    heroBadge: 'EMERGENCY STORM & INCIDENT TRIAGE',
    ctaTitle: 'Request Rapid Emergency Post-Storm Drone Inspection',
    ctaButtonText: 'Request Emergency Response',
    proofComponent: ProofEmergencyInsurance,
    related: [
      { title: 'Roof & Gutter Inspections', href: '/services/drone-services/roof-inspections', category: 'Waterproofing & Drainage' },
      { title: 'Commercial Drone Inspections', href: '/services/drone-services/drone-inspections', category: 'Asset Inspection' },
      { title: 'Radiometric Thermal Surveys', href: '/services/drone-services/thermal-imaging', category: 'Moisture Detection' },
    ],
    remediation: {
      heading: 'Immediate 24/7 Make-Safe & Permanent Remediation',
      description: 'Following an incident, EntireFM does not leave you with just damage photographs. Our 24/7 helpdesk dispatches trade teams to execute emergency make-safe works (securing loose cladding, installing temporary weatherproofing, clearing debris), followed by full permanent structural repair.',
      tradeCapabilities: ['24/7 Emergency Make-Safe Works', 'Temporary Roof Tarpaulin Securing', 'Loose Cladding & Masonry Removal', 'Permanent Structural Reinstatement'],
    },
    deliverables: [
      { title: 'Emergency Damage Appraisal', format: 'Same-Day Report', desc: 'Visual summary categorising life-safety risks and weatherproofing breaches.' },
      { title: 'Loss Adjuster Evidence Bundle', format: 'Geotagged Stills Suite', desc: 'Metadata-verified photographs formatted specifically for commercial insurers.' },
      { title: 'Emergency Make-Safe Quotation', format: 'Immediate Fixed Scope', desc: 'Priced proposal for temporary boarding, tarpaulins, and permanent repair works.' },
    ],
    applications: [
      { title: 'Post-Storm Roof Damage Audits', desc: 'Immediate aerial inspection of dislodged sheets, shattered skylights, and collapsed gutters.' },
      { title: 'Fire & Structural Incident Review', desc: 'Safe visual access into structurally compromised buildings where internal entry is prohibited.' },
      { title: 'High-Level Impact Damage', desc: 'Assessing crane strikes, vehicle impacts, or fallen tree damage on roofs and parapets.' },
      { title: 'Insurance Claim Loss Adjustment', desc: 'Providing indisputable georeferenced photographic evidence packs for loss adjusters.' },
    ],
  },
};

export function TemplateDroneSubService({ route, content }: TemplateDroneSubServiceProps) {
  const path = route.path;
  const config = SERVICE_CONFIGS[path] || SERVICE_CONFIGS['/services/drone-services/drone-inspections'];
  const ProofModule = config.proofComponent;

  const breadcrumbs = content.breadcrumbs || [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Drone Services', url: '/services/drone-services' },
    { name: content.h1, url: route.path },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-brand-pink/20 selection:text-brand-pink">
      <Header />

      <main id="main" className="flex-grow">
        {/* ========================================================================= */}
        {/* 1. CINEMATIC FULL-VIEWPORT HERO (100svh matching M&E benchmark)           */}
        {/* ========================================================================= */}
        <section 
          aria-label={`${content.h1} Hero`}
          className="on-dark relative isolate flex min-h-[100svh] min-h-[36rem] sm:min-h-[42rem] lg:min-h-screen w-full flex-col justify-between overflow-hidden bg-[#060A14] lg:[height:100svh]"
        >
          {/* Photographic / Video Background */}
          <div className="absolute inset-0 -z-20 overflow-hidden">
            {config.videoSrc ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={config.heroPoster}
                className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.05]"
              >
                <source src={config.videoSrc} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={config.heroPoster}
                alt={content.title}
                fill
                priority
                className={`w-full h-full object-cover object-center ${
                  path === '/services/drone-services/digital-twin-3d-capture'
                    ? 'filter brightness-[0.78] contrast-[1.08]'
                    : 'filter brightness-[0.55] contrast-[1.05]'
                }`}
                sizes="100vw"
              />
            )}
          </div>

          {/* Multi-stop dark gradient overlays */}
          {path === '/services/drone-services/digital-twin-3d-capture' ? (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    'linear-gradient(96deg, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.55) 45%, rgba(6,10,20,0.30) 78%, rgba(6,10,20,0.15) 100%)',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 -z-10 h-36"
                style={{ background: 'linear-gradient(to top, rgba(6,10,20,0.9), transparent)' }}
              />
            </>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10"
                style={{
                  background:
                    'linear-gradient(96deg, rgba(6,10,20,0.96) 0%, rgba(6,10,20,0.90) 42%, rgba(6,10,20,0.68) 78%, rgba(6,10,20,0.48) 100%)',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 -z-10 h-36"
                style={{ background: 'linear-gradient(to top, rgba(6,10,20,1), transparent)' }}
              />
            </>
          )}
          <div
            aria-hidden="true"
            className="facet-rule pointer-events-none absolute inset-0 -z-10 opacity-30"
          />

          {/* Breadcrumbs offset past header — Exactly matching M&E page */}
          <div className="relative pt-[calc(var(--header-h)+0.25rem)]">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero Content — Aligned to container-wide grid */}
          <div className="container-wide relative flex flex-1 flex-col justify-center py-6 sm:py-8 pb-10 sm:pb-14">
            <div className="max-w-3xl">
              
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/[0.07] border border-white/15 backdrop-blur-sm mb-4">
                <Plane className="h-3.5 w-3.5 text-brand-pink" />
                <span className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-brand-pink-light">
                  {config.heroBadge}
                </span>
              </div>

              {/* Single clear H1 */}
              <h1 className="text-display-xl text-white">
                {content.h1}
              </h1>

              {/* Hero Intro */}
              <p className="mt-4 max-w-2xl text-sm sm:text-base lg:text-[1.0625rem] leading-relaxed text-brand-mist/85 font-light">
                {content.heroIntro}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact-us"
                  className="btn-hero-pink w-full sm:w-auto text-center justify-center"
                >
                  <span>{config.ctaButtonText}</span>
                  <ArrowRight className="btn-arrow h-4 w-4" />
                </Link>

                <Link
                  href="/services/drone-services"
                  className="btn-ghost-light w-full sm:w-auto text-center justify-center"
                >
                  <span>All Drone Services</span>
                </Link>
              </div>
            </div>

            {/* Proof / Service Facts Row (Glass Cards matching M&E design) */}
            <dl className="mt-8 grid max-w-5xl grid-cols-1 gap-2.5 sm:grid-cols-3 lg:gap-3.5">
              <div className="group rounded-sm border border-white/[0.09] bg-white/[0.06] p-3.5 sm:p-4 lg:p-5 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]">
                <dt className="text-base sm:text-lg font-light tracking-tight text-white transition-colors duration-500 group-hover:text-brand-pink-light">
                  CAA Certified Pilots
                </dt>
                <dd className="mt-1 text-[10px] sm:text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
                  Approved UK Flight Operations
                </dd>
              </div>

              <div className="group rounded-sm border border-white/[0.09] bg-white/[0.06] p-3.5 sm:p-4 lg:p-5 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]">
                <dt className="text-base sm:text-lg font-light tracking-tight text-white transition-colors duration-500 group-hover:text-brand-pink-light">
                  Direct Trade Remediation
                </dt>
                <dd className="mt-1 text-[10px] sm:text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
                  Self-Delivered EntireFM Engineering
                </dd>
              </div>

              <div className="group rounded-sm border border-white/[0.09] bg-white/[0.06] p-3.5 sm:p-4 lg:p-5 backdrop-blur-xl transition-all duration-500 ease-brand hover:border-white/20 hover:bg-white/[0.11]">
                <dt className="text-base sm:text-lg font-light tracking-tight text-white transition-colors duration-500 group-hover:text-brand-pink-light">
                  Digital CAFM Reporting
                </dt>
                <dd className="mt-1 text-[10px] sm:text-[10.5px] font-normal uppercase tracking-[0.14em] text-brand-mist/65 transition-colors duration-500 group-hover:text-brand-mist/90">
                  High-Resolution Asset Inspection Logs
                </dd>
              </div>
            </dl>
          </div>

          <div aria-hidden="true" className="rule-hero-pink absolute inset-x-0 bottom-0" />
        </section>

        <TrustBar />

        {/* ========================================================================= */}
        {/* 2. SUBSTANTIAL INTERACTIVE / TECHNICAL DEMONSTRATION                      */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#0B1220] text-white border-b border-brand-edge-dark">
          <div className="container-custom space-y-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                  Field Capture &amp; Diagnostics
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-white leading-tight">
                What We See &amp; Measure in the Field
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                {content.heroDescription}
              </p>
            </div>

            {/* Dynamic Visual Proof Module */}
            <ProofModule />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CORE CAPABILITIES — EDITORIAL SPLIT LAYOUT (60%+ CARD REDUCTION)       */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                  Operational Scope
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                Core Inspection Capabilities
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light">
                Engineered specifically for commercial property managers, industrial estates, institutional landlords, and construction developers.
              </p>
            </div>

            {/* Editorial Staggered Layout instead of 4 generic cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-slate-200 pt-10">
              {content.capabilities?.map((cap, idx) => (
                <div
                  key={idx}
                  className="space-y-3 pb-8 border-b border-slate-100 last:border-0"
                >
                  <span className="text-xs uppercase tracking-widest text-brand-pink font-medium block">
                    {cap.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-light text-slate-900 tracking-tight">
                    {cap.name}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. COMMERCIAL SCENARIOS — ASYMMETRIC VISUAL APPLICATIONS LAYOUT          */}
        {/* ========================================================================= */}
        <section className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                  Facilities Scenarios
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                Commercial Facilities Applications
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light">
                Real-world operational scenarios where aerial drone capture delivers maximum commercial efficiency and eliminates high-risk physical access.
              </p>
            </div>

            {/* Editorial 2x2 with clear whitespace instead of boxed SaaS cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.applications.map((app, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-sm bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-brand-pink/50 transition-colors"
                >
                  <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                    Scenario 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-light text-slate-900 tracking-tight">
                    {app.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    {app.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. STRUCTURED DELIVERABLES — NUMBERED EDITORIAL STRIP (NO BOX SPAM)       */}
        {/* ========================================================================= */}
        <section className="py-24 bg-white border-b border-slate-200">
          <div className="container-custom space-y-16">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                  Deliverable Formats
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extralight tracking-tight text-slate-900 leading-tight">
                Structured Survey Deliverables
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light">
                Georeferenced data packages formatted directly for building surveyors, property managers, CAD suites, and CAFM databases.
              </p>
            </div>

            {/* Editorial Numbered Rows with divider lines */}
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {config.deliverables.map((del, idx) => (
                <div
                  key={idx}
                  className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-slate-50/60 transition-colors px-2 sm:px-4"
                >
                  <div className="lg:col-span-1 text-2xl font-extralight text-brand-pink">
                    0{idx + 1}
                  </div>
                  <div className="lg:col-span-4 space-y-1">
                    <h3 className="text-xl font-light text-slate-900">
                      {del.title}
                    </h3>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-medium block">
                      {del.format}
                    </span>
                  </div>
                  <div className="lg:col-span-7">
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                      {del.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. THE REMEDIATION BRIDGE (INSPECT → DIAGNOSE → REPAIR → VERIFY)          */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#060A14] text-white relative overflow-hidden border-b border-brand-edge-dark">
          <div className="container-custom relative z-10 space-y-14">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/10 border border-white/15">
                <Wrench className="h-3.5 w-3.5 text-brand-pink" />
                <span className="text-xs uppercase tracking-widest text-white/90 font-medium">
                  End-to-End Remediation Bridge
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-tight">
                We don’t just find the defect. <br />
                <span className="font-light text-hero-pink">
                  Our trade teams fix it.
                </span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-2xl">
                {config.remediation.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-brand-edge-dark">
              {config.remediation.tradeCapabilities.map((cap, cIdx) => (
                <div key={cIdx} className="p-6 rounded-sm bg-brand-carbon/60 border border-brand-edge-dark space-y-2.5">
                  <span className="text-xs text-brand-pink font-medium block uppercase tracking-wider">Discipline 0{cIdx + 1}</span>
                  <p className="text-sm sm:text-base text-slate-200 font-light leading-snug">{cap}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. ADJACENT AERIAL SERVICES NAVIGATION                                   */}
        {/* ========================================================================= */}
        <section className="py-24 bg-slate-50 border-b border-slate-200">
          <div className="container-custom space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-pink" />
                <span className="text-xs uppercase tracking-wider text-brand-pink font-medium">
                  Specialist Capabilities
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extralight tracking-tight text-slate-900">
                Adjacent Aerial Services
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.related.map((rel, rIdx) => (
                <Link
                  key={rIdx}
                  href={rel.href}
                  className="p-8 rounded-sm bg-white border border-slate-200 hover:border-brand-pink transition-all group flex flex-col justify-between shadow-sm space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-xs text-brand-pink uppercase tracking-widest font-medium block">
                      {rel.category}
                    </span>
                    <h3 className="text-xl font-light text-slate-900 group-hover:text-brand-pink transition-colors">
                      {rel.title}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs text-brand-pink font-medium pt-2">
                    <span>View Service Specifications</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. AUTHORITATIVE FAQS (CLEAN 2-COLUMN EDITORIAL ACCORDION)                */}
        {/* ========================================================================= */}
        {content.faqs && content.faqs.length > 0 && (
          <DroneServiceFaq
            eyebrow="SERVICE-SPECIFIC FAQ"
            title="Frequently Asked Questions"
            intro="Authoritative technical details on flight safety parameters, inspection deliverables, and EntireFM physical remedial execution."
            faqs={content.faqs}
          />
        )}

        {/* ========================================================================= */}
        {/* 9. BESPOKE SERVICE CONVERSION CTA                                         */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#060A14] text-white border-b border-brand-edge-dark">
          <div className="container-custom max-w-4xl text-center space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-brand-pink block font-medium">
                Flight Operations Consultation
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extralight text-white leading-tight">
                {config.ctaTitle}
              </h2>
              <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
                Consult with our flight operations and building surveying team to define flight parameters, site-specific RAMS, and rapid data delivery.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-pink px-9 py-4 text-sm font-medium text-white shadow-elevated hover:bg-brand-pink/90 transition-all hover:scale-[1.02]"
              >
                <span>{config.ctaButtonText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="tel:08450944062"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-medium text-white hover:bg-white/20 transition-all"
              >
                <PhoneCall className="h-4 w-4 text-brand-electric-bright" />
                <span>Call 0845 094 4062</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
