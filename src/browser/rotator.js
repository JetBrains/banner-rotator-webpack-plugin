import merge from 'merge-options';

import ClosedStorage from './closed-banners-storage';
import globMatcher from './glob-matcher';
import * as defaultConfig from './config';

/**
 * @typedef {Object} BannerRotatorFilterCriteria
 * @property {Date} date
 * @property {string} location
 * @property {string} countryCode
 */

export default class BannerRotator {
  /**
   * @return {Date}
   */
  static getUTCDate() {
    const now = new Date();
    return new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
  }

  /**
   * @param {Date} [rangeStart]
   * @param {Date} [rangeEnd]
   * @param {Date} date
   * @return {boolean}
   */
  static isRangeContainsDate(rangeStart, rangeEnd, date) {
    const time = date.getTime();
    const startTime = rangeStart && rangeStart.getTime();
    const endTime = rangeEnd && rangeEnd.getTime();
    const greaterThanStart = startTime ? time >= startTime : true;
    const lessThanEnd = endTime ? time <= endTime : true;
    return greaterThanStart && lessThanEnd;
  }

  constructor(config = {}) {
    const cfg = merge(defaultConfig, config);

    this.config = cfg;
    this.closedBannersStorage = cfg.closedBannersStorage || new ClosedStorage();
    this.banners = cfg.banners || __BANNER_ROTATOR_BANNERS_CONFIG__; // eslint-disable-line no-undef

    this.banners.forEach(b => {
      if (typeof b.startDate === 'string') {
        b.startDate = new Date(b.startDate);
      }

      if (typeof b.endDate === 'string') {
        b.endDate = new Date(b.endDate);
      }
    });

    this._handleBannerClose = e => this.closeBanner(e.detail);
    window.addEventListener(cfg.closeEventName, this._handleBannerClose);
  }

  /**
   * @param {BannerRotatorFilterCriteria} [filterCriteria]
   * @return {Promise<Banner[]>}
   */
  run(filterCriteria) {
    const banners = this.filterBanners(filterCriteria);
    const promises = banners.map(banner => banner.load()
      .then(module => (banner.module = module))
      .then(() => banner)
    );
    return Promise.all(promises);
  }

  /**
   * @param {BannerRotatorFilterCriteria} [criteria]
   * @return {Array<Banner>}
   */
  filterBanners(criteria = {}) {
    const {
      date = BannerRotator.getUTCDate(),
      location = window.location.pathname,
      countryCode
    } = criteria;

    return this.banners.filter(banner => {
      const { id, disabled, startDate, endDate, locations, countries } = banner;
      const isClosed = id ? this.isBannerClosed(id) : false;
      const isDisabled = typeof disabled === 'boolean' ? disabled : false;
      const matchDate = BannerRotator.isRangeContainsDate(startDate, endDate, date);
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
