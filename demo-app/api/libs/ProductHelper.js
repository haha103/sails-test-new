var self = {
	sumFieldByFilter: function(filter, field) {
		var sum = null;
		Product.find(filter).sum(field).done(function(err, ps) {
			if (err) {
				console.log(err);
				return;
			}
			sum = ps[0][field];
		});
		return sum;
	},
};

module.exports = self;
