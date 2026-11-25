// Dates are handled as UTC midnight so weekdays don't shift with the viewer's timezone.
export const DAY_MS = 86400000;
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const day = (s: string) => new Date(s + "T00:00:00Z");
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY_MS);
export const monthYear = (d: Date) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
