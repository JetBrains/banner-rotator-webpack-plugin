const clone = require('clone');
const slug = require('url-slug');

/**
 * @param {Array<BannerConfig>} banners
 * @param {Function} [bannerId]
 * @return {Array<BannerConfig>}
 */
function processBanners(banners, bannerId) {
  const idGenerator = typeof bannerId === 'function'
    ? bannerId
    : banner => banner.id || slug(banner.entry);

  // Immutability FTW!!!
  const filtered = clone(banners).filter(banner => {
    const hasEntry = 'entry' in banner;
    const isDisabled = typeof banner.disabled === 'boolean' ? banner.disabled : false;
    return hasEntry && !isDisabled;
  });

  // OH SHI~ ((
  filtered.forEach(banner => {
    banner.id = idGenerator(banner);
  });

  return filtered;
}

module.exports = processBanners;
