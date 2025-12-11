/**
 * Formats a Date object to a human-readable string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

/**
 * Formats a numeric time value with "hrs" unit
 */
export function formatTimeSaved(hours: number): string {
  return `${hours} hrs`;
}
