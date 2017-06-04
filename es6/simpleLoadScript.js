const scripName = 'simpleLoadScript';
const ownCallBacksName = `___${ scripName }CallBacks___`;
let counter = 0;

const uid = () => `script-${ counter++ }`;

const type = obj => Object.prototype.toString.call(obj)
  .slice(8, -1).toLowerCase();
const typeObj = obj => type(obj) === 'object';
const typeStr = obj => type(obj) === 'string';

const getCallBackObject = () => {
  window[ownCallBacksName] = !typeObj(window[ownCallBacksName]) ? {} : window[ownCallBacksName];
  return window[ownCallBacksName];
};

// const getUrlVar = (where, item) => {
//   const urlVar = (where.match(new RegExp('[?&]' + item + '=([^&]*)(&?)', 'i')) || [])[1];
//
//   return urlVar ? global.decodeURIComponent(urlVar) : undefined;
// };

const placementNode = options => {
  if (options.insertInto) {
    return document.querySelector(options.insertInto);
  }
  return options.inBody ? document.body : document.head;
};

const createScript = options => {
  const script = document.createElement('script');

  if (options.attrs && typeObj(options.attrs)) {
    for (const attr of Object.keys(options.attrs)) {
      script.setAttribute(attr, options.attrs[attr]);
    }
  }
  return script;
};

const loadCallBack = options => {
  if (options.callBack && type(options.callBack) === 'function') {
    options.callBack();
  }
};

const loadRemoveScript = (removeScript, where, script) => {
  if (removeScript) {
    where.removeChild(script);
  }
};

const prepareCallBack = options => {
  const callBackName = options.callBackName;
  const url = options.url;

  // todo add callback, get callback
  // options.callBackParamName
  // no name -> get from url || add own
  // add callback to url -> add, rename, change value
  return [url, callBackName ? window : getCallBackObject(), callBackName || uid()];
};

const getScriptDefaults = {
  jsonp: false,
  callBackParamName: 'callback',
  removeScript: false,
  callBackName: null
};

// url arrays
export default function getScript(options = {}) {
  if (arguments.length > 1) {
    return Promise.all([...arguments].map(getScript));
  }

  const optionsTypeStr = typeStr(options);

  return new Promise((resolve, reject) => {
    if (!(typeObj(options) && options.url || optionsTypeStr)) {
      reject('Error: object with url or url string needed');
      return;
    }
    if (optionsTypeStr) {
      options = { url: options };
    }
    options = Object.assign({}, getScriptDefaults, options);

    const where = placementNode(options);

    if (!where) {
      reject('Error: no DOM element to append script');
      return;
    }

    const script = createScript(options);
    const removeScript = options.removeScript;
    const jsonp = options.callBackName || options.jsonp;

    if (!jsonp) {
      script.addEventListener('load', () => {
        loadRemoveScript(removeScript, where, script);
        loadCallBack(options);
        resolve(removeScript ? undefined : script);
      });
    } else {
      const [url, callBackObj, callBackName] = prepareCallBack(options);

      options.url = url;
      callBackObj[callBackName] = res => {
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
