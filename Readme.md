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

## TODO

* rumble control

## Copyright

Copyright (c) 2013 Andrew Nesbitt. See [LICENSE](https://github.com/andrew/node-xbox-controller/blob/master/LICENSE) for details.
