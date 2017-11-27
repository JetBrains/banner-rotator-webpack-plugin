/**
 * @param {string} name
 * @param {*} data
 */
export default function dispatchCustomEvent(name, data) {
  let event;

  if (window.CustomEvent) {
    event = new CustomEvent(name, { detail: data });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(name, false, false, data);
  }

  window.dispatchEvent(event);
}
