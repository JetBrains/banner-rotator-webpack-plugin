const path = require('path');

const Promise = require('bluebird');
const rollup = require('rollup');
const resolvePlugin = require('rollup-plugin-node-resolve');
const commonjsPlugin = require('rollup-plugin-commonjs');
const bublePlugin = require('rollup-plugin-buble');

const root = path.resolve(__dirname, '..');
const src = path.resolve(root, 'src/runtime');
const dest = path.resolve(root, 'dist');

/**
 * libraryName: path-to-entry
 */
const entries = {
  BannerRotator: `${src}/rotator.js`,
  ClosedBannersStorage: `${src}/closed-banners-storage.js`,
  dispatchCloseEvent: `${src}/dispatch-close-event.js`
};

Promise.map(Object.keys(entries), name => {
  const input = entries[name];
  const file = path.resolve(dest, path.basename(input));

  rollup.rollup({
    input,
    plugins: [
      resolvePlugin(),
      commonjsPlugin(),
      bublePlugin()
    ]
  }).then(bundle => {
    bundle.write({
      file,
      name,
      format: 'umd',
      sourcemap: true
    });
  });
});
