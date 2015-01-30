var
  exec = require('child_process').exec;


var watchify = function (source, target) {
  exec('/usr/bin/watchify ' + source + ' -o ' + target, function (error, stdout, stderr) {
    console.error(error);

    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
  });
};


watchify('browser-client.js', 'dist/js/browser-client.js');
watchify('lib/browser/task-worker-bg.js', 'dist/js/task-worker-bg.js');