const crypto = require('crypto');

/**
 * @param {Array<Banner>} banners
 * @return {Array<Banner>}
 */
function processBanners(banners) {
  const filtered = banners.filter(banner => {
    const hasEntry = 'entry' in banner;
    const isDisabled = typeof banner.disabled === 'boolean' ? banner.disabled : false;
    return hasEntry && !isDisabled;
  });

  filtered.forEach(banner => {
    if (typeof banner.id === 'undefined') {
      banner.id = generateId(banner);
    }
  });

  return filtered;
}

/**
 * @param {Banner} banner
 * @return {string}
 */
function generateId(banner) {
  const fields = ['entry', 'id', 'start', 'end', 'locations', 'countries'];
  const data = fields.reduce((acc, field) => {
    if (typeof banner[field] !== 'undefined') {
      acc[field] = banner[field];
    }
    return acc;
  }, {});

  const stringified = JSON.stringify(data);
  const id = crypto.createHash('md5').update(stringified).digest('hex');
  return id;
}

module.exports = processBanners;
