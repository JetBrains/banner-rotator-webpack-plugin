/* eslint-disable no-unused-expressions */
import {
  isRangeContainsDate,
  createMatcher,
  createMultipleMatcher
} from 'webpack-banner-rotator-plugin/runtime/utils';

describe('runtime/utils', () => {
  describe('isRangeContainsDate', () => {
    it('should work', () => {
      // eslint-disable-next-line no-magic-numbers
      const res = isRangeContainsDate(new Date(2010), new Date(2012), new Date(2011));
      res.should.be.true;
    });
  });

  describe('createMatcher', () => {
    const CASES = [
      {
        pattern: '/index.html',
        expected: {
          '/': false,
          '/index': false,
          '/index.html': true
        }
      },
      {
        pattern: '/foo/*',
        expected: {
          '/': false,
          '/index': false,
          '/index.html/': false,
          '/foo/bar': true,
          '/fooz/foo/bar': false
        }
      },
      {
        pattern: '!/foo/*',
        expected: {
          '/': true,
          '/index': true,
          '/index.html/': true,
          '/foo/bar': false,
          '/fooz/foo/bar': true
        }
      }
    ];

    CASES.forEach(CASE => {
      it(CASE.pattern, () => {
        const { pattern, expected } = CASE;
        const matcher = createMatcher(pattern);

        Object.keys(expected).forEach(input => {
          const expectedValue = CASE.expected[input];
          const actual = matcher(input);

          actual.should.be.equal(
            expectedValue,
            `\n\nPattern: ${pattern}\nInput: ${input}\nExpected: ${expectedValue}\nActual: ${actual}\n\n`
          );
        });
      });
    });
  });

  describe('createMultipleMatcher', () => {
    const CASES = [
      {
        patterns: ['!/index.html'],
        expected: {
          '/foo/': true
        }
      },
      {
        patterns: ['*', '!/index.html'],
        expected: {
          '/index.html': false
        }
      },
      {
        patterns: ['*', '!/foo/*'],
        expected: {
          '/foo': true,
          '/foo/': false
        }
      }
    ];

    CASES.forEach(({ patterns, expected }) => {
      const patternDisplayName = patterns.join(', ');

      it(patternDisplayName, () => {
        Object.keys(expected).forEach(input => {
          const expectedValue = expected[input];
          const actual = createMultipleMatcher(patterns)(input);

          actual.should.be.equal(
            expectedValue,
            `\n\nPattern: ${patternDisplayName}\nInput: ${input}\nExpected: ${expectedValue}\nActual: ${actual}\n\n`
          );
        });
      });
    });
  });
});
