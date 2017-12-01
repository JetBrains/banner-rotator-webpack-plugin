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
    let rawValue = null;

    try {
      rawValue = window.localStorage.getItem(this.storageKey);
    } catch (e) {
      // nothing here
    }

    return !!rawValue ? JSON.parse(rawValue) : null; // eslint-disable-line no-extra-boolean-cast
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
  clear() {
    this.write([]);
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
