var Scheduler = function () {
  this.queue = [];

  this.enqueue = function(task) {
    this.queue.push(task);
  };

  this.next = function() {
    return this.queue.shift();
  };
};


module.exports = Scheduler;