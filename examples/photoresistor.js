var johnnyTelegram = require('../src/johnny-telegram.js');

var five = require('johnny-five');
var TelegramBot = require('node-telegram-bot-api');

var board = new five.Board();

var token = 'YOUR_TELEGRAM_API_TOKEN';

var bot = new TelegramBot(token, {polling: true});

johnnyTelegram.init(bot);

board.on('ready', function () {
  var photoresistor = new five.Sensor({
    pin: 'A2',
    freq: 250
  });

  photoresistor.on('data', function () {
    johnnyTelegram.setValue('photo', this.value);
  })

  johnnyTelegram.add('photo', photoresistor);

  johnnyTelegram.bindEvents();
});
