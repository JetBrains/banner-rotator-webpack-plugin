const path = require('path');

const fs = require('fs-extra');

const { NAMESPACE } = require('./config');
const RuntimeGenerator = require('./runtime-generator');
const processBanners = require('./process-banners');

module.exports = function (content, sourcemap) {
  /* istanbul ignore else */
  if (this.cacheable) {
    this.cacheable();
  }

  const loader = this; // eslint-disable-line consistent-this
  const callback = loader.async();
  const compilerContext = loader._compiler.context;

  /** @type {BannerRotatorPluginConfig} */
  const config = this[NAMESPACE].config;
  const {
    banners: bannersOption,
    process: customProcessor
  } = config;
  const bannersOptionIsPath = typeof bannersOption === 'string';
  const bannersFilePath = bannersOptionIsPath ? path.resolve(compilerContext, bannersOption) : null;

  if (bannersOptionIsPath) {
    loader.addDependency(bannersFilePath);
  }

  return Promise.resolve()
    .then(() => (bannersOptionIsPath ? fs.readJson(bannersFilePath) : bannersOption))
    .then(banners => processBanners(banners))
    .then(banners => (customProcessor ? customProcessor.call(loader, banners) : banners))
    .then(banners => {
      const runtime = RuntimeGenerator.banners(banners, compilerContext);
      const result = content.replace(config.runtimePlaceholder, runtime);
      return callback(null, result, sourcemap);
    })
    .catch(callback);
};
