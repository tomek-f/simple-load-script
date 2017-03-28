(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.simpleLoadScript = factory();
  }
}(this, function () {
  var undef;

  function deleteFromGlobal(name) {
    try {
      delete window[name];
    } catch (e) {
      window[name] = null;
    }
  }

  function getScript(url, options) {
    return new Promise(function (resolve, reject) {
      if (typeof url === 'object') {
        options = url;
        url = options.url;
      }
      if (!options) options = {};
      if (!url) {
        reject('Error: no script url');
        return;
      }
      var script = document.createElement('script');
      var where = (function () {
        if (options.insertInto) {
          return document.querySelector(options.insertInto);
        }
        return options.inBody ? document.body : document.head;
      }());
      if (!where) {
        reject('Error: no DOM element to append script');
        return;
      }
      var attrs = options.attrs;
      var removeScript = options.removeScript;
      var callBackName = options.callBackName;
      for (var attr in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, attr)) {
          script.setAttribute(attr, attrs[attr]);
        }
      }
      if (!callBackName) {
        script.addEventListener('load', function () {
          if (removeScript) where.removeChild(script);
          resolve(removeScript ? undef : script);
        });
      } else {
        window[callBackName] = function (res) {
          if (!res) res = removeScript ? undef : script;
          if (!options.dontRemoveCallBack) deleteFromGlobal(callBackName);
          if (removeScript) where.removeChild(script);
          resolve(res || removeScript ? undef : script);
        };
      }
      script.addEventListener('error', function () {
        where.removeChild(script);
        reject('Error: loading script');
      });
      script.src = url;
      where.appendChild(script);
    });
  }

  // array of urls or array of objects
  function all() {
    if (!arguments.length) return Promise.reject(new Error('No files or no file configs'));
    return Promise.all(Array.prototype.slice.call(arguments).map(function (e) {
      return Array.isArray(e) ? getScript.apply(null, e) : getScript(e);
    }));
  }

  getScript.deleteFromGlobal = deleteFromGlobal;
  getScript.all = all;

  return getScript;
}));
