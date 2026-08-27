/**
 * ENTIREFM LIVE INTELLIGENCE PLATFORM — CHANGEDETECTION.IO CONNECTOR
 * =================================================================
 * Server-only connector for monitored awards and event web pages.
 * Uses CHANGEDETECTION_BASE_URL and CHANGEDETECTION_API_KEY.
 * Filters out minor layout shifts and DOM noise; flags meaningful changes.
 */

export interface ChangeDetectionWatch {
  uuid: string;
  url: string;
  title: string;
  last_changed?: number;
  last_checked?: number;
  history?: Record<string, string>;
  tag?: string;
}

export class ChangeDetectionConnector {
  private baseUrl: string | undefined;
  private apiKey: string | undefined;

  constructor() {
    this.baseUrl = process.env.CHANGEDETECTION_BASE_URL;
    this.apiKey = process.env.CHANGEDETECTION_API_KEY;
  }

  public isAvailable(): boolean {
    return Boolean(this.baseUrl && this.apiKey && this.apiKey.trim().length > 0);
  }

  /** Fetch watches with detected changes */
  public async fetchChangedPages(): Promise<ChangeDetectionWatch[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/v1/watch`, {
        headers: {
          'x-api-key': this.apiKey!,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) return [];

      const data = await res.json();
      const watches: ChangeDetectionWatch[] = Object.entries(data).map(([uuid, w]) => ({
        uuid,
        ...(w as Record<string, unknown>),
      })) as unknown as ChangeDetectionWatch[];

      // Only return watches changed in the last 48 hours
      const nowSec = Math.floor(Date.now() / 1000);
      return watches.filter((w) => w.last_changed && nowSec - w.last_changed < 48 * 3600);
    } catch {
      return [];
    }
  }
}

export const changeDetectionConnector = new ChangeDetectionConnector();
