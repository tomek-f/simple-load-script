const scripName = 'simpleLoadScript';
const nonGlobalCbsName = `___${ scripName }CallBacks___`;

// todo if only one case (object, change it to one method)
const typeCheck = obj => Object.prototype.toString.call(obj)
  .slice(8, -1).toLowerCase();
const typeCheckObj = obj => typeCheck(obj) === 'object';

// const getCallBackObject = () => {
//   const globalScript = window[scripName];
//
//   if (globalScript) {
//     globalScript.callBacks = !typeCheckObj(globalScript.callBacks) ? {} || globalScript.callBacks;
//     return globalScript.callBacks;
//   } else {
//     window[nonGlobalCbsName] = !typeCheckObj(window[nonGlobalCbsName]) ? {} || window[nonGlobalCbsName];
//     return window[nonGlobalCbsName];
//   }
// };

// const getUrlVar = (where, item) => {
//   const urlVar = where.match(new RegExp('[?&]' + item + '=([^&]*)(&?)', 'i'));
//
//   return urlVar ? global.decodeURIComponent(urlVar[1]) : undefined;
// }

const placementNode = options => {
  if (options.insertInto) {
    return document.querySelector(options.insertInto);
  }
  return options.inBody ? document.body : document.head;
};

const scriptAttrs = (options, script) => {
  if (options.attrs && typeCheckObj(options.attrs)) {
    for (const attr of Object.keys(options.attrs)) {
      script.setAttribute(attr, options.attrs[attr]);
    }
  }
}

// const prepareCallBack = (url, options) => {
//   let callBackName = options.callBackName;
//   // const callBackObject = getCallBackObject(); // only for non-user names
//
//   // todo add callback, get callback
//   // options.calbackParamName
//   // no name -> get from url || add own
//   // add callback to url -> add, rename, change value
//   return [url, callBackName];
// };

export default function getScript(url, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeCheckObj(url)) {
      options = url;
      url = options.url;
    }
    if (!url) {
      reject('Error: no script url');
      return;
    }

    const where = placementNode(options);

    if (!where) {
      reject('Error: no DOM element to append script');
      return;
    }

    const script = document.createElement('script');
    const removeScript = options.removeScript;
    const useCallBack = options.callBackName || options.useCallBack;

    scriptAttrs(options, script);
    if (!useCallBack) {
      script.addEventListener('load', () => {
        if (removeScript) {
          where.removeChild(script);
        }
        resolve(removeScript ? undefined : script);
      });
    } else {
      // let callBack;
      // [callBack, url] = prepareCallBack(url, options);
      window[options.callBackName] = res => { // todo delete script own callbacks
        delete window[options.callBackName]; // todo delete script own callbacks
        if (removeScript) {
          where.removeChild(script);
        }
        resolve(res || removeScript ? undefined : script);
      };
    }
    script.addEventListener('error', () => {
      where.removeChild(script);
      reject('Error: loading script');
    });
    script.src = url;
    where.appendChild(script);
  });
}

function all() {
  if (!arguments.length) {
    return Promise.reject(new Error('No files or no file configs'));
  }
  return Promise.all([...arguments].map(e => Array.isArray(e) ? getScript(...e) : getScript(e)));
}

getScript.all = all;

