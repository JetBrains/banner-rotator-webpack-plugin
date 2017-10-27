import escapeRegexp from 'escape-string-regexp';

/**
 * TODO integrate https://github.com/fitzgen/glob-to-regexp
 *
 * Simple glob-to-matcher-function helper. Supports:
 * - glob star, eg `/path/*`
 * - negation of whole expression, eg `!/path/`
 * - combination of all these things in any proportion
 *
 * @param {string} pattern Expression with optional glob pattern.
 * @return {Function<boolean>} Matcher function
 */
export function createMatcher(pattern) {
  const isNegative = pattern.charAt(0) === '!';

  let p = isNegative ? pattern.substr(1) : pattern;
  p = escapeRegexp(p);

  // Hack to replace `* -> .*` and `^\! -> !`
  p = p
    .replace(/\\\*/g, '.*')
    .replace(/^\!/, '!');

  const regexp = new RegExp(p, 'gi');

  /**
   * @param {string} value
   * @return {boolean}
   */
  return function matcher(input) {
    const matched = regexp.test(input);
    return isNegative ? !matched : matched;
  };
}

/**
 * @param {Array<string>} patterns
 * @return {Function<boolean>}
 */
export function createMultipleMatcher(patterns) {
  const normalMatchers = patterns
    .filter(pattern => pattern.charAt(0) !== '!')
    .map(pattern => createMatcher(pattern));

  const negationMatchers = patterns
    .filter(pattern => pattern.charAt(0) === '!')
    .map(pattern => createMatcher(pattern));

  /**
   * @param {string} input
   * @return {boolean}
   */
  return function matcher(input) {
    const satisfyNormal = normalMatchers.length > 0
      ? normalMatchers.some(normalMatcher => normalMatcher(input))
      : true;

    const satisfyNegation = negationMatchers.length > 0
      ? negationMatchers.every(negationMatcher => negationMatcher(input))
      : true;

    return satisfyNormal && satisfyNegation;
  };
}

/**
 * @param {string|Array<string>} pattern
 * @param {string} input
 * @return {boolean}
 */
export default function (pattern, input) {
  const multiple = Array.isArray(input);
  const matcher = multiple ? createMultipleMatcher(input) : createMatcher(input);
  return matcher(input);
}
