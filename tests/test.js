var XboxController = require('../lib/xbox');
var controllers = XboxController.allControllers();

controllers.forEach(function(controller){

  controller.on('a:press', function (key) {
    console.log('a press on ' + controller.serialNumber);
  });

  controller.on('a:release', function (key) {
    console.log('a press on ' + controller.serialNumber);
  });

  controller.on('b:release', function (key) {
    console.log('b release on ' + controller.serialNumber);
  });

  controller.on('righttrigger', function(position){
    console.log('righttrigger ' + position + ' on ' + controller.serialNumber);
  });

  controller.on('left:move', function(position){
    console.log('left:move', position, ' on ' + controller.serialNumber)
  });

  controller.on('right:move', function(position){
    console.log('right:move', position, ' on ' + controller.serialNumber)
  });
})