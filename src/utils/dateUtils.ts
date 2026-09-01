/**
 * Robust date formatting utilities for Ayvalık Rotası.
 * All formatters use Europe/Istanbul timezone to prevent hydration mismatches.
 */

const TIMEZONE = "Europe/Istanbul";
const LOCALE = "tr-TR";

/**
 * Safely parse a date string. Returns null if input is null, undefined, or invalid.
 */
function safeParse(date: string | null | undefined): Date | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d;
}

/**
 * Format: "5 Ağustos 2026"
 */
export function formatDateFull(date: string | null | undefined): string | null {
  const d = safeParse(date);
  if (!d) return null;
  return d.toLocaleDateString(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TIMEZONE,
  });
}

/**
 * Format: "5 Ağu" or "5 Ağu 2027" (appends year if different from current)
 */
export function formatDateShort(date: string | null | undefined): { day: string; month: string; yearLabel: string } | null {
  const d = safeParse(date);
  if (!d) return null;
  const currentYear = new Date().getFullYear();
  const eventYear = d.getFullYear();
  return {
    day: d.toLocaleDateString(LOCALE, { day: "numeric", timeZone: TIMEZONE }),
    month: d.toLocaleDateString(LOCALE, { month: "short", timeZone: TIMEZONE }),
    yearLabel: eventYear !== currentYear ? ` ${eventYear}` : "",
  };
}

/**
 * Format: "14:30"
 */
export function formatTime(date: string | null | undefined): string | null {
  const d = safeParse(date);
  if (!d) return null;
  return d.toLocaleTimeString(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });
}

/**
 * Check if a date is in the past (compared to now).
 */
export function isPastDate(date: string | null | undefined): boolean {
  const d = safeParse(date);
  if (!d) return false;
  return d.getTime() < Date.now();
}
