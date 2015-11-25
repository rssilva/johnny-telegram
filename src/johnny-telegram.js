'strict mode'

var five = require('johnny-five');
var interpreter = require('./interpreter');

var JohnnyTelegram = {
  init: function (bot) {
    this.bot = bot;

    this.peripherals = {};
    this.values = {};
    this.limits = {};
  },

  add: function (name, peripheral) {
  	this.peripherals[name] = peripheral;
  },

  list: function () {
  	var arr = Object.keys(this.peripherals);

  	return arr.join(', ');
  },

  listLimits: function () {
    var peripherals = Object.keys(this.limits);
    var str = 'limits: \n';

    peripherals.forEach(function (peripheralName) {
      str += peripheralName + ': '

      str += Object.keys(this.limits[peripheralName]).join(', ');

      str += '\n';
    }.bind(this));

    return str;
  },

  executeMethod: function (name, method, args) {
    var peripheral = this.peripherals[name];
    var response = 'method does not exist';

    if (peripheral && peripheral[method]) {
      peripheral[method].apply(this.peripherals[name], args);

      response = name + '.' + method + ' called with ' + args.join(', ');
    }

    return response;
  },

  exec: function (interpreted, message) {
    var response = 'command not found';

    if (interpreted.command == 'list') {
      response = this.list();
    }

    if (interpreted.command == 'listlimits') {
      response = this.listLimits();
    }

    if (interpreted.command == 'removelimit') {
      response = this.removeLimit(interpreted.name, interpreted.args[0]);
    }

    if (interpreted.command == 'call') {
      response = this.executeMethod(interpreted.name, interpreted.method, interpreted.args);
    }

    if (interpreted.command == 'value') {
      response = this.values[interpreted.name];
    }

    if (interpreted.command == 'minorthan' || interpreted.command == 'majorthan') {
      response = this.setLimit(interpreted, message);
    }

    return response;
  },

  setValue: function (name, value) {
    this.values[name] = value;

    this.checkLimits(name);
  },

  setBoard: function (board) {
  	this.board = board;
  },

  setLimit: function (interpreted, message) {
    var name = interpreted.name;
    var limitName = interpreted.limitName;

    if (!this.limits[name]) {
      this.limits[name] = {};
    }

    this.limits[name][limitName] = {
      command: interpreted.command,
      value: interpreted.args[0],
      chatId: message.chat.id,
      minutes: interpreted.minutes,
      time: new Date().getTime()
    }

    return 'added as ' + limitName;
  },

  checkLimits: function (name) {
    var limitsArr;
    var limit;

    if (this.limits[name]) {
      limitsArr = Object.keys(this.limits[name]);

      limitsArr.forEach(function (limitName) {
        limit = this.limits[name][limitName];

        if (limit) {
          this.executeLimit(name, limitName, limit);
        }
      }.bind(this));
    }
  },

  executeLimit: function (name, limitName, limit) {
    var value = this.values[name];
    var time = new Date().getTime();
    var delta = time - limit.time;
    var limitDelta = limit.minutes * 60 * 1000;

    if (value && (limit.command == 'minorthan') && (delta > limitDelta) && (value < limit.value)) {
      limit.time = time;
      this.bot.sendMessage(limit.chatId, name + ', ' + limitName + ' = ' + value);
    }

    if (value && (limit.command == 'majorthan') && (delta > limitDelta) && (value > limit.value)) {
      limit.time = time;
      this.bot.sendMessage(limit.chatId, name + ', ' + limitName +  ' = ' + value);
    }
  },

  removeLimit: function (peripheralName, limitName) {
    var name = peripheralName + ', ' + limitName;
    var response = name + ' not found';

    if (this.limits[peripheralName] && this.limits[peripheralName][limitName]) {
      delete this.limits[peripheralName][limitName]

      response = name + ' removed';
    }

    return response;
  },

  onMessage: function (message) {
    var text = message.text;
    var interpreted = interpreter.resolve(text);
    var response = this.exec(interpreted, message);

    this.bot.sendMessage(message.chat.id, response);
  },

  bindEvents: function () {

  	this.bot.on('text', function (message) {
      this.onMessage(message);
  	}.bind(this));
  }
}

module.exports = JohnnyTelegram;
