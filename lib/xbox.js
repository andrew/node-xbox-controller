var HID = require('node-hid'),
  util = require('util'),
  chalk = require('chalk'),
  events = require('events'),
  fs = require('fs'),
  path = require('path'),
  triggers = require('./triggers.json'),
  buttons = require('./buttons.json'),
  within = require('./mixins/within'),
  __ = require('lodash'),
  joysticks = require('./joysticks.json');


var dead = 6000;

function uint8Toint16(low, high) {
  var buffer = new ArrayBuffer(4);
  var int8View = new Uint8Array(buffer);
  var int16View = new Int16Array(buffer);

  int8View[0] = low;
  int8View[1] = high;
  return int16View[0];
}

function XboxController(serialNumber) {
  
  if( serialNumber) {
    this.serialNumber = serialNumber.toUpperCase();
  }
  
  this.position = 0;

  for (var button in buttons) {
    this[button] = 0;
  }
  for (var trigger in triggers) {
    this[trigger] = 0;
  }
  this.leftx = 0;
  this.lefty = 0;
  this.rightx = 0;
  this.righty = 0;
  this.hid = false;
  this._controllerLoadingInterval = false;
  this.loadController();
}

var location, bufferStore = [],
  original = 1,
  count = 0;

XboxController.analyze = function analyze(key, type, axis) {
  if (original === 1) {
    original = bufferStore[bufferStore.length - 1];
  }
  if (type === 'key') {
    for (i = 0; i < bufferStore.length; i++) {
      for (n = 0; n < bufferStore[i].length; n++) {
        if (bufferStore[i][n] !== original[n]) {
          buttons[key].block = n;
          buttons[key].bitwise = parseInt("0x" + parseInt(bufferStore[i][n].toString(16), 10), 16);
          bufferStore = [];
          console.log(buttons[key].block, buttons[key].bitwise, bufferStore);
          count += 1;
          XboxController.configure();
          break;
        }
      }
    }
  } else if (type === 'trigger') {
    for (i = 0; i < bufferStore.length; i++) {
      for (n = 0; n < bufferStore[i].length; n++) {
        var current = bufferStore[i][n];
        if (current !== original[n] && current !== 128 && current !== 0) {
          console.log(bufferStore[bufferStore.length - 1][n]);
          triggers[key].block = n;
          bufferStore = [];
          console.log(triggers[key].block, bufferStore);
          count += 1;
          XboxController.configure();
          break;
        }
      }
    }
  } else if (type === 'joystick') {
    for (i = 0; i < bufferStore.length; i++) {
      for (n = 0; n < bufferStore[i].length; n++) {
        var current = bufferStore[i][n],
          diffx = bufferStore[i][n] - original[n],
          diffy = original[n] - bufferStore[i][n];
        if (current !== original[n] && axis === 'leftx' && diffx > 70) {
          joysticks.leftxPos = n;
          joysticks.leftxState = (n - 1);
          bufferStore = [];
          console.log(joysticks.leftxPos, joysticks.leftxState);
          count += 1;
          XboxController.configure();
          break;
        }
        if (current !== original[n] && axis === 'rightx' && diffx > 70) {
          joysticks.rightxPos = n;
          joysticks.rightxState = (n - 1);
          bufferStore = [];
          console.log(joysticks.rightxPos, joysticks.rightxState);
          count += 1;
          XboxController.configure();
          break;
        }
        if (current !== original[n] && axis === 'lefty' && diffy > 70) {
          joysticks.leftyPos = n;
          joysticks.leftyState = (n - 1);
          bufferStore = [];
          console.log(joysticks.leftyPos, joysticks.leftyState);
          count += 1;
          XboxController.configure();
          break;
        }
        if (current !== original[n] && axis === 'righty' && diffy > 70) {
          joysticks.rightyPos = n;
          joysticks.rightyState = (n - 1);
          bufferStore = [];
          console.log(joysticks.rightyPos, joysticks.rightyState);
          count += 1;
          XboxController.configure();
          break;
        }
      }
    }
  }
};

XboxController.reader = function read(key, inputLength, type, axis) {
  location.read(onRead = function (err, data) {
    bufferStore.push(data);
    if (bufferStore.length < inputLength) {
      location.read(onRead);
    } else {
      XboxController.analyze(key, type, axis);
    }
  });
};

XboxController.configure = function () {
  switch (count) {
  case 0:
    console.log('Press and release the A button');
    XboxController.reader('a', 2, 'key', 0);
    break;
  case 1:
    console.log('Press and release the Y Button');
    XboxController.reader('y', 2, 'key', 0);
    break;
  case 2:
    console.log('Press and release the B Button');
    XboxController.reader('b', 2, 'key', 0);
    break;
  case 3:
    console.log('Press and release the X Button');
    XboxController.reader('x', 2, 'key', 0);
    break;
  case 4:
    console.log('Press and release the Left Shoulder');
    XboxController.reader('leftshoulder', 2, 'key', 0);
    break;
  case 5:
    console.log('Press and release the Right Shoulder');
    XboxController.reader('rightshoulder', 2, 'key', 0);
    break;
  case 6:
    console.log('Press and release D-pad up', 'key');
    XboxController.reader('dup', 2, 'key', 0);
    break;
  case 7:
    console.log('Press and release D-pad down');
    XboxController.reader('ddown', 2, 'key', 0);
    break;
  case 8:
    console.log('Press and release D-pad left');
    XboxController.reader('dleft', 2, 'key', 0);
    break;
  case 9:
    console.log('Press and release D-pad right');
    XboxController.reader('dright', 2, 'key', 0);
    break;
  case 10:
    console.log('Press and release the left stick button');
    XboxController.reader('leftstick', 2, 'key', 0);
    break;
  case 11:
    console.log('Press and release the right stick button');
    XboxController.reader('rightstick', 2, 'key', 0);
    break;
  case 12:
    console.log('Press and release the start button');
    XboxController.reader('start', 2, 'key', 0);
    break;
  case 13:
    console.log('Press and release the back button');
    XboxController.reader('back', 2, 'key', 0);
    break;
  case 14:
    console.log('Wiggle the right trigger');
    XboxController.reader('right', 50, 'trigger', 0);
    break;
  case 15:
    console.log('Wiggle the left trigger');
    XboxController.reader('left', 50, 'trigger', 0);
    break;
  case 16:
    console.log('Keep wiggling the left trigger');
    XboxController.reader('left', 50, 'trigger', 0);
    break;
  case 17:
    console.log('Move the left joystick a bit to the right');
    XboxController.reader('left', 200, 'joystick', 'leftx');
    break;
  case 18:
    console.log('Keep moving the left joystick a bit to the right');
    XboxController.reader('left', 200, 'joystick', 'leftx');
    break;
  case 19:
    console.log('Move the right joystick a bit to the right');
    XboxController.reader('left', 200, 'joystick', 'rightx');
    break;
  case 20:
    console.log('Keep moving the right joystick a bit to the right');
    XboxController.reader('left', 200, 'joystick', 'rightx');
    break;
  case 21:
    console.log('Move the right joystick upwards a bit');
    XboxController.reader('left', 200, 'joystick', 'righty');
    break;
  case 22:
    console.log('Keep moving the right joystick upwards a bit');
    XboxController.reader('left', 200, 'joystick', 'righty');
    break;
  case 23:
    console.log('Move the left joystick upwards a bit');
    XboxController.reader('left', 200, 'joystick', 'lefty');
    break;
  case 24:
    console.log('Keep moving the left joystick upwards a bit');
    XboxController.reader('left', 200, 'joystick', 'lefty');
    break;
  case 25:
    var joysticksDir = path.join(__dirname, 'joysticks.json'),
      triggersDir = path.join(__dirname, 'triggers.json'),
      buttonsDir = path.join(__dirname, 'buttons.json');
    var configArray = [joysticksDir, triggersDir, buttonsDir],
      nameArray = [joysticks, triggers, buttons];
    for (i = 0; i < configArray.length; i++) {
      fs.writeFile(configArray[i], JSON.stringify(nameArray[i], null, 4), function (err) {
        if (err) throw err;
        console.log('Saved' + nameArray[i])
      });
    }
    console.log('Config complete');
    break;
  default:
    console.log('error try again');
  }
};

util.inherits(XboxController, events.EventEmitter);

XboxController.prototype.loadController = function () {

  HID.devices().forEach((function (d) {
  
    
  try {
    if( this.serialNumber )
    {  
      // If the serial number is set, look for device with that serial number.
      var deviceSerialNumber = (typeof d === 'object' && d.serialNumber) || '';
    
      if (deviceSerialNumber.indexOf(this.serialNumber) !== -1) {
        console.log(chalk.green('notice: '), 'serial number found.');     
        this.hid = new HID.HID(d.path);
        console.log(chalk.green('notice: '), 'Xbox controller connected (serial number: ' 
        + d.serialNumber + ', path: ' + d.path + ')');
        this.emit('connected');
        location = this.hid;
      }
    } else {
      // The serial number is not set, grab the first device.
      var product = (typeof d === 'object' && d.product) || '';
      if (product.toLowerCase().indexOf('controller') !== -1) {
        this.hid = new HID.HID(d.path);        
        console.log(chalk.green('notice: '), 'Xbox controller connected (serial number: ' 
        + d.serialNumber + ', path: ' + d.path + ')');
        this.serialNumber = d.serialNumber;
        this.emit('connected');
        location = this.hid;
      }
    }
  } catch (ex) {
    console.log(chalk.green('notice: '), 'Xbox controller already in use (serial number: ' 
        + d.serialNumber + ', path: ' + d.path + ')' );
  }
    
  }).bind(this));

  if (this.hid === false && !this._controllerLoadingInterval) {
    this._controllerLoadingInterval = setInterval(function () {
      this.loadController();
    }.bind(this), 2000);
  }

  try {
    this.hid.read(this.interpretData.bind(this));
  } catch (ex) {
    console.log(chalk.red('error: '), 'Xbox controller could not be found.');
    this.emit('not-found');
  }

};

XboxController.prototype.interpretData = function (error, data) {
  if (error && this.hid) {
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

    if (state ^ this[key]) {
      this.emit((state ? key + ':press' : key + ':release'), key);
      this[key] = state;
    }
  }

  for (var trigger in triggers) {
    var address = triggers[trigger];
    var state = data[address.block];
    if (state ^ this[trigger]) {
      this.emit(trigger + 'trigger', state);
      this[trigger] = state;
    }
  }

  var leftx = uint8Toint16(data[joysticks.leftxState], data[joysticks.leftxPos]);
  var lefty = uint8Toint16(data[joysticks.leftyState], data[joysticks.leftyPos]);

  if (leftx ^ this.leftx | lefty ^ this.lefty) {
    if (leftx > -1 * dead && leftx < dead) {
      leftx = 0;
    }
    if (lefty > -1 * dead && lefty < dead) {
      lefty = 0;
    }

    this.emit('left:move', {
      x: leftx,
      y: lefty
    });
    this.leftx = leftx;
    this.lefty = lefty;
  }

  var rightx = uint8Toint16(data[joysticks.rightxState], data[joysticks.rightxPos]);
  var righty = uint8Toint16(data[joysticks.rightyState], data[joysticks.rightyPos]);

  if (rightx ^ this.rightx | righty ^ this.righty) {
    if (rightx > -1 * dead && rightx < dead) {
      rightx = 0;
    }
    if (righty > -1 * dead && righty < dead) {
      righty = 0;
    }
    this.emit('right:move', {
      x: rightx,
      y: righty
    });
    this.rightx = rightx;
    this.righty = righty;
  }

  this.hid.read(this.interpretData.bind(this));
};


XboxController.prototype.sendCommand = function (command, errorMsg) {
  try {
    this.hid.write(command);
  } catch (ex) {
    console.log(chalk.red('error: '), errorMsg);
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
XboxController.prototype.setLed = function (flag) {
  this.sendCommand([0x01, 0x03, flag], 'Xbox cant set LED to HEX ' + flag);
};

XboxController.prototype.powerOff = function () {
  this.sendCommand([0x02, 0x02], 'Xbox controller wont poweroff');
};

XboxController.prototype.rumble = function (left, right) {
  if (typeof left === "undefined" || left === null) {
    left = 0xff;
  }
  if (typeof right === "undefined" || right === null) {
    right = 0xff;
  }
  this.sendCommand([0x00, 0x00, 0x04, left, right], 'Xbox controller wont rumble');
};

__.mixin(XboxController.prototype, within);

module.exports = XboxController;
