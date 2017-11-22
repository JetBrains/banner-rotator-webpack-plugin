const path = require('path');

const packageName = require('./package.json').name;

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },

  resolve: {
    alias: {
      [packageName]: __dirname
    }
  }
};
