/**
 * RFC 5545 iCalendar (.ics) generator for buyer check-in milestones
 */

export interface CalendarReminderParams {
  title: string;
  description: string;
  startDate: Date;
  durationHours?: number;
  location?: string;
  url?: string;
}

function formatDateToICS(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function generateCalendarReminder(params: CalendarReminderParams): string {
  const durationMs = (params.durationHours ?? 1) * 60 * 60 * 1000;
  const endDate = new Date(params.startDate.getTime() + durationMs);

  const dtStart = formatDateToICS(params.startDate);
  const dtEnd = formatDateToICS(endDate);
  const dtStamp = formatDateToICS(new Date());
  const uid = `toyotawaits-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@toyotawaits.ca`;

  // Escape special chars in text fields
  const cleanSummary = params.title.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  const cleanDescription = params.description.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  const cleanLocation = (params.location || 'Dealership / Phone').replace(/[,;\\]/g, '\\$&');
  const cleanUrl = params.url || 'https://toyotawaits.ca';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ToyotaWaits.ca//Canadian Delivery Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}\\n\\nTrack live Canadian wait times: ${cleanUrl}`,
    `LOCATION:${cleanLocation}`,
    `URL:${cleanUrl}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Toyota delivery waitlist check-in',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadCalendarEvent(icsContent: string, filename = 'toyotawaits-reminder.ics'): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
