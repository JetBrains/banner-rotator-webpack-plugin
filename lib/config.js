const path = require('path');
const fs = require('fs');

const pkg = require('../package.json');

module.exports = {
  PACKAGE_NAME: pkg.name,
  PACKAGE_ROOT_PATH: path.resolve(__dirname, '..'),
  NAMESPACE: fs.realpathSync(__dirname),
  LOADER_PATH: path.resolve(__dirname, 'loader.js'),
  RUNTIME_MODULE_PATH: path.resolve(__dirname, '../runtime/rotator.js'),
  BANNERS_PLACEHOLDER: '__BANNER_ROTATOR_BANNERS_CONFIG__'
};
