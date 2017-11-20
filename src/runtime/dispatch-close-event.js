import dispatchCustomEvent from './utils/dispatch-custom-event';
import defaultConfig from './config';

/**
 * @param {string} bannerId
 * @param {string} [eventName]
 */
export default function dispatchCloseEvent(bannerId, eventName = defaultConfig.closeEventName) {
  dispatchCustomEvent(eventName, bannerId);
}
