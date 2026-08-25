/**
 * ENTIREFM DRONE SERVICES CONTENT REGISTRY
 * =========================================
 * Aggregated dictionary of all 12 Drone Services content records.
 */

import type { ContentRecord } from '@/lib/routes/route-schema';
import { droneHubRecord } from './hub';
import { droneSubservicesRecords } from './subservices';

export const DRONE_SERVICES_CONTENT: Record<string, ContentRecord> = {
  [droneHubRecord.path]: droneHubRecord,
  ...droneSubservicesRecords,
};

export { droneHubRecord, droneSubservicesRecords };
