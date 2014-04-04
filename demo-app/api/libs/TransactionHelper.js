var self = {
	sumByFilter: function(filter) {
		var sum = null;
		Transaction.find(filter).sum("amount").done(function(err, trans) {
			if (err) {
				console.log(err);
				return;
			}
			console.log(trans[0]);
			sum = trans[0].amount;
		});
		return sum;
	},
};

module.exports = self;
