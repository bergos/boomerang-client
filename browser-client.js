var gui = {};

gui.statusText = function (task) {
  var
    hashIndex;

  if (!('status' in task)) {
    return '';
  }

  hashIndex = task.status['@id'].indexOf(':');

  if (hashIndex >= 0) {
    return task.status['@id'].substr(hashIndex + 1);
  }

  return task.status['@id'];
};

gui.taskHtml = function (task) {
  var
    id = task['@id'],
    result = 'result' in task ? task.result : '',
    status = gui.statusText(task);

  var cssStatus = function (status) {
    if (status === 'finished') {
      return 'success';
    } else {
      return 'info';
    }
  };

  return (
    '<tr resource="' + task['@id'] + '">' +
    '<td>' + id + '</td>' +
    '<td style="word-break:break-all;">' + result + '</td>' +
    '<td><div class="alert alert-' + cssStatus(status) + '" role="alert">' + status + '</div></td>' +
    '</tr>' );
};

gui.addTask = function (task) {
  $('#tasks').append(gui.taskHtml(task));
};

gui.updateTask = function (task) {
  var oldElement = $('[resource="' + task['@id'] + '"]');

  oldElement.after(gui.taskHtml(task));
  oldElement.remove();
};


var
  BoomerangClient = require('./lib/client'),
  BrowserTaskWorker = require('./lib/browser/task-worker'),
  config,
  client;


config = {
  taskWorker: new BrowserTaskWorker()
};

client = new BoomerangClient(config);

client.bind('queued', function (task) {
  gui.addTask(task);
});

client.bind('started', function (task) {
  gui.updateTask(task);
});

client.bind('finished', function (task) {
  gui.updateTask(task);
});

client.loadTasks('https://localhost:8443/apps/pi/data/schedule#list')
  .then(function () {
    client.run();
  })
  .then(function () {}, function(error) {
    console.log(error.stack);
  });