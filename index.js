function deleteFromGlobal(name) {
  try {
    delete window[name];
  } catch (e) {
    window[name] = null;
  }
}

function getScript(url, options) {
  return new Promise((resolve, reject) => {
    if (!options) options = {};
    var script = document.createElement('script');
    var where = options.inBody ? document.body : document.head;
    var attrs = options.attrs;
    var callBackName = options.callBackName;
    for (var attr in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
        script.setAttribute(attr, attrs[attr]);
      }
    }
    if (!callBackName) {
      script.addEventListener('load', e => {
        resolve([script, e.type, e]);
      });
    } else {
      window[callBackName] = function() {
        deleteFromGlobal(callBackName);
        resolve([script]);
      };
    }
    script.addEventListener('error', e => {
      where.removeChild(script);
      reject([script, e.type, e]);
    });
    script.src = url;
    where.appendChild(script);
  });
}
