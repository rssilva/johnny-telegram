# Johnny Telegram

## A simple way to communicate with Arduino using Johnny-Five and Telegram

Creates a Telegram Bot with the [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) to send data to Arduino using [Johnny-Five](https://github.com/rwaldron/johnny-five).

## Usage

A example that allows the user to call the method 'blink' from the led

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

// And now you can send a message to the bot like 'call led blink 500'
//  and the command 'call' will call the method led's method 'blink' with 500 as parameter :)
```

## Command list that can be sent via Telegram (quick reference)
  ```shell
  list
  call peripheral_name method_name arguments
  value peripheral_name
  minorthan peripheral_name limit_name value
  majorthan peripheral_name limit_name value
  listlimits
  removelimit peripheral_name limit_name
  ```
## Command list that can be sent via Telegram ("complete" reference)

The commands are case insensitive.

### list 

Lists all the peripherals that were added. **You can't add a peripheral via Telegram**.

Example:
  ```shell
  list

  # response is a list with the added peripherals like 'led, proximity, photoresistor'
  ```

### call peripheral\_name method\_name arguments 

Call a method of the peripheral Johnny Five API.

Example:
  ```shell
  call led off
  call led on
  call led blink 500

  # response shows which method was called from the peripheral 'led.off called with', 
  #  'led.on called with' and 'led.blink called with 500'
  #  in negative case is 'method does not exist'
  ```
### value peripheral 

Shows the current value of a peripheral.

Example:
  ```shell
  value proximity

  # response is something like '16.03' that is the value in centimeters of a proximity sensor
  ```

### minorthan peripheral\_name value period 

Shows the peripheral name and value if it's minor than the one passed on command. The period in minutes is the interval where the value is checked.

Example:
  ```shell
  minorthan proximity 30cm 30 1

  # the response will show something like 'proximity, 30cm = 17.216'
  ```

### majorthan peripheral\_name limit\_name value period 

Shows the peripheral name, the limit name and value if it's major than the one passed on command. The period in minutes is the interval where the value is checked. "Limit Name" was added because it's possible to add more than one limit trigger for each peripheral.

Example:
  ```shell
  majorthan proximity 50cm 50 1

  # the response will show something like 'proximity, 50cm = 50.216'
  ```

### listlimits 

List all the limits added to all peripherals with the limit names.

  ```shell
  listlimits

  # the response will show something like 
  # limits:
  # proximity: 30cm, 50cm
  ```
### removelimit peripheral\_name limit\_name

Remove a specific limit of a peripheral and so it'll checked no more.

  ```shell
  removelimit prox 50cm

  # the response will show something like 'prox, 50cm removed'
  ```

After try some IoT experiments with the awesome Johny Five, like to have a Node server running where you could send commands according the url: http://192.168.0.1/servo/angle/80 to set a servo angle, for example, I started to search a way to have a easy communication through the web.