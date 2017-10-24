import dispatchCustomEvent from './utils/dispatch-custom-event';
import Events from './events';

export default class Banner {
  /**
   * @param {BannerConfig} config
   * @param {Object} [contextInfo]
   */
  constructor(config, contextInfo) {
    this.config = config;
    this.contextInfo = contextInfo;
  }

  close() {
    dispatchCustomEvent(Events.BANNER_CLOSE, this.config.id);
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }
}
