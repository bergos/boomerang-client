var
  fs = require('fs'),
  nodeExec = require('child_process').exec,
  path = require('path');


var copyModule = function (module, target) {
  var
    fullTarget = path.join(__dirname, target),
    modulePath = require.resolve(module);

  if (!fs.existsSync(fullTarget)) {
    exec('cp ' + modulePath + ' ' + fullTarget);
  }
};


var exec = function (command) {
  nodeExec(command, function (error, stdout, stderr) {
    if (error != null) {
      console.error('error running command: ' + error.stack);
      process.exit(error.code);
    }

    if (stderr.length !== 0) {
      console.error(stderr.toString());
      process.exit(1);
    }

    if (stdout.length !== 0) {
      console.log(stdout.toString());
    }
  });
};


var linkModule = function (module, target) {
  var
    fullTarget = path.join(__dirname, target),
    modulePath = path.relative(path.dirname(fullTarget), require.resolve(module));

  if (!fs.existsSync(fullTarget)) {
    exec('ln -s ' + modulePath + ' ' + fullTarget);
  }
};


var mkdir = function (dir) {
  dir = path.join(__dirname, dir);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};


var rmdir = function (dir) {
  dir = path.join(__dirname, dir);

  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir);
  }
};


var unlink = function (file) {
  file = path.join(__dirname, file);

  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
};


var toCopy = {
  'bootstrap/dist/css/bootstrap.css': 'dist/css/bootstrap.css',
  'bootstrap/dist/css/bootstrap.css.map': 'dist/css/bootstrap.css.map',
  'bootstrap/dist/fonts/glyphicons-halflings-regular.eot': 'dist/fonts/glyphicons-halflings-regular.eot',
  'bootstrap/dist/fonts/glyphicons-halflings-regular.svg': 'dist/fonts/glyphicons-halflings-regular.svg',
  'bootstrap/dist/fonts/glyphicons-halflings-regular.ttf': 'dist/fonts/glyphicons-halflings-regular.ttf',
  'bootstrap/dist/fonts/glyphicons-halflings-regular.woff': 'dist/fonts/glyphicons-halflings-regular.woff',
  'bootstrap/dist/fonts/glyphicons-halflings-regular.woff2': 'dist/fonts/glyphicons-halflings-regular.woff2',
  'bootstrap/dist/js/bootstrap.js': 'dist/js/bootstrap.js',
  'jquery/dist/jquery.js': 'dist/js/jquery.js',
  'rdf-interfaces': 'dist/js/rdf.js',
  'rdf-ext/dist/rdf-ext.js': 'dist/js/rdf-ext.js',
  'react/dist/react.js': 'dist/js/react.js',
  './lib/utils/request.js':'dist/js/request.js'
};


var clean = function () {
  unlink('dist/js/browser-client.js');
  unlink('dist/js/task-worker-bg.js');

  Object.keys(toCopy).forEach(function (source) {
    unlink(toCopy[source]);
  });

  rmdir('dist/css');
  rmdir('dist/fonts');
};


var build = function () {
  mkdir('dist/css');
  mkdir('dist/fonts');

  Object.keys(toCopy).forEach(function (source) {
    copyModule(source, toCopy[source]);
  });

  exec('./node_modules/.bin/browserify browser-client.js -o dist/js/browser-client.js');
  exec('./node_modules/.bin/browserify lib/browser/task-worker-bg.js -o dist/js/task-worker-bg.js');
};


switch(process.argv[2]) {
  case 'clean':
    clean();
    break;

  case 'build':
    build();
    break;

  default:
    clean();
    build();
}