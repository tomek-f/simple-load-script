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

    const {
      callback,
      placement,
      removeScript,
      runOriginalCallback,
      scriptAttr,
      url,
    } = options;

    if (placement.nodeType !== Node.ELEMENT_NODE) {
      reject(new Error(`'options.placement' must be a valid Node element.`));
      return;
    }

    const script = createScript(scriptAttr);

    if (!callback) {
      script.addEventListener('load', () => {
        resolve(script);
      });
    } else {
      if (!isType(callback, String) || new URL(url).searchParams.get('callback') !== callback) {
        reject(new Error(`'options.callback' must be a string (equal to 'callback' get param in url).`));
        return;
      }

      const callbackOrig = globThis[callback];

      if (runOriginalCallback && (!callbackOrig || !isType(callbackOrig, Function))) {
        reject(new Error(`To run original callback, '${callback}' must be a global function.`));
        return;
      }

      globThis[callback] = (resource) => {
        delete globThis[callback];
        if (removeScript) {
          script.remove();
        }
        if (runOriginalCallback) {
          resolve(callbackOrig(resource));
        } else {
          resolve(resource);
        }
      };
    }

    script.addEventListener('error', (ev) => {
      placement.remove(script);
      reject(ev);
    });
    script.src = url;
    placement.append(script);
  });
}
