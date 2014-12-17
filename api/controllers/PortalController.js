/**
* PortalController
*
* @description :: Server-side logic for opening portal
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

var portName = '/dev/cu.usbserial-A94JN1PL';

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort(portName, {
  baudrate: 9600
});

var openPortal;

function init() {
  serialPort.on("open", function () {
    openPortal = function(cb) {
      serialPort.on('data', cb);
      serialPort.write("trigger\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
      });
    }
  });
}

function doTrigger(req, res) {
  var response = "";
  serialPort.on('data', function(data) {
    response += data.toString();
    if (response.match(/\n/)) {
      if (response.match(/success/)) {
        res.json({message: 'success'}, 200);
      } else {
        res.json({message: 'error'}, 500);
      }
      response = "";
    }
  });
  serialPort.write("trigger\n", function(err, results) {
  });
}

module.exports = {
  open: function(req, res) {
    //init();
    doTrigger(req, res);
  }
};
