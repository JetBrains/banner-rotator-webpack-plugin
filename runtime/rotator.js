import merge from 'merge-options';

import ClosedBannersStorage from './closed-banners-storage';
import { isRangeContainsDate, globMatcher, parseDate } from './utils';

/**
 * @typedef {Object} BannerRotatorContext
 * @property {Date} date
 * @property {string} location
 * @property {string} countryCode
 */

const defaultConfig = {
  banners: undefined,
  closeEventName: 'webpack-banner-rotator-banner-close',
  closedBannersStorage: undefined
};

export default class BannerRotator {
  constructor(config = {}) {
    const cfg = merge(defaultConfig, config);

    this.closedBannersStorage = cfg.closedBannersStorage || new ClosedBannersStorage();
    this.banners = cfg.banners || __BANNER_ROTATOR_BANNERS_CONFIG__; // eslint-disable-line no-undef

    // normalize banners
    this.banners.forEach(banner => {
      banner.startDate = banner.startDate ? parseDate(banner.startDate) : null;
      banner.endDate = banner.endDate ? parseDate(banner.endDate) : null;
    });

    this.handleBannerClose = this.handleBannerClose.bind(this);
    window.addEventListener(cfg.closeEventName, this.handleBannerClose);
  }

  /**
   * @param {BannerRotatorContext} [context]
   * @return {Promise<Array<Banner>>}
   */
  run(context) {
    const banners = this.getMatchedBanners(context);
    const promises = banners.map(banner => banner.load()
      .then(module => (banner.module = module))
      .then(() => banner)
    );

    return Promise.all(promises);
  }

  /**
   * @param {BannerRotatorContext} [context]
   * @return {Array<Banner>}
   */
  getMatchedBanners(context = {}) {
    const {
      date = new Date(),
      location = window.location.pathname,
      countryCode
    } = context;

    return this.banners.filter(banner => {
      const { startDate, endDate, locations, countries } = banner;
      const wasClosed = this.isBannerWasClosed(banner.id);
      const matchDate = isRangeContainsDate(startDate, endDate, date);
      const matchLocation = locations && location ? globMatcher(locations, location) : true;
      const matchCountry = countries && countryCode ? countries.includes(countryCode) : true;

      return matchDate && matchLocation && matchCountry && !wasClosed;
    });
  }

  /**
   * @param {string} bannerId
   * @return {boolean}
   */
  isBannerWasClosed(bannerId) {
    return this.closedBannersStorage.has(bannerId);
  }

  /**
   * @param {CustomEvent} e
   * @param {string} e.detail banner id
   * @private
   */
  handleBannerClose(e) {
    const bannerId = e.detail;
    if (!this.isBannerWasClosed(bannerId)) {
      this.closedBannersStorage.add(bannerId);
    }
  }
}
