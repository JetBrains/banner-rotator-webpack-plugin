const webpackMerge = require('webpack-merge');

const {
  LOADER_PATH,
  plugin: defaultConfig
} = require('../../src/lib/config');

const webpackConfig = require('../../webpack.config');
const Plugin = require('../../src/lib/plugin');
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
      const plugin = new Plugin();
      plugin.addLoaderForRuntime(compiler);
      const [rule] = compiler.options.module.rules;
      rule.loader.should.be.equal(LOADER_PATH);
      rule.test.should.be.equal(defaultConfig.runtimeModule);
    });
  });

  describe('apply()', () => {
    const defaultBanners = [{ entry: './banners/test-banner' }];
    const defaultExpectedChunkId = 'banners/0';
    const defaultExpectedChunkFilename = `${defaultExpectedChunkId}.js`;

    it('should replace banners placeholder and create lazy chunk', async () => {
      const expectedChunkId = defaultExpectedChunkId;
      const expectedChunkFilename = defaultExpectedChunkFilename;

      const { assets } = await compile({
        plugins: [
          new Plugin({ banners: defaultBanners })
        ]
      });

      assets['main.js'].source().should
        .contain(`__webpack_require__.e/* require.ensure */("${expectedChunkId}")`)
        .and.not.contain(defaultConfig.bannersRuntimePlaceholder);

      assets.should.contain.property(expectedChunkFilename);
      assets[expectedChunkFilename].source().should.contain(`webpackJsonp(["${expectedChunkId}"],`);
    });

    it('should allow to override banner chunk id', async () => {
      const customChunkId = 'qwe/[id]';
      const expectedChunkId = 'qwe/0';
      const expectedChunkFilename = `${expectedChunkId}.js`;

      const { assets } = await compile({
        plugins: [
          new Plugin({ banners: defaultBanners, chunkId: customChunkId })
        ]
      });

      assets['main.js'].source().should.contain(`__webpack_require__.e/* require.ensure */("${expectedChunkId}")`);
      assets.should.contain.property(expectedChunkFilename);
      assets[expectedChunkFilename].source().should.contain(`webpackJsonp(["${expectedChunkId}"],`);
    });

    it('should allow to pass falsy value as chunkId and dont\'t touch chunk id then', async () => {
      const chunkId = null;
      const expectedChunkId = '0';
      const expectedChunkFilename = `${expectedChunkId}.js`;

      const { assets } = await compile({
        plugins: [
          new Plugin({ banners: defaultBanners, chunkId })
        ]
      });

      assets['main.js'].source().should.contain(`__webpack_require__.e/* require.ensure */(${expectedChunkId})`);
      assets.should.contain.property(expectedChunkFilename);
      assets[expectedChunkFilename].source().should.contain(`webpackJsonp([${expectedChunkId}],`);
    });

    it('should allow to pass path to banners json file', async () => {
      const { assets } = await compile({
        plugins: [
          new Plugin({
            banners: './banners.json'
          })
        ]
      });

      assets['main.js'].source().should.contain(`__webpack_require__.e/* require.ensure */("${defaultExpectedChunkId}")`);
      assets.should.contain.property(defaultExpectedChunkFilename);
      assets[defaultExpectedChunkFilename].source().should.contain(`webpackJsonp(["${defaultExpectedChunkId}"],`);
    });

    it('should allow to postprocess banners', async () => {
      const { assets } = await compile({
        plugins: [
          new Plugin({
            banners: defaultBanners,
            process: banners => {
              banners.forEach(b => b.id = 'tralala');
              return banners;
            }
          })
        ]
      });

      assets['main.js'].source().should.contain('tralala');
    });
  });
});
