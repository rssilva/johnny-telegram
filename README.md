# Johnny Telegram

## A simple way to communicate with Arduino using Johnny-Five and Telegram

Creates a Telegram Bot with the [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) to send data to Arduino using [Johnny-Five](https://github.com/rwaldron/johnny-five).

### Usage
A simple example

  ```javascript
    // Require the modules
    var johnnyTelegram = require('../src/johnny-telegram.js');
    var five = require('johnny-five');
    var TelegramBot = require('node-telegram-bot-api');

    // Instantiate a new board
    var board = new five.Board();

    // Creates a new Telegram Bot
    var bot = new TelegramBot('YOUR_TELEGRAM_KEY', {polling: true});

    // Initiates the Johnny Telegram instance
    johnnyTelegram.init(bot);

    // Listen the board 'ready' event be sure that all 
    //  the hardware initialization is ok 
    board.on('ready', function () {
      // Creates a led that will be available on pin 13
      var led = new five.Led(13);

      // Adds a peripheral called 'led' to Johnny Telegram
      johnnyTelegram.add('led', led);

      // This will set Johnny Telegram events like receiving a message from Telegram
      johnnyTelegram.bindEvents();
    });

    // And now you can for example, send a message to the bot like 'call led blink 500'
    //  and the command 'call' will call the method led's method 'blink' with 500 as parameter :)
  ```

### Command list:
  ```shell
  list
  call peripheral_name method_name arguments
  value peripheral_name
  minorthan peripheral_name limit_name value
  majorthan peripheral_name limit_name value
  listlimits
  removelimit peripheral_name limit_name
  ```
After try some IoT experiments with the awesome Johny Five, like to have a Node server running where you could send commands according the url: http://192.168.0.1/servo/angle/80 to set a servo angle, for example, I started to search a way to have a easy communication through the web.