# Node Xbox Controller

Interface for Xbox 360 game controller into node (wip)

## Usage

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

stick deadzones
rumble control
led control

## Copyright

Copyright (c) 2012 Andrew Nesbitt. See [LICENSE](https://github.com/andrew/drone-xbox-controller/blob/master/LICENSE) for details.