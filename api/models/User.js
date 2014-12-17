/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    username : {
      type: 'string',
      unique: true,
      required: true
    },
    deviceid : {
      type: 'string',
      unique: true,
      required: true
    }
  },

  // beforeCreate: function(attrs, next) {
  //   var bcrypt = require('bcrypt');
  //   bcrypt.genSalt(10, function(err, salt) {
  //     if (err) return next(err);
  //     bcrypt.hash(attrs.deviceid, salt, function(err, hash) {
  //       if (err) return next(err);
  //       attrs.deviceid = hash;
  //       next();
  //     });
  //   });
  // }
};
