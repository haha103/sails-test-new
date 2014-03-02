/**
 * SessionController
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
var bcrypt = require('bcrypt');
var captchagen = require('captchagen');

module.exports = {
  
  'new': function(req, res) {
    var captcha = captchagen.create();
    captcha.generate();
    req.session.Captcha = {
      uri: captcha.uri(),
      txt: captcha.text()
    };
    res.view();
  },

  validatecaptcha: function(req, res) {
    var data = { result: false };
    if (req.param('captcha') ==  req.session.Captcha.txt) {
      data.result = true;
    }
    res.json(data);
  },

  'create': function(req, res, next) {
    if (!req.param('user_name') || !req.param('password')) {
      var err = [{
        name: '输入错误',
        message: '请输入用户名和密码'
      }];
      req.session.flash = { err: err };
      res.redirect('/session/new');
      return;
    }
    if (req.session.Captcha && req.param('captcha') != req.session.Captcha.txt) {
      var err = [{
        name: '验证码错误',
        message: '本站很脆弱，请不要尝试攻击本站'
      }];
      req.session.flash = { err: err };
      res.redirect('/session/new');
      return;
    }
    User.findOne({ user_name: req.param("user_name") }, function foundUser(err, user) {
      if (err) return next(err);
      if (!user) {
        var err = [{
          name: '认证错误',
          message: '用户名 \'' + req.param('user_name') + '\' 没找到。'
        }];
        req.session.flash = { err: err };
        res.redirect('/session/new');
        return; 
      }

      bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) return next(err);
        if (!valid) {
          var err = [{
            name: '认证错误',
            message: '用户名密码不匹配'
          }];
          req.session.flash = { err: err };
          res.redirect('/session/new');
          return; 
        } 
        req.session.authenticated = true;
        req.session.User = user;
        user.online = true;
        user.save(function(err, user) {
          if (err) return next(err);

          User.publishUpdate(user.id, { 
            loggedIn: true, 
            id: user.id,
            name: user.name,
            action: ' 已登录'
          });

          if (user.admin) {
            res.redirect('/product');
            return;
          }
          res.redirect('/user/show/' + user.id);
        });
      });
    });
  },

  'destroy': function(req, res, next) {
    User.findOne(req.session.User.id, function foundUser(err, user) {
      if (err) return next(err);
      if (user) {
        User.update(user.id, { online: false }, function(err) {
          User.publishUpdate(user.id, { 
            loggedIn: false, 
            id: user.id,
            name: user.name,
            action: " 已注销"
          });
          req.session.destroy();
          res.redirect('/product');
        });
      } else {
        req.session.destroy();
        res.redirect('/product');
      }

    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}

  
};
        message: 'You must enter both username and password.'
