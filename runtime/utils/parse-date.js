/* eslint-disable no-magic-numbers */

const DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})(?:\s(\d{2}):(\d{2}))?$/;

/**
 * @param {string} dateString Human readable date, e.g. '2017-10-12 14:48'
 * @param {boolean} [parseAsEndDate=false]
 * @return {Date}
 */
export default function parseDate(dateString, parseAsEndDate = false) {
  const date = new Date();

  if (!DATE_REGEXP.test(dateString)) {
    throw new Error(`Invalid date: ${dateString}`);
  }

  const matches = dateString.match(DATE_REGEXP)
    .filter((val, index) => index > 0 && val !== undefined)
    .map(val => parseInt(val, 10));

  const [year, month, day, hours, minutes] = matches;

  date.setYear(year);
  date.setMonth(month - 1);
  date.setDate(day);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  if (parseAsEndDate) {
    date.setHours(23);
    date.setMinutes(59);
  }

  if (hours && minutes) {
    date.setHours(hours);
    date.setMinutes(minutes);
  }

  return date;
}
