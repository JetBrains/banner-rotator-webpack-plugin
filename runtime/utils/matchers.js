/* eslint-disable no-shadow */
import globToMatcher from './glob-to-matcher';

/**
 * @param {Date} rangeStart
 * @param {Date} rangeEnd
 * @param {Date} date
 * @return {boolean}
 */
export function date(rangeStart, rangeEnd, date) {
  const time = date.getTime();
  const startTime = rangeStart && rangeStart.getTime();
  const endTime = rangeEnd && rangeEnd.getTime();
  const greaterThanStart = startTime ? time >= startTime : true;
  const lessThanEnd = endTime ? time <= endTime : true;
  return greaterThanStart && lessThanEnd;
}

/**
 * @param {Array<string>} locations
 * @param {string} location
 * @return {boolean}
 */
export function location(locations, location) {
  const satisfiesNegations = locations
    .filter(loc => loc.charAt(0) === '!')
    .map(loc => globToMatcher(loc))
    .every(matcher => matcher(location));

  const satisfiesNonNegations = locations
    .filter(loc => loc.charAt(0) !== '!')
    .map(loc => globToMatcher(loc))
    .some(matcher => matcher(location));

  return satisfiesNegations && satisfiesNonNegations;
}

/**
 * @param {Array<string>} codes
 * @param {string} code
 */
export function country(codes, code) {
  return codes.includes(code);
}
