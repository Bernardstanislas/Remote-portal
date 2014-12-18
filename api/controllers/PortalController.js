/**
* PortalController
*
* @description :: Server-side logic for opening portal
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

var portName = '/dev/cu.usbserial-A94JN1PL';

var SerialPort = require("serialport").SerialPort;

function doOpen(res, sp) {
  if (!sp) {
    sp = new SerialPort(portName, {
      baudrate: 9600
    });
  }

  var response = "";
  sp.on('data', function(data) {
    response += data.toString();
    if (response.match(/\n/)) {
      if (response.match(/success/)) {
        res.json({message: 'Success'}, 200);
      } else if (response.match(/error/)) {
        res.json({error: 'Arduino failed to open the portal'}, 500);
      } else {
        res.json({error: 'Arduino replied crap'}, 400);
      }
      response = "";
      sp.close();
    }
  });

  sp.open(function(error) {
    if (error) {
      res.json({error: 'Arduino not found'}, 404);
      sp.close();
    } else {
      sp.write("trigger\n", function(err) {
        if (err) {
          res.json({error: 'Failed to talk with arduino'}, 503);
          sp.close();
        }
      });
    }
  });
}

module.exports = {
  open: function(req, res, sp) {
    doOpen(res, sp);
  }
};
