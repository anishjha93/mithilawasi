/**
 * Utility to generate and download a standard .ics (iCalendar) file
 * directly in the browser. Fits 100% within the Cloudflare Pages free tier.
 */
export function downloadFestivalICS(name: string, dateStr: string, desc?: string) {
  if (typeof window === 'undefined' || !dateStr) return;

  const dateObj = new Date(dateStr);
  const yearStr = dateObj.getFullYear().toString();
  const monthStr = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const dayStr = dateObj.getDate().toString().padStart(2, '0');
  const startStamp = `${yearStr}${monthStr}${dayStr}`;

  // For all-day events, the end date is the next day
  const nextDate = new Date(dateObj);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextYearStr = nextDate.getFullYear().toString();
  const nextMonthStr = (nextDate.getMonth() + 1).toString().padStart(2, '0');
  const nextDayStr = nextDate.getDate().toString().padStart(2, '0');
  const endStamp = `${nextYearStr}${nextMonthStr}${nextDayStr}`;

  const creationDate = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const cleanName = name.replace(/,/g, '\\,');
  const cleanDesc = (desc || name).replace(/,/g, '\\,').replace(/\n/g, '\\n');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mithilawasi//Panchang Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${dateStr}_${name.replace(/[^a-zA-Z0-9]/g, '')}@mithilawasi.com`,
    `DTSTAMP:${creationDate}`,
    `DTSTART;VALUE=DATE:${startStamp}`,
    `DTEND;VALUE=DATE:${endStamp}`,
    `SUMMARY:${cleanName}`,
    `DESCRIPTION:${cleanDesc}`,
    'LOCATION:Mithilanchal',
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const icsString = icsLines.join('\r\n');
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${name.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
