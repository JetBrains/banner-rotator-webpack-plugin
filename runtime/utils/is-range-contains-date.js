/**
 * @param {Date} [rangeStart]
 * @param {Date} [rangeEnd]
 * @param {Date} date
 * @return {boolean}
 */
export default function (rangeStart, rangeEnd, date) {
  const time = date.getTime();
  const startTime = rangeStart && rangeStart.getTime();
  const endTime = rangeEnd && rangeEnd.getTime();
  const greaterThanStart = startTime ? time >= startTime : true;
  const lessThanEnd = endTime ? time <= endTime : true;
  return greaterThanStart && lessThanEnd;
}
