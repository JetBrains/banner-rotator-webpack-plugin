const merge = require('merge-options');

const {
  NAMESPACE,
  LOADER_PATH,
  RUNTIME_MODULE_PATH
} = require('./config');

/**
 * @typedef {Object} BannerRotatorPluginConfig
 *
 * @property {Array<BannerConfig>|string} banners Array of banners or absolute path to JSON file with banners
 *
 * @property {string} [chunkId] Use custom chunk id for banner chunks. `[id]` token represents current chunk id.
 * NOTICE: it changes only chunk id, which will be used in `chunkFilename` webpack option (`[id].js` by default).
 * @example `banners/[id]` will produce chunk files like `banners/0.js`
 * @see https://webpack.js.org/configuration/output/#output-chunkfilename
 *
 * @property {Function<BannerConfig>} [bannerId] Custom banner id generator, e.g. based on `startDate` and `data.*` props.
 */

/**
 * @typedef {Object} BannerConfig
 * @property {string} id
 */

class BannerRotatorPlugin {
  /**
   * @param {BannerRotatorPluginConfig} config
   */
  constructor(config) {
    /**
     * @type {BannerRotatorPluginConfig}
     */
    this.config = merge(BannerRotatorPlugin.defaultConfig, config);
  }

  /**
   * @return {BannerRotatorPluginConfig}
   */
  static get defaultConfig() {
    return {
      banners: undefined,
      chunkId: undefined,
      bannerId: undefined
    };
  }

  /**
   * @param {Compiler} compiler
   * @return {Compiler}
   */
  static addLoaderForRuntime(compiler) {
    const compilerOptions = compiler.options;

    if (!compilerOptions.module) {
      compilerOptions.module = {};
    }

    if (!compilerOptions.module.rules) {
      compilerOptions.module.rules = [];
    }

    compilerOptions.module.rules.push({
      test: RUNTIME_MODULE_PATH,
      loader: LOADER_PATH
    });

    return compiler;
  }

  /**
   * @return {string}
   */
  get NAMESPACE() {
    // This needed to find plugin from loader context
    return NAMESPACE;
  }

  /**
   * Return banners chunks
   * @param {Array<Chunk>} chunks
   * @return {Array<Chunk>}
   */
  static getChunks(chunks) {
    return chunks.filter(chunk => {
      const resources = chunk.origins.map(origin => origin.module.resource);
      return resources.some(resource => resource === RUNTIME_MODULE_PATH);
    });
  }

  apply(compiler) {
    const config = this.config;

    BannerRotatorPlugin.addLoaderForRuntime(compiler);

    compiler.plugin('this-compilation', compilation => {
      compilation.plugin('normal-module-loader', loaderContext => {
        loaderContext[NAMESPACE] = { config };
      });

      compilation.plugin('optimize-chunk-ids', () => {
        if (!config.chunkId) {
          return;
        }

        const targetChunks = BannerRotatorPlugin.getChunks(compilation.chunks);

        targetChunks.forEach(chunk => {
          const id = compilation.getPath(config.chunkId, { chunk });
          chunk.id = id;
          chunk.ids = [id];
        });
      });
    });
  }
}

module.exports = BannerRotatorPlugin;
