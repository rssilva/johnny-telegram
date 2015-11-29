var johnnyTelegram = require('../src/johnny-telegram.js');

var five = require('johnny-five');
var TelegramBot = require('node-telegram-bot-api');

var board = new five.Board();

var token = 'YOUR_TELEGRAM_API_TOKEN';

var bot = new TelegramBot(token, {polling: true});

johnnyTelegram.init(bot);

board.on('ready', function () {
  var proximity = new five.Proximity({
    controller: 'HCSR04',
    pin: 7
  });

  johnnyTelegram.add('prox', proximity);

  proximity.on('data', function() {
    johnnyTelegram.setValue('prox', this.cm);
  });

  johnnyTelegram.bindEvents();
});
