/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {
 	create: function(req, res) {
 		if (sails.config.environment === 'development') {
 			var params = req.params.all();
 			User.create(params, function(err, user) {
 				if (err) res.json({error: 'Database error'}, 500);
 				res.json(user, 201);
 			});
 		} else {
 			res.json({message: "Registration closed, sorry"}, 403);
 		}
 	},

 	login: function (req, res) {
 		var bcrypt = require('bcrypt');

 		User.findOneByUsername(req.body.username).exec(function (err, user) {
 			if (err) res.json({ error: 'DB error' }, 500);

 			if (user) {
 				bcrypt.compare(req.body.password, user.password, function (err, match) {
 					if (err) res.json({ error: 'Server error' }, 500);

 					if (match) {
	            // password match
	            req.session.user = user.id;
	            res.json(user, 200);
	        } else {
	            // invalid password
	            if (req.session.user) req.session.user = null;
	            res.json({ error: 'Invalid password' }, 400);
	        }
	    });
 			} else {
 				res.json({ error: 'User not found' }, 404);
 			}
 		});
 	},

 	logout: function(req, res) {
 		req.session.user = null;
 		res.redirect('/');
 	}
 };
