const merge = require('merge-options');

const {
  NAMESPACE,
  LOADER_PATH,
  plugin: defaultConfig
} = require('./config');

/**
 * @typedef {Object} Banner
 * @property {string} id
 */

class BannerRotatorPlugin {
  /**
   * @param {BannerRotatorPluginConfig} [config]
   */
  constructor(config) {
    this.config = merge(defaultConfig, config);
  }

  /**
   * @param {Compiler} compiler
   * @return {Compiler}
   */
  addLoaderForRuntime(compiler) {
    const compilerOptions = compiler.options;
    const runtimeModule = this.config.runtimeModule;

    if (!compilerOptions.module) {
      compilerOptions.module = {};
    }

    if (!compilerOptions.module.rules) {
      compilerOptions.module.rules = [];
    }

    compilerOptions.module.rules.push({
      test: runtimeModule,
      loader: LOADER_PATH
    });

    return compiler;
  }

  /**
   * Return banners chunks
   * @param {Array<Chunk>} chunks
   * @return {Array<Chunk>}
   */
  getChunks(chunks) {
    const runtimeModule = this.config.runtimeModule;
    return chunks.filter(chunk => {
      const resources = chunk.origins.map(origin => origin.module.resource);
      return resources.some(resource => resource === runtimeModule);
    });
  }

  apply(compiler) {
    const config = this.config;

    this.addLoaderForRuntime(compiler);

    compiler.plugin('this-compilation', compilation => {
      compilation.plugin('normal-module-loader', loaderContext => {
        loaderContext[NAMESPACE] = { config };
      });

      compilation.plugin('optimize-chunk-ids', () => {
        if (!config.chunkId) {
          return;
        }

        this.getChunks(compilation.chunks).forEach(chunk => {
          // Rename banner chunk id
          const id = compilation.getPath(config.chunkId, { chunk });
          chunk.id = id;
          chunk.ids = [id];
        });
      });
    });
  }
}

module.exports = BannerRotatorPlugin;
