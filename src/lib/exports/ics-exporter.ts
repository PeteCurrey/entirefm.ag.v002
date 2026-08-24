/**
 * RFC 5545 iCALENDAR (.ics) EXPORTER
 * ==================================
 * Generates standards-compliant iCalendar files with pre-event VALARM reminders.
 */

export interface CalendarExportEvent {
  id: string;
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  durationMinutes?: number;
  reminderDaysBefore?: number;
  categories?: string[];
}

function formatIcsDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

export function generateIcsCalendar(
  calendarName: string,
  events: CalendarExportEvent[]
): string {
  const now = new Date();
  const dtstamp = formatIcsDate(now);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EntireFM//FM Planning Toolkit//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    'X-WR-TIMEZONE:Europe/London',
  ];

  for (const event of events) {
    const start = event.startDate;
    const durationMin = event.durationMinutes || 60;
    const end = new Date(start.getTime() + durationMin * 60 * 1000);
    const reminderDays = event.reminderDaysBefore !== undefined ? event.reminderDaysBefore : 7;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${escapeIcsText(event.id)}@entirefm.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(event.title)}`,
      `DESCRIPTION:${escapeIcsText(event.description)}`
    );

    if (event.location) {
      lines.push(`LOCATION:${escapeIcsText(event.location)}`);
    }

    if (event.categories && event.categories.length > 0) {
      lines.push(`CATEGORIES:${escapeIcsText(event.categories.join(','))}`);
    }

    // RFC 5545 VALARM for 7-day advance reminder
    if (reminderDays > 0) {
      lines.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:Statutory FM Reminder: ${escapeIcsText(event.title)} due in ${reminderDays} days`,
        `TRIGGER:-P${reminderDays}D`,
        'END:VALARM'
      );
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

export function downloadIcsFile(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
