var portName = '/dev/cu.usbserial-A94JN1PL';

var SerialPort = require("serialport").SerialPort;

function openPortal(callback) {
	var serialPort = new SerialPort(portName, {
	  	baudrate: 9600
	});

	var response = "";

	serialPort.on('data', function(data) {
		response += data.toString();
	    if (response.match(/\n/)) {
			if (response.match(/success/)) {
				callback({message: 'Success'}, 200);
			} else if (response.match(/error/)) {
				callback({error: 'Arduino failed to open the portal'}, 500);
			} else {
				callback({error: 'Arduino replied crap'}, 400);
			}
			response = "";
			serialPort.close();
	    }
	});

	serialPort.open(function(error) {
		if (error) {
			callback({error: 'Arduino not found'}, 404);
			serialPort.close();
		} else {
			serialPort.write("trigger\n", function(err) {
				if (err) {
					callback({error: 'Failed to talk with arduino'}, 503);
					serialPort.close();
				}
			});
		}
	});
}

var ArduinoService = {
	openPortal: openPortal
}

module.exports = ArduinoService;