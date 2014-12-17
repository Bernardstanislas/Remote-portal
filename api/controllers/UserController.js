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

	login: function(req, res) {
		User.findOneByUsername(req.body.username, function(err, user) {
			if (err) res.json({error: 'Database error'}, 500);
			if (user) {
				var match = (user.deviceid == req.body.deviceid);
				if (match) {
					// DeviceId match
					req.session.user = user.id;
					res.json(user);
				} else {
					// Invalid deviceId
					if (req.session.user) req.session.user = null;
					res.json({error: 'Invalid deviceId'}, 400);
				}
			} else {
				res.json({error: 'User not found'}, 400);
			}
		})
	},

	logout: function(req, res) {
		req.session.user = null;
		res.redirect('/');
	}
};
