/**
 * ClientController
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
var S = require('string');

var display_name = {
  "pid"           : "ID"       , "name"        : "名字"     , "email"                  : "电子邮箱"     ,
  "address"       : "地址"     , "phone"       : "电话"     , "type"                   : "客户类型"     ,
  "loans"         : "贷款情况" , "domains"     : "从事行业" , "profit_curr_year"       : "今年利润"     ,
  "employer"      : "雇主"     , "title"       : "职位"     , "profit_last_year"       : "去年利润"     ,
  "legal_person"  : "法人"     , "contact"     : "联系人"   , "contact_phone"          : "联系人电话"   ,
  "founded"       : "成立时间" , "products"    : "主要产品" , "registered_capital"     : "注册资金"     ,
  "total_asset"   : "总资产"   , "net_asset"   : "净资产"   , "asset_liability_ratio"  : "资产负债率"   ,
  "current_ratio" : "流动比率" , "quick_ratio" : "速动比率" , "sales_income_last_year" : "去年销售收入" ,
  "shareholders"  : "股权结构" , "bondings"    : "对外担保" , "sales_income_curr_year" : "今年销售收入" ,
  "yearly_income" : "年收入"   , "education"   : "学历"
};

module.exports = {
    
  new: function(req, res) {
    var curr_action = "new";
    var model = "client";
    var title = "客户";
    res.view({ 
      display_name : display_name ,
      curr_action  : curr_action  ,
      model        : model        ,
      title        : title
    });
  },

  create: function(req, res, next) {
    var client = {}; 
    var shareholders = [];
    var loans = [];
    var bondings = [];
    var compacted_params = Helper.compactObj(req.params.all());
    for (var k in compacted_params) {
      var v = compacted_params[k];
      if (k in Client.attributes) {
        client[k] = v;
      } else if (S(k).startsWith("shareholder_")) {
        var arr = k.split("_");
        arr.shift();
        var index = parseInt(arr.pop()) - 1;
        var field = arr.join("_");
        if (typeof shareholders[index] == "undefined") {
          shareholders[index] = {};
        }
        shareholders[index][field] = v;
      } else if (S(k).startsWith("loan_")) {
        var arr = k.split("_");
        arr.shift();
        var index = parseInt(arr.pop()) - 1;
        var field = arr.join("_");
        if (typeof loans[index] == "undefined") {
          loans[index] = {};
        }
        loans[index][field] = v;
      } else if (S(k).startsWith("bonding_")) {
        var arr = k.split("_");
        arr.shift();
        var index = parseInt(arr.pop()) - 1;
        var field = arr.join("_");
        if (typeof bondings[index] == "undefined") {
          bondings[index] = {};
        }
        bondings[index][field] = v;
      } else {
        console.log("'" + k + "' is not a valid field ... skipping ...");
      }
    }
    console.log(client);
    Client.create(client, function clientCreated(err, client) {
      if (err) {
        res.json(err); 
        return;
      }
      for (var i = 0; i < shareholders.length; ++i) {
        shareholder = shareholders[i];
        shareholder.company = client.id;
        ClientShareholder.create(shareholder, function shareholderCreated(err, shareholder) {
          if (err) return next(err);
          if (typeof client.shareholders == "undefined") client.shareholders = [];
          client.shareholders.push(shareholder.id);
        });
      }
      for (var i = 0; i < loans.length; ++i) {
        loan = loans[i];
        loan.loanee = client.id;
        ClientLoan.create(loan, function loanCreated(err, loan) {
          if (err) return next(err);
          if (typeof client.loans == "undefined") client.loans = [];
          client.loans.push(loan.id);
        });
      }
      for (var i = 0; i < bondings.length; ++i) {
        bonding = bondings[i];
        bonding.warrantor = client.id;
        ClientBonding.create(bonding, function bondingCreated(err, bonding) {
          if (err) return next(err);
          if (typeof client.bondings == "undefined") client.bondings = [];
          client.bondings.push(bonding.id);
        });
      }
      client.save(function(err) {
        console.log(client);
        res.json(client);
      })
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ClientController)
   */
  _config: {}

  
};
