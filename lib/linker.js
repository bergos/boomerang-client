var
  urlRequire = require('./utils/url-require');


var Linker = function () {
  var self = this;

  this.preload = function (task) {
    var preloads = [];

    if (typeof task.application === 'object' && '@id' in task.application) {
      preloads.push(urlRequire.preload(task.application['@id']));
    }

    if ('dependency' in task) {
      var dependencies = task.dependency;

      if (!Array.isArray(dependencies)) {
        dependencies = [dependencies];
      }

      for (var i=0; i<dependencies.length; i++) {
        if ('@id' in dependencies[i]) {
          preloads.push(urlRequire.preload(dependencies[i]['@id']));
        }
      }
    }

    return Promise.all(preloads);
  };

  this.link = function (task) {
    return new Promise(function (resolve) {
      if (typeof task.application !== 'object') {
        return resolve(task);
      }

      if ('@id' in task.application) {
        return self.preload(task)
          .then(function () {
            task.application = urlRequire.require(task.application['@id']);

            resolve(task);
          });
      } else if ('@type' in task.application) {
        if (task.application['@type'] === 'https://ns.bergnet.org/boomerang#JavaScriptCode') {
          task.application = eval(task.application['@value']);
        }

        resolve(task);
      }
    });
  };
};


module.exports = Linker;