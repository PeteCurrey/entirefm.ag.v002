import type { RouteRecord, ContentRecord } from '@/lib/routes/route-schema';

export interface TemplateProps {
  route: RouteRecord;
  content: ContentRecord;
}
