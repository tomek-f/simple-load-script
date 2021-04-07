import createScript from './createScript';
import defaultOptions from './defaultOptions';
import isType from './isType';

const globThis = typeof globalThis !== 'undefined' ? globalThis : window;

export default function simpleLoadScript(options = {}) {
  return new Promise((resolve, reject) => {
    if (isType(options, String)) {
      options = Object.assign({}, defaultOptions, {url: options});
    } else if (isType(options, Object) && options.url) {
      options = Object.assign({}, defaultOptions, options);
    } else {
      reject(new Error('Pass an url string or an object with url param'));
      return;
    }

    const {callback, callbackURLParamName} = options;

    if (options.placement.nodeType !== Node.ELEMENT_NODE) {
      reject(new Error(`'options.placement' must be a valid Node element.`));
      return;
    }

    const script = createScript(options.scriptAttr);

    if (!callback) {
      script.addEventListener('load', () => {
        resolve(script);
      });
    } else {
      const callbackURLParamValue = new URL(options.url).searchParams.get(callbackURLParamName);
      if (!callbackURLParamName || !isType(callbackURLParamName, String) || !callbackURLParamValue) {
        reject(new Error(`'options.callbackURLParamName' must be a string (equal to get param name in url).`));
        return;
      }

      if (!isType(callback, String) || callbackURLParamValue !== callback) {
        reject(new Error(`'options.callback' must be a string (equal to '${callbackURLParamValue}' in url).`));
        return;
      }

      const callbackOrig = globThis[callback];

      if (options.runOriginalCallback && (!callbackOrig || !isType(callbackOrig, Function))) {
        reject(new Error(`To run original callback, '${callback}' must be a global function.`));
        return;
      }

      globThis[callback] = (resource) => {
        delete globThis[callback];
        if (options.removeScript) {
          script.remove();
        }
        if (options.runOriginalCallback) {
          resolve(callbackOrig(resource));
        } else {
          resolve(resource);
        }
      };
    }

    script.addEventListener('error', reject);
    script.src = options.url;
    options.placement.append(script);
  });
}
