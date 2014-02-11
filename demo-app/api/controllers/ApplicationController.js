/**
 * ApplicationController
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
var WorkflowHelper = require('../libs/WorkflowHelper');
var Helper = require('../libs/Helper');
var S = require('string');

var display_name = {
  
  "type"            : "申请类型"     ,
  "applicant"       : "申请者"       ,
  "credit_types"    : "授信类型"     ,
  "credit_purposes" : "授信用途"     ,
  "mortgages"       : "抵押物"       ,
  "amount"          : "申请金额"     ,
  "partners"        : "合作机构"     ,
  "due"             : "还款日期"     ,
  "payment_source"  : "还款资金来源"

};

module.exports = {
    
   new: function(req, res) {
    var curr_action = "new";
    var model = "application";
    var title = "申请";
    res.view({ 
      display_name : display_name ,
      curr_action  : curr_action  ,
      model        : model        ,
      title        : title
    });
  },

  create: function(req, res, next) {
    var app = {};
    var guarantors = [];
    var mortgages = [];
    var compacted_params = Helper.compactObj(req.params.all());
    for (var k in compacted_params) {
      var v = compacted_params[k];
      if (k in Application.attributes) {
        if (_.contains(["partners", "credit_types", "credit_purposes"], k)) {
          v = _.flatten([ v ]);
        }
        app[k] = v;
      } else if (S(k).startsWith("mortgage_")) {
        var arr = k.split("_");
        arr.shift();
        var index = parseInt(arr.pop()) - 1;
        var field = arr.join("_");
        if (typeof mortgages[index] == "undefined") {
          mortgages[index] = {};
        }
        mortgages[index][field] = v;
      } else if (S(k).startsWith("guarantor_")) {
        var arr = k.split("_");
        arr.shift();
        var index = parseInt(arr.pop()) - 1;
        var field = arr.join("_");
        if (typeof guarantors[index] == "undefined") {
          guarantors[index] = {};
        }
        guarantors[index][field] = v;
      } else {
        console.log("'" + k + "' is not a valid field ... skipping ...");
      }
    }
    Workflow.findOne({ id: app.workflow }).done(function(err, workflow) {
      var init_state = WorkflowHelper.getInitState(workflow);
      app.state = init_state;
    });

    //console.log(app);
    //console.log(guarantors);
    var errs = [];
    Application.create(app, function applicationCreated(err, app) {
      if (err) {
        errs.push(err);
        return;
      }
      for (var i = 0; i < mortgages.length; ++i) {
        mortgage = mortgages[i];
        mortgage.application = app.id;
        Mortgage.create(mortgage, function mortgageCreated(err, mortgage) {
          if (err) {
            errs.push(err);
            return;
          }
          if (typeof app.mortgages == "undefined") app.mortgages = [];
          app.mortgages.push(mortgage.id);
        });
      }
      for (var i = 0; i < guarantors.length; ++i) {
        guarantor = guarantors[i];
        guarantor.application = app.id;
        Guarantor.create(guarantor, function guarantorCreated(err, guarantor) {
          if (err) {
            errs.push(err);
            return;
          }
          if (typeof app.guarantors == "undefined") app.guarantors = [];
          app.guarantors.push(guarantor.id);
        });
      }
      app.save(function(err) {
        if (err) {
          errs.push(err);
          return;
        }
      });
    });
    if (errs.length > 0) {
      res.json(errs);
    } else {
      res.redirect("/application");
    }
  },

  index: function(req, res, next) {
    var curr_action = "index";
    var model = "application";
    var title = "申请";
    Application.find({}).done(function foundApplication(err, apps) {
      if (err) return next(err);
      res.view({ 
        curr_action: curr_action,
        model: model,
        title: title,
        apps: apps,
        WorkflowHelper: WorkflowHelper
      });
    });
  },

  transition: function(req, res, next) {
    console.log(req.params.all());
    Application.findOne({ id: req.param("app") }).done(function (err, app) {
      if (err) return next(err);
      app.state = req.param("next_state");
      app.save(function (err, app) {
        if (err) return next(err);
      });
    });
    res.redirect("/application");
  },

  update: function(req, res, next) {
    console.log(req.params.all());
    var next_path = "/application";
    Application.findOne({ id: req.param("id") }).done(function (err, app) {
      if (err) return next(err);
      var model = WorkflowHelper.getModel(app.state);
      next_path = "/" + model;
      switch(model) {
        case "application":
          next_path += "/show";
          break;
        case "investigation":
          Investigation.findOne({ application: app.id }).done(function(err, o) {
            if (err) return next(err);
            next_path += (o ? "/show" + "/" + o.id + "?" : "/new?");
          });
          break;
        case "riskassessment":
          RiskAssessment.findOne({ application: app.id }).done(function(err, o) {
            if (err) return next(err);
            next_path += (o ? "/show" + "/" + o.id + "?" : "/new?");
          });
          break;
        case "review":
          Review.findOne({ application: app.id }).done(function(err, o) {
            if (err) return next(err);
            next_path += (o ? "/show" + "/" + o.id + "?" : "/new?");
          });
          break;
        default:
          break;
      }
      next_path += "app=" + app.id;
    });
    console.log(next_path);
    res.redirect(next_path);
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ApplicationController)
   */
  _config: {}


};
