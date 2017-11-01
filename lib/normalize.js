const clone = require('clone');
const slug = require('url-slug');

function normalize(banners) {
  const normalized = clone(banners)
    // Skip banners without entry prop
    .filter(banner => 'entry' in banner);

  normalized.forEach(banner => {
    if (!banner.id) {
      banner.id = slug(banner.entry);
    }
  });

  return normalized;
}

module.exports = normalize;
