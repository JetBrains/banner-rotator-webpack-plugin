/**
 * window.localStorage based storage to keep info about closed banners.
 */
export default class ClosedBannersStorage {
  constructor() {
    this.storageKey = 'webpack-banner-rotator-closed-banners';

    if (this.get() === null) {
      this.set([]);
    }
  }

  /**
   * @param {string} idsString
   * @return {Array<string>}
   */
  static parse(idsString) {
    return idsString.split(',');
  }

  /**
   * @param {Array<string>} idsArray
   * @return {string}
   */
  static stringify(idsArray) {
    return idsArray.join(',');
  }

  /**
   * @api
   */
  has(bannerId) {
    const val = this.get();
    return Array.isArray(val) ? val.includes(bannerId) : false;
  }

  /**
   * @api
   */
  add(bannerId) {
    const ids = this.get();
    ids.push(bannerId);
    this.set(ids);
  }

  /**
   * @return {Array<string>}
   */
  get() {
    const rawValue = window.localStorage.getItem(this.storageKey);
    const isNull = rawValue === null;
    const isEmpty = rawValue === '';
    let value;

    if (isNull) {
      value = null;
    } else if (!isNull && isEmpty) {
      value = [];
    } else {
      value = ClosedBannersStorage.parse(rawValue);
    }

    return value;
  }

  /**
   * @param {Array<string>} value
   */
  set(value) {
    window.localStorage.setItem(this.storageKey, ClosedBannersStorage.stringify(value));
  }
}
