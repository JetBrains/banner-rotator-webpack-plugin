import globToMatcher from 'webpack-banner-rotator-plugin/runtime/utils/glob-to-matcher';

const CASES = [
  {
    name: 'simple',
    pattern: '/index.html',
    results: {
      '/': false,
      '/index': false,
      '/index.html': true
    }
  },
  {
    name: 'with asterisk',
    pattern: '/foo/*',
    results: {
      '/': false,
      '/index': false,
      '/index.html/': false,
      '/foo/bar': true,
      '/fooz/foo/bar': false
    }
  },
  {
    name: 'with negation',
    pattern: '!/foo/*',
    results: {
      '/': true,
      '/index': true,
      '/index.html/': true,
      '/foo/bar': false,
      '/fooz/foo/bar': true
    }
  }
];

describe('globToMatcher()', () => {
  CASES.forEach(CASE => {
    it(CASE.name, () => {
      const { pattern, results } = CASE;
      const matcher = globToMatcher(pattern);

      Object.keys(results).forEach(input => {
        const expected = CASE.results[input];
        const result = matcher(input);

        result.should.be.equal(
          expected,
          `\n\nPattern: ${pattern}\nInput: ${input}\nExpected: ${expected}\nActual: ${result}\n\n`
        );
      });
    });
  });
});
