/**
 * ENTIREFM ACADEMY SEED CURRICULUM & ASSESSMENTS
 * ===============================================
 * Production-quality FM learning paths with real engineering curricula
 * and rigorous gated assessments for UK facilities management professionals.
 */

import { LearningPath, Assessment } from './types';

export const SEED_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-compliance-lead',
    slug: 'compliance-lead',
    title: 'UK Statutory Compliance & Duty Holder Certification',
    description: 'Master legal liabilities, the Responsible Person framework, Fire Safety Act 2021 mandates, Legionella ACOP L8, and fixed wire periodic inspection regimes across commercial estates.',
    targetRole: 'Compliance Lead',
    passMarkPercent: 80,
    status: 'published',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    modules: [
      {
        id: 'mod-comp-01',
        order: 1,
        title: 'Health & Safety at Work Act 1974 & The Statutory Duty Holder Framework',
        durationMinutes: 25,
        summary: 'Understand the legal hierarchy of responsibility from landlord and managing agent down to facilities director under Sections 2, 3, 4, and 37 of HASAWA.',
        keyTopics: [
          'Section 2 & 3 general duties towards employees and non-employees',
          'Section 37 individual liability of directors and senior managers',
          'Vicarious liability and contractor delegation boundaries',
          'Crown commercial property and multi-tenanted estate obligations',
        ],
        readingContent: `
### Executive Summary
Under the Health and Safety at Work etc. Act 1974 (HASAWA), statutory duty holder status cannot be contracted out. Whilst managing agents and facilities management contractors can be delegated operational tasks, ultimate criminal liability rests with the duty holder — typically the building owner, landlord, or the corporate employer controlling premises.

### Sections 2, 3, and 4 Responsibilities
- **Section 2:** General duty of every employer to ensure, so far as is reasonably practicable, the health, safety, and welfare of all their employees.
- **Section 3:** Duty of employers and self-employed persons to ensure that persons not in their employment who may be affected are not thereby exposed to risks.
- **Section 4:** Imposes explicit duties on persons who have control of premises (e.g. Landlords, Managing Agents, Facilities Managers) towards people who are not their employees but use non-domestic premises as a place of work.

### Section 37 Personal Liability
Section 37 states that where an offence committed by a body corporate is proved to have been committed with the consent or connivance of, or to have been attributable to any neglect on the part of, any director, manager, secretary or other similar officer, that individual as well as the body corporate is guilty of that offence.
        `,
      },
      {
        id: 'mod-comp-02',
        order: 2,
        title: 'Fire Safety: Regulatory Reform Order 2005 & Fire Safety Act 2021',
        durationMinutes: 30,
        summary: 'Deep-dive into the legal definition of the Responsible Person, Fire Risk Assessment (FRA) validity, external wall structures, and fire door maintenance mandates.',
        keyTopics: [
          'Definition and legal obligations of the Responsible Person',
          'Fire Safety Act 2021: external walls, flat entrance doors, and common parts',
          'Review triggers for Fire Risk Assessments (FRAs)',
          'Daily, weekly, monthly, and annual statutory testing protocols (BS 5839 / BS 5266)',
        ],
        readingContent: `
### The Responsible Person Under the RRO 2005
Under the Regulatory Reform (Fire Safety) Order 2005 (RRO), the "Responsible Person" is the employer if the workplace is to any extent under their control, or the person who has control of the premises in connection with carrying on a trade, business or other undertaking.

### Key Provisions of the Fire Safety Act 2021
The Fire Safety Act 2021 clarifies that where a building contains two or more sets of domestic premises, the RRO applies to:
1. The building's structure and external walls and any common parts (including cladding, balconies, windows, and insulation).
2. All doors between the domestic premises and common parts (e.g. flat entrance fire doors).

### Fire Risk Assessment (FRA) Validity
An FRA is not a static document. It must be reviewed regularly, and specifically:
- When there is reason to suspect that it is no longer valid.
- If there has been a significant change in the matters to which it relates (e.g. building alterations, change of occupancy, installation of new high-load equipment).
        `,
      },
      {
        id: 'mod-comp-03',
        order: 3,
        title: 'Water Hygiene, Legionella Control & HSE ACOP L8 Compliance',
        durationMinutes: 35,
        summary: 'Technical and administrative control of water systems: risk assessments, temperature regimes, sentinel outlets, TMV failsafes, and microbiological sampling.',
        keyTopics: [
          'ACOP L8 four key pillars: Risk assessment, scheme of control, appointed competent person, and records',
          'Temperature monitoring standards: Hot water storage (>60°C), distribution (>50°C), cold storage (<20°C)',
          'Dead legs, dead ends, and weekly little-used outlet flushing regimes',
          'Thermostatic Mixing Valve (TMV) annual failsafe servicing and calibration',
        ],
        readingContent: `
### The Four Pillars of ACOP L8
1. **Identify and assess sources of risk:** A comprehensive Legionella Risk Assessment conducted by a competent water hygiene consultant.
2. **Prepare a scheme for preventing or controlling risk:** Documenting exact temperature regimes, biocidal treatment, cleaning schedules, and maintenance actions.
3. **Implement, manage and monitor precautions:** Appointing a designated Responsible Person and deputy with suitable technical competence.
4. **Keep records:** Retaining all inspection logs, temperature records, cleaning certificates, and test results for a statutory minimum of 5 years.

### Temperature Regimes (HSG274 Part 2)
- **Calorifier / Hot Water Storage:** Stored at a minimum of 60°C throughout the vessel.
- **Hot Water Distribution:** Flow temperature at principal loop return minimum 50°C (55°C in healthcare environments). Hot water sentinel tap reaching 50°C within 1 minute of opening.
- **Cold Water Storage & Distribution:** Storage cisterns and sentinel taps must register below 20°C after running for 2 minutes.
        `,
      },
      {
        id: 'mod-comp-04',
        order: 4,
        title: 'Fixed Electrical (BS 7671), Gas Safety & Pressure Systems (PSSR)',
        durationMinutes: 30,
        summary: 'Statutory periodic inspection intervals for electrical installations, commercial gas boilers, and pressurized vessels.',
        keyTopics: [
          'Electrical Installation Condition Report (EICR) 5-year maximum commercial intervals',
          'Classification of electrical observations: C1 (Danger Present), C2 (Potentially Dangerous), C3 (Improvement Recommended), FI (Further Investigation)',
          'Gas Safety (Installation and Use) Regulations 1998 commercial boiler CP17 certification',
          'Pressure Systems Safety Regulations 2000 (PSSR) Written Scheme of Examination',
        ],
        readingContent: `
### Fixed Electrical Wiring & EICR (BS 7671)
Commercial premises generally require an Electrical Installation Condition Report (EICR) at intervals not exceeding 5 years, or at change of tenancy. An installation is graded "Unsatisfactory" if even a single Code C1, Code C2, or Code FI is recorded:
- **Code C1:** Danger present. Risk of injury. Immediate remedial action required.
- **Code C2:** Potentially dangerous. Urgent remedial action required.
- **Code C3:** Improvement recommended. Does not render report unsatisfactory.
- **Code FI:** Further investigation required without delay. Renders report unsatisfactory.

### Pressure Systems Safety Regulations 2000 (PSSR)
Heating system expansion vessels, steam boilers, and compressed air receivers operating at pressure > 0.5 bar must have a certified Written Scheme of Examination (WSE) established by an independent Competent Person before first operation.
        `,
      },
    ],
  },
  {
    id: 'path-ppm-specialist',
    slug: 'ppm-specialist',
    title: 'Planned Preventative Maintenance & SFG20 Specialist',
    description: 'Master commercial asset classification, SFG20 task scheduling, condition-based vibration analysis, and verification of contractor work orders.',
    targetRole: 'PPM Specialist',
    passMarkPercent: 80,
    status: 'published',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    modules: [
      {
        id: 'mod-ppm-01',
        order: 1,
        title: 'Asset Registers, Equipment Hierarchies & Uniclass Standards',
        durationMinutes: 20,
        summary: 'Establishing clean asset taxonomies from building level down to serviceable component, maintaining parent-child relationships in CAFM.',
        keyTopics: [
          'SFG20 equipment codes and Uniclass 2015 tables (Pr, Ss, Ef)',
          'Parent-child hierarchy: Site -> Building -> Floor -> Space -> System -> Asset -> Component',
          'Digital asset tagging (QR, RFID, NFC) and mobile scanning ingestion',
          'Asset criticality matrices (Critical, Essential, Non-Essential)',
        ],
        readingContent: `
### Building the Digital Asset Register
An effective asset register is the foundation of facilities management. Without an accurate hierarchy, work order dispatch and lifecycle costing fail. Assets must be catalogued hierarchically to prevent orphan assets and duplicate maintenance visits.
        `,
      },
      {
        id: 'mod-ppm-02',
        order: 2,
        title: 'SFG20 Maintenance Schedules & Frequency Engineering',
        durationMinutes: 30,
        summary: 'Differentiating statutory (Red), business-critical (Pink), and optimal (Green) tasks under SFG20 standards.',
        keyTopics: [
          'The colour-coded SFG20 methodology: Statutory vs Non-Statutory',
          'Aligning manufacturer warranty requirements with industry standard frequencies',
          'Seasonal PPM balancing to level maintenance technician capacity',
          'F-Gas regulation leak check frequencies based on GWP CO2 equivalent tonnes',
        ],
        readingContent: `
### The SFG20 Standard
SFG20 is the recognised industry standard for building maintenance specifications. It defines precise task instructions, required skill sets, and frequencies across more than 1,200 maintenance task schedules.
        `,
      },
    ],
  },
  {
    id: 'path-mobilisation-lead',
    slug: 'mobilisation-lead',
    title: 'Commercial Contract Mobilisation & Asset Handover',
    description: 'Execute rigorous FM mobilisations: TUPE transfers, statutory baseline gap analysis, O&M digital audits, and contractor SLA structures.',
    targetRole: 'Mobilisation Lead',
    passMarkPercent: 85,
    status: 'published',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    modules: [
      {
        id: 'mod-mob-01',
        order: 1,
        title: 'TUPE Regulations, Staff Consultation & Handover Protocol',
        durationMinutes: 30,
        summary: 'Navigate Transfer of Undertakings (Protection of Employment) 2006 statutory timeframes, employee liability information, and onboarding.',
        keyTopics: [
          'Statutory 28-day Employee Liability Information (ELI) receipt threshold',
          'Consultation obligations with employee representatives',
          'Pensions, life assurance, and continuity of service continuity protections',
          'Day 1 uniform, equipment, tool auditing, and induction protocols',
        ],
        readingContent: `
### The TUPE Framework
Under the Transfer of Undertakings (Protection of Employment) Regulations 2006 (as amended 2014), the outgoing contractor must provide Employee Liability Information (ELI) to the incoming contractor at least 28 days before the transfer date.
        `,
      },
      {
        id: 'mod-mob-02',
        order: 2,
        title: 'Statutory Baseline Audits & First 100 Days Defect Capture',
        durationMinutes: 35,
        summary: 'Auditing physical compliance records, O&M manuals, and CAFM data to establish an undisputed baseline upon contract commencement.',
        keyTopics: [
          'Pre-contract condition survey and dilapidation risk assessment',
          'Immediate statutory compliance gap identification (Fire, Water, Lift, Gas, Electric)',
          'Establishing the Initial Defect Register to shield against historic liabilities',
          'Client governance and weekly mobilisation milestone reporting',
        ],
        readingContent: `
### Initial Defect Liability Insulation
Incoming facilities contractors must conduct a comprehensive baseline compliance audit within the first 30 days of contract commencement. Any non-compliant plant or missing statutory documentation discovered must be logged in the Baseline Defect Register to prevent inherited civil and criminal liability.
        `,
      },
    ],
  },
];

export const SEED_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-compliance-lead',
    pathId: 'path-compliance-lead',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    questions: [
      {
        id: 'q-cl-01',
        prompt: 'Under Section 37 of the Health and Safety at Work etc. Act 1974, under what circumstances can an individual Director or Senior Manager face personal prosecution?',
        options: [
          { id: 'opt-a', label: 'Only if the company is officially declared insolvent or liquidated.' },
          { id: 'opt-b', label: 'Where a health and safety offence by the body corporate is proved to have been committed with their consent, connivance, or neglect.' },
          { id: 'opt-c', label: 'Only if the individual was physically present at the scene of the incident.' },
          { id: 'opt-d', label: 'Directors cannot be personally prosecuted under UK criminal health and safety law; only the corporate entity is liable.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Section 37 HASAWA 1974 provides for personal criminal liability of directors and officers where corporate offences involve consent, connivance, or neglect.',
      },
      {
        id: 'q-cl-02',
        prompt: 'Under the Fire Safety Act 2021, which elements of a multi-occupancy residential or mixed-use building are explicitly confirmed as falling under the scope of the Regulatory Reform (Fire Safety) Order 2005?',
        options: [
          { id: 'opt-a', label: 'Only the communal ground floor reception and central stairwell.' },
          { id: 'opt-b', label: 'The external walls (including cladding, balconies, and fixtures) and individual entrance doors leading onto common areas.' },
          { id: 'opt-c', label: 'Only the heating plant rooms and roof access voids.' },
          { id: 'opt-d', label: 'Only furniture provided by the landlord within tenanted demises.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'The Fire Safety Act 2021 explicitly clarified that external walls (cladding, insulation, balconies) and flat entrance doors to common parts fall under the RRO 2005.',
      },
      {
        id: 'q-cl-03',
        prompt: 'In accordance with HSE ACOP L8 and HSG274 Part 2, what is the required temperature threshold for cold water storage cisterns and cold sentinel outlets?',
        options: [
          { id: 'opt-a', label: 'Must remain below 20°C (tested at sentinel taps after running for 2 minutes).' },
          { id: 'opt-b', label: 'Must remain between 22°C and 25°C.' },
          { id: 'opt-c', label: 'Must be heated to 40°C twice weekly to purge bacteria.' },
          { id: 'opt-d', label: 'Cold water temperature has no statutory threshold under HSE guidelines.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'Under HSE ACOP L8, cold water storage and distribution must remain strictly below 20°C to inhibit Legionella growth (20°C–45°C is the proliferation zone).',
      },
      {
        id: 'q-cl-04',
        prompt: 'An Electrical Installation Condition Report (EICR) for a commercial building yields several observations. Which observation code(s) will result in the overall report being graded as "Unsatisfactory"?',
        options: [
          { id: 'opt-a', label: 'Only Code C1 (Danger Present).' },
          { id: 'opt-b', label: 'Only Code C3 (Improvement Recommended).' },
          { id: 'opt-c', label: 'Any Code C1, Code C2 (Potentially Dangerous), or Code FI (Further Investigation required).' },
          { id: 'opt-d', label: 'An EICR is only graded Unsatisfactory if all distribution boards fail thermal testing.' },
        ],
        correctOptionId: 'opt-c',
        explanation: 'Under BS 7671, an electrical installation is formally classified as Unsatisfactory if any C1, C2, or FI condition exists.',
      },
      {
        id: 'q-cl-05',
        prompt: 'Under the Pressure Systems Safety Regulations 2000 (PSSR), what legal documentation must be in place before operating commercial pressurized heating boilers above 0.5 bar?',
        options: [
          { id: 'opt-a', label: 'A verbal sign-off from the lead gas installer.' },
          { id: 'opt-b', label: 'A certified Written Scheme of Examination (WSE) established by a Competent Person.' },
          { id: 'opt-c', label: 'An annual water hardness certificate from the municipal utility.' },
          { id: 'opt-d', label: 'No documentation is required unless the vessel operates above 5.0 bar.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'PSSR Regulation 8 mandates that a user of a pressure system operating above 0.5 bar must have a certified Written Scheme of Examination in place prior to operation.',
      },
    ],
  },
  {
    id: 'assess-ppm-specialist',
    pathId: 'path-ppm-specialist',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    questions: [
      {
        id: 'q-ppm-01',
        prompt: 'What is the primary role of the SFG20 Red (Statutory) task category in maintenance scheduling?',
        options: [
          { id: 'opt-a', label: 'Recommended aesthetic tasks to preserve manufacturer warranties.' },
          { id: 'opt-b', label: 'Mandatory legal obligations required by UK statutes and safety regulations.' },
          { id: 'opt-c', label: 'Optional energy efficiency enhancements.' },
          { id: 'opt-d', label: 'Emergency call-out procedures for out-of-hours reactive jobs.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'In SFG20, Red indicates statutory compliance tasks required by UK law, where failure to complete breaches statutory regulations.',
      },
      {
        id: 'q-ppm-02',
        prompt: 'Under the EU/UK F-Gas Regulations, leak check intervals on commercial refrigeration systems are determined by which metric?',
        options: [
          { id: 'opt-a', label: 'The physical weight in kilograms of refrigerant alone.' },
          { id: 'opt-b', label: 'The CO2 equivalent tonnes (calculated from charge weight multiplied by Global Warming Potential).' },
          { id: 'opt-c', label: 'The age of the compressor.' },
          { id: 'opt-d', label: 'The ambient roof temperature.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'F-Gas testing intervals (e.g. 5, 50, 500 tonnes CO2e) are based on the GWP-weighted CO2 equivalent calculation.',
      },
    ],
  },
  {
    id: 'assess-mobilisation-lead',
    pathId: 'path-mobilisation-lead',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
    questions: [
      {
        id: 'q-mob-01',
        prompt: 'Under the TUPE Regulations 2006 (as amended 2014), what is the statutory deadline for the outgoing contractor to supply Employee Liability Information (ELI) to the incoming contractor?',
        options: [
          { id: 'opt-a', label: 'On the morning of the contract commencement date.' },
          { id: 'opt-b', label: 'At least 28 days before the transfer date.' },
          { id: 'opt-c', label: 'Within 6 months after the contract commencement.' },
          { id: 'opt-d', label: '7 days before the transfer date.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Under TUPE 2006 (amended 2014), the outgoing employer must provide ELI at least 28 days before the transfer.',
      },
      {
        id: 'q-mob-02',
        prompt: 'During commercial contract mobilisation, what is the key legal purpose of an Initial Baseline Compliance Defect Register?',
        options: [
          { id: 'opt-a', label: 'To claim VAT refunds from HMRC.' },
          { id: 'opt-b', label: 'To formally log pre-existing statutory non-compliances so the incoming contractor is not held liable for historic failures.' },
          { id: 'opt-c', label: 'To terminate the client contract immediately.' },
          { id: 'opt-d', label: 'To replace the need for an annual building insurance survey.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'The baseline defect register protects the incoming contractor by creating an audited, agreed record of pre-existing statutory breaches.',
      },
    ],
  },
];
