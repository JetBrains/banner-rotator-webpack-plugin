const merge = require('merge-options');

const {
  NAMESPACE,
  LOADER_PATH,
  RUNTIME_MODULE_PATH
} = require('./config');

class BannerRotatorPlugin {
  constructor(config = {}) {
    this.config = merge(BannerRotatorPlugin.defaultConfig, config);
  }

  static get defaultConfig() {
    return {
      chunkId: undefined
    };
  }

  // eslint-disable-next-line class-methods-use-this
  get NAMESPACE() {
    // This needed to find plugin from loader context
    return NAMESPACE;
  }

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
