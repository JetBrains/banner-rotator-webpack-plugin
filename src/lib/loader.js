const path = require('path');

const fs = require('fs-extra');

const { NAMESPACE } = require('./config');
const RuntimeGenerator = require('./runtime-generator');
const processBanners = require('./process-banners');

module.exports = function loader(content, sourcemap) {
  if (typeof this.cacheable === 'function') {
    this.cacheable();
  }

  const callback = this.async();
  const compilerContext = this._compiler.context;

  /**
   * @type {BannerRotatorPluginConfig}
   */
  const config = this[NAMESPACE].config;
  const bannersOption = config.banners;
  const bannersOptionIsPath = typeof bannersOption === 'string';
  const configFilePath = bannersOptionIsPath ? path.resolve(compilerContext, bannersOption) : null;

  return Promise.resolve()
    .then(() => (bannersOptionIsPath ? fs.readJson(configFilePath) : bannersOption))
    .then(banners => processBanners(banners))
    .then(banners => (config.process ? config.process.call(this, banners) : banners))
    .then(banners => {
      const runtime = RuntimeGenerator.banners(banners, compilerContext);
      const result = content.replace(config.bannersRuntimePlaceholder, runtime);
      return callback(null, result, sourcemap);
    })
    .catch(callback);
};
