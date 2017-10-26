/* eslint-disable no-unused-expressions,no-magic-numbers */
import * as matchers from 'webpack-banner-rotator-plugin/runtime/utils/matchers';

describe('matchers', () => {
  describe('date()', () => {
    const date = matchers.date;

    it('should work', () => {
      const res = date(new Date(2010), new Date(2012), new Date(2011));
      res.should.be.true;
    });
  });

  describe('location()', () => {
    const location = matchers.location;

    it('should properly match multiple patterns', () => {
      location(['*', '!/index.html'], '/index.html').should.be.false;
      location(['*', '!/foo/*'], '/foo').should.be.true;
      location(['*', '!/foo/*'], '/foo/').should.be.false;
    });
  });

  describe('country()', () => {
    const country = matchers.country;

    it('should work', () => {
      country(['EN'], 'RU').should.be.false;
      country(['EN', 'BG'], 'BG').should.be.true;
    });
  });
});
