const path = require('path');

const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

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
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'buble-loader'
      }
    ]
  },

  plugins: [
    new ModuleConcatenationPlugin()
  ]
};
