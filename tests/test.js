var XboxController = require('../lib/xbox');
var xbox = new XboxController;


xbox.on('a:press', function (key) {
  console.log('a press');
});

xbox.on('b:release', function (key) {
  console.log('b release');
});


xbox.on('lefttrigger', function (position) {
  console.log('lefttrigger', position);
});

xbox.on('righttrigger', function (position) {
  console.log('righttrigger', position);
});

xbox.on('left:move', function (position) {
  console.log('left:move', position);
});

xbox.on('right:move', function (position) {
  console.log('right:move', position);
});


xbox.within('righttrigger', [50,100], function(err, data){
	console.log('rightttrigger within 50 and 100', err, data);
});
