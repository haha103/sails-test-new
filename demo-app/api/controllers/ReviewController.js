/**
 * ReviewController
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
var display_name = {
  "topics": "评审事项",
  "date": "评审会召开时间",
  "host": "主持人",
  "recorder": "记录人",
  "account_mgr": "客户经理",
  "risk_mgr": "风险经理",
  "attendees": "会议出席人员",
  "reviewed_amount": "评审通过金额",
  "reviewed_due": "评审通过期限",
  "reviewed_interest_rate": "评审通过利率",
  "summary": "评审会摘要",
  "review_result": "评审会结论"
};
var model = "review";
var title = "评审会报告";

module.exports = {
    
  new: function(req, res, next) {
    var app = req.param("app");
    if (!app) {
      res.redirect("/application/");
      return;
    }
    Review.findOne({ application: app }).done(function(err, val) {
      if (err) { return next(err); }
      if (val) { res.redirect("/application/"); return; }
    });
    
    var app_info = Helper.get_app_info(app);
    var investigation_info = Helper.get_investigation_info_by_app(app);
    var riskassessment_info = Helper.get_riskassessment_info_by_app(app);
    //console.log(app_info);

    var curr_action = "new";
    res.view({ 
      app_info            : app_info,
      investigation_info  : investigation_info,
      riskassessment_info : riskassessment_info,
      curr_action         : curr_action,
      model               : model,
      title               : title,
      display_name        : display_name
    });
  },

  create: function(req, res, next) {
    //console.log(req.params.all());
    var errs = [];
    Review.create(req.params.all(), function(err, val) {
      if (err) { errs.push(err); return; }
    });
    if (errs.length > 0) {
      res.json(errs);
    } else {
      res.redirect("/application");
    }
  },

  show: function(req, res, next) {
    var app = req.param("app");
    var app_info = Helper.get_app_info(app);
    var investigation_info = Helper.get_investigation_info_by_app(app);
    var riskassessment_info = Helper.get_riskassessment_info_by_app(app);
    var review_info = Helper.get_review_info(req.param("id"));
    var curr_action = "show";
    var edit = false;
    res.view({ 
      app_info            : app_info,
      investigation_info  : investigation_info,
      riskassessment_info : riskassessment_info,
      review_info         : review_info,
      curr_action         : curr_action,
      model               : model,
      title               : title,
      display_name        : display_name,
      edit                : edit
    });
  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ReviewController)
   */
  _config: {}

  
};
