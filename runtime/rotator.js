import merge from 'deepmerge';

import Events from './events';
import BannerConfig from './banner-config';
import ClosedBannersStorage from './closed-banners-storage';

const defaultConfig = {
  countryCode: null,
  closedBannersStorage: new ClosedBannersStorage()
};

export default class BannerRotator {
  constructor(config = {}) {
    this.config = merge(defaultConfig, config);

    // eslint-disable-next-line new-cap
    this.closedBannersStorage = this.config.closedBannersStorage;

    const banners = Array.isArray(config.banners)
      ? config.banners
      : __BANNER_ROTATOR_BANNERS_CONFIG__; // eslint-disable-line no-undef

    this.banners = banners.map(cfg => new BannerConfig(cfg));

    this._handleBannerClose = this._handleBannerClose.bind(this);
    window.addEventListener(Events.BANNER_CLOSE, this._handleBannerClose);
  }

  /**
   * @return {Promise<Array<Banner>>}
   */
  run() {
    const context = {
      date: new Date(),
      location: window.location.pathname,
      countryCode: this.config.countryCode
    };

    const banners = this.getMatchedBanners(context);
    return Promise.all(banners.map(b => b.load(context)));
  }

  /**
   * @param {Object} [criteria]
   * @param {Date} [criteria.date]
   * @param {string} [criteria.location]
   * @param {string} [criteria.countryCode]
   * @return {Array<BannerConfig>}
   */
  getMatchedBanners(criteria = {}) {
    const {
      date = new Date(),
      location = window.location.pathname,
      countryCode = this.config.countryCode
    } = criteria;

    return this.banners.filter(banner => (
      banner.matchDate(date) &&
      banner.matchLocation(location) &&
      banner.matchCountryCode(countryCode) &&
      !this.isBannerWasClosed(banner.id)
    ));
  }

  isBannerWasClosed(bannerId) {
    return this.closedBannersStorage.has(bannerId);
  }

  /**
   * @param {CustomEvent} e
   * @param {string} e.detail banner id
   * @private
   */
  _handleBannerClose(e) {
    const bannerId = e.detail;
    if (!this.isBannerWasClosed(bannerId)) {
      this.closedBannersStorage.add(bannerId);
    }
  }
}
