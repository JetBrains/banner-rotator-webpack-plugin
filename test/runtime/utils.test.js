import {
  isRangeContainsDate,
  createMatcher,
  createMultiMatcher
} from 'webpack-banner-rotator-plugin/src/runtime/utils';

describe('runtime/utils', () => {
  describe('isRangeContainsDate', () => {
    it('should work', () => {
      // eslint-disable-next-line no-magic-numbers
      const res = isRangeContainsDate(new Date(2010), new Date(2012), new Date(2011));
      res.should.be.true;
    });
  });

  describe('createMatcher', () => {
    const cases = {
      '/foo/*': {
        '/': false,
        '/index': false,
        '/index.html/': false,
        '/fooz/foo/bar': false,
        '/foo/': true,
        '/foo/bar': true
      },
      '/index.html': {
        '/': false,
        '/index': false,
        '/index.html/': false,
        '/index.html/123': false,
        '/index.html': true
      },
      '!/foo/*': {
        '/': true,
        '/index': true,
        '/index.html/': true,
        '/fooz/foo/bar': true,
        '/foo/': false,
        '/foo/bar': false
      }
    };

    Object.keys(cases).forEach(pattern => {
      describe(pattern, () => {
        const expectedDict = cases[pattern];
        const matcher = createMatcher(pattern);

        Object.keys(expectedDict).forEach(input => {
          const expected = expectedDict[input];
          const actual = matcher(input);

          it(`${input}: ${expected}`, () => {
            actual.should.be.equal(
              expected,
              `\n\nPattern: ${pattern}\nInput: ${input}\nExpected: ${expected}\nActual: ${actual}\n\n`
            );
          });
        });
      });
    });
  });

  describe('createMultiMatcher', () => {
    const cases = [
      {
        patterns: ['!/index.html'],
        expected: {
          '/foo/': true
        }
      },
      {
        patterns: ['/index.html'],
        expected: {
          '/index.html': true
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

    cases.forEach(({ patterns, expected }) => {
      const patternDisplayName = patterns.join(', ');

      describe(patternDisplayName, () => {
        Object.keys(expected).forEach(input => {
          const expectedValue = expected[input];
          const actual = createMultiMatcher(patterns)(input);

          it(`${input}: ${expectedValue}`, () => {
            actual.should.be.equal(
              expectedValue,
              `\n\nPattern: ${patternDisplayName}\nInput: ${input}\nExpected: ${expectedValue}\nActual: ${actual}\n\n`
            );
          });
        });
      });
    });
  });
});
