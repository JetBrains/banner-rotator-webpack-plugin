const clone = require('clone');
const slug = require('url-slug');

function normalize(banners) {
  const normalized = clone(banners)
    .filter(banner => {
      const hasEntry = 'entry' in banner;
      const disabled = typeof banner.disabled === 'boolean' ? banner.disabled : false;
      return hasEntry && !disabled;
    });

  normalized.forEach(banner => {
    if (!banner.id) {
      banner.id = slug(banner.entry);
    }
  });

  return normalized;
}

module.exports = normalize;
