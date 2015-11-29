var johnnyTelegram = require('../src/johnny-telegram.js');

var five = require('johnny-five');
var TelegramBot = require('node-telegram-bot-api');

var board = new five.Board();

var token = 'YOUR_TELEGRAM_API_TOKEN';

var bot = new TelegramBot(token, {polling: true});

johnnyTelegram.init(bot);

board.on('ready', function () {
  var servo1 = new five.Servo(10);

  johnnyTelegram.add('servo1', servo1);
  
  johnnyTelegram.bindEvents();

});
