/* eslint-disable no-unused-expressions,no-magic-numbers */
import * as matchers from '../matchers';

describe('matchers', () => {
  describe('date', () => {
    it('should work', () => {
      const res = matchers.date(new Date(2010), new Date(2012), new Date(2011));
      res.should.be.true;
    });
  });
});
