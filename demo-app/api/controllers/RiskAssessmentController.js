/**
 * RiskAssessmentController
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
  "fact_basics": "基本情况及重点问题",
  "fact_finance": "财务状况分析",
  "fact_background": "项目背景及基本情况",
  "fact_misc": "其他重点调查问题",
  "analysis_purpose_and_amount": "授信用途与需求量",
  "analysis_repay_src": "还款来源",
  "analysis_risk_items": "风险点",
  "analysis_guarantee": "担保合法性和可控性",
  "analysis_risk_control": "风险防范建议",
  "analysis_materials": "项目资料完备性及合法性",
  "overall_comment": "项目综合意见"
};
var model = "riskassessment";
var title = "风险报告";

module.exports = {
    
  new: function(req, res, next) {
    var app = req.param("app");
    if (!app) {
      res.redirect("/application/");
      return;
    }
    RiskAssessment.findOne({ application: app }).done(function(err, val) {
      if (err) { return next(err); }
      if (val) { res.redirect("/application/"); return; }
    });
    
    var app_info = Helper.get_app_info(app);
    var investigation_info = Helper.get_investigation_info_by_app(app);
    //console.log(app_info);

    var curr_action = "new";
    res.view({ 
      app_info           : app_info,
      investigation_info : investigation_info,
      curr_action        : curr_action,
      model              : model,
      title              : title,
      display_name       : display_name
    });
  }, 

  create: function(req, res, next) {
    //console.log(req.params.all());
    var errs = [];
    RiskAssessment.create(req.params.all(), function(err, val) {
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
    var riskassessment_info = Helper.get_riskassessment_info(req.param("id"));
    var curr_action = "show";
    var edit = false;
    res.view({ 
      app_info            : app_info,
      investigation_info  : investigation_info,
      riskassessment_info : riskassessment_info,
      curr_action         : curr_action,
      model               : model,
      title               : title,
      display_name        : display_name,
      edit                : edit
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to RiskAssessmentController)
   */
  _config: {}

  
};
