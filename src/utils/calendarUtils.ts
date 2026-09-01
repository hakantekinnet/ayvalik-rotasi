/**
 * Calendar utility functions for generating Google Calendar URLs
 * and .ics file content for Apple Calendar / Outlook.
 */

// Format a Date to UTC string: YYYYMMDDTHHmmssZ
function formatDateToUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const h = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

export interface CalendarEventInput {
  title: string;
  description?: string;
  startsAt: string; // ISO 8601
  endsAt?: string; // ISO 8601
  location?: string;
}

/**
 * Generate a Google Calendar "Add Event" URL.
 */
export function generateGoogleCalendarUrl(event: CalendarEventInput): string {
  const start = formatDateToUTC(new Date(event.startsAt));
  // Default to 2 hours after start if no end time
  const endDate = event.endsAt
    ? new Date(event.endsAt)
    : new Date(new Date(event.startsAt).getTime() + 2 * 60 * 60 * 1000);
  const end = formatDateToUTC(endDate);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
  });

  if (event.description) {
    params.set("details", event.description);
  }
  if (event.location) {
    params.set("location", `${event.location}, Ayvalık, Balıkesir`);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate .ics file content string for Apple Calendar / Outlook.
 */
export function generateIcsContent(event: CalendarEventInput): string {
  const start = formatDateToUTC(new Date(event.startsAt));
  const endDate = event.endsAt
    ? new Date(event.endsAt)
    : new Date(new Date(event.startsAt).getTime() + 2 * 60 * 60 * 1000);
  const end = formatDateToUTC(endDate);

  // Escape special chars in iCal values
  const escapeIcal = (str: string) =>
    str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ayvalık Rotası//Event//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcal(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcal(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeIcal(`${event.location}, Ayvalık, Balıkesir`)}`);
  }

  lines.push(
    `DTSTAMP:${formatDateToUTC(new Date())}`,
    `UID:${Date.now()}@ayvalikrotasi.com`,
    "END:VEVENT",
    "END:VCALENDAR"
  );

  return lines.join("\r\n");
}

/**
 * Trigger .ics file download in the browser.
 */
export function downloadIcsFile(event: CalendarEventInput): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "ayvalik-event.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
