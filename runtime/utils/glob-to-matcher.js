import escapeRegExpSpecialChars from 'escape-string-regexp';

/**
 * Simple glob-to-matcher function helper. Supports:
 * - glob star, eg `/path/*`
 * - negation of the whole expression, eg `!/path/`
 * - glob star and negation could be combined
 * @param {string} glob
 * @return {Function<boolean>}
 */
export default function globToMatcher(glob) {
  const isNegative = glob.charAt(0) === '!';

  let pattern = isNegative ? glob.substr(1) : glob;
  pattern = escapeRegExpSpecialChars(pattern);
  pattern = pattern.replace(/\\\*/g, '.*').replace(/^\!/, '!');
  const re = new RegExp(pattern, 'gi');

  return function matcher(val) {
    const isMatch = re.test(val);
    return isNegative ? !isMatch : isMatch;
  };
}
