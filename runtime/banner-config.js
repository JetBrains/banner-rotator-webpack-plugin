import parseDate from './utils/parse-date';

function normalizeDate(date) {
  return typeof date === 'string' ? parseDate(date) : date;
}

export default class BannerConfig {
  /**
   * @param {Object} config
   * @param {string} config.id
   * @param {Function<Promise>} config.load
   * @param {string|Date} [config.startDate]
   * @param {string|Date} [config.endDate]
   * @param {Array<string>} [config.locations]
   * @param {Array<string>} [config.countries]
   * @param {string|Object} [config.data]
   */
  constructor(config) {
    this._config = config;

    const { id, startDate, endDate, locations, countries, data } = config;

    this.id = id;
    this.locations = locations;
    this.countries = countries;
    this.data = data;
    this.instance = null;

    if (typeof startDate !== 'undefined') {
      this.startDate = normalizeDate(startDate);
    }

    if (typeof endDate !== 'undefined') {
      this.endDate = normalizeDate(endDate);
    }
  }

  /**
   * @param {Date} date
   * @return {boolean}
   */
  matchDate(date = new Date()) {
    const start = this.startDate;
    const end = this.endDate;
    const time = date.getTime();
    const startTime = start && start.getTime();
    const endTime = end && end.getTime();
    const greaterThanStart = startTime ? time >= startTime : true;
    const lessThanEnd = endTime ? time <= endTime : true;
    return greaterThanStart && lessThanEnd;
  }

  /**
   * TODO glob or regexp support?
   * @param {string} location
   * @return {boolean}
   */
  matchLocation(location = window.location.pathname) {
    if (!this.locations) {
      return true;
    }
    return this.locations.some(loc => loc === location);
  }

  /**
   * @param {string} code
   * @return {boolean}
   */
  matchCountryCode(code) {
    if (!this.countries) {
      return true;
    }
    return this.countries.includes(code);
  }

  /**
   * @param {Object} contextInfo
   * @return {Promise<Banner>}
   */
  load(contextInfo) {
    return this._config.load().then(module => {
      const ModuleExport = typeof module.default === 'function' ? module.default : module;
      return typeof ModuleExport.create === 'function'
        ? ModuleExport.create(this, contextInfo)
        : new ModuleExport(this, contextInfo);
    }).then(m => {
      this.instance = m;
      return m;
    });
  }
}
