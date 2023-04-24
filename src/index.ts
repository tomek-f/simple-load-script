function createScript(scriptAttr: Record<string, string>): HTMLScriptElement {
  const script = document.createElement('script');

  for (const attr of Object.keys(scriptAttr)) {
    script.setAttribute(attr, scriptAttr[attr]);
  }

  return script;
}

export interface Options {
  callback: string | null;
  callbackURLParamName: string;
  placement: ParentNode;
  removeScript: boolean;
  runOriginalCallback: boolean;
  scriptAttr: Record<string, string>;
  url: string;
}

const defaultOptions = {
  callback: null,
  callbackURLParamName: 'callback',
  placement: document.head,
  removeScript: false,
  runOriginalCallback: false,
  scriptAttr: {},
} as Omit<Options, 'url'>;

const globThis = typeof globalThis !== 'undefined' ? globalThis : window;

export default function simpleLoadScript(
  options: string,
): Promise<HTMLScriptElement>;
export default function simpleLoadScript(
  options: Partial<Omit<Options, 'callback'>> & {
    callback: never | null | undefined;
    url: Options['url'];
  },
): Promise<HTMLScriptElement>;
export default function simpleLoadScript(
  options: Partial<Options> & { callback: string; url: Options['url'] },
): Promise<HTMLScriptElement>;
export default function simpleLoadScript(
  options: string | (Partial<Options> & { url: Options['url'] }),
): Promise<HTMLScriptElement | unknown> {
  return new Promise((resolve, reject) => {
    const normalizedOptions =
      typeof options === 'string' ? { url: options } : options;
    const fullOptions = Object.assign({}, defaultOptions, normalizedOptions);

    const { callback, callbackURLParamName } = fullOptions;
    const script = createScript(fullOptions.scriptAttr);

    if (!callback) {
      script.addEventListener('load', () => {
        resolve(script);
      });
    } else {
      // eslint-disable-next-line max-len
      // TODO revert URL https://github.com/tomek-f/simple-load-script/tree/16b10a058804bae8ef7cecedbb779587a1f283b9
      // JSONP
      const callbackURLParamValue = new URL(fullOptions.url).searchParams.get(
        callbackURLParamName,
      );

      if (
        !callbackURLParamName ||
        typeof callbackURLParamName !== 'string' ||
        !callbackURLParamValue
      ) {
        throw new Error(
          // eslint-disable-next-line max-len
          `'options.callbackURLParamName' must be a string (equal to get param name in url).`,
        );
      }

      const rawCallbackOrig = (globThis as Record<string, unknown>)[callback];
      let callbackOrig: ((resource: unknown) => unknown) | null = null;
      if (fullOptions.runOriginalCallback) {
        if (typeof rawCallbackOrig !== 'function') {
          throw new Error(
            // eslint-disable-next-line max-len
            `To run original callback, '${callback}' must be a global function.`,
          );
        }
        callbackOrig = rawCallbackOrig as (resource: unknown) => unknown;
      }

      (globThis as Record<string, unknown>)[callback] = (
        resource: unknown,
      ): void => {
        delete (globThis as Record<string, unknown>)[callback];
        if (fullOptions.removeScript) {
          script.remove();
        }
        if (callbackOrig) {
          resolve(callbackOrig(resource));
        } else {
          resolve(resource);
        }
      };
    }

    script.addEventListener('error', reject);
    script.src = fullOptions.url;
    fullOptions.placement.append(script);
  });
}
