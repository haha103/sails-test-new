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

module.exports = {
    
  
  'new': function(req, res) {
    res.view('session/new');
  },

  'create': function(req, res, next) {
    if (!req.param('email') || !req.param('password')) {
      var err = [{
        name: 'username AND password required',
        message: 'You must enter both username and password.'
      }];
      req.session.flash = { err: err };
      res.redirect('/session/new');
      return;
    }

    User.findOneByEmail(req.param('email'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) {
        var err = [{
          name: 'No such account',
          message: 'The email address \'' + req.param('email') + '\' not found.'
        }];
        req.session.flash = { err: err };
        res.redirect('/session/new');
        return; 
      }

      bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) return next(err);
        if (!valid) {
          var err = [{
            name: 'Incorrect password',
            message: 'Incorrect password for user \'' + req.param('email') + '\'.'
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
            action: ' has logged in.'
          });

          if (user.admin) {
            res.redirect('/user');
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
            action: " has logged out."
          });
          req.session.destroy();
          res.redirect('/session/new');
        });
      } else {
        req.session.destroy();
        res.redirect('/session/new');
      }

    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}

  
};
