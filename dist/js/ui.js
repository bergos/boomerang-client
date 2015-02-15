var TaskList = React.createClass({
  getInitialState: function () {
    var self = this;

    var addTask = function (task) {
      var tasks = self.state.tasks;

      tasks.push(task);

      self.setState({tasks: tasks});
    };

    var updateTask = function (task) {
      var tasks = self.state.tasks;

      for (var i=0; i<self.state.tasks.length; i++) {
        if (tasks[i]['@id'] === task['@id']) {
          tasks[i] = task;

          self.setState({tasks: tasks});

          return;
        }
      }
    };

    self.props.client.bind('queued', function (task) {
      addTask(task);
    });

    self.props.client.bind('started', function (task) {
      updateTask(task);
    });

    self.props.client.bind('finished', function (task) {
      updateTask(task);
    });

    return {tasks: []};
  },
  componentDidMount: function () {
    $('#refresh').on('click', function () {
      location.reload();
    });
  },
  render: function () {
    var self = this;

    var head = React.DOM.thead({},
      React.DOM.tr({},
        React.DOM.th({className: 'col-xs-5'}, 'Task'),
        React.DOM.th({className: 'col-xs-6'}, 'Result'),
        React.DOM.th({className: 'col-xs-1'}, 'Status')));

    var statusCss = function (task) {
      var status = statusText(task);

      if (status === 'finished') {
        return 'success';
      }

      return '';
    };

    var statusText = function (task) {
      var status = task.status['@id'].split(':')

      if (status.length === 2) {
        return status[1];
      }

      return task.status['@id'];
    };

    var body = React.DOM.tbody({},
      self.state.tasks.map(function (task) {
        return React.DOM.tr({},
          React.DOM.td({}, React.DOM.a({href: task['@id']}, task['@id'])),
          React.DOM.td({style: {wordBreak: 'break-all'}}, 'result' in task ? task.result : ''),
          React.DOM.td({className: statusCss(task)}, statusText(task)));
      })
    );

    return React.DOM.table({className: 'table table-bordered'}, head, body);
  }
});

var createTaskList = React.createFactory(TaskList);