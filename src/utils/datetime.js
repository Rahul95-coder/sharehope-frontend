/**
 * Formats a Date for <input type="datetime-local"> in the user's LOCAL time.
 *
 * `date.toISOString().slice(0, 16)` gives UTC, which the input then treats as local time.
 * In India (UTC+5:30) that made the default expiry land ~5.5 hours in the past.
 */
export const toLocalInputValue = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
export const hoursFromNow = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);
