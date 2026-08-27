/**
 * ENTIREFM HELPDESK EXCEPTION DESK — UI PAGE (Phase 0M)
 * ======================================================
 * Server component wrapper for the AI Helpdesk exception queue.
 * Routes to the client component which renders the live exception desk.
 */

import { Metadata } from 'next';
import HelpdeskExceptionDeskClient from './HelpdeskExceptionDeskClient';

export const metadata: Metadata = {
  title: 'AI Helpdesk — Exception Desk | EntireFM Operations',
  description: 'AI-assisted helpdesk exception queue and contractor dispatch management',
};

export default function HelpdeskExceptionDeskPage() {
  return <HelpdeskExceptionDeskClient />;
}
