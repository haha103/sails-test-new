var self = {
	getUserNameById: function(id) {
		var ret = null;
		User.findOne(id).done(function(err, user) {
			if (err) {
				console.log(err);
				return;
			}
			ret = user.user_name;
		});
		return ret;
	},
};

module.exports = self;
