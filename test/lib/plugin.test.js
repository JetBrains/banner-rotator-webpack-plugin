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

const compile = config => {
  const merged = webpackMerge(webpackConfig, { entry: './entry' }, config);
  return utils.compile(merged);
};

describe('plugin', () => {
  describe('prepare()', () => {
    it('should properly add custom loader rules', () => {
      const compiler = createCompiler({ entry: './test-banner' })._compiler;
      Plugin.addLoaderForRuntime(compiler);
      const [rule] = compiler.options.module.rules;
      rule.loader.should.be.equal(LOADER_PATH);
      rule.test.should.be.equal(RUNTIME_MODULE_PATH);
    });
  });

  describe('apply()', () => {
    const banners = [{ entry: './banners/test-banner' }];

    it('should replace banners placeholder and create lazy chunk', async () => {
      const expectedChunkId = '0';
      const expectedChunkFilename = `${expectedChunkId}.js`;

      const { assets } = await compile({
        plugins: [
          new Plugin({ banners })
        ]
      });

      assets['main.js'].source().should
        .contain(`__webpack_require__.e/* require.ensure */(${expectedChunkId})`)
        .and.not.contain(BANNERS_PLACEHOLDER);

      assets.should.contain.property(expectedChunkFilename);
      assets[expectedChunkFilename].source().should.contain(`webpackJsonp([${expectedChunkId}],`);
    });

    it('should allow to override banner chunk id', async () => {
      const expectedChunkId = 'banners/0';
      const expectedChunkFilename = `${expectedChunkId}.js`;

      const { assets } = await compile({
        plugins: [
          new Plugin({
            banners,
            chunkId: 'banners/[id]'
          })
        ]
      });

      assets['main.js'].source().should.contain(`__webpack_require__.e/* require.ensure */("${expectedChunkId}")`);
      assets.should.contain.property(expectedChunkFilename);
      assets[expectedChunkFilename].source().should.contain(`webpackJsonp(["${expectedChunkId}"],`);
    });
  });
});
