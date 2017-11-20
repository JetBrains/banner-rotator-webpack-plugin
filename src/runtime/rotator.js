import merge from 'merge-options';

import ClosedStorage from './closed-banners-storage';
import { isRangeContainsDate, globMatcher, normalizeBanners } from './utils';
import defaultConfig from './config';

/**
 * @typedef {Object} BannerRotatorContext
 * @property {Date} date
 * @property {string} location
 * @property {string} countryCode
 */

export default class BannerRotator {
  constructor(config = {}) {
    this.config = merge(defaultConfig, config);
    const { banners, closeEventName, closedBannersStorage, closedBannersStorageKey } = this.config;
    this.closedBannersStorage = closedBannersStorage || new ClosedStorage(closedBannersStorageKey);
    this.banners = normalizeBanners(banners || __BANNER_ROTATOR_BANNERS_CONFIG__); // eslint-disable-line no-undef
    this.handleBannerClose = this.handleBannerClose.bind(this);
    window.addEventListener(closeEventName, this.handleBannerClose);
  }

  /**
   * @param {BannerRotatorContext} [context]
   * @return {Promise<Array<Banner>>}
   */
  run(context) {
    const banners = this.getBanners(context);
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
  getBanners(context = {}) {
    const {
      date = new Date(),
      location = window.location.pathname,
      countryCode
    } = context;

    return this.banners.filter(banner => {
      const { id, disabled, start, end, locations, countries } = banner;
      const isClosed = id ? this.isBannerClosed(id) : false;
      const isDisabled = typeof disabled === 'boolean' ? disabled : false;
      const matchDate = isRangeContainsDate(start, end, date);
      const matchLocation = locations && location ? globMatcher(locations, location) : true;
      const matchCountry = countries && countryCode ? countries.indexOf(countryCode) > -1 : true;

      return !isClosed && !isDisabled && matchDate && matchLocation && matchCountry;
    });
  }

  /**
   * @param {string} bannerId
   * @return {boolean}
   */
  isBannerClosed(bannerId) {
    return this.closedBannersStorage.has(bannerId);
  }

  /**
   * @param {CustomEvent} e
   * @param {string} e.detail banner id
   * @private
   */
  handleBannerClose(e) {
    const bannerId = e.detail;
    if (!this.isBannerClosed(bannerId)) {
      this.closedBannersStorage.push(bannerId);
    }
  }

  /**
   * Detach close banner event and destroy closed banners storage
   */
  destroy() {
    window.removeEventListener(this.config.closeEventName, this.handleBannerClose);
    this.closedBannersStorage.destroy();
  }
}
