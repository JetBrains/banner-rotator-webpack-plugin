/**
 * window.localStorage based storage to keep info about closed banners.
 */
export default class ClosedBannersStorage {
  constructor(key) {
    this.storageKey = key;

    if (this.getAll() === null) {
      this._write([]);
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
   * @private
   * @param {Array<string>} data
   */
  _write(data) {
    window.localStorage.setItem(this.storageKey, ClosedBannersStorage.stringify(data));
  }

  /**
   * @return {Array<string>}
   */
  getAll() {
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
   * @api
   */
  has(bannerId) {
    const val = this.getAll();
    return Array.isArray(val) ? val.indexOf(bannerId) > -1 : false;
  }

  /**
   * @api
   */
  push(bannerId) {
    const ids = this.getAll();
    ids.push(bannerId);
    this._write(ids);
  }

  /**
   * @api
   */
  destroy() {
    window.localStorage.removeItem(this.storageKey);
  }
}
