import createScript from './createScript';
import getGlobalThis from './getGlobalThis';
import isType from './isType';
import placementNode from './placementNode';
import uid from './uid';

const globThis = getGlobalThis;
const scripName = 'simpleLoadScript';
const globalCbsName = `_$_${ scripName }CallBacks_$_`;

const getCallBackObject = () => {
  globThis[globalCbsName] = !isType(globThis[globalCbsName], Object) ? {} : globThis[globalCbsName];
  return globThis[globalCbsName];
};

const loadCallBack = opts => {
  if (opts.callBack && isType(opts.callBack, Function)) {
    opts.callBack();
  }
};

const loadRemoveScript = (removeScript, where, script) => {
  if (removeScript) {
    where.removeChild(script);
  }
};
const prepareCallBack = opts => {
  const callBackName = opts.callBackName;
  const url = opts.url;

  // todo add callback, get callback
  // opts.callBackParamName
  // no name -> get from url || add own
  // add callback to url -> add, rename, change value
  return [url, callBackName ? globThis : getCallBackObject(), callBackName || uid()];
};
const getScriptDefaults = {
  jsonp: false,
  callBackParamName: 'callback',
  removeScript: false,
  callBackName: null
};

// todo url arrays
export default function getScript(opts = {}) {
  if (arguments.length > 1) {
    return Promise.all([...arguments].map(getScript));
  }

  const optsTypeStr = isType(opts, String);

  return new Promise((resolve, reject) => {
    if (!(isType(opts, Object) && opts.url || optsTypeStr)) {
      reject('Error: object with url or url string needed');
      return;
    }
    if (optsTypeStr) {
      opts = { url: opts };
    }
    opts = Object.assign({}, getScriptDefaults, opts);

    const where = placementNode(opts);

    if (!where) {
      reject('Error: no DOM element to append script');
      return;
    }

    const script = createScript(opts);
    const removeScript = opts.removeScript;
    const jsonp = opts.callBackName || opts.jsonp;

    if (!jsonp) {
      script.addEventListener('load', () => {
        loadRemoveScript(removeScript, where, script);
        loadCallBack(opts);
        resolve(removeScript ? undefined : script);
      });
    } else {
      const [url, callBackObj, callBackName] = prepareCallBack(opts);

      opts.url = url;
      callBackObj[callBackName] = res => {
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
}
