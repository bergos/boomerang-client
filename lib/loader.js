var
  jsonld = require('jsonld'),
  request = require('./utils/request');


var Loader = function () {
  var self = this;

  this.loadTask = function (iri) {
    return request('GET', iri, {'Accept':'application/ld+json;q=1.0,application/json;q=0.9'}, null)
      .then(function (result) {
        return jsonld.promises.compact(JSON.parse(result.content), {
          '@vocab': 'https://ns.bergnet.org/boomerang#',
          'boomerang': 'https://ns.bergnet.org/boomerang#'
        });
      });
  };

  this.saveTask = function (task) {
    return request('PUT', task['@id'], {'Content-Type': 'application/ld+json'}, JSON.stringify(task))
      .then(function () { return task; });
  };

  this.loadTasks = function (iri) {
    return request('GET', iri, {'Accept':'application/ld+json;q=1.0,application/json;q=0.9'}, null)
      .then(function (result) {
        return jsonld.promises.compact(JSON.parse(result.content), {
          '@vocab': 'https://ns.bergnet.org/boomerang#',
          'boomerang': 'https://ns.bergnet.org/boomerang#'
        });
      })
      .then(function (graph) {
        if (!('hasTask' in graph)) {
          return Promise.resolve([]);
        }

        var
          tasks = Array.isArray(graph.hasTask) ? graph.hasTask : [graph.hasTask];
          loadTasks = [];

        tasks.forEach(function (task) {
          loadTasks.push(self.loadTask(task['@id']));
        });

        return Promise.all(loadTasks);
      });
  };
};


module.exports = Loader;