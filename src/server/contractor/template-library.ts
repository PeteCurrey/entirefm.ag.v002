/**
 * ENTIREFM CONTRACTOR BUSINESS TEMPLATE LIBRARY & SCHEMA ENGINE
 * =============================================================
 * 50+ Reusable, editable, duplicable, and exportable business document templates.
 * Comprehensive coverage across:
 *   1. Health & Safety (19 suites)
 *   2. Job & Service Documentation (16 suites)
 *   3. Commercial & Contracts (10 suites)
 *   4. Specialist Trade Suites (11 suites)
 */

export type TemplateCategory =
  | 'HEALTH_SAFETY'
  | 'JOB_SERVICE'
  | 'COMMERCIAL'
  | 'SPECIALIST_ELECTRICAL'
  | 'SPECIALIST_HVAC'
  | 'SPECIALIST_FIRE'
  | 'SPECIALIST_PLUMBING'
  | 'SPECIALIST_BUILDING';

export interface TemplateFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'signature' | 'photo' | 'table';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
}

export interface TemplateSectionDefinition {
  id: string;
  title: string;
  description?: string;
  fields: TemplateFieldDefinition[];
}

export interface BusinessTemplateDefinition {
  id: string;
  category: TemplateCategory;
  categoryLabel: string;
  title: string;
  description: string;
  trade?: string;
  version: string;
  disclaimer?: string;
  sections: TemplateSectionDefinition[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HEALTH & SAFETY TEMPLATES (19 Standard Suites)
// ─────────────────────────────────────────────────────────────────────────────
const HEALTH_SAFETY_TEMPLATES: BusinessTemplateDefinition[] = [
  {
    id: 'hs-risk-assessment',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'General Risk Assessment',
    description: 'Hazard identification, severity scoring, control measures, and residual risk evaluation.',
    version: '2.0',
    sections: [
      {
        id: 'job_info',
        title: 'Project & Site Information',
        fields: [
          { id: 'site_address', label: 'Site Location / Address', type: 'text', required: true },
          { id: 'assessor_name', label: 'Competent Assessor Name', type: 'text', required: true },
          { id: 'assessment_date', label: 'Date of Assessment', type: 'date', required: true },
          { id: 'work_scope', label: 'Task / Activity Description', type: 'textarea', required: true },
        ],
      },
      {
        id: 'hazards',
        title: 'Identified Hazards & Controls',
        fields: [
          { id: 'hazard_types', label: 'Applicable Hazards', type: 'select', options: ['Electrical', 'Working at Height', 'Manual Handling', 'Slips/Trips', 'Hot Works', 'Noise', 'Hazardous Substances'] },
          { id: 'persons_at_risk', label: 'Persons at Risk', type: 'select', options: ['Operatives Only', 'Operatives & Site Staff', 'General Public & Tenants', 'Contractors & Visitors'] },
          { id: 'control_measures', label: 'Specific Control Measures Applied', type: 'textarea', required: true },
          { id: 'ppe_required', label: 'Mandatory PPE', type: 'select', options: ['Safety Boots, Hi-Vis, Hard Hat', 'Eye Protection & Gloves', 'Full Respiratory & Harness', 'Standard 5-Point PPE'] },
          { id: 'residual_risk', label: 'Residual Risk Level', type: 'select', options: ['LOW (Acceptable)', 'MEDIUM (Monitored)', 'HIGH (Stop Work)'] },
        ],
      },
    ],
  },
  {
    id: 'hs-method-statement',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Method Statement',
    description: 'Step-by-step safe sequence of works, plant requirements, and operative supervision.',
    version: '2.0',
    sections: [
      {
        id: 'overview',
        title: 'Method Overview & Logistics',
        fields: [
          { id: 'activity_title', label: 'Activity Name', type: 'text', required: true },
          { id: 'supervisor_name', label: 'Site Supervisor / Lead', type: 'text', required: true },
          { id: 'access_arrangements', label: 'Access & Egress Plan', type: 'textarea' },
          { id: 'plant_tools', label: 'Plant, Machinery & Tools Required', type: 'textarea' },
          { id: 'step_sequence', label: 'Sequence of Works (Step 1, 2, 3...)', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'hs-rams-unified',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Unified RAMS Document',
    description: 'Combined Risk Assessment & Method Statement pack with operative sign-off briefing.',
    version: '2.5',
    sections: [
      {
        id: 'general',
        title: 'RAMS Header & Scope',
        fields: [
          { id: 'project_name', label: 'Project / Client Name', type: 'text', required: true },
          { id: 'author_name', label: 'Prepared By (Competent Person)', type: 'text', required: true },
          { id: 'emergency_contact', label: 'Emergency Contact & Phone', type: 'text', required: true },
          { id: 'scope_summary', label: 'Detailed Scope of Works', type: 'textarea', required: true },
          { id: 'briefing_notes', label: 'Operative Briefing Acknowledgement', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'hs-dynamic-ra',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Dynamic Risk Assessment (DRA)',
    description: 'Real-time on-site risk evaluation for unexpected or changing field conditions.',
    version: '1.5',
    sections: [
      {
        id: 'dra',
        title: 'Dynamic Field Evaluation',
        fields: [
          { id: 'trigger_event', label: 'Trigger Reason for Dynamic Assessment', type: 'textarea', required: true },
          { id: 'immediate_action', label: 'Immediate Action Taken / Work Paused', type: 'textarea', required: true },
          { id: 'controls_adapted', label: 'Adapted Controls Implemented', type: 'textarea', required: true },
          { id: 'safe_to_proceed', label: 'Safe to Proceed After Controls', type: 'select', options: ['YES — Safe to continue', 'NO — Stop Work Initiated'] },
        ],
      },
    ],
  },
  {
    id: 'hs-coshh',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'COSHH Substance Assessment',
    description: 'Control of Substances Hazardous to Health evaluation, storage, and spill response.',
    version: '2.0',
    sections: [
      {
        id: 'substance',
        title: 'Substance Details & Containment',
        fields: [
          { id: 'substance_name', label: 'Product / Chemical Name', type: 'text', required: true },
          { id: 'hazard_symbols', label: 'Hazard Classification', type: 'select', options: ['Corrosive', 'Flammable', 'Toxic', 'Irritant', 'Environmental Hazard'] },
          { id: 'exposure_route', label: 'Route of Exposure', type: 'select', options: ['Inhalation', 'Skin Absorption', 'Eye Contact', 'Ingestion'] },
          { id: 'first_aid', label: 'First Aid Measures', type: 'textarea', required: true },
          { id: 'spill_procedure', label: 'Spill Containment Procedure', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'hs-toolbox-talk',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Toolbox Talk Record',
    description: 'Safety briefing delivery log with operative names and sign-off register.',
    version: '1.5',
    sections: [
      {
        id: 'talk_details',
        title: 'Toolbox Topic & Attendance',
        fields: [
          { id: 'topic', label: 'Toolbox Talk Topic', type: 'text', required: true },
          { id: 'delivered_by', label: 'Delivered By (Supervisor)', type: 'text', required: true },
          { id: 'date_delivered', label: 'Date & Time', type: 'date', required: true },
          { id: 'key_points', label: 'Summary of Key Safety Points', type: 'textarea', required: true },
          { id: 'attendees_list', label: 'Operative Attendee Names & Signatures', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'hs-site-induction',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Site Induction Checklist',
    description: 'New operative orientation, welfare locations, assembly points, and site rules.',
    version: '1.5',
    sections: [
      {
        id: 'induction',
        title: 'Induction Verification',
        fields: [
          { id: 'operative_name', label: 'Inductee Full Name', type: 'text', required: true },
          { id: 'inductor_name', label: 'Inducted By', type: 'text', required: true },
          { id: 'fire_escape_shown', label: 'Fire Escape & Assembly Point Shown', type: 'checkbox' },
          { id: 'first_aid_shown', label: 'First Aid & First Aider Identified', type: 'checkbox' },
          { id: 'asbestos_briefed', label: 'Asbestos Register Reviewed', type: 'checkbox' },
          { id: 'welfare_shown', label: 'Welfare Facilities Located', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-pre-start',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Pre-Start Daily Safety Checklist',
    description: 'Pre-work verification of site conditions, tools, weather, and permits.',
    version: '1.5',
    sections: [
      {
        id: 'checks',
        title: 'Pre-Start Assessment',
        fields: [
          { id: 'site_secure', label: 'Work Area Barricaded / Segregated', type: 'checkbox' },
          { id: 'tools_inspected', label: 'All Hand & Power Tools Inspected', type: 'checkbox' },
          { id: 'ppe_verified', label: 'All Operatives Wearing Required PPE', type: 'checkbox' },
          { id: 'permits_active', label: 'Required Permits Signed & Active', type: 'checkbox' },
          { id: 'notes', label: 'Specific Daily Hazards Noted', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'hs-permit-to-work',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'General Permit to Work (PTW)',
    description: 'Isolation, lock-out/tag-out (LOTO), and authorized handover.',
    version: '2.0',
    sections: [
      {
        id: 'permit_general',
        title: 'Permit Authorisation',
        fields: [
          { id: 'permit_number', label: 'Permit Number', type: 'text', required: true },
          { id: 'isolation_verified', label: 'Electrical / Mechanical Isolation Locked Out', type: 'checkbox' },
          { id: 'authoriser_name', label: 'Authorised Person (Issuer)', type: 'text', required: true },
          { id: 'receiver_name', label: 'Competent Person (Receiver)', type: 'text', required: true },
          { id: 'handback_confirmed', label: 'Work Completed & Isolation Restored', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-working-at-height',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Working at Height Assessment',
    description: 'Ladder, podium, tower scaffold, MEWP selection, and fall arrest verification.',
    version: '2.0',
    sections: [
      {
        id: 'height',
        title: 'Height Access Protocol',
        fields: [
          { id: 'access_equipment', label: 'Equipment Used', type: 'select', options: ['Podium Steps', 'Mobile Scaffold Tower (PASMA)', 'MEWP / Scissor Lift (IPAF)', 'Stepladders (Short duration only)'] },
          { id: 'working_height_m', label: 'Maximum Working Height (Metres)', type: 'number', required: true },
          { id: 'inspection_tag_valid', label: 'Equipment Inspected & Scafftag Current', type: 'checkbox' },
          { id: 'ground_condition', label: 'Ground Level & Firm', type: 'checkbox' },
          { id: 'exclusion_zone', label: 'Exclusion Zone Created Below', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-lone-working',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Lone Working Assessment',
    description: 'Check-in schedule, communication protocols, and emergency escalation.',
    version: '2.0',
    sections: [
      {
        id: 'lone',
        title: 'Lone Worker Controls',
        fields: [
          { id: 'worker_name', label: 'Lone Worker Name', type: 'text', required: true },
          { id: 'checkin_frequency', label: 'Check-in Interval', type: 'select', options: ['Every 1 Hour', 'Every 2 Hours', 'Start & End of Shift Only'] },
          { id: 'designated_contact', label: 'Designated Check-In Monitor', type: 'text', required: true },
          { id: 'high_hazard_prohibited', label: 'High Hazard Work Prohibited (Confined space/Live electrical)', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-manual-handling',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Manual Handling Assessment',
    description: 'Heavy lifting assessment, mechanical lifting aids, and route clearance.',
    version: '2.0',
    sections: [
      {
        id: 'lifting',
        title: 'Lifting Task Assessment',
        fields: [
          { id: 'load_description', label: 'Description of Load / Plant Component', type: 'text', required: true },
          { id: 'estimated_weight_kg', label: 'Estimated Weight (kg)', type: 'number', required: true },
          { id: 'team_lift_required', label: 'Team Lift or Mechanical Aid Required', type: 'select', options: ['Single Person Lift (<20kg)', '2-Person Team Lift', 'Mechanical Hoist / Sack Truck Required'] },
          { id: 'route_clear', label: 'Transport Route Clear of Obstructions', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-ppe-assessment',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'PPE Suitability & Issue Record',
    description: 'Personal Protective Equipment task assessment, EN standard verification, and issue log.',
    version: '1.5',
    sections: [
      {
        id: 'ppe_record',
        title: 'PPE Requirements',
        fields: [
          { id: 'head_protection', label: 'Safety Helmet (EN 397)', type: 'checkbox' },
          { id: 'eye_protection', label: 'Safety Glasses / Face Shield (EN 166)', type: 'checkbox' },
          { id: 'footwear', label: 'Safety Boots with Toe/Midsole Protection (EN ISO 20345)', type: 'checkbox' },
          { id: 'gloves', label: 'Cut Resistant Gloves (EN 388)', type: 'checkbox' },
          { id: 'respiratory', label: 'RPE / Dust Mask (FFP3 / Half Mask)', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-emergency-action',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Emergency Action & Evacuation Plan',
    description: 'Site emergency contacts, assembly locations, first aiders, and acute incident procedures.',
    version: '1.5',
    sections: [
      {
        id: 'emergency_plan',
        title: 'Emergency Protocols',
        fields: [
          { id: 'first_aider_name', label: 'Designated First Aider', type: 'text', required: true },
          { id: 'nearest_hospital', label: 'Nearest A&E Hospital', type: 'text', required: true },
          { id: 'assembly_point', label: 'Emergency Assembly Point Location', type: 'text', required: true },
          { id: 'evacuation_procedure', label: 'Evacuation & Spill Response Plan', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'hs-fire-safety',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Site Fire Safety & Prevention Inspection',
    description: 'Fire route inspection, combustible clearance, extinguisher checks, and alarm audibility.',
    version: '1.5',
    sections: [
      {
        id: 'fire_checks',
        title: 'Fire Prevention Inspection',
        fields: [
          { id: 'routes_clear', label: 'Fire Exits and Escape Routes Unobstructed', type: 'checkbox' },
          { id: 'extinguishers_checked', label: 'Fire Extinguishers in Date & Pressurised', type: 'checkbox' },
          { id: 'waste_cleared', label: 'Combustible Packaging and Rubbish Removed Daily', type: 'checkbox' },
          { id: 'flammable_stored', label: 'Flammables Stored in COSHH Cabinet', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-asbestos-awareness',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Asbestos Demarcation Checklist',
    description: 'Demarcation confirmation, register inspection, and emergency stop protocol.',
    version: '2.0',
    sections: [
      {
        id: 'asbestos_check',
        title: 'Asbestos Register Review',
        fields: [
          { id: 'register_inspected', label: 'Site Asbestos Register Inspected', type: 'checkbox' },
          { id: 'presumed_acm', label: 'Known or Presumed ACM in Work Zone', type: 'select', options: ['NO — Area Confirmed Clear', 'YES — Licensed Contractor Only', 'YES — Encapsulated (No Drilling)'] },
          { id: 'emergency_stop_acknowledged', label: 'Operative Briefed on Emergency Stop Protocol', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-electrical-safety',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Electrical Isolation & LOTO Checklist',
    description: 'Safe isolation procedure, GS38 testing, warning notices, and multi-padlock verification.',
    version: '2.0',
    sections: [
      {
        id: 'isolation',
        title: 'Safe Isolation Procedure',
        fields: [
          { id: 'circuit_ref', label: 'Circuit / DB Reference Isolated', type: 'text', required: true },
          { id: 'gs38_tested', label: 'Tested Dead with Approved Voltage Indicator & Proving Unit', type: 'checkbox' },
          { id: 'padlock_fitted', label: 'Padlock and Danger Warning Tag Attached', type: 'checkbox' },
          { id: 'key_retained', label: 'Key Retained by Competent Electrician', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-confined-space',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Confined Space Entry Assessment',
    description: 'Atmospheric testing, ventilation, top-man standby, and rescue equipment.',
    version: '2.0',
    sections: [
      {
        id: 'space_details',
        title: 'Confined Space Controls',
        fields: [
          { id: 'location_id', label: 'Space Identifier / Chamber', type: 'text', required: true },
          { id: 'gas_monitor_model', label: 'Gas Detector Serial / Calibration Date', type: 'text', required: true },
          { id: 'oxygen_level_pct', label: 'Oxygen Level Checked (20.9%)', type: 'checkbox' },
          { id: 'topman_name', label: 'Dedicated Top-Man / Sentry', type: 'text', required: true },
          { id: 'tripod_harness_ready', label: 'Tripod, Winch & Escape BA Ready', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'hs-hot-works',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Health & Safety',
    title: 'Hot Works Permit & Fire Watch Log',
    description: 'Brazing, cutting, welding authorization with mandatory 60-min post-work fire watch.',
    version: '2.0',
    sections: [
      {
        id: 'hot_work',
        title: 'Hot Works Authorisation',
        fields: [
          { id: 'work_type', label: 'Hot Work Type', type: 'select', options: ['Oxy-Acetylene Brazing', 'TIG/MIG Welding', 'Angle Grinding / Cutting', 'Bitumen Boiler'] },
          { id: 'combustibles_cleared', label: 'Combustibles Cleared 10m Radius', type: 'checkbox' },
          { id: 'fire_extinguisher_present', label: 'Extinguisher Next to Operative (CO2 / Foam)', type: 'checkbox' },
          { id: 'fire_watch_completed', label: '60-Minute Post-Work Fire Watch Completed', type: 'checkbox' },
          { id: 'permit_expiry', label: 'Permit Expiry Time', type: 'text', required: true },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. JOB & SERVICE DOCUMENTATION (16 Standard Suites)
// ─────────────────────────────────────────────────────────────────────────────
const JOB_SERVICE_TEMPLATES: BusinessTemplateDefinition[] = [
  {
    id: 'js-service-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Engineer Service Report',
    description: 'Comprehensive field visit report detailing work carried out, parts used, and plant status.',
    version: '2.0',
    sections: [
      {
        id: 'job_summary',
        title: 'Service Summary',
        fields: [
          { id: 'job_number', label: 'Job / WO Reference', type: 'text', required: true },
          { id: 'customer_name', label: 'Customer / Client Name', type: 'text', required: true },
          { id: 'engineer_name', label: 'Lead Engineer', type: 'text', required: true },
          { id: 'arrival_time', label: 'Arrival Time', type: 'text' },
          { id: 'departure_time', label: 'Departure Time', type: 'text' },
        ],
      },
      {
        id: 'work_details',
        title: 'Work Carried Out & Parts',
        fields: [
          { id: 'work_description', label: 'Detailed Description of Work Executed', type: 'textarea', required: true },
          { id: 'parts_replaced', label: 'Parts & Consumables Replaced', type: 'textarea' },
          { id: 'plant_condition_leaving', label: 'Plant Status on Departure', type: 'select', options: ['Fully Operational', 'Operational with Observation', 'Isolated / Defective', 'Awaiting Parts'] },
          { id: 'customer_signoff', label: 'Customer Representative Name', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'js-maintenance-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Preventive Maintenance Report',
    description: 'Routine maintenance checklist covering motor lubrication, belt tension, and filters.',
    version: '2.0',
    sections: [
      {
        id: 'maint',
        title: 'Maintenance Tasks Executed',
        fields: [
          { id: 'asset_ref', label: 'Asset Reference', type: 'text', required: true },
          { id: 'filter_clean', label: 'Filters Cleaned / Replaced', type: 'checkbox' },
          { id: 'lubrication', label: 'Bearings Lubricated', type: 'checkbox' },
          { id: 'electrical_check', label: 'Electrical Terminals Torqued', type: 'checkbox' },
          { id: 'notes', label: 'General Condition & Observations', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'js-inspection-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Site Inspection Report',
    description: 'Detailed mechanical and electrical asset survey with condition grades.',
    version: '2.0',
    sections: [
      {
        id: 'inspect',
        title: 'Inspection Details',
        fields: [
          { id: 'site_name', label: 'Site Name', type: 'text', required: true },
          { id: 'inspection_type', label: 'Inspection Type', type: 'select', options: ['Condition Survey', 'Compliance Audit', 'Dilapidations Inspection', 'Routine Visual'] },
          { id: 'findings', label: 'Summary of Inspection Findings', type: 'textarea', required: true },
          { id: 'recommended_works', label: 'Recommended Corrective Actions', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'js-ppm-record',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'PPM Maintenance Visit Record',
    description: 'Scheduled preventive maintenance task checklist and compliance record.',
    version: '2.0',
    sections: [
      {
        id: 'ppm_tasks',
        title: 'Preventative Task Verification',
        fields: [
          { id: 'ppm_frequency', label: 'Schedule Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'] },
          { id: 'lubrication_completed', label: 'Lubrication & Greasing Complete', type: 'checkbox' },
          { id: 'electrical_checks_passed', label: 'Terminal Tightness & Voltage Checked', type: 'checkbox' },
          { id: 'controls_tested', label: 'Operational Interlocks & Thermostats Verified', type: 'checkbox' },
          { id: 'engineer_notes', label: 'Engineer Observations', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'js-breakdown-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Plant Breakdown & Diagnostic Report',
    description: 'Emergency breakdown diagnosis, root cause analysis, and temporary vs permanent fixes.',
    version: '1.5',
    sections: [
      {
        id: 'breakdown',
        title: 'Breakdown Diagnostics',
        fields: [
          { id: 'reported_fault', label: 'Reported Fault / Symptoms', type: 'textarea', required: true },
          { id: 'root_cause', label: 'Identified Root Cause', type: 'textarea', required: true },
          { id: 'rectification_status', label: 'Rectification Status', type: 'select', options: ['Fully Repaired & Tested', 'Temporary Fix (Return Required)', 'Awaiting Quoted Major Parts', 'Beyond Economical Repair'] },
        ],
      },
    ],
  },
  {
    id: 'js-defect-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Asset Defect & Snagging Report',
    description: 'Detailed defect identification with severity, photo capture, and remedial recommendations.',
    version: '2.0',
    sections: [
      {
        id: 'defect',
        title: 'Defect Information',
        fields: [
          { id: 'asset_tag', label: 'Asset Reference / ID', type: 'text', required: true },
          { id: 'defect_title', label: 'Defect Summary', type: 'text', required: true },
          { id: 'urgency', label: 'Urgency / Severity', type: 'select', options: ['P1 — Critical Safety Hazard', 'P2 — Urgent Operational Issue', 'P3 — Routine Repair', 'P4 — Cosmetic Snag'] },
          { id: 'remedial_action', label: 'Recommended Remedial Works', type: 'textarea', required: true },
          { id: 'estimated_cost', label: 'Estimated Repair Cost (£)', type: 'number' },
        ],
      },
    ],
  },
  {
    id: 'js-installation-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Plant Installation Report',
    description: 'New plant installation record, serial numbers, mounting, and isolation verification.',
    version: '1.5',
    sections: [
      {
        id: 'install',
        title: 'Installation Data',
        fields: [
          { id: 'equipment_type', label: 'Equipment Type', type: 'text', required: true },
          { id: 'serial_no', label: 'Manufacturer Serial Number', type: 'text', required: true },
          { id: 'mounted_correctly', label: 'Anti-Vibration Mounts & Fixings Secure', type: 'checkbox' },
          { id: 'electrical_certified', label: 'Electrical Connections Tested & Certified', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'js-commissioning',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Commissioning & Testing Certificate',
    description: 'Plant initial startup, parameters, setpoint verification, and client handover.',
    version: '2.0',
    sections: [
      {
        id: 'commissioning',
        title: 'Commissioning Parameters',
        fields: [
          { id: 'asset_serial', label: 'Plant Serial Number', type: 'text', required: true },
          { id: 'operating_voltage', label: 'Measured Voltage (V)', type: 'text' },
          { id: 'running_current_amps', label: 'Running Current (Amps)', type: 'text' },
          { id: 'operating_pressure_bar', label: 'Operating Pressure (Bar)', type: 'text' },
          { id: 'setpoints_configured', label: 'BMS Setpoints Programmed & Tested', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'js-decommissioning',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Plant Decommissioning & Disposal Record',
    description: 'Safe isolation, hazardous substance recovery (oil/gas), and WEEE waste disposal.',
    version: '1.5',
    sections: [
      {
        id: 'decom',
        title: 'Decommissioning Protocol',
        fields: [
          { id: 'plant_id', label: 'Decommissioned Plant ID', type: 'text', required: true },
          { id: 'fluids_recovered', label: 'Refrigerants / Oils Safely Drained & Logged', type: 'checkbox' },
          { id: 'permanently_isolated', label: 'Permanently Disconnected & Safe', type: 'checkbox' },
          { id: 'waste_carrier', label: 'Registered Waste Carrier Licence Number', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'js-site-visit',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Site Visit & Access Attendance Record',
    description: 'General site attendance record, security check-in, and escort notes.',
    version: '1.0',
    sections: [
      {
        id: 'visit',
        title: 'Attendance Details',
        fields: [
          { id: 'purpose', label: 'Purpose of Site Visit', type: 'text', required: true },
          { id: 'host_name', label: 'Client / Building Host', type: 'text' },
          { id: 'areas_visited', label: 'Areas & Plantrooms Accessed', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'js-engineer-attendance',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Engineer Attendance & Timesheet Log',
    description: 'On-site operative hours, travel time, and task duration accounting.',
    version: '1.5',
    sections: [
      {
        id: 'hours',
        title: 'Timesheet Entry',
        fields: [
          { id: 'operative_name', label: 'Operative Name', type: 'text', required: true },
          { id: 'hours_on_site', label: 'Standard Hours On Site', type: 'number', required: true },
          { id: 'overtime_hours', label: 'Overtime Hours (if applicable)', type: 'number' },
          { id: 'activity_summary', label: 'Summary of Activities', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'js-completion-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Job Completion Certificate',
    description: 'Official handover document certifying full completion of project or major repair works.',
    version: '2.0',
    sections: [
      {
        id: 'completion',
        title: 'Completion Details',
        fields: [
          { id: 'project_ref', label: 'Contract / Project Reference', type: 'text', required: true },
          { id: 'completion_date', label: 'Completion Date', type: 'date', required: true },
          { id: 'testing_complete', label: 'Commissioning & Functional Testing Passed', type: 'checkbox' },
          { id: 'waste_removed', label: 'Site Cleared & Waste Removed', type: 'checkbox' },
          { id: 'client_signatory', label: 'Client Approver Name', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'js-customer-signoff',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Customer Satisfaction Sign-Off Sheet',
    description: 'Direct customer satisfaction grading, comments, and signed acceptance.',
    version: '2.0',
    sections: [
      {
        id: 'signoff',
        title: 'Customer Acceptance',
        fields: [
          { id: 'customer_rep', label: 'Customer Representative Name', type: 'text', required: true },
          { id: 'satisfaction_rating', label: 'Work Quality Rating', type: 'select', options: ['5 Stars — Excellent', '4 Stars — Good', '3 Stars — Acceptable', '2 Stars — Minor Defects', '1 Star — Unacceptable'] },
          { id: 'feedback_notes', label: 'Customer Comments', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'js-handover-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Project Handover & Acceptance Certificate',
    description: 'Handover of O&M manuals, asset keys, warranty documentation, and client briefing.',
    version: '1.5',
    sections: [
      {
        id: 'handover',
        title: 'Handover Deliverables',
        fields: [
          { id: 'om_manuals_handed', label: 'O&M Manuals & Drawings Provided', type: 'checkbox' },
          { id: 'training_delivered', label: 'Client Operational Demonstration Completed', type: 'checkbox' },
          { id: 'keys_handed', label: 'Plantroom / Panel Keys Handed Over', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'js-equipment-inspection',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'PUWER Equipment Safety Inspection',
    description: 'Statutory Provision and Use of Work Equipment Regulations safety check.',
    version: '1.5',
    sections: [
      {
        id: 'puwer',
        title: 'PUWER Verification',
        fields: [
          { id: 'tool_id', label: 'Tool / Machinery ID', type: 'text', required: true },
          { id: 'guards_functional', label: 'Safety Guards & Emergency Stops Functional', type: 'checkbox' },
          { id: 'electrical_pat_valid', label: 'PAT Test / Electrical Certification Current', type: 'checkbox' },
          { id: 'safe_for_use', label: 'Certified Safe for Operational Use', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'js-callout-report',
    category: 'JOB_SERVICE',
    categoryLabel: 'Job & Service',
    title: 'Emergency Callout & Response Report',
    description: 'Out-of-hours response logging, response time verification, and emergency containment.',
    version: '2.0',
    sections: [
      {
        id: 'callout',
        title: 'Callout Log',
        fields: [
          { id: 'call_received_time', label: 'Call Received Timestamp', type: 'text', required: true },
          { id: 'arrival_time', label: 'On-Site Arrival Timestamp', type: 'text', required: true },
          { id: 'emergency_containment', label: 'Emergency Actions Taken to Make Safe', type: 'textarea', required: true },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMMERCIAL DOCUMENTS (10 Standard Suites)
// ─────────────────────────────────────────────────────────────────────────────
const COMMERCIAL_TEMPLATES: BusinessTemplateDefinition[] = [
  {
    id: 'comm-quote',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Quotation / Estimate Form',
    description: 'Itemized pricing breakdown for labour, materials, plant hire, and VAT.',
    version: '2.0',
    sections: [
      {
        id: 'quote_header',
        title: 'Quotation Header',
        fields: [
          { id: 'quote_reference', label: 'Quote Reference', type: 'text', required: true },
          { id: 'client_name', label: 'Client / Account Name', type: 'text', required: true },
          { id: 'scope_summary', label: 'Scope of Quotation', type: 'textarea', required: true },
          { id: 'labour_amount_gbp', label: 'Labour Total (£)', type: 'number', required: true },
          { id: 'materials_amount_gbp', label: 'Materials Total (£)', type: 'number', required: true },
          { id: 'vat_rate_pct', label: 'VAT Rate (%)', type: 'select', options: ['20% Standard', '0% Zero-Rated', '5% Reduced'] },
          { id: 'validity_days', label: 'Validity Period', type: 'select', options: ['30 Days', '60 Days', '90 Days'] },
        ],
      },
    ],
  },
  {
    id: 'comm-variation',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Scope Variation Request',
    description: 'Formal commercial change order requesting approval for additional works or unforeseen parts.',
    version: '2.0',
    sections: [
      {
        id: 'variation',
        title: 'Variation Request',
        fields: [
          { id: 'original_job_ref', label: 'Original Job Reference', type: 'text', required: true },
          { id: 'variation_reason', label: 'Reason for Scope Change / Discovery', type: 'textarea', required: true },
          { id: 'additional_labour_hours', label: 'Additional Labour Hours', type: 'number' },
          { id: 'additional_cost_gbp', label: 'Total Additional Price (£)', type: 'number', required: true },
          { id: 'client_instruction', label: 'Client Authorization Signature / Email Ref', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'comm-purchase-order',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Contractor Purchase Order',
    description: 'Supplier purchasing record for specialized materials, plant hire, and subcontractor packages.',
    version: '1.5',
    sections: [
      {
        id: 'po',
        title: 'Purchase Order Details',
        fields: [
          { id: 'po_number', label: 'PO Reference Number', type: 'text', required: true },
          { id: 'supplier_name', label: 'Supplier / Merchant Name', type: 'text', required: true },
          { id: 'delivery_address', label: 'Delivery Site Address', type: 'text', required: true },
          { id: 'items_ordered', label: 'Item Descriptions & Part Numbers', type: 'textarea', required: true },
          { id: 'total_po_gbp', label: 'Total Agreed PO Amount (£)', type: 'number', required: true },
        ],
      },
    ],
  },
  {
    id: 'comm-invoice-summary',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Invoice-Ready Job Summary',
    description: 'Consolidated commercial close-out with sign-off evidence ready for account billing.',
    version: '2.0',
    sections: [
      {
        id: 'invoice_ready',
        title: 'Commercial Summary',
        fields: [
          { id: 'invoice_ref', label: 'Invoice / Billing Reference', type: 'text', required: true },
          { id: 'po_number', label: 'Client Purchase Order (PO)', type: 'text', required: true },
          { id: 'total_net_gbp', label: 'Net Commercial Total (£)', type: 'number', required: true },
          { id: 'vat_gbp', label: 'VAT Amount (£)', type: 'number', required: true },
          { id: 'total_gross_gbp', label: 'Gross Total (£)', type: 'number', required: true },
        ],
      },
    ],
  },
  {
    id: 'comm-estimate',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Detailed Labour & Material Estimate',
    description: 'Pre-quote internal estimating sheet calculating trade hours, plant hire, and trade margin.',
    version: '1.5',
    sections: [
      {
        id: 'estimate',
        title: 'Cost Estimation',
        fields: [
          { id: 'job_scope', label: 'Project Description', type: 'textarea', required: true },
          { id: 'labour_days', label: 'Estimated Man-Days', type: 'number', required: true },
          { id: 'materials_cost', label: 'Net Materials Cost (£)', type: 'number', required: true },
          { id: 'margin_pct', label: 'Target Margin (%)', type: 'number', required: true },
        ],
      },
    ],
  },
  {
    id: 'comm-job-summary',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Commercial Job Account Closeout',
    description: 'Financial closeout reconciliation comparing estimated cost vs actual expenditure.',
    version: '1.5',
    sections: [
      {
        id: 'summary',
        title: 'Financial Reconciliation',
        fields: [
          { id: 'billed_amount_gbp', label: 'Total Billed Amount (£)', type: 'number', required: true },
          { id: 'actual_cost_gbp', label: 'Total Actual Direct Cost (£)', type: 'number', required: true },
          { id: 'realised_profit_gbp', label: 'Gross Profit Realised (£)', type: 'number', required: true },
        ],
      },
    ],
  },
  {
    id: 'comm-customer-approval',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Customer Works Authorisation',
    description: 'Pre-commencement financial commitment form signed by customer authority.',
    version: '2.0',
    sections: [
      {
        id: 'auth',
        title: 'Authorisation Agreement',
        fields: [
          { id: 'approver_name', label: 'Customer Authority Full Name', type: 'text', required: true },
          { id: 'authorised_cap_gbp', label: 'Authorised Expenditure Cap (£)', type: 'number', required: true },
          { id: 'payment_terms', label: 'Agreed Payment Terms', type: 'select', options: ['30 Days EOM', '14 Days from Invoice', 'Immediate on Completion', '50% Deposit / 50% Handover'] },
        ],
      },
    ],
  },
  {
    id: 'comm-pricing-schedule',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Schedule of Rates & Pricing Breakdown',
    description: 'Contractual schedule of hourly rates, callout fees, and standard part markups.',
    version: '1.5',
    sections: [
      {
        id: 'rates',
        title: 'Rate Card',
        fields: [
          { id: 'standard_hourly_gbp', label: 'Standard Hourly Rate (£/hr)', type: 'number', required: true },
          { id: 'emergency_callout_gbp', label: 'Emergency Callout Fee (£)', type: 'number', required: true },
          { id: 'material_markup_pct', label: 'Material Markup Percentage (%)', type: 'number', required: true },
        ],
      },
    ],
  },
  {
    id: 'comm-credit-note',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Commercial Credit / Correction Note',
    description: 'Accounting adjustment or commercial credit note for returned parts or reduced scope.',
    version: '1.0',
    sections: [
      {
        id: 'credit',
        title: 'Credit Details',
        fields: [
          { id: 'original_inv', label: 'Original Invoice Reference', type: 'text', required: true },
          { id: 'credit_reason', label: 'Reason for Credit Adjustment', type: 'textarea', required: true },
          { id: 'credit_amount_net', label: 'Credit Amount Net (£)', type: 'number', required: true },
        ],
      },
    ],
  },
  {
    id: 'comm-final-handover',
    category: 'COMMERCIAL',
    categoryLabel: 'Commercial Documents',
    title: 'Final Account Agreement',
    description: 'Binding final account settlement and mutual discharge certificate.',
    version: '1.5',
    sections: [
      {
        id: 'settlement',
        title: 'Final Account Settlement',
        fields: [
          { id: 'final_account_total_gbp', label: 'Agreed Final Account Total (£)', type: 'number', required: true },
          { id: 'retention_released_gbp', label: 'Retention Released (£)', type: 'number' },
          { id: 'full_settlement_agreed', label: 'Full & Final Settlement Confirmed by Both Parties', type: 'checkbox' },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. SPECIALIST TRADE SUITES (11 Standard Suites)
// ─────────────────────────────────────────────────────────────────────────────
const SPECIALIST_TRADE_TEMPLATES: BusinessTemplateDefinition[] = [
  // Electrical
  {
    id: 'trade-elec-eicr',
    category: 'SPECIALIST_ELECTRICAL',
    categoryLabel: 'Specialist: Electrical',
    title: 'EICR Periodic Inspection Worksheet',
    description: 'Electrical Installation Condition Report inspection worksheet and observation classification (C1, C2, C3, FI).',
    trade: 'Electrical',
    version: '2.0',
    disclaimer: 'Operational field aid for certified NICEIC / ECA electricians. Formal certificate issued via competent schemes.',
    sections: [
      {
        id: 'eicr_board',
        title: 'Distribution Board & Supply',
        fields: [
          { id: 'db_reference', label: 'Board Identifier (e.g. DB-GF-01)', type: 'text', required: true },
          { id: 'earthing_system', label: 'Supply System Type', type: 'select', options: ['TN-S', 'TN-C-S (PME)', 'TT'] },
          { id: 'ze_ohms', label: 'External Earth Loop Impedance Ze (Ω)', type: 'text' },
          { id: 'rcd_trip_time_ms', label: 'Main RCD Trip Time (ms @ 1x)', type: 'text' },
          { id: 'c1_observations', label: 'C1 Defects (Danger Present)', type: 'textarea' },
          { id: 'c2_observations', label: 'C2 Defects (Potentially Dangerous)', type: 'textarea' },
          { id: 'c3_observations', label: 'C3 Recommendations (Improvement)', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'trade-elec-pat',
    category: 'SPECIALIST_ELECTRICAL',
    categoryLabel: 'Specialist: Electrical',
    title: 'PAT Testing Appliance Log',
    description: 'Portable Appliance Testing record with earth continuity, insulation resistance, and pass/fail tags.',
    trade: 'Electrical',
    version: '2.0',
    sections: [
      {
        id: 'pat_log',
        title: 'Appliance Testing',
        fields: [
          { id: 'total_appliances_tested', label: 'Total Appliances Inspected', type: 'number', required: true },
          { id: 'passed_count', label: 'Total Passed', type: 'number', required: true },
          { id: 'failed_count', label: 'Total Failed & Quarantined', type: 'number', required: true },
          { id: 'retest_period', label: 'Recommended Retest Frequency', type: 'select', options: ['12 Months', '24 Months', '36 Months'] },
        ],
      },
    ],
  },
  {
    id: 'trade-elec-emergency-lighting',
    category: 'SPECIALIST_ELECTRICAL',
    categoryLabel: 'Specialist: Electrical',
    title: 'Emergency Lighting Inspection Record',
    description: 'BS 5266 monthly functional test and annual 3-hour discharge test log.',
    trade: 'Electrical',
    version: '2.0',
    sections: [
      {
        id: 'em_lighting',
        title: 'Emergency Luminaire Testing',
        fields: [
          { id: 'test_duration', label: 'Test Duration Type', type: 'select', options: ['Monthly 10-Minute Flick Test', 'Annual 3-Hour Full Discharge Test'] },
          { id: 'total_luminaires', label: 'Total Fittings Tested', type: 'number', required: true },
          { id: 'failed_batteries', label: 'Defective / Non-Illuminating Fittings', type: 'textarea' },
          { id: 'logbook_signed', label: 'On-Site Paper Logbook Signed', type: 'checkbox' },
        ],
      },
    ],
  },

  // HVAC / Refrigeration
  {
    id: 'trade-hvac-fgas',
    category: 'SPECIALIST_HVAC',
    categoryLabel: 'Specialist: HVAC & Refrigeration',
    title: 'F-Gas Refrigerant Leak Check Record',
    description: 'Statutory F-Gas logbook entry recording refrigerant type, GWP, leak test results, and gas added/recovered.',
    trade: 'HVAC',
    version: '2.0',
    disclaimer: 'Compliant with UK F-Gas Regulation 517/2014. Must be executed by F-Gas Category 1 operative.',
    sections: [
      {
        id: 'fgas_details',
        title: 'Refrigerant Record',
        fields: [
          { id: 'system_id', label: 'Chiller / AC System Reference', type: 'text', required: true },
          { id: 'refrigerant_type', label: 'Refrigerant Gas', type: 'select', options: ['R410A', 'R32', 'R134a', 'R407C', 'R448A', 'R449A', 'R744 (CO2)'] },
          { id: 'factory_charge_kg', label: 'Nominal Charge (kg)', type: 'number', required: true },
          { id: 'leak_detected', label: 'Leak Found During Inspection', type: 'select', options: ['NO — Leak Free', 'YES — Leak Identified & Repaired', 'YES — Isolated Pending Repair'] },
          { id: 'gas_added_kg', label: 'Refrigerant Added (kg)', type: 'number' },
          { id: 'gas_recovered_kg', label: 'Refrigerant Recovered (kg)', type: 'number' },
          { id: 'f_gas_cert_number', label: 'Operative F-Gas Certificate Number', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-hvac-service',
    category: 'SPECIALIST_HVAC',
    categoryLabel: 'Specialist: HVAC & Refrigeration',
    title: 'AHU & Ventilation Service Sheet',
    description: 'Air Handling Unit belt tension, coil sanitisation, damper operation, and differential pressure checks.',
    trade: 'HVAC',
    version: '2.0',
    sections: [
      {
        id: 'ahu_service',
        title: 'Ventilation Checks',
        fields: [
          { id: 'ahu_reference', label: 'AHU Identifier', type: 'text', required: true },
          { id: 'belts_replaced', label: 'Drive Belts Replaced / Tensioned', type: 'checkbox' },
          { id: 'coils_chemically_cleaned', label: 'Cooling / Heating Coils Sanitised', type: 'checkbox' },
          { id: 'filter_status', label: 'Panel & Bag Filters Status', type: 'select', options: ['New Filters Fitted', 'Cleaned & Replaced', 'Replacement Required on Return'] },
          { id: 'condensate_drain_clear', label: 'Condensate Tray & Trap Flushed', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-hvac-chiller',
    category: 'SPECIALIST_HVAC',
    categoryLabel: 'Specialist: HVAC & Refrigeration',
    title: 'Chiller Seasonal Maintenance Log',
    description: 'Evaporator/condenser approach temperatures, oil pressure, and seasonal glycol testing.',
    trade: 'HVAC',
    version: '1.5',
    sections: [
      {
        id: 'chiller',
        title: 'Chiller Diagnostics',
        fields: [
          { id: 'chiller_ref', label: 'Chiller ID / Make', type: 'text', required: true },
          { id: 'glycol_freeze_pt_c', label: 'Glycol Freeze Point (°C)', type: 'number', required: true },
          { id: 'oil_level_ok', label: 'Compressor Oil Level & Pressure Verified', type: 'checkbox' },
          { id: 'approach_temp_c', label: 'Evaporator Approach Temp (°C)', type: 'number' },
        ],
      },
    ],
  },

  // Fire & Life Safety
  {
    id: 'trade-fire-alarm',
    category: 'SPECIALIST_FIRE',
    categoryLabel: 'Specialist: Fire & Life Safety',
    title: 'Fire Alarm Test & Inspection Log',
    description: 'BS 5839 weekly call point test and quarterly service record with panel battery voltage.',
    trade: 'Fire Safety',
    version: '2.0',
    sections: [
      {
        id: 'fire_test',
        title: 'Alarm Testing Details',
        fields: [
          { id: 'panel_location', label: 'Main Control Panel Location', type: 'text', required: true },
          { id: 'call_points_tested', label: 'Manual Call Point Numbers Tested', type: 'text', required: true },
          { id: 'sounder_audibility', label: 'Sounder Audibility Confirmed Throughout', type: 'checkbox' },
          { id: 'battery_standby_volts', label: 'Standby Battery Voltage (V DC)', type: 'text' },
          { id: 'arc_signalling_verified', label: 'Alarm Receiving Centre (ARC) Transmission Verified', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-fire-door',
    category: 'SPECIALIST_FIRE',
    categoryLabel: 'Specialist: Fire & Life Safety',
    title: 'Fire Door Inspection Record',
    description: 'FD30/FD60 gap tolerance, intumescent seal condition, self-closer operation, and certification tag check.',
    trade: 'Fire Safety',
    version: '2.0',
    sections: [
      {
        id: 'fire_door',
        title: 'Door Set Checks',
        fields: [
          { id: 'door_number', label: 'Door Location / Code', type: 'text', required: true },
          { id: 'perimeter_gaps_3_4mm', label: 'Perimeter Gaps Within 2-4mm Tolerance', type: 'checkbox' },
          { id: 'intumescent_seals_intact', label: 'Intumescent & Smoke Seals Undamaged', type: 'checkbox' },
          { id: 'self_closer_engages', label: 'Self-Closer Fully Latches Door from Any Angle', type: 'checkbox' },
          { id: 'signage_compliant', label: '"Fire Door Keep Shut" Signage Fitted', type: 'checkbox' },
        ],
      },
    ],
  },

  // Plumbing & Mechanical
  {
    id: 'trade-plumb-boiler',
    category: 'SPECIALIST_PLUMBING',
    categoryLabel: 'Specialist: Plumbing & Heating',
    title: 'Commercial Boiler Combustion Record',
    description: 'Combustion flue gas analysis (O2, CO, CO2, Ratio), burner inspection, and gas tightness test.',
    trade: 'Plumbing',
    version: '2.0',
    sections: [
      {
        id: 'boiler_combustion',
        title: 'Combustion Analysis',
        fields: [
          { id: 'boiler_make_model', label: 'Boiler Make / Model', type: 'text', required: true },
          { id: 'gas_safe_reg_number', label: 'Engineer Gas Safe Licence Number', type: 'text', required: true },
          { id: 'co_ppm', label: 'Carbon Monoxide (CO ppm)', type: 'text' },
          { id: 'co2_pct', label: 'Carbon Dioxide (CO2 %)', type: 'text' },
          { id: 'ratio_reading', label: 'CO/CO2 Ratio (e.g. 0.0004)', type: 'text' },
          { id: 'gas_tightness_passed', label: 'Gas Tightness Test Passed (0.0 mbar drop)', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-plumb-tmv',
    category: 'SPECIALIST_PLUMBING',
    categoryLabel: 'Specialist: Plumbing & Heating',
    title: 'TMV Fail-Safe & Temperature Inspection',
    description: 'Thermostatic Mixing Valve mixed outlet temperature, blend testing, and fail-safe shut-off verification.',
    trade: 'Plumbing',
    version: '2.0',
    sections: [
      {
        id: 'tmv_checks',
        title: 'TMV Inspection',
        fields: [
          { id: 'valve_location', label: 'TMV Identifier / Location', type: 'text', required: true },
          { id: 'hot_inlet_temp_c', label: 'Hot Supply Temp (°C ≥ 50°C)', type: 'number' },
          { id: 'cold_inlet_temp_c', label: 'Cold Supply Temp (°C ≤ 20°C)', type: 'number' },
          { id: 'blended_outlet_temp_c', label: 'Mixed Water Temp (°C 38-43°C)', type: 'number', required: true },
          { id: 'failsafe_shutoff_passed', label: 'Cold Supply Isolation Fail-Safe Passed', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-elec-minor-works',
    category: 'SPECIALIST_ELECTRICAL',
    categoryLabel: 'Specialist: Electrical',
    title: 'Electrical Minor Works Certificate',
    description: 'BS 7671 minor electrical installation works certificate for additions or alterations without new circuits.',
    trade: 'Electrical',
    version: '2.0',
    disclaimer: 'Operational field aid for certified electricians. Issued in compliance with BS 7671 Part 7.',
    sections: [
      {
        id: 'minor_works_details',
        title: 'Work Description & Circuit Details',
        fields: [
          { id: 'circuit_modified', label: 'Circuit Description / Identifier', type: 'text', required: true },
          { id: 'db_ref', label: 'Distribution Board Ref', type: 'text', required: true },
          { id: 'protective_device_type', label: 'Protective Device Type & Rating', type: 'select', options: ['BS EN 60898 Type B (6A-32A)', 'BS EN 60898 Type C (10A-63A)', 'BS 88 Fuse', 'RCBO 30mA Type A'] },
          { id: 'zs_ohms', label: 'Measured Earth Fault Loop Impedance Zs (Ω)', type: 'text', required: true },
          { id: 'insulation_resistance_mohm', label: 'Insulation Resistance (MΩ @ 500V DC)', type: 'text', required: true },
          { id: 'polarity_confirmed', label: 'Polarity Verified Satisfactory', type: 'checkbox', required: true },
          { id: 'work_completed_desc', label: 'Detailed Description of Minor Works', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-elec-db-board',
    category: 'SPECIALIST_ELECTRICAL',
    categoryLabel: 'Specialist: Electrical',
    title: 'Distribution Board Schedule & Inspection',
    description: 'Circuit schedule verification, phase balancing, torque checks, and thermal scan logging.',
    trade: 'Electrical',
    version: '2.0',
    sections: [
      {
        id: 'db_board_inspection',
        title: 'Board Schedule & Condition',
        fields: [
          { id: 'board_id', label: 'Board Identifier & Location', type: 'text', required: true },
          { id: 'ways_total', label: 'Total Board Ways', type: 'number', required: true },
          { id: 'ways_spare', label: 'Spare Available Ways', type: 'number' },
          { id: 'terminal_torque_checked', label: 'Terminal Screws Checked & Torqued', type: 'checkbox' },
          { id: 'phase_balance_l1_a', label: 'Phase L1 Current (A)', type: 'number' },
          { id: 'phase_balance_l2_a', label: 'Phase L2 Current (A)', type: 'number' },
          { id: 'phase_balance_l3_a', label: 'Phase L3 Current (A)', type: 'number' },
          { id: 'thermal_scan_anomalies', label: 'Thermal Imaging Hotspots Observed', type: 'select', options: ['NO — Thermal profile normal', 'YES — Elevated terminal temp detected'] },
        ],
      },
    ],
  },
  {
    id: 'trade-elec-install-checklist',
    category: 'SPECIALIST_ELECTRICAL',
    categoryLabel: 'Specialist: Electrical',
    title: 'Electrical Installation Pre-Commissioning Checklist',
    description: 'Containment, cable sizing, glanding, earthing bonding, and pre-energisation checklist.',
    trade: 'Electrical',
    version: '1.5',
    sections: [
      {
        id: 'install_checks',
        title: 'Physical & Containment Inspection',
        fields: [
          { id: 'cable_spec_verified', label: 'Cable Type & Cross-Section Matches Design', type: 'checkbox', required: true },
          { id: 'containment_supported', label: 'Tray/Trunking Supported within Spans', type: 'checkbox', required: true },
          { id: 'main_bonding_connected', label: 'Main Protective Bonding to Water/Gas Verified', type: 'checkbox', required: true },
          { id: 'cpc_continuity', label: 'Circuit Protective Conductor Continuity Confirmed', type: 'checkbox', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-hvac-refrigeration',
    category: 'SPECIALIST_HVAC',
    categoryLabel: 'Specialist: HVAC & Refrigeration',
    title: 'Commercial Refrigeration Inspection & Log',
    description: 'Cold room, freezer, and cellar cooling operating temperatures, defrost cycles, and condenser airflow.',
    trade: 'HVAC',
    version: '2.0',
    sections: [
      {
        id: 'refrig_details',
        title: 'Refrigeration System Operation',
        fields: [
          { id: 'unit_name', label: 'Coldroom / Freezer Unit ID', type: 'text', required: true },
          { id: 'target_temp_c', label: 'Target Setpoint Temp (°C)', type: 'number', required: true },
          { id: 'actual_box_temp_c', label: 'Actual Measured Room Temp (°C)', type: 'number', required: true },
          { id: 'defrost_heater_checked', label: 'Defrost Cycle & Heater Tested Operative', type: 'checkbox' },
          { id: 'evaporator_fan_ok', label: 'Evaporator Fans Free-Spinning & Clean', type: 'checkbox' },
          { id: 'door_gaskets_intact', label: 'Door Magnetic Gaskets & Heated Seals Intact', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-hvac-ahu-checklist',
    category: 'SPECIALIST_HVAC',
    categoryLabel: 'Specialist: HVAC & Refrigeration',
    title: 'AHU Comprehensive Mechanical Inspection Checklist',
    description: 'Detailed AHU fan vibration, bearing greasing, static pressure drops, actuator stroke, and heater batteries.',
    trade: 'HVAC',
    version: '2.0',
    sections: [
      {
        id: 'ahu_mechanical',
        title: 'Mechanical Drive & Actuators',
        fields: [
          { id: 'fan_bearings_greased', label: 'Fan & Motor Bearings Greased', type: 'checkbox' },
          { id: 'damper_actuators_stroked', label: 'Fresh Air / Recirc Dampers Full Stroke Tested', type: 'checkbox' },
          { id: 'filter_dp_pa', label: 'Differential Pressure Across Filters (Pa)', type: 'number' },
          { id: 'frost_stat_tested', label: 'Frost Protection Thermostat Trip Tested', type: 'checkbox' },
          { id: 'drive_pulley_alignment', label: 'Pulleys Laser Aligned & Belt Tension Set', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-hvac-commissioning',
    category: 'SPECIALIST_HVAC',
    categoryLabel: 'Specialist: HVAC & Refrigeration',
    title: 'HVAC System Commissioning & Airflow Balance',
    description: 'Volumetric air volume flow rates (m3/s), diffuser anemometer readings, and water balancing commissioning log.',
    trade: 'HVAC',
    version: '2.0',
    sections: [
      {
        id: 'hvac_comm',
        title: 'Airflow & Water Balance Data',
        fields: [
          { id: 'system_ref', label: 'Commissioning System Tag', type: 'text', required: true },
          { id: 'design_airflow_m3s', label: 'Design Air Volume (m³/s)', type: 'number', required: true },
          { id: 'actual_airflow_m3s', label: 'Measured Total Air Volume (m³/s)', type: 'number', required: true },
          { id: 'flow_deviation_pct', label: 'Balancing Deviation (%)', type: 'number' },
          { id: 'proportional_balance_complete', label: 'Proportional Balancing to CIBSE Code A Completed', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-fire-extinguisher',
    category: 'SPECIALIST_FIRE',
    categoryLabel: 'Specialist: Fire & Life Safety',
    title: 'Portable Fire Extinguisher Inspection Log',
    description: 'BS 5306 annual extinguisher service, gauge pressure, safety pin, weight check, and bracket security.',
    trade: 'Fire Safety',
    version: '2.0',
    sections: [
      {
        id: 'extinguisher_log',
        title: 'Extinguisher Inspection Details',
        fields: [
          { id: 'total_extinguishers_checked', label: 'Total Extinguishers Inspected', type: 'number', required: true },
          { id: 'water_foam_co2_powder', label: 'Media Types Serviced', type: 'select', options: ['CO2 & Water', 'Foam & CO2', 'Dry Powder & Wet Chemical', 'Mixed Suite'] },
          { id: 'safety_pins_tamper_seals_ok', label: 'All Safety Pins & Tamper Seals Replaced', type: 'checkbox', required: true },
          { id: 'gauge_pressures_green', label: 'All Pressure Gauges in Green Operating Zone', type: 'checkbox' },
          { id: 'condemned_units_count', label: 'Units Condemned / Due Extended Service', type: 'number' },
        ],
      },
    ],
  },
  {
    id: 'trade-fire-safety-inspection',
    category: 'SPECIALIST_FIRE',
    categoryLabel: 'Specialist: Fire & Life Safety',
    title: 'Comprehensive Fire Safety & Escape Route Audit',
    description: 'Regulatory Reform (Fire Safety) Order 2005 escape routes, emergency signage, final exit push bars, and compartmentalisation.',
    trade: 'Fire Safety',
    version: '2.0',
    sections: [
      {
        id: 'fire_safety_audit',
        title: 'Escape Routes & Compartmentation',
        fields: [
          { id: 'escape_routes_clear', label: 'All Primary & Secondary Escape Routes Completely Clear', type: 'checkbox', required: true },
          { id: 'final_exit_push_bars_ok', label: 'Panic Push Bars on Final Exit Doors Tested Operative', type: 'checkbox', required: true },
          { id: 'fire_action_notices_posted', label: 'Fire Action Notices Displayed at Every Call Point', type: 'checkbox' },
          { id: 'combustibles_in_plantrooms', label: 'Plantrooms Free of Flammable / Combustible Storage', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-fire-alarm-service',
    category: 'SPECIALIST_FIRE',
    categoryLabel: 'Specialist: Fire & Life Safety',
    title: 'Fire Alarm Quarterly Periodic Service Record',
    description: 'BS 5839-1 comprehensive quarterly maintenance, smoke/heat detector polling, cause & effect verification.',
    trade: 'Fire Safety',
    version: '2.0',
    sections: [
      {
        id: 'fire_alarm_quarterly',
        title: 'Periodic Testing & Cause and Effect',
        fields: [
          { id: 'panel_manufacturer', label: 'Panel Model & Loop Count', type: 'text', required: true },
          { id: 'detectors_tested_sample_pct', label: 'Sample Detectors Smoke/Heat Tested (%)', type: 'select', options: ['25% (Quarterly standard)', '50%', '100% (Annual completion)'] },
          { id: 'auxiliary_relays_tested', label: 'Door Release / Gas Valve / AHU Shutdown Relays Tested', type: 'checkbox' },
          { id: 'faults_cleared', label: 'All Panel Earth/Loop Faults Resolved', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-gas-safety-record',
    category: 'SPECIALIST_PLUMBING',
    categoryLabel: 'Specialist: Plumbing & Heating',
    title: 'Gas Safety Inspection & Tightness Record',
    description: 'Gas Safety (Installation and Use) Regulations 1998 commercial soundness test, purge, and emergency control valve inspection.',
    trade: 'Gas',
    version: '2.0',
    sections: [
      {
        id: 'gas_safety',
        title: 'Gas Tightness & Emergency Controls',
        fields: [
          { id: 'gas_meter_location', label: 'Gas Meter & ECV Location', type: 'text', required: true },
          { id: 'installation_pipework_soundness', label: 'Soundness Test (No pressure drop over 2 mins)', type: 'checkbox', required: true },
          { id: 'emergency_isolation_valve_accessible', label: 'AIV / Solenoid Valve Closes on Emergency Stop', type: 'checkbox', required: true },
          { id: 'gas_leak_detection_operational', label: 'Gas Proving / Interlock System Functional', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-gas-commercial-service',
    category: 'SPECIALIST_PLUMBING',
    categoryLabel: 'Specialist: Plumbing & Heating',
    title: 'Commercial Gas Appliance Service Sheet',
    description: 'Warm air unit, radiant tube, or boiler burner pressure, flame rectification, and safety interlock service.',
    trade: 'Gas',
    version: '2.0',
    sections: [
      {
        id: 'gas_appliance_service',
        title: 'Burner & Safety Controls',
        fields: [
          { id: 'appliance_tag', label: 'Appliance ID / Model', type: 'text', required: true },
          { id: 'burner_pressure_mbar', label: 'Working Burner Pressure (mbar)', type: 'number' },
          { id: 'flame_failure_device_sec', label: 'Flame Failure Response Time (seconds)', type: 'number', required: true },
          { id: 'ventilation_free_area_cm2', label: 'High & Low Level Permanent Ventilation Checked', type: 'checkbox' },
        ],
      },
    ],
  },
  {
    id: 'trade-plumb-inspection',
    category: 'SPECIALIST_PLUMBING',
    categoryLabel: 'Specialist: Plumbing & Heating',
    title: 'Plumbing & Public Health Installation Survey',
    description: 'Backflow prevention (RPZ valves), booster pump set pressure, and drainage sanitaryware inspection.',
    trade: 'Plumbing',
    version: '1.5',
    sections: [
      {
        id: 'plumb_public_health',
        title: 'Water Supply & Pressure Assets',
        fields: [
          { id: 'booster_set_pressure_bar', label: 'Cold Water Booster Set Operating Pressure (bar)', type: 'number' },
          { id: 'rpz_valves_tested', label: 'RPZ Backflow Prevention Tested & Tagged', type: 'checkbox' },
          { id: 'drainage_traps_holding', label: 'All Floor Gully & Waste Traps Holding Water Seal', type: 'checkbox' },
          { id: 'expansion_vessel_precharge_bar', label: 'Expansion Vessel Air Charge (bar)', type: 'number' },
        ],
      },
    ],
  },
  {
    id: 'trade-plumb-water-hygiene',
    category: 'SPECIALIST_PLUMBING',
    categoryLabel: 'Specialist: Plumbing & Heating',
    title: 'Water Hygiene & Legionella Flushing Log',
    description: 'ACOP L8 weekly sentinel outlet temperatures, calorifier flow/return checks, and little-used outlet flushing.',
    trade: 'Plumbing',
    version: '2.0',
    sections: [
      {
        id: 'water_hygiene',
        title: 'Sentinel Temperature Monitoring',
        fields: [
          { id: 'calorifier_flow_temp_c', label: 'Calorifier Flow Temp (°C ≥ 60°C)', type: 'number', required: true },
          { id: 'calorifier_return_temp_c', label: 'Calorifier Return Temp (°C ≥ 50°C)', type: 'number', required: true },
          { id: 'sentinel_hot_outlet_c', label: 'Sentinel Hot Outlet Temp (°C after 1 min ≥ 50°C)', type: 'number', required: true },
          { id: 'sentinel_cold_outlet_c', label: 'Sentinel Cold Outlet Temp (°C after 2 mins ≤ 20°C)', type: 'number', required: true },
          { id: 'stagnant_outlets_flushed', label: 'All Identified Little-Used Outlets Flushed (3 mins)', type: 'checkbox', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-plumb-tmv-service',
    category: 'SPECIALIST_PLUMBING',
    categoryLabel: 'Specialist: Plumbing & Heating',
    title: 'TMV Annual Descale & Strainer Service',
    description: 'Thermostatic mixing valve cartridge removal, chemical descaling, internal strainer cleaning, and thermal recalibration.',
    trade: 'Plumbing',
    version: '2.0',
    sections: [
      {
        id: 'tmv_service_deep',
        title: 'Servicing & Descale Details',
        fields: [
          { id: 'tmv_location_tag', label: 'TMV Valve Reference & Room', type: 'text', required: true },
          { id: 'cartridge_descaled', label: 'Thermostatic Cartridge Removed & Descaled', type: 'checkbox', required: true },
          { id: 'strainers_cleaned', label: 'Inlet Mesh Strainers Cleared & Replaced', type: 'checkbox', required: true },
          { id: 'check_valves_operating', label: 'Integral Non-Return Check Valves Verified', type: 'checkbox' },
          { id: 'recalibrated_temp_c', label: 'Final Setpoint Mixed Temp (°C 41°C)', type: 'number', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-height-harness',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Specialist: Working at Height',
    title: 'Safety Harness & Fall Arrest Inspection Log',
    description: 'BS EN 361 full body harness 6-monthly thorough examination, webbing stitching, D-rings, and lanyard shock absorber check.',
    trade: 'Working at Height',
    version: '2.0',
    sections: [
      {
        id: 'harness_inspection',
        title: 'PPE Examination Details',
        fields: [
          { id: 'serial_number_mfg_date', label: 'Harness Serial Number & Date of Manufacture', type: 'text', required: true },
          { id: 'webbing_cuts_abrasions', label: 'Webbing Free from Cuts, Chemical Degradation & UV Fraying', type: 'checkbox', required: true },
          { id: 'd_rings_karabiners_ok', label: 'Metal D-Rings & Karabiner Screw Gates Free from Cracking/Rust', type: 'checkbox', required: true },
          { id: 'shock_absorber_intact', label: 'Lanyard Shock Absorber Tear-Pack Intact (No deployment)', type: 'checkbox', required: true },
          { id: 'pass_fail_quarantine', label: 'Statutory Inspection Result', type: 'select', options: ['PASSED — Safe for Work at Height', 'FAILED — Quarantined & Cut for Disposal'] },
        ],
      },
    ],
  },
  {
    id: 'trade-height-rescue-plan',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Specialist: Working at Height',
    title: 'Working at Height Emergency Rescue Plan',
    description: 'Work at Height Regulations 2005 emergency suspension trauma prevention, rescue kit type, and anchor point location.',
    trade: 'Working at Height',
    version: '2.0',
    sections: [
      {
        id: 'height_rescue',
        title: 'Emergency Rescue Arrangements',
        fields: [
          { id: 'rescue_kit_location', label: 'Gotcha / Rescue Kit Exact Location', type: 'text', required: true },
          { id: 'primary_rescuer_name', label: 'Trained Lead Rescuer on Site', type: 'text', required: true },
          { id: 'emergency_anchor_point', label: 'Rated Certified Anchor Point Identified', type: 'text', required: true },
          { id: 'max_rescue_time_minutes', label: 'Target Casual Retrieval Time (< 10 mins for suspension trauma)', type: 'number', required: true },
          { id: 'dial_999_protocol_briefed', label: 'Emergency Services Egress Point Briefed to Team', type: 'checkbox', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-confined-space-assessment',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Specialist: Confined Space',
    title: 'Confined Space Entry Risk Assessment',
    description: 'Confined Spaces Regulations 1997 atmospheric hazard scoring, continuous gas monitor calibration, and ventilation plan.',
    trade: 'Confined Space',
    version: '2.0',
    sections: [
      {
        id: 'confined_space_ra',
        title: 'Atmospheric & Ingress Hazards',
        fields: [
          { id: 'space_classification', label: 'Confined Space Category', type: 'select', options: ['Low Risk (Natural ventilation, shallow pit)', 'Medium Risk (Forced mechanical air, gas monitoring)', 'High Risk (Breathing apparatus, complex geometry)'] },
          { id: 'gas_detector_calibrated', label: '4-Gas Monitor Bump Tested & Calibrated Today (O2, H2S, CO, LEL)', type: 'checkbox', required: true },
          { id: 'forced_ventilation_required', label: 'Continuous Forced Air Ventilation Unit Positioned', type: 'checkbox' },
          { id: 'topman_safety_watcher_name', label: 'Dedicated Top-Man / Sentry Name (Never leaves opening)', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-confined-space-rescue',
    category: 'HEALTH_SAFETY',
    categoryLabel: 'Specialist: Confined Space',
    title: 'Confined Space Rescue & Evacuation Plan',
    description: 'Tripod, winch, emergency escape breathing apparatus (EEBA 10/15 min), and rescue protocol.',
    trade: 'Confined Space',
    version: '2.0',
    sections: [
      {
        id: 'confined_space_rescue_plan',
        title: 'Extraction & Emergency Equipment',
        fields: [
          { id: 'tripod_winch_inspected', label: 'Man-Riding Tripod & Fall Arrest Winch Inspected Today', type: 'checkbox', required: true },
          { id: 'eeba_sets_available', label: 'Emergency Escape Breathing Apparatus (EEBA) Checked (10-15 min sets)', type: 'checkbox', required: true },
          { id: 'communication_method', label: 'Top-Man to Entrant Communication Method', type: 'select', options: ['Direct Voice / Line of Sight', 'Intrinsically Safe ATEX Radios', 'Tug Line Signals'] },
          { id: 'nearest_a_and_e_hospital', label: 'Designated Nearest Hospital with Trauma Facility', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'trade-building-fabric',
    category: 'SPECIALIST_BUILDING',
    categoryLabel: 'Specialist: Building Fabric',
    title: 'Building Fabric & Roof Condition Survey',
    description: 'Cladding, roof membrane, rainwater gutters, and glazing integrity inspection.',
    trade: 'Building',
    version: '1.5',
    sections: [
      {
        id: 'fabric',
        title: 'Envelope & Roof Survey',
        fields: [
          { id: 'roof_membrane_condition', label: 'Roof Membrane Integrity', type: 'select', options: ['Good — No Ponding or Defects', 'Fair — Minor Silt / Clear Drains', 'Poor — Blistering / Water Ingress'] },
          { id: 'gutters_flushed', label: 'Gutters & Downpipes Cleared & Free Flowing', type: 'checkbox' },
          { id: 'glazing_seals_intact', label: 'Glazing Gaskets & Sealants Undamaged', type: 'checkbox' },
          { id: 'structural_notes', label: 'Observed Cracking or Movement Notes', type: 'textarea' },
        ],
      },
    ],
  },
];

export const ALL_BUSINESS_TEMPLATES: BusinessTemplateDefinition[] = [
  ...HEALTH_SAFETY_TEMPLATES,
  ...JOB_SERVICE_TEMPLATES,
  ...COMMERCIAL_TEMPLATES,
  ...SPECIALIST_TRADE_TEMPLATES,
];

const TEMPLATE_ALIASES: Record<string, string> = {
  'hs-rams': 'hs-rams-unified',
  'job-service-report': 'js-service-report',
  'job-completion-cert': 'js-completion-report',
  'js-completion-cert': 'js-completion-report',
  'comm-quotation': 'comm-quote',
  'trade-fire-alarm': 'trade-fire-alarm-service',
  'trade-gas-safety': 'trade-gas-safety-record',
  'trade-plumb-tmv': 'trade-plumb-tmv-service',
};

export function getTemplateById(templateId: string): BusinessTemplateDefinition | undefined {
  const normalizedId = TEMPLATE_ALIASES[templateId] || templateId;
  return ALL_BUSINESS_TEMPLATES.find((t) => t.id === normalizedId);
}

export function getTemplatesByCategory(category?: string): BusinessTemplateDefinition[] {
  if (!category || category === 'ALL') return ALL_BUSINESS_TEMPLATES;
  return ALL_BUSINESS_TEMPLATES.filter((t) => t.category === category);
}
