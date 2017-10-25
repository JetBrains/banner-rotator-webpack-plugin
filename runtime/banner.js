import dispatchCustomEvent from './utils/dispatch-custom-event';
import Events from './events';

export default class Banner {
  /**
   * @param {BannerConfig} config
   * @param {Object} [context]
   */
  constructor(config, context) {
    this.config = config;
    this.context = context;
  }

  close() {
    dispatchCustomEvent(Events.BANNER_CLOSE, this.config.id);
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }
}
