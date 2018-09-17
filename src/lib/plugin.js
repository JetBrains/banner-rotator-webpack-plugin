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

    /* istanbul ignore if */
    if (!compilerOptions.module) {
      compilerOptions.module = {};
    }

    /* istanbul ignore if */
    if (!compilerOptions.module.rules) {
      compilerOptions.module.rules = [];
    }

    compilerOptions.module.rules.push({
      test: runtimeModule,
      loader: LOADER_PATH
    });

    return compiler;
  }

  getRuntimeModule(compilation) {
    return compilation.modules
      .find(m => m.loaders
        .some(({ loader }) => loader === LOADER_PATH)
      );
  }

  /**
   * Return banners chunks
   * @param {Array<Chunk>} chunks
   * @return {Array<Chunk>}
   */
  getBannersChunks(chunks, compilation) {
    const runtimeModule = this.getRuntimeModule(compilation);
    const runtimeModulePath = this.config.runtimeModule;

    if (compilation.hooks) {
      const asyncChunks = chunks
        .map(chunk => Array.from(chunk.getAllAsyncChunks().values()))
        .reduce((acc, chunkChunks) => acc.concat(chunkChunks), []);

      const bannersChunks = asyncChunks.filter(chunk => chunk.getModules()
        .some(m => m.reasons
          .some(reason => reason.module === runtimeModule)
        ));

      return bannersChunks;
    }

    return chunks.filter(chunk => chunk.origins
      .map(origin => origin.module.resource)
      .some(resource => resource === runtimeModulePath));
  }

  apply(compiler) {
    this.addLoaderForRuntime(compiler);

    if (compiler.hooks) {
      compiler.hooks.emit.tapAsync(NAMESPACE, (compilation, done) => {
        done();
      });

      compiler.hooks.thisCompilation.tap(NAMESPACE, compilation => {
        compilation.hooks.normalModuleLoader
          .tap(NAMESPACE, loaderCtx => this.hookNormalModuleLoader(loaderCtx));

        compilation.hooks.afterOptimizeChunkIds
          .tap(NAMESPACE, chunks => {
            this.hookOptimizeChunkIds(chunks, compilation);
          });
      });
    } else {
      compiler.plugin('this-compilation', compilation => {
        compilation.plugin('normal-module-loader', loaderCtx => {
          this.hookNormalModuleLoader(loaderCtx);
        });

        compilation.plugin('optimize-chunk-ids', chunks => {
          this.hookOptimizeChunkIds(chunks, compilation);
        });
      });
    }
  }

  hookNormalModuleLoader(loaderContext) {
    loaderContext[NAMESPACE] = this;
  }

  hookOptimizeChunkIds(chunks, compilation) {
    const config = this.config;

    if (!config.chunkId) {
      return;
    }

    this.getBannersChunks(chunks, compilation).forEach(chunk => {
      // Rename banner chunk id
      const id = compilation.getPath(config.chunkId, { chunk });
      chunk.id = id;
      chunk.ids = [id];
    });
  }
}

module.exports = BannerRotatorPlugin;
