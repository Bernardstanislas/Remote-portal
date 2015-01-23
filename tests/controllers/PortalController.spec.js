/**
 * Created by stan on 17/12/14.
 */

var PortalController = require('../../api/controllers/PortalController'),
    sinon = require('sinon'),
    assert = require('assert');

/**
 * Stubbed res object
 * @type({json: function})
 */
var res = {
    json: sinon.stub()
};

/**
* Mocked Arduino service
* @type({openPortal: function})
*/
global.ArduinoService = {
};

function prepare() {
    res.json.reset();
}

describe('The Portal Controller', function () {
    describe('when we call the open action with a bad port configured', function () {
        it ('should return a 404 error with an explicit message and close the serial connection.', function () {
            prepare();
            global.ArduinoService.openPortal = function(cb) {
                cb({error: 'Arduino not found'}, 404);
            };
            PortalController.open(null, res);
            sinon.assert.calledWithMatch(res.json, { error: "Arduino not found" }, 404);
        });
    });

    describe('when we call the open action with a good port configured and a deaf arduino', function() {
        it('should return a 503 error with an explicit message and close the serial connection.', function () {
            prepare();
            global.ArduinoService.openPortal = function(cb) {
                cb({ error: "Failed to talk with arduino" }, 503);
            };
            PortalController.open(null, res);
            sinon.assert.calledWithMatch(res.json, { error: "Failed to talk with arduino" }, 503);
        });
    });

    describe('when we call the open action with a good port configured and a weird talking arduino', function() {
        it ('should return a 400 error with an explicit message and close the serial conection.', function() {
            this.clock = sinon.useFakeTimers();
            prepare();
            global.ArduinoService.openPortal = function(cb) {
                setTimeout(function() {
                    cb({ error: "Arduino replied crap" }, 400);
                }, 1500);
            };
            PortalController.open(null, res);

            this.clock.tick(1600);
            sinon.assert.calledWithMatch(res.json, { error: "Arduino replied crap" }, 400);
        });
    });

    describe('when we call the open action with a good port configured and a faulty arduino', function() {
        it ('should return a 500 error with an explicit message and close the serial conection.', function() {
            this.clock = sinon.useFakeTimers();
            prepare();
            global.ArduinoService.openPortal = function(cb) {
                setTimeout(function() {
                    cb({ error: "Arduino failed to open the portal" }, 500);
                }, 1500);
            };
            PortalController.open(null, res);

            this.clock.tick(1600);
            sinon.assert.calledWithMatch(res.json, { error: "Arduino failed to open the portal" }, 500);
        });
    });

    describe('when we call the open action with a good port configured and a working arduino', function() {
        it ('should return a 200 response with an explicit message and close the serial conection.', function() {
            this.clock = sinon.useFakeTimers();
            prepare();
            global.ArduinoService.openPortal = function(cb) {
                setTimeout(function() {
                    cb({ message: "Success" }, 200);
                }, 1500);
            };
            PortalController.open(null, res);

            this.clock.tick(1600);
            sinon.assert.calledWithMatch(res.json, { message: "Success" }, 200);
        });
    });
});