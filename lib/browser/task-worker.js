var TaskWorker = function () {
  var self = this;

  this.worker = new Worker('js/task-worker-bg.js');
  this.callbacks = {};

  var finished = function (event) {
    if (event.data.type !== 'finished') {
      return;
    }

    self.callbacks[event.data.task['@id']](event.data.task.result);
  };

  this.run = function (task) {
    self.worker.onmessage = finished;

    return new Promise(function (resolve) {
      self.worker.postMessage({type:'started', task:task});
      self.callbacks[task['@id']] = resolve;
    });
  };
};


module.exports = TaskWorker;