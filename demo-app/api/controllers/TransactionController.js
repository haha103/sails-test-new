/**
 * TransactionController
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
    var errs = [];
    User.findOne({ id: req.session.User.id }).done(function(err, user) {
      if (err) { errs.push(err); return; }
      var type = req.param("type");
      if (type == "recharge") {
        var trans = {
          user_id: user.id,
          type: type,
          amount: req.param("recharge_amount"),
          recharge_from_bank_account: user.bank_account,
        }; 
        Transaction.create(trans, function (err, trans) {
          if (err) { errs.push(err); return; }
          if (!user.balance) { 
            user["balance"] = trans.amount; 
          } else {
            user.balance += trans.amount;
          }
          console.log(user);
          user.save(function(err, u) {
            if (err) { errs.push(err); return; }
            req.session.User = u;
          });
        });
        res.redirect("/user/show/" + user.id);
      } else if (type == "withdraw") {
        if (!user.balance) {
          user["balance"] = 0;
        } 
        if (user.balance < req.param("withdraw_amount")) {
          var err = { name: '交易失败', message: '余额不够' };
          errs.push(err);
          req.session.flash = { err: errs };
          res.redirect("/user/show/" + user.id);
          return;
        }
        var trans = {
          user_id: user.id,
          type: type,
          amount: req.param("withdraw_amount"),
          withdraw_to_bank_account: user.bank_account,
        }; 
        Transaction.create(trans, function (err, trans) {
          if (err) { errs.push(err); return; }
          user.balance -= trans.amount;
          console.log(user);
          user.save(function(err, u) {
            if (err) { errs.push(err); return; }
            req.session.User = u;
          });
        });
        res.redirect("/user/show/" + user.id);
      } else if (type == "transfer") {

      } else {

      }
    });
    return;
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to TransactionController)
   */
  _config: {}

  
};
