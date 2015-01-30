var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);

if (isNode) {
  global.Promise = require('es6-promise').Promise;
}

var
  assert = require('./support/assert'),
  Runner = require('../lib/runner');


describe('runner', function () {
  it('should provide a run method', function() {
    var runner = new Runner();

    assert.notEqual(runner.run, null);
  });

  it('should return Promise for run', function() {
    var runner = new Runner();

    assert.notEqual(runner.run().then, null);
  });

  it('should run synchron task and return a value', function(done) {
    var
      runner = new Runner(),
      task = {
        application: function (a) { return a; },
        parameters: 'test'
      };

    runner.run(task)
      .then(function (result) {
        if (result === 'test') {
          done();
        } else {
          done('return value is wrong');
        }
      }, function () {
        done('error during running task');
      });
  });

  it('should run asynchron task and return a value', function(done) {
    var
      runner = new Runner(),
      task = {
        application: function (a, callback) { callback(a); },
        parameters: 'test'
      };

    runner.run(task)
      .then(function (result) {
        if (result === 'test') {
          done();
        } else {
          done('return value is wrong');
        }
      }, function () {
        done('error during running task');
      });
  });
});