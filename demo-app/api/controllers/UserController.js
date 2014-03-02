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
var captchagen = require('captchagen');
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var mkdirp = require('mkdirp');
var bcrypt = require('bcrypt');

var display_name = {
  'user_name'              : '用户名',
  'name'                   : '姓名',
  'id_card'                : '身份证号码',
  'email'                  : '电子邮箱',
  'password'               : '密码',
  'confirmation'           : '请再次输入密码',
  'agreement_acknowledged' : '已阅读并同意协议',
  'bank_name'              : '开户行',
  'bank_city'              : '城市',
  'bank_province'          : '省份',
  'bank_account'           : '帐号',
  'city'                   : '居住地城市',
  'province'               : '居住地省份',
  'address'                : '居住地详细地址',
  'phone'                  : '联系电话',
  'captcha'                : '验证码',
};

var cities = CityHelper.get_cities();

module.exports = {
    
	'new': function (req, res) {
    var captcha = captchagen.create();
    captcha.generate();
    console.log(captcha.text());
    req.session.Captcha = {
      uri: captcha.uri(),
      txt: captcha.text()
    };
    res.view({ 
      display_name: display_name,
    });
  },

  validatecaptcha: function(req, res) {
    var data = { result: false };
    if (req.param('captcha') ==  req.session.Captcha.txt) {
      data.result = true;
    }
    res.json(data);
  },

	'create': function (req, res, next) {
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

  regcompletion: function(req, res, next) {
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

  recharge: function(req, res, next) {
    res.view();
  },

	'show': function (req, res, next) {
    var subpage = req.param('subpage') ? req.param('subpage') : "home";
    var errs = [];
		User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) {
        console.log(err);
        errs.push({
          name: "查找用户失败",
          message: "数据库查询错误"
        });
        return;
      } else if (!user) {
        errs.push({
          name: "查找用户失败",
          message: "未找到该用户"
        });
        return;
      } else if (!user.activated) {
        res.redirect("/user/activation/" + user.id);
      } else if (!user.bank_binded) {
        res.redirect("/user/bindbank/" + user.id);
      } else if (!user.reg_completed) {
        res.redirect("/user/regcompletion/" + user.id);
      } else {
        res.view({
          user: user,
          subpage: subpage,
          display_name: display_name,
          cities: cities
        });
      }
		});
    if (errs.length > 0) {
      req.session.flash = { err: errs};
      res.redirect("/session/new");
    }
	},

  /*
	'index': function(req, res, next) {
		User.find(function foundUsers (err, users){
			if (err) return next(err);
			res.view({
				users: users
			});
		});
	},
  */

	'update': function(req, res, next) {
    var userObj = { };
    [
      'name', 'user_name', 'email', 'password', 
      'bank_name', 'bank_account', 'bank_city', 'bank_province',
      'city', 'province', 'address', 'phone'
    ].map(function(field) {
      if (req.param(field)) userObj[field] = req.param(field);
    });
    if (req.param('bank_binded') == 'true') userObj.bank_binded = true;
    if (req.param('reg_completed') == 'true') userObj.reg_completed = true;
    console.log(userObj);
		User.update(req.param('id'), userObj, function userUpdated(err) {
			if (err) {
				return res.json(err);
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
    vals = cities[req.param("province")];
    res.json(vals ? vals : []);
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  

};
