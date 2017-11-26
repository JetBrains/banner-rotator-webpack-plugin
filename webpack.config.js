const path = require('path');

const packageName = require('./package.json').name;

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  resolve: {
    alias: {
      [packageName]: __dirname
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('test'),
        loader: 'buble-loader'
      }
    ]
  }
};
