import merge from 'deepmerge';

import ClosedBannersStorage from './closed-banners-storage';
import { isRangeContainsDate, globMatcher, parseDate } from './utils';

const defaultConfig = {
  closeEventName: 'webpack-banner-rotator-banner-close',
  closedBannersStorage: new ClosedBannersStorage()
};

export default class BannerRotator {
  constructor(config = {}) {
    this.config = merge(defaultConfig, config);

    const banners = Array.isArray(config.banners)
      ? config.banners
      : __BANNER_ROTATOR_BANNERS_CONFIG__; // eslint-disable-line no-undef

    banners.forEach(banner => {
      banner.startDate = banner.startDate ? parseDate(banner.startDate) : null;
      banner.endDate = banner.endDate ? parseDate(banner.endDate) : null;
    });

    this.banners = banners;

    this.handleBannerClose = this.handleBannerClose.bind(this);
    window.addEventListener(this.config.closeEventName, this.handleBannerClose);
  }

  /**
   * @return {Promise<Array<Banner>>}
   */
  run(context = {}) {
    const ctx = merge({
      date: new Date(),
      location: window.location.pathname
    }, context);

    const banners = this.getMatchedBanners(ctx);
    const promises = banners.map(banner => banner.load()
      .then(module => banner.module = module) // eslint-disable-line no-return-assign
      .then(() => banner)
    );

    return Promise.all(promises);
  }

  /**
   * @param {Object} [criteria]
   * @param {Date} [criteria.date]
   * @param {string} [criteria.location]
   * @param {string} [criteria.countryCode]
   * @return {Array<Banner>}
   */
  getMatchedBanners(criteria = {}) {
    return this.banners.filter(banner => {
      const { startDate, endDate, locations, countries } = banner;

      const wasClosed = this.isBannerWasClosed(banner.id);
      const matchDate = isRangeContainsDate(startDate, endDate, criteria.date);

      const matchLocation = locations && criteria.location
        ? globMatcher(locations, criteria.location)
        : true;

      const matchCountry = countries && criteria.countryCode
        ? countries.includes(criteria.countryCode)
        : true;

      return matchDate && matchLocation && matchCountry && !wasClosed;
    });
  }

  /**
   * @param {string} bannerId
   * @return {boolean}
   */
  isBannerWasClosed(bannerId) {
    return this.config.closedBannersStorage.has(bannerId);
  }

  /**
   * @param {CustomEvent} e
   * @param {string} e.detail banner id
   * @private
   */
  handleBannerClose(e) {
    const bannerId = e.detail;
    if (!this.isBannerWasClosed(bannerId)) {
      this.config.closedBannersStorage.add(bannerId);
    }
  }
}
