global.Promise = require('es6-promise').Promise;
global.rdf = require('rdf-interfaces');

require('rdf-ext')(global.rdf);
require('./lib/utils/request').request.acceptAllCerts = true;


var
  BoomerangClient = require('./lib/client'),
  client = new BoomerangClient();


var taskInfo = function (task) {
  var
    iri = '@id' in task ? task['@id'] : '',
    result = 'result' in task ? task.result : '';

  return '<' + iri + '> {' + JSON.stringify(result) + '}';
};

client.bind('queued', function (task) {
  console.log('queued: ' + taskInfo(task));
});

client.bind('started', function (task) {
  console.log('started: ' + taskInfo(task));
});

client.bind('finished', function (task) {
  console.log('finished:' + taskInfo(task));
});

client.loadTasks(process.argv[2])
  .then(function () {
    return client.run();
  })
  .then(function () {
    console.log('done');
  })
  .catch(function(error) {
    console.log(error.stack);
  });