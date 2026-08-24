import React from 'react';
import PPMAutopilotClient from './PPMAutopilotClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'PPM Autopilot Control Desk | EntireCAFM',
  description: 'Autonomous statutory maintenance planning and SFG20 optimization across commercial estates.',
};

export default function PPMAutopilotPage() {
  return <PPMAutopilotClient />;
}
