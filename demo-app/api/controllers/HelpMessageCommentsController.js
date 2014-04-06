/**
 * HelpMessageCommentsController
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
		var comment = {
			message: req.param("message"),
			user: req.session.User.id,
			content: req.param("newmessagecomment_content")
		};

		HelpMessageComments.create(comment).done(function(err, c) {
			if (err) {
				console.log(err);
				return;
			}
		});
		
		console.log(comment);
		res.redirect(req.param("previousurl"));
	},


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to HelpMessageCommentsController)
   */
  _config: {}

  
};
