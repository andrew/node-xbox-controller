var HID = require('node-hid'),
    util = require('util'),
    chalk = require('chalk'),
    events = require('events');

var dead = 6000;

var buttons = {
  'dup': {
    'block': 2,
    'bitwise': 0x01
  },
  'ddown':{
    'block': 2,
    'bitwise': 0x02
  },
  'dleft':{
    'block': 2,
    'bitwise': 0x04
  },
  'dright':{
    'block': 2,
    'bitwise': 0x08
  },
  'start':{
    'block': 2,
    'bitwise': 0x10
  },
  'back':{
    'block': 2,
    'bitwise': 0x20
  },
  'leftstick':{
    'block': 2,
    'bitwise': 0x40
  },
  'rightstick':{
    'block': 2,
    'bitwise': 0x80
  },
  'leftshoulder':{
    'block': 3,
    'bitwise': 0x1
  },
  'rightshoulder':{
    'block': 3,
    'bitwise': 0x2
  },
  'xboxbutton':{
    'block': 3,
    'bitwise': 0x4
  },
  'a':{
    'block': 3,
    'bitwise': 0x10
  },
  'b':{
    'block': 3,
    'bitwise': 0x20
  },
  'x':{
    'block': 3,
    'bitwise': 0x40
  },
  'y':{
    'block': 3,
    'bitwise': 0x80
  }
};

var triggers = {
  'left':{
    'block': 4
  },
  'right':{
    'block': 5
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

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.loadController = function() {

  HID.devices().forEach((function(d) {
    if(typeof d === 'object' && d.product.toLowerCase().indexOf('controller') !== -1) {
      this.hid = new HID.HID(d.path);
      console.log( chalk.green('notice: '), 'Xbox controller connected.' );
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
    console.log( chalk.red('error: '), 'Xbox controller could not be found.' );
  }

};

XboxController.prototype.interpretData = function(error, data) {
    if(error && this.hid) {
      console.log(chalk.red('error:'), error);
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

    var leftx = uint8Toint16(data[6], data[7]);
    var lefty = uint8Toint16(data[8], data[9]);

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

    var rightx = uint8Toint16(data[10], data[11]);
    var righty = uint8Toint16(data[12], data[13]);

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
    console.log( chalk.red('error: '), errorMsg );
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
// input one of the patterns abov
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