// TODO promisify all
const path = require('path');
const fs = require('fs');

const { NAMESPACE } = require('./config');
const RuntimeGenerator = require('./runtime-generator');
const processBanners = require('./process-banners');

module.exports = function loader(content, sourcemap) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();
  const compilerContext = this._compiler.context;

  /**
   * @type {BannerRotatorPluginConfig}
   */
  const config = this[NAMESPACE].config;
  let banners = config.banners;

  if (typeof banners === 'string') {
    const configFilePath = path.resolve(compilerContext, banners);
    this.addDependency(configFilePath);
    banners = JSON.parse(fs.readFileSync(configFilePath));
  }

  // TODO use loader resolved instead absolute path of banner module
  banners = processBanners(banners);

  if (typeof config.process === 'function') {
    banners = config.process.call(this, banners);
  }

  const runtime = RuntimeGenerator.banners(banners, compilerContext);
  const result = content.replace(config.bannersRuntimePlaceholder, runtime);

  return callback(null, result, sourcemap);
};
