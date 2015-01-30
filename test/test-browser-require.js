var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);

if (!isNode) {
  describe('browser-require', function () {
    it('preload should reject on missing file', function (done) {
      preload('./support/require-missing')
        .then(function () {
          done('reached resolve branch');
        }, function () {
          done();
        });
    });

    it('preload should resolve on existing file', function (done) {
      preload('./support/require-one')
        .then(function () {
          done();
        }, function () {
          done('reached reject branch');
        });
    });

    it('require should return null on missing file', function (done) {
      preload('./support/require-missing')
        .then(function () {
          var missing = require('./support/require-missing');

          done(missing == null ? null : 'missing is not null');
        }, function () {
          var missing = require('./support/require-missing');

          if (missing == null) {
            done();
          } else {
            done('missing is not null');
          }
        });
    });

    it('require should return function of existing file', function (done) {
      preload('./support/require-one')
        .then(function () {
          var one = require('./support/require-one');

          if (typeof one === 'function') {
            done();
          } else {
            done('return value is not a function');
          }
        }, function () {
          done('reached reject branch');
        });
    });

    it('require should return the function contained in the file', function (done) {
      Promise.all([
        preload('./support/require-one'),
        preload('./support/require-two')
      ])
        .then(function () {
          var one = require('./support/require-one');

          if (one(2, 3) === 5) {
            done();
          } else {
            done('return value is not the sum of 2 & 3');
          }
        }, function () {
          done('reached reject branch');
        });
    });
  });
}