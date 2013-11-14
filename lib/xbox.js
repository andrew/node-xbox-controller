var HID = require('HID'),
    util = require('util'),
    colors = require('colors'),
    events = require('events');

var dead = 3000;

var buttons = {
  'dup': {
   'block':11,
	'bitwise':0x04
  },
  'ddown':{
 'block':11,
	'bitwise':0x20
  },
  'dleft':{
'block':11,
	'bitwise':0x28
  },
  'dright':{
	 'block':11,
	'bitwise':0x12
  },
  'start':{
   'block': 10,
  'bitwise':0x80 
  },
  'back':{
  'block': 10,
  'bitwise':0x40
  },
  'leftstick':{
   'block':11,
   'bitwise': 0x2
  },
  'rightstick':{
  'block':11,
  'bitwise':0x1   
  },
  'leftshoulder':{
  'block':10,
  'bitwise':16
  },
  'rightshoulder':{
    'block':10,
  'bitwise':0x20
  },
  'xboxbutton':{
  },
  'a':{
   'block': 0,
    'bitwise': 0
  },
  'b':{
  'block': 10,
    'bitwise': 2
  },
  'x':{
   'block': 10,
    'bitwise': 4
  },
  'y':{
    'block': 10,
    'bitwise': 8
  }
};
var triggers = {
  'left':{
    'block': 9
  },
  'right':{
    'block': 9
  }
};

function uint8Toint16(low, high) {
  var buffer = new ArrayBuffer(4);
  var int8View = new Uint8Array(buffer);
  var int16View = new Int16Array(buffer);

  int8View[0] = low;
  int8View[1] = high;
  return int16View[0];
}

function XboxController()
{
    this.position = 0;

    for (var key in buttons) {
      this[key] = 0;
    }
    for (var key in triggers) {
      this[key] = 0;
    }
    this.leftx = 0;
    this.lefty = 0;
    this.rightx = 0;
    this.righty = 0;
    this.hid = false;
    this._controllerLoadingInterval = false;
    this.loadController();
}
var ultra,bufferStore = [],original=1,count=0,leftxState=6,leftxPos=7,leftyState=8,leftyPos=9,rightxState=10,rightxPos=11,rightyState=12,rightyPos=13;

XboxController.analyze = function analyze(key,type,axis){
if(original===1){
original=bufferStore[bufferStore.length-1];
}
if(type==='key'){
for(i=0;i<bufferStore.length;i++){
for(n=0;n<bufferStore[i].length;n++){
if(bufferStore[i][n] !== original[n]){
buttons[key].block = n;
buttons[key].bitwise = parseInt("0x"+parseInt(bufferStore[i][n].toString(16),10),16);
bufferStore = [];
console.log(buttons[key].block,buttons[key].bitwise,bufferStore);
count+=1;
XboxController.configure();
break;
}
}
}
}
else if(type==='trigger'){
for(i=0;i<bufferStore.length;i++){
for(n=0;n<bufferStore[i].length;n++){
if(bufferStore[i][n] !== original[n]){
if(bufferStore[bufferStore.length-1][n] !== 128 && bufferStore[bufferStore.length-1][n] !==0){
console.log(bufferStore[bufferStore.length-1][n]);
triggers[key].block = n;
bufferStore = [];
console.log(triggers[key].block,bufferStore);
count+=1;
XboxController.configure();
break;
}
}
}
}
}
else if(type==='joystick'){
for(i=0;i<bufferStore.length;i++){
for(n=0;n<bufferStore[i].length;n++){
if(bufferStore[i][n] !== original[n] && axis === 'leftx'){
leftxPos=n;
leftxState=(n-1);
bufferStore = [];
console.log(leftxPos,leftxState);
count+=1;
XboxController.configure();
break;
}
if(bufferStore[i][n] !== original[n] && axis === 'rightx'){
console.log(bufferStore);
rightxPos=n;
rightxState=(n-1);
bufferStore = [];
console.log(rightxPos,rightxState);
count+=1;
XboxController.configure();
break;
}
if(bufferStore[i][n] !== original[n] && axis === 'lefty'){
console.log(bufferStore);
leftyPos=n;
leftyState=(n-1);
bufferStore = [];
console.log(leftyPos,leftyState);
count+=1;
XboxController.configure();
break;
}
if(bufferStore[i][n] !== original[n] && axis === 'righty'){
console.log(bufferStore);
rightyPos=n;
rightyState=(n-1);
bufferStore = [];
console.log(rightyPos,rightyState);
count+=1;
XboxController.configure();
break;
}
}
}
}
};
	  
XboxController.reader=function read(key,inputLength,type,axis){
ultra.read(onRead = function(err,data){
bufferStore.push(data);
if(bufferStore.length<inputLength){	
ultra.read(onRead);
}
else{
XboxController.analyze(key,type,axis);
}
});
};

XboxController.configure = function(){
switch(count){
case 0:	
console.log('Press and release the A button');
XboxController.reader('a',2,'key',0);
break;
case 1:
console.log('Press and release the Y Button');
XboxController.reader('y',2,'key',0);
break;
case 2:
console.log('Press and release the B Button');
XboxController.reader('b',2,'key',0);
break;
case 3:
console.log('Press and release the X Button');
XboxController.reader('x',2,'key',0);
break;
case 4:
console.log('Press and release the Left Shoulder');
XboxController.reader('leftshoulder',2,'key',0);
break;
case 5:
console.log('Press and release the Right Shoulder');
XboxController.reader('rightshoulder',2,'key',0);
break;
case 6:
console.log('Press and release D-pad up','key');
XboxController.reader('dup',2,'key');
break;
case 7:
console.log('Press and release D-pad down');
XboxController.reader('ddown',2,'key',0);
break;
case 8:
console.log('Press and release D-pad left');
XboxController.reader('dleft',2,'key',0);
break;
case 9:
console.log('Press and release D-pad right');
XboxController.reader('dright',2,'key',0);
break;
case 10:
console.log('Wiggle the right trigger');
XboxController.reader('right',20,'trigger',0);
break;
case 11:
console.log('Wiggle the left trigger');
XboxController.reader('left',20,'trigger',0);
break;
case 12:
console.log('Move the left joystick a bit to the left');
XboxController.reader('left',200,'joystick','leftx');
break;
case 13:
console.log('Keep moving the left joystick a bit to the left');
XboxController.reader('left',200,'joystick','leftx');
break;
case 14:
console.log('Move the right joystick a bit to the right');
XboxController.reader('left',200,'joystick','rightx');
break;
case 15:
console.log('Keep moving the right joystick a bit to the right');
XboxController.reader('left',200,'joystick','rightx');
break;
case 16:
console.log('Move the right joystick upwards a bit');
XboxController.reader('left',200,'joystick','righty');
break;
case 17:
console.log('Keep moving the right joystick upwards a bit');
XboxController.reader('left',200,'joystick','righty');
break;
case 18:
console.log('Move the left joystick upwards a bit');
XboxController.reader('left',200,'joystick','lefty');
break;
case 19:
console.log('Keep moving the left joystick upwards a bit');
XboxController.reader('left',200,'joystick','lefty');
break;
case 20:
console.log("done");
break;
default:
console.log('error try again');
}}

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.loadController = function() {

  HID.devices().forEach((function(d) {
    if(typeof d === 'object' && d.product.toLowerCase().indexOf('controller') !== -1) {
      this.hid = new HID.HID(d.path);
      console.log( 'notice: '.green, 'Xbox controller connected.' );
	  ultra=this.hid;
    }
  }).bind(this));
  if(this.hid === false && !this._controllerLoadingInterval) {
    this._controllerLoadingInterval = setInterval(function() {
      this.loadController();
    }.bind(this), 2000);
  }
  try {
    this.hid.read(this.interpretData.bind(this));
  }
  catch ( ex ) {
    console.log( 'error: '.red, 'Xbox controller could not be found.' );
  }

};

XboxController.prototype.interpretData = function(error, data) {
    if(error && this.hid) {
      console.log('error:'.red, error);
      this.hid = false;
      this.loadController();
      return false;
    } else {
      clearInterval(this._controllerLoadingInterval);
      this._controllerLoadingInterval = false;
    }

    for (var key in buttons) {
      var address = buttons[key];
      var state = data[address.block] & address.bitwise;
      if(state ^ this[key]){
        this.emit((state ? key+':press': key+':release'), key);
        this[key] = state;
      }
    }

    for (var key in triggers) {
      var address = triggers[key];
      var state = data[address.block];
      if(state ^ this[key]){
        this.emit(key+'trigger', state);
        this[key] = state;
      }
    }

    var leftx = uint8Toint16(data[leftxState], data[leftxPos]);
    var lefty = uint8Toint16(data[leftyState], data[leftyPos]);

    if(leftx ^ this.leftx | lefty ^ this.lefty){
      if (leftx > -1*dead && leftx < dead ){
        leftx = 0;
      }
      if (lefty > -1*dead && lefty < dead ){
        lefty = 0;
      }

      this.emit('left:move', {x: leftx, y: lefty});
      this.leftx = leftx;
      this.lefty = lefty;
    }

    var rightx = uint8Toint16(data[rightxState], data[rightxPos]);
    var righty = uint8Toint16(data[rightyState], data[rightyPos]);

    if(rightx ^ this.rightx | righty ^ this.righty){
      if (rightx > -1*dead && rightx < dead ){
        rightx = 0;
      }
      if (righty > -1*dead && righty < dead ){
        righty = 0;
      }
      this.emit('right:move', {x: rightx, y: righty});
      this.rightx = rightx;
      this.righty = righty;
    }

    this.hid.read(this.interpretData.bind(this));
};


XboxController.prototype.sendCommand = function(command, errorMsg) {
  try{
      this.hid.write(command);
  }
  catch ( ex ){
    console.log( 'error: '.red, errorMsg );
  }
};

/*

Pattern  Description
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

 */
// input one of the patterns above
XboxController.prototype.setLed = function(flag) {
  this.sendCommand([0x01, 0x03, flag ], 'Xbox cant set LED to HEX ' + flag);
};

XboxController.prototype.powerOff = function() {
  this.sendCommand([0x02, 0x02 ], 'Xbox controller wont poweroff');
};

XboxController.prototype.rumble = function(left, right) {
  if (typeof left === "undefined" || left===null) left = 0xff;
  if (typeof right === "undefined" || right===null) right = 0xff;
  this.sendCommand([0x00, 0x00, 0x04, left, right], 'Xbox controller wont rumble');
};

module.exports = XboxController;