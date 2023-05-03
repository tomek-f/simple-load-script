// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ELO = Record<string, (...args: any[]) => any>;

declare global {
  interface Window {
    _$_simpleLoadScriptCallBacks_$_: ELO;
  }
}

export {};

export interface Options {
  callBack?: (() => void) | null;
  insertInto?: string | null;
  inBody?: boolean;
  callBackName?: string | null;
  callBackParamName?: string;
  jsonp?: boolean;
  placement: ParentNode;
  removeScript: boolean;
  attrs: Record<string, string>;
  url: string;
}

const defaultOptions = {
  callBack: null,
  insertInto: null,
  inBody: false,
  callBackName: null,
  callBackParamName: 'callback', // unused
  jsonp: false,
  placement: document.head,
  removeScript: false,
  attrs: {},
} satisfies Omit<Options, 'url'>;

const glob = window;
const globalCbsName = '_$_simpleLoadScriptCallBacks_$_';
let counter = 0;
const uid = () => `script-${counter++}`;

const getCallBackObject = () => {
  glob[globalCbsName] =
    typeof glob[globalCbsName] !== 'object' ? {} : glob[globalCbsName];
  return glob[globalCbsName];
};
const placementNode = (opts: Options) => {
  if (opts.insertInto) {
    return document.querySelector(opts.insertInto);
  }
  return opts.inBody ? document.body : document.head;
};
const createScript = (opts: Options) => {
  const script = document.createElement('script');

  if (opts.attrs && typeof opts.attrs === 'object') {
    for (const attr of Object.keys(opts.attrs)) {
      script.setAttribute(attr, opts.attrs[attr]);
    }
  }
  return script;
};
const loadCallBack = (opts: Options) => {
  if (opts.callBack && typeof opts.callBack === 'function') {
    opts.callBack();
  }
};
const loadRemoveScript = (
  removeScript: boolean,
  where: Element,
  script: HTMLScriptElement,
) => {
  if (removeScript) {
    where.removeChild(script);
  }
};
const prepareCallBack = (o: Options): [string, ELO, string] => {
  const callBackName = o.callBackName;
  const url = o.url;

  // todo add callback, get callback
  // opts.callBackParamName
  // no name -> get from url || add own
  // add callback to url -> add, rename, change value
  return [
    url,
    callBackName ? (glob as unknown as ELO) : getCallBackObject(),
    callBackName || uid(),
  ];
};

// todo ? url arrays
export default function simpleLoadScript(
  opts: Options | string,
): Promise<HTMLScriptElement | undefined | (HTMLScriptElement | undefined)[]> {
  if (arguments.length > 1) {
    return Promise.all(
      // eslint-disable-next-line prefer-rest-params
      [...arguments].map(
        simpleLoadScript as (
          opts?: Options | string,
        ) => Promise<HTMLScriptElement | undefined>,
      ),
    );
  }

  console.log('org options', opts);

  return new Promise((resolve, reject) => {
    if (!((typeof opts === 'object' && opts.url) || typeof opts === 'string')) {
      reject('Error: object with url or url string needed'); // todo proper error
      return;
    }
    const options: Options = Object.assign(
      {},
      defaultOptions,
      typeof opts === 'string' ? { url: opts } : opts,
    );

    console.log('processed options', options);

    const where = placementNode(options);

    if (!where) {
      reject('Error: no DOM element to append script'); // todo proper error
      return;
    }

    const script = createScript(options);
    const removeScript = options.removeScript;
    const jsonp = options.callBackName || options.jsonp;
    /* breaks on loadScript({
  url: '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
  callBackName: 'gmapiready'
}) */

    if (!jsonp) {
      script.addEventListener('load', () => {
        loadRemoveScript(removeScript, where, script);
        loadCallBack(options);
        resolve(removeScript ? undefined : script);
      });
    } else {
      const [url, callBackObj, callBackName] = prepareCallBack(options);

      console.log(url, callBackObj, callBackName);

      options.url = url;
      callBackObj[callBackName] = (res: unknown) => {
        delete callBackObj[callBackName];
        loadRemoveScript(removeScript, where, script);
        loadCallBack(options);
        resolve(res || removeScript ? undefined : script);
      };
    }
    script.addEventListener('error', () => {
      where.removeChild(script);
      reject('Error: loading script');
    });
    script.src = options.url;
    where.appendChild(script);
  });
}
