var
  Linker = require('./linker'),
  Runner = require('./runner'),
  TaskContext = require('./task-context');


var TaskWorker = function () {
  var self = this;

  this.context = new TaskContext();
  this.linker = new Linker();
  this.runner = new Runner();

  this.run = function (task) {
    return self.linker.link(task)
      .then(function (loadedTask) {
        return self.runner.run(loadedTask, self.context);
      });
  };
};


module.exports = TaskWorker;