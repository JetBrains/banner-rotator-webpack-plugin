const path = require('path');

const slash = require('slash');

/**
 * @typedef {Object<string, string|number|Array|Object>} BannerData
 */

const stringify = JSON.stringify;

class RuntimeGenerator {
  static loadBanner(banner, contextPath) {
    const modulePath = slash(path.resolve(contextPath, banner.entry));
    return `function() {
      return new Promise(function(resolve) {
        require.ensure([], function(require) {
          resolve(require("${modulePath}"));
        });
      });
    }`;
  }

  /**
   * @param {Array<BannerData>} banners
   * @param {string} contextPath
   * @return {string}
   */
  static banners(banners, contextPath) {
    const runtime = banners
      .map(banner => RuntimeGenerator.banner(banner, contextPath))
      .join(',');
    return `[${runtime}]`;
  }

  /**
   * @param {BannerData} banner
   * @param {string} [contextPath]
   * @return {string}
   */
  static banner(banner, contextPath) {
    const props = Object.keys(banner).reduce((acc, prop) => {
      if (prop !== 'entry') {
        acc[prop] = stringify(banner[prop]);
      }
      return acc;
    }, {});

    props.load = RuntimeGenerator.loadBanner(banner, contextPath);

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
    const val = typeof value !== 'string' ? stringify(value) : value;
    return `"${name}":${val}`;
  }
}

module.exports = RuntimeGenerator;
