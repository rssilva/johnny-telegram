var commandList = ['list', 'listlimits', 'removelimit', 'call', 'value', 'minorthan', 'majorthan'];

var Interpreter = {
	resolve: function (command) {
    var words = [];

    command = command || '';

    command = command
        .toLowerCase()
        .trim();

    words = command.split(' ');

    return this.parse(words);
  },

  parse: function (words) {
    var parsed = {
      command: '',
      name: '',
      method: '',
      limitName: '',
      args: []
    };

    var command = words[0];
    var name = words[1];

    if (command && commandList.indexOf(command) != -1) {
      parsed.command = command;
    }

    if (name) {
      parsed.name = name;
    }

    if (command == 'call' && words[2]) {
      parsed.method = words[2];
    }

    if ((command == 'minorthan' || command == 'majorthan') && words[2]) {
      parsed.limitName = words[2];
      parsed.minutes = words[4] || 2;
    }

    parsed.args = this.getArgs(command, words);
    
    return parsed;
  },

  getArgs: function (command, words) {
    var args = [];

    if (command == 'call') {
      args = words.slice(3);
    }

    if (command == 'minorthan' || command == 'majorthan') {
      args = words.slice(3);
    }

    if (command == 'removelimit') {
      args = words.slice(2);
    }

    return args;
  }
}

module.exports = Interpreter
