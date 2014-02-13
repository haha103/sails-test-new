/**
 * UserController
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

var CityHelper = require("../libs/CityHelper");

var display_name = {
  'user_name'              : '用户名',
  'name'                   : '姓名',
  'id_card'                : '身份证号码',
  'email'                  : '电子邮箱',
  'password'               : '密码',
  'confirmation'           : '请再次输入密码',
  'agreement_acknowledged' : '已阅读并同意协议',
  'bank':'开户行',
  'city':'城市',
  'province': '省份'
};

var cities = CityHelper.get_cities();

module.exports = {
    
	'new': function (req, res) {
		res.view({ display_name: display_name });
	},

	'create': function (req, res, next) {
    //console.log(req.params.all());
		User.create(req.params.all(), function userCreated(err, user) {
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err
				}				
				return res.redirect('/user/new');
			}
      req.session.authenticated = true;
      req.session.User = user;
      user.online = true;
      user.save(function(err, user) {
        if (err) return next(err);
        user.action = " has been created.";
        User.publishCreate(user);
        res.redirect('/user/activation/' + user.id);
      });
      req.session.flash = {};
		});
	},

  bindbank: function(req, res, next) {
    var user_info = {};
    User.findOne({ id: req.param("id") }).done(function(err, val) {
      if (err) return next(err);
      user_info = val;
    });
    res.view({ 
      display_name: display_name,
      user_info: user_info,
      cities: cities
    });
  },

  activation: function(req, res, next) {
    //console.log(req.params.all());
    var user_info = {};
    User.findOne({ id: req.param("id") }).done(function(err, val) {
      if (err) return next(err);
      user_info = val;
    });
    //console.log(user_info);
    res.view({ 
      display_name: display_name,
      user_info: user_info
    });
  },

	'show': function (req, res, next) {
		User.findOne(req.params['id'], function foundUser (err, user) {
			if (err) return next(err);
			if (!user) return next('User does not exist.');
			res.view({
				user: user
			});
		});
	},

	'index': function(req, res, next) {
		User.find(function foundUsers (err, users){
			if (err) return next(err);
			res.view({
				users: users
			});
		});
	},

	'update': function(req, res, next) {
    var userObj = {
      name: req.param('name'),
      user_name: req.param('user_name'),
      email: req.param('email'),
      password: req.param('password')
    };
    if (req.session.User.admin) {
      userObj.admin = req.param('admin');
    }
		User.update(req.param('id'), userObj, function userUpdated(err) {
			if (err) {
				return res.redirect('/user/show/' + req.param('id'));
			}
			res.redirect('/user/show/' + req.param('id'));
		});
	},

  'destroy': function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next('User does not exist.');
      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);
        User.publishUpdate(user.id, {
          name: user.name,
          action: ' has been destroyed.'
        });
        User.publishDestroy(user.id);
      });
      res.redirect('/user');
    });
  },

  'subscribe': function(req, res) {
    User.find(function foundUsers(err, users) {
      if (err) return next(err);
      User.subscribe(req.socket);
      User.subscribe(req.socket, users);
      res.send(200);
    });
  },

  cities: function(req, res) {
    console.log(req.params.all());
    res.json(cities[req.param("province")]);
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  

};
