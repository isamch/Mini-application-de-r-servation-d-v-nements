/**
* Date Formatting Helper
*
* @description
* Utility functions for formatting dates.
*/
export class DateHelper {
/**
* Format date to ISO string
*/
  static toISO(date: Date): string {
    return date.toISOString();
}

/**
* Format date to readable string
* Example: "2024-12-24 15:30:00"
*/
static toReadable(date: Date): string {
return date.toISOString().replace('T', ' ').substring(0, 19);
}

/**
* Format date to date only
* Example: "2024-12-24"
*/
static toDateOnly(date: Date): string {
return date.toISOString().substring(0, 10);
}

/**
* Format date to time only
* Example: "15:30:00"
*/
static toTimeOnly(date: Date): string {
return date.toISOString().substring(11, 19);
}

/**
* Get relative time
* Example: "2 hours ago", "in 3 days"
*/
static getRelativeTime(date: Date): string {
const now = new Date();
const diff = now.getTime() - date.getTime();
const seconds = Math.floor(Math.abs(diff) / 1000);
const minutes = Math.floor(seconds / 60);
const hours = Math.floor(minutes / 60);
const days = Math.floor(hours / 24);

const isPast = diff > 0;
const prefix = isPast ? '' : 'in ';
const suffix = isPast ? ' ago' : '';

if (days > 0) return `${prefix}${days} day${days > 1 ? 's' : ''}${suffix}`;
if (hours > 0) return `${prefix}${hours} hour${hours > 1 ? 's' : ''}${suffix}`;
if (minutes > 0) return `${prefix}${minutes} minute${minutes > 1 ? 's' : ''}${suffix}`;
return `${prefix}${seconds} second${seconds > 1 ? 's' : ''}${suffix}`;
}
}