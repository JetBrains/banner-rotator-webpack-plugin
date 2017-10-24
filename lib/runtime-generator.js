const path = require('path');

class RuntimeGenerator {
  static banners(banners, contextPath) {
    const runtime = banners.map(banner => RuntimeGenerator.banner(banner, contextPath));
    return `[${runtime}]`;
  }

  static banner(banner, contextPath) {
    const props = Object.keys(banner).reduce((acc, prop) => {
      acc[prop] = JSON.stringify(banner[prop]);
      return acc;
    }, {});

    const modulePath = path.resolve(contextPath, banner.entry);
    props.load = `function() { return import("${modulePath}"); }`;

    const runtime = RuntimeGenerator.props(props);
    return `{${runtime}}`;
  }

  static props(props) {
    return Object.keys(props)
      .map(name => RuntimeGenerator.prop(name, props[name]))
      .join(',');
  }

  static prop(name, value) {
    return `"${name}": ${value}`;
  }
}

module.exports = RuntimeGenerator;
