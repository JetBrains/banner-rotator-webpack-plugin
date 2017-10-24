const merge = require('deepmerge');

const RuntimeGenerator = require('./runtime-generator');
const {
  NAMESPACE,
  LOADER_PATH,
  RUNTIME_MODULE_PATH
} = require('./config');

// TODO chunk ids
class BannerRotatorPlugin {
  static get defaultConfig() {
    return {};
  }

  // eslint-disable-next-line class-methods-use-this
  get NAMESPACE() {
    // This needed to find plugin from loader context
    return NAMESPACE;
  }

  constructor(config = {}) {
    this.config = merge(BannerRotatorPlugin.defaultConfig, config);
  }

  prepare(compiler) {
    const { banners } = this.config;

    banners.forEach(banner => {
      if (!banner.id) {
        banner.id = banner.entry;
      }
    });

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
  }

  apply(compiler) {
    const { banners } = this.config;

    this.prepare(compiler);

    compiler.plugin('this-compilation', compilation => {
      compilation.plugin('normal-module-loader', loaderContext => {
        const runtime = RuntimeGenerator.banners(banners, compiler.context);
        loaderContext[NAMESPACE] = { runtime };
      });
    });
  }
}

module.exports = BannerRotatorPlugin;
