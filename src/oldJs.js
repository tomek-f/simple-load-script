const glob = window;
const scripName = 'simpleLoadScript';
const globalCbsName = `_$_${scripName}CallBacks_$_`;
let counter = 0;
const uid = () => `script-${counter++}`;
const type = (obj) =>
  Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
const typeObj = (obj) => type(obj) === 'object';
const typeStr = (obj) => type(obj) === 'string';
const getCallBackObject = () => {
  glob[globalCbsName] = !typeObj(glob[globalCbsName])
    ? {}
    : glob[globalCbsName];
  return glob[globalCbsName];
};
const placementNode = (opts) => {
  if (opts.insertInto) {
    return document.querySelector(opts.insertInto);
  }
  return opts.inBody ? document.body : document.head;
};
const createScript = (opts) => {
  const script = document.createElement('script');

  if (opts.attrs && typeObj(opts.attrs)) {
    for (const attr of Object.keys(opts.attrs)) {
      script.setAttribute(attr, opts.attrs[attr]);
    }
  }
  return script;
};
const loadCallBack = (opts) => {
  if (opts.callBack && type(opts.callBack) === 'function') {
    opts.callBack();
  }
};
const loadRemoveScript = (removeScript, where, script) => {
  if (removeScript) {
    where.removeChild(script);
  }
};
const prepareCallBack = (opts) => {
  const callBackName = opts.callBackName;
  const url = opts.url;

  // todo add callback, get callback
  // opts.callBackParamName
  // no name -> get from url || add own
  // add callback to url -> add, rename, change value
  return [
    url,
    callBackName ? glob : getCallBackObject(),
    callBackName || uid(),
  ];
};
const getScriptDefaults = {
  jsonp: false,
  callBackParamName: 'callback', // unused
  removeScript: false,
  callBackName: null,
};

// todo ? url arrays
glob.getScript = function getScript(opts = {}) {
  if (arguments.length > 1) {
    return Promise.all([...arguments].map(getScript));
  }

  console.log('org opts', opts);

  const optsTypeStr = typeStr(opts);

  return new Promise((resolve, reject) => {
    if (!((typeObj(opts) && opts.url) || optsTypeStr)) {
      reject('Error: object with url or url string needed');
      return;
    }
    if (optsTypeStr) {
      opts = { url: opts };
    }
    opts = Object.assign({}, getScriptDefaults, opts);

    console.log('processed opts', opts);

    const where = placementNode(opts);

    if (!where) {
      reject('Error: no DOM element to append script');
      return;
    }

    const script = createScript(opts);
    const removeScript = opts.removeScript;
    const jsonp = opts.callBackName || opts.jsonp;
    /* breaks on loadScript({
  url: '//maps.googleapis.com/maps/api/js?&callback=gmapiready',
  callBackName: 'gmapiready'
}) */

    if (!jsonp) {
      script.addEventListener('load', () => {
        loadRemoveScript(removeScript, where, script);
        loadCallBack(opts);
        resolve(removeScript ? undefined : script);
      });
    } else {
      const [url, callBackObj, callBackName] = prepareCallBack(opts);

      console.log(url, callBackObj, callBackName);

      opts.url = url;
      callBackObj[callBackName] = (res) => {
        delete callBackObj[callBackName];
        loadRemoveScript(removeScript, where, script);
        loadCallBack(opts);
        resolve(res || removeScript ? undefined : script);
      };
    }
    script.addEventListener('error', () => {
      where.removeChild(script);
      reject('Error: loading script');
    });
    script.src = opts.url;
    where.appendChild(script);
  });
};
