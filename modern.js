export function deleteFromGlobal(name) {
  try {
    delete window[name];
  } catch (e) {
    window[name] = null;
  }
}

export default function getScript(url, options = {}) {
  return new Promise((resolve, reject) => {
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
