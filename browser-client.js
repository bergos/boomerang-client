var
  BoomerangClient = require('./lib/client'),
  BrowserTaskWorker = require('./lib/browser/task-worker'),
  config,
  client;


config = {
  taskWorker: new BrowserTaskWorker()
};

client = new BoomerangClient(config);

clientUi = createTaskList({client: client});

React.render(clientUi, document.getElementById('task-list'));

client.start = function (scheduleIri) {
  client.loadTasks(scheduleIri)
    .then(function () {
      client.run();
    })
    .then(function () {}, function(error) {
      console.log(error.stack);
    });
};

window.boomerang = {
  client: client
};