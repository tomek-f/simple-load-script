// import querystring from 'querystring-es3';

export default function getScript(url, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof url === 'object') {
      options = url;
      url = options.url;
    }
    if (!url) {
      reject('Error: no script url');
      return;
    }

    const script = document.createElement('script');
    const where = (() => {
      if (options.insertInto) {
        return document.querySelector(options.insertInto);
      }
      return options.inBody ? document.body : document.head;
    })();

    if (!where) {
      reject('Error: no DOM element to append script');
      return;
    }

    const attrs = options.attrs;
    const removeScript = options.removeScript;
    const callBackName = options.callBackName;

    for (const attr in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
        script.setAttribute(attr, attrs[attr]);
      }
    }
    if (!callBackName) {
      script.addEventListener('load', () => {
        if (removeScript) where.removeChild(script);
        resolve(removeScript ? undefined : script);
      });
    } else {
      window[callBackName] = res => {
        if (!res) {
          res = removeScript ? undefined : script;
        }
        if (!options.dontRemoveCallBack) {
          delete window[callBackName];
        }
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

