var ClientHelper = require("../libs/ClientHelper");
var AppHelper = require("../libs/ApplicationHelper");
var CreditTypeHelper = require("../libs/CreditTypeHelper");
var CreditPurposeHelper = require("../libs/CreditPurposeHelper");

module.exports = {
  compactObj: function (o) {
    var r = { };
    for (var k in o) {
      var v = o[k];
      var nv = v;
      if (_.isArray(v)) nv = _.compact(v);
      r[k] = nv;
    }
    return r;
  },
  
  get_app_info: function(app) {
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
  },
  get_investigation_info: function(id) {
    var investigation_info = null;
    Investigation.findOne({ id: id }).done(function(err, val) {
      if (err) { return; }
      investigation_info = val;
    });
    return investigation_info;
  },
  get_investigation_info_by_app: function(app) {
    var investigation_info = null;
    Investigation.findOne({ application: app }).done(function(err, val) {
      if (err) { return; }
      investigation_info = val;
    });
    return investigation_info;
  },
  get_riskassessment_info: function(id) {
    var riskassessment_info = null;
    RiskAssessment.findOne({ id: id }).done(function(err, val) {
      if (err) { return; }
      riskassessment_info = val;
    });
    return riskassessment_info;
  },
  get_riskassessment_info_by_app: function(app) {
    var riskassessment_info = null;
    RiskAssessment.findOne({ application: app }).done(function(err, val) {
      if (err) { return; }
      riskassessment_info = val;
    });
    return riskassessment_info;
  },
  get_review_info: function(id) {
    var review_info = null;
    Review.findOne({ id: id }).done(function(err, val) {
      if (err) { return; }
      review_info = val;
    });
    return review_info;
  },
  get_review_info_by_app: function(app) {
    var review_info = null;
    Review.findOne({ application: app }).done(function(err, val) {
      if (err) { return; }
      review_info = val;
    });
    return review_info;
  },
};
