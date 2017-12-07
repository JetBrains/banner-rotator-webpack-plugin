/* nyc ignore */
const crypto = require('crypto');

const slugify = require('url-slug');

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
      banner.id = slugify(banner.entry);
    }
  });

  return filtered;
}

/**
 * @param {Banner} banner
 * @param {Array<string>} fields
 * @return {string}
 */
function generateId(banner, fields = ['entry', 'id', 'startDate', 'endDate']) {
  const data = fields
    .filter(field => typeof banner[field] !== 'undefined')
    .map(field => JSON.stringify(banner[field]))
    .join('_');

  const id = crypto.createHash('md5').update(data).digest('hex');
  return id;
}

module.exports = processBanners;
module.exports.generateId = generateId;
