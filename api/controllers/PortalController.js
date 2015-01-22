/**
* PortalController
*
* @description :: Server-side logic for opening portal
* @help        :: See http://links.sailsjs.org/docs/controllers
*/

function open(req, res) {
  ArduinoService.openPortal(res.json);
}

module.exports = {
  open: function(req, res) {
    open(req, res);
  }
};
