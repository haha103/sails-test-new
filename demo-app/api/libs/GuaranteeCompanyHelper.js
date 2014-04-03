module.exports = {
  find: function(condition) {
		condition = condition || {};
		var ret = null;
		GuaranteeCompany.find(condition).done(function(err, companies) {
			if (err) { console.log(err); return; }
			ret = companies;
		});
		return ret;
  },
};
