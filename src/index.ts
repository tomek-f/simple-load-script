export interface Config {
  url: string;
  attrs?: Record<string, string>;
  callBack?: ((scriptRef?: HTMLScriptElement) => void) | null;
  inBody?: boolean;
  insertInto?: string | null;
  removeScript?: boolean;
}

const defaultConfig = {
  url: '',
  attrs: {},
  callBack: null,
  inBody: false,
  insertInto: null,
  removeScript: false,
} satisfies Config;

export default function simpleLoadScript(
  config: (Config | string)[],
): Promise<(HTMLScriptElement | undefined)[]>;
export default function simpleLoadScript(
  config: Config | string,
): Promise<HTMLScriptElement | undefined>;
export default function simpleLoadScript(
  config: Config | string | (Config | string)[],
): Promise<HTMLScriptElement | undefined | (HTMLScriptElement | undefined)[]> {
  if (Array.isArray(config)) {
    return Promise.all(config.map(simpleLoadScript));
  }

  return new Promise((resolve, reject) => {
    if (
      !(
        (typeof config === 'object' && config.url) ||
        typeof config === 'string'
      )
    ) {
      console.log({ config });
      reject(new Error('Object with url or url string needed'));
      return;
    }

    const configProcessed: Required<Config> = Object.assign(
      {},
      defaultConfig,
      typeof config === 'string' ? { url: config } : config,
    );
    const { url, attrs, callBack, inBody, insertInto, removeScript } =
      configProcessed;
    const script = document.createElement('script');
    const where: HTMLElement | null = insertInto
      ? document.querySelector(insertInto)
      : inBody
      ? document.body
      : document.head;

    if (attrs && typeof attrs === 'object') {
      for (const attr of Object.keys(attrs)) {
        script.setAttribute(attr, attrs[attr]);
      }
    }

    console.log({ config, configProcessed });

    if (where == null) {
      reject(new Error('No DOM element to append script'));
      return;
    }

    script.addEventListener('load', () => {
      if (removeScript) {
        where.removeChild(script);
      }
      if (typeof callBack === 'function') {
        callBack(removeScript ? undefined : script);
      }
      resolve(removeScript ? undefined : script);
    });
    script.addEventListener('error', (err) => {
      console.log(err);
      if (removeScript) {
        where.removeChild(script);
      }
      reject(new Error('Loading script'));
    });
    script.src = url;
    where.appendChild(script);
  });
}
