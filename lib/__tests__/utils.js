const path = require('path');

const webpackMerge = require('webpack-merge');
const { InMemoryCompiler, createCachedInputFileSystem } = require('webpack-toolkit');

const fixturesPath = path.resolve(__dirname, 'fixtures');

/**
 * @param {Object} [config]
 * @return {InMemoryCompiler}
 */
function createCompiler(config = {}) {
  const cfg = webpackMerge({
    context: fixturesPath
  }, config);

  const inputFS = createCachedInputFileSystem();
  return new InMemoryCompiler(cfg, { inputFS });
}

function compile(config) {
  return createCompiler(config).run();
}

/**
 * @param {Object} [config]
 * @return {Promise<Compilation>}
 */
function compileAndNotReject(config) {
  return createCompiler(config).run(false);
}

module.exports.createCompiler = createCompiler;
module.exports.compile = compile;
module.exports.compileAndNotReject = compileAndNotReject;
