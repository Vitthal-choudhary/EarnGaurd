// Utility functions for consistent date formatting across server and client
// Uses UTC to avoid hydration mismatches

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatTime(date: Date): string {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
}

export function formatTimeShort(date: Date): string {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function formatDateShort(date: Date): string {
  const day = date.getUTCDate();
  const month = MONTHS_SHORT[date.getUTCMonth()];
  return `${day} ${month}`;
}

export function formatDateLong(date: Date): string {
  const day = date.getUTCDate();
  const month = MONTHS_LONG[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateFull(date: Date): string {
  const dayName = DAYS_SHORT[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = MONTHS_SHORT[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

export function formatDateTime(date: Date): string {
  return `${formatDateFull(date)} at ${formatTimeShort(date)}`;
}

// For displaying "Last updated" time - use a fixed format
export function formatLastUpdated(): string {
  // Return a static string to avoid hydration issues
  // The actual "live" update should happen client-side only
  return "just now";
}
