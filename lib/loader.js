const path = require('path');
const fs = require('fs');

const { NAMESPACE, BANNERS_PLACEHOLDER } = require('./config');
const RuntimeGenerator = require('./runtime-generator');
const normalize = require('./normalize');

module.exports = function loader(content, sourcemap) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();
  const compilerContext = this._compiler.context;
  let banners = this[NAMESPACE].config.banners;

  if (typeof banners === 'string') {
    const configFilePath = path.resolve(compilerContext, banners);
    this.addDependency(configFilePath);
    banners = JSON.parse(fs.readFileSync(configFilePath));
  }

  // TODO resolve relatively to compiler context folder instead of absolute path
  banners = normalize(banners);

  const runtime = RuntimeGenerator.banners(banners, compilerContext);
  const result = content.replace(BANNERS_PLACEHOLDER, runtime);

  return callback(null, result, sourcemap);
};
