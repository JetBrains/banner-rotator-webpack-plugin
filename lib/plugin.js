const merge = require('deepmerge');
const slug = require('url-slug');

const RuntimeGenerator = require('./runtime-generator');
const {
  NAMESPACE,
  LOADER_PATH,
  RUNTIME_MODULE_PATH
} = require('./config');

class BannerRotatorPlugin {
  constructor(config = {}) {
    const cfg = merge(BannerRotatorPlugin.defaultConfig, config);
    this.config = BannerRotatorPlugin.prepareConfig(cfg);
  }

  static get defaultConfig() {
    return {};
  }

  static prepareConfig(config) {
    const cfg = merge({}, config);

    if (!cfg.banners) {
      throw new Error('`config.banners` should be Array or Function');
    }

    cfg.banners.forEach(banner => {
      if (!banner.id) {
        banner.id = slug(banner.entry);
      }
    });

    return cfg;
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

  apply(compiler) {
    const config = this.config;

    BannerRotatorPlugin.addLoaderForRuntime(compiler);

    compiler.plugin('this-compilation', compilation => {
      compilation.plugin('normal-module-loader', loaderContext => {
        const runtime = RuntimeGenerator.banners(config.banners, compiler.context);
        loaderContext[NAMESPACE] = { runtime };
      });

      compilation.plugin('after-optimize-chunks', chunks => {
        chunks.filter(chunk => {
          const resources = chunk.origins.map(origin => origin.module.resource);
          return resources.some(resource => resource === RUNTIME_MODULE_PATH);
        }).forEach(chunk => {
          chunk.filenameTemplate = config.bannerFilename || compilation.outputOptions.chunkFilename;
        });
      });
    });
  }
}

module.exports = BannerRotatorPlugin;
