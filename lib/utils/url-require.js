(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./request'));
  } else {
    var urlRequire = factory(root.request);

    for (var key in urlRequire) {
      root[key] = urlRequire[key];
    }
  }
}(this, function (request) {
  var
    urlRequire = {},
    sources = {},
    objects = {},
    contextUrls = [''];

  var pathSplit = function (path) {
    var
      parts = path.split('/'),
      cleanParts = [];

    for (var i=0; i<parts.length; i++) {
      if (parts[i] === '') {
        continue;
      }

      if (parts[i] === '.') {
        continue;
      }

      cleanParts.push(parts[i]);
    }

    return cleanParts;
  };

  var pathMerge = function (partsA, partsB) {
    while (partsB[0] === '..' && partsA.length > 0) {
      partsA.pop();
      partsB.shift();
    }

    return partsA.concat(partsB);
  };

  var pathJoin = function (parts) {
    var merged = null;

    for (var i=0; i<parts.length; i++) {
      if (merged === null) {
        merged = parts[i];
      } else {
        merged += '/' + parts[i];
      }
    }

    return merged;
  };

  var urlJoin = function (baseUrl, path) {
    var
      hostPortRegex = new RegExp('^((http|https):\\/\\/?([^:\\/\\s])*(:[\\d]+)?)'),
      hostPort;

    baseUrl = baseUrl != null ? baseUrl.toString() : '';
    path = path != null ? path.toString() : '';

    // if second path is a URL don't join
    if (hostPortRegex.test(path)) {
      return path;
    }

    // if first path is a URL split host+port and path
    hostPort = hostPortRegex.exec(baseUrl);

    if (hostPort !== null) {
      hostPort = baseUrl.substr(0, hostPort[0].length+1);
      baseUrl = baseUrl.substr(hostPort.length);
    } else {
      hostPort = '';
    }

    return hostPort + pathJoin(pathMerge(pathSplit(baseUrl), pathSplit(path)));
  };

  var mapPath = function (path) {
    var url = path;

    if (!new RegExp('\.js$').test(path)) {
      url += '.js';
    }

    return url;
  };

  var compile = function (url) {
    var source =
      '(function(require){var module={exports:{}};\n\n' +
      sources[url] +
      '\n\nreturn module.exports;});\n\n' +
      '//# sourceURL=' + url;

    contextUrls.unshift(url.substr(0, url.lastIndexOf('/') + 1));

    try {
      objects[url] = eval(source)(urlRequire.require);
    } catch (error) {
      console.error('compile error (' + url + '): ' + error);
    }

    contextUrls.shift();
  };

  urlRequire.preload = function (path) {
    var url = mapPath(urlJoin(null, path));

    return request('GET', url).then(function (response) {
      sources[url] = response.content;
    });
  };

  urlRequire.require = function (path) {
    var url = mapPath(urlJoin(contextUrls[0], path));

    if (url in sources) {
      compile(url);
    }

    if (url in objects) {
      return objects[url];
    }

    return null;
  };

  return urlRequire;
}));