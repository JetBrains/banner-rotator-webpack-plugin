/* eslint-disable no-magic-numbers */
const path = require('path');

const unquote = require('unquote');

const Generator = require('../lib/runtime-generator');

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

  describe('#banner()', () => {
    it('should work', () => {
      const cwd = process.cwd();
      const input = { a: 1, b: '"2"', entry: '"./a"' };
      const expectedModulePath = path.resolve(cwd, unquote(input.entry));
      const expected = `{"a":1,"b":"2","entry":"./a","load":function() { return import("${expectedModulePath}"); }}`;
      Generator.banner(input, cwd).should.be.equal(expected);
    });
  });

  describe('#banners()', () => {
    it('should work', () => {
      const cwd = process.cwd();
      const input = [
        { a: 1, b: '"2"', entry: '"./a"' },
        { a: 2, b: '"3"', entry: '"./b"' }
      ];
      const expectedModulePaths = [
        path.resolve(cwd, unquote(input[0].entry)),
        path.resolve(cwd, unquote(input[1].entry))
      ];
      const expected = [
        '[',
        `{"a":1,"b":"2","entry":"./a","load":function() { return import("${expectedModulePaths[0]}"); }}`,
        `{"a":2,"b":"3","entry":"./b","load":function() { return import("${expectedModulePaths[1]}"); }}`,
        ']'
      ].join('');
      Generator.banners(input, cwd).should.equal(expected);
    });
  });
});
