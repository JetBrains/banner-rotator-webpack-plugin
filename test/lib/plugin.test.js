const webpackMerge = require('webpack-merge');

const {
  LOADER_PATH,
  RUNTIME_MODULE_PATH,
  BANNERS_PLACEHOLDER
} = require('../../lib/config');

const webpackConfig = require('../../webpack.config');
const Plugin = require('../../lib/plugin');
const utils = require('../utils');

const { createCompiler } = utils;

const compile = config => utils.compile(webpackMerge(webpackConfig, config));

describe('plugin', () => {
  describe('prepare()', () => {
    it('should properly add custom loader rules', () => {
      const compiler = createCompiler({ entry: './test-banner' })._compiler;
      Plugin.addLoaderForRuntime(compiler);
      compiler.options.module.rules[0].loader.should.be.equal(LOADER_PATH);
      compiler.options.module.rules[0].test.should.be.equal(RUNTIME_MODULE_PATH);
    });
  });

  describe('apply()', () => {
    it('should replace banners placeholder', async () => {
      const banners = [{ entry: './banners/test-banner' }];

      const { assets } = await compile({
        entry: './entry',
        plugins: [new Plugin({ banners })]
      });

      assets['main.js'].source().should.not.contain(BANNERS_PLACEHOLDER);
      assets.should.contain.property('0.js');
    });
  });
});
