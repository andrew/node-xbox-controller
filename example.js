
var XboxController = require('xbox-controller');
var xbox = new XboxController();

console.log(xbox.serialNumber + ' online');


/*
 * A,B,X,Y buttons
 */

xbox.on('a:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'a', action:'press' });
  console.log(message);
});

xbox.on('a:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'a', action:'release' });
  console.log(message);
});


xbox.on('b:press', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'b', action:'press' });
  console.log(message);
});

xbox.on('b:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'b', action:'release' });
  console.log(message);
});


xbox.on('x:press', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'x', action:'press' });
  console.log(message);
});

xbox.on('x:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'x', action:'release' });
  console.log(message);
});


xbox.on('y:press', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'y', action:'press' });
  console.log(message);
});

xbox.on('y:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'y', action:'release' });
  console.log(message);
});


/*
 * Triggers
 */

xbox.on('lefttrigger', function(position){
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'lefttrigger', action:position });
  console.log(message);
  
  xbox.rumble(0,position);
});

xbox.on('righttrigger', function(position){
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'righttrigger', action:position });
  console.log(message);
  
  xbox.rumble(position,0);
});



/*
 * Analog sticks
 */

xbox.on('left:move', function(position){
  if(position.x != 0 || position.y != 0) {
  
    var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'leftmove', action:position });
    console.log(message);
  }
});

xbox.on('right:move', function(position){
  if(position.x != 0 || position.y != 0) {
    
    var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'rightmove', action:position });
    console.log(message);
  }
});


xbox.on('leftstick:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'leftstick', action:'press' });
  console.log(message);
});

xbox.on('leftstick:release', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'leftstick', action:'release' });
  console.log(message);
});


xbox.on('rightstick:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'rightstick', action:'press' });
  console.log(message);
});

xbox.on('rightstick:release', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'rightstick', action:'release' });
  console.log(message);
});


/*
 * Top buttons
 */

xbox.on('back:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'back', action:'press' });
  console.log(message);
});

xbox.on('back:release', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'back', action:'release' });
  console.log(message);
});


xbox.on('xboxbutton:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'xboxbutton', action:'press' });
  console.log(message);
});

xbox.on('xboxbutton:release', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'xboxbutton', action:'release' });
  console.log(message);
});


xbox.on('start:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'start', action:'press' });
  console.log(message);
});

xbox.on('start:release', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'start', action:'release' });
  console.log(message);
});


/*
 * D pad
 */

xbox.on('dup:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'dup', action:'press' });
  console.log(message);
});

xbox.on('dup:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'dup', action:'release' });
  console.log(message);
});


xbox.on('ddown:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'ddown', action:'press' });
  console.log(message);
});

xbox.on('ddown:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'ddown', action:'release' });
  console.log(message);
});


xbox.on('dleft:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'dleft', action:'press' });
  console.log(message);
});

xbox.on('dleft:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'dleft', action:'release' });
  console.log(message);
});


xbox.on('dright:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'dright', action:'press' });
  console.log(message);
});

xbox.on('dright:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'dright', action:'release' });
  console.log(message);
});


/*
 * Shoulder
 */

xbox.on('rightshoulder:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'rightshoulder', action:'press' });
  console.log(message);
});

xbox.on('rightshoulder:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'rightshoulder', action:'release' });
  console.log(message);
});


xbox.on('leftshoulder:press', function (key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'leftshoulder', action:'press' });
  console.log(message);
});

xbox.on('leftshoulder:release', function(key) {
  var message = JSON.stringify({ serialNumber: xbox.serialNumber, button: 'leftshoulder', action:'release' });
  console.log(message);
});





/*
 * Setup
 */

xbox.on('connected', function() {
  console.log('Xbox controller connected');
  xbox.setLed(LED)
});

xbox.on('not-found', function() {
  console.log('Xbox controller could not be found');
});
