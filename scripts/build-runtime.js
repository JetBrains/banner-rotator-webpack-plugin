const path = require('path');

const glob = require('glob');
const { rollup } = require('rollup');
const resolvePlugin = require('rollup-plugin-node-resolve');
const commonjsPlugin = require('rollup-plugin-commonjs');
const bublePlugin = require('rollup-plugin-buble');

const root = path.resolve(__dirname, '..');
const src = path.resolve(root, 'src/browser');
const dest = path.resolve(root, 'browser');

const promises = glob.sync(path.join(src, '*.js')).map(entryPath => {
  const entryName = path.basename(entryPath, path.extname(entryPath));
  const outputPath = path.resolve(dest, `${entryName}.js`);

  return rollup({
    input: entryPath,
    plugins: [
      resolvePlugin(),
      commonjsPlugin(),
      bublePlugin()
    ]
  })
    .then(bundle => {
      bundle.write({
        file: outputPath,
        format: 'cjs',
        sourcemap: true
      });
    })
    .catch(e => console.log(`Runtime build ERROR: ${e.message}`));
});

Promise.all(promises);
