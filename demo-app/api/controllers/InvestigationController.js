/**
 * InvestigationController
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

var Helper = require('../libs/Helper');
/*
var ClientHelper = require("../libs/ClientHelper");
var AppHelper = require("../libs/ApplicationHelper");
var CreditTypeHelper = require("../libs/CreditTypeHelper");
var CreditPurposeHelper = require("../libs/CreditPurposeHelper");
*/
var display_name = {
  blacklisted: "进入一下系统黑名单",
  credit_rating: "信用评级",
  avg_score: "综合评分",
  case_summary: "业务简介",
  bank_card: "货款卡号",
  actual_owner: "实际控制人",
  actual_owner_addr: "实际控制人住址",
  actual_owner_phone: "实际控制人电话",
  last_year_inspected: "去年是否年检",
  licence: "执照号",
  national_tax_id: "国税号",
  local_tax_id: "地税号",
  require_certs: "需要特殊资质证书",
  has_certs: "已取得特殊资质证书",
  legal_person_addr: "法人代表住址",
  registration_others: "其他注册情况"
};

module.exports = {
    
  new: function(req, res, next) {
    var app = req.param("app");
    if (!app) {
      res.redirect("/investigation/");
      return;
    }
    Investigation.findOne({ application: app }).done(function(err, val) {
      if (err) { return next(err); }
      if (val) { res.redirect("/investigation/"); return; }
    });
    
    var app_info = Helper.get_app_info(app);
    //console.log(app_info);

    var curr_action = "new";
    var model = "investigation";
    var title = "调查报告";
    res.view({ 
      app_info    : app_info,
      curr_action : curr_action,
      model       : model,
      title       : title,
      display_name: display_name
    });
  },

  create: function(req, res, next) {
    var bank_accounts = [];
    var values = Helper.compactObj(req.params.all());
    var matched = null;
    var keys = _.keys(values);
    keys.map(function(k) {
      if (k in Investigation.attributes) {
        if (_.contains(["blacklisted"], k)) {
          values[k] = _.flatten([ values[k] ]);
        }
      } else if ((matched = k.match(/^bank_account_(.+)_([0-9]+$)/))) {
        var index = matched[2] - 1;
        var field = matched[1];
        if (typeof bank_accounts[index] == "undefined") {
          bank_accounts[index] = {};
        }
        bank_accounts[index][field] = values[k];
        matched = null;
        delete values[k];
      } else {
        console.log("'" + k + "' is not a valid field ... skipping ...");
        delete values[k];
      }
    });

    var errs = [];
    Investigation.create(values, function(err, val) {
      
      if (err) { errs.push(err); return; }

      var client = null;
      Application.findOne({ id: val.application }).done(function(err, app) {
        client = app.applicant;
      });

      for (var i = 0; i < bank_accounts.length; ++i) {
        var bank_account = bank_accounts[i];
        bank_account.client = client;
        bank_account.application = val.application;
        bank_account.investigation = val.id;
        ClientBankAccount.create(bank_account, function(err, acc) {
          if (err) { errs.push(err); return; }
          if (typeof val.bank_accounts == "undefined") { val.bank_accounts = []; }
          val.bank_accounts.push(acc.id);
        });
      }

      val.save(function (err) {
        if (err) { errs.push(err); return; }
      });

    });

    if (errs.length > 0) {
      res.json(errs);
    } else {
      res.redirect("/investigation/");
    }
  },

  index: function(req, res, next) {
    res.redirect("/application/");
  },

  show: function(req, res, next) {
    var app_info = Helper.get_app_info(req.param("app"));
    var investigation_info = Helper.get_investigation_info(req.param("id"));
    var curr_action = "show";
    var edit = false;
    var model = "investigation";
    var title = "调查报告";
    //console.log(investigation_info);
    res.view({ 
      app_info           : app_info,
      investigation_info : investigation_info,
      curr_action        : curr_action,
      model              : model,
      title              : title,
      display_name       : display_name,
      edit               : edit
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to InvestigationController)
   */
  _config: {}


};

/*
function _get_app_info(app) {
  var app_info = {};
  app_info.id                = app;
  app_info.applicant         = ""; // ClientType + Client
  app_info.type              = ""; // ApplicationType
  app_info.amount            = "";
  app_info.credit_types      = []; // CreditType
  app_info.credit_purposes   = []; // CreditPurpose
  app_info.due               = "";
  app_info.applicant_domains = []; // Domain

  Application.findOne({ id: app }).done(function(err, app) {
    if (err) { app_info = null; return; }
    app_info.applicant         = ClientHelper.getTypeName(app.applicant) + " - " + ClientHelper.getName(app.applicant);
    app_info.type              = AppHelper.getTypeNameByTypeID(app.type);
    app_info.amount            = app.amount;
    app_info.credit_types      = CreditTypeHelper.getNamesByIDs(app.credit_types);
    app_info.credit_purposes   = CreditPurposeHelper.getNamesByIDs(app.credit_purposes);
    app_info.due               = app.due;
    app_info.applicant_domains = ClientHelper.getDomainsByID(app.applicant);
  });
  return app_info;
}

function _get_investigation_info(id) {
  var investigation_info = null;
  Investigation.findOne({ id: id }).done(function(err, val) {
    if (err) { return; }
    investigation_info = val;
  });
  return investigation_info;
}
*/
