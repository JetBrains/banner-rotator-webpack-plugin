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

  static normalizeConfig(config) {
    const cfg = merge({}, config);

    if (cfg.banners) {
      cfg.banners.forEach(banner => {
        if (!banner.id) {
          banner.id = banner.entry;
        }
      });
    }

    return cfg;
  }

  constructor(config = {}) {
    const cfg = merge(BannerRotatorPlugin.defaultConfig, config);
    this.config = BannerRotatorPlugin.normalizeConfig(cfg);
  }

  // eslint-disable-next-line class-methods-use-this
  get NAMESPACE() {
    // This needed to find plugin from loader context
    return NAMESPACE;
  }

  prepare(compiler) {
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
