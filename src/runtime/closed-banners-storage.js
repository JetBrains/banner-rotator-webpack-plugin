import defaultConfig from './config';

/**
 * localStorage based storage to keep info about closed banners
 */
export default class ClosedBannersStorage {
  constructor(key = defaultConfig.closedBannersStorageKey) {
    this.storageKey = key;

    if (this.getAll() === null) {
      this.write([]);
    }
  }

  /**
   * @param {Array<string>} data
   */
  write(data) {
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      // nothing here
    }
  }

  /**
   * @return {Array<string>|null}
   */
  getAll() {
    const rawValue = null;

    try {
      window.localStorage.getItem(this.storageKey);
    } catch (e) {
      // nothing here
    }

    return rawValue !== null ? JSON.parse(rawValue) : null;
  }

  /**
   * @public
   * @api
   * @return {boolean}
   */
  has(bannerId) {
    const closedBanners = this.getAll();
    return Array.isArray(closedBanners)
      ? closedBanners.indexOf(bannerId) > -1
      : false;
  }

  /**
   * @public
   * @api
   */
  add(bannerId) {
    const closedBanners = this.getAll();
    const alreadyExist = closedBanners.indexOf(bannerId) !== -1;

    if (!alreadyExist) {
      closedBanners.push(bannerId);
      this.write(closedBanners);
    }
  }

  /**
   * @public
   * @api
   */
  destroy() {
    try {
      window.localStorage.removeItem(this.storageKey);
    } catch (e) {
      // nothing here
    }
  }
}
