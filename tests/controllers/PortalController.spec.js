/**
 * Created by stan on 17/12/14.
 */

var events = require('events');

var PortalController = require('../../api/controllers/PortalController'),
    sinon = require('sinon'),
    assert = require('assert');

/**
 * Mocked SerialPort object
 * Used to simulate the arduino behavior
 * @type(Object)
 */
var SerialPort = function() {
    this.close = sinon.spy();
};
SerialPort.prototype = new events.EventEmitter;

/**
 * SerialPort instance
 * Will simulate the arduino calls and responses
 * @type(SerialPort)
 */
var serialPort = new SerialPort();

/**
 * Stubbed res object
 * @type({json: function})
 */
var res = {
    json: sinon.stub()
};

describe('The Portal Controller', function () {
    describe('when we call the open action with a bad port configured', function () {
        it ('should return a 404 error with an explicit message and close the serial connection.', function () {
            serialPort.close.reset();
            res.json.reset();
            serialPort.open = function(cb) {
                var error = true;
                cb(error);
            };
            PortalController.open(null, res, serialPort);
            sinon.assert.calledWithMatch(res.json, { error: "Arduino not found" }, 404);
            assert(serialPort.close.calledOnce);
        });
    });

    describe('when we call the open action with a good port configured and a deaf arduino', function() {
        it('should return a 503 error with an explicit message and close the serial connection.', function () {
            serialPort.close.reset();
            res.json.reset();
            serialPort.open = function(cb) {
                cb();
            };
            serialPort.write = function(message, cb) {
                var error = true;
                cb(error);
            };
            PortalController.open(null, res, serialPort);
            sinon.assert.calledWithMatch(res.json, { error: "Failed to talk with arduino" }, 503);
            assert(serialPort.close.calledOnce);
        });
    });

    describe('when we call the open action with a good port configured and a weird talking arduino', function() {
        it ('should return a 400 error with an explicit message and close the serial conection.', function() {
            this.clock = sinon.useFakeTimers();
            serialPort.close.reset();
            serialPort.removeAllListeners();
            res.json.reset();
            serialPort.open = function(cb) {
                cb();
            };
            serialPort.write = function(message, cb) {
                cb();
                setTimeout(function() {
                    serialPort.emit('data', 'suc');
                }, 1505);
                setTimeout(function() {
                    serialPort.emit('data', 'lol\n');
                }, 1510);
            };
            PortalController.open(null, res, serialPort);

            this.clock.tick(1600);
            sinon.assert.calledWithMatch(res.json, { error: "Arduino replied crap" }, 400);
            assert(serialPort.close.calledOnce);
        });
    });

    describe('when we call the open action with a good port configured and a faulty arduino', function() {
        it ('should return a 500 error with an explicit message and close the serial conection.', function() {
            this.clock = sinon.useFakeTimers();
            serialPort.close.reset();
            serialPort.removeAllListeners();
            res.json.reset();
            serialPort.open = function(cb) {
                cb();
            };
            serialPort.write = function(message, cb) {
                cb();
                setTimeout(function() {
                    serialPort.emit('data', 'err');
                }, 1505);
                setTimeout(function() {
                    serialPort.emit('data', 'or\n');
                }, 1510);
            };
            PortalController.open(null, res, serialPort);

            this.clock.tick(1600);
            sinon.assert.calledWithMatch(res.json, { error: "Arduino failed to open the portal" }, 500);
            assert(serialPort.close.calledOnce);
        });
    });
});