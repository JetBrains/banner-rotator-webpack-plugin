const path = require('path');

const stringify = JSON.stringify;

/**
 * @typedef {Object<string, string|number|Array|Object>} BannerData
 */

function shouldBeStringified(val) {
  return typeof val !== 'string';
}

class RuntimeGenerator {
  /**
   * @param {Array<BannerData>} banners
   * @param {string} contextPath
   * @return {string}
   */
  static banners(banners, contextPath) {
    const runtime = banners
      .map(banner => RuntimeGenerator.banner(banner, contextPath))
      .join('');
    return `[${runtime}]`;
  }

  /**
   * @param {BannerData} banner
   * @param {string} [contextPath]
   * @return {string}
   */
  static banner(banner, contextPath) {
    const props = Object.keys(banner).reduce((acc, prop) => {
      acc[prop] = stringify(banner[prop]);
      return acc;
    }, {});

    const modulePath = path.resolve(contextPath, banner.entry);
    props.load = `function() { return import("${modulePath}"); }`;

    const runtime = RuntimeGenerator.props(props);
    return `{${runtime}}`;
  }

  /**
   * @param {Object<string, string>} props
   * @return {string}
   */
  static props(props) {
    return Object.keys(props)
      .map(name => RuntimeGenerator.prop(name, props[name]))
      .join(',');
  }

  /**
   * @param {string} name
   * @param {string|number|Object|Array} value
   * @return {string}
   */
  static prop(name, value) {
    const val = shouldBeStringified(value) ? stringify(value) : value;
    return `"${name}":${val}`;
  }
}

module.exports = RuntimeGenerator;
