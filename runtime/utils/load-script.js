import merge from 'deepmerge';

const defaultAttributes = {
  type: 'text/javascript',
  charset: 'utf-8',
  async: true
};

/**
 * @param {string} src
 * @param {Object<string, string>} [attributes] {@see defaultAttributes}
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Attributes
 * @return {Promise<HTMLScriptElement>}
 */
export default function loadScript(src, attributes = {}) {
  return new Promise((resolve, reject) => {
    /**
     * @this {HTMLScriptElement}
     */
    function onLoad() {
      this.onerror = this.onload = null;
      resolve(this);
    }

    /**
     * @this {HTMLScriptElement}
     */
    function onError() {
      this.onerror = this.onload = null;
      reject(this);
    }

    const attrs = merge.all([defaultAttributes, attributes, { src }]);
    const script = document.createElement('script');

    Object.keys(attrs).forEach(attr => (script[attr] = attrs[attr]));

    script.addEventListener('load', onLoad, false);
    script.addEventListener('error', onError, false);

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  });
}
