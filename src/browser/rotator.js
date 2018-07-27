import merge from 'merge-options';

import ClosedStorage from './closed-banners-storage';
import { isRangeContainsDate, globMatcher, normalizeBanners } from './utils';
import defaultConfig from './config';

/**
 * @typedef {Object} BannerRotatorFilterCriteria
 * @property {Date} date
 * @property {string} location
 * @property {string} countryCode
 */

export default class BannerRotator {
  constructor(config = {}) {
    const cfg = merge(defaultConfig, config);

    this.config = cfg;
    this.closedBannersStorage = cfg.closedBannersStorage || new ClosedStorage();
    this.banners = normalizeBanners(cfg.banners || __BANNER_ROTATOR_BANNERS_CONFIG__); // eslint-disable-line no-undef

    this._handleBannerClose = e => {
      this.closeBanner(e.detail);
    };

    window.addEventListener(cfg.closeEventName, this._handleBannerClose);
  }

  /**
   * @param {BannerRotatorFilterCriteria} [filterCriteria]
   * @return {Promise<Array<Banner>>}
   */
  run(filterCriteria) {
    const banners = this.getBanners(filterCriteria);
    const promises = banners.map(banner => banner.load()
      .then(module => (banner.module = module))
      .then(() => banner)
    );
    return Promise.all(promises);
  }

  /**
   * @param {BannerRotatorFilterCriteria} [filterCriteria]
   * @return {Array<Banner>}
   */
  getBanners(filterCriteria = {}) {
    const {
      date = new Date(),
      location = window.location.pathname,
      countryCode
    } = filterCriteria;

    return this.banners.filter(banner => {
      const { id, disabled, startDate, endDate, locations, countries } = banner;
      const isClosed = id ? this.isBannerClosed(id) : false;
      const isDisabled = typeof disabled === 'boolean' ? disabled : false;
      const matchDate = isRangeContainsDate(startDate, endDate, date);
      const matchLocation = locations && location ? globMatcher(locations, location) : true;
      const matchCountry = countries && countryCode ? globMatcher(countries, countryCode) : true;

      return !isClosed && !isDisabled && matchDate && matchLocation && matchCountry;
    });
  }

  /**
   * @param {string} id
   * @return {boolean}
   */
  isBannerClosed(id) {
    return this.closedBannersStorage.has(id);
  }

  /**
   * @param {string} id
   */
  closeBanner(id) {
    if (!this.isBannerClosed(id)) {
      this.closedBannersStorage.add(id);
    }
  }

  reset() {
    this.closedBannersStorage.clear();
  }

  /**
   * Detach close banner event and destroy closed banners storage
   */
  destroy() {
    window.removeEventListener(this.config.closeEventName, this._handleBannerClose);
    this.closedBannersStorage.destroy();
  }
}
