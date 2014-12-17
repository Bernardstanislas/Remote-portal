/**
 * Created by stan on 17/12/14.
 */

var PortalController = require('../../api/controllers/PortalController'),
    sinon = require('sinon'),
    assert = require('assert');

describe('The Portal Controller', function () {
    describe('when we call the trigger page', function () {
        it ('should lift an error', function () {
            var cb = sinon.spy();
            PortalController.open(null, {
                json: cb
            });
            assert.ok(cb.called);
        });
    });
});