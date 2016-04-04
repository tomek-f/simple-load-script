/* global Promise */
'use strict';

export function deleteFromGlobal(name) {
  try {
    delete window[name];
  } catch (e) {
    window[name] = null;
  }
}

// array of urls or array of objects
export function all() {
  if (!arguments.length) return Promise.reject(new Error('No files or no file configs'));
  return Promise.all(Array.from(arguments).map(getScript));
}

export default function getScript(url, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof url === 'object') {
      options = url;
      url = options.url;
    }
    if (!url) reject('Error: no script url');
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
      script.addEventListener('load', e => {
        resolve([e.type, e, script]);
      });
    } else {
      window[callBackName] = () => {
        deleteFromGlobal(callBackName);
        resolve([script]);
      };
    }
    script.addEventListener('error', e => {
      where.removeChild(script);
      reject([e.type, e]);
    });
    script.src = url;
    where.appendChild(script);
  });
}
