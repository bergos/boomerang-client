importScripts(
  'rdf.js',
  'rdf-ext.js',
  'request.js');

onmessage = function (event) {
  if (event.data.type !== 'started') {
    return;
  }

  var
    TaskWorker = require('../task-worker'),
    taskWorker = new TaskWorker();

  taskWorker.run(event.data.task)
    .then(function (result) {
      postMessage({type:'finished',task:{'@id':event.data.task['@id'],result:result}});
    });
};