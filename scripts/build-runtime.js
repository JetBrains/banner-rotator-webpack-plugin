const path = require('path');

const rollup = require('rollup');
const resolvePlugin = require('rollup-plugin-node-resolve');
const commonjsPlugin = require('rollup-plugin-commonjs');
const bublePlugin = require('rollup-plugin-buble');

const root = path.resolve(__dirname, '..');
const src = path.resolve(root, 'src/browser');
const dest = path.resolve(root, 'browser');

const entries = {
  rotator: `${src}/rotator.js`,
  utils: `${src}/utils/index.js`,
  'closed-banners-storage': `${src}/closed-banners-storage.js`,
  'dispatch-close-event': `${src}/dispatch-close-event.js`
};

Object.keys(entries).map(entry => {
  const entryPath = entries[entry];
  const outputPath = path.resolve(dest, `${entry}.js`);
  rollup.rollup({
    input: entryPath,
    plugins: [
      resolvePlugin(),
      commonjsPlugin(),
      bublePlugin()
    ]
  }).then(bundle => {
    bundle.write({
      file: outputPath,
      format: 'cjs',
      sourcemap: true
    });
  }).catch(e => console.log(`Runtime build ERROR: ${e.message}`));
});
