const { NAMESPACE, BANNERS_PLACEHOLDER } = require('./config');

module.exports = function loader(content, sourcemap) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();
  const runtime = this[NAMESPACE].runtime;
  const result = content.replace(BANNERS_PLACEHOLDER, runtime);

  return callback(null, result, sourcemap);
};
