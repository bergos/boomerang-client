var
  assert = require('./support/assert'),
  Scheduler = require('../lib/scheduler');


describe('scheduler', function () {
  it('should accept a task using enqueue', function() {
    var scheduler = new Scheduler();

    scheduler.enqueue({});
  });

  it('should return null if there is no next task', function() {
    var scheduler = new Scheduler();

    assert.equal(scheduler.next(), null);
  });

  it('should return next task if queue is not empty', function() {
    var scheduler = new Scheduler();

    scheduler.enqueue({});

    assert.notEqual(scheduler.next(), null);
  });

  it('should return next task in added order (FIFO)', function() {
    var scheduler = new Scheduler();

    scheduler.enqueue({id:1});
    scheduler.enqueue({id:2});

    assert.deepEqual(scheduler.next(), {id:1});
    assert.deepEqual(scheduler.next(), {id:2});
  });
});