function deleteFromGlobal(name) {
  try {
    delete window[name];
  } catch (e) {
    window[name] = null;
  }
}

function getScript(url, options) {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script');
    var attrs;
    var callBackName;
    if (!options) options = {};
    attrs = options.attrs;
    callBackName = options.callBackName;
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
      document.body.removeChild(script);
      reject([script, e.type, e]);
    });
    script.src = url;
    document.body.appendChild(script);
  });
}
