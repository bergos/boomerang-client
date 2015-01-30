Promise.all([
  preload('./support/assert'),
  preload('../lib/utils/request'),
  preload('../lib/runner'),
  preload('../lib/scheduler')
])
  .then(function () {
    var request = require('../lib/utils/request');

    var addTest = function (iri) {
      return request('GET', iri).then(function (response) {
        eval(response.content);
      });
    };

    mocha.setup('bdd');

    Promise.all([
      addTest('test-browser-require.js'),
      addTest('test-runner.js'),
      addTest('test-scheduler.js')
    ])
      .then(function () {
        mocha.run();
      });
  })
  .catch(function (error) {
     console.log(error.stack);
  });