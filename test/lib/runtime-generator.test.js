/* eslint-disable no-magic-numbers */
const Generator = require('../../lib/runtime-generator');

describe('runtime-generator', () => {
  describe('#prop()', () => {
    it('should work', () => {
      Generator.prop('foo-bar', 'olala').should.be.equal('"foo-bar":olala');
      Generator.prop('foo-bar', '"string"').should.be.equal('"foo-bar":"string"');
      Generator.prop('foo-bar', '\'string\'').should.be.equal('"foo-bar":\'string\'');
      Generator.prop('foo-bar', 1).should.be.equal('"foo-bar":1');
      Generator.prop('foo-bar', 'function(){}').should.be.equal('"foo-bar":function(){}');
      Generator.prop('foo-bar', [1, 2, 3]).should.be.equal('"foo-bar":[1,2,3]');
      Generator.prop('foo-bar', { a: 1 }).should.be.equal('"foo-bar":{"a":1}');
    });
  });

  describe('#props()', () => {
    it('should work', () => {
      const input = { a: 1, b: '"2"' };
      const expected = `"a":1,"b":"2"`; // eslint-disable-line quotes
      Generator.props(input).should.be.equal(expected);
    });
  });
});
