const path = require('path');
const fs = require('fs');

const pkg = require('../../package.json');

/**
 * @typedef {Object} BannerRotatorPluginConfig
 *
 * @property {Array<Banner>|string} banners Array of banners or absolute path to JSON file with banners
 *
 * @property {string} [chunkId] Use custom chunk id for banner chunks. `[id]` token represents current chunk id.
 * NOTICE: it changes only chunk id, which will be used in `chunkFilename` webpack option (`[id].js` by default).
 * @example `banners/[id]` will produce chunk files like `banners/0.js`
 * @see https://webpack.js.org/configuration/output/#output-chunkfilename
 *
 * @property {Function<Array<Banner>>} [process] Process banners by custom used defined function
 */

module.exports = {
  /**
   * For webpack resolving in tests.
   * @type {string}
   */
  PACKAGE_NAME: pkg.name,

  /**
   * Unique filesystem path to identify plugin and share data between plugin and loader.
   * @type {string}
   */
  NAMESPACE: fs.realpathSync(__dirname),

  /**
   * Absolute path to loader. Plugin use it when adding loader rules for runtime rotator module.
   * @type {string}
   */
  LOADER_PATH: path.resolve(__dirname, 'loader.js'),

  /**
   * Absolute path to runtime module. Plugin use it to find modules processed by plugin.
   * @see BannerRotatorPlugin.getChunks
   * @type {string}
   */
  RUNTIME_MODULE_PATH: path.resolve(__dirname, '../runtime/rotator.js'),

  /**
   * Placeholder which will be replaced with banners config data with runtime to lazy load banner module.
   * @see Banner
   * @type {string}
   */
  BANNERS_PLACEHOLDER: '__BANNER_ROTATOR_BANNERS_CONFIG__',

  /**
   * @type {BannerRotatorPluginConfig}
   */
  plugin: {
    banners: undefined,
    chunkId: undefined,
    process: undefined
  }
};
