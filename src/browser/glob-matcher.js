import globToRegexp from 'glob-to-regexp';

function isNegative(pattern) {
  return pattern.charAt(0) === '!';
}

/**
 * Supports:
 * - glob star, eg `/path/*`
 * - negation of whole expression, eg `!/path/`
 * - any single-character match, eg `.jsx?`
 * - character ranges [a-z]
 * - brace expansion {*.html, *.js}
 * - combination of all these things in any proportion
 * @see https://github.com/fitzgen/glob-to-regexp#usage
 * @param {string} glob Expression with optional glob pattern.
 * @return {Function<boolean>} Matcher function
 */
export function createMatcher(glob) {
  const negative = isNegative(glob);
  const pattern = negative ? glob.substr(1) : glob;
  const regexp = globToRegexp(pattern, { extended: true });

  /**
   * @param {string} value
   * @return {boolean}
   */
  return function matcher(input) {
    const matched = regexp.test(input);
    return negative ? !matched : matched;
  };
}

/**
 * @param {Array<string>} patterns
 * @return {Function<boolean>}
 */
export function createMultiMatcher(patterns) {
  const normal = patterns.filter(p => !isNegative(p)).map(p => createMatcher(p));
  const negation = patterns.filter(p => isNegative(p)).map(p => createMatcher(p));

  /**
   * @param {string} input
   * @return {boolean}
   */
  return function multiMatcher(input) {
    const satisfyNormal = normal.length > 0
      ? normal.some(normalMatcher => normalMatcher(input))
      : true;

    const satisfyNegation = negation.length > 0
      ? negation.every(negationMatcher => negationMatcher(input))
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
  const multiple = Array.isArray(pattern);
  const matcher = multiple ? createMultiMatcher(pattern) : createMatcher(pattern);
  return matcher(input);
}
