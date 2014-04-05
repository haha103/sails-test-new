/**
 * HelpMessageController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  create: function(req, res, next) {
		console.log(req.params.all());
		var message = {
			type: req.param("newmessage_type"),
			title: req.param("newmessage_title"),
			desc: req.param("newmessage_desc"),
			user: req.session.User.id
		};
		HelpMessage.create(message, function(err, m) {
			if (err) {
				console.log(err);
				res.json(err);
				return;
			}
			res.redirect("/user/show/" + req.session.User.id + "?subpage=messagehelp");		
		});
	},


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to HelpMessageController)
   */
  _config: {}

  
};
