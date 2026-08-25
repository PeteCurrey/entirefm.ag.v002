/**
 * ENTIREFM TELEMETRY — METRIC REGISTRY (Phase 0L)
 * ================================================
 * Canonical metric definitions and unit conversion registry.
 */

import type { MetricCode, MetricDefinition, UnitConversion } from './types';

export const METRIC_REGISTRY: MetricDefinition[] = [
  {
    code: 'TEMPERATURE',
    canonical_unit: '°C',
    valid_min: -50,
    valid_max: 150,
    asset_classes: null,
    description: 'General temperature',
    quality_rules: [
      { rule: 'flatline_window_seconds', value: 3600 },
      { rule: 'rate_of_change_max_per_minute', value: 10 },
    ],
    source_mapping: {
      bacnet: ['TemperatureInput', 'AI-TEMP', 'TEMP'],
      mqtt: ['temp', 'temperature', 'temp_c'],
    },
    is_active: true,
  },
  {
    code: 'SUPPLY_TEMPERATURE',
    canonical_unit: '°C',
    valid_min: -20,
    valid_max: 100,
    asset_classes: ['HVAC', 'CHILLER', 'BOILER', 'AHU'],
    description: 'Supply air or water temperature',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 3600 }],
    source_mapping: {
      bacnet: ['AI-SUPPLY-TEMP', 'SupplyTemperature'],
      mqtt: ['supply_temp', 'sa_temp'],
    },
    is_active: true,
  },
  {
    code: 'RETURN_TEMPERATURE',
    canonical_unit: '°C',
    valid_min: -20,
    valid_max: 100,
    asset_classes: ['HVAC', 'CHILLER', 'BOILER', 'AHU'],
    description: 'Return air or water temperature',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 3600 }],
    source_mapping: {
      bacnet: ['AI-RETURN-TEMP', 'ReturnTemperature'],
      mqtt: ['return_temp', 'ra_temp'],
    },
    is_active: true,
  },
  {
    code: 'PRESSURE',
    canonical_unit: 'kPa',
    valid_min: 0,
    valid_max: 2000,
    asset_classes: null,
    description: 'General pressure',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 1800 }],
    source_mapping: { bacnet: ['AI-PRESSURE', 'PressureInput'], mqtt: ['pressure', 'press'] },
    is_active: true,
  },
  {
    code: 'DIFFERENTIAL_PRESSURE',
    canonical_unit: 'kPa',
    valid_min: 0,
    valid_max: 500,
    asset_classes: ['HVAC', 'PUMP', 'FILTER'],
    description: 'Differential pressure across component',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 1800 }],
    source_mapping: { bacnet: ['AI-DP', 'DiffPressure'], mqtt: ['diff_press', 'dp'] },
    is_active: true,
  },
  {
    code: 'FLOW_RATE',
    canonical_unit: 'm³/h',
    valid_min: 0,
    valid_max: 9999,
    asset_classes: ['PUMP', 'HVAC', 'CHILLER'],
    description: 'Volumetric flow rate',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 3600 }],
    source_mapping: { bacnet: ['AI-FLOW', 'FlowRate'], mqtt: ['flow', 'flow_rate'] },
    is_active: true,
  },
  {
    code: 'VIBRATION_RMS',
    canonical_unit: 'mm/s',
    valid_min: 0,
    valid_max: 200,
    asset_classes: ['PUMP', 'FAN', 'MOTOR', 'COMPRESSOR'],
    description: 'Root mean square vibration velocity',
    quality_rules: [
      { rule: 'flatline_window_seconds', value: 600 },
      { rule: 'rate_of_change_max_per_minute', value: 50 },
    ],
    source_mapping: { mqtt: ['vibration', 'vib_rms', 'vibration_rms'] },
    is_active: true,
  },
  {
    code: 'CURRENT',
    canonical_unit: 'A',
    valid_min: 0,
    valid_max: 1000,
    asset_classes: null,
    description: 'Electrical current draw',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 900 }],
    source_mapping: { bacnet: ['AI-CURRENT', 'CurrentInput'], mqtt: ['current', 'amps'] },
    is_active: true,
  },
  {
    code: 'VOLTAGE',
    canonical_unit: 'V',
    valid_min: 0,
    valid_max: 500,
    asset_classes: null,
    description: 'Supply voltage',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 900 }],
    source_mapping: { bacnet: ['AI-VOLTAGE', 'VoltageInput'], mqtt: ['voltage', 'volts'] },
    is_active: true,
  },
  {
    code: 'POWER',
    canonical_unit: 'W',
    valid_min: 0,
    valid_max: 500000,
    asset_classes: null,
    description: 'Electrical power consumption',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 900 }],
    source_mapping: { bacnet: ['AI-POWER', 'PowerInput'], mqtt: ['power', 'watts', 'power_w'] },
    is_active: true,
  },
  {
    code: 'ENERGY',
    canonical_unit: 'kWh',
    valid_min: 0,
    valid_max: null,
    asset_classes: null,
    description: 'Cumulative energy consumption',
    quality_rules: [],
    source_mapping: { bacnet: ['AI-ENERGY', 'EnergyAccumulator'], mqtt: ['energy', 'kwh'] },
    is_active: true,
  },
  {
    code: 'HUMIDITY',
    canonical_unit: '%',
    valid_min: 0,
    valid_max: 100,
    asset_classes: ['HVAC', 'AHU'],
    description: 'Relative humidity',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 3600 }],
    source_mapping: { bacnet: ['AI-HUMIDITY', 'HumidityInput'], mqtt: ['humidity', 'rh'] },
    is_active: true,
  },
  {
    code: 'CO2',
    canonical_unit: 'ppm',
    valid_min: 0,
    valid_max: 5000,
    asset_classes: ['HVAC', 'AHU'],
    description: 'Carbon dioxide concentration',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 3600 }],
    source_mapping: { bacnet: ['AI-CO2', 'CO2Input'], mqtt: ['co2', 'carbon_dioxide'] },
    is_active: true,
  },
  {
    code: 'FAN_SPEED',
    canonical_unit: 'RPM',
    valid_min: 0,
    valid_max: 9999,
    asset_classes: ['FAN', 'AHU', 'HVAC'],
    description: 'Fan rotational speed',
    quality_rules: [{ rule: 'flatline_window_seconds', value: 600 }],
    source_mapping: { bacnet: ['AI-FAN-SPEED', 'FanSpeed'], mqtt: ['fan_speed', 'rpm'] },
    is_active: true,
  },
  {
    code: 'VALVE_POSITION',
    canonical_unit: '%',
    valid_min: 0,
    valid_max: 100,
    asset_classes: ['HVAC', 'CHILLER', 'AHU'],
    description: 'Valve open position (0=closed, 100=open)',
    quality_rules: [],
    source_mapping: { bacnet: ['AO-VALVE', 'ValvePosition'], mqtt: ['valve', 'valve_pos'] },
    is_active: true,
  },
  {
    code: 'COMPRESSOR_RUN_STATE',
    canonical_unit: 'bool',
    valid_min: 0,
    valid_max: 1,
    asset_classes: ['CHILLER', 'HVAC', 'REFRIGERATION'],
    description: 'Compressor running state (0=off, 1=on)',
    quality_rules: [],
    source_mapping: { bacnet: ['BI-COMPRESSOR', 'CompressorStatus'], mqtt: ['comp_run', 'compressor'] },
    is_active: true,
  },
  {
    code: 'RUNTIME_HOURS',
    canonical_unit: 'h',
    valid_min: 0,
    valid_max: null,
    asset_classes: null,
    description: 'Cumulative runtime hours',
    quality_rules: [],
    source_mapping: { bacnet: ['AI-RUNTIME', 'RuntimeAccumulator'], mqtt: ['runtime', 'run_hours'] },
    is_active: true,
  },
  {
    code: 'START_COUNT',
    canonical_unit: 'count',
    valid_min: 0,
    valid_max: null,
    asset_classes: null,
    description: 'Cumulative start/stop cycle count',
    quality_rules: [],
    source_mapping: { bacnet: ['AI-STARTS', 'StartAccumulator'], mqtt: ['starts', 'start_count'] },
    is_active: true,
  },
  {
    code: 'FAULT_CODE',
    canonical_unit: 'code',
    valid_min: null,
    valid_max: null,
    asset_classes: null,
    description: 'Manufacturer fault/alarm code',
    quality_rules: [],
    source_mapping: { bacnet: ['MSV-FAULT', 'FaultStatus'], mqtt: ['fault', 'fault_code', 'alarm'] },
    is_active: true,
  },
  {
    code: 'TEMPERATURE_DELTA',
    canonical_unit: '°C',
    valid_min: -100,
    valid_max: 100,
    asset_classes: ['HVAC', 'CHILLER', 'BOILER'],
    description: 'Computed temperature differential',
    quality_rules: [],
    source_mapping: {},
    is_active: true,
  },
];

export function getMetricByCode(code: MetricCode): MetricDefinition | undefined {
  return METRIC_REGISTRY.find(m => m.code === code && m.is_active);
}

export const UNIT_CONVERSIONS: UnitConversion[] = [
  {
    from_unit: '°F',
    to_unit: '°C',
    formula: '(value - 32) × 5/9',
    convert: (v: number) => ((v - 32) * 5) / 9,
  },
  {
    from_unit: 'F',
    to_unit: '°C',
    formula: '(value - 32) × 5/9',
    convert: (v: number) => ((v - 32) * 5) / 9,
  },
  {
    from_unit: 'K',
    to_unit: '°C',
    formula: 'value - 273.15',
    convert: (v: number) => v - 273.15,
  },
  {
    from_unit: 'kW',
    to_unit: 'W',
    formula: 'value × 1000',
    convert: (v: number) => v * 1000,
  },
  {
    from_unit: 'MW',
    to_unit: 'W',
    formula: 'value × 1000000',
    convert: (v: number) => v * 1_000_000,
  },
  {
    from_unit: 'Pa',
    to_unit: 'kPa',
    formula: 'value / 1000',
    convert: (v: number) => v / 1000,
  },
  {
    from_unit: 'bar',
    to_unit: 'kPa',
    formula: 'value × 100',
    convert: (v: number) => v * 100,
  },
  {
    from_unit: 'psi',
    to_unit: 'kPa',
    formula: 'value × 6.89476',
    convert: (v: number) => v * 6.89476,
  },
  {
    from_unit: 'mbar',
    to_unit: 'kPa',
    formula: 'value / 10',
    convert: (v: number) => v / 10,
  },
  {
    from_unit: 'l/s',
    to_unit: 'm³/h',
    formula: 'value × 3.6',
    convert: (v: number) => v * 3.6,
  },
  {
    from_unit: 'l/min',
    to_unit: 'm³/h',
    formula: 'value × 0.06',
    convert: (v: number) => v * 0.06,
  },
  {
    from_unit: 'gal/min',
    to_unit: 'm³/h',
    formula: 'value × 0.227125',
    convert: (v: number) => v * 0.227125,
  },
  {
    from_unit: 'Wh',
    to_unit: 'kWh',
    formula: 'value / 1000',
    convert: (v: number) => v / 1000,
  },
  {
    from_unit: 'MWh',
    to_unit: 'kWh',
    formula: 'value × 1000',
    convert: (v: number) => v * 1000,
  },
  {
    from_unit: 'in/s',
    to_unit: 'mm/s',
    formula: 'value × 25.4',
    convert: (v: number) => v * 25.4,
  },
];

export function findConversion(
  fromUnit: string,
  toUnit: string
): UnitConversion | null {
  if (fromUnit === toUnit) return null;
  return (
    UNIT_CONVERSIONS.find(
      c => c.from_unit === fromUnit && c.to_unit === toUnit
    ) ?? null
  );
}

export function resolveSourceMapping(
  sourceCode: string,
  connectorType: string
): MetricCode | null {
  const normalised = sourceCode.toLowerCase().trim();
  const connector = connectorType.toLowerCase();
  for (const metric of METRIC_REGISTRY) {
    const mappings: string[] =
      (metric.source_mapping as Record<string, string[]>)[connector] ?? [];
    if (mappings.some(m => m.toLowerCase() === normalised)) {
      return metric.code;
    }
  }
  return null;
}
