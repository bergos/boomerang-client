var
  MicroEvent = require('./utils/microevent'),
  Loader = require('./loader'),
  Scheduler = require('./scheduler'),
  TaskWorker = require('./task-worker');


var BoomerangClient = function (options) {
  var self = this;

  if (options == null) {
    options = {};
  }

  this.run = function () {
    var task = this.scheduler.next();

    if (task == null) {
      return;
    }

    task.status = {'@id':'boomerang:started'};
    self.trigger('started', task);

    this.taskWorker.run(task)
      .then(function (result) {
        task.result = result;
        task.status = {'@id': 'boomerang:finished'};

        return self.loader.saveTask(task);
      })
      .then(function (task) {
        self.trigger('finished', task);

        // next cycle
        self.run();
      }, function(error) {
        console.log(error);
      });
  };

  this.loadTask = function (iri) {
    return this.loader.loadTask(iri)
      .then(function (task) {
        self.enqueue(task);

        return task;
      });
  };

  this.loadTasks = function (iri) {
    return this.loader.loadTasks(iri)
      .then(function (tasks) {
        tasks.forEach(function (task) {
          self.enqueue(task);
        });

        return tasks;
      });
  };

  this.enqueue = function(task) {
    task.status = {'@id':'boomerang:queued'};
    self.trigger('queued', task);

    return self.scheduler.enqueue(task);
  };

  this.loader = 'loader' in options ? options.loader : new Loader();
  this.scheduler = 'scheduler' in options ? options.scheduler : new Scheduler();
  this.taskWorker = 'taskWorker' in options ? options.taskWorker : new TaskWorker();

  MicroEvent.mixin(this);
};


module.exports = BoomerangClient;