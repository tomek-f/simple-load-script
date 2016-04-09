'use strict';

export function deleteFromGlobal(name) {
  try {
    delete window[name];
  } catch (e) {
    window[name] = null;
  }
}

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
    let script = document.createElement('script');
    let where = options.inBody ? document.body : document.head;
    let attrs = options.attrs;
    let callBackName = options.callBackName;
    for (let attr in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
        script.setAttribute(attr, attrs[attr]);
      }
    }
    if (!callBackName) {
      script.addEventListener('load', () => {
        resolve(script);
      });
    } else {
      window[callBackName] = res => {
        deleteFromGlobal(callBackName);
        resolve(res || script);
      };
    }
    script.addEventListener('error', e => {
      where.removeChild(script);
      reject('Error: loading script');
    });
    script.src = url;
    where.appendChild(script);
  });
}

// array of urls or array of objects
export function all() {
  if (!arguments.length) return Promise.reject(new Error('No files or no file configs'));
  return Promise.all(Array.from(arguments).map(getScript));
}
