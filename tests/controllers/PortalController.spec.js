/**
 * Created by stan on 17/12/14.
 */

var PortalController = require('../../api/controllers/PortalController'),
    sinon = require('sinon'),
    assert = require('assert');

describe('The Portal Controller', function () {
    describe('when we call the trigger page', function () {
        it ('should return a 500 error', function () {
            var res = {
                json: sinon.stub()
            };
            PortalController.open(null, res);
            sinon.assert.calledWithMatch(res.json, { message: "error" }, 500);
        });
    });
});