# Node Xbox Controller

Interface for Xbox 360 game controller into Node.js

Lots of low level details about the controller here: 
* http://free60.org/GamePad
* http://tattiebogle.net/index.php/ProjectRoot/Xbox360Controller/UsbInfo
* http://euc.jp/periphs/xbox-controller.ja.html

Mac OSX driver: http://tattiebogle.net/index.php/ProjectRoot/Xbox360Controller/OsxDriver

## Usage

    var XboxController = require('xbox-controller')
    var xbox = new XboxController

    xbox.on('a:press', function (key) {
      console.log(key + ' press');
    });

    xbox.on('b:release', function (key) {
      console.log(key+' release');
    });

    xbox.on('lefttrigger', function(position){
      console.log('lefttrigger', position)
    })

    xbox.on('righttrigger', function(position){
      console.log('righttrigger', position)
    })

    xbox.on('left:move', function(position){
      console.log('left:move', position)
    })

    xbox.on('right:move', function(position){
      console.log('right:move', position)
    })
    
## LEDs

Set LED pattern on controller:

    xbox.setLed(0x0A)

Available LED patterns:

    0x00   All off
    0x01   All blinking
    0x02   1 flashes, then on
    0x03   2 flashes, then on
    0x04   3 flashes, then on
    0x05   4 flashes, then on
    0x06   1 on
    0x07   2 on
    0x08   3 on
    0x09   4 on
    0x0A   Rotating (e.g. 1-2-4-3)
    0x0B   Blinking*
    0x0C   Slow blinking*
    0x0D   Alternating (e.g. 1+4-2+3), then back to previous*

## Rumble

Control left and right rumble motors:

    var leftStrength = 255;
    var rightStrength = 255;

    xbox.rumble(leftStrength, rightStrength)

Where the strengths are between 0 and 255.

## Third Party Controllers

If you have a third party controller with a different name you can specify the name when creating the controller:

    var xbox = new XboxController('flight stick')
    
## Configuring a Third Party Controller

To configure a third party controller:

    XboxController.configure();

## Copyright

Copyright (c) 2013 Andrew Nesbitt. See [LICENSE](https://github.com/andrew/node-xbox-controller/blob/master/LICENSE) for details.
