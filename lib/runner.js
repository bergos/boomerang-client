var Runner = function () {
  this.run = function(task, context) {
    return new Promise(function (resolve) {
      resolve(task.application.bind(context)(task.parameters, resolve));
    });
  };
};


module.exports = Runner;