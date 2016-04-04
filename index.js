function deleteFromGlobal(name) {
  try {
    delete window[name];
  } catch (e) {
    window[name] = null;
  }
}

// array of urls or array of objects
function getAll() {
  if (!arguments.length) return Promise.reject(new Error('No file configs!'));
  return Promise.all(Array.prototype.slice.call(arguments).map(getScript));
}

function getScript(url, options) {
  return new Promise(function (resolve, reject) {
    if (typeof url === 'object') {
      options = url;
      url = options.url;
    }
    if (!options) options = {};
    if (!url) reject('Error: no script url');
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
      script.addEventListener('load', function(e) {
        resolve(script);
      });
    } else {
      window[callBackName] = function() {
        deleteFromGlobal(callBackName);
        resolve(script);
      };
    }
    script.addEventListener('error', function(e) {
      where.removeChild(script);
      reject('Error: loading script');
    });
    script.src = url;
    where.appendChild(script);
  });
}

getScript.deleteFromGlobal = deleteFromGlobal;
getScript.getAll = getAll;

module.exports = getScript;
