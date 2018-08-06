import { closeEventName } from './config';

/**
 * @param {string} bannerId
 * @param {string} [eventName]
 */
export default function dispatchCloseEvent(bannerId, eventName = closeEventName) {
  let event;

  if (window.CustomEvent) {
    event = new CustomEvent(eventName, { detail: bannerId });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, false, false, bannerId);
  }

  window.dispatchEvent(event);
}
